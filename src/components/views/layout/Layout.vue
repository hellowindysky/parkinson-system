<template lang="html">
  <div class="app-wrapper" @click="clickScreen">
    <topbar class="topbar" :showFilterPanel="showFilterPanel"></topbar>
    <sidebar class="sidebar"></sidebar>
    <router-view class="content"></router-view>

    <component :is="componentName"></component>

    <filter-panel :showFilterPanel="showFilterPanel"></filter-panel>
    <secret-agreement-modal></secret-agreement-modal>
    <!-- <serious-adverse-event-modal></serious-adverse-event-modal> -->
    <choice-panel></choice-panel>
    <confirm-box></confirm-box>
    <notice-box></notice-box>
    <!-- <sleep-monitor-modal></sleep-monitor-modal> -->
    <water-mark></water-mark>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import { setRequestToken } from 'api/common.js';

import topbar from 'views/top-bar/Topbar';
import sidebar from 'views/side-bar/Sidebar';

const passwordModal = () => import(/* webpackChunkName: 'modal' */ 'modal/password-modal/PasswordModal');
const authorizationModal = () => import(/* webpackChunkName: 'modal' */ 'modal/authorization-modal/AuthorizationModal');
const messageModal = () => import(/* webpackChunkName: 'modal' */ 'modal/message-modal/MessageModal');
const groupModal = () => import(/* webpackChunkName: 'modal' */ 'modal/group-modal/GroupModal');

const modalBox = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/modal-box/ModalBox');
const firstSymptomsModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/first-symptoms-modal/FirstSymptomsModal');
const firstTreatmentModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/first-treatment-modal/FirstTreatmentModal');
const diagnosticRecordModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/diagnostic-record-modal/DiagnosticRecordModal');
const chiefComplaintSymptomsModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/chief-complaint-symptoms-modal/ChiefComplaintSymptomsModal');

const medicineModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/medicine-modal/MedicineModal');
const preEvaluationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/pre-evaluation-modal/PreEvaluationModal');
const surgicalMethodModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/surgical-method-modal/SurgicalMethodModal');
const operativeComplicationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/operative-complication-modal/OperativeComplicationModal');
const dbsModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/dbs-modal/DbsModal');
const physiontherapyModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/physiontherapy-modal/PhysiontherapyModal');
const treatmentEvaluationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/treatment-evaluation-modal/TreatmentEvaluationModal');
const adverseEventModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/adverse-event-modal/AdverseEventModal');
const seriousAdverseEventModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/serious-adverse-event-modal/SeriousAdverseEventModal');
const vitalSignsModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/vital-signs-modal/VitalSignsModal');
const neurologicModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/neurologic-modal/NeurologicModal');
const geneModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/gene-modal/GeneModal');
const biochemicalExamModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/biochemical-exam-modal/BiochemicalExamModal');
const neuroelectricModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/neuroelectric-modal/NeuroelectricModal');
const gaitPostureModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/gait-posture-modal/GaitPostureModal');
const sleepMonitorModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/sleep-monitor-modal/SleepMonitorModal');
const imageModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/image-modal/ImageModal');

const applicationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/application-modal/ApplicationModal');
const rejectionModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/rejection-modal/RejectionModal');
const ratificationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/ratification-modal/RatificationModal');
const terminationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/termination-modal/TerminationModal');
const followUpTerminationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/follow-up-termination-modal/FollowUpTerminationModal');
const experimentStepModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/experiment-step-modal/ExperimentStepModal');

const filterPanel = () => import(/* webpackChunkName: 'filterPanel' */ 'public/filter-panel/FilterPanel');

import choicePanel from 'public/choice-panel/ChoicePanel';
import confirmBox from 'public/confirm-box/ConfirmBox';
import noticeBox from 'public/notice-box/NoticeBox';
import secretAgreementModal from 'modal/secret-agreement-modal/SecretAgreementModal';

import waterMark from 'public/water-mark/WaterMark';

export default {
  data() {
    return {
      showFilterPanel: false,
      componentName: ''
    };
  },
  components: {
    topbar,
    sidebar,
    passwordModal,
    authorizationModal,
    secretAgreementModal,
    messageModal,
    groupModal,
    modalBox,
    medicineModal,
    preEvaluationModal,
    surgicalMethodModal,
    operativeComplicationModal,
    dbsModal,
    physiontherapyModal,
    treatmentEvaluationModal,
    adverseEventModal,
    seriousAdverseEventModal,
    vitalSignsModal,
    neurologicModal,
    geneModal,
    biochemicalExamModal,
    neuroelectricModal,
    gaitPostureModal,
    sleepMonitorModal,
    imageModal,
    firstSymptomsModal,
    firstTreatmentModal,
    diagnosticRecordModal,
    chiefComplaintSymptomsModal,
    applicationModal,
    rejectionModal,
    ratificationModal,
    terminationModal,
    followUpTerminationModal,
    experimentStepModal,

    filterPanel,
    choicePanel,
    confirmBox,
    noticeBox,

    waterMark
  },
  computed: {
    isSupportAccount() {
      // 1 患者 2 医生 3 管理员 4 医院管理员 5 技术支持人员
      var userType = parseInt(sessionStorage.getItem('userType'), 10);
      return userType === 5;
    }
  },
  methods: {
    clickScreen() {
      // 这个函数的作用有两个，一个是通过失焦来关闭某些面板，另一个是检查是否长时间没有操作
      Bus.$emit(this.BLUR_ON_SCREEN);

      this.checkIfNoOperationForTooLong(this.$store.state.lastOperationTime);
    },
    checkIfNoOperationForTooLong(lastOperationTime) {
      this.$store.commit('UPDATE_LAST_OPERATION_TIME');
      var thisOperationTime = this.$store.state.lastOperationTime;

      // 如果本次点击的时间离上一次的点击时间间隔过长，则返回登录界面
      if (thisOperationTime - lastOperationTime > this.MAX_NO_OPERATION_TIME) {
        this.$message({
          message: '长时间未操作，请重新登录',
          type: 'warning',
          duration: 2000
        });
        this.$router.push('/login');
      }
    },
    toggleFilterPanelDisplay() {
      // 为什么 FilterPanel 的状态需要由 Layout 来控制呢？
      // 因为 Header 组件需要知道它的开关情况，所以由 Header 的父组件 Layout 来控制，会方便一些
      this.showFilterPanel = !this.showFilterPanel;
    },
    handleDeprivationOfAuthority() {
      // 如果已经登录后，被医生取消了授权，则录入员这边要回到登录界面
      this.$message({
        message: '当前支持医生取消了对你的授权，请重新登录',
        type: 'warning',
        duration: 2000
      });
      this.$router.push('/login');
    }
  },
  mounted() {
    window.onresize = () => {
      Bus.$emit(this.SCREEN_SIZE_CHANGE);
    };

    var lastOperationTime = Number(sessionStorage.getItem('lastOperationTime'));
    lastOperationTime = lastOperationTime ? lastOperationTime : 0;
    this.checkIfNoOperationForTooLong(lastOperationTime);

    Bus.$on(this.TOGGLE_FILTER_PANEL_DISPLAY, this.toggleFilterPanelDisplay);
    Bus.$on(this.DEPRIVED_OF_AUTHORITY_BY_DOCTOR, this.handleDeprivationOfAuthority);

    let dynamicArr = [];
    // 等待挂载动态组件
    Bus.$on(this.MOUNT_DYNAMIC_COMPONENT, (componentName, showWhichModal, cardOperation, item, showEdit, heightAndWeight) => {
      dynamicArr = [showWhichModal, cardOperation, item, showEdit, heightAndWeight];
      this.componentName = componentName;
    });
    // 等待动态组件完成挂载
    Bus.$on(this.DYNAMIC_COMPONENT_MOUNTED, () => {
      Bus.$emit(dynamicArr[0], dynamicArr[1], dynamicArr[2], dynamicArr[3], dynamicArr[4]);
    });
    // 卸载动态组件
    Bus.$on(this.UNLOAD_DYNAMIC_COMPONENT, () => {
      this.componentName = '';
    });
  },
  beforeRouteEnter(to, from, next) {
    let token = sessionStorage.getItem('token');
    let userType = parseInt(sessionStorage.getItem('userType'), 10);
    let supportedDoctor = sessionStorage.getItem('supportedDoctor');

    if (sessionStorage.getItem('token') === null) {
      // 如果还未获得 token 信息，则说明还没有登录，所以返回登录界面
      next({path: '/login'});
      return;

    } else if (userType === 5 && supportedDoctor === null) {
      // 如果发现是技术支持专员，而且还没有选择医生，那么就跳转到医生选择界面
      next({path: '/doctorSelection'});

    } else {
      setRequestToken(token);
      next();
    }
  },
  beforeDestroy() {
    Bus.$off(this.TOGGLE_FILTER_PANEL_DISPLAY);
    Bus.$off(this.DEPRIVED_OF_AUTHORITY_BY_DOCTOR);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.app-wrapper {
  position: relative;
  width: 100%;
  min-width: @min-screen-width;
  height: 100vh;
  background-color: @screen-color;
  font-size: @normal-font-size;
  z-index: 100;
  .topbar {
    display: block;
    position: relative;
    width: 100%;
    height: @header-height;
    margin-bottom: @header-margin-bottom;
  }
  .sidebar {
    position: absolute;
    left: 0;
    top: @header-height + @header-margin-bottom;
    width: @sidebar-width;
    height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  }
  .content {
    display: block;
    position: absolute;
    left: @sidebar-width;
    top: @header-height + @header-margin-bottom;
    width: calc(~"100% - @{sidebar-width}");
    height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  }
}
</style>
