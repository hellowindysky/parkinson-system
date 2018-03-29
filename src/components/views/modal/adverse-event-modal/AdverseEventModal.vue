<template lang="html">
  <div class="adverse-event-modal-wrapper">
    <div class="adverse-event-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            不良事件名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{adverseName}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.adverseName}}</span>
            <el-input
              v-model="adverseName"
              :class="{'warning': warningResults.adverseName}"
              @change="updateWarning('adverseName')"
              placeholder="请输入不良事件名称">
            </el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            不良事件描述:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{adverseDescribe}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text event-text">{{warningResults.adverseDescribe}}</span>
            <el-input
              v-model="adverseDescribe"
              :class="{'warning': warningResults.adverseDescribe}"
              type="textarea"
              :rows="2"
              :maxlength="500"
              @change="updateWarning('adverseDescribe')"
              placeholder="请输入不良事件描述">
            </el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            发生时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{occurTime}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.occurTime}}</span>
            <el-date-picker
              v-model="occurTime"
              :class="{'warning': warningResults.occurTime}"
              type="datetime"
              placeholder="请选择发生时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
         <div class="field">
          <span class="field-name">
            结束时间:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{endTime}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              placeholder="请选择结束时间"
              :picker-options="pickerOptions"
              @change="updateWarning('endTime')">
            </el-date-picker>
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
        <div class="field">
          <span class="field-name">
           不良事件程度:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(severity,'adverseSeverity')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="severity" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('adverseSeverity')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           转&nbsp;&nbsp;&nbsp;&nbsp;归:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(outCome,'outCome')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="outCome" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('outCome')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-show="outCome === 5">
          <span class="field-name">
            表&nbsp;&nbsp;&nbsp;&nbsp;现:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{expression}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="expression"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入后遗症表现">
            </el-input>
          </span>
        </div>
        <div class="field whole-line" v-show="outCome === 6">
          <span class="field-name">
            直接死因:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{deathCause}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="deathCause"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入直接死因">
            </el-input>
          </span>
        </div>
        <div class="field" v-show="outCome === 6">
          <span class="field-name">
            死亡时间:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{deathDate}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="deathDate"
              type="date"
              placeholder="请选择死亡时间"
              :picker-options="pickerOptions"
              @change="updateWarning('deathDate')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           严重不良事件:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(seriousFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="seriousFlag" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('digitYN')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           与研究关联性评价:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(treatmentRelate,'treatmentRelate')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="treatmentRelate" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('treatmentRelate')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           纠正治疗:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(correctFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="correctFlag" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('digitYN')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-show="correctFlag === 1">
          <span class="field-name">
            治疗记录:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{treatRecord}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="treatRecord"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入纠正治疗记录">
            </el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           因此退出实验:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(exitTestFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="exitTestFlag" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('digitYN')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           是否揭盲:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(unblindFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="unblindFlag" clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('digitYN')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="unblindFlag === 1">
          <span class="field-name">
            揭盲日期:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{unblindDate}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="unblindDate"
              type="date"
              placeholder="请选择揭盲日期"
              :picker-options="pickerOptions"
              @change="updateWarning('unblindDate')">
            </el-date-picker>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
      <span class="button text1-button" v-if="mode!==VIEW_CURRENT_CARD && seriousFlag === 1" @click="submit">继续记录严重不良事件</span>
      <span class="button submit-button" v-if="mode!==VIEW_CURRENT_CARD && seriousFlag !== 1" @click="submit">确定</span>
      <!-- <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button">
        <span class="button text1-button" v-show="seriousFlag === 1" @click="seriousAgain">继续记录严重不良事件</span>
        <span class="button submit-button" v-show="seriousFlag === 2" @click="submit">确定</span>
      </div> -->
      <!-- <div v-if="mode!==VIEW_CURRENT_CARD" class="button text1-button">
        <span v-if="seriousFlag === 1">继续记录严重不良事件</span>
      </div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button">
        <span v-if="seriousFlag === 2" @click="submit">确定</span>
      </div> -->
      <!-- <div v-else="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div> -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { pruneObj } from 'utils/helper';
import { getPatientSimpleInfo, addAdverseEvent, modifyAdverseEvent } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      patientTaskCode: '',

      patientAdverse: '',
      patientAdverseId: '',
      occurTime: '',
      endTime: '',
      unblindDate: '',
      correctFlag: '',
      outCome: '',
      expression: '',
      treatRecord: '',
      exitTestFlag: '',
      unblindFlag: '',
      treatmentRelate: '',
      deathCause: '',
      deathDate: '',
      seriousFlag: '',

      adverseName: '',
      adverseDescribe: '',
      severity: '',
      warningResults: {
        occurTime: '',
        adverseName: '',
        adverseDescribe: ''
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
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增不良事件';
      } else {
        return '不良事件';
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
       // 获取患者的 实验编号
      this.patientTaskCode = '';
      getPatientSimpleInfo(this.$route.params.id).then((data) => {
        if (data.patientInfo && data.patientInfo.patientTaskCode) {
          this.patientTaskCode = data.patientInfo.patientTaskCode;
        }
      }, (error) => {
        console.log(error);
      });

      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
      this.patientAdverseId = item.patientAdverseId ? item.patientAdverseId : '';
      this.occurTime = item.occurTime ? item.occurTime : '';
      this.endTime = item.endTime ? item.endTime : '';
      this.unblindDate = item.unblindDate ? item.unblindDate : '';
      this.outCome = item.outCome ? item.outCome : '';
      this.expression = item.expression ? item.expression : '';
      this.correctFlag = item.correctFlag ;
      this.treatRecord = item.treatRecord ? item.treatRecord : '';
      this.exitTestFlag = item.exitTestFlag ;
      this.unblindFlag = item.unblindFlag ;
      this.treatmentRelate = item.treatmentRelate ? item.treatmentRelate : '';
      this.deathCause = item.deathCause ? item.deathCause : '';
      this.deathDate = item.deathDate ? item.deathDate : '';
      this.seriousFlag = item.seriousFlag ;
      this.adverseName = item.adverseName ? item.adverseName : '';
      this.adverseDescribe = item.adverseDescribe ? item.adverseDescribe : '';
      this.severity = item.severity ? item.severity : '';

      this.completeInit = true;
      this.updateScrollbar();
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field.fieldName).uiType;
    },
    getMatchedField(fieldName) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', fieldName, this.diseaseInfoDictionary);
    },
    transform(code, fieldName) {
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
      var list = ['occurTime', 'adverseName', 'adverseDescribe'];
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
    // seriousAgain() {
    //   Bus.$on(this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL, this.showPanel);
    //   Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    //   this.updateScrollbar();

    // },
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
      var adverseEventInfo = {};
      adverseEventInfo.patientId = this.$route.params.id;
      adverseEventInfo.patientCaseId = this.$route.params.caseId;
      adverseEventInfo.occurTime = this.occurTime;
      adverseEventInfo.endTime = this.endTime;
      adverseEventInfo.unblindDate = this.unblindDate;
      adverseEventInfo.outCome = this.outCome;
      adverseEventInfo.expression = this.expression;
      adverseEventInfo.correctFlag = this.correctFlag;
      adverseEventInfo.treatRecord = this.treatRecord;
      adverseEventInfo.exitTestFlag = this.exitTestFlag;
      adverseEventInfo.unblindFlag = this.unblindFlag;
      adverseEventInfo.treatmentRelate = this.treatmentRelate;
      adverseEventInfo.deathCause = this.deathCause;
      adverseEventInfo.deathDate = this.deathDate;
      adverseEventInfo.seriousFlag = this.seriousFlag;
      adverseEventInfo.adverseName = this.adverseName;
      adverseEventInfo.adverseDescribe = this.adverseDescribe;
      adverseEventInfo.severity = this.severity;

      adverseEventInfo.occurTime = Util.simplifyTime(adverseEventInfo.occurTime, true);
      adverseEventInfo.endTime = Util.simplifyTime(adverseEventInfo.endTime, true);
      pruneObj(adverseEventInfo);

      if (this.mode === this.ADD_NEW_CARD) {
        addAdverseEvent(adverseEventInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        adverseEventInfo.patientAdverseId = this.patientAdverseId;
        modifyAdverseEvent(adverseEventInfo).then(() => {
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
      if (this.seriousFlag === 1) {
        Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'seriousAdverseEventModal', this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      } else {
        Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
      }
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
    Bus.$on(this.SHOW_ADVERSE_EVENT_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_ADVERSE_EVENT_MODAL);
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
@field-name-width: 120px;
@scroll-bar-height: 10px;
@unit-width: 54px;
@computed-cell-color: lighten(@font-color, 55%);

.adverse-event-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .adverse-event-modal {
    position: relative;
    margin: 10px auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .serious-adverse-event {
      position: relative;
      top: 0;
      // left: @field-name-width;
      .el-checkbox {
        padding-right: 15px;
        margin-left: 0;
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
    }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      .foldable-content {
        // padding: 5px 0;
        margin-bottom: 20px;
        height: auto;
        overflow: hidden;
        transition: 0.15s;
        &.folded {
          padding: 0;
          height: 0;
        }
      }
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: 25px;
        font-size: @normal-font-size;
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
          line-height: 25px;
        //   font-size: @normal-font-size;
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
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .event-text {
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
            margin-bottom: 14px;
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
      .excursion {
        margin-bottom: -4px;
      }
      .table {
        margin: 10px 20px;
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
              right: 0px;
              top: 8px;
              color: red;
              font-size: 25px;
              vertical-align: middle;
            }
            &.title-col {
              background-color: @font-color;
              color: #fff;
            }
            &.computed-cell {
              background-color: @computed-cell-color;
              &.warning {
                background-color: @alert-color;
                color: #fff;
              }
              .warning-text {
                position: absolute;
                top: 35px;
                left: 0;
                color: @alert-color;
                font-size: @small-font-size;
              }
            }
            &.wide-col {
              width: 30%;
            }
            &.narrow-col {
              width: 5%;
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
      text-align: center;
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
      &.text1-button {
        width: 200px;
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
