<template lang="html">
  <div class="water-mark" ref="pic">
    <span class="text" v-for="i in array" :class="{'odd-row': checkIfInOddRow(i)}">
      {{accountName}}（账号：{{accountNumber}}）
    </span>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      picWidth: 0
    };
  },
  computed: {
    array() {
      var arr = [];
      for (var i = 0; i < 100; i++) {
        arr.push(i);
      }
      return arr;
    },
    orgName() {
      var orgName = sessionStorage.getItem('orgName');
      return orgName ? orgName : '';
    },
    accountName() {
      var name = sessionStorage.getItem('name');
      return name ? name : '';
    },
    accountNumber() {
      var accountNumber = sessionStorage.getItem('accountNumber');
      return accountNumber ? accountNumber : '';
    }
  },
  methods: {
    checkIfInOddRow(i) {
      // 判断是否为奇数排
      var rowNum = Math.floor(this.picWidth / 360);  // 360 是单位宽度
      if (Math.floor(i / rowNum) % 2 === 0) {
        return true;
      } else {
        return false;
      }
    },
    calcPicWidth() {
      this.$nextTick(() => {
        this.picWidth = this.$refs.pic.clientWidth;
      });
    }
  },
  mounted() {
    this.calcPicWidth;
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.calcPicWidth);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.water-mark {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  transform: rotate(-20deg);
  color: fade(@light-font-color, 30%);
  opacity: 0.9;
  pointer-events: none;   // 点击穿透
  z-index: 8000;
  .text {
    display: inline-block;
    width: 360px;
    height: 180px;
    line-height: 180px;
    &.odd-row {
      transform: translateX(-180px);
    }
  }
}
</style>
