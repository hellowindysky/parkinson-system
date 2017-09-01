<template>
  <featurefoldingpanel :title="'基础信息'">
    <div class="basicinfo-config">
      <div class="basicconfig-group" v-for="(group, groupIndex) in basicInfoTemplateGroups" :key="groupIndex">
        <span v-if="groupIndex===0">基本情况</span>
        <span v-if="groupIndex===1||groupIndex===2">相关现状</span>
        <div class="basiccongig-field" v-for="(field, groupNo) in group" :key="groupNo">
          <span class="basicfield-name">
            {{field.cnfieldName}}
          </span>
        </div>
      </div>
    </div>
  </featurefoldingpanel>
</template>
<script>

import featurefoldingpanel from '../featurefoldingpanel/featurefoldingpanel';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'basicInfoDictionaryGroups',
      'basicInfoTemplateGroups',
      'typeGroup'
    ])
  },
  components: {
    featurefoldingpanel
  }
};
</script>
<style lang="less" scoped>
@import "~styles/variables.less";

.basicinfo-config {
  font-size: @normal-font-size;
}
</style>
