<template>
  <div class="freature-person-conf-wrapper">
      <basicInfoConfig :basicInfoConf="basicInfoConf"></basicInfoConfig>
      <diseageInfoConfig :diseaseInfoConf="diseaseInfoConf"></diseageInfoConfig>
      <otherInfoConfig :medHistoryListConf="medHistoryListConf" :diseaseHistoryListConf="diseaseHistoryListConf" :familyHistoryListConf="familyHistoryListConf" :coffeeHistoryListConf="coffeeHistoryListConf" :smokeHistoryListConf="smokeHistoryListConf" :wineHistoryListConf="wineHistoryListConf" :teaHistoryListConf="teaHistoryListConf" :exerciseHistoryListConf="exerciseHistoryListConf" :toxicExposureHistoryListConf="toxicExposureHistoryListConf"></otherInfoConfig>
  </div>    
</template>

<script>

import basicInfoConfig from '../basicInfoConfig/basicInfoconfig';
import diseageInfoConfig from '../diseageInfoConfig/diseageInfoConfig';
import otherInfoConfig from '../otherInfoConfig/otherInfoConfig';

export default {
  props: {
    configbaseInfo: {
    }
  },
  components: {
    basicInfoConfig,
    diseageInfoConfig,
    otherInfoConfig
  },
  computed: {
    basicInfoConf() {
      // 基础信息配置
      return this.configbaseInfo[4] ? this.configbaseInfo[4] : {};
    },
    diseaseInfoConf() {
      // 病症信息配置
      return this.configbaseInfo[2] ? this.configbaseInfo[2] : {};
    },
    medHistoryListConf() {
      // 用药史配置
      return this.configbaseInfo[0] ? this.configbaseInfo[0] : {};
    },
    diseaseHistoryListConf() {
      // 既往史配置
      return this.configbaseInfo[1] ? this.configbaseInfo[1] : {};
    },
    familyHistoryListConf() {
      // 家族史配置
      return this.configbaseInfo[7] ? this.configbaseInfo[7] : {};
    },
    coffeeHistoryListConf() {
      // 咖啡史配置
      return this.configbaseInfo[5] ? this.configbaseInfo[5] : {};
    },
    smokeHistoryListConf() {
      // 吸烟史配置
      return this.configbaseInfo[9] ? this.configbaseInfo[9] : {};
    },
    wineHistoryListConf() {
      // 饮酒史配置
      return this.configbaseInfo[8] ? this.configbaseInfo[8] : {};
    },
    teaHistoryListConf() {
      // 喝茶史配置
      return this.configbaseInfo[6] ? this.configbaseInfo[6] : {};
    },
    exerciseHistoryListConf() {
      // 锻炼史配置
      return this.configbaseInfo[3] ? this.configbaseInfo[3] : {};
    },
    toxicExposureHistoryListConf() {
      // 毒物接触史配置
      return this.configbaseInfo[10] ? this.configbaseInfo[10] : {};
    }
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
</style>
