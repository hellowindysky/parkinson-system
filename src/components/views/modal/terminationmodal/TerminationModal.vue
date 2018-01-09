<template lang="html">
  <div class="termination-modal-wrapper" v-show="displayModal">
    <div class="termination-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">

        <div class="field whole-line">
          <span class="field-name">
            下一节点:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>view状态下一节点文本</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="test1" placeholder="请选择下一节点" clearable>
              <el-option :label="'随访期'" :value="1"></el-option>
              <el-option :label="'实验结束（等待揭盲）'" :value="2"></el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            接收人:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>view状态接收人</span>
          </span>
          <span class="field-input" v-else>
            <span>edit状态接收人</span>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>view状态处理意见文本</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="test2" placeholder="请输入处理意见" :maxlength="50"></el-input>
          </span>
        </div>

        <hr class="seperate-line">
      </div>

      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD" class="button submit-button btn-margin">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
export default {
  data() {
    return {
      displayModal: false,
      title: '结束治疗',
      mode: '',
      showEdit: '',
      warningResults: {},
      test1: '',
      test2: ''
    };
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      // console.log('item: ', item);

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_TERMINATION_MODAL, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@field-line-height: 25px;
@field-name-width: 110px;
@long-field-name-width: 160px;

.termination-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .termination-modal{
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content{
      text-align: left;
      font-size: 0;
      .seperate-line {
        border-style: none;
        border-top: 1px solid @light-gray-color;
        margin-top: 5px;
        margin-bottom: 15px;
      }
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
          // &.long-field-name {
          //   width: @long-field-name-width;
          // }
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
          // &.long-field-name {
          //   left: @long-field-name-width;
          // }
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
        margin-top: 30px;
      }
    }
  }
}
</style>
