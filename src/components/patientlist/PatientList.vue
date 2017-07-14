<template lang="html">
  <div class="list">
    <div class="top-area">
      <div class="num-info">患者：345人</div>
      <div class="filter-button">筛选条件</div>
    </div>
    <div class="search-area">
      <el-input class="search-input" size="small" placeholder="请输入姓名或身份证号" icon="search" v-model="searchInput" :on-icon-click="clickSearchIcon"></el-input>
    </div>
    <div class="list-area">
      <patientListItem></patientListItem>
      <patientListItem></patientListItem>
    </div>
  </div>
</template>

<script>
import patientListItem from 'components/patientitem/PatientItem';

export default {
  data() {
    return {
      searchInput: ''
    };
  },
  methods: {
    clickSearchIcon(event) {
      console.log(event);
    }
  },
  components: {
    patientListItem
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
        background-color: #aaa;
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
}
</style>
