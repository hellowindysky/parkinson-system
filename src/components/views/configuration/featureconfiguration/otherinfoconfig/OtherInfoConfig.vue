<template>
  <feature-folding-panel :title="'看诊记录'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="attendance-record">
      <div class="small-area-title">其他用药史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoMedHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoMedHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">既往史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoDiseaseHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoDiseaseHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">家族史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoFamilyHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoFamilyHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">吸烟史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoSmokeHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoSmokeHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">饮酒史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoWineHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoWineHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">喝茶史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoTeaHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoTeaHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">咖啡史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoCoffeeHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoCoffeeHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">锻炼史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoExerciseHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoExerciseHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="attendance-record">
      <div class="small-area-title">毒物接触史</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyInfoToxicExposureHistory" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyInfoToxicExposureHistory[groupNo]" :key="groupNo">
          <li>
            <span>{{handleFileName(field)}}</span>
          </li>
          <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
          </li>
          <li>
            <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
          </li>
        </ul>
      </div>
    </div>
  </feature-folding-panel>
</template>

<script>
import FeatureFoldingPanel from 'components/public/featurefoldingpanel/FeatureFoldingPanel';
import { vueCopy } from 'utils/helper';

export default {
  data() {
    return {
      copyInfoMedHistory: [],
      copyInfoDiseaseHistory: [],
      copyInfoFamilyHistory: [],
      copyInfoCoffeeHistory: [],
      copyInfoSmokeHistory: [],
      copyInfoWineHistory: [],
      copyInfoTeaHistory: [],
      copyInfoExerciseHistory: [],
      copyInfoToxicExposureHistory: [],
      mode: this.READING_MODE,
      isEdit: true,
      switchWidth: 50
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
      this.reductionCopyInfo(); // 还原数据
      this.mode = this.READING_MODE;
      this.isEdit = true;
    },
    reductionCopyInfo() { // 还原copyInfo的数据项
      vueCopy(this.medHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.diseaseHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.familyHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.coffeeHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.smokeHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.wineHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.teaHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.exerciseHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
      vueCopy(this.toxicExposureHistoryList, this.copyInfoMedHistory);
      this.changeDataType(this.copyInfoMedHistory);
    },
    submit() {
      this.mode = this.READING_MODE;
      this.isEdit = true;
    },
    changeDataType(copydata) {
      for (let i = 0; i < copydata.length; i++) {
        let sonData = copydata[i];
        for (let j = 0; j < sonData.length; j++) {
          let sonData1 = sonData[j];
          for (let key in sonData1) {
            if (key === 'must') {
              this.$set(copydata[i][j], 'must', this.changeCheck(sonData1['must']));
            } else if (key === 'active') {
              this.$set(copydata[i][j], 'active', this.changeCheck(sonData1['active']));
            }
          }
        }
      }
    },
    changeCheck(val) {
      if (val === 1) {
        return true;
      } else {
        return false;
      }
    },
    handleFileName(file) {
      let flag = true;
      for (let key in file) {
        if (key === 'cnfieldName') {
          flag = false;
        }
      }
      if (!flag) {
        return file['cnfieldName'];
      } else {
        return file['fieldName'];
      }
    }
  },
  watch: {
    medHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoMedHistory);
        this.changeDataType(this.copyInfoMedHistory);
      },
      deep: true
    },
    diseaseHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoDiseaseHistory);
        this.changeDataType(this.copyInfoDiseaseHistory);
      },
      deep: true
    },
    familyHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoFamilyHistory);
        this.changeDataType(this.copyInfoFamilyHistory);
      },
      deep: true
    },
    coffeeHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoCoffeeHistory);
        this.changeDataType(this.copyInfoCoffeeHistory);
      },
      deep: true
    },
    smokeHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoSmokeHistory);
        this.changeDataType(this.copyInfoSmokeHistory);
      },
      deep: true
    },
    wineHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoWineHistory);
        this.changeDataType(this.copyInfoWineHistory);
      },
      deep: true
    },
    teaHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoTeaHistory);
        this.changeDataType(this.copyInfoTeaHistory);
      },
      deep: true
    },
    exerciseHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoExerciseHistory);
        this.changeDataType(this.copyInfoExerciseHistory);
      },
      deep: true
    },
    toxicExposureHistoryList: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyInfoToxicExposureHistory);
        this.changeDataType(this.copyInfoToxicExposureHistory);
      },
      deep: true
    }
  },
  components: {
    FeatureFoldingPanel
  }
};
</script>
<style lang="less" scoped>
@import "~styles/variables.less";
@margin-right: 15px;
.attendance-record {
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
  .table-wrapper {
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
  }
  .table-wrapper:nth-last-of-type(1) {
    .config-small-table:nth-last-of-type(1),
    .config-small-table:nth-last-of-type(2),
    .config-small-table:nth-last-of-type(3),
    {
      border-bottom: 1px solid #a2afc3;
    }
  }
}
</style>

