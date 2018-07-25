<template lang="html">
  <div class="medicine-adverse-event-modal-wrapper">
    <div class="medicine-adverse-event-modal">
      <h3 class="title">{{title}}</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            开始发生时间:
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
              type="date"
              placeholder="请选择时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
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
            <span class="warning-text">{{warningResults.adverseDescribe}}</span>
            <el-input
              v-model="adverseDescribe"
              :class="{'warning': warningResults.adverseDescribe}"
              @change="updateWarning('adverseDescribe')"
              placeholder="请输入不良事件描述">
            </el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            课程编号:
          </span>
          <span class="field-input">
            {{patientTaskCode}}
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           是否采取措施:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(measureFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="measureFlag" clearable placeholder="请选择是否采取措施">
              <el-option
                v-for="item in getOptions('digitYN')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           是否与本次治疗有关:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(treatmentRelate,'treatmentRelate')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="treatmentRelate" clearable placeholder="请选择是否采取措施">
              <el-option
                v-for="item in getOptions('treatmentRelate')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           对药物的剂量影响:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(medicineDoseEffect,'medicineDoseEffect')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="medicineDoseEffect" clearable placeholder="请选择影响">
              <el-option
                v-for="item in getOptions('medicineDoseEffect')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           与研究药物的关系:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(searchMedicineRelate,'searchMedicineRelate')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="searchMedicineRelate" clearable placeholder="请选择关系">
              <el-option
                v-for="item in getOptions('searchMedicineRelate')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           是否严重不良事件:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(seriousFlag,'digitYN')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="seriousFlag" clearable placeholder="请选择是否严重不良事件" @change="toggle">
              <el-option
                v-for="item in getOptions('digitYN')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line" v-if="seriousFlag === 1">
          <span class="field-name">
            严重不良事件:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
           {{translateToName(seriousAdverse, 'medicineSeriousAdverse')}}
          </span>
          <span class="field-input" v-else>
            <div class="medicine-adverse-event">
              <el-checkbox v-for="(item, index) in getOptions('medicineSeriousAdverse')"
                v-model="seriousAdverseEvents[index]"
                :key="item.code"
                :label="item.name"
                :disabled="mode===VIEW_CURRENT_CARD">
              </el-checkbox>
            </div>
          </span>
        </div>
        <div class="field whole-line" v-if="seriousFlag === 1">
          <span class="field-name">
            严重不良事件报告日期:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{reportAdverseDate}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="reportAdverseDate"
              type="date"
              placeholder="请选择时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>
        <div class="seperate-line" v-if="measureFlag==1">
          <div class="toggle-fold-button" @click="toggleContentFoldedMeasures">
              治疗措施
            <span class="iconfont" :class="iconToggleFoldedMeasures"></span>
          </div>
        </div>
        <div class="foldable-content" v-if="measureFlag==1" :class="{'folded': foldedConditionalContentMeasures}">
          <div class="field whole-line excursion" v-if="measureFlag==1">
              药物治疗（最近90天内所使用的其他药物）
          </div>
            <table class="table">
              <tr class="row title-row">
                <td class="col col-width-10">
                  <span class="iconfont icon-plus" @click="addTreatMedicine" v-show="patientCaseAdverseMedicine.length <15 && mode !== VIEW_CURRENT_CARD"></span>
                  序号
                </td>
                <td class="col col-width-10">药物名称</td>
                <td class="col col-width-10">用药时间</td>
                <td class="col col-width-10">目前用法</td>
                <td class="col col-width-15">继续应用</td>
              </tr>
              <tr class="row" v-for="(reaction, index) in patientCaseAdverseMedicine">
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
                    {{(reaction.medicineTime)}}
                  </span>
                  <span class="field-input" v-else>
                    <el-date-picker
                      v-model="reaction.medicineTime"
                      type="date"
                      format="yyyy-MM-dd"
                      placeholder="请输入用药时间"
                      :picker-options="pickerOptions">
                    </el-date-picker>
                  </span>
                </td>
                <td class="col">
                  <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                    {{(reaction.useMedicineWay)}}
                  </span>
                  <span class="field-input" v-else>
                    <el-input v-model="reaction.useMedicineWay" placeholder="请输入目前用法"></el-input>
                  </span>
                </td>
                <td class="col">
                  <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                    <span>{{transform(reaction.whetherContinue,'digitYN')}}</span>
                  </span>
                  <span class="field-input" v-else>
                    <el-select v-model="reaction.whetherContinue" clearable placeholder="请选择是否继续应用">
                      <el-option
                        v-for="item in getOptions('digitYN')"
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
        <div class="seperate-line" v-if="seriousFlag === 1">
          <div class="toggle-fold-button" @click="toggleContentFoldedEndEvent">
            不良事件结局
            <span class="iconfont" :class="iconToggleFoldedEvents"></span>
          </div>
        </div>
        <div class="foldable-content" v-if="seriousFlag === 1" :class="{'folded': foldedConditionalContentEndEvents}">
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
          <div class="field whole-line">
            <span class="field-name">
              事件结束时间：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{endTime}}</span>
            </span>
            <span class="field-input" v-else>
              <el-date-picker
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="请选择时间"
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
          <div class="field whole-line">
            <span class="field-name">
              是否退出课题:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(exitTestFlag,'digitYN')}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="exitTestFlag" clearable placeholder="请选择是否退出课题">
                <el-option
                  v-for="item in getOptions('digitYN')"
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
      </div>
      <div class="modal-footer">
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { vueCopy, deepCopy, pruneObj, reviseDateFormat } from 'utils/helper';
import { getPatientSimpleInfo, addMedicineAdverseEvent, modifyMedicineAdverseEvent } from 'api/patient.js';

export default {
  props: {
    foldedMeasuresStatus: {
      required: false,
      type: Boolean,
      default: true   // 如果没有传入这个参数，默认状态下面板是折叠的
    },
    foldedEventsStatus: {
      required: false,
      type: Boolean,
      default: true   // 如果没有传入这个参数，默认状态下面板是折叠的
    }
  },
  data() {
    return {
      mode: '',
      completeInit: false,
      patientTaskCode: '',
      patientAdverseSerious: '',
      patientAdverseId: '',
      occurTime: '',
      adverseDescribe: '',
      measureFlag: '',
      medicineDoseEffect: '',
      searchMedicineRelate: '',
      seriousFlag: '',
      seriousAdverse: '',
      reportAdverseDate: '',
      otherMeasure: '',
      aboratoryExam: '',
      adverseResult: '',
      endTime: '',
      adverseEffect: '',
      exitTestFlag: '',
      treatmentRelate: '',
      adverseName: '',
      seriousAdverseEvents: [],
      foldedMeasures: this.foldedMeasuresStatus,
      foldedConditionalContentMeasures: false,
      foldedEvents: this.foldedEventsStatus,
      foldedConditionalContentEndEvents: false,
      patientCaseAdverseMedicine: [
        {
          'medicineTime': '',
          'medicineName': '',
          'useMedicineWay': '',
          'whetherContinue': ''
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
    iconToggleFoldedMeasures() {
      return this.foldedMeasures ? 'icon-arrow-down' : 'icon-arrow-up';
    },
    iconToggleFoldedEvents() {
      return this.foldedEvents ? 'icon-arrow-down' : 'icon-arrow-up';
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增不良事件';
      } else {
        return '不良事件';
      }
    }
  },
  methods: {
    translateToName(seriousAdverse) {
      let typeArr = this.getOptions('medicineSeriousAdverse');
      let str = [];
      for (let i = 0; i < seriousAdverse.length; i++) {
        if (seriousAdverse[i] === '1') {
          str.push(typeArr[i].name);
        }
      };
      // this.seriousAdverseEvents.forEach((item, i) => {
      //   if (item === true) {
      //     str.push(typeArr[i].name);
      //   }
      // });
      return str.join('，');
    },
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.patientCaseAdverseMedicine = [];
      this.$set(this.patientCaseAdverseMedicine, 0, {});
      this.$set(this.patientCaseAdverseMedicine[0], 'medicineTime', '');
      this.$set(this.patientCaseAdverseMedicine[0], 'medicineName', '');
      this.$set(this.patientCaseAdverseMedicine[0], 'useMedicineWay', '');
      this.$set(this.patientCaseAdverseMedicine[0], 'whetherContinue', '');
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
      this.adverseDescribe = item.adverseDescribe ? item.adverseDescribe : '';
      this.measureFlag = item.measureFlag;
      this.treatmentRelate = item.treatmentRelate ? item.treatmentRelate : '';
      this.medicineDoseEffect = item.medicineDoseEffect ? item.medicineDoseEffect : '';
      this.searchMedicineRelate = item.searchMedicineRelate ? item.searchMedicineRelate : '';
      this.seriousFlag = item.seriousFlag ;
      this.seriousAdverse = item.seriousAdverse ? item.seriousAdverse : '';
      this.reportAdverseDate = item.reportAdverseDate ? item.reportAdverseDate : '';
      this.otherMeasure = item.otherMeasure ? item.otherMeasure : '';
      this.adverseEffect = item.adverseEffect ? item.adverseEffect : '';
      this.aboratoryExam = item.aboratoryExam ? item.aboratoryExam : '';
      this.adverseResult = item.adverseResult ? item.adverseResult : '';
      this.adverseName = item.adverseName ? item.adverseName : '';
      this.endTime = item.endTime ? item.endTime : '';
      this.exitTestFlag = item.exitTestFlag;
      vueCopy(item.patientCaseAdverseMedicine, this.patientCaseAdverseMedicine);
      this.prepareSeriousAdverseEvent();
      this.completeInit = true;
      this.updateScrollbar();
    },
    addTreatMedicine() {
      var medicineList = this.patientCaseAdverseMedicine;
      var index = medicineList.length;
      this.$set(medicineList, index, {});
      let propertyList = ['medicineTime', 'medicineName', 'useMedicineWay', 'whetherContinue'];
      for (let property of propertyList) {
        this.$set(medicineList[index], property, '');
      }
    },
    removeTreatMedicine(index) {
      var medicineList = this.patientCaseAdverseMedicine;
      var oldList = [];
      for (let medicine of medicineList) {
        oldList.push({
          duration: medicine.duration,
          useMedicineWay: medicine.useMedicineWay
        });
      }
      medicineList.splice(index, 1);
      this.$nextTick(() => {
        for (var i = 0; i < medicineList.length; i++) {
          medicineList[i].duration = oldList[i].duration;
          medicineList[i].useMedicineWay = oldList[i].useMedicineWay;
        }
      });
    },
    toggle() {
      this.adverseResult = '';
      this.adverseEffect = '';
      this.endTime = '';
      this.exitTestFlag = '';
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
    initSeriousAdverseEvents() {
      var options = this.getOptions('medicineSeriousAdverse');
      this.seriousAdverseEvents = [];
      for (let i = 0; i < options.length; i++) {
        this.$set(this.seriousAdverseEvents, i, false);
      }
    },
    prepareSeriousAdverseEvent() {
      for (let i = 0; i < this.seriousAdverse.length; i++) {
        this.$set(this.seriousAdverseEvents, i, this.seriousAdverse[i] === '1');
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
      var medicineAdverseEventInfo = {};
      medicineAdverseEventInfo.patientId = this.$route.params.id;
      medicineAdverseEventInfo.patientCaseId = this.$route.params.caseId;
      medicineAdverseEventInfo.occurTime = this.occurTime;
      medicineAdverseEventInfo.adverseDescribe = this. adverseDescribe;
      medicineAdverseEventInfo.measureFlag = this. measureFlag;
      medicineAdverseEventInfo.treatmentRelate = this.treatmentRelate;
      medicineAdverseEventInfo.medicineDoseEffect = this.medicineDoseEffect;
      medicineAdverseEventInfo.searchMedicineRelate = this.searchMedicineRelate;
      medicineAdverseEventInfo.seriousFlag = this.seriousFlag;
      medicineAdverseEventInfo.seriousAdverse = this.seriousAdverse;
      medicineAdverseEventInfo.reportAdverseDate = this.reportAdverseDate;
      medicineAdverseEventInfo.otherMeasure = this.otherMeasure;
      medicineAdverseEventInfo.aboratoryExam = this.aboratoryExam;
      medicineAdverseEventInfo.adverseResult = this.adverseResult;
      medicineAdverseEventInfo.endTime = this.endTime;
      medicineAdverseEventInfo.adverseName = this.adverseName;
      medicineAdverseEventInfo.adverseEffect = this.adverseEffect;
      medicineAdverseEventInfo.exitTestFlag = this.exitTestFlag;
      medicineAdverseEventInfo.seriousAdverse = this.concatenateSeriousAdverse();
      medicineAdverseEventInfo.patientCaseAdverseMedicine = deepCopy(this.patientCaseAdverseMedicine);
      medicineAdverseEventInfo.endTime = Util.simplifyTime(medicineAdverseEventInfo.endTime, false);
      reviseDateFormat(medicineAdverseEventInfo);
      pruneObj(medicineAdverseEventInfo);
      if (this.mode === this.ADD_NEW_CARD) {
        addMedicineAdverseEvent(medicineAdverseEventInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        medicineAdverseEventInfo.patientAdverseId = this.patientAdverseId;
        modifyMedicineAdverseEvent(medicineAdverseEventInfo).then(() => {
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
      this.foldedMeasures = !this.foldedMeasures;
    },
    toggleContentFoldedEndEvent() {
      this.foldedConditionalContentEndEvents = !this.foldedConditionalContentEndEvents;
      setTimeout(() => {
        this.updateScrollbar();
      }, 150);
      this.foldedEvents = !this.foldedEvents;
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
    this.initSeriousAdverseEvents();
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_MEDICINE_ADVERSE_EVENT_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_MEDICINE_ADVERSE_EVENT_MODAL);
  },
  watch: {
    typeGroup() {
      this.initSeriousAdverseEvents();
      this.prepareSeriousAdverseEvent();
    },
    foldedMeasures: function() {
      // 每当面板的折叠状态发生变化，就会通知所在的滚动区域，需要重新计算高度
      setTimeout(() => {
        // 之所以要延时发送事件，是为了等待折叠动画结束
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    },
    foldedMeasuresStatus: function(newFoldedMeasuresStatus) {

      this.foldedMeasures = newFoldedMeasuresStatus;
    },
    foldedEvents: function() {
      // 每当面板的折叠状态发生变化，就会通知所在的滚动区域，需要重新计算高度
      setTimeout(() => {
        // 之所以要延时发送事件，是为了等待折叠动画结束
        Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      }, 300);
    },
    foldedEventsStatus: function(newFoldedEventsStatus) {
      this.foldedEvents = newFoldedEventsStatus;
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 160px;
@scroll-bar-height: 10px;
@unit-width: 54px;
@computed-cell-color: lighten(@font-color, 55%);

.medicine-adverse-event-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .medicine-adverse-event-modal {
    position: relative;
    margin: 10px auto;
    top: 5%;
    width: 660px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
    .medicine-adverse-event {
      position: relative;
      top: -5px;
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
        margin-bottom: -5px;
      }
      .table {
        margin-bottom: 15px;
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
            width: 5%;
            border: 1px solid @light-gray-color;
            .required-mark {
              position: absolute;
              right: 0px;
              top: 8px;
              color: red;
              font-size: 25px;
              vertical-align: middle;
            }
            .el-radio__label {
              font-size: 0;
            }
            &.col-width-10 {
              width: 10%;
              letter-spacing: 1px;
              padding: 5px 0;
            }
            &.col-width-15 {
              width: 15%;
              letter-spacing: 1px;
              padding: 5px 0;
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
                right: -7px;
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
