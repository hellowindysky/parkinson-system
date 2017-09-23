<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <img class="image" src="~img/profile.png" alt="">
    <div class="name">{{user.realname}}</div>
    <div class="date">{{user.createDate}}</div>
    <div class="title">{{title}}</div>
    <div class="type">{{type}}</div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: false
    }
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    selected() {
      var path = this.$route.path;
      var re = new RegExp('^\/configuration\/userManagement\/list\/' + this.user.id);
      if (re.test(path)) {
        return true;
      } else {
        return false;
      }
    },
    title() {
      // 1/主任医师 2/副主任医师 3/主治医师 4/医师 5/住院医师
      var allTitles = ['无', '主任医师', '副主任医师', '主治医师', '医师', '住院医师'];
      var index = this.user.jobtitle ? this.user.jobtitle : 0;
      return allTitles[index];
    },
    type() {
      var roleName = this.user.roleName ? this.user.roleName : '';
      var types = roleName.split(',');
      return types[0] ? types[0] : '无';   // 现在的角色类型有多个，默认显示第一个
    }
  },
  mounted() {
  },
  methods: {
    select() {
      this.$router.push({
        name: 'userInfo',
        params: { id: this.user.id }
      });
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
    width: 100px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .date {
    position: absolute;
    font-size: @small-font-size;
    right: 20px;
    top: 12px;
  }
  .title {
    position: absolute;
    font-size: @small-font-size;
    left: 60px;
    top: 35px;
  }
  .type {
    position: absolute;
    font-size: @small-font-size;
    right: 20px;
    top: 35px;
  }
}
</style>
