<template lang="html">
  <div class="patient-info">
    <div class="tabs-wrapper">
      <div class="tab left-tab" :class="{'current-tab': currentTab === 'personalInfo'}"
        @click="choosePersonal" v-show="existed">个人信息</div>
      <div class="tab right-tab" :class="{'current-tab': currentTab === 'diagnosticInfo'}"
        @click="chooseDiagnostic" v-show="existed">诊断信息</div>
      <div class="patient-id" :class="{'left-shift': false}" v-show="existed">患者ID: {{patientId}}</div>
      <!-- <div class="button" v-show="existed && listType==='myPatients'">导出病历</div> -->
      <div class="tab-bottom-bar" :class="currentTabBottomBar" v-show="this.existed"></div>
      <div class="title" v-show="!existed">新增患者</div>
    </div>
    <div class="info-wrapper" ref="scrollArea">
      <div class="shared-info" v-show="this.existed">
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
            <span class="group-wrapper">
              <span v-for="group in belongGroups" class="group">{{ group.groupName }}</span>
            </span>
            <span class="iconfont icon-group" @click="toggleGroupPanel"></span>
          </span>
        </div>
      </div>
      <div class="respective-info">
        <router-view v-if="this.existed" :patient-info="patientInfo" :patient-case-list="patientCaseList"></router-view>
        <basic-info v-else ref="newPatientWindow" :basic-info="{}"></basic-info>
      </div>
    </div>
    <diagnostic-detail class="diagnostic-detail"></diagnostic-detail>
    <scale-modal class="diagnostic-handle-scale"></scale-modal>
    <group-panel class="group-panel" :class="{'hide': !displayGroupPanel}" :belongGroups="belongGroups"
      :display="displayGroupPanel" :patientId="Number(patientId)" @hideGroupPanel="hideGroupPanel"
      @updatePatientGroupInfo="updatePatientGroupInfo"></group-panel>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

import { getPatientInfo, getPatientGroupInfo, getPatientCaseList } from 'api/patient';

import DiagnosticDetail from 'components/views/patient/diagnosticinfo/diagnosticdetail/DiagnosticDetail';
import ScaleModal from 'components/views/modal/scalemodal/ScaleModal';
import BasicInfo from 'components/views/patient/personalinfo/basicinfo/BasicInfo';
import GroupPanel from 'components/public/filterpanel/grouppanel/GroupPanel';

export default {
  data() {
    return {
      patientInfo: {},
      patientCaseList: [],
      belongDoctor: '',
      belongGroups: [],
      createDate: '',
      displayGroupPanel: false
    };
  },
  computed: {
    patientId() {
      return this.$route.params.id;
    },
    existed() {
      return !(this.patientId === 'newPatient');
    },
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

      // 首先判断是不是新增患者
      if (!this.existed) {
        this.$refs.newPatientWindow.$emit(this.EDIT);
        return;
      }

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
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      getPatientInfo(this.patientId).then((data) => {
        // console.log('patientInfo: ', data);
        this.patientInfo = data;
        this.belongDoctor = data.belongDoctor;
        this.belongGroups = data.belongGroups;
        this.createDate = data.createDate;
      }, (error) => {
        console.log(error);
      });

      this.updatePatientCaseList();
    },
    updatePatientCaseList() {
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      getPatientCaseList(this.patientId).then((data) => {
        // console.log('patientCaseList: ', data);
        this.patientCaseList = data;
      }, (error) => {
        console.log(error);
      });
    },
    updatePatientGroupInfo() {
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      var patientInfo = {
        'patientId': this.patientId
      };
      getPatientGroupInfo(patientInfo).then((data) => {
        this.belongGroups = data;
      }, (error) => {
        console.log(error);
      });
    },
    toggleGroupPanel() {
      this.displayGroupPanel = !this.displayGroupPanel;
    },
    hideGroupPanel() {
      this.displayGroupPanel = false;
    }
  },
  components: {
    DiagnosticDetail,
    ScaleModal,
    BasicInfo,
    GroupPanel
  },
  mounted() {
    this.updatePatientInfo();
    this.updatePatientGroupInfo();

    this.checkRoute();

    this.updateScrollbar();
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);

    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);

    // 监听子组件是否要求刷新病患数据
    Bus.$on(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);

    // 监听组件是否要求更新诊断卡片列表
    Bus.$on(this.UPDATE_PATIENT_CASE_LIST, this.updatePatientCaseList);
  },
  watch: {
    $route() {
      this.checkRoute();
      this.displayGroupPanel = false;  // 路由变化时，关闭分组面板
      this.$refs.scrollArea.scrollTop = 0;  // 切换自组件时，滚动条还原到顶部
      this.updateScrollbar();
    }
  },
  beforeDestroy() {
    // 在组件销毁前，移除绑定在当前组件下的事件监听器
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
    Bus.$off(this.UPDATE_PATIENT_CASE_LIST, this.updatePatientCaseList);
  },
  existed() {
    // 因为 existed 这个变量变化时会导致几个子面板的 显示／隐藏，所以需要它们重新计算各自内部的卡片宽度
    Bus.$emit(this.RECALCULATE_CARD_WIDTH);
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
  .group-panel {
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s;
    z-index: 200;
    &.hide {
      right: -@group-panel-width;
    }
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
      line-height: @tabs-wrapper-height;
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
    .patient-id {
      position: absolute;
      right: 30px;
      line-height: @tabs-wrapper-height;
      font-size: @normal-font-size;
      font-weight: bold;
      color: @light-font-color;
      &.left-shift {
        transform: translateX(-@small-button-width);
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
    .title {
      position: absolute;
      left: @first-tab-x;
      width: @tab-width;
      height: 100%;
      line-height: 40px;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      color: @font-color;
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
        height: 30px;
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
          .group-wrapper {
            display: inline-block;
            max-width: calc(~"100% - 85px - 50px");
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .group {
              display: inline-block;
              padding: 0 5px;
              margin-right: 8px;
              background-color: @light-font-color;
              border-radius: 5px;
              color: #fff;
            }
          }
        }
        .info-title {
          display: inline-block;
          width: 85px;
          vertical-align: top;
          color: @font-color;
        }
        .info-text {
          color: @light-font-color;
          .iconfont {
            display: inline-block;
            font-size: 20px;
            line-height: 30px;
            vertical-align: top;
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
