<template>
  <featurefoldingpanel :title="'基础信息'">

    <div class="basicconfig-group" v-for="(group, groupIndex) in basicInfoTemplateGroups" :key="groupIndex">
      <div class="small-area-title" v-if="groupIndex===0">基本情况</div>
      <div class="small-area-title" v-if="groupIndex===1">相关现状</div>
      <ul class="config-small-table" v-for="(field, groupNo) in group" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
          <el-switch v-model="field.active" class="config-small-switch" on-color="#ff9c00" off-color="#eff0f6" on-text="" off-text=""></el-switch>
        </li>
        <li>
          <el-checkbox class="config-small-checked" v-model="field.must"></el-checkbox>
        </li>
      </ul>
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
.basicconfig-group {
  font-size: @normal-font-size;
  text-align: left;
  .small-area-title {
    width: 100%;
    text-align: left;
    text-indent: 20px;
    height: 38px;
    line-height: 38px;
    font-weight: bold;
    color: @button-color;
  }
  .config-small-table {
    margin: 0;
    padding: 0;
    width: 32.6%;
    height: auto;
    margin-left: 0.6%;
    display: inline-block;
    position: relative;
    list-style: none;
    margin-top: -4px;
    border-bottom: 1px solid #a2afc3;
    li {
      padding: 0;
      margin: 0;
      width: 33.3%;
      height: 50px;
      padding: 7px 0px;
      float: left;
      border: 1px solid #a2afc3;
      box-sizing: border-box;
      text-align: center;
      line-height: 36px;
      border-bottom: none;
    } 
    li:nth-of-type(1),li:nth-of-type(2){
      border-right: none;
    }
  }
  ul:nth-of-type(3n+1) {
      margin-left: 0;
  }
  ul:nth-last-of-type(1),ul:nth-last-of-type(2),ul:nth-last-of-type(3) {
      
  }
}
</style>
