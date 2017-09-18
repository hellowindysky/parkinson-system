<template lang="html">
  <folding-panel :title="'医学量表'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-scale" ref="diagnosticscale">
      <extensible-panel class="panel" :mode="mutableMode" :title="subTitle" v-on:addNewCard="addScale">
         <card class="card" :class="devideWidth" :mode="mutableMode" v-for="item in patientScale" :key="item.id" :title="getTitle(item.scaleInfoId)" v-on:clickCurrentCard="updateScaleDetail(item, 'update')">
           <div class="text first-line">量表得分: {{item.scalePoint}}</div>
           <div class="text second-line"></div>
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
    updateScaleDetail(item, type) {
      Bus.$emit(this.UPDATE_SCALE_DETAIL, item, type);
    },
    addScale() {
      Bus.$emit(this.UPDATE_SCALE_DETAIL);
    }
  },
  computed: {
    subTitle() {
      return this.titles + '（' + this.count + '条记录）';
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
    .card {
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
    }
  }
}
</style>
