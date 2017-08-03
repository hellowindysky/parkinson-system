<template lang="html">
  <div class="personal-info-wrapper">
    <basic-info class="component"></basic-info>
    <disease-info class="component"></disease-info>
    <other-info class="component"></other-info>
  </div>
</template>

<script>
import BasicInfo from 'components/basicinfo/BasicInfo';
import DiseaseInfo from 'components/diseaseinfo/DiseaseInfo';
import OtherInfo from 'components/otherinfo/OtherInfo';

export default {
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
