<template lang="html">
  <div class="confirm-box-wrapper" v-show="displayConfirmBox">
    <div class="confirm-box">
      <h3 class="title">{{title}}</h3>
      <p class="content">{{content}}</p>
      <div class="button-wrapper">
        <span class="button cancel-button" @click="cancel">取消</span>
        <span class="button confirm-button" @click="confirm">{{confirmText}}</span>
        <div class="seperate-line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

const DEFAULT_TITLE = '提示';
const DEFAULT_CONTENT = '确定删除该记录吗？删除后将无法恢复';
const DEFAULT_CONFIRM_TEXT = '确定';

export default {
  data() {
    return {
      displayConfirmBox: false,
      title: DEFAULT_TITLE,
      content: DEFAULT_CONTENT,
      confirmText: DEFAULT_CONFIRM_TEXT
    };
  },
  methods: {
    cancel() {
      Bus.$emit(this.GIVE_UP);
      this.displayConfirmBox = false;
    },
    confirm() {
      Bus.$emit(this.CONFIRM);
      this.displayConfirmBox = false;
    },
    showConfirmBox(title, content, confirmText) {
      this.displayConfirmBox = true;
      this.title = (title !== undefined && title !== '') ? title : DEFAULT_TITLE;
      this.content = (content !== undefined && content !== '') ? content : DEFAULT_CONTENT;
      this.confirmText = (confirmText !== undefined && confirmText !== '') ? confirmText : DEFAULT_CONFIRM_TEXT;
    }
  },
  mounted() {
    Bus.$on(this.REQUEST_CONFIRMATION, this.showConfirmBox);
  },
  beforeDestroy() {
    Bus.$off(this.REQUEST_CONFIRMATION);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.confirm-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 600;
  .confirm-box {
    position: relative;
    margin: auto;
    top: 30%;
    width: 300px;
    background-color: @font-color;
    color: #fff;
    overflow: hidden;
    .title {
      padding: 10px auto;
    }
    .content {
      padding: 0 10px 10px;
    }
    .button-wrapper {
      position: relative;
      margin: 0 20px;
      border-top: 1px solid @light-font-color;
      text-align: center;
      font-size: 0;
      .button {
        display: inline-block;
        box-sizing: border-box;
        width: 80px;
        height: 40px;
        line-height: 40px;
        font-size: @normal-font-size;
        text-align: center;
        cursor: pointer;
        &.cancel-button {
          margin-right: 20px;
        }
        &.confirm-button {
          margin-left: 20px;
          color: @button-color;
        }
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
      }
      .seperate-line {
        position: absolute;
        top: 5px;
        left: 50%;
        width: 1px;
        height: 28px;
        background-color: @light-font-color;
      }
    }
  }
}
</style>
