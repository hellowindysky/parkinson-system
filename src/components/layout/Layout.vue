<template lang="html">
  <div class="app-wrapper">
    <topbar></topbar>
    <router-view></router-view>
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
</style>
