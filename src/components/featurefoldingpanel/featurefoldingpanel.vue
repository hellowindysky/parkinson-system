<template lang="html">
  <div class="feature-panel-wrapper">
    <div class="feature-header">
      <div class="iconfont" :class="iconToggleFolded"></div>
      <h2 class="feature-title" @click="toggleFoldedPanel">{{title}}</h2>
      <div v-show="mode===READING_MODE" class="button edit-button" @click="edit">编辑</div>
      <div v-show="mode===EDITING_MODE" class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode===EDITING_MODE" class="button submit-button" @click="submit">完成</div>
    </div>
    <div class="feature-content" :class="{'folded': folded}">
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
    if (this.title === '基础信息') {
      this.folded = false;
    }
  },
  watch: {
    folded: function() {
      // 每当面板的折叠状态发生变化，就会通知所在的滚动区域，需要重新计算高度
      setTimeout(() => {
        // 之所以要延时发送事件，是为了等待折叠动画结束
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@panel-header-height: 40px;
@panel-top-bottom-margin: 10px;
@margin-right: 20px;
.feature-panel-wrapper {
  position: relative;
  background-color: @background-color;
  margin: @panel-top-bottom-margin 0;
  font-size: 0;
  overflow: hidden;
  margin-right: @margin-right;
  .feature-header {
    position: relative;
    height: @panel-header-height;
    .feature-title {
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
    .top-switch{
      position: absolute;
      left: 210px;
      top: 10px;
    }
    .top-checked{
      position: absolute;
      left: 330px;
      top: 12px;
      color: #ff9c00;
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
  .feature-content {
    width: auto;
    box-sizing: border-box;
    height: auto;
    overflow: hidden;
    padding-bottom: 10px;
    transition: all 0.2s;
    &.folded {
      height: 0;
      opacity: 0.3;
      padding: 0;
    }
  }
}
</style>
