<template>
  <feature-folding-panel :title="'分组详情'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="attendance-record">
      <div class="small-area-title">新增分组</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyGroupAdd" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyGroupAdd[groupNo]" :key="groupNo">
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
      <div class="small-area-title">组名管理</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyGroupName" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyGroupName[groupNo]" :key="groupNo">
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
      <div class="small-area-title">分组说明</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyGroupExplain" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyGroupExplain[groupNo]" :key="groupNo">
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
      <div class="small-area-title">批量操作</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyGroupBatchadd" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyGroupBatchadd[groupNo]" :key="groupNo">
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
      <div class="small-area-title">患者管理</div>
      <div class="table-wrapper" v-for="(field, groupNo) in copyGroupPatient" :key="groupNo">
        <ul class="config-small-table" v-for="(field, groupNo) in copyGroupPatient[groupNo]" :key="groupNo">
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
    patientGroupAdd: {
      required: true
    },
    patientGroupName: {
      required: true
    },
    patientGroupExplain: {
      required: true
    },
    patientGroupBatchadd: {
      required: true
    },
    patientGroupPatient: {
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
      copyGroupAdd: [],
      copyGroupName: [],
      copyGroupExplain: [],
      copyGroupBatchadd: [],
      copyGroupPatient: [],
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
      this.reductionCopyInfo(); // 还原数据
      this.mode = this.READING_MODE;
      this.isEdit = true;
    },
    reductionCopyInfo() { // 还原copyInfo的数据项
      vueCopy(this.patientGroupAdd, this.copyGroupAdd);
      this.changeDataType(this.copyGroupAdd);
      vueCopy(this.patientGroupName, this.copyGroupName);
      this.changeDataType(this.copyGroupName);
      vueCopy(this.patientGroupExplain, this.copyGroupExplain);
      this.changeDataType(this.copyGroupExplain);
      vueCopy(this.patientGroupBatchadd, this.copyGroupBatchadd);
      this.changeDataType(this.copyGroupBatchadd);
      vueCopy(this.patientGroupPatient, this.copyGroupPatient);
      this.changeDataType(this.copyGroupPatient);
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
    }
  },
  watch: {
    patientGroupAdd: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyGroupAdd);
        this.changeDataType(this.copyGroupAdd);
      },
      deep: true
    },
    patientGroupName: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyGroupName);
        this.changeDataType(this.copyGroupName);
      },
      deep: true
    },
    patientGroupExplain: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyGroupExplain);
        this.changeDataType(this.copyGroupExplain);
      },
      deep: true
    },
    patientGroupBatchadd: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyGroupBatchadd);
        this.changeDataType(this.copyGroupBatchadd);
      },
      deep: true
    },
    patientGroupPatient: {
      handler: function(newVal) {
        vueCopy(newVal, this.copyGroupPatient);
        this.changeDataType(this.copyGroupPatient);
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
