<template lang="html">
  <div class="subject-circulation-modal-wrapper">
    <div class="subject-circulation-modal">
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <h3 class="title">课题流转</h3>
      <div class="content">

        <div class="field whole-line">
          <span class="field-name long-field-name">经研究后存在不适合加入研究的情况</span>
          <span class="field-input long-field-name">
            <el-switch v-model="readyToEndExperiment" on-color="#3c485a"
              off-color="" on-text="" off-text=""
              @change="clearWarning">
            </el-switch>
          </span>
        </div>

        <div class="field whole-line" v-if="readyToEndExperiment">
          <span class="field-name long-field-name">
            是否不适合加入研究情况:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name">
            <span class="warning-text">{{warningResults.suitableForResearch}}</span>
            <el-select v-model="copyInfo.suitableForResearch" placeholder="请选择"
              @change="updateWarning('suitableForResearch')"
              :class="{'warning': warningResults.suitableForResearch}" clearable >
              <el-option :label="'是'" :value="0"></el-option>
              <el-option :label="'否'" :value="1"></el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line" v-if="!readyToEndExperiment">
          <span class="field-name">
            下一节点:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.step}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.step}}</span>
            <el-select v-model="copyInfo.step" placeholder="请选择课题节点"
              @change="updateWarning('step')"
              :class="{'warning': warningResults.step}" clearable >
              <el-option :label="'随访（V2）'" :value="2"
                v-if="patientCurrentStage < 2"></el-option>
              <el-option :label="'随访（V3）'" :value="3"
                v-if="patientCurrentStage < 3"></el-option>
              <el-option :label="'随访（V4）'" :value="4"
                v-if="patientCurrentStage < 4"></el-option>
              <el-option :label="'随访（V5）'" :value="5"
                v-if="patientCurrentStage < 5"></el-option>
              <el-option :label="'随访（V6）'" :value="6"
                v-if="patientCurrentStage < 6"></el-option>
              <el-option :label="'随访（V7）'" :value="7"
                v-if="patientCurrentStage < 7"></el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line" v-if="!readyToEndExperiment">
          <span class="field-name">
            开始时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.startDate}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.startDate}}</span>
            <el-date-picker
              type="datetime"
              v-model="copyInfo.startDate"
              :class="{'warning': warningResults.startDate}"
              :picker-options="startDateOptions"
              @change="updateStartDate"
              placeholder="请选择下次随访时间" clearable>
            </el-date-picker>
          </span>
        </div>

        <div class="field whole-line" v-if="!readyToEndExperiment">
          <span class="field-name">
            距上次随访天数:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.lastTime}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.lastTime}}</span>
            <el-input
              v-model="copyInfo.lastTime"
              :class="{'warning': warningResults.lastTime}"
              :maxlength="500"
              @change="updateWarning('lastTime')"
              placeholder="请输入距上次随访天数">
            </el-input>
          </span>
        </div>

        <div class="field whole-line" v-if="!readyToEndExperiment">
          <span class="field-name">
            是否超窗:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.exceedTime}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.exceedTime}}</span>
            <el-radio class="radio" v-model="copyInfo.exceedTime" :label="1"
              @change.native="updateWarning('exceedTime')">是</el-radio>
            <el-radio class="radio" v-model="copyInfo.exceedTime" :label="0"
              @change.native="updateWarning('exceedTime')">否</el-radio>
          </span>
        </div>

        <div class="field whole-line" v-if="copyInfo.exceedTime===1">
          <span class="field-name">
            超窗原因:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.exceedReason}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="copyInfo.exceedReason"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入超窗原因">
            </el-input>
            <!-- <span class="warning-text textarea-warning">{{warningResults.exceedReason}}</span> -->
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="copyInfo.remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入处理意见">
            </el-input>
          </span>
        </div>

      </div>

      <div class="seperate-line"></div>
      </div>
      <div class="modal-footer">
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD && !readyToEndExperiment"
        class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode!==VIEW_CURRENT_CARD && readyToEndExperiment"
        class="button submit-button" @click="submit">结束随访</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button">编辑</div>
      </div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus';
import Util from 'utils/util';
import { queryExperimentProgress, completeExperiment } from 'api/experiment';

export default {
  data() {
    return {
      mode: '',
      lockSubmitButton: false,
      showEdit: true,
      patientCurrentExperimentStep: '',
      patientCurrentStage: 0,
      readyToEndExperiment: false,
      copyInfo: {
        step: '',
        startDate: '',
        lastTime: '',
        exceedTime: '',
        exceedReason: '',
        suitableForResearch: ''
      },
      warningResults: {
        step: '',
        startDate: '',
        lastTime: '',
        exceedTime: '',
        suitableForResearch: ''
      },
      lastStepStartDate: ''
    };
  },
  computed: {
    hospitalType() {
      return this.$store.state.hospitalType;
    },
    startDateOptions() {
      let option = {};
      option.disabledDate = (time) => {
        return time.getTime() > Date.now() || time.getTime() < new Date(this.lastStepStartDate).getTime() - 8.64e7;
      };
      return option;
    }
  },
  methods: {
    showModal(cardOperation, item, showEdit) {
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.patientCurrentExperimentStep = item.patientCurrentExperimentStep;
      console.log(item.patientCurrentStage);
      if (item.patientCurrentStage !== undefined) {
        this.patientCurrentStage = item.patientCurrentStage;
      }
      this.readyToEndExperiment = false;

      this.lastStepStartDate = '';

      // 读取实验流程中，最后一步操作的开始日期，用来计算距离上次随访的天数
      this.updateExperimentLastStepStartTime();

      for (let property in this.copyInfo) {
        if (this.copyInfo.hasOwnProperty(property)) {
          this.copyInfo[property] = '';
        }
      }
      // console.log('item: ', item);
      this.clearWarning();

      // this.updateScrollbar();
    },
    updateExperimentLastStepStartTime() {
      var experimentInfo = {
        'patientExperimentModel': {
          'patientId': this.$route.params.id,
          'tcTaskId': this.$store.state.subjectId
        }
      };
      queryExperimentProgress(experimentInfo).then((data) => {
        if (data && data.patientExperiment && data.patientExperiment.length > 0) {
          let progressList = data.patientExperiment;
          this.lastStepStartDate = progressList[progressList.length - 1].startDate;
        } else {
          this.lastStepStartDate = '';
        }
      }, (error) => {
        console.log(error);
      });
    },
    updateStartDate() {
      // 填写了开始时间之后，需要动态计算距离上次随访天数
      if (this.copyInfo.startDate === '' || this.lastStepStartDate === '') {
        this.updateWarning('startDate');
        return;
      }
      let currentStepStartDate = new Date(this.copyInfo.startDate).getTime();
      let lastStepStartDate = new Date(this.lastStepStartDate).getTime();
      let dayTime = 1000 * 60 * 60 * 24;
      let days = Math.floor((currentStepStartDate - lastStepStartDate) / dayTime);
      this.copyInfo.lastTime = days >= 0 ? days : 0;

      this.updateWarning('startDate');
      this.updateWarning('lastTime');
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          if (!this.readyToEndExperiment &&
            ['step', 'startDate', 'lastTime', 'exceedTime'].indexOf(property) >= 0) {
            this.updateWarning(property);
          } else if (this.readyToEndExperiment &&
            ['suitableForResearch'].indexOf(property) >= 0) {
            this.updateWarning(property);
          }
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          if (!this.readyToEndExperiment &&
            ['step', 'startDate', 'lastTime', 'exceedTime'].indexOf(property) >= 0) {
            this.$message({
              message: '请完成必填项',
              type: 'warning',
              duration: 2000
            });
            this.lockSubmitButton = false;
            return;

          } else if (this.readyToEndExperiment &&
            ['suitableForResearch'].indexOf(property) >= 0) {
            this.$message({
              message: '请完成必填项',
              type: 'warning',
              duration: 2000
            });
            this.lockSubmitButton = false;
            return;
          }
        }
      }

      var experimentInfo = {
        'patientExperimentModel': {
          'patientId': this.$route.params.id,
          'tcTaskId': this.$store.state.subjectId
        }
      };
      var patientExperimentModel = experimentInfo.patientExperimentModel;
      if (!this.readyToEndExperiment) {
        // 走实验跳转流程
        experimentInfo.qualified = 0;
        patientExperimentModel.statusDetail = this.copyInfo.step;
        patientExperimentModel.startDate = Util.simplifyTime(this.copyInfo.startDate, false);
        patientExperimentModel.lastTime = this.copyInfo.lastTime;
        patientExperimentModel.exceedTime = this.copyInfo.exceedTime;
        if (this.copyInfo.exceedTime === 1) {
          patientExperimentModel.exceedReason = this.copyInfo.exceedReason;
        }
        patientExperimentModel.remark = this.copyInfo.remark;
        completeExperiment(experimentInfo, this.hospitalType).then(this.updateAndClose, this._handleError);

      } else {
        // 走结束随访流程
        experimentInfo.qualified = 1;
        patientExperimentModel.suitableForResearch = this.copyInfo.suitableForResearch;
        patientExperimentModel.exceedTime = this.copyInfo.exceedTime;
        if (this.copyInfo.exceedTime === 1) {
          patientExperimentModel.exceedReason = this.copyInfo.exceedReason;
        }
        patientExperimentModel.remark = this.copyInfo.remark;
        completeExperiment(experimentInfo, this.hospitalType).then(this.completeFollowUpAndClose, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      if (error.code === 2009) {
        this.$message({
          message: '当前操作无法完成，请刷新页面后再试',
          type: 'error',
          duration: 2000
        });
      }
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.$message({
        message: '已将该患者移至对应的实验节点',
        type: 'success',
        duration: 2000
      });
      this.lockSubmitButton = false;
      Bus.$emit(this.UPDATE_PATIENTS_LIST);
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    completeFollowUpAndClose() {
      // 这个函数是在 updateAndClose 基础之上修改的，做了一些额外的操作
      this.$message({
        message: '已结束该患者的随访流程，请填写实验结束信息',
        type: 'success',
        duration: 2000
      });
      this.lockSubmitButton = false;
      Bus.$emit(this.UPDATE_PATIENTS_LIST);
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      this.$router.push({
        name: 'experimentInfo',
        params: {
          shouldOpenEndExperimentModal: true
        }
      });
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    updateWarning(fieldName) {
      if (this.copyInfo[fieldName] === '') {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    clearWarning() {
      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_SUBJECT_CIRCULATION_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    // this.updateScrollbar();

    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SUBJECT_CIRCULATION_MODAL);
  },
  watch: {
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 120px;
@long-field-name-width: 250px;

.subject-circulation-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .subject-circulation-modal {
    position: relative;
    margin: auto;
    top: 10%;
    width: 500px;
    max-height: 80%;
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
          .field-input {
            width: calc(~"96% - @{field-name-width}");
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
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
            width: calc(~"96% - @{long-field-name-width}");
          }
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
            &.textarea-warning {
              margin-top: -22px;
              margin-left: 10px;
              position: static;
              display:block;
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
            vertical-align: middle;
            transform: translateY(-3px);
            .el-textarea__inner {
              border: none;
              background-color: @screen-color;
            }
            textarea {
              height: 54px;
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
      &.submit-button {
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
