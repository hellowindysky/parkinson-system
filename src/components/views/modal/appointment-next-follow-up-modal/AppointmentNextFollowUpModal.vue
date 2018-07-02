<template lang="html">
  <div class="appoint-next-follow-up-wrapper">
    <div class="appoint-next-follow-up-modal">
      <h3 class="title">预约下次随访</h3>
      <div class="content">

        <div class="paved-canledar">
          <ele-calendar v-model="copyInfo.appointDate"></ele-calendar>
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

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submitFollowUp">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>

    </div>
  </div>
</template>

<script>
import eleCalendar from 'public/ele-calendar/EleCalendar';
import Bus from 'utils/bus.js';
// import Util from 'utils/util.js';
// import { deepCopy, reviseDateFormat } from 'utils/helper.js';
import { reviseDateFormat } from 'utils/helper.js';
import {queryHospital, addAppointmentNextFollowUp } from 'api/patient.js';
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
      hospitalOpts: []
    };
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
        this.updateAndClose();
        Bus.$emit(this.NEXT_FOLLOW_UP_STATUS, 'nostart');
      }, this._handleError);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      // this.updateScrollbar();
    },
    cancel() {
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    _handleError(error) {
      console.log(error);
      // this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_PATIENT_CASE_LIST);
      // this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    transformId(id) {
      for (let item of this.hospitalOpts) {
        if (item.hospitalId === id) {
          return item.hospitalName;
        }
      }
      // return Util.getElement('id', id, this.hospitalOpts);
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
    padding: 0 40px;
    top: 10%;
    width: 600px;
    max-height: 80%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
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
  }
}
</style>
