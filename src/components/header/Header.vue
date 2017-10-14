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
      <span class="account">
        <img src="~img/profile.png" alt="doctor image" class="picture">
        <span class="name">臻络测试</span>
      </span>
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
  },
  mounted() {
    // 一旦登录验证成功，并且进入到主界面时，就向服务器调取相应的数据，如字典项信息
    // TODO 如果在header中改变了所属机构，就需要重新获取这些信息
    this.$store.dispatch('getWholeDictionary');
    this.$store.dispatch('getWholeTemplate');
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
    height: @header-height;
    font-size: 0;
    .iconfont {
      display: inline-block;
      margin-top: 10px;
      padding: 0 10px;
      width: 40px;
      height: 30px;
      line-height: 30px;
      border-right: 1px solid lighten(@inverse-font-color, 20%);
      font-size: 18px;
      color: @light-font-color;
      cursor: pointer;
      &:first-child {
        border-left: 1px solid lighten(@inverse-font-color, 20%);
      }
    }
    .account {
      margin-left: 20px;
      cursor: pointer;
      .picture {
        position: relative;
        width: 30px;
        height: 30px;
        top: 10px;
      }
      .name {
        padding-left: 10px;
        font-size: @normal-font-size;
      }
    }
  }
}
</style>
