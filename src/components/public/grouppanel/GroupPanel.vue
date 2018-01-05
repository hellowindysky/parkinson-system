<template lang="html">
  <div class="group-panel">
    <div class="iconfont icon-close" @click="closePanel"></div>
    <p class="title">添加分组（带颜色的为已加入的组，点击标签即可加入或移出）</p>
    <div class="group-wrapper" ref="scrollArea">
      <div class="group-item" v-for="(group, index) in allGroups"
        :class="{'selected': groupSelectedList[index]}" @click="toggleSelected(index)">
        {{group.groupName}}
      </div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { getGroupList, addGroupMembers, removeGroupMembers } from 'api/group.js';

var lockList = [];  // 这个数组用来标记正在发生状态改变的分组

export default {
  props: {
    display: {
      type: Boolean,
      default: false
    },
    patientId: {
      type: Number,
      default: ''
    },
    belongGroups: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      allGroups: [],
      groupSelectedList: []
    };
  },
  computed: {},
  methods: {
    closePanel() {
      this.$emit(this.HIDE_GROUP_PANEL);
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    toggleSelected(index) {
      if (lockList.indexOf(index) >= 0) {
        return;   // 请求在发送过程中时，再次点击没有效果
      }
      lockList.push(index);
      var value = !this.groupSelectedList[index];
      this.$set(this.groupSelectedList, index, value);
      var groupId = this.allGroups[index].groupId;
      var patientId = Number(this.patientId);
      if (value) {
        addGroupMembers(groupId, [patientId]).then(() => {
          let listIndex = lockList.indexOf(index);
          this.$emit(this.UPDATE_PATIENT_GROUP_INFO);
          lockList.splice(listIndex, 1);
        }, (error) => {
          console.log(error);
        });
      } else {
        removeGroupMembers(groupId, [this.patientId]).then(() => {
          let listIndex = lockList.indexOf(index);
          this.$emit(this.UPDATE_PATIENT_GROUP_INFO);
          lockList.splice(listIndex, 1);
        }, (error) => {
          console.log(error);
        });
      }
    }
  },
  watch: {
    display: function(val) {
      if (val === true) {
        var condition = {};
        condition.groupModule = this.$store.state.subjectId === this.SUBJECT_ID_FOR_HOSPITAL ? 1 : 2;
        getGroupList(condition).then((data) => {
          this.allGroups = data;
          let length = this.allGroups.length;
          this.groupSelectedList = [];
          for (var i = 0; i < length; i++) {
            var value = false;
            for (let belongGroup of this.belongGroups) {
              if (this.allGroups[i].groupId === belongGroup.groupId) {
                value = true;
              }
            }
            this.$set(this.groupSelectedList, i, value);
          }
          this.updateScrollbar();
        }, (error) => {
          console.log(error);
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.group-panel {
  display: block;
  padding: 10px 0;
  width: @group-panel-width;
  height: @group-panel-height;
  box-sizing: border-box;
  background-color: @theme-color;
  .iconfont {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 22px;
    color: #fff;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.8;
    }
  }
  .title {
    margin: 10px 25px;
    font-size: @normal-font-size;
    color: #fff;
    text-align: left;
  }
  .group-wrapper {
    position: relative;
    height: 340px;
    padding: 0 10px;
    text-align: left;
    overflow: hidden;
    .group-item {
      display: inline-block;
      margin: 5px 3%;
      padding: 0 5px;
      width: 27.33%;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      background-color: #fff;
      color: @light-font-color;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.1s;
      cursor: pointer;
      &.selected {
        background-color: @button-color;
        color: #fff;
      }
      &:hover {
        opacity: 0.9;
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 10px;
      right: 0;
      box-sizing: border-box;
      opacity: 0.6;
      transition: opacity 0.3s;
      .ps__scrollbar-y {
        position: relative;
        background-color: @inverse-font-color;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.8;
      }
    }
  }
}
</style>
