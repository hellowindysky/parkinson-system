<template lang="html">
  <folding-panel :title="'基本情况'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-basic">
      <div v-for="field in diagnosticBasicTemplate" class="field"
       :class="{'whole-line': field.fieldName === 'remarks', 'multi-line': field.fieldName === 'remarks'}">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>

        <div class="field-value" v-show="mutableMode===READING_MODE">
          <span v-if="getUIType(field.fieldName)===3">
            {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
          </span>
          <span v-else>
            {{copyInfo[field.fieldName]}}
          </span>
        </div>

        <div class="field-input" v-show="mutableMode===EDITING_MODE">
          <span class="warning-text" v-show="true">
            {{warningResults[field.fieldName]}}
          </span>
          <el-select v-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]"
           :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)">
            <el-option v-for="option in getOptions(field.fieldName)" :label="option.typeName"
             :value="option.typeCode" :key="option.typeCode"></el-option>
          </el-select>
          <el-date-picker v-else-if="getUIType(field.fieldName)===6" v-model="copyInfo[field.fieldName]" type="date"
           :class="{'warning': warningResults[field.fieldName]}" :picker-options="futureDisabledptions" :placeholder="getMatchedField(field).cnFieldDesc"
           :editable="false" @change="updateWarning(field)">
          </el-date-picker>
          <el-input v-else-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
           type="textarea" :rows="2" placeholder="请输入内容"></el-input>
        </div>
      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      mutableMode: this.mode,
      copyInfo: {},
      warningResults: {},
      futureDisabledptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
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
      'patientCaseTemplateGroups',
      'patientCaseDictionary',
      'typeGroup'
    ]),
    diagnosticBasicTemplate() {
      return this.patientCaseTemplateGroups[0] ? this.patientCaseTemplateGroups[0] : [];
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      // 先手动执行一遍 updateWarning()，因为有的字段在初始化的时候并没有经过校验
      for (let field of this.diagnosticBasicTemplate) {
        this.updateWarning(field);
      }

      // 然后检查 warningResults
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p)) {
          if (this.warningResults[p]) {
            return;
          }
        }
      }

      // 到这里，就可以准备提交数据了
      this.mutableMode = this.READING_MODE;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.patientCaseDictionary);
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getOptions(fieldName) {
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      return types;
    },
    transformTypeCode(typeCode, fieldName) {
      return Util.getElement('typeCode', typeCode, this.getOptions(fieldName)).typeName;
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      if (field.must === 1 && !this.copyInfo[fieldName]) {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, null);
      }
    }
  },
  components: {
    FoldingPanel
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.diagnosticBasic);
      // console.log(this.diagnosticBasicTemplate);
      // console.log(this.patientCaseDictionary);
    }, 2000);
  },
  watch: {
    diagnosticBasic: function() {
      this.copyInfo = Object.assign({}, this.diagnosticBasic);
    }
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
