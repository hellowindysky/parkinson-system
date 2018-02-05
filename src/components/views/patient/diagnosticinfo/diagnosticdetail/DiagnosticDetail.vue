<template lang="html">
  <div class="diagnostic-detail-wrapper" :class="{'slide-outside':!displayDetail}">
    <div class="title-bar">
      <h2 class="title">{{title}}</h2>
      <div class="button back-button" @click="goBack" v-show="!isNewCase">返回</div>
      <div class="button archive-button" :class="{'disabled': !existed}" @click="archiveCase"
        v-if="!isNewCase && canEdit && !patientDuringExperiment">归档</div>
    </div>
    <div class="scroll-area" ref="scrollArea">
      <diagnostic-basic :canEdit="canEdit" class="folding-panel" :mode="mode" ref="diagnosticBasic"
        :diagnosticBasic="diagnosticBasic"
        :diagnosisCreator="diagnosisCreator">
      </diagnostic-basic>
      <diagnostic-disease :canEdit="canEdit" class="folding-panel" :mode="mode" v-show="existed"
        :diagnosticDisease="diagnosticDisease"
        :diagnosticChiefComplaint="caseDetail.patientSymptom"
        :diagnosisCreator="diagnosisCreator">
      </diagnostic-disease>
      <diagnostic-treatment :canEdit="canEdit" class="folding-panel" :mode="mode" v-show="existed"
        :diagnosticSurgery="caseDetail.patientSurgicalDbs"
        :diagnosticMedicine="caseDetail.patientMedicineNew"
        :diagnosticPhysiontherapy="caseDetail.patientPhytheTms"
        :diagnosticTreatmentEvaluation="caseDetail.patientPhytheAssess"
        :diagnosticAdverseEvent="caseDetail.patientAdverse"
        :diagnosticExperimentStep="diagnosticExperimentStep"
        :patientExperimentStep="patientExperimentStep"
        :diagnosisCreator="diagnosisCreator">
      </diagnostic-treatment>
      <diagnostic-scale :canEdit="canEdit" class="folding-panel" :mode="mode" v-show="existed"
        :patientScale="caseDetail.patientScale"
        :diagnosticExperimentStep="diagnosticExperimentStep"
        :patientExperimentStep="patientExperimentStep"
        :diagnosisCreator="diagnosisCreator">
      </diagnostic-scale>
      <diagnostic-examination :canEdit="canEdit" class="folding-panel" :mode="mode" v-show="existed"
        :patientInfo="patientInfo"
        :neurologicCheckList="caseDetail.patientSpephysical"
        :geneCheckList="caseDetail.patientGene"
        :biochemicalExamList="caseDetail.patientBioexam"
        :emgList="caseDetail.patientElecTroGram"
        :sleepMonitoringList="caseDetail.patientNerveSleep"
        :electricImagingList="caseDetail.patientElecVideoList"
        :medicalImagingList="caseDetail.patientVideoList"
        :diagnosticVitalSigns="caseDetail.patientVitalSign"
        :diagnosisCreator="diagnosisCreator">
      </diagnostic-examination>
      <!-- 空白区域是为了让最后的内容能够滚动到脱离屏幕最下方 -->
      <div class="blank-area"></div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getPatientCase, archivePatientCase } from 'api/patient.js';

import DiagnosticBasic from 'patient/diagnosticinfo/diagnosticbasic/DiagnosticBasic';
import DiagnosticDisease from 'patient/diagnosticinfo/diagnosticdisease/DiagnosticDisease';
import DiagnosticTreatment from 'patient/diagnosticinfo/diagnostictreatment/DiagnosticTreatment';
import DiagnosticScale from 'patient/diagnosticinfo/diagnosticscale/DiagnosticScale';
import DiagnosticExamination from 'patient/diagnosticinfo/diagnosticexamination/DiagnosticExamination';

export default {
  props: {
    patientInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      displayDetail: false,
      caseId: 0,
      caseDetail: {},
      mode: this.READING_MODE,
      hasBeenArchived: true,
      existed: true  // 用来标记当前诊断信息是否存在，新增诊断时该变量为 false
    };
  },
  computed: {
    title() {
      return this.existed === true ? this.caseDetail.caseName : '新增诊断信息';
    },
    listType() {
      return this.$store.state.listType;
    },
    isNewCase() {
      if (this.$route.params.caseId && this.$route.params.caseId === 'newCase') {
        return true;
      } else {
        return false;
      }
    },
    diagnosticBasic() {
      var obj = {};
      var propertyList = ['caseType', 'diagTime', 'taskCode', 'taskName', 'createUser',
        'status', 'remarks'];
      for (let propertyName of propertyList) {
        obj[propertyName] = this.caseDetail[propertyName] ? this.caseDetail[propertyName] : '';
      }
      return obj;
    },
    diagnosticDisease() {
      var obj = {};
      var propertyList = ['diseaseType', 'caseSymptom', 'diagnoseState', 'specificDisease'];
      for (let propertyName of propertyList) {
        obj[propertyName] = this.caseDetail[propertyName] ? this.caseDetail[propertyName] : '';
      }
      return obj;
    },
    diagnosisCreator() {
      return this.caseDetail.createUserName ? this.caseDetail.createUserName : '';
    },
    diagnosticExperimentStep() {
      var status = parseInt(this.caseDetail.status, 10);  // 实验阶段 (从 2 开始)
      var stage = parseInt(this.caseDetail.stage, 10);  // 实验阶段的子阶段 (从 0 开始)
      if (status > 0 && stage >= 0) {
        return status + stage / 10.0;
      } else {
        return 0;
      }
    },
    patientExperimentStep() {
      var status = parseInt(this.caseDetail.patientCurrentStatus, 10);  // 实验阶段 (从 2 开始)
      var stage = parseInt(this.caseDetail.patientCurrentStage, 10);  // 实验阶段的子阶段 (从 0 开始)
      if (status > 0 && stage >= 0) {
        return status + stage / 10.0;
      } else {
        return 0;
      }
    },
    patientDuringExperiment() {
      var patientCurrentExperimentStatus = parseInt(this.patientExperimentStep, 10);
      return [this.EXPERIMENT_STEP_SCREENING, this.EXPERIMENT_STEP_THERAPY,
        this.EXPERIMENT_STEP_FOLLOW_UP].indexOf(patientCurrentExperimentStatus) >= 0;
    },
    canEdit() {
      var createdByCurrentUser = this.diagnosisCreator === sessionStorage.getItem('userName');
      var isExperimentPatientsList = this.listType === this.THERAPISTS_PATIENTS_TYPE || this.listType === this.APPRAISERS_PATIENTS_TYPE;

      var diagnosticExperimentStatus = parseInt(this.diagnosticExperimentStep, 10);
      var patientCurrentExperimentStatus = parseInt(this.patientExperimentStep, 10);

      // 以下条件要控制，诊断添加时的实验阶段，和病人当前所处的实验阶段，要相一致。
      // 唯一的例外情况是，病人处于实验结束阶段时，诊断卡片如果是实验之外（0）添加的，也是可以编辑的
      var atSameStep = this.diagnosticExperimentStep === this.patientExperimentStep ||
        (diagnosticExperimentStatus === 0 && patientCurrentExperimentStatus === this.EXPERIMENT_STEP_COMPLETE);

      // 只有当患者在非实验状态下时，所属医生才可以编辑其在非实验状态下添加的诊断记录
      var canEditInMyPatientsList = this.listType === this.MY_PATIENTS_TYPE && !this.patientDuringExperiment;

      // 只有当患者在实验状态下时，特定参与者（评估者和治疗者）才可以编辑特定阶段添加的诊断记录
      var canEditInTherapistsList = this.listType === this.THERAPISTS_PATIENTS_TYPE &&
        diagnosticExperimentStatus === this.EXPERIMENT_STEP_THERAPY;
      var canEditInAppraisersList = this.listType === this.APPRAISERS_PATIENTS_TYPE &&
        (diagnosticExperimentStatus === this.EXPERIMENT_STEP_SCREENING ||
        diagnosticExperimentStatus === this.EXPERIMENT_STEP_FOLLOW_UP);

      var caseId = this.$route.params.caseId;
      if (caseId === 'newCase') {
        return true;

      } else if (caseId === undefined || this.hasBeenArchived) {
        return false;

      } else if (isExperimentPatientsList && !createdByCurrentUser) {
        // 如果当前处于“评估者”和“诊断者”的患者列表，则需要检查该诊断记录是否是由当前登录用户创建的，不是则不允许编辑
        // 为什么要限定是以上两个列表，而不限制“我的患者”列表呢？
        // 因为“我的患者”中，存在录入员这个角色，他们和医生是能够互相编辑对方创建的诊断卡片的
        return false;

      } else if ((canEditInMyPatientsList || canEditInTherapistsList || canEditInAppraisersList) && atSameStep) {
        return true;

      } else {
        return false;
      }
    }
  },
  methods: {
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    checkRoute() {
      var path = this.$route.path;

      var regMyPatientsWithoutCase = new RegExp(/^\/patients\/list\/[0-9]+\/diagnosticInfo\/?$/);
      var regOtherPatientsWithoutCase = new RegExp(/^\/patients\/otherList\/[0-9]+\/diagnosticInfo\/?$/);
      var regSubjectPatientsWithoutCase = new RegExp(/^\/patients\/subjectList\/[0-9]+\/diagnosticInfo\/?$/);
      var regTherapistsPatientsWithoutCase = new RegExp(/^\/patients\/therapistsPatientList\/[0-9]+\/diagnosticInfo\/?$/);
      var regAppraisersPatientsWithoutCase = new RegExp(/^\/patients\/appraisersPatientList\/[0-9]+\/diagnosticInfo\/?$/);

      var regMyPatientsWithCase = new RegExp(/^\/patients\/list\/[0-9]+\/diagnosticInfo\/[0-9a-zA-Z]+$/);
      var regOtherPatientsWithCase = new RegExp(/^\/patients\/otherList\/[0-9]+\/diagnosticInfo\/[0-9a-zA-Z]+$/);
      var regSubjectPatientsWithCase = new RegExp(/^\/patients\/subjectList\/[0-9]+\/diagnosticInfo\/[0-9a-zA-Z]+$/);
      var regTherapistsPatientsWithCase = new RegExp(/^\/patients\/therapistsPatientList\/[0-9]+\/diagnosticInfo\/[0-9a-zA-Z]+$/);
      var regAppraisersPatientsWithCase = new RegExp(/^\/patients\/appraisersPatientList\/[0-9]+\/diagnosticInfo\/[0-9a-zA-Z]+$/);

      if (regMyPatientsWithoutCase.test(path) ||
        regOtherPatientsWithoutCase.test(path) ||
        regSubjectPatientsWithoutCase.test(path) ||
        regTherapistsPatientsWithoutCase.test(path) ||
        regAppraisersPatientsWithoutCase.test(path)) {
        // 一旦发现路由地址中还没有 caseId，则不显示诊断详情面板
        this.closePanel();
      } else if (regMyPatientsWithCase.test(path) ||
        regOtherPatientsWithCase.test(path) ||
        regSubjectPatientsWithCase.test(path) ||
        regTherapistsPatientsWithCase.test(path) ||
        regAppraisersPatientsWithCase.test(path)) {
        // 如果路由地址中有 caseId，则显示面板并获取对应的诊断数据
        this.caseId = this.$route.params.caseId;
        this.showDetailPanel();
      } else {
        this.closePanel();
      }
    },
    showDetailPanel() {
      // 接收到相应的消息之后，打开诊断详情窗口，然后再向服务器请求数据
      this.updatePatientCase();
      this.displayDetail = true;
      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
      });
    },
    updatePatientCase() {
      // this.caseId 这里有两种情况，一种是正常的诊断 id，
      // 另一种是新建诊断信息时，路由中读取到的 caseId 为'newCase'字符串(定义在了route/index.js中)
      if (this.caseId === 'newCase') {
        this.existed = false;
        this.caseDetail = {};
        this.$refs.diagnosticBasic.$emit(this.EDIT);
      } else {
        var patientId = this.$route.params.id;
        getPatientCase(patientId, this.caseId).then((data) => {
          this.existed = true;
          this.caseDetail = Object.assign({}, data.patientCase);
          this.mode = this.READING_MODE;
          if (data.patientCase.archiveStatus === 1) {
            this.hasBeenArchived = true;
          } else if (data.patientCase.archiveStatus === 2) {
            this.hasBeenArchived = false;
          }
        }, (error) => {
          console.log(error);
          this.hasBeenArchived = true;
        });
      }
      this.updateScrollbar();
    },
    goBack() {
      // 按下返回按钮，实际上是修改的路由地址 ———— 因为我们是监控路由地址来决定这个详情窗口是否显示的
      if (this.listType === this.MY_PATIENTS_TYPE) {
        this.$router.push({name: 'diagnosticInfo'});
      } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
        this.$router.push({name: 'otherDiagnosticInfo'});
      } else if (this.listType === this.SUBJECT_PATIENTS_TYPE) {
        this.$router.push({name: 'subjectDiagnosticInfo'});
      } else if (this.listType === this.THERAPISTS_PATIENTS_TYPE) {
        this.$router.push({name: 'therapistsPatientsDiagnosticInfo'});
      } else if (this.listType === this.APPRAISERS_PATIENTS_TYPE) {
        this.$router.push({name: 'appraisersPatientsDiagnosticInfo'});
      }

      // 同时，告诉它的子页面，放弃当前修改
      Bus.$emit(this.QUIT_DIAGNOSTIC_DETAIL);
      Bus.$emit(this.UPDATE_PATIENT_CASE_LIST);
    },
    closePanel() {
      this.displayDetail = false;
      this.caseDetail = {};
    },
    archiveCase() {
      Bus.$on(this.CONFIRM, () => {
        archivePatientCase(this.$route.params.caseId).then(() => {
          this.$message({
            message: '归档成功',
            type: 'success',
            duration: 2000
          });
          this.hasBeenArchived = true;
          Bus.$off(this.CONFIRM);
          // 通知“诊断信息”下的卡片列表进行更新
          Bus.$emit(this.UPDATE_PATIENT_CASE_LIST);
        }, (error) => {
          console.log(error);
          var message = '归档失败，请稍后再试';
          if (error.code === 2005) {
            message = '归档前请完成所有的量表题目';
          }
          this.$message({
            message: message,
            type: 'error',
            duration: 2000
          });
          Bus.$off(this.CONFIRM);
        });
      });

      Bus.$on(this.GIVE_UP, () => {
        Bus.$off(this.CONFIRM);
      });

      Bus.$emit(this.REQUEST_CONFIRMATION, '', '诊断记录归档后将无法编辑修改，是否继续？');
    }
  },
  components: {
    DiagnosticBasic,
    DiagnosticDisease,
    DiagnosticTreatment,
    DiagnosticScale,
    DiagnosticExamination
  },
  mounted() {
    this.checkRoute();
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.UPDATE_CASE_INFO, this.updatePatientCase);
  },
  beforeDestroy() {
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
    Bus.$off(this.UPDATE_CASE_INFO);
    Bus.$off(this.GIVE_UP);
    Bus.$off(this.CONFIRM);
  },
  watch: {
    '$route.path'() {
      this.checkRoute();
    },
    displayDetail: function() {
      Bus.$emit(this.RECALCULATE_CARD_WIDTH);
    },
    existed() {
      // 因为 existed 这个变量变化时会导致几个子面板的 显示／隐藏，所以需要它们重新计算各自内部的卡片宽度
      Bus.$emit(this.RECALCULATE_CARD_WIDTH);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@title-bar-height: 40px;
@title-bar-margin-bottom: 10px;
@margin-right: 15px;

.diagnostic-detail-wrapper {
  background-color: @screen-color;
  transition: 0.5s linear;
  &.slide-outside {
    transform: translate3d(100%, 0, 0);
  }
  .title-bar {
    position: relative;
    height: @title-bar-height;
    margin-right: @margin-right;
    margin-bottom: 5px;
    background-color: @background-color;
    .title {
      margin: 0;
      position: absolute;
      display: inline-block;
      padding-left: 20px;
      left: 0;
      width: 100%;
      height: @title-bar-height;
      line-height: @title-bar-height;
      text-align: left;
      font-size: @large-font-size;
      color: @font-color;
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      color: #fff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.back-button {
        background-color: @secondary-button-color;
        right: 10px;
      }
      &.archive-button {
        background-color: @font-color;
        right: 30px + @small-button-width;
        &.disabled {
          background-color: @light-gray-color;
          &:hover, &:active {
            opacity: 1;
          }
        }
      }
    }
  }
  .scroll-area {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{title-bar-height} - @{title-bar-margin-bottom}");
    overflow: hidden;
    .folding-panel {
      margin-right: @margin-right;
      margin-bottom: @vertical-spacing;
    }
    .blank-area {
      height: 300px;
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
      padding: 0 3px;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s, padding 0.2s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.6;
        &:hover {
          padding: 0;
        }
      }
    }
  }
}
</style>
