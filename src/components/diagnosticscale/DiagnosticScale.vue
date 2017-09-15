<template lang="html">
  <folding-panel :title="'医学量表'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-scale" ref="diagnosticscale">
    </div>
  </folding-panel>
</template>

<script>
// import { mapGetters } from 'vuex';
// import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
// import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
// import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      title: '医学量表',
      devideWidth: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
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
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度
        while (panelWidth / devideNum > 200 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
        console.log(panelWidth);
      });
    }
  },
  components: {
    FoldingPanel
  },
  computed: {
    subTitle() {
      var count = this.medicineList.length;
      return this.title + '（' + count + '条记录）';
    }
  },
  mounted() {
    this.recalculateCardWidth();

    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
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
      &.width-1-, &.width-1-0 {
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
