<template lang="html">
  <div class="group-info">
    <div class="title-bar">
      <h3 class="title">
        组的名字
        <span class="iconfont icon-edit"></span>
        <span class="iconfont icon-explain"></span>
      </h3>
      <div class="button button-operate">批量操作</div>
      <div class="button button-add">添加患者</div>
    </div>
    <!-- <div class="seperate-bar"></div> -->
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less">
@import "~styles/variables.less";

@margin-right: 15px;
@bar-height: 40px;

.group-info {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .title-bar {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @bar-height;
    background-color: @background-color;
    box-shadow: 0 10px 10px @screen-color;
    .title {
      position: absolute;
      left: 20px;
      height: 100%;
      margin: 0;
      line-height: 40px;
      text-align: left;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      color: @font-color;
      .iconfont {
        display: inline-block;
        margin-left: 10px;
        &.icon-edit {
          color: @light-font-color;
        }
        &.icon-explain {
          margin-left: 20px;
          color: @inverse-font-color;
        }
        &:hover {
          color: @font-color;
        }
        &:active {
          opacity: 0.8;
        }
      }
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      cursor: pointer;
      background-color: @button-color;
      right: 10px;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.button-operate {
        right: 30px + @small-button-width;
        background-color: @light-font-color;
      }
      &.button-add {
        right: 10px;
        background-color: @button-color;
      }
    }
  }
  // .seperate-bar {
  //   height: 3px;
  //   width: calc(~"100% - @{margin-right}");
  // }
}
</style>
