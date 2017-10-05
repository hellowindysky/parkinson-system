<template lang="html">
  <div class="patient-info">
    <div class="tabs-wrapper">
      <div class="tab left-tab" :class="{'current-tab': currentTab === 'personalInfo'}" @click="choosePersonal">个人信息</div>
      <div class="tab right-tab" :class="{'current-tab': currentTab === 'diagnosticInfo'}" @click="chooseDiagnostic">诊断信息</div>
      <div class="button">导出病历</div>
      <div class="tab-bottom-bar" :class="currentTabBottomBar"></div>
    </div>
    <div class="info-wrapper" ref="scrollArea">
      <div class="shared-info">
        <div class="info adscription">
          <span class="info-title">归属医生: </span>
          <span class="info-text">{{ belongDoctor }}</span>
        </div>
        <div class="info create-time">
          <span class="info-title">创建时间: </span>
          <span class="info-text">{{ createDate }}</span>
        </div>
        <div class="info groups">
          <span class="info-title">分组情况: </span>
          <span class="info-text">
            <span v-for="group in belongGroups" class="group">{{ group.groupName }}</span>
            <span class="iconfont icon-plus"></span>
          </span>
        </div>
      </div>
      <div class="respective-info">
        <router-view :patient-info="patientInfo" :patient-case-list="patientCaseList"></router-view>
      </div>
    </div>
    <DiagnosticDetail class="diagnostic-detail"></DiagnosticDetail>
    <DiagnosticHandleScale class="diagnostic-handle-scale"></DiagnosticHandleScale>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

import { getPatientInfo, getPatientCaseList } from 'api/patient';

import DiagnosticDetail from 'components/diagnosticdetail/DiagnosticDetail';
import DiagnosticHandleScale from 'components/diagnostichandlescale/DiagnosticHandleScale';

export default {
  data() {
    return {
      patientInfo: {},
      patientCaseList: [],
      belongDoctor: '',
      belongGroups: [],
      createDate: ''
    };
  },
  computed: {
    listType() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return 'myPatients';
      } else if (this.$route.matched.some(record => record.meta.otherPatients)) {
        return 'otherPatients';
      } else {
        return 'unknown';
      }
    },
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
    checkRoute() {
      var path = this.$route.path;
      var rePersonal = new RegExp(/\/personalInfo(\/|$)/);
      var reDiagnostic = new RegExp(/\/diagnosticInfo(\/|$)/);

      var withoutPersonalOrDiagostic = !rePersonal.test(path) && !reDiagnostic.test(path);

      // 路由还停留在在病患信息这一层，但没有指明是个人信息还是诊断信息，那么就默认跳转到个人信息
      if (this.listType === 'myPatients' && withoutPersonalOrDiagostic) {
        this.$router.replace({ name: 'personalInfo' });
      } else if (this.listType === 'otherPatients' && withoutPersonalOrDiagostic) {
        this.$router.replace({ name: 'otherPersonalInfo' });
      }
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        // 之所以弃用 update 方法，是因为它在某些情况下会出现问题，导致滚动条不能有效刷新
        // Ps.update(this.$refs.scrollArea);

        // 如果之前有绑定滚动条的话，先进行解除
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updatePatientInfo() {
      getPatientInfo(this.$route.params.id).then((data) => {
        // console.log('patientInfo: ', data);
        this.patientInfo = data;
        this.belongDoctor = data.belongDoctor;
        this.belongGroups = data.belongGroups;
        this.createDate = data.createDate;
      });
      getPatientCaseList(this.$route.params.id).then((data) => {
        // console.log('patientCaseList: ', data);
        this.patientCaseList = data;
      });
    }
  },
  components: {
    DiagnosticDetail,
    DiagnosticHandleScale
  },
  mounted() {
    this.updatePatientInfo();

    this.checkRoute();

    this.updateScrollbar();

    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);

    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);

    // 监听子组件是否要求刷新病患数据
    Bus.$on(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
  },
  watch: {
    $route() {
      this.checkRoute();
    }
  },
  beforeDestroy() {
    // 在组件销毁前，移除绑定在当前组件下的事件监听器
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@tabs-wrapper-height: 40px;
@tab-width: 70px;
@first-tab-x: 20px;
@second-tab-x: 120px;

@margin-right: 15px;

.patient-info {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .diagnostic-detail {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 300;
  }
  .diagnostic-handle-scale {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 400;
    background: @screen-color;
  }
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
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      cursor: pointer;
      background-color: @button-color;
      right: 10px;
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
    height: calc(~"100% - @{tabs-wrapper-height} - @{vertical-spacing}");
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
          width: 100%;
          top: 40px;
          .group {
            display: inline-block;
            padding-right: 10px;
          }
        }
        .info-title {
          display: inline-block;
          width: 85px;
          color: @font-color;
        }
        .info-text {
          color: @light-font-color;
          .iconfont {
            display: inline-block;
            margin-left: 5px;
            padding: 5px;
            font-weight: bold;
            font-size: 16px;
            line-height: @normal-font-size;
            transform: translateY(1px);
            cursor: pointer;
            &:hover {
              color: darken(@light-font-color, 20%);
            }
            &:active {
              color: darken(@light-font-color, 10%);
            }
          }
        }
      }
    }
    .respective-info {
      position: relative;
      margin-right: @margin-right;
      box-sizing: border-box;
      background-color: @background-color;
    }

    // 下面这组 CSS 是为了让 perfect-scrollbar正常工作的，不知道为什么，默认状态下这个组件不能正常显示
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
</style>
