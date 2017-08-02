<template lang="html">
  <div class="header">
    <div class="organization-wrapper" @click="togglePanel">
      <span class="name">北京市人民医院</span>
      <span class="iconfont" :class="togglePanelIcon"></span>
    </div>
    <div class="organization-panel" v-show="showPanel"></div>
    <div class="operation-wrapper">
      <span class="iconfont icon-search"></span>
      <span class="iconfont icon-notice"></span>
      <span class="iconfont icon-task"></span>
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
    togglePanelIcon() {
      return this.showPanel ? 'icon-up' : 'icon-down';
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
  width: 100%;
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
    .iconfont {
      margin-left: 10px;
      font-size: @normal-font-size;
      color: @button-color;
    }
  }
  .organization-panel {
    position: absolute;
    top: @header-height;
    left: 0;
    width: 240px;
    height: 360px;
    background-color: rgba(16,16,16,0.8);
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
      font-size: @normal-font-size;
      color: @font-color;
      cursor: pointer;
      &:hover {
        color: lighten(@font-color, 20%);
      }
    }
    .tab-bottom-bar {
      position: absolute;
      width: 80px;
      height: 3px;
      bottom: 0;
      left: 10px;
      background-color: @button-color;
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
      margin-left: 20px;
      font-size: 18px;
      color: @light-font-color;
      cursor: pointer;
    }
  }
}
</style>
