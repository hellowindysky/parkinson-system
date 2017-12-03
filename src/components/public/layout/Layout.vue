<template lang="html">
  <div class="app-wrapper" v-if="display" @click="blurOnScreen">
    <topbar class="topbar" :showFilterPanel="showFilterPanel"></topbar>
    <sidebar class="sidebar"></sidebar>
    <router-view class="content"></router-view>
    <password-modal></password-modal>
    <group-modal></group-modal>
    <modal-box></modal-box>
    <medicine-modal></medicine-modal>
    <pre-evaluation-modal></pre-evaluation-modal>
    <surgical-method-modal></surgical-method-modal>
    <operative-complication-modal></operative-complication-modal>
    <dbs-modal></dbs-modal>
    <nervous-system-modal></nervous-system-modal>
    <gene-modal></gene-modal>
    <biochemical-exam-modal></biochemical-exam-modal>
    <emg-modal></emg-modal>
    <image-modal></image-modal>
    <first-symptoms-modal></first-symptoms-modal>
    <first-treatment-modal></first-treatment-modal>
    <diagnostic-record-modal></diagnostic-record-modal>
    <filter-panel :showFilterPanel="showFilterPanel"></filter-panel>
    <choice-panel></choice-panel>
    <confirm-box></confirm-box>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

import topbar from 'components/views/topbar/Topbar';
import sidebar from 'components/views/sidebar/Sidebar';

import passwordModal from 'components/views/modal/passwordmodal/PasswordModal';
import groupModal from 'components/views/modal/groupmodal/GroupModal';
import modalBox from 'components/views/modal/modalbox/ModalBox';
import medicineModal from 'components/views/modal/medicinemodal/MedicineModal';
import preEvaluationModal from 'components/views/modal/preevaluationmodal/PreEvaluationModal';
import surgicalMethodModal from 'components/views/modal/surgicalmethodmodal/SurgicalMethodModal';
import operativeComplicationModal from 'components/views/modal/operativecomplicationmodal/OperativeComplicationModal';
import dbsModal from 'components/views/modal/dbsmodal/DbsModal';
import nervousSystemModal from 'components/views/modal/nervoussystemmodal/NervousSystemModal';
import geneModal from 'components/views/modal/genemodal/GeneModal';
import biochemicalExamModal from 'components/views/modal/biochemicalexammodal/BiochemicalExamModal';
import emgModal from 'components/views/modal/emgmodal/EmgModal';
import imageModal from 'components/views/modal/imagemodal/ImageModal';
import firstSymptomsModal from 'components/views/modal/firstsymptomsmodal/FirstSymptomsModal';
import firstTreatmentModal from 'components/views/modal/firsttreatmentmodal/FirstTreatmentModal';
import diagnosticRecordModal from 'components/views/modal/diagnosticrecordmodal/DiagnosticRecordModal';

import filterPanel from 'components/public/filterpanel/FilterPanel';
import choicePanel from 'components/public/choicepanel/ChoicePanel';
import confirmBox from 'components/public/confirmbox/ConfirmBox';

export default {
  data() {
    return {
      display: false,
      showFilterPanel: false
    };
  },
  components: {
    topbar,
    sidebar,
    passwordModal,
    groupModal,
    modalBox,
    medicineModal,
    preEvaluationModal,
    surgicalMethodModal,
    operativeComplicationModal,
    dbsModal,
    nervousSystemModal,
    geneModal,
    biochemicalExamModal,
    emgModal,
    imageModal,
    firstSymptomsModal,
    firstTreatmentModal,
    diagnosticRecordModal,

    filterPanel,
    choicePanel,
    confirmBox
  },
  methods: {
    blurOnScreen() {
      Bus.$emit(this.BLUR_ON_SCREEN);
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

    // 如果还未获得 token 信息，则说明还没有登录，所以返回登录界面
    if (sessionStorage.getItem('token') === null) {
      this.display = false;
      this.$router.push('/login');
    } else {
      this.display = true;
    }

    Bus.$on(this.TOGGLE_FILTER_PANEL_DISPLAY, this.toggleFilterPanelDisplay);
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
