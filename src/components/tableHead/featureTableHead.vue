<template>
  <div class="featureTableHead">
    <ul class="tableHeado" >
      <li>功能名称</li>
      <li>功能</li>
      <li>开通</li>
      <li>必填</li>
    </ul>
    <ul class="tableHeadtw">
      <li>功能</li>
      <li>开通</li>
      <li>必填</li>
    </ul>
    <ul class="tableHeadth">
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

@table-head-one-Wid: 40%;
@table-head-two-Wid: 29%;
@table-head-three-Wid: 29%;

@td-one-width: 25%;
@td-two-width: 33.33%;

@table-head-margin:0.5%;

.featureTableHead {
  padding-top: 15px;
  box-sizing: border-box;
  ul {
    position: relative;
    height: @table-head-height;
    margin: 0;
    padding: 0;
    float: left;
    background: @theme-color;
    z-index: 100;
    color: @background-color;
    border-radius: 2px;
    box-sizing: border-box;
    list-style: none;
    font-size: @normal-font-size;
    margin-left: @table-head-margin;
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
        width: @td-one-width;
    }
  }
  .tableHeadtw {
   width: @table-head-two-Wid;
   li{
        width: @td-two-width;
    }
  }
  .tableHeadth {
    width: @table-head-three-Wid;
     li{
        width: @td-two-width;
    }
  }
}
</style>
