<template lang="html">
  <div class="medicine-modal">

  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  methods: {
    showModal() {
      console.log('模态框出现了！');
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MEDICINE_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$on(this.SHOW_MEDICINE_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.medicine-modal {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
