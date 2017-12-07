<template lang="html">
  <div class="notice-box-wrapper" v-show="displayNoticeBox">
    <div class="notice-box">
      <h3 class="title">{{title}}</h3>
      <p class="content">{{content}}</p>
      <div class="seperate-line"></div>
      <div class="button confirm-button" @click="confirm">{{confirmText}}</div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

const DEFAULT_TITLE = '提示';
const DEFAULT_CONTENT = '';
const DEFAULT_CONFIRM_TEXT = '确定';

export default {
  data() {
    return {
      displayNoticeBox: false,
      title: DEFAULT_TITLE,
      content: DEFAULT_CONTENT,
      confirmText: DEFAULT_CONFIRM_TEXT
    };
  },
  methods: {
    confirm() {
      this.displayNoticeBox = false;
    },
    showNoticeBox(title, content, confirmText) {
      this.displayNoticeBox = true;
      this.title = (title !== undefined && title !== '') ? title : DEFAULT_TITLE;
      this.content = (content !== undefined && content !== '') ? content : DEFAULT_CONTENT;
      this.confirmText = (confirmText !== undefined && confirmText !== '') ? confirmText : DEFAULT_CONFIRM_TEXT;
    }
  },
  mounted() {
    Bus.$on(this.NOTICE, this.showNoticeBox);
  },
  beforeDestroy() {
    Bus.$off(this.NOTICE);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.notice-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 600;
  .notice-box {
    position: relative;
    margin: auto;
    padding: 10px 0;
    top: 25%;
    width: 350px;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 0 auto 10px;
    }
    .content {
      padding: 0 20px 10px;
      line-height: 20px;
      text-align: left;
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
    }
    .button {
      margin: 0 auto;
      width: 160px;
      height: 30px;
      line-height: 30px;
      background-color: @button-color;
      color: #fff;
      font-size: @normal-font-size;
      text-align: center;
      cursor: pointer;
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
