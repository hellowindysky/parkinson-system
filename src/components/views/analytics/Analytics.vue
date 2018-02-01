<template lang="html">
  <div class="analytics">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    checkRoute() {
      var path = this.$route.path;
      // 检查路由，如果发现没有选择具体的统计分析类型，那么就默认跳转到基础统计
      if (/^\/analytics\/?$/.test(path)) {
        this.$router.replace({
          name: 'basicAnalytics'
        });
      }
    }
  },
  mounted() {
    this.checkRoute();
  },
  watch: {
    '$route.path'() {
      this.checkRoute();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
