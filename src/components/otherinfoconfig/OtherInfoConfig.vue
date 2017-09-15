<template>
  <feature-foldingpanel :title="'其它信息'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="otherconfig-group">
      <div class="small-area-title">其他用药史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoMedHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
         <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6" ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">既往史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoDiseaseHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6" ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">家族史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoFamilyHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">吸烟史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoSmokeHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
         <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">饮酒史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoWineHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">喝茶史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoTeaHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
         <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">咖啡史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoCoffeeHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
         <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">锻炼史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoExerciseHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    </div>
    <div class="otherconfig-group">
      <div class="small-area-title">毒物接触史</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoToxicExposureHistory" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"  ></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
  </feature-foldingpanel>
</template>

<script>
import FeatureFoldingpanel from '../featurefoldingpanel/FeatureFoldingpanel';

export default {
  data() {
    return {
      copyInfoMedHistory: [{}, {}, {}, {}, {}, {}],
      copyInfoDiseaseHistory: [{}, {}, {}, {}, {}, {}],
      copyInfoFamilyHistory: [{}, {}, {}, {}, {}],
      copyInfoCoffeeHistory: [{}, {}, {}, {}, {}],
      copyInfoSmokeHistory: [{}, {}, {}, {}, {}],
      copyInfoWineHistory: [{}, {}, {}, {}, {}],
      copyInfoTeaHistory: [{}, {}, {}, {}, {}],
      copyInfoExerciseHistory: [{}, {}, {}, {}],
      copyInfoToxicExposureHistory: [{}, {}, {}, {}, {}, {}],
      mode: this.READING_MODE,
      isEdit: true
    };
  },
  props: {
    medHistoryList: {
      required: true
    },
    diseaseHistoryList: {
      required: true
    },
    familyHistoryList: {
      required: true
    },
    coffeeHistoryList: {
      required: true
    },
    smokeHistoryList: {
      required: true
    },
    wineHistoryList: {
      required: true
    },
    teaHistoryList: {
      required: true
    },
    exerciseHistoryList: {
      required: true
    },
    toxicExposureHistoryList: {
      required: true
    }
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
      this.isEdit = false;
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
      this.deepCopy(this.medHistoryList, 1);
      this.deepCopy(this.diseaseHistoryList, 2);
      this.deepCopy(this.familyHistoryList, 3);
      this.deepCopy(this.coffeeHistoryList, 4);
      this.deepCopy(this.smokeHistoryList, 5);
      this.deepCopy(this.wineHistoryList, 6);
      this.deepCopy(this.teaHistoryList, 7);
      this.deepCopy(this.exerciseHistoryList, 8);
      this.deepCopy(this.toxicExposureHistoryList, 9);
      this.mode = this.READING_MODE;
      this.isEdit = true;
    },
    submit() {
      this.mode = this.READING_MODE;
      this.isEdit = true;
    },
    deepCopy(copyFile, type) {
      var dataTemp = null;
      if (type === 1) {
        dataTemp = this.copyInfoMedHistory;
      } else if (type === 2) {
        dataTemp = this.copyInfoDiseaseHistory;
      } else if (type === 3) {
        dataTemp = this.copyInfoFamilyHistory;
      } else if (type === 4) {
        dataTemp = this.copyInfoCoffeeHistory;
      } else if (type === 5) {
        dataTemp = this.copyInfoSmokeHistory;
      } else if (type === 6) {
        dataTemp = this.copyInfoWineHistory;
      } else if (type === 7) {
        dataTemp = this.copyInfoTeaHistory;
      } else if (type === 8) {
        dataTemp = this.copyInfoExerciseHistory;
      } else if (type === 9) {
        dataTemp = this.copyInfoToxicExposureHistory;
      }
      for (let i = 0; i < copyFile.length; i++) {
        // this.copyInfoF[i] = {};
        let sonData = copyFile[i];
        for (let key in sonData) {
          this.$set(dataTemp[i], key, sonData[key]);
          if (key === 'must') {
            this.$set(dataTemp[i], 'must', this.changeSwitch(sonData['must']));
          } else if (key === 'active') {
            this.$set(dataTemp[i], 'active', this.changeSwitch(sonData['active']));
          }
        }
      }
    },
    changeSwitch(val) {
      if (val === 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    medHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 1);
      },
      deep: true
    },
    diseaseHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 2);
      },
      deep: true
    },
    familyHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 3);
      },
      deep: true
    },
    coffeeHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 4);
      },
      deep: true
    },
    smokeHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 5);
      },
      deep: true
    },
    wineHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 6);
      },
      deep: true
    },
    teaHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 7);
      },
      deep: true
    },
    exerciseHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 8);
      },
      deep: true
    },
    toxicExposureHistoryList: {
      handler: function(newVal) {
        this.deepCopy(newVal, 9);
      },
      deep: true
    }
  },
  components: {
    FeatureFoldingpanel
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
