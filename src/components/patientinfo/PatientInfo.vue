<template lang="html">
  <div class="content">
    <div class="tabs-wrapper">
      <div class="tab left-tab" :class="{'current-tab': currentTab === 'personalInfo'}" @click="choosePersonal">个人信息</div>
      <div class="tab right-tab" :class="{'current-tab': currentTab === 'diagnosticInfo'}" @click="chooseDiagnostic">诊断信息</div>
      <div class="button left-button">导出</div>
      <div class="button right-button">添加</div>
    </div>
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
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'personalInfo'
    };
  },
  methods: {
    choosePersonal() {
      this.currentTab = 'personalInfo';
    },
    chooseDiagnostic() {
      this.currentTab = 'diagnosticInfo';
    }
  },
  mounted() {
    // console.log(this.$route.params.id);
    // this.$router.push('personalinfo');
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.content {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .tabs-wrapper {
    position: relative;
    height: 35px;
    .tab {
      position: absolute;
      width: 105px;
      height: 100%;
      line-height: 35px;
      box-sizing: border-box;
      border-radius: 5px 5px 0 0;
      font-size: @normal-font-size;
      background-color: @light-gray-color;
      cursor: pointer;
      &.left-tab {
        left: 0;
      }
      &.right-tab {
        left: 120px;
      }
      &.current-tab {
        background-color: @background-color;
      }
    }
    .button {
      position: absolute;
      top: 3px;
      width: 70px;
      height: 25px;
      line-height: 25px;
      font-size: @normal-font-size;
      color: @button-font-color;
      cursor: pointer;
      &.left-button {
        background-color: @secondary-button-color;
        right: 110px;
      }
      &.right-button {
        background-color: @button-color;
        right: 20px;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
  .shared-info {
    position: relative;
    padding: 5px 25px;
    width: calc(~"100% - 5px");
    height: 70px;
    box-sizing: border-box;
    background-color: @background-color;
    font-size: 0;
    text-align: left;
    box-shadow: 0 10px 10px @screen-color;
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
}
</style>
