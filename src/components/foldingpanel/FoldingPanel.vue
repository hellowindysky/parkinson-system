<template lang="html">
  <div class="folding-panel-wrapper">
    <div class="header">
      <h2 class="title">基础信息</h2>
      <span class="iconfont icon-down"></span>
      <div class="button edit-button">编辑</div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.folding-panel-wrapper {
  background-color: @background-color;
  .header {
    position: relative;
    height: 35px;
    .title {
      display: inline-block;
      font-size: @large-font-size;
    }
    .iconfont {
      padding-left: 10px;
    }
    .button {
      float: right;
      margin-right: 25px;
      background-color: @button-color;
      color: @button-font-color;
    }
  }
  .content {
    padding: 10px 25px;
  }
}

</style>
