<template lang="html">
  <div class="diagnostic-record-wrapper" v-show="displayModal">

    <div class="modal-box" ref="scrollArea">
      <h3 class="title">{{title}}</h3>

      <div class="field">
        <span class="field-name">
          就诊时间:
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{warningResults.ariseTime}}</span>
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.ariseTime}}</span>
          <el-date-picker v-else v-model="copyInfo.ariseTime" placeholder="请选择就诊时间" type="date" format="yyyy-MM-dd"
           @change="updateWarning('ariseTime')" :class="{'warning': warningResults.ariseTime}"
           :picker-options="pickerOptions">
          </el-date-picker>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          医院名:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.hospName}}</span>
          <el-input v-else v-model="copyInfo.hospName" placeholder="请输入医院名称"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          医生名:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.doctorName}}</span>
          <el-input v-else v-model="copyInfo.doctorName" placeholder="请输入医生名字"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          诊断结果:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.diagnosis}}</span>
          <el-input v-else v-model="copyInfo.diagnosis" placeholder="请输入诊断结果"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          患者主诉:
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.chiefComplaint}}</span>
          <el-input v-else v-model="copyInfo.chiefComplaint" type="textarea" placeholder="请输入患者主诉信息" :maxlength="500"
           @change="updateWarning('chiefComplaint')" :class="{'warning': warningResults.chiefComplaint}" ></el-input>
          <span class="warning-text textarea-warning-text">{{warningResults.chiefComplaint}}</span>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          给予药物:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.givenMedicine}}</span>
          <el-input v-else v-model="copyInfo.givenMedicine" placeholder="请输入给予药物"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          疗效:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.curativeEffect}}</span>
          <el-input v-else v-model="copyInfo.curativeEffect" placeholder="请输入就诊疗效"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          备注:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remarks}}</span>
          <el-input v-else v-model="copyInfo.remarks" type="textarea" placeholder="请输入备注信息" :maxlength="500"></el-input>
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
import Bus from 'utils/bus.js';
import Ps from 'perfect-scrollbar';
import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import {addVisitDignosticRecord, modVisitDignosticRecord} from 'api/patient.js';
export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,
      copyInfo: {
        ariseTime: '', // 就诊时间
        hospName: '', // 医院名称
        doctorName: '', // 医生名称
        diagnosis: '', // 诊断结果
        chiefComplaint: '', // 主诉
        givenMedicine: '', // 给予药物
        curativeEffect: '', // 疗效
        remarks: '' // 备注
      },
      patientHistoryId: '',
      warningResults: {
        ariseTime: '', // 就诊时间
        chiefComplaint: '' // 主诉
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      lockSubmitButton: false,
      showEdit: true
    };
  },
  computed: {
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增就诊记录';
      } else {
        return '就诊记录';
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
    showModal(cardOperation, item) {
      this.completeInit = false;
      // console.log(cardOperation, item);
      this.mode = cardOperation;
      // -------------------
      this.copyInfo.ariseTime = item.ariseTime;
      this.copyInfo.hospName = item.hospName;
      this.copyInfo.doctorName = item.doctorName;
      this.copyInfo.diagnosis = item.diagnosis;
      this.copyInfo.chiefComplaint = item.chiefComplaint;
      this.copyInfo.givenMedicine = item.givenMedicine;
      this.copyInfo.curativeEffect = item.curativeEffect;
      this.copyInfo.remarks = item.remarks;
      // 编辑时的id
      this.patientHistoryId = item.patientHistoryId;
      // ------------------

      if (this.mode === this.ADD_NEW_CARD) {
        for (let key in this.copyInfo) {
          this.$set(this.copyInfo, key, '');
        };
      };

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
      this.updateScrollbar();
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updateWarning(fieldName) {
      if (this.completeInit && !this.copyInfo[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      // 验证必填项 如果没填显示红框，显示必填项三个字
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      };
      // 如果显示了必填项三个字，说明验证没通过，就将确定按钮打开，允许再次验证，并退出
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      };

      // 验证完成，准备请求数据
      let submitData = Object.assign({}, this.copyInfo);
      reviseDateFormat(submitData);
      pruneObj(submitData);
      submitData.patientId = this.$route.params.id;

      if (this.mode === this.ADD_NEW_CARD) {
        addVisitDignosticRecord(submitData).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        submitData.patientHistoryId = this.patientHistoryId;
        modVisitDignosticRecord(submitData).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_VISITDIAGNOSTICRECORD_INFO);
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_DIAGNOSTIC_RECORD_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.diagnostic-record-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box{
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 5%;
    width: 600px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
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
          &.textarea-warning-text{
            margin-top:-15px;
            position: static;
            display: block;
            line-height:1;
          }
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
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
      padding: 0 3px;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s, padding 0.2s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.6;
        &:hover {
          padding: 0;
        }
      }
    }
  }
}
</style>
