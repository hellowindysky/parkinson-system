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
    <confirm-box></confirm-box>
    <nervous-system></nervous-system>
    <gene-modal></gene-modal>
    <biochemical-exam></biochemical-exam>
    <emg-modal></emg-modal>
    <img-modal></img-modal>
    <filter-panel :showFilterPanel="showFilterPanel"></filter-panel>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

import topbar from 'components/header/Header';
import sidebar from 'components/views/sidebar/Sidebar';

import passwordModal from 'components/passwordmodal/PasswordModal';
import groupModal from 'components/groupmodal/GroupModal';
import modalBox from 'components/modalbox/ModalBox';
import medicineModal from 'components/medicinemodal/MedicineModal';
import preEvaluationModal from 'components/preevaluationmodal/PreEvaluationModal';
import surgicalMethodModal from 'components/surgicalmethodmodal/SurgicalMethodModal';
import operativeComplicationModal from 'components/operativecomplicationmodal/OperativeComplicationModal';
import dbsModal from 'components/dbsmodal/DbsModal';
import confirmBox from 'components/confirmbox/ConfirmBox';
import filterPanel from 'components/filterpanel/FilterPanel';
import nervousSystem from 'components/nervousystemmodal/NervouSystemModal';
import geneModal from 'components/genemodal/GeneModal';
import biochemicalExam from 'components/biochemicalexammodal/BiochemicalExamModal';
import emgModal from 'components/emgmodal/EmgModal';
import imgModal from 'components/imagemodal/ImageModal';

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
    confirmBox,
    filterPanel,
    nervousSystem,
    geneModal,
    biochemicalExam,
    emgModal,
    imgModal
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
