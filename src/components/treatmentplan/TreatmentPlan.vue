<template>
  <feature-folding-panel :title="'治疗方案'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="attendance-record">
      <div class="small-area-title">药物方案</div>
      <div class="table-wrapper" v-for="(field, groupNo) in patientMedicine" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientMedicine[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patientScale" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientScale[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patientSpephysical" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientSpephysical[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patientSideeffect" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientSideeffect[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patientBioexam" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientBioexam[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patElecTrogram" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patElecTrogram[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patientVideoInfo" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientVideoInfo[groupNo]" :key="groupNo">
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
      <div class="table-wrapper" v-for="(field, groupNo) in patientAttachment" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in patientAttachment[groupNo]" :key="groupNo">
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
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
      this.deepCopy(this.basicInfoF, 1);
      this.deepCopy(this.basicInfoS, 2);
      this.deepCopy(this.basicInfoT, 3);
      this.mode = this.READING_MODE;
      this.isEdit = true;
      console.log(this.copyInfoF);
    },
    submit() {
      this.mode = this.READING_MODE;
      this.isEdit = true;
      // 点击提交按钮之后的后续
    },
    deepCopy(copyFile, type) {
      var dataTemp = null;
      if (type === 1) {
        dataTemp = this.copyInfoF;
      } else if (type === 2) {
        dataTemp = this.copyInfoS;
      } else if (type === 3) {
        dataTemp = this.copyInfoT;
      }
      for (let i = 0; i < copyFile.length; i++) {
        // this.copyInfoF[i] = {};
        let sonData = copyFile[i];
        for (let key in sonData) {
          this.$set(dataTemp[i], key, sonData[key]);
          if (key === 'must') {
            this.$set(dataTemp[i], 'must', this.changeCheck(sonData['must']));
          } else if (key === 'active') {
            this.$set(dataTemp[i], 'active', this.changeCheck(sonData['active']));
          }
        }
      }
    },
    // deepCopy2(copyFile, type) {
    //   var dataTemp = null;
    //   if (type === 1) {
    //     dataTemp = this.copyInfoF;
    //     console.log('first');
    //   } else if (type === 2) {
    //     dataTemp = this.copyInfoS;
    //     console.log('second');
    //   } else if (type === 3) {
    //     dataTemp = this.copyInfoT;
    //   }
    //   for (let i = 0; i < copyFile.length; i++) {
    //     dataTemp[i] = Object.assign({}, {});
    //     let sonData = copyFile[i];
    //     for (let key in sonData) {
    //       this.$set(dataTemp[i], key, sonData[key]);
    //       if (key === 'must') {
    //         this.$set(dataTemp[i], 'must', String(sonData['must']));
    //       } else if (key === 'active') {
    //         this.$set(dataTemp[i], 'active', this.changeSwitch(sonData['active']));
    //       }
    //     }
    //   }
    // },
    changeCheck(val) {
      if (val === 1) {
        return true;
      } else {
        return false;
      }
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
