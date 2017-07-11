<template lang="html">
  <div class="header">
    <div class="organization-wrapper" @click="togglePanel">
      <span class="iconfont icon-category"></span>
      <span class="name">北京市人民医院</span>
    </div>
    <div class="organization-panel" v-show="showPanel">

    </div>
    <ul class="tabs-wrapper">
      <li class="tab" @click="chooseHome">
        <router-link to="home" class="link">首页</router-link>
      </li>
      <li class="tab" @click="choosePatients">
        <router-link to="patients" class="link">我的患者</router-link>
      </li>
      <li class="tab" @click="chooseAnalytics">
        <router-link to="analytics" class="link">统计分析</router-link>
      </li>
      <div class="tab-bottom-bar" id="tab-bottom-bar"></div>
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
var tabBottomBar;

export default {
  data() {
    return {
      showPanel: true
    };
  },
  mounted() {
    tabBottomBar = document.getElementById('tab-bottom-bar');
  },
  methods: {
    chooseHome() {
      tabBottomBar.style.transform = 'translate3d(0,0,0)';
    },
    choosePatients() {
      tabBottomBar.style.transform = 'translate3d(100px,0,0)';
    },
    chooseAnalytics() {
      tabBottomBar.style.transform = 'translate3d(200px,0,0)';
    },
    togglePanel() {
      this.showPanel = !this.showPanel;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@header-height: 50px;

.header {
  position: absolute;
  top: 0;
  width: 100%;
  height: @header-height;
  line-height: @header-height;
  background-color: rgba(224,224,224,0.6);
  color: @font-color;
  .organization-wrapper {
    position: absolute;
    display: inline-block;
    left: 20px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: lighten(@font-color, 20%);
    }
    .iconfont {
      margin-right: 5px;
      font-weight: bold;
    }
    .name {
      font-size: @big-font-size;
    }
  }
  .organization-panel {
    position: absolute;
    top: @header-height;
    left: 0;
    width: 240px;
    height: 360px;
    background-color: rgba(16,16,16,0.6);
  }
  .tabs-wrapper {
    position: absolute;
    padding: 0;
    height: @header-height;
    left: 40%;
    @media screen and (max-width: 720px) {
      left: 30%;
    }
    margin: 0;
    font-size: 0;
    .tab {
      display: inline-block;
      margin: 0;
      padding: 0;
      width: 100px;
      .link {
        font-size: @big-font-size;
        color: @font-color;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: lighten(@font-color, 20%);
        }
      }
    }
    .tab-bottom-bar {
      position: absolute;
      width: 80px;
      height: 2px;
      bottom: 0;
      left: 10px;
      background-color: @font-color;
      transition: 0.15s;
    }
  }
  .operation-wrapper {
    position: absolute;
    right: 20px;
    .iconfont {
      margin-left: 15px;
      font-size: @big-font-size;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
