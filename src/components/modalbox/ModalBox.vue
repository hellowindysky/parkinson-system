<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button">确定</div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      displayModal: false,
      title: ''
    };
  },
  methods: {
    showPanel(title) {
      this.displayModal = true;
      this.title = title;
    },
    cancel() {
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MODAL_BOX, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    top: 10%;
    width: 80%;
    max-width: 600px;
    background-color: @background-color;
    .title {
      padding: 10px 0;
    }
    .seperate-line {
      width: 80%;
      height: 1px;
      margin: 20px auto 0;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 20px;
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
  }
}
</style>
