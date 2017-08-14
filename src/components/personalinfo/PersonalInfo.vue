<template lang="html">
  <div class="personal-info-wrapper">
    <basic-info class="component" :basic-info="basicInfo"></basic-info>
    <disease-info class="component" :disease-info="diseaseInfo"></disease-info>
    <other-info class="component"></other-info>
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
      if (this.patientInfo.patientInfo) {
        return this.patientInfo.patientInfo;
      } else {
        return {};
      }
    },
    diseaseInfo() {
      if (this.patientInfo.patientDiseaseInfo) {
        return this.patientInfo.patientDiseaseInfo;
      } else {
        return {};
      }
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
