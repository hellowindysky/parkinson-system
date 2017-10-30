<template lang="html">
  <folding-panel :title="'医学量表'" :mode="mutableMode"  v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-scale" ref="diagnosticscale">
      <extensible-panel class="panel" :mode="mutableMode" :title="subTitle"
        v-on:addNewCard="addScale" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mutableMode" v-for="item in patientScale"
          :key="item.id" :title="getTitle(item.scaleInfoId)" v-on:deleteCurrentCard="deleteScaleRecord(item)"
          v-on:editCurrentCard="updateScaleDetail(item, 'update')">
          <div class="text first-line">量表得分: {{item.scalePoint}}</div>
          <div class="text second-line">填写时间: {{item['inspectTime']}}</div>
          <div class="text third-line">末次服药: {{item['lastTakingTime']}}</div>
          <div class="text fourth-line">开关状态: {{switchType(item['switchType'])}}</div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';
import { delScaleInfo } from 'api/patient.js';

import { getScaleInfo } from 'api/patient';

export default {
  data() {
    return {
      mutableMode: this.mode,
      titles: '医学量表',
      devideWidth: '',
      scaleData: [],
      count: 0,
      scaleId: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    patientScale: {
      type: Array
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
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，300px 是卡片的最小宽度
        while (panelWidth / devideNum > 300 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    },
    getPatientScaleInfo() {
      getScaleInfo().then((data) => {
        this.scaleData = data['scales'];
        // console.log(this.scaleData);
      });
    },
    getTitle(scaleInfoId) {
      // 通过量表的ID来找到量表的名字
      for (let key in this.scaleData) {
        let sonData = this.scaleData[key];
        for (let sonkey in sonData) {
          if (sonkey === 'scaleInfoId') {
            if (sonData[sonkey] === scaleInfoId) {
              return sonData['gaugeName'];
            }
          }
        }
      }
    },
    updateScaleDetail(item) {
      Bus.$emit(this.UPDATE_SCALE_DETAIL, item);
    },
    addScale() {
      Bus.$emit(this.UPDATE_SCALE_DETAIL, {});
    },
    deleteScaleRecord(item) { // 删除肌电图
      // console.log(item);
      let ScaleId = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        delScaleInfo(ScaleId).then(this._resolveDeletion, this._rejectDeletion);
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
    switchType(type) {
      if (String(type) === '1') {
        return '开';
      } else {
        return '关';
      }
    }
  },
  computed: {
    subTitle() {
      return this.titles + '（' + this.count + '条记录）';
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    this.getPatientScaleInfo();
    this.recalculateCardWidth();
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  },
  watch: {
    patientScale: {
      handler: function(newVal) {
        if (newVal) {
          this.count = this.patientScale.length;
        }
      },
      deep: true
    },
    scaleData: {
      handler: function(newVal) {
        if (newVal) {
          this.scaleData = newVal;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.diagnostic-scale {
  position: relative;
  .panel {
    text-align: left;
    .content {
      height: 200px !important;
    }
    .card {
      height: 170px;
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
