<template lang="html">
  <div id='particles'></div>
</template>

<script>
import 'particles.js';
import particlesConfig from './particlesConfig.js';

export default {
  mounted() {
    // 载入特效背景
    window.particlesJS('particles', particlesConfig);
  }
};
</script>

<style lang="less" scoped>
@import '~styles/variables.less';
#particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: @theme-color;
  z-index: -100;
}
</style>
