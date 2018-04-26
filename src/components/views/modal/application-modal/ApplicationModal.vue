<template lang="html">
  <div class="application-modal-wrapper">
    <div class="application-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <!-- <div class="field whole-line">
          <span class="field-name">
            实验组
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{transform(experimentalGroup,'taskGroupType')}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.experimentalGroup}}</span>
            <el-select v-model="experimentalGroup" clearable placeholder="请选择希望把患者加入的实验组"
              @change="updateWarning('experimentalGroup')" :class="{'warning': warningResults.experimentalGroup}">
              <el-option v-for="item in getOptions('taskGroupType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div> -->
        <div class="field whole-line">
          <span class="field-name">
            下一阶段
          </span>
          <span class="field-input">
            基线评估
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            实验编号
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{experimentCode}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.experimentCode}}</span>
            <el-input v-model="experimentCode" clearable placeholder="请输入实验编号" @change="updateWarning('experimentCode')"
              :class="{'warning': warningResults.experimentCode}">
            </el-input>
          </span>
        </div>
        <div class="field whole-line" v-if="hospitalType === 1">
          <span class="field-name">
            治疗者
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{transform(therapist,'therapist')}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.therapist}}</span>
            <el-select v-model="therapist" clearable placeholder="请选择本次实验的治疗者" @change="updateWarning('therapist')"
              :class="{'warning': warningResults.therapist}">
              <el-option v-for="item in getOptions('therapist')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-if="hospitalType === 1">
          <span class="field-name">
            评估者
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{transform(appraiser,'appraiser')}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.appraiser}}</span>
            <el-select v-model="appraiser" clearable placeholder="请选择本次实验的评估者"
              @change="updateWarning('appraiser')"
              :class="{'warning': warningResults.appraiser}">
              <el-option v-for="item in getOptions('appraiser')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType === 2">
          <span class="field-name">
            开始时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{startDate}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.startDate}}</span>
            <el-date-picker
              type="datetime"
              v-model="startDate"
              :class="{'warning': warningResults.startDate}"
              @change="updateStartDate"
              placeholder="请选择下次随访时间" clearable>
            </el-date-picker>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType === 2">
          <span class="field-name long-field-name">
            距上次随访天数:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            {{lastTime}}
          </span>
          <span class="field-input long-field-name" v-else>
            <span class="warning-text">{{warningResults.lastTime}}</span>
            <el-input
              v-model="lastTime"
              :class="{'warning': warningResults.lastTime}"
              :maxlength="500"
              @change="updateWarning('lastTime')"
              placeholder="请输入距上次随访天数">
            </el-input>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType === 2">
          <span class="field-name">
            是否超窗:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{exceedTime}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.exceedTime}}</span>
            <el-radio class="radio" v-model="exceedTime" :label="1"
              @change.native="updateWarning('exceedTime')">是</el-radio>
            <el-radio class="radio" v-model="exceedTime" :label="0"
              @change.native="updateWarning('exceedTime')">否</el-radio>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType === 2 && exceedTime===1">
          <span class="field-name">
            超窗原因:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{exceedReason}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="exceedReason"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入超窗原因">
            </el-input>
            <!-- <span class="warning-text textarea-warning">{{warningResults.exceedReason}}</span> -->
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入处理意见">
            </el-input>
          </span>
        </div>
        <div class="check-field" v-if="hospitalType === 1">
          <el-checkbox v-model="hasCheckedBox" :disabled="mode===VIEW_CURRENT_CARD"></el-checkbox>
          确认患者已经签署《知情同意书》
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
// import { deepCopy, pruneObj } from 'utils/helper.js';
import { queryExperimentMember, joinExperiment, queryExperimentProgress } from 'api/experiment.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,

      experimentalGroup: '',
      experimentCode: '',
      therapist: '',
      appraiser: '',
      hasCheckedBox: false,

      startDate: '',
      lastTime: '',
      exceedTime: '',
      exceedReason: '',
      remark: '',

      therapistsList: [],
      appraisersList: [],
      warningResults: {
        // experimentalGroup: '',
        experimentCode: '',
        therapist: '',
        appraiser: '',
        startDate: '',
        lastTime: '',
        exceedTime: ''
      },

      lastStepStartDate: '',

      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      if (this.hospitalType === 1) {
        return '入选实验';
      } else if (this.hospitalType === 2) {
        return '申请加入课题组';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    },
    hospitalType() {
      return this.$store.state.hospitalType;
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      // console.log('item: ', item);

      this.experimentalGroup = '';
      this.therapist = '';
      this.appraiser = '';
      this.lastTime = '';
      this.exceedTime = '';
      this.exceedReason = '';
      this.remark = '';
      this.hasCheckedBox = false;

      this.lastStepStartDate = '';

      // 读取实验流程中，最后一步操作的开始日期，用来计算距离上次随访的天数
      this.updateExperimentLastStepStartTime();

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.updateMemberList();

      this.completeInit = true;
      // this.updateScrollbar();
    },
    transform(code, fieldName) {
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    getOptions(fieldName) {
      var options = [];
      if (fieldName === 'therapist') {
        for (let member of this.therapistsList) {
          options.push({
            name: member.name,
            code: member.id
          });
        }
      } else if (fieldName === 'appraiser') {
        for (let member of this.appraisersList) {
          options.push({
            name: member.name,
            code: member.id
          });
        }
      } else {
        var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
        var types = typeInfo.types ? typeInfo.types : [];
        for (let type of types) {
          options.push({
            name: type.typeName,
            code: type.typeCode
          });
        };
      }
      return options;
    },
    updateMemberList() {
      queryExperimentMember(this.$store.state.subjectId).then((data) => {
        this.therapistsList = data.treater ? data.treater : [];
        this.appraisersList = data.assessor ? data.assessor : [];
      }, (error) => {
        console.log(error);
      });
    },
    updateExperimentLastStepStartTime() {
      var experimentInfo = {
        'patientExperimentModel': {
          'patientId': this.$route.params.id,
          'tcTaskId': this.$store.state.subjectId
        }
      };
      queryExperimentProgress(experimentInfo).then((data) => {
        if (data && data.patientExperiment && data.patientExperiment.length > 0) {
          let progressList = data.patientExperiment;
          this.lastStepStartDate = progressList[progressList.length - 1].startDate;
        } else {
          this.lastStepStartDate = '';
        }
      }, (error) => {
        console.log(error);
      });
    },
    updateStartDate() {
      // 填写了开始时间之后，需要动态计算距离上次随访天数
      if (this.startDate === '' || this.lastStepStartDate === '') {
        this.updateWarning('startDate');
        return;
      }
      let currentStepStartDate = new Date(this.startDate).getTime();
      let lastStepStartDate = new Date(this.lastStepStartDate).getTime();
      let dayTime = 1000 * 60 * 60 * 24;
      let days = Math.floor((currentStepStartDate - lastStepStartDate) / dayTime);
      this.lastTime = days >= 0 ? days : 0;

      this.updateWarning('startDate');
      this.updateWarning('lastTime');
    },
    updateWarning(fieldName) {
      if (this[fieldName] === '') {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      // this.updateScrollbar();
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          if (this.hospitalType === 1 &&
            ['experimentCode', 'therapist', 'appraiser'].indexOf(property) >= 0) {
            this.updateWarning(property);
          } else if (this.hospitalType === 2 &&
            ['experimentCode', 'startDate', 'lastTime', 'exceedTime'].indexOf(property) >= 0) {
            this.updateWarning(property);
          }
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          if (this.hospitalType === 1 &&
            ['experimentCode', 'therapist', 'appraiser'].indexOf(property) >= 0) {
            this.lockSubmitButton = false;
            return;
          } else if (this.hospitalType === 2 &&
            ['experimentCode', 'startDate', 'lastTime', 'exceedTime'].indexOf(property) >= 0) {
            this.lockSubmitButton = false;
            return;
          }
        }
      }
      if (this.hospitalType === 1 && !this.hasCheckedBox) {
        this.$message({
          message: '确认患者已经签署《知情同意书》',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      }
      var experimentInfo = {
        'patientId': this.$route.params.id,
        'tcTaskId': this.$store.state.subjectId,
        'taskCode': this.experimentCode
      };
      if (this.hospitalType === 1) {
        experimentInfo.treaterId = this.therapist;
        experimentInfo.assessorId = this.appraiser;
        experimentInfo.remark = this.remark;

      } else if (this.hospitalType === 2) {
        experimentInfo.lastTime = this.lastTime;
        experimentInfo.exceedTime = this.exceedTime;
        experimentInfo.exceedReason = this.exceedReason;
        experimentInfo.remark = this.remark;
      }
      joinExperiment(experimentInfo).then(this.updateAndClose, this._handleError);
    },
    _handleError(error) {
      console.log(error);
      if (error.code === 10) {
        this.$message({
          message: '该患者已在其它课题的实验中，待其完成后才能重新入组',
          type: 'error',
          duration: 2000
        });
      } else if (error.code === 2009) {
        this.$message({
          message: '当前操作无法完成，请刷新页面后再试',
          type: 'error',
          duration: 2000
        });
      }
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.$message({
        message: '已将该患者加入实验组',
        type: 'success',
        duration: 2000
      });
      Bus.$emit(this.UPDATE_EXPERIMENT_INFO);
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    updateScrollbar() {
      // this.$nextTick(() => {
      //   Ps.destroy(this.$refs.scrollArea);
      //   Ps.initialize(this.$refs.scrollArea, {
      //     wheelSpeed: 1,
      //     minScrollbarLength: 40,
      //     suppressScrollX: true
      //   });
      // });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_APPLICATION_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    // this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_APPLICATION_MODAL);
  },
  watch: {
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 110px;

@long-field-name-width: 150px;

.application-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .application-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 500px;
    max-height: 80%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translate3d(10px, 5px, 0); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"94% - @{field-name-width}");
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: @field-line-height;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @font-color;
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
          &.long-field-name {
            width: @long-field-name-width;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
            width: calc(~"94% - @{long-field-name-width}");
          }
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .el-input {
            transform: translateY(-3px);
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-textarea {
            margin-bottom: 10px;
            vertical-align: middle;
            transform: translateY(-3px);
            .el-textarea__inner {
              border: none;
              background-color: @screen-color;
            }
          }
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
    }
    .check-field {
      margin-left: @field-name-width + 10px;
      height: 25px;
      line-height: 25px;
      text-align: left;
      font-size: @normal-font-size
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 10px 20px 20px 20px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &.cancel-button {
        background-color: @light-font-color;
      }
      &.submit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
      padding: 0 3px;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s, padding 0.2s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.6;
        &:hover {
          padding: 0;
        }
      }
    }
  }
}

</style>
