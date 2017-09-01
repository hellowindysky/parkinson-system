<template>
  <div class="freature-person-conf-wrapper">
      <basicInfoConfig ></basicInfoConfig>
      <diseageInfoConfig></diseageInfoConfig>
      <otherInfoConfig></otherInfoConfig>
  </div>    
</template>

<script>

import basicInfoConfig from '../basicInfoConfig/basicInfoconfig';
import diseageInfoConfig from '../diseageInfoConfig/diseageInfoConfig';
import otherInfoConfig from '../otherInfoConfig/otherInfoConfig';

export default {
  components: {
    basicInfoConfig,
    diseageInfoConfig,
    otherInfoConfig
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
</style>
