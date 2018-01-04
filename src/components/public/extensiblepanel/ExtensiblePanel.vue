<template lang="html">
  <div class="extensible-panel-wrapper">
    <div class="header">
      <h4 class="title">{{title}}</h4>
      <div v-if="editable && !hideButtons" class="button add-button" @click="add">添加</div>
      <div v-show="status === NORMAL_STATUS && !hideButtons" class="button extend-button" @click="extend">展开</div>
      <div v-show="status === EXTENDED_STATUS && !hideButtons" class="button shrink-button" @click="shrink">收起</div>
    </div>
    <div class="content" :class="{'extended': status==='extended' || !shrinkable}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    title: {
      type: String,
      default: ''
    },
    hideButtons: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    shrinkable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      status: this.NORMAL_STATUS
    };
  },
  methods: {
    add() {
      this.$emit(this.ADD_NEW_CARD);
    },
    extend() {
      this.status = this.EXTENDED_STATUS;
      setTimeout(() => {
        // 之所以要延时发送事件，是为了等待 [扩展／伸缩] 动画结束
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    },
    shrink() {
      this.status = this.NORMAL_STATUS;
      setTimeout(() => {
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.showedit{
  display: none !important;
}
.extensible-panel-wrapper {
  background-color: @background-color;
  font-size: 0;
  .header {
    position: relative;
    padding-left: 20px;
    height: @small-button-height;
    line-height: @small-button-height;
    text-align: left;
    .title {
      margin: 0;
      font-size: @normal-font-size;
      cursor: default;
      color: @font-color;
    }
    .button {
      position: absolute;
      top: 0;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      text-align: center;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.extend-button {
        right: 10px;
        background-color: @button-color;
      }
      &.shrink-button {
        right: 10px;
        background-color: @button-color;
      }
      &.add-button {
        right: 30px + @small-button-width;
        background-color: @light-font-color;
      }
    }
  }
  .content {
    margin: 5px 10px 20px;
    padding: 5px;
    height: @card-height + @card-vertical-margin * 2 + 5px * 2;
    border: 1px solid @light-gray-color;
    overflow: hidden;
    transition: 0.2s;
    &.extended {
      padding: 5px;
      height: auto;
      min-height: 100px;
    }
    &.vitalsignsone {
      height: auto;
    }
  }
}

</style>
