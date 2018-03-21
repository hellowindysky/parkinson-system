<template lang="html">
  <div class="serious-adverse-event-modal-wrapper">
    <div class="serious-adverse-event-modal" ref="scrollArea">
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
            SAE 情况:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
           {{translateToName()}}
          </span>
          <span class="field-input" v-else>
            <div class="serious-adverse-event">
              <el-checkbox v-for="(item, index) in getOptions('seriousAdverse')"
                v-model="seriousAdverseEvents[index]"
                :key="item.code"
                :label="item.name"
                :disabled="mode===VIEW_CURRENT_CARD">
              </el-checkbox>
            </div>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            SAE发生时间:
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
              placeholder="请选择SAE发生时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
         <div class="field">
          <span class="field-name">
            获知SAE时间:
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
              placeholder="请选择SAE获知时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           转&nbsp;&nbsp;&nbsp;&nbsp;归:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('')"
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
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           后遗症:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            症状消失时间:
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
              placeholder="请选择死亡时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            表&nbsp;&nbsp;&nbsp;&nbsp;现:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入后遗症表现">
            </el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            直接死因:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入直接死因">
            </el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            死亡时间:
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
              placeholder="请选择死亡时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           国内SAE报告情况:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           国外SAE报告情况:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <table class="table">
          <tr class="row title-row">
            <td class="col col-width-35">与研究器械的关联性评价</td>
            <td class="col col-width-10">是</td>
            <td class="col col-width-10">否</td>
            <td class="col col-width-15">不清楚</td>
          </tr>
          <tr class="row">
            <td class="col col-width-35">{{""}}</td>
            <td class="col col-width-10">{{""}}</td>
            <td class="col col-width-10">{{""}}</td>
            <td class="col col-width-15"></td>
          </tr>
        </table>
        <div class="field">
          <span class="field-name">
           是否揭盲:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择">
              <el-option
                v-for="item in getOptions('')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            揭盲日期:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{""}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="occurTime"
              :class="{'warning': warningResults.occurTime}"
              type="date"
              placeholder="请选择揭盲日期"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            SAE发生及处理详情:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入SAE发生及处理详情">
            </el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy, reviseMinuteFormat, pruneObj } from 'utils/helper';
import { getPatientSimpleInfo, addAdverseEvent, modifyAdverseEvent } from 'api/patient.js';

export default {
  props: {
  },
  data() {
    return {
      mode: '',
      completeInit: false,
      patientTaskCode: '',


      patientAdverse: '',
      patientAdverseId: '',
      occurTime: '',
      adverseName: '',
      adverseDescribe: '',
      measureFlag: '',
      seriousFlag: '',
      severity: '',
      treatmentRelate: '',
      seriousAdverse: '',
      seriousAdverseEvents: [],
      remark: '',
      otherMeasure: '',
      aboratoryExam: '',
      adverseResult: '',
      relieveDate: '',
      adverseEffect: '',
      medicineMethod: '',
      hasNoReaction: '',
      foldedConditionalContentMeasures: false,
      foldedConditionalContentEndEvents: false,
      adjointMedicine: [
        {
          'medicineName': '',
          'totalDailyDose': '',
          'medicineMethod': ''
        }
      ],
      treatMedicine: [
        {
          'medicineName': '',
          'totalDailyDose': '',
          'medicineMethod': ''
        }
      ],
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
        return '新增严重不良事件';
      } else {
        return '严重不良事件';
      }
    }
  },
  methods: {
    translateToName() {
      let typeArr = this.getOptions('seriousAdverse');
      let str = [];
      this.seriousAdverseEvents.forEach((item, i) => {
        if (item === true) {
          str.push(typeArr[i].name);
        }
      });
      return str.join('，');
    },
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.adjointMedicine = [];
      this.$set(this.adjointMedicine, 0, {});
      this.$set(this.adjointMedicine[0], 'medicineName', '');
      this.$set(this.adjointMedicine[0], 'totalDailyDose', '');
      this.$set(this.adjointMedicine[0], 'totalDailyDose', '');

      this.treatMedicine = [];
      this.$set(this.treatMedicine, 0, {});
      this.$set(this.treatMedicine[0], 'medicineName', '');
      this.$set(this.treatMedicine[0], 'totalDailyDose', '');
      this.$set(this.treatMedicine[0], 'totalDailyDose', '');
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
      this.adverseName = item.adverseName ? item.adverseName : '';
      this.adverseDescribe = item.adverseDescribe ? item.adverseDescribe : '';
      this.measureFlag = item.measureFlag;
      this.seriousFlag = item.seriousFlag;
      this.severity = item.severity ? item.severity : '';
      this.treatmentRelate = item.treatmentRelate ? item.treatmentRelate : '';
      this.seriousAdverse = item.seriousAdverse ? item.seriousAdverse : '';
      this.prepareSeriousAdverseEvent();

      this.remark = item.remark ? item.remark : '';
      this.otherMeasure = item.otherMeasure ? item.otherMeasure : '';
      this.aboratoryExam = item.aboratoryExam ? item.aboratoryExam : '';
      this.adverseResult = item.adverseResult ? item.adverseResult : '';
      this.relieveDate = item.relieveDate ? item.relieveDate : '';
      this.adverseEffect = item.adverseEffect ? item.adverseEffect : '';
      this.medicineMethod = item.medicineMethod ? item.medicineMethod : '';
      this.relieveDate = item.relieveDate ? item.relieveDate : '';
      vueCopy(item.adjointMedicine, this.adjointMedicine);
      vueCopy(item.treatMedicine, this.treatMedicine);

      this.completeInit = true;
      this.updateScrollbar();
      this.foldedConditionalContentMeasures = false;
      this.foldedConditionalContentEndEvents = false;
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field.fieldName).uiType;
    },
    getMatchedField(fieldName) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', fieldName, this.diseaseInfoDictionary);
    },
    addAdjointMedicine() {
      var medicineList = this.adjointMedicine;
      var index = medicineList.length;
      this.$set(medicineList, index, {});
      let propertyList = ['medicineName', 'totalDailyDose', 'medicineMethod'];
      for (let property of propertyList) {
        this.$set(medicineList[index], property, '');
      }
    },
    addTreatMedicine() {
      var medicineList = this.treatMedicine;
      var index = medicineList.length;
      this.$set(medicineList, index, {});
      let propertyList = ['medicineName', 'totalDailyDose', 'medicineMethod'];
      for (let property of propertyList) {
        this.$set(medicineList[index], property, '');
      }
    },
    removeAdjointMedicine(index) {
      var medicineList = this.adjointMedicine;
      var oldList = [];
      for (let medicine of medicineList) {
        oldList.push({
          medicineName: medicine.medicineName,
          totalDailyDose: medicine.totalDailyDose
        });
      }
      medicineList.splice(index, 1);
      this.$nextTick(() => {
        for (var i = 0; i < medicineList.length; i++) {
          medicineList[i].medicineName = oldList[i].medicineName;
          medicineList[i].totalDailyDose = oldList[i].totalDailyDose;
        }
      });
    },
    removeTreatMedicine(index) {
      var medicineList = this.treatMedicine;
      var oldList = [];
      for (let medicine of medicineList) {
        oldList.push({
          medicineName: medicine.medicineName,
          totalDailyDose: medicine.totalDailyDose
        });
      }
      medicineList.splice(index, 1);
      this.$nextTick(() => {
        for (var i = 0; i < medicineList.length; i++) {
          medicineList[i].medicineName = oldList[i].medicineName;
          medicineList[i].totalDailyDose = oldList[i].totalDailyDose;
        }
      });
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
    initSeriousAdverseEvents() {
      var options = this.getOptions('seriousAdverse');
      this.seriousAdverseEvents = [];
      for (let i = 0; i < options.length; i++) {
        this.$set(this.seriousAdverseEvents, i, false);
      }
    },
    prepareSeriousAdverseEvent() {
      var list = this.seriousAdverse.split('');
      for (let i = 0; i < this.seriousAdverseEvents.length; i++) {
        this.seriousAdverseEvents[i] = list[i] === '1';
      }
    },
    concatenateSeriousAdverse() {
      var result = '';
      for (let event of this.seriousAdverseEvents) {
        result += (event ? '1' : '0');
      }
      return result;
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
      adverseEventInfo.adverseName = this.adverseName;
      adverseEventInfo.adverseDescribe = this.adverseDescribe;
      adverseEventInfo.adverseSeverity = this.adverseSeverity;
      adverseEventInfo.treatmentRelate = this.treatmentRelate;
      adverseEventInfo.severity = this.severity;
      adverseEventInfo.seriousFlag = this.seriousFlag;
      adverseEventInfo.measureFlag = this.measureFlag;
      adverseEventInfo.digitYN = this.digitYN;
      adverseEventInfo.seriousAdverse = this.concatenateSeriousAdverse();

      adverseEventInfo.remark = this.remark;
      adverseEventInfo.otherMeasure = this.otherMeasure;
      adverseEventInfo.aboratoryExam = this.aboratoryExam;
      adverseEventInfo.adverseResult = this.adverseResult;
      adverseEventInfo.relieveDate = this.relieveDate;
      adverseEventInfo.adverseEffect = this.adverseEffect;
      adverseEventInfo.adjointMedicine = deepCopy(this.adjointMedicine);
      adverseEventInfo.treatMedicine = deepCopy(this.treatMedicine);
      reviseMinuteFormat(adverseEventInfo);
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
    Bus.$on(this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
    this.initSeriousAdverseEvents();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL);
  },
  watch: {
    typeGroup() {
      this.initSeriousAdverseEvents();
      this.prepareSeriousAdverseEvent();
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 0;
@field-name-width: 120px;
@scroll-bar-height: 10px;
@unit-width: 54px;
@computed-cell-color: lighten(@font-color, 55%);

.serious-adverse-event-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .serious-adverse-event-modal {
    position: relative;
    margin: auto;
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
          left: @field-line-height;
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
        margin: 10px 0;
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
            &.col-width-10 {
              width: 10%;
            }
            &.col-width-15 {
              width: 15%;
            }
            &.col-width-35 {
              width: 35%;
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
      text-align: center;
      .toggle-fold-button {
        display: inline-block;
        width: 180px;
        height: 21px;
        line-height: 21px;
        background-color: @background-color;
        font-size: @small-font-size;
        color: @gray-color;
        transform: translateY(-10px);
        cursor: pointer;
        &:hover {
          color: fade(@gray-color, 50%);
        }
        &:active {
          color: fade(@gray-color, 75%);
        }
      }
      .iconfont {
        position: absolute;
        display: inline-block;
        margin-left: 8px;
        width: @field-line-height;
        height: @field-line-height;
        color:#aaa;
        vertical-align: middle;
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
