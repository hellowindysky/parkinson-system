<template lang="html">
  <div class="item" :class="{'current': chosen}" @click="choose">
    <el-checkbox class="checkbox" v-show="mode===EDITING_MODE" v-model="selected"
      @change="toggleSelected"></el-checkbox>
    <!-- <div class="name" :class="{'right-shift': mode===EDITING_MODE}">{{groupName}}</div> -->
    <el-tooltip class="name"
      :class="{'right-shift': mode===EDITING_MODE}"
      effect="dark"
      :content="groupName"
      placement="top">
      <el-button>{{groupName}}</el-button>
    </el-tooltip>
    <div class="number" :class="{'right-shift': mode===EDITING_MODE}">患者:  {{memberNumber}}人</div>
    <div class="tag">{{groupTypeName}}</div>
    <div class="bottom-line"></div>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    group: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      selected: false
    };
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
      return this.group.memberNumber ? this.group.memberNumber : 0;
    },
    remark() {
      return this.group.remarks ? this.group.remarks : '';
    },
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    chosen() {
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
    choose() {
      this.$router.replace({
        name: 'groupInfo',
        params: { id: this.groupId }
      });
    },
    toggleSelected() {
      if (this.selected) {
        this.$emit('select');
      } else {
        this.$emit('unselect');
      }
    }
  },
  watch: {
    mode: function(newValue) {
      if (newValue === this.EDITING_MODE) {
        this.selected = false;
      }
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
  .checkbox {
    position: absolute;
    left: 10px;
    top: 25px;
  }
  .name {
    position: absolute;
    padding: 0;
    top: 10px;
    left: 15px;
    max-width: calc(~"100% - 80px");
    text-align: left;
    border: 0;
    background-color: rgba(0,0,0,0);
    font-size: @normal-font-size;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: 0.2s;
    &.right-shift {
      left: 45px;
    }
  }
  .number {
    position: absolute;
    font-size: @small-font-size;
    left: 15px;
    top: 40px;
    white-space: pre-wrap;
    transition: 0.2s;
    &.right-shift {
      left: 45px;
    }
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
