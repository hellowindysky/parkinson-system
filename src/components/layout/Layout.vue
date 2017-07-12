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
  min-width: 640px;
  height: 100vh;
  .topbar {
    display: block;
    position: relative;
    width: 100%;
    height: @header-height;
  }
  .content {
    display: block;
    position: relative;
    width: 100%;
    height: calc(~"100% - @{header-height}");
    height: calc(~"100% - "@header-height);
    height: calc(~"100% - "@header-height);
  }
}
</style>
