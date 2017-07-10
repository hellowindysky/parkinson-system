<template lang="html">
  <div class="app-wrapper">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from 'components/header/Header';

export default {
  components: {
    Header
  }
};
</script>

<style lang="less" scoped>
</style>
