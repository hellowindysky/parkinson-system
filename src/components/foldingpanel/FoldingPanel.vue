<template lang="html">
  <div class="folding-panel-wrapper">
    <div class="header">
      <div class="iconfont" :class="iconToggleFolded"></div>
      <h2 class="title" @click="toggleFoldedPanel">{{title}}</h2>
      <div v-show="mode===READING_MODE" class="button edit-button" @click="edit">编辑</div>
      <div v-show="mode===EDITING_MODE" class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode===EDITING_MODE" class="button submit-button" @click="submit">完成</div>
    </div>
    <div class="content" :class="{'folded': folded}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  props: {
    title: {
      required: true,
      type: String
    },
    mode: {
      type: String,
      default: this.READING_MODE
    }
  },
  data() {
    return {
      folded: true
    };
  },
  computed: {
    iconToggleFolded() {
      return this.folded ? 'icon-down' : 'icon-up';
    }
  },
  methods: {
    toggleFoldedPanel() {
      this.folded = !this.folded;
      setTimeout(() => {
        // 之所以要延时发送事件，是为了等待折叠动画结束
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    },
    edit() {
      this.$emit(this.EDIT);
      // 进入编辑状态，面板自动展开
      this.folded = false;
    },
    cancel() {
      this.$emit(this.CANCEL);
    },
    submit() {
      this.$emit(this.SUBMIT);
    }
  },
  mounted() {
    // 默认让基础信息面板呈展开状态
    if (this.title === '其它信息') {
      this.folded = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@panel-header-height: 40px;

.folding-panel-wrapper {
  background-color: @background-color;
  font-size: 0;
  overflow: hidden;
  .header {
    position: relative;
    height: @panel-header-height;
    .title {
      margin: 0;
      position: absolute;
      display: inline-block;
      padding-left: 20px;
      left: 0;
      width: 100%;
      height: @panel-header-height;
      line-height: @panel-header-height;
      text-align: left;
      font-size: @large-font-size;
      cursor: pointer;
      color: @font-color;
      &:hover {
        color: lighten(@font-color, 20%);
      }
    }
    .iconfont {
      position: absolute;
      display: inline-block;
      left: 110px;
      top: 0;
      height: @panel-header-height;
      line-height: @panel-header-height;
      color: @button-color;
    }
    .button {
      position: absolute;
      top: 8px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.edit-button {
        right: 10px;
        background-color: @button-color;
      }
      &.cancel-button {
        right: 30px + @small-button-width;
        background-color: @light-font-color;
      }
      &.submit-button {
        right: 10px;
        background-color: @button-color;
      }
    }
  }
  .content {
    width: auto;
    box-sizing: border-box;
    height: auto;
    overflow: hidden;
    padding: 10px 0;
    transition: all 0.2s;
    &.folded {
      height: 0;
      opacity: 0.3;
      padding: 0;
    }
  }
}

</style>
