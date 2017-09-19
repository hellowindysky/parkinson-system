<template lang="html">
  <folding-panel :title="'基本情况'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-basic">
      <div v-for="field in diagnosticBasic" class="field" :class="{'whole-line': true, 'multi-line': true}">
        <span class="field-name">
          诊断类型
          <span class="required-mark" v-show="true">*</span>
        </span>

        <div class="field-value" v-show="mutableMode===READING_MODE">
          看诊
        </div>

        <div class="field-input" v-show="mutableMode===EDITING_MODE">
          <span class="warning-text" v-show="false">测试警告信息</span>
          <!-- <el-select :class="{'warning': false}" v-model="test" placeholder="'请选择'">
            <el-option label="看诊" value="0"></el-option>
          </el-select> -->
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="test"></el-input>
        </div>
      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
// import Util from 'utils/util.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      mutableMode: this.mode,
      test: 0
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    diagnosticBasic: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters([
      'patientCaseTemplate'
    ])
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
    }
  },
  components: {
    FoldingPanel
  },
  mounted() {
    setTimeout(() => {
      console.log(this.diagnosticBasic);
      console.log(this.patientCaseTemplate);
    }, 2000);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;

.diagnostic-basic {
  padding: 0 25px;
  text-align: left;
  .field {
    display: inline-block;
    position: relative;
    width: 50%;
    height: @field-height;
    text-align: left;
    &.whole-line {
      width: 100%;
      .field-input {
        right: 2%;
      }
    }
    &.multi-line {
      height: @field-height * 1.5;
    }
    .field-name {
      display: inline-block;
      width: @field-name-width;
      line-height: @field-height;
      font-size: @normal-font-size;
      color: @font-color;
      .required-mark {
        color: red;
        font-size: 20px;
        vertical-align: middle;
      }
    }
    .field-value {
      display: inline-block;
      line-height: @field-height;
      font-size: @normal-font-size;
      color: @light-font-color;
    }
    .field-input {
      display: inline-block;
      position: absolute;
      top: 0;
      left: @field-name-width;
      right: 4%;
      line-height: @field-height;
      overflow: visible;
      .warning-text {
        position: absolute;
        top: 25px;
        left: 10px;
        height: 15px;
        color: red;
        font-size: @small-font-size;
      }
      .el-input {
        .el-input__inner {
          height: 30px;
          border: none;
          background-color: @screen-color;
        }
      }
      .el-textarea {
        vertical-align: middle;
        transform: translateY(10px);
        .el-textarea__inner {
          border: none;
          background-color: @screen-color;
        }
      }
      .el-select {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
      }
      .warning .el-input__inner {
        border: 1px solid red;
      }
    }
  }
}

</style>
