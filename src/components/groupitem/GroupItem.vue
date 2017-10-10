<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <div class="name">{{groupName}}</div>
    <div class="number">患者: {{memberNumber}}人</div>
    <div class="tag">{{groupTypeName}}</div>
    <div class="bottom-line"></div>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      typs: Object,
      default: {}
    }
  },
  computed: {
    groupId() {
      return this.group.groupId ? this.group.groupId : '';
    },
    groupName() {
      return this.group.groupName ? this.group.groupName : '';
    },
    groupType() {
      return this.group.groupType ? this.group.groupType : '';
    },
    groupTypeName() {
      if (this.groupType === 1) {
        return '临床';
      } else if (this.groupType === 2) {
        return '科研';
      }
    },
    memberNumber() {
      return this.group.memberNumber ? this.group.memberNumber : '';
    },
    remark() {
      return this.group.remarks ? this.group.remarks : '';
    },
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    selected() {
      var path = this.$route.path;
      var str = '^\/patients\/groups\/';
      var re = new RegExp(str + this.groupId);
      if (re.test(path)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    select() {
      this.$router.replace({
        name: 'groupInfo',
        params: { id: this.groupId }
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
  height: 65px;
  padding: 5px;
  overflow: hidden;
  .name {
    position: absolute;
    font-size: @normal-font-size;
    left: 15px;
    top: 10px;
  }
  .number {
    position: absolute;
    font-size: @small-font-size;
    left: 15px;
    top: 40px;
  }
  .tag {
    position: absolute;
    font-size: @small-font-size;
    right: 15px;
    top: 8px;
    width: 45px;
    height: 20px;
    line-height: 20px;
    background-color: @button-color;
    color: #fff;
  }
  .bottom-line {
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 90%;
    height: 1px;
    background-color: lighten(@light-gray-color, 2%);
  }
}
</style>
