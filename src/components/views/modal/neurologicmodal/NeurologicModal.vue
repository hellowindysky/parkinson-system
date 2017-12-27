<template lang="html">
  <div class="nervous-modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>

      <div class="field">
        <span class="field-name">
          检查类型:
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{warningResults.checkType}}</span>
          <el-select v-if="mode===ADD_NEW_CARD" placeholder="请选择检查类型" v-model="copyInfo.checkType"
            :class="{'warning': warningResults.checkType}" @change="updateWarning('checkType')">
            <el-option v-for="type in getOptions('neurologicExam')" :key="type.code"
              :label="type.name" :value="type.code"></el-option>
          </el-select>
          <span v-else>
            {{transform(copyInfo.checkType, 'neurologicExam')}}
          </span>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          检查时间:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.ariseTime}}</span>
          <el-date-picker v-else v-model="copyInfo.ariseTime" placeholder="请输入检查时间" type="date" format="yyyy-MM-dd"></el-date-picker>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          检查结果:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.spephysicalResult}}</span>
          <el-input v-else type="textarea" placeholder="请输入检查结果" v-model="copyInfo.spephysicalResult" :maxlength="500"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remarks}}</span>
          <el-input v-else type="textarea" placeholder="请输入备注内容" v-model="copyInfo.remarks" :maxlength="500"></el-input>
        </span>
      </div>

      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" @click="switchToEditingMode" v-if="mode===VIEW_CURRENT_CARD && canEdit">编辑</div>
      <div class="button submit-button" @click="submit" v-else-if="mode!==VIEW_CURRENT_CARD">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import { deepCopy } from 'utils/helper';
import Util from 'utils/util.js';
import { modifyNervouSystem, addNervouSystem } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      copyInfo: {},
      warningResults: {
        checkType: ''
      },
      spephysicalType: [],
      lockSubmitButton: false,
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'neurologicCheckTypeList'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增神经系统检查';
      } else {
        return '神经系统检查';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.displayModal = true;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.initCopyInfo();
      vueCopy(item, this.copyInfo);

      console.log('item: ', item);

      this.$nextTick(() => {
        this.clearWarning();
      });
    },
    initCopyInfo() {
      this.copyInfo = {};
      this.$set(this.copyInfo, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.copyInfo, 'patientId', this.$route.params.id);
      this.$set(this.copyInfo, 'checkType', '');
      this.$set(this.copyInfo, 'ariseTime', '');
      this.$set(this.copyInfo, 'spephysicalResult', '');
      this.$set(this.copyInfo, 'remarks', '');
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.updateWarning('checkType');
      if (this.warningResults.checkType !== '') {
        this.lockSubmitButton = false;
        return;
      }

      let submitData = deepCopy(this.copyInfo);
      submitData.ariseTime = Util.simplifyDate(submitData.ariseTime);

      if (this.mode === this.EDIT_CURRENT_CARD) {
        // 修改的状态
        modifyNervouSystem(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.ADD_NEW_CARD) {
        // 新增的状态
        delete submitData.patientSpephysicalId;
        addNervouSystem(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    getOptions(fieldName) {
      var options = [];
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    updateWarning(fieldName) {
      if (this.copyInfo[fieldName] === undefined || this.copyInfo[fieldName] === '') {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
    }
  },
  mounted() {
    Bus.$on(this.SHOW_NEUROLOGIC_MODAL, this.showPanel);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NEUROLOGIC_MODAL, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.nervous-modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      display: inline-block;
      position: relative;
      width: 100%;
      min-height: 45px;
      vertical-align: top;
      text-align: left;
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: @field-name-width;
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @font-color;
        .required-mark {
          color: red;
          font-size: 20px;
          vertical-align: middle;
        }
      }
      .field-input {
        display: inline-block;
        position: relative;
        left: @field-name-width;
        width: calc(~"92% - @{field-name-width}");
        line-height: 25px;
        font-size: @normal-font-size;
        color: @light-font-color;
        .warning-text {
          position: absolute;
          top: 22px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
        }
        .el-input {
          transform: translateY(-3px);
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
        }
        .el-textarea {
          margin-bottom: 15px;
          transform: translateY(-3px);
          .el-textarea__inner {
            border: none;
            background-color: @screen-color;
          }
          &.warning {
            border: 1px solid red;
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
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
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
