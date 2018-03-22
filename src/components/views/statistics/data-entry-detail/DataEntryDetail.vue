<template lang="html">
  <div class="data-entry-detail">
    <div class="condition-bar">
      {{type}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  computed: {
    type() {
      if (this.$route.matched.some(record => record.meta.dataEntryDetail)) {
        return 'dataEntryDetail';
      } else if (this.$route.matched.some(record => record.meta.historyStatistics)) {
        return 'historyStatistics';
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.data-entry-detail {
  width: 100%;
  height: 100%;
  .condition-bar {
    width: 100%;
    height: 60px;
    background-color: #fff;
  }
}
</style>
