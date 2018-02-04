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

import topbar from 'views/topbar/Topbar';
import sidebar from 'views/sidebar/Sidebar';

const passwordModal = () => import(/* webpackChunkName: 'modal' */ 'modal/passwordmodal/PasswordModal');
const authorizationModal = () => import(/* webpackChunkName: 'modal' */ 'modal/authorizationmodal/AuthorizationModal');
const secretAgreementModal = () => import(/* webpackChunkName: 'modal' */ 'modal/secretagreementmodal/SecretAgreementModal');
const messageModal = () => import(/* webpackChunkName: 'modal' */ 'modal/messagemodal/MessageModal');
const groupModal = () => import(/* webpackChunkName: 'modal' */ 'modal/groupmodal/GroupModal');

const modalBox = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/modalbox/ModalBox');
const firstSymptomsModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/firstsymptomsmodal/FirstSymptomsModal');
const firstTreatmentModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/firsttreatmentmodal/FirstTreatmentModal');
const diagnosticRecordModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/diagnosticrecordmodal/DiagnosticRecordModal');
const chiefComplaintSymptomsModal = () => import(/* webpackChunkName: 'personalInfoModal' */ 'modal/chiefcomplaintsymptomsmodal/ChiefComplaintSymptomsModal');

const medicineModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/medicinemodal/MedicineModal');
const preEvaluationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/preevaluationmodal/PreEvaluationModal');
const surgicalMethodModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/surgicalmethodmodal/SurgicalMethodModal');
const operativeComplicationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/operativecomplicationmodal/OperativeComplicationModal');
const dbsModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/dbsmodal/DbsModal');
const physiontherapyModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/physiontherapymodal/PhysiontherapyModal');
const treatmentEvaluationModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/treatmentEvaluationmodal/TreatmentEvaluationModal');
const adverseEventModal = () => import(/* webpackChunkName: 'treatmentModal' */ 'modal/adverseeventmodal/AdverseEventModal');

const vitalSignsModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/vitalsignsmodal/VitalSignsModal');
const neurologicModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/neurologicmodal/NeurologicModal');
const geneModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/genemodal/GeneModal');
const biochemicalExamModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/biochemicalexammodal/BiochemicalExamModal');
const neuroelectricModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/neuroelectricmodal/NeuroelectricModal');
const imageModal = () => import(/* webpackChunkName: 'examinationModal' */ 'modal/imagemodal/ImageModal');

const applicationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/applicationmodal/ApplicationModal');
const rejectionModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/rejectionmodal/RejectionModal');
const ratificationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/ratificationmodal/RatificationModal');
const terminationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/terminationmodal/TerminationModal');
const followUpTerminationModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/followupterminationmodal/FollowUpTerminationModal');
const experimentStepModal = () => import(/* webpackChunkName: 'experimentModal' */ 'modal/experimentstepmodal/ExperimentStepModal');

const filterPanel = () => import(/* webpackChunkName: 'filterPanel' */ 'public/filterpanel/FilterPanel');

import choicePanel from 'public/choicepanel/ChoicePanel';
import confirmBox from 'public/confirmbox/ConfirmBox';
import noticeBox from 'public/noticebox/NoticeBox';

import waterMark from 'public/watermark/WaterMark';

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
