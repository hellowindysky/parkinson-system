<template lang="html">
  <div class="operative-complication-modal-wrapper">
    <div class="operative-complication-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div v-for="field in operativeComplicationTemplate" class="field" :class="{'whole-line': field.fieldName==='remarks'}">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span v-if="getUIType(field.fieldName)===3">
              {{getFieldValue(field)}}
            </span>
            <span v-else :class="{'multi-line': getType(field.fieldName)==='textarea'}">
              {{copyInfo[field.fieldName]}}
            </span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <el-select v-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
              <el-option v-for="option in getOptions(field.fieldName)" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
            <el-date-picker
              v-else-if="getUIType(field.fieldName)===6"
              v-model="copyInfo[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}"
              @change="updateWarning(field)"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-input v-else-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}" :type="getType(field.fieldName)"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)" :maxlength="500">
            </el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" v-if="mode===VIEW_CURRENT_CARD && showEdit" @click="switchToEditingMode">编辑</div>
      <div class="button submit-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { vueCopy } from 'utils/helper.js';
import { addOperativeCompliation, modifyOperativeCompliation } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      copyInfo: {},
      originalInfo: {},
      warningResults: {},
      completeInit: false,
      lockSubmitButton: false,
      showEdit: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'operativeComplicationDictionary',
      'operativeComplicationTemplate',
      'complicationTypeList',
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增术后并发症';
      } else {
        return '术后并发症';
      }
    }
  },
  methods: {
    showModal(cardOperation, info, showEdit) {
      this.mode = cardOperation;
      this.originalInfo = info;
      this.initCopyInfo();
      this.showEdit = showEdit;

    },
    initCopyInfo() {
      this.completeInit = false;
      this.copyInfo = {};
      for (let field of this.operativeComplicationTemplate) {
        this.$set(this.copyInfo, field.fieldName, '');
      }
      vueCopy(this.originalInfo, this.copyInfo);

      // 重设 copyInfo 之后记得把警告信息对象也一并清空了，记得放在 nextTick 里执行
      this.$nextTick(() => {
        this.clearWarning();
        this.completeInit = true;   // 这个变量的设置是为了避免初始化数据时，关联变量被意外改变
      });
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      // 先将日期格式改成符合服务器传输的格式
      this.copyInfo.occurrenceTime = Util.simplifyDate(this.copyInfo.occurrenceTime);

      // 点击确定按钮的时候，需要手动为这些字段校验一遍
      for (let field of this.operativeComplicationTemplate) {
        this.updateWarning(field);
      }

      // 然后检查 warningResults，看填写的数据是否合规
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p) && this.warningResults[p]) {
          this.lockSubmitButton = false;
          return;
        }
      }
      // 到这里，就可以提交了
      if (this.mode === this.ADD_NEW_CARD) {
        this.copyInfo.patientCaseId = this.$route.params.caseId;  // 补充诊断 id 这个属性
        addOperativeCompliation(this.copyInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        modifyOperativeCompliation(this.copyInfo).then(() => {
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
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.operativeComplicationDictionary);
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getFieldValue(field) {
      var options = this.getOptions(field.fieldName);
      var code = this.copyInfo[field.fieldName];
      return Util.getElement('code', code, options).name;
    },
    getOptions(fieldName) {
      // 为下拉框准备列表
      var options = [];
      if (fieldName === 'minorComplicationType') {
        // 并发症细类，需要查 tableData
        for (let type of this.complicationTypeList) {
          if (this.copyInfo.majorComplicationType === type.majorComplicationType) {
            options.push({
              name: type.minorComplicationName,
              code: type.id
            });
          }
        }

      } else {
        // 其它字段都去 typeGroup 里面查
        var dictionaryField = Util.getElement('fieldName', fieldName, this.operativeComplicationDictionary);
        var fieldEnumId = dictionaryField.fieldEnumId;
        var types = Util.getElement('typegroupcode', fieldEnumId, this.typeGroup).types;
        types = types ? types : [];
        for (let type of types) {
          options.push({
            name: type.typeName,
            code: type.typeCode
          });
        }
      }
      return options;
    },
    getType(fieldName) {
      if (fieldName === 'remarks') {
        return 'textarea';
      } else {
        return 'text';
      }
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateField(field) {
      // 这个函数目前就是为了在改变并发症大类的时候，清空并发症细类
      if (field.fieldName === 'majorComplicationType' && this.completeInit) {
        this.copyInfo.minorComplicationType = '';
      }
      this.updateWarning(field);
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var fieldValue = this.copyInfo[fieldName];
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          this.$set(this.warningResults, fieldName, '必填项');
        } else {
          this.$set(this.warningResults, fieldName, null);
        }
      }
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.showModal);
  },
  watch: {
    operativeComplicationTemplate: function() {
      this.initCopyInfo();
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 40px;
@field-name-width: 100px;
@long-field-name-width: 160px;

.operative-complication-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .operative-complication-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    max-height: 94%;
    width: 660px;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      .field {
        text-align: left;
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 50px;
        text-align: left;
        vertical-align: top;
        transform: translateX(10px);  // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 4%;
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @font-color;
          &.long-field-name {
            width: @long-field-name-width;
          }
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          top: 0;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
            width: calc(~"92% - @{long-field-name-width}");
          }
          .multi-line {
            display: inline-block;
            width: 100%;
            line-height: 25px;
            vertical-align: top;
            transform: translateY(7px);
            word-break: break-all;
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
            transform: translateY(5px);
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
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }

    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 15px auto 10px;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 10px 20px 20px 20px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &.cancel-button {
        background-color: @light-font-color;
      }
      &.submit-button, &.edit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style>
