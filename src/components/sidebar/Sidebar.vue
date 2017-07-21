<template lang="html">
  <ul class="sidebar">
    <router-link class="item" :class="{'current': currentItem === 'list'}" :to="{name: 'list'}" tag="li">
      <div class="iconfont icon-accountfilling"></div>
      <div class="title">我的患者</div>
    </router-link>
    <router-link class="item" :class="{'current': currentItem === 'groups'}" :to="{name: 'patientGroups'}" tag="li">
      <div class="iconfont icon-accountfilling"></div>
      <div class="title">分组管理</div>
    </router-link>
    <router-link class="item" :class="{'current': currentItem === 'otherlist'}" :to="{name: 'otherList'}" tag="li">
      <div class="iconfont icon-accountfilling"></div>
      <div class="title">科室患者</div>
    </router-link>
  </ul>
</template>

<script>
export default {
  computed: {
    currentItem() {
      var path = this.$route.path;
      if (/^\/patients\/list/.test(path)) {
        return 'list';
      } else if (/^\/patients\/groups/.test(path)) {
        return 'groups';
      } else if (/^\/patients\/otherlist/.test(path)) {
        return 'otherlist';
      }
    }
  },
  mounted() {
    // 初始化该组件时，自动跳转到病患列表(第一个选项所对应的列表)
    this.$router.replace({ name: 'list' });
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
    cursor: pointer;
    list-style: none;
    background-color: #ddd;
    &.current {
      color: saturate(@font-color, 100%);
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
