<template lang="html">
  <div class="content-wrapper">
    <sidebar class="sidebar"></sidebar>
    <router-view class="list" name="list"></router-view>
    <div class="toggle-list-button" @click="toggleList">
      <div class="arrow"></div>
    </div>
    <router-view class="content" name="content"></router-view>
  </div>
</template>

<script>
import $ from 'jquery';

import sidebar from 'components/sidebar/Sidebar';

var toggleListButton;
var contentArea;
var arrow;

export default {
  data() {
    return {
      listDisplay: true
    };
  },
  mounted() {
    toggleListButton = $('.toggle-list-button');
    contentArea = $('.content');
    arrow = $('.arrow');
    arrow.text('<<');
  },
  methods: {
    toggleList() {
      if (this.listDisplay) {
        // Then will hide list
        toggleListButton.addClass('hide-list-state');
        contentArea.addClass('hide-list-state');
        arrow.text('>>');
        this.listDisplay = false;

      } else if (!this.listDisplay) {
        // Then will show list
        toggleListButton.removeClass('hide-list-state');
        contentArea.removeClass('hide-list-state');
        arrow.text('<<');
        this.listDisplay = true;
      }
    }
  },
  components: {
    sidebar
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
      transform: translateY(-50%);
      color: #fff;
    }
  }
  .content {
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
