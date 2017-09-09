<template>
  <feature-foldingpanel :title="'基础信息'">
    <div class="basicconfig-group" v-for="(group, groupIndex) in basicInfoTemplateGroups" :key="groupIndex">
      <div class="small-area-title" v-if="groupIndex===0">基本情况</div>
      <div class="small-area-title" v-if="groupIndex===1">相关现状</div>
      <ul class="config-small-table" v-for="(field, groupNo) in group" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
          <el-switch  class="config-small-switch" on-color="#ff9c00" off-color="#eff0f6" on-text="" off-text=""></el-switch>
        </li>
        <li>
          <el-checkbox class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
  </feature-foldingpanel>
</template>
<script>
import FeatureFoldingpanel from '../featurefoldingpanel/FeatureFoldingpanel';
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
    FeatureFoldingpanel
  }
};
</script>
<style lang="less" scoped>
@import "~styles/variables.less";
@margin-right: 15px;
.basicconfig-group {
  font-size: @normal-font-size;
  text-align: left;
  position: relative;
  overflow: hidden;
  .small-area-title {
    width: 100%;
    text-align: left;
    text-indent: 20px;
    height: 38px;
    line-height: 38px;
    font-weight: bold;
    color: @button-color;
    float: left;
  }
  .config-small-table {
    margin: 0;
    padding: 0;
    width: 32.6%;
    height: auto;
    margin-left: 0.6%;
    float: left;
    list-style: none;
    overflow: hidden;
    li {
      width: 33.3%;
      height: 50px;
      float: left;
      border: 1px solid #a2afc3;
      border-bottom: none;
      box-sizing: border-box;
      text-align: center;
      line-height: 50px;
      position: relative;
    } 
    li:nth-of-type(1),li:nth-of-type(2) {
      border-right: none;
    }
    li:nth-of-type(2),li:nth-of-type(3) {
      border-left: none;
    }
    li:nth-of-type(1):before,li:nth-of-type(2):before {
      content: " ";  
      position: absolute;  
      width: 2px;
      background: url("~img/border.png") no-repeat;
      height: 32px;
      top: 9px;
      left: 100%;
    }
  }
  ul:nth-last-of-type(1),ul:nth-last-of-type(2),ul:nth-last-of-type(3) {
    border-bottom: 1px solid #a2afc3;
  }
}
.basicconfig-group:nth-of-type(2) {
  ul:nth-last-of-type(1),ul:nth-last-of-type(2),ul:nth-last-of-type(3) {
    border-bottom: none;
  }
}
</style>
