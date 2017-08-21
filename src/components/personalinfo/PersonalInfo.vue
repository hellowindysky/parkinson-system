<template lang="html">
  <div class="personal-info-wrapper">
    <basic-info class="component" :basic-info="basicInfo"></basic-info>
    <disease-info class="component" :disease-info="diseaseInfo"></disease-info>
    <other-info class="component" :medHistroyList="medHistroyList" :diseaseList="diseaseList"></other-info>
  </div>
</template>

<script>
import BasicInfo from 'components/basicinfo/BasicInfo';
import DiseaseInfo from 'components/diseaseinfo/DiseaseInfo';
import OtherInfo from 'components/otherinfo/OtherInfo';

export default {
  props: {
    patientInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    basicInfo() {
      return this.patientInfo.patientInfo ? this.patientInfo.patientInfo : {};
    },
    diseaseInfo() {
      return this.patientInfo.patientDiseaseInfo ? this.patientInfo.patientInfo.patientDiseaseInfo : {};
    },
    medHistroyList() {
      return this.patientInfo.patientMedHistoryList ? this.patientInfo.patientMedHistoryList : [];
    },
    diseaseList() {
      return this.patientInfo.patientDiseaseList ? this.patientInfo.patientDiseaseList : [];
    }
  },
  components: {
    BasicInfo,
    DiseaseInfo,
    OtherInfo
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.personal-info-wrapper {
  background-color: @screen-color;
  .component {
    margin-bottom: @vertical-spacing;
  }
}
</style>
