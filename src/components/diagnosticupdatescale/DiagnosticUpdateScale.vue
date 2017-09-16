<template lang="html">
  <div class="diagnostic-update-wrapper" v-show="displayUpdateScale">
    <div class="title-bar">
      <h2 class="title"></h2>
    </div>
    <div class="scroll-area" ref="scrollArea">
    </div>
  </div>  
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      displayUpdateScale: false,
      mode: this.READING_MODE,
      scaleDetail: {}
    };
  },
  methods: {
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        // 之所以弃用 update 方法，是因为它在某些情况下会出现问题，导致滚动条不能有效刷新
        // Ps.update(this.$refs.scrollArea);

        // 如果之前有绑定滚动条的话，先进行解除
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    showDetailPanel(scaleId) {
      // 接收到相应的消息之后，打开诊断详情窗口，然后再向服务器请求数据
      this.displayUpdateScale = true;
      console.log(scaleId);
    },
    // goBack() {
    //   // 按下返回按钮，实际上是修改的路由地址 ———— 因为我们是监控路由地址来决定这个详情窗口是否显示的
    //   this.$router.push({name: 'diagnosticInfo'});
    // },
    closePanel() {
      this.displayUpdateScale = false;
      this.scaleDetail = {};
    }
  },
  mounted() {
    Bus.$on(this.UPDATE_SCALE_DETAIL, this.showDetailPanel);
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$on(this.UPDATE_SCALE_DETAIL);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
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
      cursor: pointer;
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
        right: 30px + @small-button-width;
      }
      &.file-button {
        background-color: @button-color;
        right: 10px;
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
