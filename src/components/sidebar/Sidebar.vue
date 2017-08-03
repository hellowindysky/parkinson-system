<template lang="html">
  <ul class="sidebar">
    <li class="item" :class="{'current-item': currentItem === 'patients'}" @click="togglePatientsList">
      <div class="iconfont icon-patients-management"></div>
      <div class="title">患者管理</div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showPatientsList}">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'myPatients'}" @click="chooseMyPatients">
        我的患者
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'groupsManagement'}" @click="chooseGroupsManagement">
        分组管理
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'otherPatients'}" @click="chooseOtherPatients">
        科室患者
      </li>
    </ul>
    <li class="item" :class="{'current': currentItem === 'analytics'}">
      <div class="iconfont icon-analytics"></div>
      <div class="title">统计分析</div>
    </li>
    <li class="item" :class="{'current': currentItem === 'configuration'}">
      <div class="iconfont icon-configuration"></div>
      <div class="title">系统配置</div>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      showPatientsList: false
    };
  },
  computed: {
    currentItem() {
      var path = this.$route.path;
      if (/^\/patients/.test(path)) {
        return 'patients';
      } else if (/^\/analytics/.test(path)) {
        return 'analytics';
      } else if (/^\/configuration/.test(path)) {
        return 'configuration';
      }
    },
    currentSubItem() {
      var path = this.$route.path;
      if (/^\/patients\/list/.test(path)) {
        return 'myPatients';
      } else if (/^\/patients\/groups/.test(path)) {
        return 'groupsManagement';
      } else if (/^\/patients\/otherList/.test(path)) {
        return 'otherPatients';
      }
    }
  },
  methods: {
    togglePatientsList() {
      this.showPatientsList = !this.showPatientsList;
    },
    chooseMyPatients() {
      // 如果当前路径不是以“/patients/list”开头了，才发生跳转
      if (!/^\/patients\/list/.test(this.$route.path)) {
        this.$router.push({name: 'myPatients'});
      }
    },
    chooseGroupsManagement() {
      // 如果当前路径不是以“/patients/groups”开头了，才发生跳转
      if (!/^\/patients\/groups/.test(this.$route.path)) {
        this.$router.push({name: 'groupsManagement'});
      }
    },
    chooseOtherPatients() {
      // 如果当前路径不是以“/patients/otherList”开头了，才发生跳转
      if (!/^\/patients\/otherList/.test(this.$route.path)) {
        this.$router.push({name: 'otherPatients'});
      }
    }
  },
  mounted() {
    // 初始化该组件时，自动跳转到病患列表(第一个选项所对应的列表)
    if (!/^\/patients/.test(this.$route.path)) {
      this.$router.replace({ name: 'myPatients' });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@item-height: 60px;

.sidebar {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: @theme-color;
  color: @inverse-font-color;
  .item {
    position: relative;
    margin-top: 0;
    width: 100%;
    height: @item-height;
    cursor: pointer;
    list-style: none;
    &:hover {
      background-color: lighten(@theme-color, 10%);
    }
    &.current-item {
      background-color: @button-color;
      color: @button-font-color;
    }
    .iconfont {
      display: inline-block;
      font-size: 24px;
      line-height: @item-height;
      vertical-align: middle;
    }
    .title {
      display: inline-block;
      font-size: @normal-font-size;
      line-height: @item-height;
      vertical-align: middle;
    }
  }
  .sub-item-list {
    margin: 0;
    padding: 10px 0 20px;
    box-sizing: border-box;
    background-color: @font-color;
    overflow: hidden;
    transition: 0.2s;
    &.folded {
      height: 0;
      padding: 0;
    }
    .sub-item {
      padding-left: 10px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        background-color: lighten(@font-color, 10%);
      }
      &.current-sub-item {
        color: @button-color;
      }
    }
  }
}
</style>
