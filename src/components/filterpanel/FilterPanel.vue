<template lang="html">
  <div class="filter-panel" :class="{'hide': !showFilterPanel}">
    <div class="condition-area">
      <div class="tabs-wrapper">
        <span class="tab first-tab" :class="{'current-tab': currentTab === PERSONAL_INFO}"
          @click="choosePersonalInfo">个人信息</span>
        <span class="tab second-tab" :class="{'current-tab': currentTab === DIAGNOSTIC_INFO}"
          @click="chooseDiagnosticInfo">诊断信息</span>
        <div class="tab-bottom-bar" :class="currentTabBottomBar"></div>
      </div>
    </div>
    <div class="toggle-condition-button" :class="{'hide-condition-status': !conditionDisplay}" @click="toggleConditonDisplay">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <div class="content-area" :class="{'hide-condition-status': !conditionDisplay}">

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

const PERSONAL_INFO = 'personalInfo';
const DIAGNOSTIC_INFO = 'diagnosticInfo';

export default {
  props: {
    showFilterPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTab: PERSONAL_INFO,
      PERSONAL_INFO: PERSONAL_INFO,
      DIAGNOSTIC_INFO: DIAGNOSTIC_INFO,
      conditionDisplay: true
    };
  },
  computed: {
    currentTabBottomBar() {
      if (this.currentTab === PERSONAL_INFO) {
        return 'first-tab';
      } else if (this.currentTab === DIAGNOSTIC_INFO) {
        return 'second-tab';
      } else {
        return '';
      }
    },
    toggleIconClass() {
      return this.conditionDisplay ? 'icon-arrow-left' : 'icon-arrow-right';
    }
  },
  methods: {
    choosePersonalInfo() {
      this.currentTab = PERSONAL_INFO;
    },
    chooseDiagnosticInfo() {
      this.currentTab = DIAGNOSTIC_INFO;
    },
    toggleConditonDisplay() {
      this.conditionDisplay = !this.conditionDisplay;
    }
  },
  watch: {
    $route() {
      if (this.showFilterPanel) {
        // 在面板打开的情况下，一旦路由发生变化，则自动收起面板
        Bus.$emit(this.TOGGLE_FILTER_PANEL_DISPLAY);
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@condition-area-width: 300px;

.filter-panel {
  position: absolute;
  top: @header-height + @header-margin-bottom;
  left: 0;
  width: 100%;
  height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  background-color: @background-color;
  transition: 0.5s;
  z-index: 300;
  &.hide {
    transform: translateY(calc(~"-100% - @{header-margin-bottom}"));
  }
  .condition-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 300px;
    height: 100%;
    .tabs-wrapper  {
      position: relative;
      width: 100%;
      height: 35px;
      font-size: 0;
      .tab {
        display: inline-block;
        width: 50%;
        height: 100%;
        line-height: 35px;
        font-size: @normal-font-size;
        font-weight: bold;
        color: @light-font-color;
        cursor: pointer;
        &.current-tab {
          color: @button-color;
        }
      }
      .tab-bottom-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 70px;
        height: 2px;
        background-color: @button-color;
        transition: 0.2s;
        &.first-tab {
          transform: translateX(40px);
        }
        &.second-tab {
          transform: translateX(40px + @condition-area-width * 0.5);
        }
      }
    }
  }
  .toggle-condition-button {
    position: absolute;
    left: @condition-area-width;
    width: @bar-width;
    height: 100%;
    background-color: @screen-color;
    cursor: pointer;
    transition: 0.3s;
    z-index: 200;
    &.hide-condition-status {
      left: 0;
    }
    .iconfont {
      position: absolute;
      left: -1px;
      font-size: 18px;
      top: 45%;
      width: 100%;
      transform: translateY(-50%);
      color: #ced1db;
    }
  }
  .content-area {
    position: absolute;
    height: 100%;
    left: @condition-area-width + @bar-width;
    right: 0;
    background-color: @background-color;
    transition: 0.3s;
    &.hide-condition-status {
      left: 0;
    }
  }
}
</style>
