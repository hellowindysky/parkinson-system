<template lang="html">
  <div class="surgical-method-modal-wrapper" v-show="displayModal">
    <div class="surgical-method-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
// import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
// import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: false,
      title: ''
    };
  },
  methods: {
    showModal(changeWay, info) {
      if (changeWay === this.ADD_DATA) {
        this.title = '新增手术方案';
      } else if (changeWay === this.EDIT_DATA) {
        this.title = '手术方案';
      }
      console.log(info);
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_SURGICAL_METHOD_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SURGICAL_METHOD_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.surgical-method-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .surgical-method-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 15px auto 10px;
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
  }
}
</style>
