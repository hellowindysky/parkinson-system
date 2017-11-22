<template lang="html">
  <div class="folding-panel-wrapper">
    <div class="header">
      <div class="iconfont" :class="iconToggleFolded"></div>
      <h2 class="title" @click="toggleFoldedPanel">{{title}}</h2>
      <div v-show="editable && mode===READING_MODE" class="button edit-button" :class="{showedit: !archived}" @click="edit">编辑</div>
      <div v-show="editable && mode===EDITING_MODE && !isCardsPanel" class="button cancel-button" @click="cancel">取消</div>
      <div v-show="editable && isCardsPanel" class="button add-button" @click="add">添加</div>
      <div v-show="editable && mode===EDITING_MODE" class="button submit-button" @click="submit">{{submitText}}</div>

      <el-select v-show="isCardsPanel" v-model="filterCondition" size="small" placeholder="筛选" class="button filter-button"
        @change="filterCards" :class="{'without-other-button': !editable}">
        <el-option label="全部" :value="FILTER_ALL"></el-option>
        <el-option label="已归档" :value="FILTER_ARCHIVED"></el-option>
        <el-option label="未归档" :value="FILTER_UNARCHIVED"></el-option>
      </el-select>
    </div>
    <div class="content" :class="{'folded': folded}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  props: {
    title: {
      required: true,
      type: String
    },
    foldedStatus: {
      required: false,
      type: Boolean,
      default: true   // 如果没有传入这个参数，默认状态下面板是折叠的
    },
    mode: {
      type: String,
      default: this.READING_MODE
    },
    isCardsPanel: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    archived: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      folded: this.foldedStatus,
      filterCondition: this.FILTER_ALL
    };
  },
  computed: {
    iconToggleFolded() {
      return this.folded ? 'icon-down' : 'icon-up';
    },
    submitText() {
      if (this.$route.params.id === 'newPatient' || this.$route.params.caseId === 'newCase') {
        return '下一步';
      } else {
        return '完成';
      }
    }
  },
  methods: {
    toggleFoldedPanel() {
      this.$emit(this.TOGGLE_FOLDED_PANEL);
      this.folded = !this.folded;
    },
    edit() {
      this.$emit(this.EDIT);
      // 进入编辑状态，面板自动展开
      this.folded = false;
    },
    cancel() {
      this.$emit(this.CANCEL);
    },
    submit() {
      this.$emit(this.SUBMIT);
    },
    add() {
      this.$emit(this.ADD_NEW_CARD);
    },
    filterCards() {
      this.$emit(this.UPDATE_FILTER_CONDITION, this.filterCondition);
    }
  },
  mounted() {
    // 默认让以下面板呈展开状态（开发过程中随时调整）
    const DEFAULT_OPEN_LIST = [];
    if (DEFAULT_OPEN_LIST.indexOf(this.title) > -1) {
      this.folded = false;
    }
  },
  watch: {
    folded: function() {
      // 每当面板的折叠状态发生变化，就会通知所在的滚动区域，需要重新计算高度
      setTimeout(() => {
        // 之所以要延时发送事件，是为了等待折叠动画结束
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    },
    foldedStatus: function(newFoldedStatus) {
      this.folded = newFoldedStatus;
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@panel-header-height: 40px;

.showedit{
  display: none !important;
}

.folding-panel-wrapper {
  background-color: @background-color;
  font-size: 0;
  overflow: hidden;
  .header {
    position: relative;
    height: @panel-header-height;
    .title {
      margin: 0;
      position: absolute;
      display: inline-block;
      padding-left: 20px;
      left: 0;
      width: 100%;
      height: @panel-header-height;
      line-height: @panel-header-height;
      text-align: left;
      font-size: @large-font-size;
      cursor: pointer;
      color: @font-color;
      &:hover {
        color: lighten(@font-color, 20%);
      }
    }
    .iconfont {
      position: absolute;
      display: inline-block;
      left: 110px;
      top: 0;
      height: @panel-header-height;
      line-height: @panel-header-height;
      color: @button-color;
    }
    .button {
      position: absolute;
      top: 6px;
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
      &.edit-button {
        right: 10px;
        background-color: @button-color;
      }
      &.cancel-button, &.add-button {
        right: 30px + @small-button-width;
        background-color: @light-font-color;
      }
      &.submit-button {
        right: 10px;
        background-color: @button-color;
      }
      &.filter-button {
        right: 50px + @small-button-width * 2;
        &.without-other-button {
          right: 10px;
        }
        .el-input {
          font-size: @normal-font-size;
          .el-input__inner {
            padding-left: 4px;
            padding-right: 20px;
            height: @small-button-height;
            line-height: @small-button-height;
            border: none;
            border-radius: 0;
            border-bottom: 1px solid @light-gray-color;
            // background-color: @secondary-button-color;
            color: @font-color;
            text-align: center;
          }
          .el-input__icon {
            width: 22px;
          }
        }
      }
    }
  }
  .content {
    width: auto;
    box-sizing: border-box;
    height: auto;
    overflow: hidden;
    padding: 10px 0;
    transition: all 0.2s;
    &.folded {
      height: 0;
      opacity: 0.3;
      padding: 0;
    }
  }
}

</style>
