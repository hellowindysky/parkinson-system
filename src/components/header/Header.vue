<template lang="html">
  <div class="header">
    <div class="organization-wrapper" @click="togglePanel">
      <span class="name">北京市人民医院</span>
    </div>
    <div class="organization-panel" v-show="showPanel">

    </div>
    <ul class="tabs-wrapper">
      <li class="tab" @click="choosePatients">患者管理</li>
      <li class="tab" @click="chooseAnalytics">统计分析</li>
      <li class="tab" @click="chooseConfiguration">系统配置</li>
      <div class="tab-bottom-bar" :class="tabPlaceClass"></div>
    </ul>
    <div class="operation-wrapper">
      <span class="iconfont icon-search"></span>
      <span class="iconfont icon-remind"></span>
      <span class="iconfont icon-set"></span>
      <span class="iconfont icon-account"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPanel: false
    };
  },
  computed: {
    tabPlace() {
      var path = this.$route.path;
      if (/^\/patients/.test(path)) {
        return 1;
      } else if (/^\/analytics/.test(path)) {
        return 2;
      } else if (/^\/configuration/.test(path)) {
        return 3;
      }
    },
    tabPlaceClass() {
      return 'tab-place-' + this.tabPlace;
    }
  },
  methods: {
    choosePatients() {
      // 如果当前路径不是以“/patients”开头了，才发生跳转
      if (!/^\/patients/.test(this.$route.path)) {
        this.$router.push('/patients');
      }
    },
    chooseAnalytics() {
      // 如果当前路径不是以“/analytics”开头了，才发生跳转
      if (!/^\/analytics/.test(this.$route.path)) {
        this.$router.push('/analytics');
      }
    },
    chooseConfiguration() {
      // 如果当前路径不是以“/configuration”开头了，才发生跳转
      if (!/^\/configuration/.test(this.$route.path)) {
        this.$router.push('/configuration');
      }
    },
    togglePanel() {
      this.showPanel = !this.showPanel;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@tab-width: 100px;

.header {
  line-height: @header-height;
  background-color: @background-color;
  box-sizing: border-box;
  box-shadow: 0 2px 3px @light-gray-color;
  color: @font-color;
  z-index: 400;
  .organization-wrapper {
    position: absolute;
    display: inline-block;
    left: 20px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: lighten(@font-color, 20%);
    }
    .name {
      line-height: @header-height;
      font-size: @large-font-size;
    }
  }
  .organization-panel {
    position: absolute;
    top: @header-height;
    left: 0;
    width: 240px;
    height: 360px;
    background-color: rgba(16,16,16,0.6);
    z-index: 300;
  }
  .tabs-wrapper {
    position: absolute;
    padding: 0;
    height: @header-height;
    left: 40%;
    @media screen and (max-width: 900px) {
      left: 35%;
    }
    @media screen and (max-width: 750px) {
      left: 30%;
    }
    margin: 0;
    font-size: 0;
    .tab {
      display: inline-block;
      margin: 0;
      padding: 0;
      width: @tab-width;
      font-size: @large-font-size;
      color: @font-color;
      cursor: pointer;
      &:hover {
        color: lighten(@font-color, 20%);
      }
    }
    .tab-bottom-bar {
      position: absolute;
      width: 80px;
      height: 4px;
      bottom: 0;
      left: 10px;
      background-color: @font-color;
      transition: 0.15s;
      &.tab-place-1 {
        transform: translateX(0px);
      }
      &.tab-place-2 {
        transform: translateX(@tab-width);
      }
      &.tab-place-3 {
        transform: translateX(@tab-width * 2);
      }
    }
  }
  .operation-wrapper {
    position: absolute;
    right: 20px;
    .iconfont {
      margin-left: 15px;
      font-size: @large-font-size;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
