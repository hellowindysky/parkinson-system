<template lang="html">
  <div class="treatmentEvaluation-modal-wrapper" v-show="displayModal">
   <div class="treatmentEvaluation-modal" ref="scrollArea">
        <h3 class="title">{{title}}</h3>
     <div class="content">
      <div class="field whole-line">
          <span class="field-name">
           记录时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{recordDate}}</span>
          </span>
          <span class="field-input dateLength" v-else>
            <span class="warning-text">{{warningResults.recordDate}}</span>
            <el-date-picker
              v-model="recordDate"
              class="dateLength"
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
             <span>{{ transformSituationType(situationType,'situationType')}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.situationType}}</span>
            <el-select class="dateWidth" v-model="situationType" placeholder="请选择" @change="updateWarning('situationType')"
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
      <div class="field move" v-show="situationType===1">
          <span class="field-name">
             <span class="required-mark">*</span>
          </span>
          <span class="field-input shifting" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{leftThreshold}}</span>
          </span>
          <span class="field-input shifting" v-else>
            <span class="warning-text goLeft">{{warningResults.leftThreshold}}</span>
            <el-input class="bias" v-model="leftThreshold" placeholder="请输入左侧运动阈值" :class="{'warning': warningResults.leftThreshold}" @change="updateWarning('leftThreshold')" ></el-input>
          </span>
        </div>

       <div class="field shift" v-show="situationType===1">
           <span class="field-name">
             <span class="sprit">/</span>
             <span class="required-mark">*</span>
           </span>
          <span class="field-input shifting" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{rightThreshold}}</span>
          </span>
          <span class="field-input shifting" v-else>
            <span class="warning-text goLeft">{{warningResults.rightThreshold}}</span>
            <el-input class="skewing" v-model="rightThreshold" placeholder="请输入右侧运动阈值" :class="{'warning': warningResults.rightThreshold}" @change="updateWarning('rightThreshold')" ></el-input>
          </span>
       </div>
      <div class="field" v-show="situationType===2">
          <span class="field-name">
              <span class="required-mark mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>  
            <span>{{situationRemark}}</span>
          </span>
          <span class="field-input" v-else>
             <span class="warning-text">{{warningResults.situationRemark}}</span>
            <el-input class="excursion" v-model="situationRemark" placeholder="请输入治疗后情况描述" :class="{'warning': warningResults.situationRemark}" @change="updateWarning('situationRemark')" ></el-input>
          </span>
      </div>
      </div> 
      <div class="seperate-line"></div>
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-show="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import { addTreatmentEvaluation, modifyTreatmentEvaluation } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,

      patientPhytheAssessId: '',
      patientPhytheAssess: '',
      situationType: '',
      recordDate: '',
      leftThreshold: '',
      rightThreshold: '',
      situationRemark: '',
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
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增治疗评估';
      } else {
        return '治疗评估';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      // console.log('item: ', item);
      this.patientPhytheAssessId = item.patientPhytheAssessId ? item. patientPhytheAssessId : '';
      this.recordDate = item.recordDate ? item.recordDate : '';
      this.situationType = item.situationType ? item.situationType : '';
      this.leftThreshold = item.leftThreshold ? item.leftThreshold : '';
      this.rightThreshold = item.rightThreshold ? item.rightThreshold : '';
      this.situationRemark = item.situationRemark ? item.situationRemark : '';
      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
      this.updateScrollbar();
    },
    transformSituationType(code, fieldName) {
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
      return options;
    },
    updateWarning(fieldName) {
      if (this.completeInit && !this[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
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
        if (this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
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
      this.displayModal = false;
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
    Bus.$on(this.SHOW_TREATMENTEVALUATION_MODAL, this.showPanel);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_TREATMENTEVALUATION_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 150px;
@long-field-name-width: 160px;

@col-id-width: 100px;
@col-time-width: 200px;
@col-amount-width: 150px;
@col-unit-width: 150px;

.treatmentEvaluation-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .treatmentEvaluation-modal {
    position: relative;
    margin: auto;
    top: 3%;
    width: 800px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      padding: 0 40px;
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
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .move {
          left: 100px;
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"90% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .goLeft {
            left: -130px;
            top: 27px;
          }
          .el-input {
            transform: translateY(-3px);
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-select {
            width: 100%;
          }
          .warning .el-input__inner {
            border: 1px solid red;
          }
        }
        }
        // .shifting {
        //     transform: translateX(-100px);
        // }
          .move {
            transform: translateX(-10px);
          }
         .shift {
            transform: translate(520px, -44px);
         }
         .sprit {
            position: relative;
            top: 5px;
         }
         .skewing {
            left: -133px;
            top: 5px;
         }
         .bias {
           width: 150px;
           left: -140px;
           top: 5px;
         }
         .excursion {
           width: 350px;
           left: -160px;
         }
         .mark {
           position: relative;
           left:-20px;
         }
       }
     .seperate-line {
        position: relative;
        width: 650px;
        margin: auto;
        border-style: none;
        border-top: 1px solid @light-gray-color;
      }
      .dateLength {
        width: 100%;
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
      &.btn-margin {
        margin-top: 10px;
      }
    }
    &:hover {
        &:hover {
          padding: 0;
        }
      }
    }
  }
  
</style>
