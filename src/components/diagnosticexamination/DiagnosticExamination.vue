<template lang="html">
  <folding-panel :title="'检验检查'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-examination" ref="diagnosticExamination">
      <extensible-panel class="panel" :mode="mutableMode" :title="neurologicCheckTitle" v-on:addNewCard="addNeurologicCheckRecord">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in neurologicCheckList" :key="item.preopsInfoId"
         :title="transformNeurologicCheckType(item.spephysicalInfo)" v-on:clickCurrentCard="editNeurologicCheckRecord(item)"
         v-on:deleteCurrentCard="deleteNeurologicCheckRecord(item)">
          <div class="text first-line">
            <span class="name">诊断结果: </span>
            <span class="value">{{item.spephysicalResult}}</span>
          </div>
          <div class="text second-line">
            {{item.ariseTime}}
          </div>
         </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="biochemicalExamTitle" v-on:addNewCard="addBiochemicalExamRecord">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in biochemicalExamList" :key="item.patientCaseId"
         :title="transformBiochemicalExamType(item.bioexamId)" v-on:clickCurrentCard="editBiochemicalExamRecord(item)"
         v-on:deleteCurrentCard="deleteBiochemicalExamRecord(item)">
          <div class="text first-line">
            <span class="name"></span>
            <span class="value"></span>
          </div>
          <div class="text second-line">
            <span class="name"></span>
            <span class="value"></span>
          </div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="emgTitle" v-on:addNewCard="addEmgRecord">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in emgList" :key="item.patientCaseId"
         :title="item.etgName" v-on:clickCurrentCard="editEmgRecord(item)"
         v-on:deleteCurrentCard="deleteEmgRecord(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span class="value">{{transformEmgType(item.etgType)}}</span>
          </div>
          <div class="text second-line">
            <span class="name">结果</span>
            <span class="value">{{item.patEleResule}}</span>
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

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      neurologicCheckTitle: '神经系统检查',
      biochemicalExamTitle: '生化指标',
      emgTitle: '肌电图',
      cardWidth: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    neurologicCheckList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    biochemicalExamList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    emgList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters([
      'surgicalTypeList',
      'complicationTypeList',
      'neurologicCheckTypeList',
      'bioexamTypeList',
      'emgTypeList',
      'typeGroup'
    ])
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
    transformNeurologicCheckType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.neurologicCheckTypeList);
      var name = data.spephysicalName ? data.spephysicalName : '';
      return name;
    },
    transformBiochemicalExamType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.bioexamTypeList);
      var name = data.examName ? data.examName : '';
      return name;
    },
    transformEmgType(typeId) {
      // 在 tableData 中找到对应的值
      var emgInfo = Util.getElement('typegroupcode', 'eleType', this.typeGroup);
      var types = emgInfo.types ? emgInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    addNeurologicCheckRecord() {
      // 这里要传递 3 个参数，一个是 title，一个是当前数据对象（新建的时候为空），另一个是模态框的类型
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, '新增神经系统检查', {});
      console.log('add');
    },
    editNeurologicCheckRecord(item) {
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, '神经系统检查', item);
      console.log('edit', item);
    },
    deleteNeurologicCheckRecord(item) {
      // var patientMed = {
      //   patientId: this.id,
      //   patientMedHistoryId: item.patientMedHistoryId,
      //   version: item.version
      // };
      Bus.$on(this.CONFIRM, () => {
        // deletePatientMedHistory(patientMed).then(this._resolveDeletion, this._rejectDeletion);
        console.log('delete', item);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addBiochemicalExamRecord() {
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, '新增生化指标', {});
    },
    editBiochemicalExamRecord(item) {
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, '生化指标', item);
      console.log('Biochemical', item);
    },
    deleteBiochemicalExamRecord() {
      // var patientMed = {
      //   patientId: this.id,
      //   patientMedHistoryId: item.patientMedHistoryId,
      //   version: item.version
      // };
      Bus.$on(this.CONFIRM, () => {
        // deletePatientMedHistory(patientMed).then(this._resolveDeletion, this._rejectDeletion);
        // console.log('delete', item);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addEmgRecord() {
      Bus.$emit(this.SHOW_EMG_MODAL, '新增肌电图', {});
    },
    editEmgRecord(item) {
      Bus.$emit(this.SHOW_EMG_MODAL, '肌电图', item);
      console.log('肌电图', item);
    },
    deleteEmgRecord(item) {
      // var patientMed = {
      //   patientId: this.id,
      //   patientMedHistoryId: item.patientMedHistoryId,
      //   version: item.version
      // };
      Bus.$on(this.CONFIRM, () => {
        // deletePatientMedHistory(patientMed).then(this._resolveDeletion, this._rejectDeletion);
        console.log('delete', item);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticExamination.clientWidth;
        var cardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (cardNum + 1) > 200 + 20 && cardNum < 10) {
          cardNum += 1.0;
        }
        this.cardWidth = 'width-1-' + parseInt(cardNum, 10);
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
      // console.log(this.neurologicCheckList);
      // console.log(this.biochemicalExamList);
      // console.log(this.emgList);
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

@pre-evaluation-card-height: 160px;
@post-complication-card-height: 120px;
@dbs-card-height: 185px;

.diagnostic-examination {
  .panel {
    text-align: left;
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
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
        left: 10px;
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
