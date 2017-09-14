<template>
  <feature-foldingpanel :title="'病症信息'" :mode="mode" @edit="startEditing" @cancel="cancel" @submit="submit">
    <div class="diseageconfig-group">
      <div class="small-area-title">起病情况</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoF" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="diseageconfig-group">
      <div class="small-area-title">首发情况</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoS" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"></el-switch>
        </li>
        <li>
          <el-checkbox v-model="field.active" :disabled="isEdit" class="config-small-checked"></el-checkbox>
        </li>
      </ul>
    </div>
    <div class="diseageconfig-group">
      <div class="small-area-title">诊疗情况</div>
      <ul class="config-small-table" v-for="(field, groupNo) in copyInfoT" :key="groupNo">
        <li>
          <span>{{field.cnfieldName}}</span>
        </li>
        <li>
            <el-switch v-model="field.must" :disabled="isEdit" class="config-small-switch" on-color="#ff9c00" on-text="" off-text="" off-color="#eff0f6"></el-switch>
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
import { mapGetters } from 'vuex';
export default {
  props: {
    diseaseInfoF: {
      required: true
    },
    diseaseInfoS: {
      required: true
    },
    diseaseInfoT: {
      required: true
    }
  },
  data() {
    return {
      copyInfoF: [{}, {}, {}, {}, {}],
      copyInfoS: [{}, {}],
      copyInfoT: [{}, {}, {}, {}, {}],
      mode: this.READING_MODE,
      isEdit: true
    };
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
      this.isEdit = false;
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
      // this.shallowCopy(this.basicInfo);
      this.deepCopy(this.diseaseInfoF, 1);
      this.deepCopy(this.diseaseInfoS, 2);
      this.deepCopy(this.diseaseInfoT, 3);
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
  computed: {
    ...mapGetters([
      'diseaseInfoDictionaryGroups',
      'diseaseInfoTemplateGroups',
      'typeGroup'
    ])
  },
  components: {
    FeatureFoldingpanel
  },
  watch: {
    diseaseInfoF: {
      handler: function(newVal) {
        this.deepCopy(newVal, 1);
      },
      deep: true
    },
    diseaseInfoS: {
      handler: function(newVal) {
        this.deepCopy(newVal, 2);
      },
      deep: true
    },
    diseaseInfoT: {
      handler: function(newVal) {
        this.deepCopy(newVal, 3);
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.diseageconfig-group {
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

