<template lang="html">
  <div class="ratification-modal-wrapper" v-show="displayModal">
    <div class="ratification-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            下一节点
          </span>
          <span class="field-input">
            治疗期
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            接收人
          </span>
          <span class="field-input">
            {{therapist}}
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            实验编号
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{experimentNumber}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.experimentNumber}}</span>
            <el-input v-model="experimentNumber"
              :class="{'warning': warningResults.experimentNumber}"
              @change="updateWarning('experimentNumber')"
              placeholder="请输入实验编号">
            </el-input>
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
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>
<script>
import Bus from 'utils/bus.js';
import { agreeEnteringExperiment } from 'api/experiment.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,
      therapist: '',
      remark: '',
      experimentNumber: '',
      warningResults: {
        experimentNumber: ''
      },
      showEdit: true
    };
  },
  computed: {
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '通过';
      } else {
        return '通过';
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
    showPanel(cardOperation, item, showEdit, therapist) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.experimentNumber = '';
      this.remark = '';
      this.therapist = therapist;

      this.$nextTick(() => {
        // this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
    },
    updateWarning(fieldName) {
      if (this[fieldName] === '') {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
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
        taskCode: this.experimentNumber,
        remark: this.remark,
        patientId: this.$route.params.id,
        tcTaskId: this.$store.state.subjectId
      };
      agreeEnteringExperiment(experimentInfo).then(this.updateAndClose, this._handleError);
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
        message: '已同意将该患者加入实验组',
        type: 'success',
        duration: 2000
      });
      Bus.$emit(this.UPDATE_EXPERIMENT_INFO);
      this.lockSubmitButton = false;
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_RATIFICATION_MODAL, this.showPanel);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_RATIFICATION_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 120px;

.ratification-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .ratification-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 660px;
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
          .field-input {
            width: calc(~"96% - @{field-name-width}");
          }
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
