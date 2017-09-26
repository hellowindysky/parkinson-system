<template>
  <feature-folding-panel :title="'基础信息'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="basicconfig-group">
      <div class="small-area-title" >基本情况</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoF" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
        </li>
        <li>
          <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="basicconfig-group">
      <div class="small-area-title">相关状况</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoS" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
        </li>
        <li>
          <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="basicconfig-group">
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoT" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="on" off-text="off" off-color="#eff0f6" :width="switchWidth"></el-switch>
        </li>
        <li>
          <el-checkbox :disabled="isEdit" v-model="field.active" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
  </feature-folding-panel>
</template>
<script>
import FeatureFoldingPanel from '../featurefoldingpanel/FeatureFoldingPanel';
import { mapGetters } from 'vuex';
export default {
  props: {
    basicInfoF: {
      required: true
    },
    basicInfoS: {
      required: true
    },
    basicInfoT: {
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
      copyInfoF: [{}, {}, {}, {}, {}, {}, {}, {}],
      copyInfoS: [{}, {}, {}, {}, {}, {}],
      copyInfoT: [{}, {}, {}, {}],
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
    changeCheck(val) {
      if (val === 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    basicInfoF: {
      handler: function(newVal) {
        this.deepCopy(newVal, 1);
      },
      deep: true
    },
    basicInfoS: {
      handler: function(newVal) {
        this.deepCopy(newVal, 2);
      },
      deep: true
    },
    basicInfoT: {
      handler: function(newVal) {
        this.deepCopy(newVal, 3);
      },
      deep: true
    }
  },
  created() {
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
