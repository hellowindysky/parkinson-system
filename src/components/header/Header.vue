<template lang="html">
  <div class="header">
    <div class="organization-wrapper" @click="togglePanel">
      <span class="iconfont icon-category"></span>
      <span class="name">北京市人民医院</span>
    </div>
    <div class="organization-panel" v-show="showPanel">

    </div>
    <ul class="tabs-wrapper">
      <li class="tab" @click="choosePatients">患者管理</li>
      <li class="tab" @click="chooseAnalytics">统计分析</li>
      <li class="tab" @click="chooseConfiguration">系统配置</li>
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
      showPanel: false
    };
  },
  mounted() {
    tabBottomBar = document.getElementById('tab-bottom-bar');
    // 控件第一次加载的时候，调整下划线的位置
    this.checkCurrentTab();
  },
  watch: {
    // 监控路由变化，调整下划线的位置
    $route() {
      this.checkCurrentTab();
    }
  },
  methods: {
    choosePatients() {
      tabBottomBar.style.transform = 'translate3d(0,0,0)';
      // 如果当前路径不是以“/patients”开头了，才发生跳转
      if (!this.$route.path.match(/^\/patients/)) {
        this.$router.push('/patients');
      }
    },
    chooseAnalytics() {
      tabBottomBar.style.transform = 'translate3d(100px,0,0)';
      // 如果当前路径不是以“/analytics”开头了，才发生跳转
      if (!this.$route.path.match(/^\/analytics/)) {
        this.$router.push('/analytics');
      }
    },
    chooseConfiguration() {
      tabBottomBar.style.transform = 'translate3d(200px,0,0)';
      // 如果当前路径不是以“/configuration”开头了，才发生跳转
      if (!this.$route.path.match(/^\/configuration/)) {
        this.$router.push('/configuration');
      }
    },
    togglePanel() {
      this.showPanel = !this.showPanel;
    },
    checkCurrentTab() {
      var path = this.$route.path;
      if (path.match(/^\/patients/)) {
        this.choosePatients();
      } else if (path.match(/^\/analytics/)) {
        this.chooseAnalytics();
      } else if (path.match(/^\/configuration/)) {
        this.chooseConfiguration();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.header {
  line-height: @header-height;
  background-color: rgba(224,224,224,0.6);
  box-sizing: border-box;
  border-bottom: 1px solid #555;
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
    .iconfont {
      margin-right: 5px;
      line-height: @header-height;
      font-size: @large-font-size;
      font-weight: bold;
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
      width: 100px;
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
      height: 3px;
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
      font-size: @large-font-size;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
