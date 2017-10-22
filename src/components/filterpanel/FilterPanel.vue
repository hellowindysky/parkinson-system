<template lang="html">
  <div class="filter-panel" :class="{'hide': !showFilterPanel}">

  </div>
</template>

<script>
export default {
  props: {
    showFilterPanel: {
      type: Boolean,
      default: false
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
