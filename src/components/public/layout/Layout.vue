<template lang="html">
  <div class="app-wrapper" @click="clickScreen">
    <topbar class="topbar" :showFilterPanel="showFilterPanel"></topbar>
    <sidebar class="sidebar"></sidebar>
    <router-view class="content"></router-view>

    <password-modal></password-modal>
    <authorization-modal></authorization-modal>
    <secret-agreement-modal></secret-agreement-modal>
    <message-modal></message-modal>

    <group-modal></group-modal>

    <modal-box></modal-box>
    <medicine-modal></medicine-modal>
    <pre-evaluation-modal></pre-evaluation-modal>
    <surgical-method-modal></surgical-method-modal>
    <operative-complication-modal></operative-complication-modal>
    <physiontherapy-modal></physiontherapy-modal>
    <treatmentEvaluation-modal></treatmentEvaluation-modal>
    <adverse-event-modal></adverse-event-modal>
    <vitalSigns-modal></vitalSigns-modal>
    <dbs-modal></dbs-modal>
    <neurologic-modal></neurologic-modal>
    <gene-modal></gene-modal>
    <biochemical-exam-modal></biochemical-exam-modal>
    <neuroelectric-modal></neuroelectric-modal>
    <image-modal></image-modal>
    <first-symptoms-modal></first-symptoms-modal>
    <first-treatment-modal></first-treatment-modal>
    <diagnostic-record-modal></diagnostic-record-modal>
    <chief-complaint-symptoms-modal></chief-complaint-symptoms-modal>
    <application-modal></application-modal>
    <rejection-modal></rejection-modal>
    <ratification-modal></ratification-modal>
    <follow-up-termination-modal></follow-up-termination-modal>
    <termination-modal></termination-modal>
    <experiment-step-modal></experiment-step-modal>

    <filter-panel :showFilterPanel="showFilterPanel"></filter-panel>
    <choice-panel></choice-panel>
    <confirm-box></confirm-box>
    <notice-box></notice-box>

    <water-mark></water-mark>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import { setRequestToken } from 'api/common.js';

import topbar from 'components/views/topbar/Topbar';
import sidebar from 'components/views/sidebar/Sidebar';

const passwordModal = () => import(/* webpackChunkName: 'modal' */ 'components/views/modal/passwordmodal/PasswordModal');
const authorizationModal = () => import(/* webpackChunkName: 'modal' */ 'components/views/modal/authorizationmodal/AuthorizationModal');
const secretAgreementModal = () => import(/* webpackChunkName: 'modal' */ 'components/views/modal/secretagreementmodal/SecretAgreementModal');
const messageModal = () => import(/* webpackChunkName: 'modal' */ 'components/views/modal/messagemodal/MessageModal');
const groupModal = () => import(/* webpackChunkName: 'modal' */ 'components/views/modal/groupmodal/GroupModal');

const modalBox = () => import(/* webpackChunkName: 'personalInfoModal' */ 'components/views/modal/modalbox/ModalBox');
const firstSymptomsModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'components/views/modal/firstsymptomsmodal/FirstSymptomsModal');
const firstTreatmentModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'components/views/modal/firsttreatmentmodal/FirstTreatmentModal');
const diagnosticRecordModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'components/views/modal/diagnosticrecordmodal/DiagnosticRecordModal');
const chiefComplaintSymptomsModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'components/views/modal/chiefcomplaintsymptomsmodal/ChiefComplaintSymptomsModal');

const medicineModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/medicinemodal/MedicineModal');
const preEvaluationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/preevaluationmodal/PreEvaluationModal');
const surgicalMethodModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/surgicalmethodmodal/SurgicalMethodModal');
const operativeComplicationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/operativecomplicationmodal/OperativeComplicationModal');
const dbsModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/dbsmodal/DbsModal');
const physiontherapyModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/physiontherapymodal/PhysiontherapyModal');
const treatmentEvaluationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/treatmentEvaluationmodal/TreatmentEvaluationModal');
const adverseEventModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'components/views/modal/adverseeventmodal/AdverseEventModal');

const vitalSignsModal = () => import(/* webpackChunkName: 'examinationModal' */ 'components/views/modal/vitalsignsmodal/VitalSignsModal');
const neurologicModal = () => import(/* webpackChunkName: 'examinationModal' */ 'components/views/modal/neurologicmodal/NeurologicModal');
const geneModal = () => import(/* webpackChunkName: 'examinationModal' */ 'components/views/modal/genemodal/GeneModal');
const biochemicalExamModal = () => import(/* webpackChunkName: 'examinationModal' */ 'components/views/modal/biochemicalexammodal/BiochemicalExamModal');
const neuroelectricModal = () => import(/* webpackChunkName: 'examinationModal' */ 'components/views/modal/neuroelectricmodal/NeuroelectricModal');
const imageModal = () => import(/* webpackChunkName: 'examinationModal' */ 'components/views/modal/imagemodal/ImageModal');

const applicationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'components/views/modal/applicationmodal/ApplicationModal');
const rejectionModal = () => import(/* webpackChunkName: 'experimentModal' */ 'components/views/modal/rejectionmodal/RejectionModal');
const ratificationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'components/views/modal/ratificationmodal/RatificationModal');
const terminationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'components/views/modal/terminationmodal/TerminationModal');
const followUpTerminationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'components/views/modal/followupterminationmodal/FollowUpTerminationModal');
const experimentStepModal = () => import(/* webpackChunkName: 'experimentModal' */ 'components/views/modal/experimentstepmodal/ExperimentStepModal');

const filterPanel = () => import(/* webpackChunkName: 'filterPanel' */ 'components/public/filterpanel/FilterPanel');

import choicePanel from 'components/public/choicepanel/ChoicePanel';
import confirmBox from 'components/public/confirmbox/ConfirmBox';
import noticeBox from 'components/public/noticebox/NoticeBox';

import waterMark from 'components/public/watermark/WaterMark';

// 设定多长时间不操作，就返回登录界面
const RELOGIN_TIME_FOR_NO_OPERATION = 1000 * 60 * 60;

export default {
  data() {
    return {
      showFilterPanel: false
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
    vitalSignsModal,
    neurologicModal,
    geneModal,
    biochemicalExamModal,
    neuroelectricModal,
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
      sessionStorage.setItem('lastOperationTime', thisOperationTime);

      // 如果本次点击的时间离上一次的点击时间间隔过长，则返回登录界面
      if (thisOperationTime - lastOperationTime > RELOGIN_TIME_FOR_NO_OPERATION) {
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
