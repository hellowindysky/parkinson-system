<template lang="html">
  <div class="item">
    <div class="name">FOG1组</div>
    <div class="number">患者: 3945人</div>
    <div class="tag">临床</div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.item {
  position: relative;
  width: 100%;
  height: 65px;
  padding: 5px;
  overflow: hidden;
  .name {
    position: absolute;
    font-size: @normal-font-size;
    left: 15px;
    top: 10px;
  }
  .number {
    position: absolute;
    font-size: @small-font-size;
    left: 15px;
    top: 40px;
  }
  .tag {
    position: absolute;
    font-size: @small-font-size;
    right: -35px;
    top: 0;
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: #555;
    color: #eee;
    transform:rotate(45deg);
  }
}
</style>
