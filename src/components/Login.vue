<template>
  <div class='login'>
    <div id='particles'></div>
    <img src='../assets/logo.png'>
    <h1>{{ msg }}</h1>
    <!-- <div class='iconfont icon-medicine'></div> -->
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      msg: ''
    };
  }
};
</script>

<style scoped>

</style>
