<template lang="html">
  <div class="card">
    <div class="title">{{title}}</div>
    <div class="iconfont icon-delete" v-show="mode === 'editing'"></div>
    <slot></slot>
  </div>
</template>

<script>
import { READING_MODE, EDITING_MODE } from 'utils/constant.js';

export default {
  props: {
    mode: {
      type: String,
      default: READING_MODE
    },
    title: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.card {
  position: relative;
  background-color: @screen-color;
  margin: @card-vertical-margin @card-horizontal-margin;
  height: @card-height;
  cursor: pointer;
  .title {
    position: absolute;
    left: 10px;
    right: 50px;
    top: 15px;
    font-size: @normal-font-size;
    cursor: pointer;
  }
  .iconfont {
    position: absolute;
    right: 15px;
    width: 15px;
    top: 15px;
    font-size: @normal-font-size;
    color: red;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
