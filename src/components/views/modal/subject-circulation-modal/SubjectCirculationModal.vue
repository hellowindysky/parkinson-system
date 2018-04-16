<template lang="html">
  <div class="subject-circulation-modal-wrapper">
    <div class="subject-circulation-modal" ref="scrollArea">
      <h3 class="title">课题流转</h3>
      <div class="content">

        <div class="field whole-line">
          <span class="field-name">
            下一节点：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.step}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.step}}</span>
            <el-select v-model="copyInfo.step" placeholder="请选择课题节点" :class="{'warning': warningResults.step}" clearable >
              <el-option :label="'筛选入组（V0）'" :value="0"></el-option>
              <el-option :label="'基线评估（V1）'" :value="1"></el-option>
              <el-option :label="'随访（V2）'" :value="2"></el-option>
              <el-option :label="'随访（V3）'" :value="3"></el-option>
              <el-option :label="'随访（V4）'" :value="4"></el-option>
              <el-option :label="'随访（V5）'" :value="5"></el-option>
              <el-option :label="'随访（V6）'" :value="6"></el-option>
              <el-option :label="'随访（V7）'" :value="7"></el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            开始时间：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.startDate}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.startDate}}</span>
            <el-date-picker
             v-model="copyInfo.startDate"
             :class="{'warning': warningResults.startDate}"
             placeholder="请选择下次随访时间" clearable>
            </el-date-picker>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name long-field-name">
            距上次随访天数：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.lastDay}}
          </span>
          <span class="field-input long-field-name" v-else>
            <span class="warning-text">{{warningResults.lastDay}}</span>
            <el-input
              v-model="copyInfo.lastDay"
              :class="{'warning': warningResults.lastDay}"
              :maxlength="500"
              placeholder="请输入距上次随访天数">
            </el-input>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            是否超窗：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.exceedTime}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.exceedTime}}</span>
            <el-radio class="radio" v-model="copyInfo.exceedTime" :label="1">是</el-radio>
            <el-radio class="radio" v-model="copyInfo.exceedTime" :label="0">否</el-radio>
          </span>
        </div>

        <div class="field whole-line" v-if="copyInfo.exceedTime===1">
          <span class="field-name">
            超窗原因：
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.reason}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="copyInfo.reason"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入超窗原因">
            </el-input>
            <!-- <span class="warning-text textarea-warning">{{warningResults.reason}}</span> -->
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见：
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
      <div class="button cancel-button">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin">编辑</div>

    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
export default {
  data() {
    return {
      mode: '',
      copyInfo: {
        step: '',
        startDate: '',
        lastDay: '',
        exceedTime: ''
      },
      warningResults: {
        step: '必填项',
        startDate: '必填项',
        lastDay: '必填项',
        exceedTime: '必填项'
      }
    };
  },
  methods: {
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
    this.updateScrollbar();
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 100px;
@long-field-name-width: 140px;

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
