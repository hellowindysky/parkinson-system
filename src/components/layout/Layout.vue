<template lang="html">
  <div class="app-wrapper">
    <topbar class="topbar"></topbar>
    <sidebar class="sidebar"></sidebar>
    <router-view class="content"></router-view>
    <modal-box></modal-box>
    <medicine-modal></medicine-modal>
    <pre-evaluation></pre-evaluation>
    <confirm-box></confirm-box>
    <nervous-system></nervous-system>
    <biochemical-exam></biochemical-exam>
    <emg-modal></emg-modal>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

import topbar from 'components/header/Header';
import sidebar from 'components/sidebar/Sidebar';
import modalBox from 'components/modalbox/ModalBox';
import medicineModal from 'components/medicinemodal/MedicineModal';
import preEvaluation from 'components/preevaluation/preEvaluation';
import confirmBox from 'components/confirmbox/ConfirmBox';
import nervousSystem from 'components/nervousystemmodal/NervouSystemModal';
import biochemicalExam from 'components/biochemicalexammodal/BiochemicalExamModal';
import emgModal from 'components/emgmodal/EmgModal';

export default {
  components: {
    topbar,
    sidebar,
    modalBox,
    medicineModal,
<<<<<<< HEAD
    confirmBox,
    nervousSystem,
    biochemicalExam,
    emgModal
=======
    preEvaluation,
    confirmBox
>>>>>>> 4e7bb1179983c0cad798741150ddd80d55be0368
  },
  mounted() {
    window.onresize = () => {
      Bus.$emit(this.SCREEN_SIZE_CHANGE);
    };
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
