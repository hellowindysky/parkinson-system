<template lang="html">
  <div class="extensible-panel-wrapper">
    <div class="header">
      <h2 class="title" @click="toggleExtendedStatus">{{title}}（5条记录）</h2>
      <div v-show="status==='normal' && mode==='editing'" class="button add-button" @click="add">添加</div>
      <div v-show="status==='normal'" class="button extend-button" @click="extend">展开</div>
      <div v-show="status==='extended'" class="button shrink-button" @click="shrink">收起</div>
    </div>
    <div class="content" :class="{'extended': status==='extended'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const NORMAL_STATUS = 'normal';
const EXTENDED_STATUS = 'extended';

export default {
  props: {
    mode: {
      type: String
    }
  },
  data() {
    return {
      status: 'normal'
    };
  },
  methods: {
    add() {

    },
    extend() {
      this.status = 'extended';
    },
    shrink() {
      this.status = 'normal';
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.extensible-panel-wrapper {
  .header {
    width: 100%;
    height: 45px;
    .title {

    }
    .button {

    }
    .content {
      height: 100px;
      &.extended {
        height: auto;
      }
    }
  }
}

</style>
