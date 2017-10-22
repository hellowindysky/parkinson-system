<template lang="html">
  <div class="filter-panel" :class="{'hide': !showFilterPanel}">

  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  props: {
    showFilterPanel: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    $route() {
      if (this.showFilterPanel) {
        // 在面板打开的情况下，一旦路由发生变化，则自动收起面板
        Bus.$emit(this.TOGGLE_FILTER_PANEL_DISPLAY);
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.filter-panel {
  position: absolute;
  top: @header-height + @header-margin-bottom;
  left: 0;
  width: 100%;
  height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  background-color: @background-color;
  transition: 0.5s;
  z-index: 300;
  &.hide {
    transform: translateY(calc(~"-100% - @{header-margin-bottom}"));
  }
}
</style>
