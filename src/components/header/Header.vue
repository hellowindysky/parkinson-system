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
