<template lang="html">
  <div class="header">
    <ul>
      <li class="navigator-item">首页</li>
      <li class="navigator-item">我的患者</li>
      <li class="navigator-item">统计分析</li>
    </ul>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
  background-color: rgba(224,224,224,0.8);
}
.navigator-item {
  display: inline-block;
  width: 100px;
  color: @font-color;
}
</style>
