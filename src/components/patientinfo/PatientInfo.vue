<template lang="html">
  <div class="content">
    <div class="tabs-wrapper">
      <div class="tab left-tab" :class="{'current-tab': currentTab === 'personalInfo'}" @click="choosePersonal">个人信息</div>
      <div class="tab right-tab" :class="{'current-tab': currentTab === 'diagnosticInfo'}" @click="chooseDiagnostic">诊断信息</div>
      <div class="button left-button">导出</div>
      <div class="button right-button">添加</div>
      <div class="tab-bottom-bar" :class="currentTabBottomBar"></div>
    </div>
    <div class="info-wrapper">
      <div class="shared-info">
        <div class="info adscription">
          <span class="info-title">归属医生: </span>
          <span class="info-text">陈大雄</span>
        </div>
        <div class="info create-time">
          <span class="info-title">创建时间: </span>
          <span class="info-text">2017-12-7</span>
        </div>
        <div class="info groups">
          <span class="info-title">分组情况: </span>
          <span class="info-text">帕金森1组  帕金森2组</span>
        </div>
      </div>
      <div class="respective-info">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  computed: {
    currentTab() {
      var path = this.$route.path;
      var rePersonal = new RegExp(/\/personalInfo(\/|$)/);
      var reDiagnostic = new RegExp(/\/diagnosticInfo(\/|$)/);
      if (rePersonal.test(path)) {
        return 'personalInfo';
      } else if (reDiagnostic.test(path)) {
        return 'diagnosticInfo';
      } else {
        // 逻辑正确的话，不会返回这行的。只是怕以后路由修改，出现问题。
        return 'something wrong here';
      }
    },
    currentTabBottomBar() {
      if (this.currentTab === 'personalInfo') {
        return 'first-tab';
      } else if (this.currentTab === 'diagnosticInfo') {
        return 'second-tab';
      } else {
        return 'Oops! check currentTab';
      }
    }
  },
  methods: {
    choosePersonal() {
      this.$router.push('personalInfo');
    },
    chooseDiagnostic() {
      this.$router.push('diagnosticInfo');
    },
    checkIfJump() {
      var path = this.$route.path;
      var reList = new RegExp(/^\/patients\/list\//);
      var reOtherList = new RegExp(/^\/patients\/otherList\//);
      var rePersonal = new RegExp(/\/personalInfo(\/|$)/);
      var reDiagnostic = new RegExp(/\/diagnosticInfo(\/|$)/);

      var isPatientsList = reList.test(path) || reOtherList.test(path);
      var withoutPersonalOrDiagostic = !rePersonal.test(path) && !reDiagnostic.test(path);

      // 路由还停留在在病患信息这一层，但没有指明是个人信息还是诊断信息，那么就默认跳转到个人信息
      if (isPatientsList && withoutPersonalOrDiagostic) {
        this.$router.replace({ name: 'personalInfo' });
      }
    }
  },
  mounted() {
    this.checkIfJump();
  },
  watch: {
    $route() {
      this.checkIfJump();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

@tabs-wrapper-height: 40px;
@tab-width: 70px;
@first-tab-x: 20px;
@second-tab-x: 120px;

@margin-right: 15px;

.content {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .tabs-wrapper {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @tabs-wrapper-height;
    background-color: @background-color;
    box-shadow: 0 10px 10px @screen-color;
    .tab {
      position: absolute;
      width: @tab-width;
      height: 100%;
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
    .button {
      position: absolute;
      top: 8px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      cursor: pointer;
      &.left-button {
        background-color: @secondary-button-color;
        right: 100px;
      }
      &.right-button {
        background-color: @button-color;
        right: 10px;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
  .info-wrapper {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{tabs-wrapper-height}");
    overflow: hidden;
    .shared-info {
      position: relative;
      margin: 0 @margin-right @vertical-spacing 0;
      padding: 5px 25px;
      height: 70px;
      box-sizing: border-box;
      background-color: @background-color;
      font-size: 0;
      text-align: left;
      .info {
        display: inline-block;
        width: 50%;
        line-height: 30px;
        font-size: @normal-font-size;
        &.adscription {
          top: 5px;
        }
        &.create-time {
          top: 5px;
        }
        &.groups {
          top: 40px;
        }
        .info-title {
          display: inline-block;
          width: 85px;
          color: @font-color;
        }
        .info-text {
          color: @light-font-color;
        }
      }
    }
    .respective-info {
      position: relative;
      margin-right: @margin-right;
      box-sizing: border-box;
      background-color: @background-color;
    }
  }
}
</style>
