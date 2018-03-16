<template lang="html">
  <div class="follow-up-termination-modal-wrapper">
    <div class="follow-up-termination-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name field-title">
            本期随访总结
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            是否发生不良事件
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{tcPatientAdverseOccurance}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.tcPatientAdverseOccurance}}</span>
            <el-select v-model="tcPatientAdverseOccurance" clearable placeholder="请选择" @change="updateWarning('tcPatientAdverseOccurance')"
              :class="{'warning': warningResults.tcPatientAdverseOccurance}">
              <el-option
                v-for="item in getOptions('patientAdverseOccurance')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            随访形式
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{followUpType}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.followUpType}}</span>
            <el-select v-model="followUpType" clearable placeholder="请选择" @change="updateWarning('followUpType')"
              :class="{'warning': warningResults.followUpType}">
              <el-option
                v-for="item in getOptions('followUpType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            受访者是否正常完成随访
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{followUpComplete}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.followUpComplete}}</span>
            <el-select v-model="followUpComplete" clearable placeholder="请选择" @change="updateWarning('followUpComplete')"
              :class="{'warning': warningResults.followUpComplete}">
              <el-option
                v-for="item in getOptions('followUpComplete')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-if="followUpComplete===0">
          <span class="field-name">
            未能正常完成随访原因
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{followUpReason}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.followUpReason}}</span>
            <el-select v-model="followUpReason" clearable placeholder="请选择" @change="updateWarning('followUpReason')"
              :class="{'warning': warningResults.followUpReason}">
              <el-option
                v-for="item in getOptions('followUpReason')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-if="followUpReason===6">
          <span class="field-name">
            原因描述
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{reasonDetail}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text textarea-warning">{{warningResults.reasonDetail}}</span>
            <el-input
              v-model="reasonDetail"
              type="textarea"
              :class="{'warning': warningResults.reasonDetail}"
              @change="updateWarning('reasonDetail')"
              :rows="2"
              :maxlength="500"
              placeholder="请详述具体原因">
            </el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            受访者是否愿意继续随访
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{followUpContinue}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.followUpContinue}}</span>
            <el-select v-model="followUpContinue" clearable placeholder="请选择" @change="updateWarning('followUpContinue')"
              :class="{'warning': warningResults.followUpContinue}">
              <el-option
                v-for="item in getOptions('followUpContinue')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="seperate-line"></div>
        <div class="field whole-line">
          <span class="field-name">
            下一节点
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{nextStep}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.nextStep}}</span>
            <el-select v-model="nextStep" clearable placeholder="请选择下一节点" @change="updateWarning('nextStep')"
              :class="{'warning': warningResults.nextStep}">
              <el-option
                v-for="item in getOptions('nextStatus')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-if="nextStep===4">
          <span class="field-name">
            接收人
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            {{appraiser}}
          </span>
        </div>
        <div class="field whole-line" v-if="nextStep===4">
          <span class="field-name">
            下次随访时间
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{nextTime}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker v-model="nextTime" clearable placeholder="请选择下次随访时间"></el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            处理意见
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入处理意见">
            </el-input>
          </span>
        </div>
        <div class="field" v-if="nextStep===5">
          <div class="menu-icon iconfont icon-caution"></div>
          <span class="field-name foot-section">
            请确认患者已经完成所有随访点，结束实验后，实验期间记录将会归档
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { completeFollowUp } from 'api/experiment.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      showEdit: true,

      appraiser: '',
      reasonDetail: '',
      tcPatientAdverseOccurance: '',
      followUpType: '',
      followUpComplete: '',
      followUpReason: '',
      followUpContinue: '',
      nextStep: '',
      nextTime: '',
      remark: '',

      warningResults: {
        tcPatientAdverseOccurance: '',
        followUpType: '',
        followUpComplete: '',
        followUpReason: '',
        followUpContinue: '',
        nextStep: ''
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '本期随访结束';
      } else {
        return '本期随访结束';
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
    showPanel(cardOperation, item, showEdit, appraiser) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.appraiser = appraiser;
      this.tcPatientAdverseOccurance = '';
      this.followUpType = '';
      this.followUpComplete = '';
      this.followUpReason = '';
      this.reasonDetail = '';
      this.followUpContinue = '';
      this.nextStep = '';
      this.nextTime = '';
      this.remark = '';

      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.updateScrollbar();
    },
    transform(code, fieldName) {
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    updateWarning(fieldName) {
      if (this[fieldName] === '') {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
      if (this.followUpComplete !== 0) {
        this.followUpReason = '';
        this.warningResults.followUpReason = '';
      }
      if (this.followUpReason !== 6) {
        this.reasonDetail = '';
        this.warningResults.reasonDetail = '';
      }
      this.updateScrollbar();
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }

      var experimentInfo = {
        patientId: this.$route.params.id,
        tcTaskId: this.$store.state.subjectId,
        nextMileStone: this.nextStep,
        remark: this.remark,
        followUpModel: {
          tcPatientAdverseOccurance: this.tcPatientAdverseOccurance,
          followUpType: this.followUpType,
          followUpComplete: this.followUpComplete,
          followUpReason: this.followUpReason,
          reasonDetail: this.reasonDetail,
          followUpContinue: this.followUpContinue,
          nextTime: Util.simplifyDate(this.nextTime)
        }
      };
      completeFollowUp(experimentInfo).then(this.updateAndClose, this._handleError);
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
      Bus.$emit(this.UPDATE_EXPERIMENT_INFO);
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_FOLLOW_UP_TERMINATION_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_FOLLOW_UP_TERMINATION_MODAL);
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
@field-name-width: 170px;

.follow-up-termination-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .follow-up-termination-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 5%;
    width: 660px;
    max-height: 90%;
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
          .field-input {
            width: calc(~"94% - @{field-name-width}");
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
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-title {
          font-weight: 700;
        }
        .foot-section {
          margin: 10px 100px;
          font-weight: 700;
          width: 200%;
        }
        .iconfont {
          display: inline-block;
          position: absolute;
          line-height: @field-line-height;
          vertical-align: middle;
          &.menu-icon {
            left: 60px;
            top: 9px;
            font-size: 25px;
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
            &.textarea-warning {
              top: 46px;
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
}
</style>
