<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <img class="image" src="~img/profile.png" alt="">
    <div class="name">{{role.roleName}}</div>
    <div class="date">{{role.createDate}}</div>
    <div class="count">{{role.userNum}}人</div>
    <div class="type">{{type}}</div>
  </div>
</template>

<script>
export default {
  props: {
    role: {
      type: Object,
      required: false
    }
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    selected() {
      var path = this.$route.path;
      var re = new RegExp('^\/configuration\/roleManagement\/list\/' + this.role.id);
      if (re.test(path)) {
        return true;
      } else {
        return false;
      }
    },
    type() {
      var types = ['无', '默认', '自定义'];
      var index = this.role.roleType ? this.role.roleType : 0;
      return types[index] ? types[index] : '??';
    }
  },
  mounted() {
  },
  methods: {
    select() {
      this.$router.push({
        name: 'roleInfo',
        params: { id: this.role.roleId }
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
  .count {
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
