<template lang="html">
  <div class="app-wrapper">
    <topbar class="topbar"></topbar>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import Header from 'components/header/Header';

export default {
  components: {
    topbar: Header
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.app-wrapper {
  width: 100%;
  min-width: @min-screen-width;
  height: 100vh;
  background-color: @screen-color;
  font-size: @normal-font-size;
  z-index: 100;
  .topbar {
    display: block;
    position: relative;
    width: 100%;
    height: @header-height;
    margin-bottom: @header-margin-bottom;
  }
  .content {
    display: block;
    position: relative;
    width: 100%;
    height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  }
}
</style>
