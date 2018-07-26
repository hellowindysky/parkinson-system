<template lang="html">
  <div class="appoint-next-follow-up-wrapper">
    <div class="appoint-next-follow-up-modal">
      <h3 class="title">预约下次随访</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">

        <div class="paved-canledar">
          <ele-calendar
           v-model="copyInfo.appointDate"
           :disabledDate="disabledDate"
           :disabled="calendarDisabled">
          </ele-calendar>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            注意事项：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.noticeMatter}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="copyInfo.noticeMatter"
              type="textarea"
              :rows="4"
              :maxlength="500"
              placeholder="请输入随访注意事项">
            </el-input>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            就诊医院:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{transformId(copyInfo.hospitalId)}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="copyInfo.hospitalId" placeholder="请选择就诊医院" clearable >
              <el-option
               v-for="(item,index) in hospitalOpts" :key="item.hospitalId"
               :label="item.hospitalName"
               :value="item.hospitalId">
              </el-option>
            </el-select>
          </span>
        </div>

      </div>
      </div>
      <div class="modal-footer">

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submitFollowUp">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
      </div>

    </div>

    <el-dialog title="该患者没留存联系电话，请重新填写" :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false" :show-close="false">
      <div>
        <div class="field whole-line">
          <span class="field-name">
            联系电话
          </span>
          <span class="field-input">
            <el-input
             v-model="newMobile"
             :class="{'warning': warningResultsDialog.newMobile}"
             @change="updateWarningDialog('newMobile')">
            </el-input>
            <span class="warning-text">{{warningResultsDialog.newMobile}}</span>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import eleCalendar from 'public/ele-calendar/EleCalendar';
import Bus from 'utils/bus.js';
import Ps from 'perfect-scrollbar';
// import Util from 'utils/util.js';
// import { deepCopy, reviseDateFormat } from 'utils/helper.js';
import { reviseDateFormat } from 'utils/helper.js';
import {queryHospital, addAppointmentNextFollowUp, addPatientMobile } from 'api/patient.js';
export default {
  data() {
    return {
      mode: '',
      msg: '',
      copyInfo: {
        appointDate: new Date(),
        noticeMatter: '',
        hospitalId: '',
        id: ''
      },
      disabledDate: (time) => {
        return time.getTime() < Date.now() - 8.64e7;
      },
      hospitalOpts: [],
      dialogVisible: false,
      newMobile: '',
      warningResultsDialog: {
        newMobile: ''
      }
    };
  },
  computed: {
    calendarDisabled() {
      return this.mode === this.VIEW_CURRENT_CARD;
    }
  },
  methods: {
    showModal(cardOperation, item) {
      // console.log(cardOperation, item);
      this.mode = cardOperation;
      if (cardOperation === this.VIEW_CURRENT_CARD) {
        this.$set(this.copyInfo, 'appointDate', new Date(item.appointDate));
        this.$set(this.copyInfo, 'noticeMatter', item.noticeMatter);
        this.$set(this.copyInfo, 'hospitalId', item.hospitalId);
        this.$set(this.copyInfo, 'id', item.id);
      }
      this.updateScrollbar();
    },
    getHospitals() {
      queryHospital().then((res) => {
        this.hospitalOpts = res;
      });
    },
    submitFollowUp() {
      let paras = Object.assign({}, this.copyInfo);
      reviseDateFormat(paras);
      paras.patientCaseId = this.$route.params.caseId;
      paras.patientInfoId = this.$route.params.id;
      addAppointmentNextFollowUp(paras).then(() => {
        this.$message({
          message: '预约成功',
          type: 'success'
        });
        this.updateAndClose();
        Bus.$emit(this.NEXT_FOLLOW_UP_STATUS, this.NOSTART);
      }, this._handleError);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    cancel() {
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    _handleError(error) {
      console.log(error);
      if (error.code === 2012) {
        this.dialogVisible = true;
      }
      // this.lockSubmitButton = false;
    },
    updateAndClose() {
      // Bus.$emit(this.UPDATE_PATIENT_CASE_LIST);
      // this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    transformId(id) {
      for (let item of this.hospitalOpts) {
        if (item.hospitalId === id) {
          return item.hospitalName;
        }
      }
    },
    dialogCancel() {
      this.newMobile = '';
      this.$set(this.warningResultsDialog, 'newMobile', null);
      this.dialogVisible = false;
    },
    dialogSubmit() {
      this.updateWarningDialog('newMobile');
      if (this.warningResultsDialog.newMobile) {
        return;
      }

      // 提交联系电话
      addPatientMobile({
        newMobile: this.newMobile,
        patientId: Number(this.$route.params.id)
      }).then(() => {
        this.dialogCancel();
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    updateWarningDialog(fieldName) {
      let fieldVal = this[fieldName];
      let regMobile = /^1[34578]\d{9}$/;
      let regPhone = /^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/;
      if (fieldName === 'newMobile' && (regMobile.test(fieldVal) || regPhone.test(fieldVal))) {
        this.$set(this.warningResultsDialog, fieldName, null);
      } else {
        this.$set(this.warningResultsDialog, fieldName, '请填写正确的手机号或固话(带区号)');
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.scrollArea) {
          Ps.destroy(this.$refs.scrollArea);
          Ps.initialize(this.$refs.scrollArea, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  components: {
    eleCalendar
  },
  mounted() {
    this.getHospitals();

    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_APPOINT_NEXT_FOLLOW_UP_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 110px;

.appoint-next-follow-up-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .appoint-next-follow-up-modal {
    position: relative;
    margin: auto;
    top: 10%;
    width: 600px;
    height: 80%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .large-icon {
      font-size: @large-font-size;
    }
    .modal-body {
      position: relative;
      max-height: 80%;
      overflow-y: auto;
      padding: 0 30px;
      overflow-x: hidden;
    }

    .modal-footer {
      position: relative;
      bottom: 0px;
    }

    .content {
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translate3d(10px, 5px, 0); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: @field-line-height;
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
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          word-break: break-all;
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
            margin-bottom: 10px;
            vertical-align: middle;
            transform: translateY(-3px);
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
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .paved-canledar {
        padding-left: 35px;
        width: calc(~"92% - 26px");
        margin-bottom: 10px;
      }
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
      &.submit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.btn-margin {
        margin-top: 10px;
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

  .el-dialog__wrapper {
    text-align: left;
    .field {
      display: inline-block;
      position: relative;
      width: 50%;
      min-height: 45px;
      line-height: @field-line-height;
      box-sizing: border-box;
      text-align: left;
      vertical-align: top;
      &.whole-line {
        width: 100%;
        .field-input {
          width: calc(~"96% - @{field-name-width}");
        }
      }
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
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
        left: 80px;
        width: calc(~"92% - 80px");
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        .warning-text {
          position: absolute;
          top: 26px;
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
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
    }

    .dialog-footer {
      .el-button {
        display: inline-block;
        width: 100px;
        margin: 10px 20px 20px 20px;
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 0;
        &.el-button--default {
          background-color: @light-font-color;
        }
        &.el-button--primary {
          background-color: @button-color;
        }
      }
    }

  }

}
</style>
