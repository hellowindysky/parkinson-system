<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <img class="image" src="~img/profile.png" alt="">
    <div class="name">陈晓晓</div>
    <div class="gender iconfont icon-male"></div>
    <div class="date">2017/01/01</div>
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
      var re = new RegExp('^\/patients\/list\/' + this.id);
      if (re.test(path)) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    // console.log(this.id);
  },
  methods: {
    select() {
      this.$router.push({ name: 'patientInfo', params: { id: this.id }});
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.item {
  position: relative;
  width: 100%;
  height: 60px;
  padding: 5px;
  .image {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 35px;
    height: 35px;
  }
  .name {
    position: absolute;
    font-size: @normal-font-size;
    left: 60px;
    top: 10px;
  }
  .gender {
    position: absolute;
    font-size: @small-font-size;
    left: 110px;
    top: 10px;
    &.icon-male {
      color: @male-color;
    }
  }
  .date {
    position: absolute;
    font-size: @small-font-size;
    right: 20px;
    top: 12px;
  }
  .age {
    position: absolute;
    font-size: @small-font-size;
    left: 60px;
    top: 35px;
  }
  .location {
    position: absolute;
    font-size: @small-font-size;
    left: 100px;
    top: 35px;
  }
}
</style>
