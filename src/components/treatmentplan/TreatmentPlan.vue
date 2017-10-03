<template>
  <feature-folding-panel :title="'治疗方案'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="attendance-record">
      <div class="small-area-title">药物方案</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyMedicine" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyMedicine[groupNo]" :key="groupNo">
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
      <div class="small-area-title">医学量表</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyScale" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyScale[groupNo]" :key="groupNo">
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
      <div class="small-area-title">神经系统检查</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copySpephysical" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copySpephysical[groupNo]" :key="groupNo">
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
      <div class="small-area-title">副反应信息</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copySideeffect" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copySideeffect[groupNo]" :key="groupNo">
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
      <div class="small-area-title">生化指标</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyBioexam" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyBioexam[groupNo]" :key="groupNo">
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
      <div class="small-area-title">肌电图</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyTrogram" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyTrogram[groupNo]" :key="groupNo">
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
      <div class="small-area-title">影像记录</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyVideoInfo" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyVideoInfo[groupNo]" :key="groupNo">
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
      <div class="small-area-title">附件信息</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyAttachment" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyAttachment[groupNo]" :key="groupNo">
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
import FeatureFoldingPanel from '../featurefoldingpanel/FeatureFoldingPanel';
import { mapGetters } from 'vuex';
import { vueCopy } from 'utils/helper';

export default {
  props: {
    patientMedicine: {
      required: true
    },
    patientScale: {
      required: true
    },
    patientSpephysical: {
      required: true
    },
    patientSideeffect: {
      required: true
    },
    patientBioexam: {
      required: true
    },
    patElecTrogram: {
      required: true
    },
    patientVideoInfo: {
      required: true
    },
    patientAttachment: {
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'basicInfoDictionaryGroups',
      'basicInfoTemplateGroups',
      'typeGroup'
    ])
  },
  data() {
    return {
      copyMedicine: [],
      copyScale: [],
      copySpephysical: [],
      copySideeffect: [],
      copyBioexam: [],
      copyTrogram: [],
      copyVideoInfo: [],
      copyAttachment: [],
      mode: this.READING_MODE,
      isEdit: true,
      switchWidth: 50
    };
  },
  components: {
    FeatureFoldingPanel
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
      this.isEdit = false;
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
    },
    reductionCopyInfo() { // 还原copyInfo的数据项
      vueCopy(this.patientMedicine, this.copyMedicine);
      this.changeDataType(this.copyMedicine);
      vueCopy(this.patientScale, this.copyScale);
      this.changeDataType(this.copyScale);
      vueCopy(this.patientSpephysical, this.copySpephysical);
      this.changeDataType(this.copySpephysical);
      vueCopy(this.patientSideeffect, this.copySideeffect);
      this.changeDataType(this.copySideeffect);
      vueCopy(this.patientBioexam, this.copyBioexam);
      this.changeDataType(this.copyBioexam);
      vueCopy(this.patElecTrogram, this.copyTrogram);
      this.changeDataType(this.copyTrogram);
      vueCopy(this.patientVideoInfo, this.copyVideoInfo);
      this.changeDataType(this.copyVideoInfo);
      vueCopy(this.patientAttachment, this.copyAttachment);
      this.changeDataType(this.copyAttachment);
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
      this.reductionCopyInfo(); // 还原数据
      this.mode = this.READING_MODE;
      this.isEdit = true;
      console.log(this.copyInfoF);
    },
    submit() {
      this.mode = this.READING_MODE;
      this.isEdit = true;
      // 点击提交按钮之后的后续
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
    }
  },
  watch: {
    patientMedicine: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyMedicine);
        this.changeDataType(this.copyMedicine);
      },
      deep: true
    },
    patientScale: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyScale);
        this.changeDataType(this.copyScale);
      },
      deep: true
    },
    patientSpephysical: {
      handler: function(newVal) {
        vueCopy(newVal, this.copySpephysical);
        this.changeDataType(this.copySpephysical);
      },
      deep: true
    },
    patientSideeffect: {
      handler: function(newVal) {
        vueCopy(newVal, this.copySideeffect);
        this.changeDataType(this.copySideeffect);
      },
      deep: true
    },
    patientBioexam: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyBioexam);
        this.changeDataType(this.copyBioexam);
      },
      deep: true
    },
    patElecTrogram: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyTrogram);
        this.changeDataType(this.copyTrogram);
      },
      deep: true
    },
    patientVideoInfo: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyVideoInfo);
        this.changeDataType(this.copyVideoInfo);
      },
      deep: true
    },
    patientAttachment: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyAttachment);
        this.changeDataType(this.copyAttachment);
      },
      deep: true
    }
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
