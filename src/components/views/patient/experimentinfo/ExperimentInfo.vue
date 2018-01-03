<template lang="html">
  <div class="experiment-info">

  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    var subjectId = sessionStorage.getItem('subjectId');
    if (subjectId > 0) {
      next();
    } else {
      next(from.path);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

</style>
