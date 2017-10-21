<template lang="html">
  <div class="header">
    <div class="organization-wrapper" @click="togglePanel">
      <span class="name">{{orgName}}</span>
      <span class="iconfont" :class="togglePanelIcon"></span>
    </div>
    <div class="organization-panel" v-show="showPanel"></div>
    <div class="operation-wrapper">
      <span class="iconfont icon-search"></span>
      <span class="iconfont icon-notice"></span>
      <span class="iconfont icon-task"></span>
      <span class="account" @click="toggleAccountPanelDisplay">
        <img src="~img/profile.png" alt="doctor image" class="picture">
        <span class="name">{{title}}</span>
      </span>
    </div>
    <div class="account-panel" :class="{'hide': !showAccountPanel}" @blur="hideAccountPanel">
      <p class="operate-item" @click="resetPassword">修改密码</p>
      <div class="seperate-line"></div>
      <p class="operate-item" @click="logout">退出登录</p>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      showPanel: false,
      showAccountPanel: false
    };
  },
  computed: {
    togglePanelIcon() {
      return this.showPanel ? 'icon-up' : 'icon-down';
    },
    title() {
      var name = sessionStorage.getItem('name');
      return name ? name : '';
    },
    orgName() {
      var orgName = sessionStorage.getItem('orgName');
      return orgName ? orgName : '';
    }
  },
  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel;
    },
    toggleAccountPanelDisplay() {
      this.showAccountPanel = !this.showAccountPanel;
    },
    hideAccountPanel() {
      this.showAccountPanel = false;
    },
    resetPassword() {
      this.hideAccountPanel();
      Bus.$emit(this.SHOW_PASSWORD_MODAL);
    },
    logout() {
      this.hideAccountPanel();
      sessionStorage.clear();
      this.$router.push({name: 'login'});
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
    right: 0;
    padding-right: 20px;
    height: @header-height;
    background-color: @background-color;
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
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
  .account-panel {
    position: absolute;
    top: @header-height;
    right: 0;
    width: 137px;
    height: 81px;
    background-color: @theme-color;
    cursor: pointer;
    transition: 0.2s;
    z-index: -1;
    &.hide {
      transform: translateY(-85px);
    }
    .operate-item {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      cursor: pointer;
      font-size: @normal-font-size;
      &:hover {
        background-color: @font-color;
      }
      &:active {
        background-color: lighten(@font-color, 5%);
      }
    }
    .seperate-line {
      margin-left: 10px;
      width: 117px;
      height: 1px;
      cursor: pointer;
      background-color: @light-font-color;
    }
  }
}
</style>
