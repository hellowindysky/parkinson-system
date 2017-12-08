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
          <span class="warning-text"></span>
          <el-date-picker v-if="mode===ADD_NEW_CARD" placeholder="请选择就诊时间" type="date" format="yyyy-MM-dd"></el-date-picker>
          <span v-else>
            就诊时间
          </span>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          医院名:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">中南医院</span>
          <el-input v-else placeholder="请输入医院名称"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          医生名:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">张仲景</span>
          <el-input v-else placeholder="请输入医生名字"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          诊断结果:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">没问题</span>
          <el-input v-else placeholder="请输入诊断结果"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          患者主诉:
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text"></span>
          <span v-if="mode===VIEW_CURRENT_CARD">没问题</span>
          <el-input v-else type="textarea" placeholder="请输入患者主诉信息"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          给予药物:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">没问题</span>
          <el-input v-else placeholder="请输入给予药物"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          疗效:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">没问题</span>
          <el-input v-else placeholder="请输入就诊疗效"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          备注:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">没问题</span>
          <el-input v-else type="textarea" placeholder="请输入备注信息"></el-input>
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
export default {
  data() {
    return {
      displayModal: false,
      mode: ''
    };
  },
  computed: {
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增就诊记录';
      } else {
        return '就诊记录';
      }
    }
  },
  methods: {
    showModal(cardOperation, item) {
      console.log(cardOperation, item);
      this.mode = cardOperation;
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    },
    switchToEditingMode() {
      // ffff
    },
    submit() {
      // ggg
    }
  },
  mounted() {
    Bus.$on(this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.showModal);
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
