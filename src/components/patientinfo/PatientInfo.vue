<template lang="html">
  <div class="content">
    <div class="tabs-wrapper">
      <div class="tab left-tab">个人信息</div>
      <div class="tab right-tab">诊断信息</div>
    </div>
    <div class="shared-info">

    </div>
    <div class="respective-info">

    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.$route.params.id);
  }
};
</script>

<style lang="less" scoped>
.content {
  background-color: #fefefe;
  .tabs-wrapper {
    position: relative;
    height: 40px;
    .tab {
      position: absolute;
      width: 50%;
      height: 100%;
      line-height: 40px;
      box-sizing: border-box;
      background-color: #ddd;
      &.left-tab {
        left: 0;
        border-right: 1px solid #fff;
      }
      &.right-tab {
        left: 50%;
      }
    }
  }
}
</style>
