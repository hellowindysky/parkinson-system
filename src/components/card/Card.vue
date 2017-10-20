<template lang="html">
  <div class="card" @click="clickSelf">
    <div class="title">{{title}}</div>
    <div class="iconfont icon-delete" :class="{'disable-delete': disableDelete}" v-show="mode === EDITING_MODE" @click.stop="deleteSelf"></div>
    <slot></slot>
  </div>
</template>

<script>

export default {
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    title: {
      type: String,
      default: ''
    },
    disableDelete: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickSelf() {
      this.$emit(this.CLICK_CURRENT_CARD);
    },
    deleteSelf() {
      if (!this.disableDelete) {
        this.$emit(this.DELETE_CURRENT_CARD);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.card {
  position: relative;
  background-color: @screen-color;
  height: @card-height;
  cursor: pointer;
  .title {
    position: absolute;
    left: 10px;
    right: 40px;
    top: 15px;
    font-size: @normal-font-size;
    cursor: pointer;
  }
  .iconfont {
    position: absolute;
    right: 15px;
    width: 15px;
    top: 15px;
    font-size: @normal-font-size;
    color: red;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.8;
    }
    &.disable-delete {
      color: #999;
      &:hover, &:active {
        opacity: 1;
      }
    }
  }
}
</style>
