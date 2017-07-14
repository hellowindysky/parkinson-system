<template lang="html">
  <div class="item">
    <img class="image" src="~img/profile.png" alt="">
    <div class="name">陈晓晓</div>
    <div class="date">2017/01/01</div>
    <div class="gender">男</div>
    <div class="age">34岁</div>
    <div class="location">北京</div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.item {
  position: relative;
  width: 100%;
  height: 65px;
  padding: 5px;
  box-sizing: border-box;
  background-color: #bbb;
  border-bottom: 1px solid #888;
  &:hover {
    background-color: #ddd;
  }
  .image {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 40px;
    height: 40px;
  }
  .name {
    position: absolute;
    font-size: @normal-font-size;
    left: 65px;
    top: 10px;
  }
  .date {
    position: absolute;
    font-size: @small-font-size;
    left: 180px;
    top: 12px;
  }
  .gender {
    position: absolute;
    font-size: @small-font-size;
    left: 65px;
    top: 40px;
  }
  .age {
    position: absolute;
    font-size: @small-font-size;
    left: 90px;
    top: 40px;
  }
  .location {
    position: absolute;
    font-size: @small-font-size;
    left: 130px;
    top: 40px;
  }
}
</style>
