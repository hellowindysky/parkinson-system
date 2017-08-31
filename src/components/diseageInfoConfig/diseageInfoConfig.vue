<template>
    <featurefoldingpanel :title="'病症信息'"></featurefoldingpanel>
</template>

<script>
import featurefoldingpanel from '../featurefoldingpanel/featurefoldingpanel';

export default {
  props: {
    diseaseInfoConf: {
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
