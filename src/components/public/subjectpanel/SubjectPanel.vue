<template lang="html">
  <div class="subject-panel">
    <div class="iconfont icon-close" @click="closePanel"></div>
    <p class="title">添加课题（带颜色的为已加入的课题，点击标签即可加入或移出）</p>
    <div class="subject-wrapper" ref="scrollArea">
      <el-tooltip v-for="(subject, index) in allSubjects"
        :key="subject.id"
        class="subject-item"
        :class="{'selected': subjectSelectedList[index]}"
        effect="dark"
        :content="subject.taskName"
        placement="top">
        <el-button @click="toggleSelected(index)">{{subject.taskName}}</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getSubjectList, addPatientToSubject, removePatientFromSubject } from 'api/subject.js';

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
    belongSubjects: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      allSubjects: [],
      subjectSelectedList: []
    };
  },
  computed: {},
  methods: {
    closePanel() {
      this.$emit(this.HIDE_SUBJECT_PANEL);
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
      var value = !this.subjectSelectedList[index];
      var subjectId = this.allSubjects[index].id;
      var patientId = Number(this.patientId);
      var patientSubject = {
        taskInfoId: subjectId,
        patientId: patientId
      };
      if (value) {
        addPatientToSubject([patientSubject]).then(() => {
          let listIndex = lockList.indexOf(index);
          this.$emit(this.UPDATE_PATIENT_SUBJECT_INFO);
          lockList.splice(listIndex, 1);
          this.$set(this.subjectSelectedList, index, value);
        }, (error) => {
          console.log(error);
          let listIndex = lockList.indexOf(index);
          lockList.splice(listIndex, 1);
        });
      } else {
        removePatientFromSubject([patientSubject]).then(() => {
          let listIndex = lockList.indexOf(index);
          this.$emit(this.UPDATE_PATIENT_SUBJECT_INFO);
          lockList.splice(listIndex, 1);
          this.$set(this.subjectSelectedList, index, value);
        }, (error) => {
          console.log(error);
          if (error.code === 2010) {
            Bus.$emit(this.NOTICE, '注意', '患者正在该课题中进行实验，不允许移出课题');
          }
          let listIndex = lockList.indexOf(index);
          lockList.splice(listIndex, 1);
        });
      }
    }
  },
  watch: {
    display: function(val) {
      if (val === true) {
        getSubjectList().then((data) => {
          this.allSubjects = data;
          let length = this.allSubjects.length;
          this.subjectSelectedList = [];
          for (var i = 0; i < length; i++) {
            var value = false;
            for (let belongSubject of this.belongSubjects) {
              if (this.allSubjects[i].id === belongSubject.leafId) {
                value = true;
              }
            }
            this.$set(this.subjectSelectedList, i, value);
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

.subject-panel {
  display: block;
  padding: 10px 0;
  width: @subject-panel-width;
  height: @subject-panel-height;
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
  .subject-wrapper {
    position: relative;
    height: 340px;
    padding: 0 10px;
    text-align: left;
    overflow: hidden;
    .subject-item {
      display: inline-block;
      margin: 5px 3%;
      padding: 0 5px;
      width: 27.33%;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      background-color: #fff;
      color: @light-font-color;
      border: 0;
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
