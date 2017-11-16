<template lang="html">
  <folding-panel :title="'外科手术'" :archived="archived" :mode="mutableMode"  v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-surgery" ref="diagnosticSurgery">
      <extensible-panel class="panel pre-evaluation-panel" :mode="mutableMode"
        :title="preEvaluationTitle" v-on:addNewCard="addPreEvaluationRecord" :editable="canEdit">
        <card class="card pre-evaluation-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="item in preEvaluationList" :key="item.preopsInfoId"
          :title="''" v-on:editCurrentCard="editPreEvaluationRecord(item)"
          v-on:viewCurrentCard="viewPreEvaluationRecord(item)"
          v-on:deleteCurrentCard="deletePreEvaluationRecord(item)">
          <div class="text line-1">
            <span class="name">剂末现象: </span>
            <span class="value">{{item.terminalDesc}}</span>
          </div>
          <div class="text line-2">
            <span class="name">患者日记: </span>
            <span class="value">{{item.diaryDesc}}</span>
          </div>
          <div class="text line-3">
            <span class="name">统一异动症评估: </span>
            <span class="value">{{item.dyskinesiaDesc}}</span>
          </div>
          <div class="text line-4">
            <span class="name">非运动症状评估: </span>
            <span class="value">{{item.nonMotorDesc}}</span>
          </div>
          <div class="text line-5">
            <span class="name">运动症状评估: </span>
            <span class="value">{{item.motorDesc}}</span>
          </div>
          <div class="text line-6">
            <span class="name">患者手术意愿: </span>
            <span class="value">{{item.intensionDesc}}</span>
          </div>
          <div class="text line-7">
            <span class="name">评估时间: </span>
            <span class="value">{{item.preopsTime}}</span>
          </div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="surgicalMethodTitle"
        v-on:addNewCard="addSurgicalRecord" :editable="canEdit">
        <card class="card" :class="smallCardWidth" :mode="mutableMode" v-for="item in surgicalMethodList" :key="item.patientCaseId"
          :title="transformSurgicalType(item.surgicalInfoId)" v-on:editCurrentCard="editSurgicalRecord(item)"
          v-on:deleteCurrentCard="deleteSurgicalRecord(item)" v-on:viewCurrentCard="viewSurgicalRecord(item)">
          <div class="text first-line single-line-ellipsis">
            <span class="name">备注: </span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text second-line">
            {{item.surgicalDate}}
          </div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel post-complication-panel" :mode="mutableMode"
        :title="postComplicationTitle" v-on:addNewCard="addPostComplicationRecord" :editable="canEdit">
        <card class="card post-complication-card" :class="smallCardWidth" :mode="mutableMode" v-for="item in postComplicationList" :key="item.patientCaseId"
         :title="transformComplicationType(item.minorComplicationType)" v-on:editCurrentCard="editPostComplicationRecord(item)"
         v-on:deleteCurrentCard="deletePostComplicationRecord(item)" v-on:viewCurrentCard="viewPostComplicationRecord(item)">
          <div class="text first-line">
            <span class="name">处理: </span>
            <span class="value">{{transformTypeGroupId(item.treatment, 'treatment')}}</span>
          </div>
          <div class="text second-line single-line-ellipsis">
            <span class="name">备注: </span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text third-line">{{item.occurrenceTime}}</div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel dbs-panel" :mode="mutableMode" :title="dbsTitle"
        v-on:addNewCard="addDbsRecord" :editable="canEdit">
        <card class="card dbs-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="item in dbsFirstList" :key="item.patientDbsFirstId"
          :title="''" v-on:editCurrentCard="editDbsRecord(item)"
          v-on:deleteCurrentCard="deleteDbsRecord(item)" v-on:viewCurrentCard="viewDbsRecord(item)">
          <div class="text line-1">
            <span class="name">首次开机: </span>
            <span class="value">{{item.dbsTimes}}</span>
          </div>
          <div class="text line-2">
            <span class="name">服药情况: </span>
            <span class="value">{{item.medicationStatus}}</span>
          </div>
          <div class="text line-3">
            <span class="name">微毁损效应: </span>
            <span class="value">{{item.damageEffect}}</span>
          </div>
          <div class="text line-4">
            <span class="name">术后不良事件: </span>
            <span class="value">{{item.adverseEvents}}</span>
          </div>
          <div class="text line-5">
            <span class="name">开机参数: </span>
            <span class="value">{{item.dbsParam}}</span>
          </div>
          <div class="text line-6 single-line-ellipsis">
            <span class="name">备注: </span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text line-7">
            <span class="name">记录时间: </span>
            <span class="value">{{item.programDate}}</span>
          </div>
        </card>
        <card class="card dbs-card" :class="bigCardWidth" :mode="mutableMode" v-for="item in dbsFollowList" :key="item.patientDbsFollowId"
         :title="''" v-on:editCurrentCard="editDbsRecord(item)" v-on:viewCurrentCard="viewDbsRecord(item)"
         v-on:deleteCurrentCard="deleteDbsRecord(item)">
          <div class="text line-1">
            <span class="name">首次开机: </span>
            <span class="value">{{item.dbsTimes}}</span>
          </div>
          <div class="text line-2">
            <span class="name">服药情况: </span>
            <span class="value">{{item.medicationStatus}}</span>
          </div>
          <div class="text line-3">
            <span class="name">患者主诉: </span>
            <span class="value">{{item.complaint}}</span>
          </div>
          <div class="text line-4">
            <span class="name">效果及副作用: </span>
            <span class="value">{{item.effectInfo}}</span>
          </div>
          <div class="text line-5">
            <span class="name">开机参数: </span>
            <span class="value">{{item.dbsParam}}</span>
          </div>
          <div class="text line-6 single-line-ellipsis">
            <span class="name">备注: </span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text line-7">
            <span class="name">记录时间: </span>
            <span class="value">{{item.programDate}}</span>
          </div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import {
  deletePreEvaluation,
  deleteSurgicalMethod,
  deleteOperativeCompliation,
  deleteDbsFirstInfo,
  deleteDbsFollowInfo } from 'api/patient.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      smallCardWidth: '',
      bigCardWidth: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    diagnosticSurgery: {
      type: Object,
      default: () => {
        return {};
      }
    },
    archived: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'surgicalTypeList',
      'complicationTypeList',
      'typeGroup'
    ]),
    preEvaluationTitle() {
      return '术前评估（' + this.preEvaluationList.length + '条记录）';
    },
    surgicalMethodTitle() {
      return '手术方案（' + this.surgicalMethodList.length + '条记录）';
    },
    postComplicationTitle() {
      return '术后并发症（' + this.postComplicationList.length + '条记录）';
    },
    dbsTitle() {
      var amount = this.dbsFirstList.length + this.dbsFollowList.length;
      return '程控记录（' + amount + '条记录）';
    },
    preEvaluationList() {
      return this.diagnosticSurgery.patientPreopsList ? this.diagnosticSurgery.patientPreopsList : [];
    },
    surgicalMethodList() {
      return this.diagnosticSurgery.patientTreatmentList ? this.diagnosticSurgery.patientTreatmentList : [];
    },
    postComplicationList() {
      return this.diagnosticSurgery.patientComplicationList ? this.diagnosticSurgery.patientComplicationList : [];
    },
    dbsFirstList() {
      return this.diagnosticSurgery.patientDbsFirstList ? this.diagnosticSurgery.patientDbsFirstList : [];
    },
    dbsFollowList() {
      return this.diagnosticSurgery.patientDbsFollowList ? this.diagnosticSurgery.patientDbsFollowList : [];
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.archived) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
    },
    transformSurgicalType(typeId) {
      // 在 tableData 中找到对应的值
      // 下面的 surgica 拼写掉了一个 l，是数据库的拼写错误，这里只能将错就错
      var surgicalData = Util.getElement('id', typeId, this.surgicalTypeList);
      var surgicalName = surgicalData.surgicaName ? surgicalData.surgicaName : '';
      return surgicalName;
    },
    transformComplicationType(typeId) {
      // 在 tableData 中找到对应的值
      var complicationData = Util.getElement('id', typeId, this.complicationTypeList);
      var complicationName = complicationData.minorComplicationName ? complicationData.minorComplicationName : '';
      return complicationName;
    },
    transformTypeGroupId(typeId, fieldName) {
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types === undefined ? [] : types;
      var typeName = Util.getElement('typeCode', typeId, types).typeName;
      return typeName === undefined ? '' : typeName;
    },
    addPreEvaluationRecord() {
      // 这里要传递 2 个参数，一个是模式（新增／阅读／修改），一个是当前数据对象（新建的时候为空）
      Bus.$emit(this.SHOW_PRE_EVALUATION_MODAL, this.ADD_NEW_CARD, {}, this.archived);
    },
    viewPreEvaluationRecord(item) {
      Bus.$emit(this.SHOW_PRE_EVALUATION_MODAL, this.VIEW_CURRENT_CARD, item, this.archived);
    },
    editPreEvaluationRecord(item) {
      Bus.$emit(this.SHOW_PRE_EVALUATION_MODAL, this.EDIT_CURRENT_CARD, item, this.archived);
    },
    deletePreEvaluationRecord(item) {
      var preEvaluation = {
        'preopsInfoId': item.preopsInfoId
      };
      Bus.$on(this.CONFIRM, () => {
        deletePreEvaluation(preEvaluation).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addSurgicalRecord() {
      // 这里要传递 2 个参数，一个是模式（新增／阅读／修改），一个是当前数据对象（新建的时候为空）
      Bus.$emit(this.SHOW_SURGICAL_METHOD_MODAL, this.ADD_NEW_CARD, {}, this.archived);
    },
    viewSurgicalRecord(item) {
      Bus.$emit(this.SHOW_SURGICAL_METHOD_MODAL, this.VIEW_CURRENT_CARD, item, this.archived);
    },
    editSurgicalRecord(item) {
      Bus.$emit(this.SHOW_SURGICAL_METHOD_MODAL, this.EDIT_CURRENT_CARD, item, this.archived);
    },
    deleteSurgicalRecord(item) {
      var surgicalMethod = {
        'patientTreatmentId': item.patientTreatmentId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteSurgicalMethod(surgicalMethod).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addPostComplicationRecord() {
      // 这里要传递 2 个参数，一个是模式（新增／阅读／修改），一个是当前数据对象（新建的时候为空）
      Bus.$emit(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.ADD_NEW_CARD, {}, this.archived);
    },
    viewPostComplicationRecord(item) {
      Bus.$emit(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.VIEW_CURRENT_CARD, item, this.archived);
    },
    editPostComplicationRecord(item) {
      Bus.$emit(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.EDIT_CURRENT_CARD, item, this.archived);
    },
    deletePostComplicationRecord(item) {
      var operativeComplication = {
        'patientComplicationId': item.patientComplicationId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteOperativeCompliation(operativeComplication).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addDbsRecord() {
      // 这里要传递 2 个参数，一个是模式（新增／阅读／修改），一个是当前数据对象（新建的时候为空）
      Bus.$emit(this.SHOW_DBS_MODAL, this.ADD_NEW_CARD, {}, this.archived);
    },
    viewDbsRecord(item) {
      Bus.$emit(this.SHOW_DBS_MODAL, this.VIEW_CURRENT_CARD, item, this.archived);
    },
    editDbsRecord(item) {
      Bus.$emit(this.SHOW_DBS_MODAL, this.EDIT_CURRENT_CARD, item, this.archived);
    },
    deleteDbsRecord(item) {
      // 先判断这条程控记录是首次还是非首次，从而决定调用哪个 api
      if (item.patientDbsFirstId) {
        let dbsFirstInfo = {
          'patientDbsFirstId': item.patientDbsFirstId
        };
        Bus.$on(this.CONFIRM, () => {
          deleteDbsFirstInfo(dbsFirstInfo).then(this._resolveDeletion, this._rejectDeletion);
        });

      } else if (item.patientDbsFollowId) {
        let dbsFollowInfo = {
          'patientDbsFollowId': item.patientDbsFollowId
        };
        Bus.$on(this.CONFIRM, () => {
          deleteDbsFollowInfo(dbsFollowInfo).then(this._resolveDeletion, this._rejectDeletion);
        });
      } else {
        return;
      }
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticSurgery.clientWidth;
        var smallCardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (smallCardNum + 1) > 200 + 20 && smallCardNum < 10) {
          smallCardNum += 1.0;
        }
        this.smallCardWidth = 'width-1-' + parseInt(smallCardNum, 10);

        var bigCardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，350px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (bigCardNum + 1) > 350 + 20 && bigCardNum < 10) {
          bigCardNum += 1.0;
        }
        this.bigCardWidth = 'width-1-' + parseInt(bigCardNum, 10);
      });
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
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
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();

    setTimeout(() => {
      // console.log(this.diagnosticSurgery);
    }, 2000);
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@pre-evaluation-card-height: 185px;
@post-complication-card-height: 120px;
@dbs-card-height: 185px;

.diagnostic-surgery {
  .panel {
    text-align: left;
    &.pre-evaluation-panel .content {
      height: @pre-evaluation-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    &.dbs-panel .content {
      height: @dbs-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    &.post-complication-panel .content {
      height: @post-complication-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    .card {
      display: inline-block;
      position: relative;
      margin: @card-vertical-margin @card-horizontal-margin;
      // min-width: 200px;
      // max-width: 250px;
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{card-horizontal-margin} * 2");
      }
      &.pre-evaluation-card {
        height: @pre-evaluation-card-height;
      }
      &.dbs-card {
        height: @dbs-card-height;
      }
      &.post-complication-card {
        height: @post-complication-card-height;
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
        left: 10px;
        right: 10px;
        &.single-line-ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
        }
        .name {
          color: @font-color;
        }
        .value {
          padding-left: 10px;
          color: @light-font-color;
        }
      }
      .first-line {
        top: 50px;
      }
      .second-line {
        top: 75px;
      }
      .third-line {
        top: 100px;
      }
      .line-1 {
        top: 10px;
      }
      .line-2 {
        top: 35px;
      }
      .line-3 {
        top: 60px;
      }
      .line-4 {
        top: 85px;
      }
      .line-5 {
        top: 110px;
      }
      .line-6 {
        top: 135px;
      }
      .line-7 {
        top: 160px;
      }
    }
  }
}
</style>
