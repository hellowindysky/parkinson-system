<template lang="html">
  <div class="folding-panel-wrapper">
    <div class="header">
      <div class="iconfont" :class="iconToggleFolded"></div>
      <h2 class="title" @click="toggleFoldedPanel">{{title}}</h2>
      <div class="button edit-button">编辑</div>
    </div>
    <div class="content" :class="{'folded': folded}">
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
      right: 10px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      background-color: @button-color;
      color: @button-font-color;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
  .content {
    box-sizing: border-box;
    height: auto;
    overflow: hidden;
    padding: 10px 25px;
    transition: all 0.2s;
    &.folded {
      height: 0;
      opacity: 0.3;
      padding: 0 25px;
    }
  }
}

</style>
