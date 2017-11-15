<template lang="html">
  <folding-panel :title="'基本情况'" :archived="archived" :mode="mutableMode" :folded-status="foldedStatus"
    v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
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
           :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)">
            <el-option v-for="option in getOptions(field.fieldName)" :label="option.typeName"
             :value="option.typeCode" :key="option.typeCode"></el-option>
          </el-select>
          <el-date-picker v-else-if="getUIType(field.fieldName)===6" v-model="copyInfo[field.fieldName]" type="date"
           :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field).cnFieldDesc"
           :editable="false" @change="updateWarning(field)">
          </el-date-picker>
          <el-input v-else-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
           type="textarea" :rows="2" :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :maxlength="500"></el-input>
        </div>
      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
import { addDiagnosticBasic, modifyDiagnosticBasic } from 'api/patient.js';
import { reviseDateFormat } from 'utils/helper.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      mutableMode: this.mode,
      foldedStatus: false,
      copyInfo: {},
      warningResults: {},
      lockSubmitButton: false
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
    },
    archived: {
      type: Boolean,
      default: true
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
    },
    listType() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return 'myPatients';
      } else if (this.$route.matched.some(record => record.meta.otherPatients)) {
        return 'otherPatients';
      } else {
        return 'unknown';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && !this.archived) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    startEditing() {
      this.copyInfo = Object.assign({}, this.diagnosticBasic);
      this.warningResults = {};
      this.mutableMode = this.EDITING_MODE;
      this.foldedStatus = false;
    },
    cancel() {
      this.lockSubmitButton = false;
      // 如果是新增患者界面，点击取消按钮，则回到诊断列表页面
      if (this.$route.params.caseId === 'newCase') {
        Bus.$on(this.CONFIRM, () => {
          this.copyInfo = Object.assign({}, this.diagnosticBasic);
          this.warningResults = {};
          this.mutableMode = this.READING_MODE;
          if (this.listType === 'myPatients') {
            this.$router.push({name: 'diagnosticInfo'});
          } else if (this.listType === 'otherPatients') {
            this.$router.push({name: 'otherDiagnosticInfo'});
          }
          Bus.$off(this.CONFIRM);
          Bus.$off(this.GIVE_UP);
          return;
        });
        Bus.$on(this.GIVE_UP, () => {
          Bus.$off(this.CONFIRM);
          Bus.$off(this.GIVE_UP);
          return;
        });
        Bus.$emit(this.REQUEST_CONFIRMATION, '提示', '确认取消吗？取消将放弃所有更改');

      } else {
        this.copyInfo = Object.assign({}, this.diagnosticBasic);
        this.warningResults = {};
        this.mutableMode = this.READING_MODE;
      }
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      // 先手动执行一遍 updateWarning()，因为有的字段在初始化的时候并没有经过校验
      for (let field of this.diagnosticBasicTemplate) {
        this.updateWarning(field);
      }

      // 然后检查 warningResults
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p)) {
          if (this.warningResults[p]) {
            this.lockSubmitButton = false;
            return;
          }
        }
      }

      reviseDateFormat(this.copyInfo);

      // 到这里，就可以准备提交数据了，根据是修改已有诊断还是新增诊断来决定调用哪个接口
      var caseId = this.$route.params.caseId;
      if (caseId === 'newCase') {
        this.copyInfo.patientId = this.$route.params.id;
        addDiagnosticBasic(this.copyInfo).then((data) => {
          var routeName;
          if (this.listType === 'myPatients') {
            routeName = 'diagnosticDetail';
          } else if (this.listType === 'otherPatients') {
            routeName = 'otherDiagnosticDetail';
          }
          this.$router.push({
            name: routeName,
            params: { caseId: data.patientCaseId }
          });
          this.updateAndClose();

          // 更新个人信息是为了更新所有诊断卡片 ——— 卡片列表信息在个人信息对象里面
          Bus.$emit(this.UPDATE_PATIENT_INFO);
          Bus.$emit(this.FOLD_DIAGNOSTIC_BASIC);
          Bus.$emit(this.EDIT_DIAGNOSTIC_DISEASE);
        }, this._handleError);

      } else {
        this.copyInfo.patientCaseId = caseId;
        modifyDiagnosticBasic(this.copyInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.lockSubmitButton = false;
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

    // 添加新的诊断记录时，父组件会传递 EDIT 事件给本组件（子组件），因此需要对此进行监听
    this.$on(this.EDIT, this.startEditing);

    Bus.$on(this.FOLD_DIAGNOSTIC_BASIC, () => {
      this.foldedStatus = true;
    });

    Bus.$on(this.QUIT_DIAGNOSTIC_DETAIL, this.cancel);
  },
  watch: {
    diagnosticBasic: function() {
      this.copyInfo = Object.assign({}, this.diagnosticBasic);
    }
  },
  beforeDestroy() {
    Bus.$off(this.QUIT_DIAGNOSTIC_DETAIL);
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
