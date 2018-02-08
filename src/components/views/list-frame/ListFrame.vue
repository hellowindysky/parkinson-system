<template lang="html">
  <div class="content-wrapper">
    <list></list>
    <div class="toggle-list-button" :class="{'hide-list-status': !listDisplay}" @click="toggleList">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <div class="content-area content-background" :class="{'hide-list-status': !listDisplay}"></div>
    <router-view class="content-area" :class="{'hide-list-status': !listDisplay}" name="content" :key="key"></router-view>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import List from 'views/list/List';

export default {
  data() {
    return {
      listDisplay: true
    };
  },
  computed: {
    toggleIconClass() {
      return this.listDisplay ? 'icon-arrow-left' : 'icon-arrow-right';
    },
    key() {
      // 绑定这个变量作为属性之后，点击列表中的其它选项，就会保证右侧的内容组件重新加载（组件的属性不同时，会重新触发 mounted 钩子）
      return this.$route.params.id !== undefined ? this.$route.params.id : 0;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_LIST, () => {
      this.listDisplay = true;
    });
  },
  methods: {
    toggleList() {
      this.listDisplay = !this.listDisplay;

      // 如果列表折叠情况发生变化，右侧的区域宽度就会改变，里面的一些元素需要重新计算宽度，因此发送事件通知
      // 由于这个动画会有一定时间，因此在动画结束之后再发送事件
      setTimeout(() => {
        Bus.$emit(this.TOGGLE_LIST_DISPLAY);
      }, 300);
    }
  },
  components: {
    List
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_LIST);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.content-wrapper {
  .list {
    position: absolute;
    left: 0;
    width: @list-width;
    height: 100%;
    z-index: 100;
  }
  .toggle-list-button {
    position: absolute;
    left: @list-width;
    width: @bar-width;
    height: 100%;
    background-color: @screen-color;
    cursor: pointer;
    transition: 0.3s;
    z-index: 200;
    &.hide-list-status {
      left: 0;
    }
    .iconfont {
      position: absolute;
      left: -1px;
      font-size: 18px;
      top: 45%;
      width: 100%;
      transform: translateY(-50%);
      color: #ced1db;
    }
  }
  .content-area {
    position: absolute;
    left: @list-width + @bar-width;
    width: calc(~"100% - @{list-width} - @{bar-width}");
    height: 100%;
    transition: 0.3s;
    z-index: 200;
    &.hide-list-status {
      left: @bar-width;
      width: calc(~"100% - @{bar-width}");
    }
    &.content-background {
      background: @screen-color;
      z-index: 150;
    }
  }
}
</style>
