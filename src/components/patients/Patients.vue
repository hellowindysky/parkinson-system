<template lang="html">
  <div class="content-wrapper">
    <sidebar class="sidebar"></sidebar>
    <list></list>
    <div class="toggle-list-button" :class="{'hide-list-state': !listDisplay}" @click="toggleList">
      <div class="arrow">{{arrowText}}</div>
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
    arrowText() {
      return this.listDisplay ? '<<' : '>>';
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
@sidebar-width: 70px;
@list-width: 250px;
@bar-width: 25px;

.content-wrapper {
  background-color: #fafafa;
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
    background-color: #666;
    cursor: pointer;
    transition: 0.3s;
    z-index: 200;
    &.hide-list-state {
      left: @sidebar-width;
    }
    .arrow {
      position: absolute;
      top: 50%;
      width: 100%;
      height: @bar-width;
      transform: translateY(-50%);
      color: #fff;
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
