<template lang="html">
  <div class="experiment-step-modal-wrapper">
    <div class="experiment-step-modal"
      :class="{'follow-up-modal': milestoneNum===EXPERIMENT_STEP_FOLLOW_UP}" >
      <h3 class="title">{{title}}</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            实验阶段
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(milestoneNum, 'taskStatus')}}</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text">{{warningResults.name}}</span> -->
            <el-input v-model="milestoneNum" placeholder="请输入实验阶段" :maxlength="50"></el-input>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType===2">
          <span class="field-name">
            开始时间
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{startDate}}
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              type="datetime"
              v-model="startDate"
              placeholder="请选择下次随访时间" clearable>
            </el-date-picker>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType===2">
          <span class="field-name">
            距上次随访天数
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{lastTime}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="lastTime"
              :maxlength="500"
              placeholder="请输入距上次随访天数">
            </el-input>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType===2">
          <span class="field-name">
            是否超窗
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{transform(exceedTime, 'exceedTime')}}
          </span>
          <span class="field-input" v-else>
            <el-radio class="radio" v-model="exceedTime" :label="1">是</el-radio>
            <el-radio class="radio" v-model="exceedTime" :label="0">否</el-radio>
          </span>
        </div>

        <div class="field whole-line" v-if="hospitalType===2 && exceedTime===1">
          <span class="field-name">
            超窗原因
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
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="remark" placeholder="请输入处理意见" :maxlength="50"></el-input>
          </span>
        </div>

        <hr class="seperate-line" v-if="hospitalType===1 && milestoneNum===EXPERIMENT_STEP_FOLLOW_UP">

        <div v-if="hospitalType===1 && milestoneNum===EXPERIMENT_STEP_FOLLOW_UP">
          <h4 class="sub-title">本期随访总结</h4>

          <div class="field whole-line">
            <span class="field-name long-field-name">
              是否发生不良事件
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              {{transform(tcPatientAdverseOccurance, 'patientAdverseOccurance')}}
            </span>
            <span class="field-input" v-else>
              <el-select v-model="tcPatientAdverseOccurance" clearable placeholder="请选择">
                <el-option
                  v-for="item in getOptions('patientAdverseOccurance')"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field whole-line">
            <span class="field-name long-field-name">
              随访形式
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpType, 'followUpType')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <el-input v-model="followUpType" placeholder="请输入随访形式" :maxlength="50"></el-input>
            </span>
          </div>

          <div class="field whole-line">
            <span class="field-name long-field-name">
              受访者是否正常完成随访
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpComplete, 'followUpComplete')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-select v-model="followUpComplete" placeholder="请选择是否正常完成随访" clearable>
                <el-option :label="'是'" :value="1"></el-option>
                <el-option :label="'否'" :value="0"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field whole-line" v-if="followUpComplete===0">
            <span class="field-name long-field-name">
              未能正常完成随访原因
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpReason, 'followUpReason')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-input v-model="followUpReason" placeholder="请输入未能正常完成随访原因" :maxlength="50"></el-input>
            </span>
          </div>

          <div class="field whole-line" v-if="followUpReason===6">
            <span class="field-name long-field-name">
              原因详述
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{reasonDetail}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-input v-model="reasonDetail" placeholder="请输入原因详述" :maxlength="50"></el-input>
            </span>
          </div>

          <div class="field whole-line">
            <span class="field-name long-field-name">
              受访者是否愿意继续随访
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpContinue, 'followUpContinue')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-select v-model="followUpContinue" placeholder="请选择是否愿意继续随访" clearable>
                <el-option :label="'是'" :value="1"></el-option>
                <el-option :label="'否'" :value="0"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field whole-line" v-if="nextTime">
            <span class="field-name long-field-name">
              下次随访时间点
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{nextTime}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-date-picker v-model="nextTime" placeholder="请输入下次随访时间"></el-date-picker>
            </span>
          </div>
        </div>
        <!-- dd -->
        <table class="table"
          v-if="milestoneNum===EXPERIMENT_STEP_SCREENING &&
          (milestoneStatus===EXPERIMENT_STEP_SCREENING || milestoneStatus===EXPERIMENT_STEP_THERAPY)">
          <thead>
            <tr class="row title-row">
              <th class="col wide-col">入选标准</th>
              <th class="col">是</th>
              <th class="col">否</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row" v-for="(item,index) in beChosenStandard" :key="'standard'+index">
              <td class="col">{{item.detailName}}</td>
              <td class="col">
                <span v-if="standardDetailOptions[index] && standardDetailOptions[index].optionId===1">✔</span>
                <!-- <el-radio class="radio" disabled v-model="standardDetailOptions[index].optionId" :label="1"></el-radio> -->
              </td>
              <td class="col">
                <span v-if="standardDetailOptions[index] && standardDetailOptions[index].optionId===0">✔</span>
                <!-- <el-radio class="radio" disabled v-model="standardDetailOptions[index].optionId" :label='0'></el-radio> -->
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table" v-if="milestoneNum===EXPERIMENT_STEP_SCREENING && false">
          <thead>
            <tr class="row title-row">
              <th class="col wide-col">排除标准</th>
              <th class="col">是</th>
              <th class="col">否</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row" v-for="(item,index) in excludeStandard" :key="'standard'+index">
              <td class="col">{{item.detailName}}</td>
              <td class="col">
                <span v-if="standardDetailOptions[beChosenStandard.length+index]&&standardDetailOptions[beChosenStandard.length+index].optionId===1">✔</span>
                <!-- <el-radio class="radio" disabled v-model="standardDetailOptions[beChosenStandard.length+index].optionId" :label="1"></el-radio> -->
              </td>
              <td class="col">
                <span v-if="standardDetailOptions[beChosenStandard.length+index]&&standardDetailOptions[beChosenStandard.length+index].optionId===0">✔</span>
                <!-- <el-radio class="radio" disabled v-model="standardDetailOptions[beChosenStandard.length+index].optionId" :label='0'></el-radio> -->
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      </div>
      <div class="modal-footer">
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button">编辑</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      title: '处理意见',
      mode: '',
      milestoneNum: '',
      milestoneStatus: '',
      startDate: '',
      lastTime: '',
      exceedTime: '',
      exceedReason: '',
      remark: '',
      tcPatientAdverseOccurance: '',
      followUpType: '',
      followUpComplete: '',
      followUpReason: '',
      reasonDetail: '',
      followUpContinue: '',
      nextTime: '',

      standardDetailOptions: [],
      beChosenStandard: [],
      excludeStandard: []
    };
  },
  computed: {
    ...mapGetters([
      'standardInfo',
      'typeGroup'
    ]),
    hospitalType() {
      return this.$store.state.hospitalType;
    }
  },
  methods: {
    updateTemplate() {
      this.beChosenStandard = this.standardInfo.filter((item) => {
        return item.standardId === 1;
      });
      this.excludeStandard = this.standardInfo.filter((item) => {
        return item.standardId === 2;
      });
      this.updateScrollbar();
    },
    showModal(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      // console.log(item);
      this.milestoneNum = this.getMilestoneNum(item);
      this.milestoneStatus = this.getStatus(item);

      this.startDate = item.startDate !== undefined ? item.startDate : '';
      this.lastTime = item.lastTime !== undefined ? item.lastTime : '';
      this.exceedTime = item.exceedTime !== undefined ? item.exceedTime : '';
      this.exceedReason = item.exceedReason !== undefined ? item.exceedReason : '';
      this.remark = item.remark !== undefined ? item.remark : '';

      var propertyList = ['tcPatientAdverseOccurance', 'followUpType', 'followUpComplete', 'followUpReason',
        'reasonDetail', 'followUpContinue', 'nextTime'];
      for (let property of propertyList) {
        this[property] = item.followUpModel && item.followUpModel[property] !== undefined
          ? item.followUpModel[property] : '';
      }

      this.updateTemplate();
      this.standardDetailOptions = item.patientStandards ? item.patientStandards : [];
      this.updateScrollbar();
    },
    cancel() {
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    getMilestoneNum(step) {
      var milestoneNum = 0;
      var phase = step.phase;
      if (phase && phase.split('.').length > 0) {
        milestoneNum = Number(phase.split('.')[0]);
      }
      return milestoneNum;
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
    transform(code, fieldName) {
      if (fieldName === 'taskStatus') {
        // 特殊处理
        if (code === this.EXPERIMENT_STEP_FILTERING) {
          if (this.hospitalType === 1) {
            return '入组诊断';
          } else if (this.hospitalType === 2) {
            return '筛选入组';
          }
        } else if (code === this.EXPERIMENT_STEP_SCREENING) {
          return '基线评估';
        } else if (code === this.EXPERIMENT_STEP_THERAPY) {
          return '治疗期';
        } else if (code === this.EXPERIMENT_STEP_FOLLOW_UP) {
          return '随访期';
        } else if (code === this.EXPERIMENT_STEP_COMPLETE) {
          return '治疗期';
        }
      }
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      if (fieldName === 'exceedTime') {
        options = [
          {
            name: '是',
            code: 1
          },
          {
            name: '否',
            code: 0
          }
        ];
      }
      return options;
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_EXPERIMENT_STEP_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_EXPERIMENT_STEP_MODAL);
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
@long-field-name-width: 170px;

.experiment-step-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .experiment-step-modal {
    position: relative;
    margin: auto;
    top: 10%;
    width: 500px;
    max-height: 80%;
    background-color: @background-color;
    overflow: hidden;
    &.follow-up-modal {
      top: 3%;
      max-height: 94%;
    }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .large-icon {
      font-size: @large-font-size;
    }
    .modal-body {
      position: relative;
      max-height: 80%;
      overflow-y: auto;
      padding: 0 30px;
      overflow-x: hidden;
    }

    .modal-footer {
      position: relative;
      bottom: 0px;
    }
    .content{
      text-align: left;
      font-size: 0;
      .seperate-line {
        border-style: none;
        border-top: 1px solid @light-gray-color;
        margin-top: 5px;
        margin-bottom: 15px;
      }
      .sub-title{
        font-size: @normal-font-size;
        transform: translate3d(10px, 5px, 0);
      }
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
            width: calc(~"96% - @{field-name-width}");
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @font-color;
          &.long-field-name {
            width: @long-field-name-width;
          }
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"96% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
            width: calc(~"96% - @{long-field-name-width}");
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
      .table {
        margin: 10px 0 20px;
        width: 92%;
        margin-left: calc(~"@{field-line-height} + 10px");
        border: 1px solid @light-gray-color;
        border-collapse: collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          th {
            font-weight: normal;
          }
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            &.wide-col {
              width: 80%;
              text-align: center !important;
            }
            &:first-child {
              text-align: left;
              padding-left:10px;
            }
            .el-radio__label {
              font-size: 0;
              padding-left: 0;
            }
          }
        }
      }
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
