<template lang="html">
  <folding-panel :title="'基础信息'">
    <div class="basic-info">
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
      <p>测试</p>
    </div>
  </folding-panel>
</template>

<script>
import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  components: {
    FoldingPanel
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.basic-info {
  p {
    margin: 0;
    padding: 0;
    font-size: @normal-font-size;
  }
}
</style>
