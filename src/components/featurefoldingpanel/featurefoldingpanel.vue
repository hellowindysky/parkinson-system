<template lang="html">
  <div class="feature-panel-wrapper">
    <div class="feature-header">
      <div class="iconfont" :class="iconToggleFolded"></div>
      <h2 class="feature-title" @click="toggleFoldedPanel">{{title}}</h2>
      <el-switch class="top-switch" v-model="isopen" on-color="#ff9c00" off-color="#eff0f6" on-text="" off-text=""></el-switch>
      <el-checkbox class="top-checked" v-model="checked"></el-checkbox>
    </div>
    <div class="feature-content" :class="{'folded': folded}">
      <slot></slot>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    title: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      folded: true,
      checked: true,
      isopen: true
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
    }
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@panel-header-height: 40px;
@panel-top-bottom-margin: 10px;

.feature-panel-wrapper {
  background-color: @background-color;
  margin: @panel-top-bottom-margin 0;
  font-size: 0;
  overflow: hidden;
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
