<template lang="html">
  <div class="user-management">
    <list></list>
    <div class="toggle-list-button" :class="{'hide-list-state': !listDisplay}" @click="toggleList">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <router-view class="content-area" :class="{'hide-list-state': !listDisplay}" name="content" :key="key"></router-view>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import List from 'components/list/List';

export default {
  data() {
    return {
      listDisplay: false
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
    Bus.$off(this.TOGGLE_LIST_DISPLAY);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.user-management {
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
    &.hide-list-state {
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
    &.hide-list-state {
      left: @bar-width;
      width: calc(~"100% - @{bar-width}");
    }
  }
}
</style>
