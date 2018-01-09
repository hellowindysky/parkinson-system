<template lang="html">
  <div class="experiment-info">
    <div class="top-bar">
      <span class="title">实验流程</span>
      <div class="button light-button application-button" v-if="listType==='myPatients'" @click="applyTojoin">
        申请入组
      </div>
      <div class="button light-blue-button reject-button" v-if="listType==='appraisersPatients'" @click="rejectApplication">
        退回
      </div>
      <div class="button light-button agree-button" v-if="listType==='appraisersPatients'" @click="agreeApplication">
        通过
      </div>
      <div class="button light-button complete-therapy-button" v-if="listType==='therapistsPatients'" @click="completeTherapy">
        结束治疗
      </div>
    </div>
    <div class="content">
      <table class="process-table">
        <tr class="row title-row">
          <td class="col col-number">序号</td>
          <td class="col col-progress">节点</td>
          <td class="col col-executor">执行人</td>
          <td class="col col-status">状态</td>
          <td class="col col-start-time">开始时间</td>
          <td class="col col-end-time">结束时间</td>
          <td class="col col-remarks">处理意见</td>
        </tr>
        <tr class="row" v-for="(step, index) in progressList">
          <td class="col col-number">{{index + 1}}</td>
          <td class="col col-progress">{{step.milestone}}</td>
          <td class="col col-executor">{{step.executeBy}}</td>
          <td class="col col-status">完成</td>
          <td class="col col-start-time">{{step.startDate}}</td>
          <td class="col col-end-time">{{step.endDate}}</td>
          <td class="col col-remarks">{{step.remark}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus';
import { queryExperimentProgress } from 'api/experiment.js';

export default {
  data() {
    return {
      progressList: []
    };
  },
  computed: {
    listType() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return 'myPatients';
      } else if (this.$route.matched.some(record => record.meta.otherPatients)) {
        return 'otherPatients';
      } else if (this.$route.matched.some(record => record.meta.subjectPatients)) {
        return 'subjectPatients';
      } else if (this.$route.matched.some(record => record.meta.therapistsPatients)) {
        return 'therapistsPatients';
      } else if (this.$route.matched.some(record => record.meta.appraisersPatients)) {
        return 'appraisersPatients';
      } else {
        return 'unknown';
      }
    }
  },
  methods: {
    applyTojoin() {
      Bus.$emit(this.SHOW_APPLICATION_MODAL, this.ADD_NEW_CARD, {}, true);
    },
    rejectApplication() {
      Bus.$emit(this.SHOW_REJECTION_MODAL, this.ADD_NEW_CARD, {}, true);
    },
    agreeApplication() {
      Bus.$emit(this.SHOW_RATIFICATION_MODAL, this.ADD_NEW_CARD, {}, true);
    },
    completeTherapy() {
      Bus.$emit(this.SHOW_TERMINATION_MODAL, this.ADD_NEW_CARD, {}, true);
    }
  },
  mounted() {
    var experimentInfo = {
      'patientId': this.$route.params.id,
      'tcTaskId': this.$store.state.subjectId
    };
    queryExperimentProgress(experimentInfo).then((data) => {
      console.log(data);
      if (data && data.length > 0) {
        this.progressList = data;
      } else {
        this.progressList = [];
      }
    }, (error) => {
      console.log(error);
    });
  },
  beforeRouteEnter(to, from, next) {
    var subjectId = sessionStorage.getItem('subjectId');
    if (subjectId > 0) {
      next();
    } else {
      next(from.path);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.experiment-info {
  box-sizing: content-box;
  background-color: @screen-color;
  .top-bar {
    width: 100%;
    height: 40px;
    margin-bottom: 5px;
    padding-left: 20px;
    box-sizing: border-box;
    text-align: left;
    background-color: @background-color;
    .title {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: @large-font-size;
      font-weight: bold;
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      text-align: center;
      cursor: pointer;
      color: #fff;
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
      &.light-button {
        background-color: @button-color;
      }
      &.light-blue-button {
        background-color: @light-font-color;
      }
      &.application-button {
        right: 10px;
      }
      &.reject-button {
        right: 30px + @small-button-width;
      }
      &.agree-button {
        right: 10px;
      }
      &.complete-therapy-button {
        right: 10px;
      }
    }
  }
  .content {
    width: 100%;
    background-color: @background-color;
    .process-table {
      width: 100%;
      border-spacing: 0;
      table-layout: fixed;
      // border: 1px solid @light-gray-color;
      border-collapse: collapse;
      .row {
        width: 100%;
        height: 35px;
        &.title-row {
          background-color: @light-font-color;
          color: #fff;
        }
        .col {
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          &.col-number {
            width: 10%;
          }
          &.col-progress {
            width: 15%;
          }
          &.col-executor {
            width: 15%;
          }
          &.col-status {
            width: 15%;
          }
          &.col-start-time {
            width: 20%;
          }
          &.col-end-time {
            width: 20%;
          }
          &.col-remarks {
            width: 30%;
          }
        }
      }
    }
  }
}
</style>
