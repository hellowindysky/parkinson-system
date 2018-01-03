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
    <application-modal></application-modal>
    <return-application-modal></return-application-modal>
    <pass-ratification-modal></pass-ratification-modal>
    <endof-followup-modal></endof-followup-modal>

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

import passwordModal from 'components/views/modal/passwordmodal/PasswordModal';
import authorizationModal from 'components/views/modal/authorizationmodal/AuthorizationModal';
import secretAgreementModal from 'components/views/modal/secretagreementmodal/SecretAgreementModal';
import messageModal from 'components/views/modal/messagemodal/MessageModal';
import groupModal from 'components/views/modal/groupmodal/GroupModal';
import modalBox from 'components/views/modal/modalbox/ModalBox';
import medicineModal from 'components/views/modal/medicinemodal/MedicineModal';
import preEvaluationModal from 'components/views/modal/preevaluationmodal/PreEvaluationModal';
import surgicalMethodModal from 'components/views/modal/surgicalmethodmodal/SurgicalMethodModal';
import operativeComplicationModal from 'components/views/modal/operativecomplicationmodal/OperativeComplicationModal';
import dbsModal from 'components/views/modal/dbsmodal/DbsModal';
import physiontherapyModal from 'components/views/modal/physiontherapymodal/PhysiontherapyModal';
import treatmentEvaluationModal from 'components/views/modal/treatmentEvaluationmodal/TreatmentEvaluationModal';
import vitalSignsModal from 'components/views/modal/vitalsignsmodal/VitalSignsModal';
import neurologicModal from 'components/views/modal/neurologicmodal/NeurologicModal';
import geneModal from 'components/views/modal/genemodal/GeneModal';
import biochemicalExamModal from 'components/views/modal/biochemicalexammodal/BiochemicalExamModal';
import neuroelectricModal from 'components/views/modal/neuroelectricmodal/NeuroelectricModal';
import imageModal from 'components/views/modal/imagemodal/ImageModal';
import firstSymptomsModal from 'components/views/modal/firstsymptomsmodal/FirstSymptomsModal';
import firstTreatmentModal from 'components/views/modal/firsttreatmentmodal/FirstTreatmentModal';
import diagnosticRecordModal from 'components/views/modal/diagnosticrecordmodal/DiagnosticRecordModal';
import applicationModal from 'components/views/modal/applicationmodal/ApplicationModal';
import returnApplicationModal from 'components/views/modal/returnapplicationmodal/ReturnApplicationModal';
import passRatificationModal from 'components/views/modal/passratificationmodal/PassRatificationModal';
import endofFollowupModal from 'components/views/modal/endoffollowupmodal/EndofFollowupModal';

import filterPanel from 'components/public/filterpanel/FilterPanel';
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
    vitalSignsModal,
    neurologicModal,
    geneModal,
    biochemicalExamModal,
    neuroelectricModal,
    imageModal,
    firstSymptomsModal,
    firstTreatmentModal,
    diagnosticRecordModal,
    applicationModal,
    returnApplicationModal,
    passRatificationModal,
    endofFollowupModal,

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
