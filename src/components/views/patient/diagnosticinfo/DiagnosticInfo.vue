<template lang="html">
  <div class="diagnostic-info-wrapper" ref="diagnosticInfo">
    <folding-panel class="panel" :title="title" :mode="mode" :isCardsPanel="true" :folded-status="foldedStatus"
      v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" v-on:addNewCard="addRecord"
      v-on:updateFilterCondition="changeFilterCondition" :editable="canEdit">
      <card class="card" :class="devideWidth" :mode="mode" v-for="item in patientCaseList" :key="item.caseName"
        :title="item.caseName" :disable-delete="item.archiveStatus===1" v-on:editCurrentCard="seeDetail(item)" v-on:deleteCurrentCard="deleteRecord(item)"
        v-show="passFilter(item)" v-on:viewCurrentCard="seeDetail(item)">
        <div class="text first-line">诊断内容：</div>
        <div class="text second-line">{{getDiagnosticContent(item)}}</div>
        <div class="text third-line">归档情况：
          <span class="third-line-content" :class="{'unarchived': item.archiveStatus===2}">
            {{ getArchiveStatus(item) }}
          </span>
        </div>
      </card>
    </folding-panel>
  </div>
</template>

<script>
import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import Card from 'components/public/card/Card';
import Bus from 'utils/bus.js';
import { deleteDiagnosticInfo } from 'api/patient.js';

export default {
  props: {
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
    title() {
      return '看诊记录（' + this.patientCaseList.length + '条记录）';
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
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
        {fieldName: 'pm_count', cnName: '药物方案'},
        {fieldName: 'psur_count', cnName: '外科手术'},
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
      Bus.$emit(this.UPDATE_COMPLAINTSYMPTOMS_INFO);
    },
    addRecord() {
      this.routerJumpWithCaseId('newCase');
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
  },
  watch: {
    patientCaseList: function() {
      // console.log(this.patientCaseList);
    }
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
            color: @light-font-color;
            &.unarchived {
              color: @button-color;
            }
          }
        }
      }
    }
  }
}
</style>
