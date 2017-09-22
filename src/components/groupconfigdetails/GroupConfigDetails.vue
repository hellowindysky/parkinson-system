<template>
  <feature-folding-panel :title="'分组详情'" :mode="mode" @edit="startEditing">
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
    // cancel() {
    //   // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
    //   this.deepCopy(this.basicInfoF, 1);
    //   this.deepCopy(this.basicInfoS, 2);
    //   this.deepCopy(this.basicInfoT, 3);
    //   this.mode = this.READING_MODE;
    //   this.isEdit = true;
    //   console.log(this.copyInfoF);
    // },
    // submit() {
    //   this.mode = this.READING_MODE;
    //   this.isEdit = true;
    //   // 点击提交按钮之后的后续
    // },
    deepCopy(propsData, copyInfo) {
      for (let i = 0; i < propsData.length; i++) {
        let sonData = propsData[i];
        this.$set(copyInfo, i, []);
        for (let j = 0; j < sonData.length; j++) {
          let sonData1 = sonData[j];
          this.$set(copyInfo[i], j, []);
          for (let key in sonData1) {
            if (key === 'must') {
              this.$set(copyInfo[i][j], 'must', this.changeCheck(sonData1['must']));
            } else if (key === 'active') {
              this.$set(copyInfo[i][j], 'active', this.changeCheck(sonData1['active']));
            } else {
              this.$set(copyInfo[i][j], key, sonData1[key]);
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
        this.deepCopy(newVal, this.copyGroupAdd);
      },
      deep: true
    },
    patientGroupName: {
      handler: function(newVal) {
        this.deepCopy(newVal, this.copyGroupName);
      },
      deep: true
    },
    patientGroupExplain: {
      handler: function(newVal) {
        this.deepCopy(newVal, this.copyGroupExplain);
      },
      deep: true
    },
    patientGroupBatchadd: {
      handler: function(newVal) {
        this.deepCopy(newVal, this.copyGroupBatchadd);
      },
      deep: true
    },
    patientGroupPatient: {
      handler: function(newVal) {
        this.deepCopy(newVal, this.copyGroupPatient);
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
