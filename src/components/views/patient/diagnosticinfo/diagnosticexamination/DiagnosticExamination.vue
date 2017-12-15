<template lang="html">
  <folding-panel :title="'检验检查'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-examination" ref="diagnosticExamination">
    <extensible-panel class="panel vitalSigns-panel" :mode="mutableMode" :title="vitalSignsTitle" v-on:addNewCard="addVitalSigns" :editable="canEdit">
        <card class="card vitalSigns-card" :class="cardWidth" :mode="mutableMode" v-for="item in diagnosticVitalSigns" :key="item.patientVitalSign"
         :title="item.title" v-on:editCurrentCard="editVitalSigns(item)"
         v-on:deleteCurrentCard="deleteVitalSigns(item)" v-on:viewCurrentCard="viewVitalSigns(item)">
          <div class="text line-1">
            <span class="name">检查时间: </span>
            <span class="value">{{item.checkTime}}</span>
          </div>
          <div class="text line-2">
            <span class="name">呼吸（次/分）: </span>
            <span class="value">{{item.breathing}}</span>
          </div>
           <div class="text line-3">
            <span class="name">体温（℃）: </span>
            <span class="value">{{item.temperature}}</span>
          </div>
           <div class="text line-4">
            <span class="name">脉搏（次/分）: </span>
            <span class="value">{{item.pulse}}</span>
          </div>
           <div class="text line-5">
            <span class="name">心率情况: </span>
            <span class="value">{{transformVitalSigns(item.rhythm)}}</span>
          </div>
         </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="neurologicCheckTitle" v-on:addNewCard="addNeurologicCheckRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in neurologicCheckList" :key="item.preopsInfoId"
         :title="transformNeurologicCheckType(item.spephysicalInfo)" v-on:editCurrentCard="editNeurologicCheckRecord(item)"
         v-on:deleteCurrentCard="deleteNeurologicCheckRecord(item)" v-on:viewCurrentCard="viewNeurologicCheckRecord(item)">
          <div class="text first-line">
            <span class="name">诊断结果: </span>
            <span class="value">{{item.spephysicalResult}}</span>
          </div>
          <div class="text second-line">
            <span class="name">诊断时间: </span>
            <span class="value">{{item.ariseTime}}</span>
          </div>
         </card>
      </extensible-panel>
      <!-- 基因检查 -->
      <extensible-panel class="panel" :mode="mutableMode" :title="geneCheckTitle" v-on:addNewCard="addGeneCheckRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="(item,idx) in geneCheckList" :key="idx"
          :title="item.checkName" v-on:editCurrentCard="editGeneCheckRecord(item)"
          v-on:deleteCurrentCard="deleteGeneCheckRecord(item)" v-on:viewCurrentCard="viewGeneCheckRecord(item)">
          <div class="text first-line">
            <span class="name">检查结果: </span>
            <span class="value">{{item.checkResult}}</span>
          </div>
          <div class="text second-line">
            <span class="name">检查时间: </span>
            <span class="value">{{item.checkDate}}</span>
          </div>
         </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="biochemicalExamTitle" v-on:addNewCard="addBiochemicalExamRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in biochemicalExamList" :key="item.patientCaseId"
         :title="transformBiochemicalExamType(item.bioexamId)" v-on:editCurrentCard="editBiochemicalExamRecord(item)"
         v-on:deleteCurrentCard="deleteBiochemicalExamRecord(item)" v-on:viewCurrentCard="viewBiochemicalExamRecord(item)">
          <div class="text first-line">
            <span class="name"></span>
            <span class="value"></span>
          </div>
          <div class="text second-line">
            <span class="name">检查时间: </span>
            <span class="value">{{item.checkDate}}</span>
          </div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mutableMode" :title="emgTitle" v-on:addNewCard="addEmgRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in emgList" :key="item.patientCaseId"
         :title="item.etgName" v-on:editCurrentCard="editEmgRecord(item)" v-on:viewCurrentCard="viewEmgRecord(item)"
         v-on:deleteCurrentCard="deleteEmgRecord(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span class="value">{{transformEmgType(item.etgType)}}</span>
          </div>
          <div class="text second-line">
            <span class="name">结果</span>
            <span class="value">{{item.patEleResule}}</span>
          </div>
        </card>
      </extensible-panel>
<!-- 医学影像 -->
      <extensible-panel class="panel image-panel" :mode="mutableMode" :title="medicalImagingTitle" v-on:addNewCard="addImgRecord" :editable="canEdit">
        <card class="card image-card" :class="cardWidth" :mode="mutableMode" v-for="(item,idx) in medicalImagingList" :key="idx"
         :title="item.title" v-on:editCurrentCard="editImgRecord(item)" v-on:viewCurrentCard="viewImgRecord(item)"
         v-on:deleteCurrentCard="deleteImgRecord(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span class="value">{{transformMedicalImagingType(item.imageType)}}</span>
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
import { deleteEmg, deleteBiochemical, delNervouSystem, deleteGeneCheck, deleteImage, deleteVitalSigns } from 'api/patient.js';
// import { vueCopy } from 'utils/helper';

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

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
    archived: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'surgicalTypeList',
      'complicationTypeList',
      'neurologicCheckTypeList',
      'bioexamTypeList',
      'emgTypeList',
      'typeGroup'
    ]),
    vitalSignsTitle() {
      return '生命体征 (' + this.diagnosticVitalSigns.length + '条记录)';
    },
    neurologicCheckTitle() {
      return '神经系统检查（' + this.neurologicCheckList.length + '条记录）';
    },
    geneCheckTitle() {
      return '基因检查（' + this.geneCheckList.length + '条记录）';
    },
    biochemicalExamTitle() {
      return '生化指标（' + this.biochemicalExamList.length + '条记录）';
    },
    emgTitle() {
      return '神经电生理检查（' + this.emgList.length + '条记录）';
    },
    medicalImagingTitle() {
      return '医学影像（' + this.medicalImagingList.length + '条记录）';
    },
    heartRate() {
      var info = Util.getElement('typegroupcode', 'rhythm', this.typeGroup);
      return info.types ? info.types : [];
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && !this.archived) {
        return true;
      } else {
        return false;
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
    transformVitalSigns(rhythm) {
      var types = Util.getElement('typegroupcode', 'rhythm', this.typeGroup).types;
      var typeName = Util.getElement('typeCode', rhythm, types).typeName;
      return typeName ? typeName : '';
    },
    transformNeurologicCheckType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.neurologicCheckTypeList);
      var name = data.spephysicalName ? data.spephysicalName : '';
      return name;
    },
    transformBiochemicalExamType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.bioexamTypeList);
      var name = data.examName ? data.examName : '';
      return name;
    },
    transformEmgType(typeId) {
      // 在 tableData 中找到对应的值
      var emgInfo = Util.getElement('typegroupcode', 'eleType', this.typeGroup);
      var types = emgInfo.types ? emgInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    transformMedicalImagingType(typeId) {
      // 在 tableData 中找到对应的值
      var imageInfo = Util.getElement('typegroupcode', 'examType', this.typeGroup);
      var types = imageInfo.types ? imageInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
      // return typeId;
    },
    addNeurologicCheckRecord() {
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, this.ADD_NEW_CARD, {}, !this.archived);
    },
    editNeurologicCheckRecord(item) {
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, this.EDIT_CURRENT_CARD, item, !this.archived);
    },
    viewNeurologicCheckRecord(item) {
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, this.VIEW_CURRENT_CARD, item, !this.archived);
    },
    deleteNeurologicCheckRecord(item) { // 删除神经检查
      let NeuroId = {
        patientSpephysicalId: item.patientSpephysicalId
      };
      Bus.$on(this.CONFIRM, () => {
        delNervouSystem(NeuroId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addGeneCheckRecord() {
      Bus.$emit(this.SHOW_GENE_MODAL, this.ADD_NEW_CARD, {}, !this.archived);
    },
    editGeneCheckRecord(item) {
      Bus.$emit(this.SHOW_GENE_MODAL, this.EDIT_CURRENT_CARD, item, !this.archived);
    },
    viewGeneCheckRecord(item) {
      Bus.$emit(this.SHOW_GENE_MODAL, this.VIEW_CURRENT_CARD, item, !this.archived);
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
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.ADD_NEW_CARD, {}, !this.archived);
    },
    editBiochemicalExamRecord(item) {
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.EDIT_CURRENT_CARD, item, !this.archived);
    },
    viewBiochemicalExamRecord(item) {
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.VIEW_CURRENT_CARD, item, !this.archived);
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
    addEmgRecord() {
      Bus.$emit(this.SHOW_NEUROELECTRIC_MODAL, this.ADD_NEW_CARD, {}, !this.archived);
    },
    viewEmgRecord(item) {
      Bus.$emit(this.SHOW_NEUROELECTRIC_MODAL, this.VIEW_CURRENT_CARD, item, !this.archived);
    },
    editEmgRecord(item) {
      Bus.$emit(this.SHOW_NEUROELECTRIC_MODAL, this.EDIT_CURRENT_CARD, item, !this.archived);
    },
    deleteEmgRecord(item) { // 删除肌电图
      let EmgInfo = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteEmg(EmgInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addImgRecord() {
      Bus.$emit(this.SHOW_IMG_MODAL, this.ADD_NEW_CARD, {}, !this.archived);
    },
    viewImgRecord(item) {
      Bus.$emit(this.SHOW_IMG_MODAL, this.VIEW_CURRENT_CARD, item, !this.archived);
    },
    editImgRecord(item) {
      Bus.$emit(this.SHOW_IMG_MODAL, this.EDIT_CURRENT_CARD, item, !this.archived);
    },
    deleteImgRecord(item) {
      let imageInfo = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteImage(imageInfo).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addVitalSigns() {
      Bus.$emit(this.SHOW_VITALSIGNS_MODAL, this.ADD_NEW_CARD, {}, !this.archived);
    },
    viewVitalSigns(item) {
      Bus.$emit(this.SHOW_VITALSIGNS_MODAL, this.VIEW_CURRENT_CARD, item, !this.archived);
    },
    editVitalSigns(item) {
      Bus.$emit(this.SHOW_VITALSIGNS_MODAL, this.EDIT_CURRENT_CARD, item, !this.archived);
    },
    deleteVitalSigns(item) {
      var patientVitalSign = {id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deleteVitalSigns(patientVitalSign).then(this._resolveDeletion, this._rejectDeletion);
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
     &.vitalSigns-panel .content {
      height: @image-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    .card {
      display: inline-block;
      position: relative;
      margin: @card-vertical-margin @card-horizontal-margin; // min-width: 200px;
      // max-width: 250px;
      &.image-card{
        height: @image-card-height;
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
