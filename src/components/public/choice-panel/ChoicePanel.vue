<template lang="html">
  <div class="choice-panel-wrapper" v-show="displayPanel">
    <div class="choice-panel">
      <div class="choice-item" v-for="item in list" @click="encapsulate(item.callback)">
        {{item.text}}
      </div>
      <div class="seperate-line"></div>
      <div class="cancel-button" @click="closePanel">
        取消
      </div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      displayPanel: false,
      list: []
    };
  },
  methods: {
    showChoicePanel(list) {
      this.displayPanel = true;
      this.list = list;
    },
    encapsulate(func) {
      this.closePanel();
      func && func();
    },
    closePanel() {
      this.displayPanel = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_CHOICE_PANEL, this.showChoicePanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.choice-panel-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 600;
  .choice-panel {
    position: relative;
    margin: auto;
    top: 20%;
    width: 300px;
    padding: 10px 0 0;
    background-color: @background-color;
    text-align: center;
    overflow: hidden;
    .choice-item {
      margin: 10px auto;
      width: 160px;
      height: 40px;
      line-height: 40px;
      background-color: @screen-color;
      font-weight: bold;
      color: @font-color;
      cursor: pointer;
      &:hover {
        color: #fff;
        background-color: @button-color;
      }
      &:active {
        color: #fff;
        background-color: fadeout(@button-color, 10%);
      }
    }
    .seperate-line {
      margin: 0 auto;
      width: 80%;
      height: 1px;
      background-color: @light-gray-color;
    }
    .cancel-button {
      margin: 15px auto;
      width: 100px;
      height: 30px;
      line-height: 30px;
      background-color: @light-font-color;
      color: #fff;
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
