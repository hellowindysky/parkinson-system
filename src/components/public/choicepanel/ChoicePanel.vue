<template lang="html">
  <div class="choice-panel-wrapper" v-show="displayPanel">
    <div class="choice-panel">
      <div class="choice-item" v-for="item in list" @click="encapsulate(item.callback)">
        {{item.text}}
      </div>
      <div class="seperate-line"></div>
      <div class="choice-item cancel-button" @click="closePanel">
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
    background-color: @font-color;
    color: #fff;
    overflow: hidden;
    .choice-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: @background-color;
      color: @font-color;
      cursor: pointer;
      &:hover {
        background-color: @light-gray-color;
      }
      &:active {
        background-color: fadeout(@light-gray-color, 10%);
      }
    }
    .seperate-line {
      width: 100%;
      height: 1px;
      background-color: @light-gray-color;
    }
    .cancel-button {
      height: 45px;
      line-height: 45px;
    }
  }
}
</style>
