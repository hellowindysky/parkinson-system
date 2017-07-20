<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
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
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    selected() {
      var path = this.$route.path;
      var re = new RegExp('^\/patients\/list\/id=' + this.id);
      if (re.test(path)) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    console.log(this.id);
  },
  methods: {
    select() {
      this.$router.push('/patients/list/id=' + this.id);
    }
  }
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
  background-color: #eee;
  border-bottom: 1px solid #888;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
  &.current {
    background-color: #d0d0d0;
    &:hover {
      background-color: #d0d0d0;
    }
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
    left: 60px;
    top: 10px;
  }
  .date {
    position: absolute;
    font-size: @small-font-size;
    right: 10px;
    top: 12px;
  }
  .gender {
    position: absolute;
    font-size: @small-font-size;
    left: 60px;
    top: 40px;
  }
  .age {
    position: absolute;
    font-size: @small-font-size;
    left: 85px;
    top: 40px;
  }
  .location {
    position: absolute;
    font-size: @small-font-size;
    left: 125px;
    top: 40px;
  }
}
</style>
