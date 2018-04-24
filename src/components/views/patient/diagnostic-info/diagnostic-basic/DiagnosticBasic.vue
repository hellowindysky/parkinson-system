<template lang="html">
  <folding-panel :title="'基本情况'" :mode="mutableMode" :folded-status="foldedStatus"
    v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-basic">
      <div v-for="field in diagnosticBasicTemplate" class="field" v-if="isShown(field.fieldName)"
       :class="{'whole-line': field.fieldName === 'remarks', 'multi-line': field.fieldName === 'remarks'}">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>

        <div class="field-value" v-if="mutableMode===READING_MODE">
          <span v-if="getUIType(field.fieldName)===3">
            {{ transform(copyInfo[field.fieldName], field.fieldName) }}
          </span>
          <span v-else>
            {{ copyInfo[field.fieldName] }}
          </span>
        </div>

        <div class="field-input" v-else-if="mutableMode===EDITING_MODE">
          <span class="warning-text">
            {{warningResults[field.fieldName]}}
          </span>
          <span v-if="getMatchedField(field.fieldName).readOnlyType===2" class="read-only-text">
            <span v-if="getUIType(field.fieldName)===3">
              {{ transform(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </span>
          <el-select v-else-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]" @change="updateWarning(field)"
           :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
            <el-option v-for="option in getOptions(field.fieldName)" :label="option.typeName"
             :value="option.typeCode" :key="option.typeCode"></el-option>
          </el-select>
          <el-date-picker
            v-else-if="getUIType(field.fieldName)===6"
            v-model="copyInfo[field.fieldName]" type="date"
            :class="{'warning': warningResults[field.fieldName]}"
            :placeholder="getMatchedField(field.fieldName).cnFieldDesc"
            :editable="true" @change="updateWarning(field)"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-input v-else-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
           type="textarea" :rows="3" :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :maxlength="500"></el-input>
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

import FoldingPanel from 'public/folding-panel/FoldingPanel';

export default {
  data() {
    return {
      mutableMode: this.mode,
      foldedStatus: false,
      copyInfo: {},
      warningResults: {},
      inSubject: true,
      lockSubmitButton: false,
      pickerOptions: {
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
    },
    diagnosisCreator: {
      type: String,
      default: ''
    },
    canEdit: {
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
    subjectId() {
      return this.$store.state.subjectId;
    },
    listType() {
      return this.$store.state.listType;
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
          if (this.listType === this.MY_PATIENTS_TYPE) {
            this.$router.push({name: 'diagnosticInfo'});
          } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
            this.$router.push({name: 'otherDiagnosticInfo'});
          } else if (this.listType === this.SUBJECT_PATIENTS_TYPE) {
            this.$router.push({name: 'subjectDiagnosticInfo'});
          } else if (this.listType === this.THERAPISTS_PATIENTS_TYPE) {
            this.$router.push({name: 'therapistsPatientsDiagnosticInfo'});
          } else if (this.listType === this.APPRAISERS_PATIENTS_TYPE) {
            this.$router.push({name: 'appraisersPatientsDiagnosticInfo'});
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
        if (this.inSubject) {
          this.copyInfo.taskInfoId = this.subjectId;
        }
        addDiagnosticBasic(this.copyInfo).then((data) => {
          var routeName;
          if (this.listType === this.MY_PATIENTS_TYPE) {
            routeName = 'diagnosticDetail';
          } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
            routeName = 'otherDiagnosticDetail';
          } else if (this.listType === this.SUBJECT_PATIENTS_TYPE) {
            routeName = 'subjectDiagnosticDetail';
          } else if (this.listType === this.THERAPISTS_PATIENTS_TYPE) {
            routeName = 'therapistsPatientsDiagnosticDetail';
          } else if (this.listType === this.APPRAISERS_PATIENTS_TYPE) {
            routeName = 'appraisersPatientsDiagnosticDetail';
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
      // 重新查询一下主诉症状
      Bus.$emit(this.UPDATE_COMPLAINTSYMPTOMS_INFO);
      this.lockSubmitButton = false;
      this.mutableMode = this.READING_MODE;
    },
    isShown(fieldName) {
      if (['taskCode', 'taskName', 'createUser', 'status'].indexOf(fieldName) >= 0) {
        if (this.inSubject || !this.copyInfo.taskCode) {
          return false;
        }
      }
      return true;
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
    transform(typeCode, fieldName) {
      typeCode = parseInt(typeCode, 10);
      var fieldEnumId = this.getMatchedField(fieldName).fieldEnumId;
      return Util.getElement('typeCode', typeCode, this.getOptions(fieldEnumId)).typeName;
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
    // setTimeout(() => {
    //   console.log(this.diagnosticBasic);
    //   console.log(this.diagnosticBasicTemplate);
    //   console.log(this.patientCaseDictionary);
    // }, 2000);

    this.inSubject = this.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL;

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
    },
    subjectId: function() {
      // 为什么要大费周章，又监听，又延时处理，而不直接写成计算属性呢？
      // 目的就在于这个“延时”上面，因为切换 医院／项目 入口的时候页面有个短暂的延时，我们不希望此时触发页面变化
      // 因此在切换入口之后，不会马上影响到 this.inSubject 的值，也就不会立刻影响字段的显示
      setTimeout(() => {
        this.inSubject = this.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL;
      }, 500);
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
  padding: 0 25px 20px;
  text-align: left;
  .field {
    display: inline-block;
    position: relative;
    width: 50%;
    height: @field-height;
    text-align: left;
    &.whole-line {
      width: 100%;
      .field-value, .field-input {
        width: calc(~"98% - @{field-name-width}");
      }
    }
    &.multi-line {
      // height: @field-height * 1.5;
    }
    .field-name {
      display: inline-block;
      position: absolute;
      top: 0;
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
      position: relative;
      left: @field-name-width;
      top: 12.5px;
      width: calc(~"100% - @{field-name-width}");
      line-height: 25px;
      font-size: @normal-font-size;
      color: @light-font-color;
    }
    .field-input {
      display: inline-block;
      position: relative;
      top: 0;
      left: @field-name-width;
      width: calc(~"96% - @{field-name-width}");
      line-height: @field-height;
      overflow: visible;
      .read-only-text {
        font-size: @normal-font-size;
        color: @light-font-color;
      }
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
          height: 60px;
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
