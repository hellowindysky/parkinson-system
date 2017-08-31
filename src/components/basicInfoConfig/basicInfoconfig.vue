<template>
    <featurefoldingpanel :title="'基础信息'">
      
    </featurefoldingpanel>
</template>

<script>
import featurefoldingpanel from '../featurefoldingpanel/featurefoldingpanel';

export default {
  props: {
    basicInfoConf: {
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
