<template>
  <featurefoldingpanel :title="'其他信息'">
    <div class="otherconfig-group">
      <div class="small-area-title">其他用药史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in exerciseHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">既往史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in diseaseHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">家族史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in familyHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">吸烟史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in smokeHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">饮酒史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in wineHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">喝茶史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in teaHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">咖啡史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in coffeeHistoryTemplate" :key="groupNo">
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
    <div class="otherconfig-group">
      <div class="small-area-title">锻炼史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in exerciseHistoryTemplate" :key="groupNo">
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
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">毒物接触史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in toxicExposureHistoryTemplate" :key="groupNo">
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
@margin-right: 15px;
.otherconfig-group {
  font-size: @normal-font-size;
  text-align: left;
  overflow: hidden;
  position: relative;
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
    li:nth-of-type(1),
    li:nth-of-type(2) {
      border-right: none;
    }
    li:nth-of-type(2),
    li:nth-of-type(3) {
      border-left: none;
    }
    li:nth-of-type(1):before,
    li:nth-of-type(2):before {
      content: " ";
      position: absolute;
      width: 2px;
      background: url("~img/border.png") no-repeat;
      height: 32px;
      top: 9px;
      left: 100%;
    }
  }
  
  ul:nth-last-of-type(1),
  ul:nth-last-of-type(2),
  ul:nth-last-of-type(3) {
    border-bottom: 1px solid #a2afc3;
  }
}

.basicconfig-group:nth-of-type(2) {
  ul:nth-last-of-type(1),
  ul:nth-last-of-type(2),
  ul:nth-last-of-type(3) {
    border-bottom: none;
  }
}
</style>
