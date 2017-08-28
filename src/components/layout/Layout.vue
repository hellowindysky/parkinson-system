<template lang="html">
  <div class="app-wrapper">
    <topbar class="topbar"></topbar>
    <sidebar class="sidebar"></sidebar>
    <router-view class="content"></router-view>
    <div class="modal-box-wrapper" v-show="showModal">
      <div class="modal-box">
        <h3 class="title">新增既往史</h3>
      </div>
    </div>
  </div>
</template>

<script>
import topbar from 'components/header/Header';
import sidebar from 'components/sidebar/Sidebar';

export default {
  data() {
    return {
      showModal: false
    };
  },
  components: {
    topbar,
    sidebar
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.app-wrapper {
  position: relative;
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
  .sidebar {
    position: absolute;
    left: 0;
    top: @header-height + @header-margin-bottom;
    width: @sidebar-width;
    height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  }
  .content {
    display: block;
    position: absolute;
    left: @sidebar-width;
    top: @header-height + @header-margin-bottom;
    width: calc(~"100% - @{sidebar-width}");
    height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  }
  .modal-box-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: fadeout(@light-font-color, 30%);
    z-index: 500;
    .modal-box {
      position: relative;
      margin: auto;
      top: 10%;
      width: 80%;
      max-width: 600px;
      background-color: #fff;
      .title {
        padding: 10px 0;
      }
    }
  }
}
</style>
