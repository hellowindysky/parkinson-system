<template lang="html">
  <div class="diagnostic-info-wrapper" ref="diagnosticInfo">
    <folding-panel class="panel" :title="title" :mode="mode" :isCardsPanel="true" :folded-status="foldedStatus"
      v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" v-on:addNewCard="addRecord"
      v-on:updateFilterCondition="changeFilterCondition" :editable="canEdit">
      <card class="card" :class="cardClass" :mode="mode" v-for="item in patientCaseList" :key="item.patientCaseId"
        :title="item.caseName" :disable-delete="checkIfDisabledToDelete(item)" v-on:editCurrentCard="seeDetail(item)"
        v-on:deleteCurrentCard="deleteRecord(item)"
        v-show="passFilter(item)" v-on:viewCurrentCard="seeDetail(item)">
        <div class="text first-line">诊断内容</div>
        <div class="text second-line">{{getDiagnosticContent(item)}}</div>
        <div class="text third-line">归档情况
          <span class="third-line-content" :class="{'unarchived': item.archiveStatus===2}">
            {{ getArchiveStatus(item) }}
          </span>
        </div>
        <div class="text fourth-line" v-if="showRecordSource">
          数据来源
          <span class="fourth-line-content">
            {{item.taskCode ? item.taskCode : '门诊'}}
          </span>
        </div>
        <div class="experiment-description">
          {{getExperimentDescription(item)}}
        </div>
      </card>
    </folding-panel>
  </div>
</template>

<script>
import FoldingPanel from 'public/folding-panel/FoldingPanel';
import Card from 'public/card/Card';
import Bus from 'utils/bus.js';
import { deleteDiagnosticInfo } from 'api/patient.js';

export default {
  props: {
    patientInfo: {
      type: Object,
      required: true,
      default: () => {}
    },
    patientCaseList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      mode: this.READING_MODE,
      devideWidth: '',
      filterCondition: this.FILTER_ALL,
      foldedStatus: false
    };
  },
  computed: {
    listType() {
      return this.$store.state.listType;
    },
    inSubject() {
      return this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL;
    },
    hospitalType() {
      return this.$store.state.hospitalType;
    },
    title() {
      return '看诊记录（' + this.patientCaseList.length + '条记录）';
    },
    showRecordSource() {
      return this.$store.state.subjectId === this.SUBJECT_ID_FOR_HOSPITAL && this.listType === this.MY_PATIENTS_TYPE;
    },
    cardClass() {
      return this.showRecordSource ? this.devideWidth + ' tall-card' : this.devideWidth;
    },
    patientCurrentExperimentStep() {
      return this.patientInfo.patientCurrentStatus !== undefined ? Number(this.patientInfo.patientCurrentStatus) : this.EXPERIMENT_STEP_OUT;
    },
    patientCurrentExperimentStage() {
      return this.patientInfo.patientCurrentStage !== undefined ? Number(this.patientInfo.patientCurrentStage) : this.EXPERIMENT_STEP_OUT;
    },
    canEdit() {
      if (this.hospitalType === 2) {
        // 如果是北京医院的实验流程，这里的可编辑状态不受 listType 的影响
        return true;

      } else if ((this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_OUT) && this.listType === this.MY_PATIENTS_TYPE) {
        // 如果患者不处于实验期，只有所属医生在“我的患者”下才能 添加／删除 诊断卡片
        return true;

      } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_FILTERING && this.hospitalType !== -1) {
        // 如果患者处于入组阶段，只有所属医生才能在课题中 添加／删除 诊断卡片
        return true;

      } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_SCREENING && this.listType === this.APPRAISERS_PATIENTS_TYPE) {
        // 如果患者处于基线评估阶段，只有评估者才能 添加／删除 诊断卡片
        return true;

      } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_THERAPY && this.listType === this.THERAPISTS_PATIENTS_TYPE) {
        // 如果患者处于治疗期，只有治疗者才能 添加／删除 诊断卡片
        return true;

      } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_FOLLOW_UP && this.listType === this.APPRAISERS_PATIENTS_TYPE) {
        // 如果患者处于随访期，只有评估者才能 添加／删除 诊断卡片
        return true;

      } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_COMPLETE && this.listType === this.MY_PATIENTS_TYPE) {
        // 如果患者处于实验结束状态，只有所属医生在“我的患者”下才能 添加／删除 诊断卡片
        return true;

      }
      return false;
    }
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
    },
    cancel() {
      this.mode = this.READING_MODE;
    },
    submit() {
      this.mode = this.READING_MODE;
    },
    recalculateCardWidth() {
      var panelWidth = this.$refs.diagnosticInfo.clientWidth;
      panelWidth += 10 * 2;
      var devideNum = 1.0;
      // 10px 是卡片的横向间距，定义在了 varaibles.less 中，260px 是卡片的最小宽度
      while (panelWidth / devideNum > 260 + 10) {
        devideNum += 1.0;
      }
      devideNum -= 1;
      // 一排最多显示 10 个卡片
      devideNum = devideNum <= 10 ? devideNum : 10;
      this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
    },
    getDiagnosticContent(item) {
      var content = '';
      var diagnosticDictionary = [
        {fieldName: 'ps_count', cnName: '病症情况'},
        {fieldName: 'pm_count', cnName: '药物治疗'},
        {fieldName: 'psur_count', cnName: '外科治疗'},
        {fieldName: 'phythe_count', cnName: '物理治疗'},
        {fieldName: 'psc_count', cnName: '医学量表'},
        {fieldName: 'inspect_count', cnName: '检验检查'}
      ];
      for (let field of diagnosticDictionary) {
        if (item[field.fieldName]) {
          content += field.cnName + '[' + item[field.fieldName] + ']' + '   ';
        }
      }
      // 去掉尾部空格
      content = content.trim();
      return content;
    },
    getArchiveStatus(item) {
      if (item.archiveStatus === 1) {
        return '已归档';
      } else if (item.archiveStatus === 2) {
        return '未归档';
      }
    },
    getExperimentDescription(item) {
      if (this.hospitalType === 1) {
        return item.experimentDescription;
      } else if (this.hospitalType === 2) {
        let status = Number(item.status);
        let stage = item.stage;
        if (status === this.EXPERIMENT_STEP_FILTERING) {
          return '筛选入组(V0)';
        } else if (status === this.EXPERIMENT_STEP_SCREENING) {
          return '基线评估(V1)';
        } else if (status === this.EXPERIMENT_STEP_FOLLOW_UP) {
          return '随访(V' + stage + ')';
        } else if (status === this.EXPERIMENT_STEP_COMPLETE) {
          return '实验结束';
        }
      }
      return '';
    },
    changeFilterCondition(filterCondition) {
      this.filterCondition = filterCondition;
    },
    passFilter(item) {
      if (this.filterCondition === this.FILTER_ALL) {
        return true;
      } else if (this.filterCondition === this.FILTER_ARCHIVED) {
        return item.archiveStatus === 1;
      } else if (this.filterCondition === this.FILTER_UNARCHIVED) {
        return item.archiveStatus === 2;
      }
    },
    seeDetail(item) {
      this.routerJumpWithCaseId(item.patientCaseId);
      // Bus.$emit(this.UPDATE_COMPLAINTSYMPTOMS_INFO);
    },
    addRecord() {
      this.routerJumpWithCaseId('newCase');

      if (this.hospitalType === 2 && this.patientCurrentExperimentStep !== this.EXPERIMENT_STEP_OUT) {

        if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_SCREENING ||
          this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_FOLLOW_UP) {

          let nodeText = '';
          let stage = '';

          if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_SCREENING) {
            nodeText = '【基线评估 V1】';
          } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_FOLLOW_UP) {
            stage = this.patientCurrentExperimentStage;
            nodeText = '【随访 V' + stage + '】';
          }
          if (stage !== 7) {
            Bus.$on(this.CONFIRM, () => {
              var info = {
                patientCurrentExperimentStep: this.patientCurrentExperimentStep,
                patientCurrentStage: this.patientInfo.patientCurrentStage
              };
              Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'subjectCirculationModal', this.SHOW_SUBJECT_CIRCULATION_MODAL, this.ADD_NEW_CARD, info, true);
              Bus.$off(this.CONFIRM);
            });

            Bus.$emit(this.REQUEST_CONFIRMATION, '提示', '即将添加的诊断信息是否属于当前节点' + nodeText + '？', '否', '是');

          } else {
            Bus.$emit(this.NOTICE, '提示', '即将在【随访 V7】节点添加诊断信息，如果需要结束实验，请至【课题记录】界面进行操作');
          }

        }
      }
    },
    checkIfDisabledToDelete(item) {
      // 返回值为 true 时，代表该诊断卡片不允许被删除
      if (item.archiveStatus === 1) {
        // 只要该诊断卡片已归档，就不允许被删除
        return true;
      }

      // 判读当前角色是否为患者的所属医生
      var createdByCurrentUser = item.createUser === sessionStorage.getItem('userName');

      var diagnosticExperimentStep = item.status !== undefined ? Number(item.status) : this.EXPERIMENT_STEP_OUT;
      var diagnosticExperimentStage = item.stage !== undefined ? Number(item.stage) : this.EXPERIMENT_STEP_OUT;
      if (this.patientCurrentExperimentStep !== this.EXPERIMENT_STEP_OUT) {
        // console.log(this.patientCurrentExperimentStep, diagnosticExperimentStep, this.patientCurrentExperimentStage, diagnosticExperimentStage);
        // 如果该患者正处在实验期，则只有当患者所处实验阶段和诊断记录的实验阶段相同，
        // 而且该诊断的创建人和当前登录账号一致时，该阶段的特定的角色才能删除该诊断卡片
        if (this.patientCurrentExperimentStep === diagnosticExperimentStep &&
          this.patientCurrentExperimentStage === diagnosticExperimentStage &&
          createdByCurrentUser) {
          if (this.hospitalType === 1) {
            if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_SCREENING &&
              this.listType === this.APPRAISERS_PATIENTS_TYPE) {
              return false;
            } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_THERAPY &&
              this.listType === this.THERAPISTS_PATIENTS_TYPE) {
              return false;
            } else if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_FOLLOW_UP &&
              this.listType === this.APPRAISERS_PATIENTS_TYPE) {
              return false;
            }
          } else if (this.hospitalType === 2) {
            return false;
          }
        } else if (this.patientCurrentExperimentStep === diagnosticExperimentStep && this.patientCurrentExperimentStep === 10 && createdByCurrentUser) {
          // 如果该患者处于筛选期入组阶段 则该诊断创建人可以删除该诊断卡片
          return false;
        }
        if (this.patientCurrentExperimentStep === this.EXPERIMENT_STEP_COMPLETE &&
          diagnosticExperimentStep === this.EXPERIMENT_STEP_OUT &&
          this.listType === this.MY_PATIENTS_TYPE) {
          // 如果患者处于实验结束阶段，那么非实验期间添加的诊断记录，其所属医生是可以在“我的患者”下进行删除操作的
          return false;
        }
        return true;

      } else {
        // 如果该患者不处于实验期，只有所属医生在“我的患者”里面可以对非实验期添加的卡片进行删除
        if (diagnosticExperimentStep === this.EXPERIMENT_STEP_OUT && this.listType === this.MY_PATIENTS_TYPE) {
          return false;
        }
        // 如果该患者处于排除阶段时入组诊断也可以删除
        // 此处存在问题 在患者处于入组或者排除阶段 queryPatientCaseList 返回的 status 始终为10 无法区分诊断创建阶段
        // 同时在入组阶段创建的诊断 手动将患者排除后 诊断状态会被处理成排除阶段创建
        if (this.hospitalType !== -1 && diagnosticExperimentStep === 10) {
          return false;
        }
        return true;
      }
    },
    routerJumpWithCaseId(caseId) {
      var routeName = '';
      if (this.listType === this.MY_PATIENTS_TYPE) {
        routeName = 'diagnosticDetail';
      } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
        routeName = 'otherDiagnosticDetail';
      } else if (this.listType === this.SUBJECT_PATIENTS_TYPE) {
        routeName = 'subjectDiagnosticDetail';
      } else if (this.listType === this.THERAPISTS_PATIENTS_TYPE) {
        routeName = 'therapistsPatientsDiagnosticDetail';
      } else if (this.listType === this.APPRAISERS_PATIENTS_TYPE) {
        routeName = 'appraisersPatientsDiagnosticDetail';
      }
      this.$router.push({
        name: routeName,
        params: {
          'caseId': caseId
        }
      });
    },
    deleteRecord(item) {
      Bus.$on(this.CONFIRM, () => {
        deleteDiagnosticInfo({
          'patientCaseId': item.patientCaseId
        }).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    }
  },
  components: {
    FoldingPanel,
    Card
  },
  mounted() {
    // 如果收到 [确认对话框] 发过来的 “取消” 事件，则解除 “确认” 事件的回调函数
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });
    // 如果收到屏幕宽度变化，或者内容区域宽度变化的事件，则重新计算卡片的宽度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@this-card-horizontal-margin: 5px;

.diagnostic-info-wrapper {
  background-color: @screen-color;
  .panel {
    text-align: left;
    margin-bottom: 5px;
    .content {
      // 下面几行为了覆盖 FoldingPanel 子组件内的 content 样式，注意父组件的 style 标签不能加 scoped
      margin: 0 -@this-card-horizontal-margin;
      padding: 3px 0 !important;
      background-color: @screen-color;
      &.folded {
        padding: 0 !important;
      }
    }
    .card {
      display: inline-block;
      margin: 3px @this-card-horizontal-margin;
      height: 130px;
      background-color: @background-color;
      &:hover {
        box-shadow: 0 0 5px @gray-color;
      }
      &:active {
        box-shadow: 0 0 5px @light-gray-color;
      }
      &.tall-card {
        height: 150px;
      }
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{this-card-horizontal-margin} * 2");
      }
      .title {
        left: 20px;
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        &.first-line {
          left: 20px;
          top: 45px;
          right: 20px;
          color: @font-color;
        }
        &.second-line {
          left: 20px;
          top: 65px;
          right: 20px;
          line-height: 16px;
          color: @light-font-color;
          white-space: pre-wrap;
        }
        &.third-line {
          left: 20px;
          top: 100px;
          right: 20px;
          .third-line-content {
            margin-left: 10px;
            color: @light-font-color;
            &.unarchived {
              color: @button-color;
            }
          }
        }
        &.fourth-line {
          left: 20px;
          top: 125px;
          right: 20px;
          .fourth-line-content {
            margin-left: 10px;
            color: @light-font-color;
          }
        }
      }
      .experiment-description {
        position: absolute;
        right: 35px;
        top: 15px;
        font-size: @normal-font-size;
        font-weight: bold;
        color: @theme-color;
      }
    }
  }
}
</style>
