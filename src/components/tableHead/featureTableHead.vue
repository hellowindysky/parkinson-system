<template>
  <div class="featureTableHead">
    <ul class="tableHeado" >
      <li>功能</li>
      <li>开通</li>
      <li>必填</li>
    </ul>
    <ul class="tableHeado">
      <li>功能</li>
      <li>开通</li>
      <li>必填</li>
    </ul>
    <ul class="tableHeado">
      <li>功能</li>
      <li>开通</li>
      <li>必填</li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
@import "~styles/variables.less";
@featureTableHead-height: 70px;
@table-head-height: 45px;

@table-head-one-Wid: 32.6%;

@td-two-width: 33.33%;

@table-head-margin: 0.6%;

.featureTableHead {
  position: relative;
  padding-top: 15px;
  box-sizing: border-box;
  overflow: hidden;
  ul {
    height: @table-head-height;
    margin: 0;
    padding: 0;
    background: @theme-color;
    z-index: 100;
    color: @background-color;
    border-radius: 2px;
    list-style: none;
    font-size: @normal-font-size;
    margin-left: @table-head-margin;
    float: left;
    li {
      box-sizing: border-box;
      border-right: 1px solid @table-middle-button-color;
      line-height: 30px;
      margin-top: 8px;
      float: left;
    }
    li:last-child {
      border: none;
    }
  }
  ul:nth-of-type(3n+1){
    margin-left: 0;
  }
  .tableHeado {
    width: @table-head-one-Wid;
    li{
        width: @td-two-width;
    }
  }
}
</style>
