<template lang="html">
  <folding-panel :title="'医学量表'" :mode="mutableMode"  v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-scale" ref="diagnosticscale">
      <extensible-panel v-for="type in allScaleTypes" class="panel" :mode="mutableMode" :title="getTypeTitle(type.typeName)"
        v-on:addNewCard="addScale(type.typeCode)" :editable="canEdit" :key="type.typeCode">
        <card class="card" :class="devideWidth" :mode="mutableMode" v-for="item in patientScale"
          v-if="getScaleTypeName(item.scaleInfoId) === type.typeName"
          :key="item.id" :title="getTitle(item.scaleInfoId)" v-on:deleteCurrentCard="deleteScaleRecord(item)"
          v-on:editCurrentCard="editScale(item)" v-on:viewCurrentCard="viewScale(item)">
          <div class="text first-line">
            <span class="name">量表得分:</span>
            <span class="value">
              {{item.scalePoint}}
              <span class="mark">{{getCompleteStatus(item)}}</span>
            </span>
          </div>
          <div class="text second-line">
            <span class="name">填写时间:</span>
            <span class="value">{{item.inspectTime}}</span>
          </div>
          <div class="text third-line">
            <span class="name">末次服药:</span>
            <span class="value">{{item.lastTakingTime}}</span>
          </div>
          <div class="text fourth-line">
            <span class="name">开关状态:</span>
            <span class="value">{{getSwitchType(item.switchType)}}</span>
          </div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { mapGetters } from 'vuex';
import { deleteScaleInfo } from 'api/patient.js';

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      title: '医学量表',
      devideWidth: '',
      scaleId: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    patientScale: {
      type: Array,
      default: () => []
    },
    diagnosisCreator: {
      type: String,
      default: ''
    },
    diagnosticExperimentStep: {
      type: Number,
      default: 0
    },
    patientExperimentStep: {
      type: Number,
      default: 0
    },
    archived: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'allScale',
      'typeGroup'
    ]),
    canEdit() {
      var createByCurrentUser = this.diagnosisCreator === sessionStorage.getItem('userName');
      var isMyPatientsList = this.$route.matched.some(record => record.meta.myPatients);
      var isExperimentPatientsList = this.$route.matched.some(record => {
        return record.meta.therapistsPatients || record.meta.appraisersPatients;
      });
      var duringExperiment = this.diagnosticExperimentStep > 0;
      var diagnosticExperimentStatus = parseInt(this.diagnosticExperimentStep, 10);
      var editableInExperiment = diagnosticExperimentStatus === 2 || diagnosticExperimentStatus === 4;
      var atSameStep = this.diagnosticExperimentStep === this.patientExperimentStep;
      if ((isMyPatientsList || (isExperimentPatientsList && duringExperiment && editableInExperiment)) &&
        atSameStep && createByCurrentUser && !this.archived) {
        return true;
      }
      return false;
    },
    allScaleTypes() {
      var typesInfo = Util.getElement('typegroupcode', 'gaugeType', this.typeGroup);
      return typesInfo.types ? typesInfo.types : [];
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
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticscale.clientWidth;
        var devideNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，250px 是卡片的最小宽度
        while (panelWidth / devideNum > 250 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    },
    getTitle(scaleInfoId) {
      // 通过量表的ID来找到量表的名字
      var targetScale = Util.getElement('scaleInfoId', scaleInfoId, this.allScale);
      return targetScale.gaugeName;
    },
    getTypeTitle(typeName) {
      var count = this.patientScale.filter((scale) => {
        return this.getScaleTypeName(scale.scaleInfoId) === typeName;
      }).length;
      return typeName + ' (' + count + '条记录 )';
    },
    getCompleteStatus(item) {
      var hasComplete = item.unCompleteCount === 0;
      if (!hasComplete) {
        return '未完成';
      } else {
        return '';
      }
    },
    editScale(item) {
      var scaleTypeCode = this.getScaleTypeCode(item.scaleInfoId);
      Bus.$emit(this.SHOW_SCALE_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit, scaleTypeCode);
    },
    viewScale(item) {
      var scaleTypeCode = this.getScaleTypeCode(item.scaleInfoId);
      Bus.$emit(this.SHOW_SCALE_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit, scaleTypeCode);
    },
    addScale(scaleTypeCode) {
      Bus.$emit(this.SHOW_SCALE_MODAL, this.ADD_NEW_CARD, {}, this.canEdit, scaleTypeCode);
    },
    deleteScaleRecord(item) {
      // console.log(item);
      let scaleInfo = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteScaleInfo(scaleInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
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
    getSwitchType(code) {
      code = parseInt(code, 10);
      var info = Util.getElement('typegroupcode', 'switchType', this.typeGroup);
      var types = info.types ? info.types : [];
      var targetOption = Util.getElement('typeCode', code, types);
      return targetOption.typeName ? targetOption.typeName : '';
    },
    getScaleTypeCode(scaleInfoId) {
      var scale = Util.getElement('scaleInfoId', scaleInfoId, this.allScale);
      return scale.gaugeType;
    },
    getScaleTypeName(scaleInfoId) {
      var scale = Util.getElement('scaleInfoId', scaleInfoId, this.allScale);
      return Util.getElement('typeCode', scale.gaugeType, this.allScaleTypes).typeName;
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    this.recalculateCardWidth();
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@scale-card-height: 150px;

.diagnostic-scale {
  position: relative;
  .panel {
    text-align: left;
    .content {
      height: @scale-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    .card {
      height: @scale-card-height;
      display: inline-block;
      margin: @card-vertical-margin @card-horizontal-margin;
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
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
        .name {
          color: @font-color;
        }
        .value {
          padding-left: 10px;
          color: @light-font-color;
          .mark {
            padding-left: 10px;
            color: @button-color;
          }
        }
      }
      .first-line {
        left: 10px;
        top: 50px;
      }
      .second-line {
        left: 10px;
        top: 75px;
      }
      .third-line {
        left: 10px;
        top: 100px;
      }
      .fourth-line {
        left: 10px;
        top: 125px;
      }
    }
  }
}
</style>
