<template>
    <featurefoldingpanel :title="'其他信息'"></featurefoldingpanel>
</template>

<script>
import featurefoldingpanel from '../featurefoldingpanel/featurefoldingpanel';
export default {
  props: {
    medHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    diseaseHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    familyHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    coffeeHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    smokeHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    wineHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    teaHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    exerciseHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    toxicExposureHistoryListConf: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  components: {
    featurefoldingpanel
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

</style>
