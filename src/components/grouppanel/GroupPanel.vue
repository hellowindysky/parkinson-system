<template lang="html">
  <div class="group-panel">
    <div class="iconfont icon-close" @click="closePanel">

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {};
  },
  methods: {
    closePanel() {
      this.$emit(this.HIDE_GROUP_PANEL);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.group-panel {
  display: block;
  width: @group-panel-width;
  height: @group-panel-height;
  background-color: @theme-color;
  .iconfont {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 22px;
    color: #fff;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
