<template>
    <featurefoldingpanel :title="'其他信息'"></featurefoldingpanel>
</template>

<script>
import featurefoldingpanel from '../featurefoldingpanel/featurefoldingpanel';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'medHistoryTemplate',
      'diseaseHistoryTemplate',
      'familyHistoryTemplate',
      'toxicExposureHistoryTemplate',
      'coffeeHistoryTemplate',
      'teaHistoryTemplate',
      'smokeHistoryTemplate',
      'wineHistoryTemplate',
      'exerciseHistoryTemplate'
    ])
  },
  components: {
    featurefoldingpanel
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

</style>
