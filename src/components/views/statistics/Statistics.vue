<template lang="html">
  <div class="statistics">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    checkRoute() {
      var path = this.$route.path;
      // 检查路由，如果发现没有选择具体的运营统计类型，那么就默认跳转到录入统计
      if (/^\/statistics\/?$/.test(path)) {
        this.$router.replace({
          name: 'dataEntryDetail'
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
@import "~styles/variables.less";
.statistics {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  background-color: @screen-color;
  box-sizing: border-box;
}
</style>
