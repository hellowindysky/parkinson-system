<template lang="html">
  <div class="diagnostic-detail-wrapper" v-show="displayDetail">
    <div class="title-bar">
      <h2 class="title">XX 的诊断记录</h2>
      <div class="button back-button">返回</div>
    </div>
    <folding-panel :title="'基础情况'"></folding-panel>
  </div>
</template>

<script>
import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      displayDetail: false
    };
  },
  components: {
    FoldingPanel
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@title-bar-height: 40px;

.diagnostic-detail-wrapper {
  background-color: @screen-color;
  .title-bar {
    position: relative;
    width: 100%;
    height: @title-bar-height;
    margin-bottom: 10px;
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
        right: 10px;
      }
    }
  }
}
</style>
