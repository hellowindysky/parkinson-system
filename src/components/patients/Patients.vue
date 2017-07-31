<template lang="html">
  <div class="content-wrapper">
    <sidebar class="sidebar"></sidebar>
    <list></list>
    <div class="toggle-list-button" :class="{'hide-list-state': !listDisplay}" @click="toggleList">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <router-view class="content-area" :class="{'hide-list-state': !listDisplay}" name="content"></router-view>
  </div>
</template>

<script>
import sidebar from 'components/sidebar/Sidebar';
import list from 'components/list/List';

export default {
  data() {
    return {
      listDisplay: true
    };
  },
  computed: {
    toggleIconClass() {
      return this.listDisplay ? 'icon-fold' : 'icon-unfold';
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
    sidebar,
    list
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

@list-width: 260px;
@bar-width: 15px;

.content-wrapper {
  .sidebar {
    position: absolute;
    left: 0;
    width: @sidebar-width;
    height: 100%;
  }
  .list {
    position: absolute;
    left: @sidebar-width;
    width: @list-width;
    height: 100%;
    z-index: 100;
  }
  .toggle-list-button {
    position: absolute;
    left: @sidebar-width + @list-width;
    width: @bar-width;
    height: 100%;
    background-color: @screen-color;
    cursor: pointer;
    transition: 0.3s;
    z-index: 200;
    &.hide-list-state {
      left: @sidebar-width;
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
    left: @sidebar-width + @list-width + @bar-width;
    width: calc(~"100% - @{sidebar-width} - @{list-width} - @{bar-width}");
    height: 100%;
    transition: 0.3s;
    z-index: 200;
    &.hide-list-state {
      left: @sidebar-width + @bar-width;
      width: calc(~"100% - @{sidebar-width} - @{bar-width}");
    }
  }
}
</style>
