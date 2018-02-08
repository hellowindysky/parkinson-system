<template>
  <div class='secondbar-content'>
    <ul class='secondbar-wrapper'>
      <li class="tab left-tab" :class="{'current-tab': currentTab === 'configpersonalinf'}" @click="chooseconfigPersonal">个人信息</li>
      <li class="tab right-tab" :class="{'current-tab': currentTab === 'configdiagnosticinfo'}" @click="chooseConfigDiagnostic">诊断信息</li>
      <li class="tab-bottom-bar" :class="currentTabBottomBar"></li>
    </ul>
    <div class="scroll-content">
      <feature-table-head></feature-table-head>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import FeatureTableHead from 'views/configuration/featureconfiguration/table-head/FeatureTableHead';
export default {
  computed: {
    currentTab() {
      var path = this.$route.path;
      var rePersonal = new RegExp(/\/configpersonalinf(\/|$)/);
      var reDiagnostic = new RegExp(/\/configdiagnosticinfo(\/|$)/);
      if (rePersonal.test(path)) {
        return 'configpersonalinf';
      } else if (reDiagnostic.test(path)) {
        return 'configdiagnosticinfo';
      } else {
        // 逻辑正确的话，不会返回这行的。只是怕以后路由修改，出现问题。
        return 'something wrong here';
      }
    },
    currentTabBottomBar() {
      if (this.currentTab === 'configpersonalinf') {
        return 'first-tab';
      } else if (this.currentTab === 'configdiagnosticinfo') {
        return 'second-tab';
      } else {
        return 'Oops! check currentTab';
      }
    }
  },
  methods: {
    chooseconfigPersonal() {
      if (!/\/configpersonalinf(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'configpersonalinf' });
      }
    },
    chooseConfigDiagnostic() {
      if (!/\/configdiagnosticinfo(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'configdiagnosticinfo' });
      }
    }
  },
  mounted() {
    if (!/\/configpersonalinf(\/|$)/.test(this.$route.path)) {
      this.$router.push({ name: 'configpersonalinf' });
    };
  },
  components: {
    FeatureTableHead
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@tabs-wrapper-height: 40px;
@tab-width: 70px;
@first-tab-x: 20px;
@second-tab-x: 120px;
@margin-right: 20px;
@first-bar-height: 60px;
@second-bar-height: 45px;

.secondbar-content {
  position: relative;
  height: calc(~"100% - @{first-bar-height}");
  .secondbar-wrapper {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @tabs-wrapper-height;
    background-color: @background-color;
    box-shadow: 0 10px 10px @screen-color;
    list-style: none;
    .tab {
      position: absolute;
      width: @tab-width;
      line-height: 40px;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      cursor: pointer;
      color: @inverse-font-color;
      &:hover {
        color: darken(@inverse-font-color, 10%);
      }
      &.left-tab {
        left: @first-tab-x;
      }
      &.right-tab {
        left: @second-tab-x;
      }
      &.current-tab {
        color: @button-color;
      }
    }
    .tab-bottom-bar {
      position: absolute;
      width: @tab-width;
      height: 3px;
      bottom: 0;
      background-color: @button-color;
      left: @first-tab-x;
      transition: transform 0.2s;
      &.first-tab {
        transform: translate3d(0, 0, 0);
      }
      &.second-tab {
        transform: translate3d(@second-tab-x - @first-tab-x, 0, 0);
      }
    }
  }
  .scroll-content {
    position: relative;
    height: calc(~"100% - @{second-bar-height}");
  }
}
</style>
