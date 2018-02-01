<template lang="html">
  <div class="personal-info-wrapper">
    <basic-info class="component" :basic-info="basicInfo"></basic-info>
    <disease-history class="component" :disease-info="diseaseInfo" :birthday="birthday"></disease-history>
    <other-info class="component" :med-history-list="medHistoryList" :disease-history-list="diseaseHistoryList"
      :family-history-list="familyHistoryList" :coffee-history-list="coffeeHistoryList" :tea-history-list="teaHistoryList"
      :wine-history-list="wineHistoryList" :smoke-history-list="smokeHistoryList" :exercise-history-list="exerciseHistoryList"
      :toxic-exposure-history-list="toxicExposureHistoryList" :present-history-list="presentHistoryList"></other-info>
    <div class="blank-area"></div>
  </div>
</template>

<script>
import BasicInfo from 'patient/personalinfo/basicinfo/BasicInfo';
import DiseaseHistory from 'patient/personalinfo/diseasehistory/DiseaseHistory';
import OtherInfo from 'patient/personalinfo/otherinfo/OtherInfo';

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
    birthday() {
      // 出生日期本来是基础信息的字段，现在得让病症信息模块也得知道这个数据
      return (this.patientInfo.patientInfo && this.patientInfo.patientInfo.birthday) ? this.patientInfo.patientInfo.birthday : '';
    },
    diseaseInfo() {
      // 病症信息
      return this.patientInfo.patientDiseaseInfo ? this.patientInfo.patientDiseaseInfo : {};
    },
    presentHistoryList() {
      // 现病史
      return this.patientInfo.patientHistoryList ? this.patientInfo.patientHistoryList : [];
    },
    medHistoryList() {
      // 用药史
      return this.patientInfo.patientMedHistoryList ? this.patientInfo.patientMedHistoryList : [];
    },
    diseaseHistoryList() {
      // 既往史
      return this.patientInfo.patientDiseaseList ? this.patientInfo.patientDiseaseList : [];
    },
    familyHistoryList() {
      // 家族史
      return this.patientInfo.patientFamilyList ? this.patientInfo.patientFamilyList : [];
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
    },
    toxicExposureHistoryList() {
      // 毒物接触史
      return this.patientInfo.patientCideexposedList ? this.patientInfo.patientCideexposedList : [];
    }
  },
  components: {
    BasicInfo,
    DiseaseHistory,
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
  .blank-area {
    height: 300px;
  }
}
</style>
