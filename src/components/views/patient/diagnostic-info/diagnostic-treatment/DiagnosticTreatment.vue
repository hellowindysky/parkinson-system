<template lang="html">
  <folding-panel :title="'治疗方案'" :mode="mutableMode"  v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-surgery" ref="diagnosticSurgery">
      <extensible-panel class="panel medicine-panel" :mode="mutableMode"
        :title="medicineTitle"
        v-on:addNewCard="addMedicine"
        :editable="canEdit"
        v-if="showMedicinePanel">
        <card class="card medicine-card" :class="smallCardWidth" :mode="mutableMode"
          v-for="(item, index) in diagnosticMedicine"
          :key="'diagnosticMedicine'+index"
          :title="getMedicineTitle(item.medicineId)"
          :disable-delete="item.statusFlag===0"
          v-on:editCurrentCard="editMedicine(item)"
          v-on:deleteCurrentCard="deleteMedicine(item)"
          v-on:viewCurrentCard="viewMedicine(item)">
          <div class="text line-1">
            <span class="name">用药频率</span>
            <span class="value">{{transformMedicineField(item, 'usages')}}</span>
          </div>
          <div class="text line-2">
            <span class="name">首次用药</span>
            <span class="value">{{transformMedicineField(item, 'firMedFlag')}}</span>
          </div>
          <div class="text line-3">
            <span class="name">停药原因</span>
            <span class="value">{{transformMedicineField(item, 'stopReason')}}</span>
          </div>
          <div class="text line-4">
            <span class="name">副反应类型</span>
            <span class="value">{{transformMedicineField(item, 'sideeffectType')}}</span>
          </div>
          <div class="text line-5">
            <span class="name">处方性质</span>
            <span class="value">{{getPrescriptionDesc(item.statusFlag)}}</span>
          </div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel surgery-panel" :mode="mutableMode" v-if="showSurgeryPanel"
        :title="surgeryTitle" v-on:addNewCard="addTreatmentRecord" :editable="canEdit">
        <card class="card surgery-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in preEvaluationList"
          :key="'preEvaluation'+index"
          :title="'术前评估'"
          v-on:editCurrentCard="editPreEvaluationRecord(item)"
          v-on:viewCurrentCard="viewPreEvaluationRecord(item)"
          v-on:deleteCurrentCard="deletePreEvaluationRecord(item)">
          <div class="text line-1">
            <span class="name">剂末现象</span>
            <span class="value">{{item.terminalDesc}}</span>
          </div>
          <div class="text line-2">
            <span class="name">患者日记</span>
            <span class="value">{{item.diaryDesc}}</span>
          </div>
          <div class="text line-3">
            <span class="name">统一异动症</span>
            <span class="value">{{item.dyskinesiaDesc}}</span>
          </div>
          <div class="text line-4">
            <span class="name">非运动症状</span>
            <span class="value">{{item.nonMotorDesc}}</span>
          </div>
          <div class="text line-5">
            <span class="name">运动症状</span>
            <span class="value">{{item.motorDesc}}</span>
          </div>
          <div class="text line-6">
            <span class="name">手术意愿</span>
            <span class="value">{{item.intensionDesc}}</span>
          </div>
          <div class="text line-7">
            <span class="name">评估时间</span>
            <span class="value">{{item.preopsTime}}</span>
          </div>
        </card>
        <card class="card surgery-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in surgicalMethodList"
          :key="'surgicalMethod'+index"
          :title="'手术方案'"
          v-on:editCurrentCard="editSurgicalRecord(item)"
          v-on:deleteCurrentCard="deleteSurgicalRecord(item)"
          v-on:viewCurrentCard="viewSurgicalRecord(item)">
          <div class="text line-1">
            <span class="name">手术类型</span>
            <span class="value">{{transformSurgicalType(item.surgicalInfoId)}}</span>
          </div>
          <div class="text line-2 single-line-ellipsis">
            <span class="name">备注</span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text line-3">
            <span class="name">手术时间</span>
            <span class="value">{{item.surgicalDate}}</span>
          </div>
        </card>
        <card class="card surgery-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in postComplicationList"
          :key="'postComplication'+index"
          :title="'术后并发症'"
          v-on:editCurrentCard="editPostComplicationRecord(item)"
          v-on:deleteCurrentCard="deletePostComplicationRecord(item)"
          v-on:viewCurrentCard="viewPostComplicationRecord(item)">
          <div class="text line-1">
            <span class="name">并发症细类</span>
            <span class="value">{{transformComplicationType(item.minorComplicationType)}}</span>
          </div>
          <div class="text line-2">
            <span class="name">处理</span>
            <span class="value">{{transformTypeGroupId(item.treatment, 'treatment')}}</span>
          </div>
          <div class="text line-3 single-line-ellipsis">
            <span class="name">备注</span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text line-4">
            <span class="name">出现时间</span>
            <span class="value">{{item.occurrenceTime}}</span>
          </div>
        </card>
        <card class="card surgery-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in dbsFirstList"
          :key="'dbsFirst'+index"
          :title="'程控记录'" v-on:editCurrentCard="editDbsRecord(item)"
          v-on:deleteCurrentCard="deleteDbsRecord(item)"
          v-on:viewCurrentCard="viewDbsRecord(item)">
          <div class="text line-1">
            <span class="name">首次开机</span>
            <span class="value">{{item.dbsTimes}}</span>
          </div>
          <div class="text line-2">
            <span class="name">开机参数</span>
            <br>
            <span class="value higher">{{item.dbsParam.split('$')[0]}}</span>
            <br>
            <span class="value higher">{{item.dbsParam.split('$')[1]}}</span>
          </div>
          <div class="text line-6 single-line-ellipsis">
            <span class="name">备注</span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text line-7">
            <span class="name">记录时间</span>
            <span class="value">{{item.programDate}}</span>
          </div>
        </card>
        <card class="card surgery-card" :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in dbsFollowList"
          :key="'dbsFollow'+index"
          :title="'程控记录'"
          v-on:editCurrentCard="editDbsRecord(item)"
          v-on:viewCurrentCard="viewDbsRecord(item)"
          v-on:deleteCurrentCard="deleteDbsRecord(item)">
          <div class="text line-1">
            <span class="name">首次开机</span>
            <span class="value">{{item.dbsTimes}}</span>
          </div>
          <div class="text line-2">
            <span class="name">最后参数</span>
            <br>
            <span class="value higher">{{item.dbsParam.split('$')[0]}}</span>
            <br>
            <span class="value higher">{{item.dbsParam.split('$')[1]}}</span>
          </div>
          <div class="text line-6 single-line-ellipsis">
            <span class="name">备注</span>
            <span class="value">{{item.remarks}}</span>
          </div>
          <div class="text line-7">
            <span class="name">记录时间</span>
            <span class="value">{{item.programDate}}</span>
          </div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel physiontherapy-panel"
        v-if="showPhysiontherapy || showTreatmentEvaluation || showAdverseEvent"
        :mode="mutableMode" :title="physiontherapyTitle"
        v-on:addNewCard="addPhysiontherapyRecord" :editable="canEdit">
        <card class="card physiontherapy-card" :class="bigCardWidth"
          :mode="mutableMode"
          v-for="(item, index) in diagnosticPhysiontherapy"
          :key="'diagnosticPhysiontherapy'+index"
          :title="transformPhysiType(item.physiType)"
          v-on:editCurrentCard="editPhysiontherapy(item)"
          v-on:deleteCurrentCard="deletePhysiontherapy(item)"
          v-on:viewCurrentCard="viewPhysiontherapy(item)">
          <div class="text line-1">
            <span class="name">治疗前阈值</span>
            <span class="value">左{{item.leftThresholdBefore}}，右{{item.rightThresholdBefore}}</span>
          </div>
          <div class="text line-2">
            <span class="name">治疗后阈值</span>
            <span class="value">左 {{item.leftThresholdAfter ? item.leftThresholdAfter : '-'}}，右 {{item.rightThresholdAfter ? item.rightThresholdAfter : '-' }}</span>
          </div>
          <div class="text line-3" v-if="item.reactionFlag=== 1">
            <span class="name">不良反应</span>
            <span class="value">{{'无'}}</span>
          </div>
          <div class="text line-3" v-else="item.reactionFlag=== 0">
            <span class="name">不良反应</span>
            <span class="value">{{getReaction(item.patientPhytheReaction)}}</span>
          </div>
          <div class="text line-4">
            <span class="name">记录时间</span>
            <span class="value">{{item.recordDate}}</span>
          </div>
        </card>

        <card class="card physiontherapy-card"
          :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in diagnosticTreatmentEvaluation"
          :key="'diagnosticTreatmentEvaluation'+index"
          :title="'治疗评估'" v-on:editCurrentCard="editTreatmentEvaluation(item)"
          v-on:deleteCurrentCard="deleteTreatmentEvaluation(item)"
          v-on:viewCurrentCard="viewTreatmentEvaluation(item)">
          <div class="text line-1" v-if="item.situationType === 1">
            <span class="name">治疗后阈值</span>
            <span class="value">左 {{item.leftThreshold}}，右 {{item.rightThreshold}}</span>
          </div>
          <div class="text line-1" v-if="item.situationType === 2">
            <span class="name">治疗后情况描述</span>
            <span class="value">{{item.situationRemark}}</span>
          </div>
          <div class="text line-2" v-if="item.reactionFlag === 1">
            <span class="name">不良反应</span>
            <span class="value">{{'无'}}</span>
          </div>
          <div class="text line-2" v-else="item.reactionFlag === 0">
            <span class="name">不良反应</span>
            <span class="value">{{getReaction(item.patientPhytheReaction)}}</span>
          </div>
          <div class="text line-3">
            <span class="name">记录时间</span>
            <span class="value">{{item.recordDate}}</span>
          </div>
        </card>
        <card class="card adverse-event-card"
          :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in diagnosticAdverseEvent"
          :key="'diagnosticAdverseEvent'+index"
          :title="'不良事件'" v-on:editCurrentCard="editAdverseEvent(item)"
          v-on:deleteCurrentCard="deleteAdverseEvent(item)"
          v-on:viewCurrentCard="viewAdverseEvent(item)">
          <div class="text line-1">
            <span class="name">事件名称</span>
            <span class="value">{{item.adverseName}}</span>
          </div>
          <div class="text line-2">
            <span class="name">发生时间</span>
            <span class="value">{{item.occurTime}}</span>
          </div>
          <div class="text line-3">
            <span class="name">不良事件程度</span>
            <span class="value">{{transform(item.severity, 'adverseSeverity')}}</span>
          </div>
          <div class="text line-4">
            <span class="name">转归</span>
            <span class="value">{{transform(item.outCome, 'outCome')}}</span>
          </div>
          <div class="text line-5">
            <span class="name">纠正治疗</span>
            <span class="value">{{item.correctFlag == 1 ? '是' : '否'}}</span>
          </div>
        </card>
        <card class="card adverse-event-card"
          :class="bigCardWidth" :mode="mutableMode"
          v-for="(item, index) in diagnosticSeriousAdverseEvent"
          :key="'diagnosticSeriousAdverseEvent'+index"
          :title="'严重不良事件'" v-on:editCurrentCard="editSeriousAdverseEvent(item)"
          v-on:deleteCurrentCard="deleteSeriousAdverseEvent(item)"
          v-on:viewCurrentCard="viewSeriousAdverseEvent(item)">
          <div class="text line-1">
            <span class="name">事件名称</span>
            <span class="value">{{item.adverseName}}</span>
          </div>
          <div class="text line-2">
            <span class="name">发生时间</span>
            <span class="value">{{item.saeAccurDate}}</span>
          </div>
          <div class="text line-3">
            <span class="name">SAE情况</span>
            <span class="value">{{item.saeSituation}}</span>
          </div>
          <div class="text line-4">
            <span class="name">转归</span>
            <span class="value">{{transform(item.outCome, 'outComeSerious')}}</span>
          </div>
          <div class="text line-5">
            <span class="name">SAE报告</span>
            <span class="value">国内({{transform(item.domesticSituation, 'saeReportSituation')}}),国外({{transform(item.abroadSituation, 'saeReportSituation')}}）</span>
          </div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import {
  deleteSeriousAdverseEvent,
  deleteAdverseEvent,
  deleteTreatmentEvaluation,
  deletePhysiontherapy,
  deletePatientMedicine,
  deletePreEvaluation,
  deleteSurgicalMethod,
  deleteOperativeCompliation,
  deleteDbsFirstInfo,
  deleteDbsFollowInfo } from 'api/patient.js';

import FoldingPanel from 'public/folding-panel/FoldingPanel';
import ExtensiblePanel from 'public/extensible-panel/ExtensiblePanel';
import Card from 'public/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      smallCardWidth: '',
      bigCardWidth: '',
      superBigCardWidth: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    diagnosticMedicine: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosticSurgery: {
      type: Object,
      default: () => {
        return {};
      }
    },
    diagnosticPhysiontherapy: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosticTreatmentEvaluation: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosticAdverseEvent: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosticSeriousAdverseEvent: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosisCreator: {
      type: String,
      default: ''
    },
    diagnosticExperimentStep: {
      type: Number,
      default: 0
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'medicineInfo',
      'medicineDictionary',
      'medicineStopReason',
      'surgicalTypeList',
      'complicationTypeList',
      'typeGroup'
    ]),
    medicineTitle() {
      var count = this.diagnosticMedicine.length;
      var ledd = Number(this.calcTotalLevodopaDoseOfAllOtherMedicine({}).toFixed(5));
      return '药物治疗' + '（' + count + '条记录） LEDD: ' + ledd + ' mg';
    },
    surgeryTitle() {
      var count = this.preEvaluationList.length + this.surgicalMethodList.length +
        this.postComplicationList.length + this.dbsFirstList.length + this.dbsFollowList.length;
      return '手术治疗' + '（' + count + '条记录）';
    },
    preEvaluationTitle() {
      return '术前评估（' + this.preEvaluationList.length + '条记录）';
    },
    surgicalMethodTitle() {
      return '手术方案（' + this.surgicalMethodList.length + '条记录）';
    },
    postComplicationTitle() {
      return '术后并发症（' + this.postComplicationList.length + '条记录）';
    },
    dbsTitle() {
      var amount = this.dbsFirstList.length + this.dbsFollowList.length;
      return '程控记录（' + amount + '条记录）';
    },
    physiontherapyTitle() {
      var totalCount = this.diagnosticPhysiontherapy.length + this.diagnosticTreatmentEvaluation.length + this.diagnosticAdverseEvent.length + this.diagnosticSeriousAdverseEvent.length;
      return '物理治疗（' + totalCount + '条记录）';
    },
    preEvaluationList() {
      return this.diagnosticSurgery.patientPreopsList ? this.diagnosticSurgery.patientPreopsList : [];
    },
    surgicalMethodList() {
      return this.diagnosticSurgery.patientTreatmentList ? this.diagnosticSurgery.patientTreatmentList : [];
    },
    postComplicationList() {
      return this.diagnosticSurgery.patientComplicationList ? this.diagnosticSurgery.patientComplicationList : [];
    },
    dbsFirstList() {
      return this.diagnosticSurgery.patientDbsFirstList ? this.diagnosticSurgery.patientDbsFirstList : [];
    },
    dbsFollowList() {
      return this.diagnosticSurgery.patientDbsFollowList ? this.diagnosticSurgery.patientDbsFollowList : [];
    },
    isMyPatientsList() {
      return this.$route.matched.some(record => record.meta.myPatients);
    },
    isExperimentPatientsList() {
      return this.$route.matched.some(record => {
        return record.meta.therapistsPatients || record.meta.appraisersPatients;
      });
    },
    diagnosisDuringExperiment() {
      return [this.EXPERIMENT_STEP_SCREENING, this.EXPERIMENT_STEP_THERAPY,
        this.EXPERIMENT_STEP_FOLLOW_UP].indexOf(this.diagnosticExperimentStep) >= 0;
    },
    showMedicinePanel() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_SCREENING &&
        this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_FOLLOW_UP;
      if (this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    },
    showSurgeryPanel() {
      if (this.diagnosisDuringExperiment) {
        return false;
      } else {
        return true;
      }
    },
    showPhysiontherapy() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_THERAPY;
      if (this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    },
    showTreatmentEvaluation() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_FOLLOW_UP;
      if (this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    },
    showAdverseEvent() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_THERAPY &&
        this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_FOLLOW_UP;
      if (this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    },
    showSeriousAdverseEvent() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_THERAPY &&
        this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_FOLLOW_UP;
      if (this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
    },
    getMedicine(medicineId) {
      // 根据药物 id，在相应的 tableData 里面寻找对应的 药物详情
      return Util.getElement('medicineId', medicineId, this.medicineInfo);
    },
    transformMedicineField(item, fieldName) {
      var dictionaryField = Util.getElement('fieldName', fieldName, this.medicineDictionary);
      if (fieldName === 'stopReason') {
        var reason = Util.getElement('id', item[fieldName], this.medicineStopReason);
        return reason.stopReason;

      } else {
        var typeInfo = Util.getElement('typegroupcode', dictionaryField.fieldEnumId, this.typeGroup);
        var types = typeInfo.types ? typeInfo.types : [];
        var matchedType = Util.getElement('typeCode', item[fieldName], types);
        return matchedType.typeName ? matchedType.typeName : '';
      }
    },
    getReaction(reactionList) {
      var arr = [];
      for (let reaction of reactionList) {
        if (Number(reaction.severityLevel) > 1) {
          let reactionText = this.transformTypeGroupId(reaction.reactionType, 'reactionType');
          arr.push(reactionText);
        }
      }
      return arr.join(',');
    },
    getPrescriptionDesc(statusFlag) {
      if (statusFlag === 0) {
        return '沿用上次处方';
      } else if (statusFlag === 1) {
        return '增加用药';
      } else {
        return '';
      }
    },
    getMedicineTitle(medicineId) {
      // 根据药物 id，在相应的 tableData 里面寻找对应的 药物详情
      var medicine = Util.getElement('medicineId', medicineId, this.medicineInfo);
      return medicine.medicineName + '(' + medicine.commonName + ')';
    },
    calcTotalLevodopaDoseOfAllOtherMedicine(targetMedicine) {
      var totalLevodopaDose = 0;
      for (let item of this.diagnosticMedicine) {
        // 用来计算的药物要满足 2 个条件：未停药，不是当前药物
        if (item.stopFlag === 1 && item.medicineId !== targetMedicine.medicineId) {
          totalLevodopaDose += item.levodopaDose;
        }
      }
      return totalLevodopaDose;
    },
    checkIfComtExistsAmongOtherMedicine(targetMedicine) {
      // 遍历其它所有未停药的药物，看是否存在 COMT 抑制剂
      var hasCOMT = false;
      for (let item of this.diagnosticMedicine) {
        var medicineInfoObj = Util.getElement('medicineId', item.medicineId, this.medicineInfo);
        if (item.stopFlag === 1 && item.medicineId !== targetMedicine.medicineId &&
          medicineInfoObj.medicalType === 3) {
          hasCOMT = true;
        }
      }
      return hasCOMT;
    },
    transformSurgicalType(typeId) {
      // 在 tableData 中找到对应的值
      // 下面的 surgica 拼写掉了一个 l，是数据库的拼写错误，这里只能将错就错
      var surgicalData = Util.getElement('id', typeId, this.surgicalTypeList);
      var surgicalName = surgicalData.surgicaName ? surgicalData.surgicaName : '';
      return surgicalName;
    },
    transformComplicationType(typeId) {
      // 在 tableData 中找到对应的值
      var complicationData = Util.getElement('id', typeId, this.complicationTypeList);
      var complicationName = complicationData.minorComplicationName ? complicationData.minorComplicationName : '';
      return complicationName;
    },
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    transformTypeGroupId(typeId, fieldName) {
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types === undefined ? [] : types;
      var typeName = Util.getElement('typeCode', typeId, types).typeName;
      return typeName === undefined ? '' : typeName;
    },
    addMedicine() {
      var hasCOMT = this.checkIfComtExistsAmongOtherMedicine({});
      var showEdit = this.canEdit && this.showMedicinePanel;
      // Bus.$emit(this.SHOW_MEDICINE_MODAL, this.ADD_NEW_CARD, {}, showEdit, hasCOMT);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'medicineModal', this.SHOW_MEDICINE_MODAL, this.ADD_NEW_CARD, {}, showEdit, hasCOMT);
    },
    viewMedicine(item) {
      var hasCOMT = this.checkIfComtExistsAmongOtherMedicine(item);
      var showEdit = this.canEdit && this.showMedicinePanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'medicineModal', this.SHOW_MEDICINE_MODAL, this.VIEW_CURRENT_CARD, item, showEdit, hasCOMT);
    },
    editMedicine(item) {
      var hasCOMT = this.checkIfComtExistsAmongOtherMedicine(item);
      var showEdit = this.canEdit && this.showMedicinePanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'medicineModal', this.SHOW_MEDICINE_MODAL, this.EDIT_CURRENT_CARD, item, showEdit, hasCOMT);
    },
    deleteMedicine(item) {
      var patientMedicine = {
        patientId: parseInt(this.$route.params.id, 10),
        patientCaseId: this.$route.params.caseId,
        patientMedicineId: item.patientMedicineId
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientMedicine(patientMedicine).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addTreatmentRecord() {
      var list = [
        {
          text: '术前评估',
          callback: this.addPreEvaluationRecord
        },
        {
          text: '手术方案',
          callback: this.addSurgicalRecord
        },
        {
          text: '术后并发症',
          callback: this.addPostComplicationRecord
        },
        {
          text: '程控记录',
          callback: this.addDbsRecord
        }
      ];
      Bus.$emit(this.SHOW_CHOICE_PANEL, list);
    },
    addPreEvaluationRecord() {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      // Bus.$emit(this.SHOW_PRE_EVALUATION_MODAL, this.ADD_NEW_CARD, {}, showEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'preEvaluationModal', this.SHOW_PRE_EVALUATION_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewPreEvaluationRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'preEvaluationModal', this.SHOW_PRE_EVALUATION_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editPreEvaluationRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'preEvaluationModal', this.SHOW_PRE_EVALUATION_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deletePreEvaluationRecord(item) {
      var preEvaluation = {
        'preopsInfoId': item.preopsInfoId
      };
      Bus.$on(this.CONFIRM, () => {
        deletePreEvaluation(preEvaluation).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addSurgicalRecord() {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      // Bus.$emit(this.SHOW_SURGICAL_METHOD_MODAL, this.ADD_NEW_CARD, {}, showEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'surgicalMethodModal', this.SHOW_SURGICAL_METHOD_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewSurgicalRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'surgicalMethodModal', this.SHOW_SURGICAL_METHOD_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editSurgicalRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'surgicalMethodModal', this.SHOW_SURGICAL_METHOD_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deleteSurgicalRecord(item) {
      var surgicalMethod = {
        'patientTreatmentId': item.patientTreatmentId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteSurgicalMethod(surgicalMethod).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addPostComplicationRecord() {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      // Bus.$emit(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.ADD_NEW_CARD, {}, showEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'operativeComplicationModal', this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewPostComplicationRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'operativeComplicationModal', this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editPostComplicationRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'operativeComplicationModal', this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deletePostComplicationRecord(item) {
      var operativeComplication = {
        'patientComplicationId': item.patientComplicationId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteOperativeCompliation(operativeComplication).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addDbsRecord() {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'dbsModal', this.SHOW_DBS_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewDbsRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'dbsModal', this.SHOW_DBS_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editDbsRecord(item) {
      var showEdit = this.canEdit && this.showSurgeryPanel;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'dbsModal', this.SHOW_DBS_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deleteDbsRecord(item) {
      // 先判断这条程控记录是首次还是非首次，从而决定调用哪个 api
      if (item.patientDbsFirstId) {
        let dbsFirstInfo = {
          'patientDbsFirstId': item.patientDbsFirstId
        };
        Bus.$on(this.CONFIRM, () => {
          deleteDbsFirstInfo(dbsFirstInfo).then(this._resolveDeletion, this._rejectDeletion);
        });

      } else if (item.patientDbsFollowId) {
        let dbsFollowInfo = {
          'patientDbsFollowId': item.patientDbsFollowId
        };
        Bus.$on(this.CONFIRM, () => {
          deleteDbsFollowInfo(dbsFollowInfo).then(this._resolveDeletion, this._rejectDeletion);
        });
      } else {
        return;
      }
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    transformPhysiType(physiType) {
      var types = Util.getElement('typegroupcode', 'physiType', this.typeGroup).types;
      var typeName = Util.getElement('typeCode', physiType, types).typeName;
      return typeName ? typeName : '';
    },
    addPhysiontherapyRecord() {
      var list = [];
      if (this.showPhysiontherapy) {
        list.push({
          text: '物理疗法',
          callback: this.addPhysiontherapy
        });
      }
      if (this.showTreatmentEvaluation) {
        list.push({
          text: '治疗评估',
          callback: this.addTreatmentEvaluation
        });
      }
      if (this.showAdverseEvent) {
        list.push({
          text: '不良事件',
          callback: this.addAdverseEvent
        });
      }
      // if (this.showSeriousAdverseEvent) {
      //   list.push({
      //     text: '严重不良事件',
      //     callback: this.addSeriousAdverseEvent
      //   });
      // }
      Bus.$emit(this.SHOW_CHOICE_PANEL, list);
    },
    addPhysiontherapy() {
      var showEdit = this.canEdit && this.showPhysiontherapy;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'physiontherapyModal', this.SHOW_PHYSIONTHERAPY_MODAL, this.ADD_NEW_CARD, {}, showEdit, this.diagnosticExperimentStep);
    },
    viewPhysiontherapy(item) {
      var showEdit = this.canEdit && this.showPhysiontherapy;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'physiontherapyModal', this.SHOW_PHYSIONTHERAPY_MODAL, this.VIEW_CURRENT_CARD, item, showEdit, this.diagnosticExperimentStep);
    },
    editPhysiontherapy(item) {
      var showEdit = this.canEdit && this.showPhysiontherapy;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'physiontherapyModal', this.SHOW_PHYSIONTHERAPY_MODAL, this.EDIT_CURRENT_CARD, item, showEdit, this.diagnosticExperimentStep);
    },
    deletePhysiontherapy(item) {
      var patientPhysiontherapy = {
        patientPhytheTmsId: item.patientPhytheTmsId
      };
      Bus.$on(this.CONFIRM, () => {
        deletePhysiontherapy(patientPhysiontherapy).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addTreatmentEvaluation() {
      var showEdit = this.canEdit && this.showTreatmentEvaluation;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'treatmentEvaluationModal', this.SHOW_TREATMENT_EVALUATION_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewTreatmentEvaluation(item) {
      var showEdit = this.canEdit && this.showTreatmentEvaluation;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'treatmentEvaluationModal', this.SHOW_TREATMENT_EVALUATION_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editTreatmentEvaluation(item) {
      var showEdit = this.canEdit && this.showTreatmentEvaluation;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'treatmentEvaluationModal', this.SHOW_TREATMENT_EVALUATION_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deleteTreatmentEvaluation(item) {
      var patientTreatmentEvaluation = {
        patientPhytheAssessId: item.patientPhytheAssessId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteTreatmentEvaluation(patientTreatmentEvaluation).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addAdverseEvent() {
      var showEdit = this.canEdit && this.showAdverseEvent;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'adverseEventModal', this.SHOW_ADVERSE_EVENT_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewAdverseEvent(item) {
      var showEdit = this.canEdit && this.showAdverseEvent;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'adverseEventModal', this.SHOW_ADVERSE_EVENT_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editAdverseEvent(item) {
      var showEdit = this.canEdit && this.showAdverseEvent;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'adverseEventModal', this.SHOW_ADVERSE_EVENT_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deleteAdverseEvent(item) {
      var patientAdverseEvent = {
        patientAdverseId: item.patientAdverseId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteAdverseEvent(patientAdverseEvent).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addSeriousAdverseEvent() {
      var showEdit = this.canEdit && this.showSeriousAdverseEvent;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'seriousAdverseEventModal', this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL, this.ADD_NEW_CARD, {}, showEdit);
    },
    viewSeriousAdverseEvent(item) {
      var showEdit = this.canEdit && this.showSeriousAdverseEvent;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'seriousAdverseEventModal', this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL, this.VIEW_CURRENT_CARD, item, showEdit);
    },
    editSeriousAdverseEvent(item) {
      var showEdit = this.canEdit && this.showSeriousAdverseEvent;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'seriousAdverseEventModal', this.SHOW_SERIOUS_ADVERSE_EVENT_MODAL, this.EDIT_CURRENT_CARD, item, showEdit);
    },
    deleteSeriousAdverseEvent(item) {
      var patientSeriousAdverseEvent = {
        patientAdverseSeriousId: item.patientAdverseSeriousId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteSeriousAdverseEvent(patientSeriousAdverseEvent).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticSurgery.clientWidth;
        var smallCardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (smallCardNum + 1) > 200 + 20 && smallCardNum < 10) {
          smallCardNum += 1.0;
        }
        this.smallCardWidth = 'width-1-' + parseInt(smallCardNum, 10);

        var bigCardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，350px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (bigCardNum + 1) > 350 + 20 && bigCardNum < 10) {
          bigCardNum += 1.0;
        }
        this.bigCardWidth = 'width-1-' + parseInt(bigCardNum, 10);

        var superBigCardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，450px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (superBigCardNum + 1) > 450 + 20 && superBigCardNum < 10) {
          superBigCardNum += 1.0;
        }
        this.superBigCardWidth = 'width-1-' + parseInt(superBigCardNum, 10);
      });
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    // 如果收到 [确认对话框] 发过来的 “取消” 事件，则解除 “确认” 事件的回调函数
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });

    // 如果收到屏幕宽度变化，或者内容区域宽度变化的事件，则重新计算卡片的宽度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();

    setTimeout(() => {
      // console.log(this.diagnosticSurgery);
    }, 2000);
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@medicine-card-height: 175px;
@surgery-card-height: 225px;
@physiontherapy-card-height: 150px;
@adverse-event-card-height: 180px;

.diagnostic-surgery {
  .panel {
    text-align: left;
    &.medicine-panel .content {
      height: @medicine-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    &.surgery-panel .content {
      height: @surgery-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    &.physiontherapy-panel .content {
      height: @adverse-event-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    .card {
      display: inline-block;
      position: relative;
      margin: @card-vertical-margin @card-horizontal-margin;
      // min-width: 200px;
      // max-width: 250px;
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{card-horizontal-margin} * 2");
      }
      &.medicine-card {
        height: @medicine-card-height;
      }
      &.surgery-card {
        height: @surgery-card-height;
      }
      &.physiontherapy-card {
        height: @adverse-event-card-height;
      }
      &.adverse-event-card {
        height: @adverse-event-card-height;
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
        left: 10px;
        right: 10px;
        &.single-line-ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
        }
        .name {
          padding-right: 10px;
          color: @font-color;
        }
        .value {
          color: @light-font-color;
          &.higher {
            line-height: 17px;
          }
        }
      }
      .first-line {
        top: 50px;
      }
      .second-line {
        top: 75px;
      }
      .third-line {
        top: 100px;
      }
      .line-1 {
        top: 50px;
      }
      .line-2 {
        top: 75px;
      }
      .line-3 {
        top: 100px;
      }
      .line-4 {
        top: 125px;
      }
      .line-5 {
        top: 150px;
      }
      .line-6 {
        top: 175px;
      }
      .line-7 {
        top: 200px;
      }
    }
  }
}
</style>
