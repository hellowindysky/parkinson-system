<template lang="html">
  <div id='particles'></div>
</template>

<script>
import $ from 'jquery';
import 'particles.js';
import particlesConfig from './particlesConfig.js';

export default {
  mounted() {
    // 屏幕缩放时，重新调整大小
    var resize = function() {
      var deviceWidth = document.documentElement.clientWidth;
      var deviceHeight = document.documentElement.clientHeight;

      var $particlesArea = $('#particles');
      $particlesArea.width(deviceWidth);
      $particlesArea.height(deviceHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    // 载入特效背景
    window.particlesJS('particles', particlesConfig);
  }
};
</script>

<style lang="less" scoped>
#particles {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
}
</style>
