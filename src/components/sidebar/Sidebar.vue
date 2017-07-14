<template lang="html">
  <div class="sidebar">
    <div class="item">
      <router-link class="link" :to="{name: 'patientList'}">
        <div class="iconfont icon-accountfilling"></div>
        <div class="title">患者管理</div>
      </router-link>
    </div>
    <div class="item">
      <router-link class="link" :to="{name: 'patientGroups'}">
        <div class="iconfont icon-accountfilling"></div>
        <div class="title">分组管理</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.$router);
    // this.$router.push('list');
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.sidebar {
  background-color: #ddd;
  .item {
    position: relative;
    width: 100%;
    height: 70px;
    border-bottom: 1px solid @font-color;
    cursor: pointer;
    background-color: #ddd;
    &:hover {
      background-color: #eee;
    }
    .link {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-decoration: none;
      color: @font-color;
      .iconfont {
        padding-top: 15px;
        padding-bottom: 5px;
        font-size: 20px;
      }
      .title {
        font-size: @normal-font-size;
      }
    }
    .router-link-active {
      background-color: #bac0ca;
    }
  }
}
</style>
