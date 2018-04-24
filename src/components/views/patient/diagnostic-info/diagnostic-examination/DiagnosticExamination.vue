<template lang="html">
  <folding-panel :title="'检验检查'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-examination" ref="diagnosticExamination">
    <extensible-panel class="panel vital-signs-panel" :mode="mutableMode"
      :title="vitalSignsTitle" v-on:addNewCard="addVitalSigns" :editable="canEdit">
        <card class="card vitalSigns-card"
          :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in diagnosticVitalSigns"
          :key="'diagnosticVitalSigns' + index"
          :title="item.title" v-on:editCurrentCard="editVitalSigns(item)"
          v-on:deleteCurrentCard="deleteVitalSigns(item)"
          v-on:viewCurrentCard="viewVitalSigns(item)">
          <div class="text line-1">
            <span class="name">检查时间</span>
            <span class="value">{{item.checkTime}}</span>
          </div>
          <div class="text line-2">
            <span class="name">呼吸 (次/分)</span>
            <span class="value">{{item.breathing}}</span>
          </div>
          <div class="text line-3">
            <span class="name">体温 (℃)</span>
            <span class="value">{{item.temperature}}</span>
          </div>
          <div class="text line-4">
            <span class="name">脉搏 (次/分)</span>
            <span class="value">{{item.pulse}}</span>
          </div>
           <div class="text line-5">
            <span class="name">心率情况</span>
            <span class="value">{{transform(item.rhythm, 'rhythm')}}</span>
          </div>
         </card>
      </extensible-panel>
      <!-- 体格检查 -->
      <extensible-panel class="panel"
        v-if="showNeurologicCheckRecord || showSiteInspection"
        :mode="mutableMode"
        :title="neurologicCheckTitle"
        v-on:addNewCard="addNeurologicCheck"
        :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in neurologicCheckList"
          :key="'neurologicCheck' + index"
          :title="transform(item.checkType, 'neurologicExam')"
          v-on:editCurrentCard="editNeurologicCheckRecord(item)"
          v-on:deleteCurrentCard="deleteNeurologicCheckRecord(item)"
          v-on:viewCurrentCard="viewNeurologicCheckRecord(item)">
          <div class="text first-line">
            <span class="name">诊断结果</span>
            <span class="value">{{item.spephysicalResult}}</span>
          </div>
          <div class="text second-line">
            <span class="name">诊断时间</span>
            <span class="value">{{item.ariseTime}}</span>
          </div>
         </card>
         <card class="card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in siteInspectionList"
          :key="'siteInspection' + index"
          :title="'部位检查'"
          v-on:editCurrentCard="editSiteInspection(item)"
          v-on:deleteCurrentCard="deleteSiteInspection(item)"
          v-on:viewCurrentCard="viewSiteInspection(item)">
          <div class="text first-line">
            <span class="name">诊断结果</span>
            <span class="value">{{item.spephysicalResult}}</span>
          </div>
          <div class="text second-line">
            <span class="name">诊断时间</span>
            <span class="value">{{item.ariseTime}}</span>
          </div>
         </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="biochemicalExamTitle"
        v-on:addNewCard="addBiochemicalExamRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in biochemicalExamList" :key="'biochemicalExam' + index"
          :title="transformBiochemicalExamType(item.bioexamId)"
          v-on:editCurrentCard="editBiochemicalExamRecord(item)"
          v-on:deleteCurrentCard="deleteBiochemicalExamRecord(item)"
          v-on:viewCurrentCard="viewBiochemicalExamRecord(item)">
          <div class="text first-line">
            <span class="name"></span>
            <span class="value"></span>
          </div>
          <div class="text second-line">
            <span class="name">检查时间</span>
            <span class="value">{{item.checkDate}}</span>
          </div>
        </card>
      </extensible-panel>
      <!-- 基因检查 -->
      <extensible-panel class="panel" :mode="mutableMode" :title="geneCheckTitle"
        v-on:addNewCard="addGeneCheckRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode"
          v-for="(item,index) in geneCheckList"
          :key="'geneCheck' + index"
          :title="item.checkName"
          v-on:editCurrentCard="editGeneCheckRecord(item)"
          v-on:deleteCurrentCard="deleteGeneCheckRecord(item)"
          v-on:viewCurrentCard="viewGeneCheckRecord(item)">
          <div class="text first-line">
            <span class="name">检查结果</span>
            <span class="value">{{item.checkResult}}</span>
          </div>
          <div class="text second-line">
            <span class="name">检查时间</span>
            <span class="value">{{item.checkDate}}</span>
          </div>
         </card>
      </extensible-panel>
      <extensible-panel class="panel neuroelectric-panel" :mode="mutableMode"
        :title="neuroelectricTitle" v-on:addNewCard="addNeuroelectricRecordRecord"
        :editable="canEdit">
        <card class="card neuroelectric-card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in emgList" :key="'emg' + index" :title="item.etgName"
          v-on:editCurrentCard="editNeuroelectricRecord(item)"
          v-on:viewCurrentCard="viewNeuroelectricRecord(item)"
          v-on:deleteCurrentCard="deleteNeuroelectricRecord(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span class="value">{{transform(item.etgType, 'eleType')}}</span>
          </div>
          <div class="text second-line">
            <span class="name">结果</span>
            <span class="value">{{item.patEleResule}}</span>
          </div>
        </card>
        <card class="card neuroelectric-card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in sleepMonitoringList" :key="'sleepMonitoring' + index"
          :title="transform(item.elecExamType, 'elecExam')"
          v-on:editCurrentCard="editNeuroelectricRecord(item)" v-on:viewCurrentCard="viewNeuroelectricRecord(item)"
          v-on:deleteCurrentCard="deleteSleepMonitoringRecord(item)">
          <div class="text first-line">
            <span class="name">RDI</span>
            <span class="value">{{getRDI(item)}}</span>
          </div>
          <div class="text second-line">
            <span class="name">睡眠效率</span>
            <span class="value">{{getSleepEfficiency(item)}}</span>
          </div>
          <div class="text third-line">
            <span class="name">检查结果</span>
            <span class="value">{{item.examResult}}</span>
          </div>
          <div class="text fourth-line">
            <span class="name">记录开始</span>
            <span class="value">{{item.recordStart}}</span>
          </div>
        </card>
        <card class="card neuroelectric-card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in electricImagingList" :key="'electricImagin' + index"
          :title="transform(item.imageType, 'elecExam')"
          v-on:editCurrentCard="editNeuroelectricRecord(item)"
          v-on:viewCurrentCard="viewNeuroelectricRecord(item)"
          v-on:deleteCurrentCard="deleteImageRecord(item)">
          <div class="text first-line">
            <span class="name">检查编号</span>
            <span class="value">{{item.checkNum}}</span>
          </div>
          <div class="text second-line">
            <span class="name">检查设备</span>
            <span class="value">{{item.checkDevice}}</span>
          </div>
          <div class="text third-line">
            <span class="name">检查结论</span>
            <span class="value">{{item.checkConclusion}}</span>
          </div>
          <div class="text fourth-line">
            <span class="name">检查日期</span>
            <span class="value">{{item.checkDate}}</span>
          </div>
        </card>
      </extensible-panel>

      <!-- 接入设备监测 -->
      <!-- <extensible-panel class="panel gait-posture-panel" :mode="mutableMode" :title="gaitPostureTitle" v-on:addNewCard="addGaitPosture" :editable="canEdit">
        <card class="card gaitPosture-card" :class="cardWidth" :mode="mutableMode" v-for="(item,idx) in gaitPostureList" :key="idx"
          :title="item.title" v-on:editCurrentCard="editGaitPosture(item)" v-on:viewCurrentCard="viewGaitPosture(item)"
          v-on:deleteCurrentCard="deleteGaitPosture(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span>{{""}}</span>
          </div>
          <div class="text second-line">
            <span class="name">编号</span>
            <span>{{""}}</span>
          </div>
          <div class="text third-line">
            <span class="name">日期</span>
            <span>{{""}}</span>
          </div>
        </card>
      </extensible-panel> -->

      <!-- 医学影像 -->
      <extensible-panel class="panel image-panel" :mode="mutableMode"
        :title="medicalImagingTitle" :editable="canEdit"
        v-on:addNewCard="addImageRecord">
        <card class="card image-card" :class="cardWidth" :mode="mutableMode"
          v-for="(item, index) in medicalImagingList" :key="'medicalImaging' + index"
          :title="item.title"
          v-on:editCurrentCard="editImageRecord(item)"
          v-on:viewCurrentCard="viewImageRecord(item)"
          v-on:deleteCurrentCard="deleteImageRecord(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span class="value">{{transform(item.imageType, 'examType')}}</span>
          </div>
          <div class="text second-line">
            <span class="name">编号</span>
            <span class="value">{{item.checkNum}}</span>
          </div>
          <div class="text third-line">
            <span class="name">日期</span>
            <span class="value">{{item.checkDate}}</span>
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
import { deleteSiteInspection, deleteEmg, deleteBiochemical, deleteNeurologicCheck, deleteSleepMonitoring,
  deleteGeneCheck, deleteImage, deleteVitalSigns} from 'api/patient.js';
// import { vueCopy } from 'utils/helper';

import FoldingPanel from 'public/folding-panel/FoldingPanel';
import ExtensiblePanel from 'public/extensible-panel/ExtensiblePanel';
import Card from 'public/card/Card';

// import imageModal from 'views/modal/image-modal/ImageModal';
export default {
  data() {
    return {
      mutableMode: this.mode,
      cardWidth: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    neurologicCheckList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    siteInspectionList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    geneCheckList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    biochemicalExamList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    emgList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    sleepMonitoringList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    electricImagingList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    gaitPostureList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    medicalImagingList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosticVitalSigns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    patientInfo: {
      tyep: Object,
      default: () => {
        return {};
      }
    },
    diagnosisCreator: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'surgicalTypeList',
      'complicationTypeList',
      'bioexamTypeList',
      'emgTypeList',
      'typeGroup'
    ]),
    hospitalType() {
      return this.$store.state.hospitalType;
    },
    vitalSignsTitle() {
      return '生命体征 (' + this.diagnosticVitalSigns.length + '条记录)';
    },
    neurologicCheckTitle() {
      return '体格检查（' + this.neurologicCheckList.length + this.siteInspectionList.length + '条记录）';
    },
    geneCheckTitle() {
      return '基因检查（' + this.geneCheckList.length + '条记录）';
    },
    biochemicalExamTitle() {
      return '实验室检查（' + this.biochemicalExamList.length + '条记录）';
    },
    neuroelectricTitle() {
      let count = this.emgList.length + this.sleepMonitoringList.length + this.electricImagingList.length;
      return '电生理检查（' + count + '条记录）';
    },
    gaitPostureTitle() {
      return '接入设备监测（' + this.gaitPostureList.length + '条记录）';
    },
    medicalImagingTitle() {
      return '医学影像（' + this.medicalImagingList.length + '条记录）';
    },
    heartRate() {
      var info = Util.getElement('typegroupcode', 'rhythm', this.typeGroup);
      return info.types ? info.types : [];
    },
    heightAndWeight() {
      var info = {};
      info.height = this.patientInfo.height ? this.patientInfo.height : '';
      info.weight = this.patientInfo.weight ? this.patientInfo.weight : '';
      return info;
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
    transformBiochemicalExamType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.bioexamTypeList);
      var name = data.examName ? data.examName : '';
      return name;
    },
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    getRDI(item) {
      return item.patientFieldCode &&
        item.patientFieldCode[3] &&
        item.patientFieldCode[3][11] &&
        item.patientFieldCode[3][11][0] &&
        item.patientFieldCode[3][11][0].fieldValue
        ? item.patientFieldCode[3][11][0].fieldValue : '';
    },
    getSleepEfficiency(item) {
      return item.patientFieldCode &&
        item.patientFieldCode[3] &&
        item.patientFieldCode[3][7] &&
        item.patientFieldCode[3][7][0] &&
        item.patientFieldCode[3][7][0].fieldValue
        ? item.patientFieldCode[3][7][0].fieldValue + '%' : '';
    },
    addNeurologicCheck() {
      var list = [];
      if (this.showNeurologicCheckRecord) {
        list.push({
          text: '神经系统检查',
          callback: this.addNeurologicCheckRecord
        });
      }
      if (this.showSiteInspection) {
        list.push({
          text: '部位检查',
          callback: this.addSiteInspection
        });
      }
      Bus.$emit(this.SHOW_CHOICE_PANEL, list);
    },
    showNeurologicCheckRecord() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_FOLLOW_UP;
      if (this.hospitalType === 1 && this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    },
    showSiteInspection() {
      var atOtherStatus = this.diagnosticExperimentStep !== this.EXPERIMENT_STEP_FOLLOW_UP;
      if (this.hospitalType === 1 && this.isExperimentPatientsList && this.diagnosisDuringExperiment && atOtherStatus) {
        return false;
      } else {
        return true;
      }
    },
    addNeurologicCheckRecord() {
      // Bus.$emit(this.SHOW_NEUROLOGIC_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'neurologicModal', this.SHOW_NEUROLOGIC_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    editNeurologicCheckRecord(item) {
      // Bus.$emit(this.SHOW_NEUROLOGIC_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'neurologicModal', this.SHOW_NEUROLOGIC_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    viewNeurologicCheckRecord(item) {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'neurologicModal', this.SHOW_NEUROLOGIC_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    deleteNeurologicCheckRecord(item) { // 删除神经检查
      let NeuroId = {
        patientSpephysicalId: item.patientSpephysicalId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteNeurologicCheck(NeuroId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addGeneCheckRecord() {
      // Bus.$emit(this.SHOW_GENE_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'geneModal', this.SHOW_GENE_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    editGeneCheckRecord(item) {
      // Bus.$emit(this.SHOW_GENE_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'geneModal', this.SHOW_GENE_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    viewGeneCheckRecord(item) {
      // Bus.$emit(this.SHOW_GENE_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'geneModal', this.SHOW_GENE_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    deleteGeneCheckRecord(item) {
      let geneInfo = {
        patientGeneId: item.patientGeneId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteGeneCheck(geneInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addBiochemicalExamRecord() {
      // Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'biochemicalExamModal', this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    editBiochemicalExamRecord(item) {
      // Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'biochemicalExamModal', this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    viewBiochemicalExamRecord(item) {
      // Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'biochemicalExamModal', this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    deleteBiochemicalExamRecord(item) { // 删除生化指标
      let BiochemicalInfo = {
        patientBioexamId: item.patientBioexamId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteBiochemical(BiochemicalInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addNeuroelectricRecordRecord() {
      // Bus.$emit(this.SHOW_NEUROELECTRIC_MODAL, this.ADD_NEW_CARD, {}, this.canEdit, this.heightAndWeight);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'neuroelectricModal', this.SHOW_NEUROELECTRIC_MODAL, this.ADD_NEW_CARD, {}, this.canEdit, this.heightAndWeight);
    },
    viewNeuroelectricRecord(item) {
      // Bus.$emit(this.SHOW_NEUROELECTRIC_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit, this.heightAndWeight);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'neuroelectricModal', this.SHOW_NEUROELECTRIC_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit, this.heightAndWeight);
    },
    editNeuroelectricRecord(item) {
      // Bus.$emit(this.SHOW_NEUROELECTRIC_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit, this.heightAndWeight);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'neuroelectricModal', this.SHOW_NEUROELECTRIC_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit, this.heightAndWeight);
    },
    deleteNeuroelectricRecord(item) { // 删除肌电图
      let emgInfo = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteEmg(emgInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    deleteSleepMonitoringRecord(item) {
      let sleepMonitoringInfo = {
        patientNerveSleepId: item.patientNerveSleepId
      };
      Bus.$on(this.CONFIRM, () => {
        deleteSleepMonitoring(sleepMonitoringInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addImageRecord() {
      // Bus.$emit(this.SHOW_IMG_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'imageModal', this.SHOW_IMG_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    viewImageRecord(item) {
      // Bus.$emit(this.SHOW_IMG_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'imageModal', this.SHOW_IMG_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    editImageRecord(item) {
      // Bus.$emit(this.SHOW_IMG_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'imageModal', this.SHOW_IMG_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    deleteImageRecord(item) {
      let imageInfo = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteImage(imageInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addSiteInspection() {
      // Bus.$emit(this.SHOW_IMG_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'siteInspectionModal', this.SHOW_SITE_INSPECTION_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    viewSiteInspection(item) {
      // Bus.$emit(this.SHOW_IMG_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'siteInspectionModal', this.SHOW_SITE_INSPECTION_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    editSiteInspection(item) {
      // Bus.$emit(this.SHOW_IMG_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'siteInspectionModal', this.SHOW_SITE_INSPECTION_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    deleteSiteInspection(item) {
      let patientBodypartInfo = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteSiteInspection(patientBodypartInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addVitalSigns() {
      // Bus.$emit(this.SHOW_VITALSIGNS_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'vitalSignsModal', this.SHOW_VITALSIGNS_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    viewVitalSigns(item) {
      // Bus.$emit(this.SHOW_VITALSIGNS_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'vitalSignsModal', this.SHOW_VITALSIGNS_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    editVitalSigns(item) {
      // Bus.$emit(this.SHOW_VITALSIGNS_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'vitalSignsModal', this.SHOW_VITALSIGNS_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    deleteVitalSigns(item) {
      var patientVitalSign = {id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteVitalSigns(patientVitalSign).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    // addGaitPosture() {
    //   // Bus.$emit(this.SHOW_GAITPOSTURE_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    //   Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'gaitPostureModal', this.SHOW_GAITPOSTURE_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    // },
    // viewGaitPosture(item) {
    //   // Bus.$emit(this.SHOW_GAITPOSTURE_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    //   Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'gaitPostureModal', this.SHOW_GAITPOSTURE_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    // },
    // editGaitPosture(item) {
    //   // Bus.$emit(this.SHOW_GAITPOSTURE_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    //   Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'gaitPostureModal', this.SHOW_GAITPOSTURE_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    // },
    // deleteGaitPosture(item) {
    //   var patientGaitPosture = {id: item.id
    //   };
    //   Bus.$on(this.CONFIRM, () => {
    //     deleteGaitPosture(patientGaitPosture).then(this._resolveDeletion, this._rejectDeletion);
    //   });
    //   Bus.$emit(this.REQUEST_CONFIRMATION);
    // },
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
        var panelWidth = this.$refs.diagnosticExamination.clientWidth;
        var cardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (cardNum + 1) > 200 + 20 && cardNum < 10) {
          cardNum += 1.0;
        }
        this.cardWidth = 'width-1-' + parseInt(cardNum, 10);
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

@image-card-height: 130px;
@neuroelectric-card-height: 155px;
@field-item-width: 150px;
@field-height: 45px;
@vitalSigns-card-height: 130px;

.diagnostic-examination {
  .panel {
    text-align: left;
    &.image-panel .content {
      height: @image-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
     &.vital-signs-panel .content {
      height: @image-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    &.neuroelectric-panel .content {
      height: @neuroelectric-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    .card {
      display: inline-block;
      position: relative;
      margin: @card-vertical-margin @card-horizontal-margin;
      &.image-card {
        height: @image-card-height;
      }
      &.neuroelectric-card {
        height: @neuroelectric-card-height;
      }
      &.width-1-1,
      &.width-1-0 {
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
      &.vitalSigns-card {
        height: @vitalSigns-card-height;
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
        left: 10px;
        right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .name {
          color: @font-color;
        }
        .value {
          padding-left: 10px;
          color: @light-font-color;
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
      .fourth-line {
        top: 125px;
      }
      .line-1 {
        top: 10px;
      }
      .line-2 {
        top: 35px;
      }
      .line-3 {
        top: 60px;
      }
      .line-4 {
        top: 85px;
      }
      .line-5 {
        top: 110px;
      }
      .line-6 {
        top: 135px;
      }
      .line-7 {
        top: 160px;
      }
    }
  }
}
</style>
