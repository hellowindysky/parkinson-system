<template lang="html">
  <div class="treatment-evaluation-modal-wrapper">
    <div class="treatment-evaluation-modal">
      <h3 class="title">{{title}}</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            记录时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{recordDate}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.recordDate}}</span>
            <el-date-picker
              v-model="recordDate"
              :class="{'warning': warningResults.recordDate}"
              type="date"
              placeholder="请选择记录时间"
              :picker-options="pickerOptions"
              @change="updateWarning('recordDate')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            治疗后情况:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{ transform(situationType,'situationType')}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.situationType}}</span>
            <el-select v-model="situationType" clearable placeholder="请选择" @change="updateWarning('situationType')"
              :class="{'warning': warningResults.situationType}">
              <el-option
                v-for="item in getOptions('situationType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            实验编号:
          </span>
          <span class="field-input">
            {{patientTaskCode}}
          </span>
        </div>
        <div class="field whole-line" v-show="situationType===1">
          <span class="field-name">
            左侧/右侧阈值:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{leftThreshold}}</span>
            <span class="narrow-middle"> / </span>
            <span>{{rightThreshold}}</span>
          </span>
          <span class="field-input zero-font-size" v-else>
            <span class="warning-text left">{{warningResults.leftThreshold}}</span>
            <span class="warning-text right">{{warningResults.rightThreshold}}</span>
            <el-input class="left" v-model="leftThreshold" placeholder="请输入左侧运动阈值" :class="{'warning': warningResults.leftThreshold}" @change="updateWarning('leftThreshold')" ></el-input>
            <span class="middle">/</span>
            <el-input class="right" v-model="rightThreshold" placeholder="请输入右侧运动阈值" :class="{'warning': warningResults.rightThreshold}" @change="updateWarning('rightThreshold')" ></el-input>
          </span>
        </div>
        <div class="field whole-line" v-show="situationType===2">
          <span class="field-name">
          治疗后情况描述:
          <span class="required-mark mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          <span>{{situationRemark}}</span>
          </span>
          <span class="field-input" v-else>
          <span class="warning-text text">{{warningResults.situationRemark}}</span>
          <el-input v-model="situationRemark" placeholder="请输入治疗后情况描述" :class="{'warning': warningResults.situationRemark}" type="textarea" @change="updateWarning('situationRemark')" :maxlength="500"></el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备注:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入备注">
            </el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="moveLeft">
             无不良反应:
         <el-checkbox v-model="hasNoReaction" @change="checkAll"
          :disabled="mode===VIEW_CURRENT_CARD"></el-checkbox>
      </div>
      <div class="content">
      <table class="table">
        <tr class="row title-row">
          <td class="col narrow-col">序号</td>
          <td class="col wide-col">不良反应程度评估</td>
          <td class="col">严重程度</td>
        </tr>
        <tr class="row" v-for="(reaction, index) in patientPhytheReaction">
          <td class="col narrow-col" v-show="index <=2">{{index + 1}}</td>
          <td class="col wide-col" v-show="index <=2">
            {{transform(reaction.reactionType, 'reactionType')}}
          </td>
          <td class="col narrow-col" v-show="index <=2">
            <span v-if="mode===VIEW_CURRENT_CARD">{{transform(reaction.severityLevel,'haveType')}}</span>
            <el-select v-else v-model="reaction.severityLevel" clearable :disabled="hasNoReaction">
              <el-option
                v-for="item in getOptions('haveType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </td>
          <td class="col narrow-col" v-show="index >=3">{{index + 1}}</td>
            <td class="col wide-col" v-show="index >=3">
              {{transform(reaction.reactionType, 'reactionType')}}
            </td>
            <td class="col narrow-col" v-show="index >=3">
              <span v-if="mode===VIEW_CURRENT_CARD">{{transform(reaction.severityLevel,'reactionLevel')}}</span>
              <el-select v-else v-model="reaction.severityLevel" clearable :disabled="hasNoReaction">
                <el-option
                  v-for="item in getOptions('reactionLevel')"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </td>
        </tr>
      </table>
      </div>
      <p>0，无该症状；轻度 1-3；中度 4-7；重度 8-10；数值越大越严重</p>
      <div class="seperate-line"></div>
      </div>
      <div class="modal-footer">
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-show="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy, reviseDateFormat, pruneObj } from 'utils/helper.js';
import { getPatientSimpleInfo, addTreatmentEvaluation, modifyTreatmentEvaluation } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      checked: true,
      patientTaskCode: '',

      patientPhytheAssessId: '',
      patientPhytheAssess: '',
      situationType: '',
      recordDate: '',
      leftThreshold: '',
      rightThreshold: '',
      situationRemark: '',
      severityLevel: '',
      remark: '',
      reactionFlag: '',
      hasNoReaction: false,
      patientPhytheReaction: [
        {
          'reactionType': 1,
          'severityLevel': ''
        },
        {
          'reactionType': 2,
          'severityLevel': ''
        },
        {
          'reactionType': 3,
          'severityLevel': ''
        },
        {
          'reactionType': 4,
          'severityLevel': ''
        },
        {
          'reactionType': 5,
          'severityLevel': ''
        },
        {
          'reactionType': 6,
          'severityLevel': ''
        },
        {
          'reactionType': 7,
          'severityLevel': ''
        },
        {
          'reactionType': 8,
          'severityLevel': ''
        },
        {
          'reactionType': 9,
          'severityLevel': ''
        },
        {
          'reactionType': 10,
          'severityLevel': ''
        },
        {
          'reactionType': 11,
          'severityLevel': ''
        },
        {
          'reactionType': 12,
          'severityLevel': ''
        },
        {
          'reactionType': 13,
          'severityLevel': ''
        }
      ],
      warningResults: {
        situationType: '',
        recordDate: '',
        leftThreshold: '',
        rightThreshold: '',
        situationRemark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      showEdit: false
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'treatmentTime'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增治疗评估';
      } else {
        return '治疗评估';
      }
    },
    fieldListToCheck() {
      var list = ['recordDate', 'situationType'];
      if (this.situationType === 1) {
        list = list.concat(['leftThreshold', 'rightThreshold']);
      } else if (this.situationType === 2) {
        list = list.concat(['situationRemark']);
      }
      return list;
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      for (let reaction of this.patientPhytheReaction) {
        reaction.severityLevel = '';
      }
      // 获取患者的 实验编号
      this.patientTaskCode = '';
      getPatientSimpleInfo(this.$route.params.id).then((data) => {
        if (data.patientInfo && data.patientInfo.patientTaskCode) {
          this.patientTaskCode = data.patientInfo.patientTaskCode;
        }
      }, (error) => {
        console.log(error);
      });
      // console.log('item: ', item);
      this.patientPhytheAssessId = item.patientPhytheAssessId ? item. patientPhytheAssessId : '';
      this.recordDate = item.recordDate ? item.recordDate : '';
      this.situationType = item.situationType ? item.situationType : '';
      this.leftThreshold = item.leftThreshold ? item.leftThreshold : '';
      this.rightThreshold = item.rightThreshold ? item.rightThreshold : '';
      this.situationRemark = item.situationRemark ? item.situationRemark : '';
      this.patientId = item.patientId ? item.patientId : '';
      this.remark = item.remark ? item.remark : '';
      this.hasNoReaction = item.reactionFlag === 1;
      vueCopy(item.patientPhytheReaction, this.patientPhytheReaction);
      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.updateScrollbar();

      // 同步就诊时间
      if (cardOperation === this.ADD_NEW_CARD) {
        this.$set(this, 'recordDate', this.treatmentTime);
      }
    },
    transform(code, fieldName) {
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    checkAll() {
      for (var i = 0; i < this.patientPhytheReaction.length ; i++) {
        if (this.hasNoReaction === true) {
          this.patientPhytheReaction[i].severityLevel = 1;
        } else {
          this.patientPhytheReaction[i].severityLevel = '';
        }
      };
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
      return options;
    },
    updateWarning(fieldName) {
      var list = ['recordDate', 'situationType', 'leftThreshold', 'rightThreshold', 'situationRemark'];
      if (list.indexOf(fieldName) >= 0 && !this[fieldName]) {
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
      this.updateScrollbar();
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      for (let property in this.warningResults) {
        if (this.fieldListToCheck.indexOf(property) >= 0 && this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.fieldListToCheck.indexOf(property) >= 0 && this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }
      var treatmentEvaluationInfo = {};
      treatmentEvaluationInfo.patientCaseId = this.$route.params.caseId;
      treatmentEvaluationInfo.situationType = this.situationType;
      treatmentEvaluationInfo.recordDate = this.recordDate;
      treatmentEvaluationInfo.leftThreshold = this.leftThreshold;
      treatmentEvaluationInfo.rightThreshold = this.rightThreshold;
      treatmentEvaluationInfo.situationRemark = this.situationRemark;
      treatmentEvaluationInfo.remark = this.remark;
      treatmentEvaluationInfo.patientId = this.$route.params.id;
      treatmentEvaluationInfo.reactionFlag = this.hasNoReaction ? 1 : 0;
      treatmentEvaluationInfo.patientPhytheReaction = deepCopy(this.patientPhytheReaction);
      reviseDateFormat(treatmentEvaluationInfo);
      pruneObj(treatmentEvaluationInfo);

      if (this.mode === this.ADD_NEW_CARD) {
        addTreatmentEvaluation(treatmentEvaluationInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        treatmentEvaluationInfo.patientPhytheAssessId = this.patientPhytheAssessId;
        modifyTreatmentEvaluation(treatmentEvaluationInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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
    Bus.$on(this.SHOW_TREATMENT_EVALUATION_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_TREATMENT_EVALUATION_MODAL);
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
@field-name-width: 125px;

.treatment-evaluation-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .treatment-evaluation-modal {
    position: relative;
    margin: 10px auto;
    top: 3%;
    width: 600px;
    height: 90%;
    background-color: @background-color;
    overflow: hidden;
    .moveLeft {
      text-align: left;
      margin-top: 10px;
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
      transform: translate3d(10px, 5px, 0);
      // overflow: hidden;
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
        width: calc(~"92% - @{field-name-width}");
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        &.zero-font-size {
          font-size: 0;
        }
        .left {
          display: inline-block;
          position: relative;
          width: 40%;
          font-size: @normal-font-size;
        }
        .middle {
          display: inline-block;
          position: relative;
          width: 20%;
          text-align: center;
          font-size: @normal-font-size;
        }
        .right {
          display: inline-block;
          position: relative;
          width: 40%;
          font-size: @normal-font-size;
        }
        .narrow-middle {
          display: inline-block;
          width: 30px;
          text-align: center;
        }
        .warning-text {
          position: absolute;
          top: 22px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
          &.right {
            left: calc(~"60% + 10px");
          }
        }
        .text {
           position: absolute;
           top: 46px;
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
          margin-bottom: 15px;
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
        .warning .el-input__inner, .warning .el-textarea__inner {
          border: 1px solid red;
        }
      }
    }
    .table {
      margin: 10px 0 20px;
      width: 100%;
      border: 1px solid @light-gray-color;
      border-collapse: collapse;
      text-align: center;
      .row {
        height: 35px;
        font-size: @normal-font-size;
        &.title-row {
          background-color: @font-color;
          color: #fff;
        }
        .col {
          position: relative;
          width: 10%;
          border: 1px solid @light-gray-color;
          .required-mark {
            position: absolute;
            right: 5px;
            top: 8px;
            color: red;
            font-size: 25px;
            vertical-align: middle;
          }
          &.title-col {
            background-color: @font-color;
            color: #fff;
          }
          &.wide-col {
            width: 30%;
          }
          &.narrow-col {
            width: 5%;
          }
          .iconfont {
            position: absolute;
            left: 5px;
            top: 9px;
            cursor: pointer;
            z-index: 20;
            &.icon-remove {
              color: @alert-color;
            }
            &:hover {
              opacity: 0.6;
            }
            &:active {
              opacity: 0.8;
            }
          }
          .el-input {
            width: 100%;
            &.warning {
              margin: -1px;
              border: 1px solid red;
            }
            .el-input__inner {
              padding: 0;
              border: none;
              text-align: center;
            }
            .el-input__icon {
              &.el-icon-date {
                width: 12px;
                height: 12px;
                padding: 0 0 18px 10px;
                opacity: 0.3;
              }
              &.el-icon-close {
                width: 12px;
                height: 12px;
                padding: 0 0 18px 10px;
                color: @alert-color;
              }
            }
            &.is-disabled {
              .el-input__inner {
                background-color: rgba(0,0,0,0);
                color: @font-color;
              }
              .el-input__icon {
                display: none;
              }
            }
          }
          .el-select {
            &.warning {
              .el-input {
                margin: -1px;
                border: 1px solid red;
              }
            }
          }
        }
      }
    }
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
      &.submit-button, &.edit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.btn-margin {
        margin-top: 10px;
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: -2px;
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
