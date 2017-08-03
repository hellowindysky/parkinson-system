<template lang="html">
  <div class="content-wrapper">
    <list></list>
    <div class="toggle-list-button" :class="{'hide-list-state': !listDisplay}" @click="toggleList">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <router-view class="content-area" :class="{'hide-list-state': !listDisplay}" name="content" :key="key"></router-view>
  </div>
</template>

<script>
import list from 'components/list/List';

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
      // 绑定了这个变量之后，点击列表中的其它选项，就会保证右侧的内容组件重新加载
      return this.$route.params.id !== undefined ? this.$route.params.id : this.$route;
    }
  },
  mounted() {
  },
  methods: {
    toggleList() {
      this.listDisplay = !this.listDisplay;
    }
  },
  components: {
    list
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
