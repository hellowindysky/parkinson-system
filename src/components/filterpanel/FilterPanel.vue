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
      <div class="scroll-area" ref="scrollList">
        <div class="folding-box">
          <div class="title" @click="toggleBasicInfoDisplay">
            基本情况
            <span class="iconfont" :class="{'icon-up': displayBasicInfoCondition, 'icon-down': !displayBasicInfoCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayBasicInfoCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.ageFrom"></el-checkbox>
              <span class="item-name">患者年龄</span>
              <span class="item-value">
                <el-input class="left-input" v-model="basicInfoCondition.ageFrom" placeholder="最小年龄"
                  :disabled="!basicInfoSelectedStatus.ageFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="basicInfoCondition.ageTo" placeholder="最大年龄"
                  :disabled="!basicInfoSelectedStatus.ageFrom"></el-input>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.birthDateFrom"></el-checkbox>
              <span class="item-name">出生日期</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="basicInfoCondition.birthDateFrom" placeholder="最早日期"
                  :disabled="!basicInfoSelectedStatus.birthDateFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="basicInfoCondition.birthDateTo" placeholder="最晚日期"
                  :disabled="!basicInfoSelectedStatus.birthDateFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.nation"></el-checkbox>
              <span class="item-name">民族</span>
              <span class="item-value">
                <el-input class="normal-input" v-model="basicInfoCondition.nation" placeholder="请输入民族"
                  :disabled="!basicInfoSelectedStatus.nation"></el-input>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.sex"></el-checkbox>
              <span class="item-name">性别</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.sex" placeholder="请输入性别"
                  :disabled="!basicInfoSelectedStatus.sex"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.marryType"></el-checkbox>
              <span class="item-name">婚姻状况</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.marryType"
                  :disabled="!basicInfoSelectedStatus.marryType"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.qualification"></el-checkbox>
              <span class="item-name">学历</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.qualification"
                  :disabled="!basicInfoSelectedStatus.qualification"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.career"></el-checkbox>
              <span class="item-name">职业</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.career"
                  :disabled="!basicInfoSelectedStatus.career"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.bloodType"></el-checkbox>
              <span class="item-name">血型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.bloodType"
                  :disabled="!basicInfoSelectedStatus.bloodType"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.econType"></el-checkbox>
              <span class="item-name">经济现状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.econType"
                  :disabled="!basicInfoSelectedStatus.econType"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.liveType"></el-checkbox>
              <span class="item-name">居住现状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.liveType"
                  :disabled="!basicInfoSelectedStatus.liveType"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.homeProvince"></el-checkbox>
              <span class="item-name">籍贯</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.homeProvince"
                  :disabled="!basicInfoSelectedStatus.homeProvince"></el-select>
              </span>
            </div>
          </div>
        </div>
        <div class="folding-box">
          <div class="title" @click="toggleDiseaseInfoDisplay">
            病症信息
            <span class="iconfont" :class="{'icon-up': displayDiseaseInfoCondition, 'icon-down': !displayDiseaseInfoCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiseaseInfoCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.diseaseType"></el-checkbox>
              <span class="item-name">疾病类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.diseaseType" placeholder="请选择"
                  :disabled="!diseaseInfoSelectedStatus.diseaseType"></el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.ariAgeFrom"></el-checkbox>
              <span class="item-name">起病年龄</span>
              <span class="item-value">
                <el-input class="left-input" v-model="diseaseInfoCondition.ariAgeFrom" placeholder="最小年龄"
                  :disabled="!diseaseInfoSelectedStatus.ariAgeFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="diseaseInfoCondition.ariAgeTo" placeholder="最大年龄"
                  :disabled="!diseaseInfoSelectedStatus.ariAgeFrom"></el-input>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firSym"></el-checkbox>
              <span class="item-name">首发症状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.firSym" multiple
                  :disabled="!diseaseInfoSelectedStatus.firSym">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firBody"></el-checkbox>
              <span class="item-name">首发部位</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.firBody" multiple
                  :disabled="!diseaseInfoSelectedStatus.firBody">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firTimeFrom"></el-checkbox>
              <span class="item-name">初诊时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diseaseInfoCondition.firTimeFrom" placeholder="最早日期"
                  :disabled="!diseaseInfoSelectedStatus.firTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diseaseInfoCondition.firTimeTo" placeholder="最晚日期"
                  :disabled="!diseaseInfoSelectedStatus.firTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.surTimeFrom"></el-checkbox>
              <span class="item-name">确诊时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diseaseInfoCondition.surTimeFrom" placeholder="最早日期"
                  :disabled="!diseaseInfoSelectedStatus.surTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diseaseInfoCondition.surTimeTo" placeholder="最晚日期"
                  :disabled="!diseaseInfoSelectedStatus.surTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.diagMode"></el-checkbox>
              <span class="item-name">诊断方式</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.diagMode" multiple
                  :disabled="!diseaseInfoSelectedStatus.diagMode">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.treatPro"></el-checkbox>
              <span class="item-name">诊断项目</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.treatPro" multiple
                  :disabled="!diseaseInfoSelectedStatus.treatPro">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firMed"></el-checkbox>
              <span class="item-name">初次用药</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.firMed" multiple
                  :disabled="!diseaseInfoSelectedStatus.firMed">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.getDiscFac"></el-checkbox>
              <span class="item-name long-name">初获信息途径</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.getDiscFac" multiple
                  :disabled="!diseaseInfoSelectedStatus.getDiscFac">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.getDiscFac0"></el-checkbox>
              <span class="item-name long-name">不断获取途径</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.getDiscFac0" multiple
                  :disabled="!diseaseInfoSelectedStatus.getDiscFac0">
                  <el-option :label="'就想试一试'" :value="0"></el-option>
                  <el-option :label="'就想试一试'" :value="1"></el-option>
                  <el-option :label="'就想试一试'" :value="2"></el-option>
                  <el-option :label="'就想试一试'" :value="3"></el-option>
                  <el-option :label="'就想试一试'" :value="4"></el-option>
                </el-select>
              </span>
            </div>
          </div>

          <div class="blank-area"></div>
        </div>
      </div>
    </div>
    <div class="toggle-condition-button" :class="{'hide-condition-status': !displayCondition}" @click="toggleConditonDisplay">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <div class="content-area" :class="{'hide-condition-status': !displayCondition}">

    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
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
      displayCondition: true,

      displayBasicInfoCondition: true,
      basicInfoCondition: {},
      basicInfoSelectedStatus: {},
      displayDiseaseInfoCondition: true,
      diseaseInfoCondition: {},
      diseaseInfoSelectedStatus: {}
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
      return this.displayCondition ? 'icon-arrow-left' : 'icon-arrow-right';
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
      this.displayCondition = !this.displayCondition;
    },
    updateScrollList() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollList);
        Ps.initialize(this.$refs.scrollList, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    toggleBasicInfoDisplay() {
      this.displayBasicInfoCondition = !this.displayBasicInfoCondition;
      setTimeout(() => {
        this.updateScrollList();  // 等动画结束后再刷新列表滚动条
      }, 300);
    },
    toggleDiseaseInfoDisplay() {
      this.displayDiseaseInfoCondition = !this.displayDiseaseInfoCondition;
      setTimeout(() => {
        this.updateScrollList();  // 等动画结束后再刷新列表滚动条
      }, 300);
    },
    initCondition() {
      let basicInfoFieldNames = ['ageFrom', 'ageTo', 'birthDateFrom', 'birthDateTo',
        'nation', 'sex', 'marryType', 'qualification', 'career', 'bloodType', 'econType',
        'liveType', 'homeProvince'];
      basicInfoFieldNames.forEach((fieldName) => {
        this.$set(this.basicInfoCondition, fieldName, '');
        this.$set(this.basicInfoSelectedStatus, fieldName, false);
      });
      let diseaseInfoFieldNames = ['diseaseType', 'ariAgeFrom', 'ariAgeTo', 'firSym',
        'firBody', 'firTimeFrom', 'firTimeTo', 'surTimeFrom', 'surTimeTo',
        'diagMode', 'treatPro', 'firMed', 'getDisFac', 'getDisFac0'];
      diseaseInfoFieldNames.forEach((fieldName) => {
        this.$set(this.diseaseInfoCondition, fieldName, '');
        this.$set(this.diseaseInfoSelectedStatus, fieldName, false);
      });
    }
  },
  created() {
    this.initCondition();
  },
  mounted() {
    this.updateScrollList();
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

@condition-area-width: 350px;
@tabs-wrapper-height: 35px;
@tabs-wrapper-margin-bottom: 2px;

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
    width: @condition-area-width;
    height: 100%;
    .tabs-wrapper  {
      position: relative;
      width: 100%;
      height: @tabs-wrapper-height;
      margin-bottom: @tabs-wrapper-margin-bottom;
      box-shadow: 0 2px 3px @light-gray-color;
      font-size: 0;
      .tab {
        display: inline-block;
        width: 50%;
        height: 100%;
        line-height: @tabs-wrapper-height;
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
          transform: translateX(52px);
        }
        &.second-tab {
          transform: translateX(52px + @condition-area-width * 0.5);
        }
      }
    }
    .scroll-area {
      position: relative;
      width: 100%;
      height: calc(~"100% - @{tabs-wrapper-height} - @{tabs-wrapper-margin-bottom}");
      box-sizing: border-box;
      overflow: hidden;
      .folding-box {
        width: 100%;
        margin-bottom: 10px;
        .blank-area {
          width: 100%;
          height: 250px;
        }
        .title {
          padding-left: 15px;
          width: 100%;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          text-align: left;
          font-size: @normal-font-size;
          font-weight: bold;
          background-color: @light-font-color;
          color: #fff;
          cursor: pointer;
          .iconfont {
            padding-left: 5px;
            font-size: @small-font-size;
            color: #fff;
          }
          &:hover {
            opacity: 0.8;
          }
          &:active {
            opacity: 0.9;
          }
        }
        .content {
          position: relative;
          padding: 5px 0;
          box-sizing: border-box;
          height: auto;
          font-size: @normal-font-size;
          transition: 0.3s;
          overflow: hidden;
          &.folded {
            padding: 0;
            height: 0;
            opacity: 0.3;
          }
          .item {
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: left;
            &.auto-resize {
              height: auto;
              .item-value {
                position: relative;
                width: 225px;
                left: 110px;
                padding-bottom: 3px;
              }
            }
            .item-checkbox {
              position: absolute;
              left: 10px;
            }
            .item-name {
              display: inline-block;
              position: absolute;
              left: 40px;
              &.long-name {
                left: 35px;
                font-size: @small-font-size;
              }
            }
            .item-value {
              display: inline-block;
              position: absolute;
              left: 110px;
              right: 15px;
              .left-input, .right-input {
                display: inline-block;
                position: absolute;
                width: 100px;
                .el-input__icon {
                  display: none;
                }
                .el-input__inner {
                  padding: 3px 10px;
                }
              }
              .left-input {
                left: 0;
              }
              .right-input {
                right: 0;
              }
              .middle-text {
                position: absolute;
                left: 110px;
              }
              .normal-input {
                display: inline-block;
              }
              .el-input {
                .el-input__inner {
                  height: 30px;
                  border: none;
                  background-color: @screen-color;
                }
              }
              .el-select {
                width: 100%;
              }
            }
          }
        }
      }
      .ps__scrollbar-y-rail {
        position: absolute;
        width: 15px;
        right: 0;
        padding: 0 3px;
        box-sizing: border-box;
        opacity: 0.3;
        transition: opacity 0.3s, padding 0.2s;
        .ps__scrollbar-y {
          position: relative;
          background-color: #aaa;
          border-radius: 20px;
        }
      }
      &:hover {
        .ps__scrollbar-y-rail {
          opacity: 0.6;
          &:hover {
            padding: 0;
          }
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
