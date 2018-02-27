<template lang="html">
  <div class="physiontherapy-modal-wrapper">
    <div class="physiontherapy-modal" ref="scrollArea">
        <h3 class="title">{{title}}</h3>
        <div class="content">
            <div class="field whole-line">
          <span class="field-name">
            物理疗法类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
             <span>{{transform(physiType,'physiType')}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.physiType}}</span>
            <el-select v-model="physiType" clearable placeholder="请选择物理疗法类型" @change="updateWarning('physiType')"
              :class="{'warning': warningResults.physiType}">
              <el-option
                v-for="item in getOptions('physiType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
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
        <div class="field" v-if ="!createdByTherapist">
          <span class="field-name">
            设备型号:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(deviceType,'tmsDeviceType')}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.deviceType}}</span>
            <el-select v-model="deviceType" clearable placeholder="请选择设备型号" @change="updateWarning('tmsDeviceType')" :class="{'warning': warningResults.deviceType}">
              <el-option
                v-for="item in getOptions('tmsDeviceType')"
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
        <div class="field" v-if ="!createdByTherapist">
          <span class="field-name">
            刺激时长（分钟）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{stimulusDuration}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="stimulusDuration" placeholder="请输入刺激时长"></el-input>
          </span>
        </div>
        <div class="field" v-if ="!createdByTherapist">
          <span class="field-name">
            刺激强度（T）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{stimulusIntensity}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="stimulusIntensity" placeholder="请输入刺激强度"></el-input>
          </span>
        </div>
        <div class="field" v-if ="!createdByTherapist">
          <span class="field-name">
            刺激频率（HZ）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{stimulusFrequency}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="stimulusFrequency" placeholder="请输入刺激频率"></el-input>
          </span>
        </div>
        <div class="field whole-line" v-if ="!createdByTherapist">
          <span class="field-name">
            刺激部位:
          </span>
          <div class="stimulate-part">
            <el-checkbox
              v-for="item in getOptions('stimulusPart')"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-checkbox>
          </div>
          <div class="stimulate-side">
            <el-checkbox v-model="stimulateSideEvents1[index]"
              v-for="(item, index) in getOptions('stimulusSide')"
              :label="item.name"
              :key="item.code"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
          </div>
          <div class="stimulate-side">
            <el-checkbox v-model="stimulateSideEvents2[index]"
              v-for="(item, index) in getOptions('stimulusSide')"
              :label="item.name"
              :key="item.code"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
          </div>
          <div class="stimulate-side">
            <el-checkbox v-model="stimulateSideEvents3[index]"
              v-for="(item, index) in getOptions('stimulusSide')"
              :label="item.name"
              :key="item.code"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
          </div>
        </div>
        <div class="field">
          <span class="field-name">
            治疗前左侧运动阈值:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{leftThresholdBefore}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.leftThresholdBefore}}</span>
            <el-input v-model="leftThresholdBefore" placeholder="请输入运动阈值" :class="{'warning': warningResults.leftThresholdBefore}" @change="updateWarning('leftThresholdBefore')"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            治疗前右侧运动阈值:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{rightThresholdBefore}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.rightThresholdBefore}}</span>
            <el-input v-model="rightThresholdBefore" placeholder="请输入运动阈值" :class="{'warning': warningResults.rightThresholdBefore}" @change="updateWarning('rightThresholdBefore')" ></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
             治疗后左侧运动阈值:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{leftThresholdAfter}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="leftThresholdAfter" placeholder="请输入运动阈值"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
             治疗后右侧运动阈值:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{rightThresholdAfter}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="rightThresholdAfter" placeholder="请输入运动阈值"></el-input>
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
        <div class="check-field">
          无不良反应：
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
       <P>无该症状 0；轻度 1-3；中度 4-7；重度 8-10；数值越大越严重</p>
      <div class="seperate-line"></div>
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy, reviseDateFormat, pruneObj } from 'utils/helper.js';
import { getPatientSimpleInfo, addPhysiontherapy, modifyPhysiontherapy } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      patientTaskCode: '',

      diagnosticExperimentStep: this.EXPERIMENT_STEP_OUT,

      patientPhytheTmsId: '',
      patientPhytheTms: '',
      physiType: '',
      recordDate: '',
      deviceType: '',
      stimulusIntensity: '',
      stimulusFrequency: '',
      stimulusSide: '',
      stimulateSideEvents1: [],
      stimulateSideEvents2: [],
      stimulateSideEvents3: [],
      stimulusPart: '',
      stimulusDuration: '',
      leftThresholdBefore: '',
      rightThresholdBefore: '',
      leftThresholdAfter: '',
      rightThresholdAfter: '',
      severityLevel: '',
      patientId: '',
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
        physiType: '',
        recordDate: '',
        deviceType: '',
        leftThresholdBefore: '',
        rightThresholdBefore: ''
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
        return '新增物理疗法';
      } else {
        return '物理疗法';
      }
    },
    createdByTherapist() {
      return this.diagnosticExperimentStep === this.EXPERIMENT_STEP_THERAPY;
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit, diagnosticExperimentStep) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      if (diagnosticExperimentStep !== undefined) {
        this.diagnosticExperimentStep = diagnosticExperimentStep;
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

      for (let reaction of this.patientPhytheReaction) {
        reaction.severityLevel = '';
      }

      for (let i = 0; i < this.stimulateSideEvents1.length; i++) {
        this.stimulateSideEvents1[i] = false;
      }
      for (let i = 0; i < this.stimulateSideEvents2.length; i++) {
        this.stimulateSideEvents2[i] = false;
      }
      for (let i = 0; i < this.stimulateSideEvents3.length; i++) {
        this.stimulateSideEvents3[i] = false;
      }
      // console.log('item: ', item);

      this.patientPhytheTmsId = item.patientPhytheTmsId ? item.patientPhytheTmsId : '';
      this.recordDate = item.recordDate ? item.recordDate : '';
      this.physiType = item.physiType ? item.physiType : '';
      this.deviceType = item.deviceType ? item.deviceType : '';
      this.stimulusIntensity = item.stimulusIntensity ? item.stimulusIntensity : '';
      this.stimulusSide = item.stimulusSide ? item.stimulusSide : '';
      this.stimulusFrequency = item.stimulusFrequency ? item.stimulusFrequency : '';
      this.stimulusDuration = item.stimulusDuration ? item.stimulusDuration : '';
      this.leftThresholdBefore = item.leftThresholdBefore ? item.leftThresholdBefore : '';
      this.rightThresholdBefore = item.rightThresholdBefore ? item.rightThresholdBefore : '';
      this.leftThresholdAfter = item.leftThresholdAfter ? item.leftThresholdAfter : '';
      this.rightThresholdAfter = item.rightThresholdAfter ? item.rightThresholdAfter : '';
      this.remark = item.remark ? item.remark : '';
      this.stimulusPart = item.stimulusPart ? item.stimulusPart : '';
      this.hasNoReaction = item.reactionFlag === 1;

      if (this.stimulusSide !== '') {
        this.bindValueToStimulateSideEvents();
      }

      vueCopy(item.patientPhytheReaction, this.patientPhytheReaction);
      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
      this.completeInit = true;
      // this.displayModal = true;
      this.updateScrollbar();
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
    prepareStimulateSideEvents() {
      var length = this.getOptions('stimulusSide').length;
      for (let i = 0; i < length; i++) {
        if (this.stimulateSideEvents1[i] === undefined) {
          this.$set(this.stimulateSideEvents1, i, false);
        }
        if (this.stimulateSideEvents2[i] === undefined) {
          this.$set(this.stimulateSideEvents2, i, false);
        }
        if (this.stimulateSideEvents3[i] === undefined) {
          this.$set(this.stimulateSideEvents3, i, false);
        }
      }
    },
    bindValueToStimulateSideEvents() {
      var length = this.getOptions('stimulusSide').length;
      for (let i = 0; i < length; i++) {
        this.stimulateSideEvents1[i] = this.stimulusSide[i] === '1';
        this.stimulateSideEvents2[i] = this.stimulusSide[length + i] === '1';
        this.stimulateSideEvents3[i] = this.stimulusSide[length + length + i] === '1';
      }
    },
    concatenateStimulusSide() {
      var list = [].concat(this.stimulateSideEvents1, this.stimulateSideEvents2, this.stimulateSideEvents3);
      var result = '';
      for (let value of list) {
        result += value ? '1' : '0';
      }
      return result;
    },
    updateWarning(fieldName) {
      var list = ['recordDate', 'physiType', 'deviceType', 'leftThresholdBefore', 'rightThresholdBefore'];
      if (list.indexOf(fieldName) >= 0 && !this[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
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
        if (this.createdByTherapist && property === 'deviceType') {
          // do nothing
        } else if (this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }
      var physicsInfo = {};
      physicsInfo.patientId = this.$route.params.id;
      physicsInfo.patientCaseId = this.$route.params.caseId;
      physicsInfo.physiType = this.physiType;
      physicsInfo.recordDate = this.recordDate;
      physicsInfo.deviceType = this.deviceType;
      physicsInfo.stimulusIntensity = this.stimulusIntensity;
      physicsInfo.stimulusFrequency = this.stimulusFrequency;
      physicsInfo.stimulusSide = this.concatenateStimulusSide();

      physicsInfo.stimulusDuration = this.stimulusDuration;
      physicsInfo.leftThresholdBefore = this.leftThresholdBefore;
      physicsInfo.rightThresholdBefore = this.rightThresholdBefore;
      physicsInfo.leftThresholdAfter = this.leftThresholdAfter;
      physicsInfo.rightThresholdAfter = this.rightThresholdAfter;
      physicsInfo.remark = this.remark;
      physicsInfo.stimulusPart = this.stimulusPart;
      physicsInfo.reactionFlag = this.hasNoReaction ? 1 : 0;
      physicsInfo.patientPhytheReaction = deepCopy(this.patientPhytheReaction);

      reviseDateFormat(physicsInfo);
      pruneObj(physicsInfo);

      if (this.mode === this.ADD_NEW_CARD) {
        addPhysiontherapy(physicsInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        physicsInfo.patientPhytheTmsId = this.patientPhytheTmsId;
        modifyPhysiontherapy(physicsInfo).then(() => {
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
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
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
    Bus.$on(this.SHOW_PHYSIONTHERAPY_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.prepareStimulateSideEvents();
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_PHYSIONTHERAPY_MODAL);
  },
  watch: {
    typeGroup: function() {
      this.prepareStimulateSideEvents();
      this.bindValueToStimulateSideEvents();
    },
    '$route.path'() {
      // if (this.displayModal) {
      //   this.cancel();
      // }
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 150px;
@long-field-name-width: 160px;

.physiontherapy-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .physiontherapy-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .stimulate-part {
      position: absolute;
      top: 0;
      left: @field-name-width;
      .el-checkbox {
        display: block;
        margin-left: 0;
        .el-checkbox__inner {
          border: 0;
          width: 0;
          height: 0;
        }
      }
    }
    .stimulate-side {
      position: relative;
      top: 0;
      left: 2*@field-name-width;
      .el-checkbox {
        margin-left: 30px;
        .el-checkbox__inner {
          margin-right: 10px;
          margin-top: -6px;
        }
      }
    }
    .check-field {
      padding-left: 10px;
      text-align: left;
      .text {
        display: inline-block;
        height: 20px;
        line-height: 20px;
      }
    }
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
          // &.long-field-name {
          //   width: @long-field-name-width;
          // }
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
          // &.long-field-name {
          //   left: @long-field-name-width;
          // }
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
