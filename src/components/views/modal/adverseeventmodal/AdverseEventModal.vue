<template lang="html">
  <div class="adverse-event-modal-wrapper" v-show="displayModal">
    <div class="adverse-event-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            开始发生时间：
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
              placeholder="请选择开始发生时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            不良事件名称：
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
            不良事件描述：
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
              placeholder="请输入不良事件描述">
            </el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            实验编号:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span></span>
          </span>
          <span class="field-input" v-else>
            <el-input  placeholder="自动获取实验编号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           是否采取措施：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(measureFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="measureFlag" clearable placeholder="请选择">
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
           严重程度：
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
           是否与本次治疗有关：
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
           是否严重不良事件：
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
        <div class="field" v-show="seriousFlag===1">
          <span class="field-name">
            严重不良事件：
          </span>
          <div class="serious-adverse-event">
            <el-checkbox v-for="(item, index) in getOptions('seriousAdverse')"
              v-model="seriousAdverseEvents[index]"
              :key="item.code"
              :label="item.name"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
          </div> 
        </div>
        <div class="field whole-line">
          伴随用药
        </div>
        <table class="table">
          <tr class="row title-row">
            <td class="col">
              <span class="iconfont icon-plus" @click="addAdjointMedicine" v-show="adjointMedicine.length <15 && mode !== VIEW_CURRENT_CARD"></span>
              序号
            </td>
            <td class="col">
              药物名称
            </td>
            <td class="col">日总剂量（mg/d）</td>
            <td class="col">给药途径</td>
          </tr>
          <tr class="row" v-for="(medicine, index) in adjointMedicine">
            <td class="col">
              <span v-show="mode!==VIEW_CURRENT_CARD" class="iconfont icon-remove" @click="removeAdjointMedicine(index)"></span>
              {{String.fromCharCode(64 + parseInt(index+1))}}
            </td>
            <td class="col">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                {{(medicine.medicineName)}}
              </span>
              <span class="field-input" v-else>
                <el-input v-model="medicine.medicineName" placeholder="请输入药物名称"></el-input>
              </span>
            </td>
            <td class="col">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                {{(medicine.totalDailyDose)}}
              </span>
              <span class="field-input" v-else>
                <el-input v-model="medicine.totalDailyDose" placeholder="请输入日总剂量"></el-input>
              </span>
            </td>
            <td class="col">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span>{{transform(medicine.medicineMethod,'medicineMethod')}}</span>
              </span>
              <span class="field-input" v-else>
                <el-select v-model="medicine.medicineMethod" clearable placeholder="请选择给药途径">
                  <el-option
                    v-for="item in getOptions('medicineMethod')"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </span>
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">
            备注：
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
              placeholder="请输入备注">
            </el-input>
          </span>
        </div>
        <div v-show="measureFlag===1">
          <div class="seperate-line">
            <div class="toggle-fold-button" @click="toggleContentFoldedMeasures">
              治疗措施
              <span class="iconfont" :class="iconToggleFoldedMeasures"></span>
            </div>
          </div>
          <div class="foldable-content" :class="{'folded': foldedConditionalContentMeasures}">
            <div class="field whole-line">
            药物治疗
            </div>
            <table class="table">
              <tr class="row title-row">
              <td class="col">
                <span class="iconfont icon-plus" @click="addTreatMedicine" v-show="treatMedicine.length <15 && mode !== VIEW_CURRENT_CARD"></span>
                  序号
                </td>
                <td class="col">
                  药物名称
                </td>
                <td class="col">日总剂量（mg/d）</td>
                <td class="col">给药途径</td>
              </tr>
              <tr class="row" v-for="(reaction, index) in treatMedicine">
                <td class="col">
                  <span v-show="mode!==VIEW_CURRENT_CARD" class="iconfont icon-remove" @click="removeTreatMedicine(index)"></span>
                  {{String.fromCharCode(64 + parseInt(index+1))}}
                </td>
                <td class="col">
                  <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                    {{(reaction.medicineName)}}
                  </span>
                  <span class="field-input" v-else>
                    <el-input v-model="reaction.medicineName" placeholder="请输入药物名称"></el-input>
                  </span>
                </td>
                <td class="col">
                  <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                    {{(reaction.totalDailyDose)}}
                  </span>
                  <span class="field-input" v-else>
                    <el-input v-model="reaction.totalDailyDose" placeholder="请输入日总剂量"></el-input>
                  </span>
                </td>
                <td class="col">
                  <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                    <span>{{transform(reaction.medicineMethod,'medicineMethod')}}</span>
                  </span>
                  <span class="field-input" v-else>
                    <el-select v-model="reaction.medicineMethod" clearable placeholder="请选择给药途径">
                      <el-option
                        v-for="item in getOptions('medicineMethod')"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </span>
                </td>
              </tr>
            </table>
            <div class="field whole-line">
                <span class="field-name">
                其他治疗措施：
                </span>
                <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                {{otherMeasure}}
                </span>
                <span class="field-input" v-else>
                <el-input
                    v-model="otherMeasure"
                    type="textarea"
                    :rows="2"
                    :maxlength="500"
                    placeholder="请输入其他治疗措施">
                </el-input>
                </span>
            </div>
            <div class="field whole-line">
              <span class="field-name">
                实验室检查：
              </span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                {{aboratoryExam}}
              </span>
              <span class="field-input" v-else>
                <el-input
                  v-model="aboratoryExam"
                  type="textarea"
                  :rows="2"
                  :maxlength="500"
                  placeholder="请输入实验室检查详情">
                </el-input>
              </span>
            </div>
          </div>
        </div> 
        <div class="seperate-line">
          <div class="toggle-fold-button" @click="toggleContentFoldedEndEvent">
            不良事件结局
            <span class="iconfont" :class="iconToggleFoldedMeasures"></span>
          </div>
        </div>
        <div class="foldable-content" :class="{'folded': foldedConditionalContentEndEvent}">
          <div class="field whole-line">
            <span class="field-name">
              不良事件结局：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(adverseResult,'adverseResult')}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="adverseResult" clearable placeholder="请选择发生不良事件的结局">
                <el-option
                  v-for="item in getOptions('adverseResult')"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="field whole-line" v-show="adverseResult===3">
            <span class="field-name">
              缓解日期：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{relieveDate}}</span>
            </span>
            <span class="field-input" v-else>
              <el-date-picker
                v-model="relieveDate"
                type="date"
                placeholder="请选择缓解日期  "
                :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>
          <div class="field whole-line">
            <span class="field-name">
              不良事件影响：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(adverseEffect,'adverseEffect')}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="adverseEffect" clearable placeholder="请选择">
                <el-option
                  v-for="item in getOptions('adverseEffect')"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy, reviseMinuteFormat, pruneObj } from 'utils/helper';
import { addAdverseEvent, modifyAdverseEvent } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,

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
      foldedConditionalContentEndEvent: false,
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
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    iconToggleFoldedMeasures() {
      return this.folded ? 'icon-arrow-down' : 'icon-arrow-up';
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增不良事件';
      } else {
        return '不良事件';
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
      for (let medicine of this.adjointMedicine) {
        medicine.medicineName = '';
        medicine.totalDailyDose = '';
        medicine.medicineMethod = '';
      }
      for (let reaction of this.treatMedicine) {
        reaction.medicineName = '';
        reaction.totalDailyDose = '';
        reaction.medicineMethod = '';
      }
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
      this.measureFlag = item.measureFlag ? item.measureFlag : '';
      this.seriousFlag = item.seriousFlag ? item.seriousFlag : '';
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
      this.displayModal = true;
      this.updateScrollbar();
      this.foldedConditionalContentMeasures = true;
      this.foldedConditionalContentEndEvent = true;
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
      var adverseEventInfo = {};
      adverseEventInfo.patientId = this.$route.params.id;
      adverseEventInfo.patientCaseId = this.$route.params.caseId;
      adverseEventInfo.occurTime = this.occurTime;
      adverseEventInfo.adverseName = this.adverseName;
      adverseEventInfo.adverseDescribe = this.adverseDescribe;
      adverseEventInfo.measureFlag = this.measureFlag;
      adverseEventInfo.adverseSeverity = this.adverseSeverity;
      adverseEventInfo.treatmentRelate = this.treatmentRelate;
      adverseEventInfo.severity = this.severity;
      adverseEventInfo.seriousFlag = this.seriousFlag;
      adverseEventInfo.measureFlag = this.measureFlag;
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
    toggleContentFoldedMeasures() {
      this.foldedConditionalContentMeasures = !this.foldedConditionalContentMeasures;
      setTimeout(() => {
        this.updateScrollbar();
      }, 150);
      this.folded = !this.folded;
    },
    toggleContentFoldedEndEvent() {
      this.foldedConditionalContentEndEvent = !this.foldedConditionalContentEndEvent;
      setTimeout(() => {
        this.updateScrollbar();
      }, 150);
      this.folded = !this.folded;
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
    Bus.$on(this.SHOW_ADVERSE_EVENT_MODAL, this.showPanel);
    this.updateScrollbar();
    this.initSeriousAdverseEvents();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_ADVERSE_EVENT_MODAL);
  },
  watch: {
    typeGroup() {
      this.initSeriousAdverseEvents();
      this.prepareSeriousAdverseEvent();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 170px;
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
      left: @field-name-width;
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
        padding: 5px 0;
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
        line-height: @field-line-height;
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
          line-height: @field-line-height;
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
      .table {
        margin: -15px 0 20px;
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
