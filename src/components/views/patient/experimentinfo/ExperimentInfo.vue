<template lang="html">
  <div class="experiment-info">
    <div class="top-bar">
      <span class="title">实验流程</span>
      <span v-if="milestoneNum > 2" class="info-text">
        实验方式 <span class="value experiment-mode">{{experimentModeText}}</span>
        治疗者 <span class="value therapist">{{therapist}}</span>
        评估者 <span class="value appraiser">{{appraiser}}</span>
        实验编号 <span class="value experiment-number">{{experimentNumber}}</span>
      </span>
      <div class="button light-button application-button"
        v-if="listType===MY_PATIENTS_TYPE && progressList.length===0"
        @click="applyTojoin">
        申请入组
      </div>
      <div class="button light-button application-button"
        v-if="listType===MY_PATIENTS_TYPE && isApplicationRejected"
        @click="applyTojoin">
        重新申请
      </div>
      <div class="button light-blue-button reject-button"
        v-if="listType===APPRAISERS_PATIENTS_TYPE && progressList.length>0 && milestoneNum===2 && status===1"
        @click="rejectApplication">
        退回
      </div>
      <div class="button light-button agree-button"
        v-if="listType===APPRAISERS_PATIENTS_TYPE && progressList.length>0 && milestoneNum===2 && status===1"
        @click="agreeApplication">
        通过
      </div>
      <div class="button light-button complete-therapy-button"
        v-if="listType===THERAPISTS_PATIENTS_TYPE && progressList.length>0 && milestoneNum===3"
        @click="completeTherapy">
        结束治疗
      </div>
      <div class="button light-button complete-follow-up-button"
        v-if="listType===APPRAISERS_PATIENTS_TYPE && progressList.length>0 && milestoneNum===4"
        @click="completeFollowUp">
        本期随访结束
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
          <td class="col col-progress">{{getMilestone(step, index)}}</td>
          <td class="col col-executor">{{step.executeBy ? step.executeBy : '——'}}</td>
          <td class="col col-status" :class="getStatusColor(step)">{{getStatusText(step)}}</td>
          <td class="col col-start-time">{{step.startDate ? step.startDate : '——'}}</td>
          <td class="col col-end-time">{{step.endDate}}</td>
          <td class="col col-remarks">
            {{step.remark}}
            <span class="iconfont icon-detail" @click="seeDetail(step)"
              v-if="index < progressList.length - 1"></span>
          </td>
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
      progressList: [],
      status: '',
      milestoneNum: '',
      experimentMode: '',
      therapist: '',
      appraiser: '',
      doctor: ''
    };
  },
  computed: {
    listType() {
      return this.$store.state.listType;
    },
    isApplicationRejected() {
      var length = this.progressList.length;
      if (length > 0) {
        var theLastStep = this.progressList[length - 1];
        var status = this.getStatus(theLastStep);
        if (status === 3) {
          return true;
        }
      }
      return false;
    },
    experimentModeText() {
      if (this.experimentMode === 1) {
        return '双盲实验';
      } else {
        return '';
      }
    }
  },
  methods: {
    applyTojoin() {
      Bus.$emit(this.SHOW_APPLICATION_MODAL, this.ADD_NEW_CARD, {}, true);
    },
    rejectApplication() {
      Bus.$emit(this.SHOW_REJECTION_MODAL, this.ADD_NEW_CARD, {}, true, this.doctor);
    },
    agreeApplication() {
      Bus.$emit(this.SHOW_RATIFICATION_MODAL, this.ADD_NEW_CARD, {}, true, this.therapist);
    },
    completeTherapy() {
      Bus.$emit(this.SHOW_TERMINATION_MODAL, this.ADD_NEW_CARD, {}, true, this.appraiser);
    },
    completeFollowUp() {
      Bus.$emit(this.SHOW_FOLLOW_UP_TERMINATION_MODAL, this.ADD_NEW_CARD, {}, true, this.appraiser);
    },
    seeDetail(step) {
      Bus.$emit(this.SHOW_EXPERIMENT_STEP_MODAL, this.VIEW_CURRENT_CARD, step, false);
    },
    getMilestoneNum(step) {
      var milestoneNum = 0;
      var phase = step.phase;
      if (phase && phase.split('.').length > 0) {
        milestoneNum = Number(phase.split('.')[0]);
      }
      return milestoneNum;
    },
    getMilestone(step, currentIndex) {
      var milestoneNum = this.getMilestoneNum(step);

      // 因为存在多个随访期，所以需要知道到底是第几个随访期
      if (milestoneNum === 4) {
        var count = 0;
        for (var i = 0; i <= currentIndex; i++) {
          if (this.getMilestoneNum(this.progressList[i]) === 4) {
            count += 1;
          }
        }
      }

      let milestoneList = ['', '筛选入组', '基线评估', '治疗期', '随访期', '实验结束'];

      if (milestoneNum === 4) {
        return milestoneList[milestoneNum] + '(' + count + ')';
      } else {
        return milestoneList[milestoneNum];
      }
    },
    getStatus(step) {
      var phase = step.phase;
      if (phase) {
        var status = phase.split('.')[1];
        if (status !== undefined) {
          return Number(status);
        }
      }
      return '';
    },
    getStatusText(step) {
      var status = this.getStatus(step);
      if (status === 0) {
        return '等待揭盲';
      } else if (status === 1) {
        return '进行中';
      } else if (status === 2) {
        return '完成';
      } else if (status === 3) {
        return '退回';
      }
    },
    getStatusColor(step) {
      var status = this.getStatus(step);
      if (status === 0) {
        return 'waiting';
      } else if (status === 1) {
        return 'ongoing';
      } else if (status === 2) {
        return 'finished';
      } else if (status === 3) {
        return 'rejected';
      }
    },
    updateExperimentProgress() {
      var experimentInfo = {
        'patientId': this.$route.params.id,
        'tcTaskId': this.$store.state.subjectId
      };
      queryExperimentProgress(experimentInfo).then((data) => {
        // console.log(data);
        if (data && data.patientExperiment && data.patientExperiment.length > 0) {
          this.progressList = data.patientExperiment;
        } else {
          this.progressList = [];
        }
        var currentPhase = data.status ? data.status : '';
        var status = currentPhase.split('.')[1] ? currentPhase.split('.')[1] : 0;
        var milestoneNum = currentPhase.split('.')[0] ? currentPhase.split('.')[0] : 0;
        this.status = Number(status);
        this.milestoneNum = Number(milestoneNum);
        this.experimentMode = data.taskMode ? data.taskMode : 1;
        this.therapist = data.treater ? data.treater : '';
        this.appraiser = data.assessor ? data.assessor : '';
        this.doctor = data.doctor ? data.doctor : '';
        this.experimentNumber = data.taskCode ? data.taskCode : '';

        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, (error) => {
        console.log(error);
      });
    }
  },
  mounted() {
    Bus.$on(this.UPDATE_EXPERIMENT_INFO, this.updateExperimentProgress);
    this.updateExperimentProgress();
  },
  beforeRouteEnter(to, from, next) {
    var subjectId = sessionStorage.getItem('subjectId');
    if (subjectId > 0) {
      next();
    } else {
      next(from.path);
    }
  },
  beforeDestroy() {
    Bus.$off(this.UPDATE_EXPERIMENT_INFO);
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
    .info-text {
      margin-left: 20px;
      .value {
        margin-left: 5px;
        margin-right: 10px;
      }
      .experiment-mode {
        color: @light-font-color;
      }
      .therapist, .appraiser {
        color: @button-color;
      }
      .experiment-number {
        color: @green-color;
      }
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
      &.complete-follow-up-button {
        right: 10px;
        width: 100px;
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
        line-height: 35px;
        &.title-row {
          background-color: @light-font-color;
          color: #fff;
        }
        .col {
          padding: 0 3px;
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
            position: relative;
            width: 30%;
            padding-right: 15px;
            .iconfont {
              position: absolute;
              top: 1px;
              right: 3px;
              font-size: @normal-font-size;
              // font-weight: bold;
              cursor: pointer;
              &:hover {
                opacity: 0.6;
              }
              &:active {
                opacity: 0.8;
              }
            }
          }
          &.waiting {
            color: @light-font-color;
          }
          &.ongoing {
            color: @green-color;
          }
          &.finished {
            color: @font-color;
          }
          &.rejected {
            color: @alert-color;
          }
        }
      }
    }
  }
}
</style>
