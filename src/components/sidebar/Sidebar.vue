<template lang="html">
  <ul class="sidebar">
    <router-link class="item" :to="{name: 'list', params: {id: 124}}" tag="li">
      <div class="iconfont icon-accountfilling"></div>
      <div class="title">我的患者</div>
    </router-link>
    <router-link class="item" :to="{name: 'patientGroups'}" tag="li">
      <div class="iconfont icon-accountfilling"></div>
      <div class="title">分组管理</div>
    </router-link>
    <router-link class="item" :to="{name: 'otherList', params: {id: 223}}" tag="li">
      <div class="iconfont icon-accountfilling"></div>
      <div class="title">科室患者</div>
    </router-link>
  </ul>
</template>

<script>
export default {
  mounted() {
    // 初始化该组件时，自动跳转到病患列表下第一个患者
    this.$router.push('/patients/list/id=123');
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.sidebar {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-right: 1px solid #888;
  background-color: #ddd;
  .item {
    position: relative;
    width: 100%;
    height: 70px;
    border-bottom: 1px solid @font-color;
    cursor: pointer;
    list-style: none;
    background-color: #ddd;
    &:hover {
      background-color: #eee;
    }
    .iconfont {
      padding-top: 15px;
      padding-bottom: 5px;
      font-size: 20px;
    }
    .title {
      font-size: @normal-font-size;
    }
    .active {
      background-color: #bac0ca;
    }
  }
}
</style>
