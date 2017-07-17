<template lang="html">
  <div class="list">
    <div class="top-area">
      <div class="num-info">{{totalNumText}}</div>
      <div class="filter-button" @click="togglePanelDisplay" :class="{'active': panelDisplay}">
        筛选条件
        <span class="iconfont icon-moreunfold"></span>
      </div>
    </div>
    <div class="search-area">
      <el-input class="search-input" size="small" placeholder="请输入姓名或身份证号" icon="search" v-model="searchInput" :on-icon-click="clickSearchIcon"></el-input>
    </div>

    <div class="list-area" v-if="this.listType === 'patients'">
      <patientListItem></patientListItem>
      <patientListItem></patientListItem>
    </div>
    <div class="list-area" v-else-if="this.listType === 'groups'">
      <groupListItem></groupListItem>
      <groupListItem></groupListItem>
      <groupListItem></groupListItem>
    </div>

    <div class="filter-panel" v-show="panelDisplay" v-if="this.listType === 'patients'">

    </div>
    <div class="filter-panel" v-show="panelDisplay" v-else-if="this.listType === 'group'">

    </div>
  </div>
</template>

<script>
import patientListItem from 'components/patientitem/PatientItem';
import groupListItem from 'components/groupitem/GroupItem';

export default {
  data() {
    return {
      searchInput: '',
      panelDisplay: false
    };
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断列表类型
    listType() {
      var path = this.$route.path;
      if (path.match(/^\/patients\/list/)) {
        return 'patients';
      } else if (path.match(/^\/patients\/groups/)) {
        return 'groups';
      } else if (path.match(/^\/patients\/otherlist/)) {
        return 'patients';
      }
    },
    totalNumText() {
      if (this.listType === 'patients') {
        return '患者：345人';
      } else if (this.listType === 'groups') {
        return '分组：19个';
      }
    }
  },
  methods: {
    clickSearchIcon(event) {
      console.log(event);
    },
    togglePanelDisplay() {
      this.panelDisplay = !this.panelDisplay;
    }
  },
  components: {
    patientListItem,
    groupListItem
  },
  watch: {
    // 路由一旦发生变化，就关闭筛选面板
    $route() {
      this.panelDisplay = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@top-area-height: 40px;

.list {
  box-sizing: border-box;
  background-color: #999;
  .top-area {
    position: relative;
    width: 100%;
    height: @top-area-height;
    background-color: #ddd;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    font-size: @normal-font-size;
    text-align: left;
    .num-info {
      position: absolute;
      display: inline-block;
      left: 0;
      width: 50%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      line-height: @top-area-height;
      cursor: default;
    }
    .filter-button {
      position: absolute;
      display: inline-block;
      left: 50%;
      width: 50%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      line-height: @top-area-height;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.active {
        background-color: #aaa;
      }
      .iconfont {
        padding-left: 20px;
        font-size: @large-font-size;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
  .search-area {
    position: relative;
    width: 100%;
    height: 36px;
    padding: 3px 5px;
    box-sizing: border-box;
    background-color: #aaa;
    .search-input {
      // width: calc(~"100% - 20px");
    }
  }
  .filter-panel {
    position: absolute;
    top: @top-area-height;
    width: 100%;
    height: calc(~"100% - @{top-area-height}");
    background-color: rgba(32,32,32,0.9);
    z-index: 150;
  }
}
</style>
