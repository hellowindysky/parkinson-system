<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery';

$(function() {
  // 屏幕缩放时，重新调整大小
  var resize = function() {
    var deviceWidth = document.documentElement.clientWidth;
    var deviceHeight = document.documentElement.clientHeight;
    // console.log(deviceWidth, deviceHeight);

    var $particlesArea = $('#particles');
    $particlesArea.width(deviceWidth);
    $particlesArea.height(deviceHeight);
  };
  window.addEventListener('resize', resize, false);
  resize();

  // 载入特效背景
  window.particlesJS.load('particles', 'static/js/config/particles.json', function() {
    console.log('callback: particles-js config loaded');
  });
});

export default {
  name: 'app',
  created() {
    // 默认跳转到login页面
    this.$router.push('login');
  }
};
</script>

<style lang="less">
@import '~styles/variables.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @font-color;
  user-select: none;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>
