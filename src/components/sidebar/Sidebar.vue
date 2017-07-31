<template lang="html">
  <ul class="sidebar">
    <router-link class="item" :class="{'current': currentItem === 'list'}" :to="{name: 'list'}" tag="li">
      <div class="iconfont icon-my-patients"></div>
      <div class="title">我的患者</div>
    </router-link>
    <router-link class="item" :class="{'current': currentItem === 'groups'}" :to="{name: 'patientGroups'}" tag="li">
      <div class="iconfont icon-group-management"></div>
      <div class="title">分组管理</div>
    </router-link>
    <router-link class="item" :class="{'current': currentItem === 'otherlist'}" :to="{name: 'otherList'}" tag="li">
      <div class="iconfont icon-other-patients"></div>
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
@item-height: 50px;

.sidebar {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: @theme-color;
  color: @inverse-font-color;
  .item {
    position: relative;
    margin-top: 15px;
    width: 100%;
    height: @item-height;
    cursor: pointer;
    list-style: none;
    &.current {
      background-color: @button-color;
      color: @button-font-color;
    }
    .iconfont {
      display: inline-block;
      font-size: 24px;
      line-height: @item-height;
      vertical-align: middle;
    }
    .title {
      display: inline-block;
      font-size: @normal-font-size;
      line-height: @item-height;
      vertical-align: middle;
    }
  }
}
</style>
