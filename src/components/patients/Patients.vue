<template lang="html">
  <div class="content-wrapper">
    <sidebar class="sidebar"></sidebar>
    <router-view class="list" name="list"></router-view>
    <router-view class="content" name="content"></router-view>
  </div>
</template>

<script>
import sidebar from 'components/sidebar/Sidebar';

export default {
  components: {
    sidebar
  }
};
</script>

<style lang="less" scoped>
.content-wrapper {
  background-color: #fafafa;
  .sidebar {
    position: absolute;
    width: 80px;
    height: 100%;
    left: 0;
  }
}
</style>
