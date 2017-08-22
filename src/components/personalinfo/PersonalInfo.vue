<template lang="html">
  <div class="personal-info-wrapper">
    <basic-info class="component" :basic-info="basicInfo"></basic-info>
    <disease-info class="component" :disease-info="diseaseInfo"></disease-info>
    <other-info class="component" :medHistroyList="medHistroyList" :diseaseHistoryList="diseaseHistoryList"
      :coffeeHistoryList="coffeeHistoryList" :teaHistoryList="teaHistoryList" :wineHistoryList="wineHistoryList"
      :smokeHistoryList="smokeHistoryList" :exerciseHistoryList="exerciseHistoryList"></other-info>
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
      // 基础信息
      return this.patientInfo.patientInfo ? this.patientInfo.patientInfo : {};
    },
    diseaseInfo() {
      // 急症信息
      return this.patientInfo.patientDiseaseInfo ? this.patientInfo.patientDiseaseInfo : {};
    },
    medHistroyList() {
      // 用药史
      return this.patientInfo.patientMedHistoryList ? this.patientInfo.patientMedHistoryList : [];
    },
    diseaseHistoryList() {
      // 既往史（手术）
      return this.patientInfo.patientDiseaseList ? this.patientInfo.patientDiseaseList : [];
    },
    coffeeHistoryList() {
      // 咖啡史
      return this.patientInfo.patientCoffeeList ? this.patientInfo.patientCoffeeList : [];
    },
    smokeHistoryList() {
      // 吸烟史
      return this.patientInfo.patientSmokeList ? this.patientInfo.patientSmokeList : [];
    },
    wineHistoryList() {
      // 饮酒史
      return this.patientInfo.patientWineList ? this.patientInfo.patientWineList : [];
    },
    teaHistoryList() {
      // 喝茶史
      return this.patientInfo.patientTeaList ? this.patientInfo.patientTeaList : [];
    },
    exerciseHistoryList() {
      // 锻炼史
      return this.patientInfo.patientExerciseList ? this.patientInfo.patientExerciseList : [];
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
