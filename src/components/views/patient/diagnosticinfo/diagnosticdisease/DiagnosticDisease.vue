<template lang="html">
  <folding-panel :title="'病症情况'" :mode="mutableMode" :folded-status="foldedStatus" v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" v-on:toggleFoldedPanel="updateScrollbar" :editable="canEdit">
    <div class="diagnostic-disease" ref="diagnosticDisease">
      <div v-for="field in diagnosticDiseaseTemplate" class="field" v-show="field.fieldName!=='specificDisease'||specificDiseaseState"
        :class="{'whole-line': field.fieldName === 'caseSymptom'}">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must === 1">*</span>
        </span>

        <div class="field-value" v-show="mutableMode===READING_MODE">
          <span v-if="getUIType(field.fieldName)===3">
             {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
          </span>
          <span v-else>
            {{copyInfo[field.fieldName]}}
          </span>
        </div>

        <div class="field-input" v-show="mutableMode===EDITING_MODE">
          <span class="warning-text" :class="{'below-second-row': field.fieldName==='caseSymptom'}" v-show="warningResults[field.fieldName]">
            {{warningResults[field.fieldName]}}
          </span>
          <el-input v-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
            type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :class="{'warning': warningResults[field.fieldName]}"
            :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :maxlength="500">
          </el-input>
          <el-select v-else-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]"
            :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field).cnFieldDesc"
            @change="updateWarning(field)" clearable >
            <el-option v-for="option in getOptions(field.fieldName)" :label="option.typeName"
              :value="option.typeCode" :key="option.typeCode"></el-option>
          </el-select>
        </div>
      </div>

      <extensible-panel class="panel disease-panel" :mode="mutableMode" :title="subTitle" v-on:addNewCard="addChiefComplaintSymptomsRecord" :editable="canEdit">
        <card class="card symptoms-card" :class="devideWidth" :mode="mutableMode"
         v-for="item in complaintSympData" :key="item.diseaseId" :title="transform(item.symType, allFirstSymptomsType)" :disable-delete="item.statusFlag===0"
         v-on:editCurrentCard="editChiefComplaintSymptomsRecord(item)"
         v-on:deleteCurrentCard="deleteDisease(item)"
         v-on:viewCurrentCard="viewChiefComplaintSymptomsRecord(item)">
          <div class="text first-line">
            <span class="name">症状名称：</span>
            <span class="value" v-if="item.symType === 2">{{transform(item.symName, getNoSportOptions(item.notSportTypeId))}}</span>
            <span class="value" v-else >{{transform(item.symName, getSymOptions(item.symType))}}</span>
          </div>
          <div class="text second-line">
            <span class="name">是否规律出现：</span>
            <span class="value" v-if="item.whetherLaw === undefined">未填写</span>
            <span class="value" v-else >{{transform(item.whetherLaw, getTypeGroupitem('digitYN'))}}</span>
          </div>
          <div class="text third-line">
            <span class="name">出现时间：</span>
            <span class="value">{{theAriseTime(item)}}</span>
          </div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
// import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import {queryPatientSymptom, delPatientSymptom, modDiseaseSituation } from 'api/patient.js';

import { pruneObj } from 'utils/helper.js';

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      foldedStatus: true,
      copyInfo: {},
      warningResults: {},
      title: '主诉症状',
      devideWidth: '',
      lockSubmitButton: false,
      complaintSympData: [],
      specificDiseaseState: false
      // MS_SYMPTOM: '运动症状',
      // MC_SYMPTOM: '运动并发症',
      // NMS_SYMPTOM: '非运动症状'
    };
  },
  computed: {
    ...mapGetters([
      'diagnosticDiseaseDictionary',
      // 'diagnosticDiseaseMsDictionary',
      // 'diagnosticDiseaseMcDictionary',
      // 'diagnosticDiseaseNmsDictionary',
      'diagnosticDiseaseTemplate',
      // 'diagnosticDiseaseMsTemplate',
      // 'diagnosticDiseaseMcTemplate',
      // 'diagnosticDiseaseNmsTemplate',
      'symptomType',
      'noSportType',
      'typeGroup'
    ]),
    subTitle() {
      var count = this.complaintSympData.length;
      return this.title + '（' + count + '条记录）';
    },
    allFirstSymptomsType() {
      // 首发症状（主诉症状）类型的集合
      return this.getTypeGroupitem('SympType');
    }
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    diagnosticDisease: {
      type: Object,
      default: {}
    },
    diagnosisCreator: {
      type: String,
      default: ''
    },
    diagnosticExperimentStep: {
      type: Number,
      default: 0
    },
    patientExperimentStep: {
      type: Number,
      default: 0
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    theAriseTime(item) {
      if (item.ariseTime) {
        return item.ariseTime;
      } else {
        let fieldNames = ['ariseTimeLeftDown', 'ariseTimeLeftUp', 'ariseTimeRightDown', 'ariseTimeRightUp'];
        let nums = [];
        fieldNames.forEach((elem) => {
          if (item[elem]) {
            nums.push(new Date(item[elem]).getTime());
          };
        });
        if (nums.length > 0) {
          return Util.simplifyDate(Math.min.apply(Math, nums));
        } else {
          return '未填写';
        }
      }
    },
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
      this.foldedStatus = false;
      Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);

      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p)) {
          this.warningResults[p] = '';
        }
      }
    },
    cancel() {
      vueCopy(this.diagnosticDisease, this.copyInfo);
      this.mutableMode = this.READING_MODE;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.diagnosticDiseaseDictionary);
    },
    getTypes(fieldName) {
      // 在 typegroup 里面查找到 fieldName 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(fieldName);
      var value = dictionaryField.fieldEnumId;
      value = fieldName; // TODO 等以后字典项返回 OK 了，就去掉这一行
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    // transform(item, fieldName) {
    //   var types = this.getTypes(fieldName);
    //   var diseaseType = Util.getElement('typeCode', item[fieldName], types);
    //   return diseaseType.typeName ? diseaseType.typeName : '';
    // },
    transform(id, arr) {
      id = parseInt(id, 10);
      arr = arr ? arr : [];
      return arr.filter((obj) => {
        return parseInt(obj.typeCode, 10) === id;
      }).map((obj) => {
        return obj.typeName;
      })[0];
    },
    getTypeGroupitem(fieldName) {
      let opt = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      return (opt ? opt : []);
    },
    getSymOptions(fieldType) {
      return this.symptomType.filter((obj) => {
        return obj.symptomtype === fieldType;
      }).map((obj) => {
        return {
          typeName: obj.sympName,
          typeCode: obj.id
        };
      });
    },
    getNoSportOptions(fieldType) {
      return this.noSportType.filter((obj) => {
        return obj.noSportType === fieldType;
      }).map((obj) => {
        return {
          typeName: obj.noSportName,
          typeCode: obj.id
        };
      });
    },
    getDisease(diseaseId) {
      // 根据药物 id，在相应的 tableData 里面寻找对应的 药物详情
      return Util.getElement('diseaseId', diseaseId, this.diseaseInfo);
    },
    getTitle(diseaseId) {
      var disease = this.getDisease(diseaseId);
      return disease.diseaseName + '(' + disease.commonName + ')';
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      // -----------
      // 验证必填项 如果没填 显示红框，显示必填项三个字
      for (let field of this.diagnosticDiseaseTemplate) {
        this.updateWarning(field);
      }

      // 然后检查 warningResults，看填写的数据是否合规
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p) && this.warningResults[p]) {
          this.lockSubmitButton = false;
          return;
        }
      }
      // -------------
      var submitData = Object.assign({}, this.copyInfo);
      delete submitData.patientSymptom;
      pruneObj(submitData);
      submitData.patientCaseId = this.$route.params.caseId;
      modDiseaseSituation(submitData).then(() => {
        this.updateAndClose();
        this.lockSubmitButton = false;
      }, this._handleError);
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
      this.mutableMode = this.READING_MODE;
    },
    updateScrollbar() {
      this.$nextTick(() => {
      });
    },
    updateComplaintSympCard() {
      let caseId = this.$route.params.caseId;
      queryPatientSymptom({patientCaseId: caseId}).then((data) => {
        this.complaintSympData = data;
      });
    },
    addChiefComplaintSymptomsRecord() {
      Bus.$emit(this.SHOW_CHIEF_COMPLAINT_SYMPTOMS_MODAL, this.ADD_NEW_CARD, {}, this.canEdit);
    },
    viewChiefComplaintSymptomsRecord(item) {
      Bus.$emit(this.SHOW_CHIEF_COMPLAINT_SYMPTOMS_MODAL, this.VIEW_CURRENT_CARD, item, this.canEdit);
    },
    editChiefComplaintSymptomsRecord(item) {
      Bus.$emit(this.SHOW_CHIEF_COMPLAINT_SYMPTOMS_MODAL, this.EDIT_CURRENT_CARD, item, this.canEdit);
    },
    deleteDisease(item) {
      var patientDisease = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        delPatientSymptom(patientDisease).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getOptions(fieldName, type) {
      // 第二个参数代表主诉的类型（'ms', 'mc', 'nms' 分别代表运动症状，运动并发症，非运动症状），
      // 第二个参数只有在主诉字段内才是必须的
      if (fieldName === 'symptomTypeId') {
        var options = [];
        const typeDict = {
          'ms': 0,
          'mc': 1,
          'nms': 2
        };
        for (let symptomTypeItem of this.symptomType) {
          if (symptomTypeItem.symptomtype === typeDict[type]) {
            options.push({
              name: symptomTypeItem.sympName,
              code: symptomTypeItem.id
            });
          }
        }
        return options;

      } else if (fieldName === 'specificDisease') {
        let types = this.getOptions('diseaseType');
        let targetTypeList = types.filter((type) => {
          return type.typeCode === Number(this.copyInfo.diseaseType);
        });
        let childType = (targetTypeList.length > 0 && targetTypeList[0].childType) ? targetTypeList[0].childType : [];
        // --具体病症的显示与隐藏--
        if (childType.length > 0) {
          this.specificDiseaseState = true;
        } else {
          this.$set(this.copyInfo, 'specificDisease', '');
          this.specificDiseaseState = false;
        };
        // ---
        return childType;
      } else {
        var dictionaryField = Util.getElement('fieldName', fieldName, this.diagnosticDiseaseDictionary);
        var fieldEnumId = dictionaryField.fieldEnumId;
        var types = Util.getElement('typegroupcode', fieldEnumId, this.typeGroup).types;
        types = types ? types : [];
        return types;
      }

    },
    transformTypeCode(typeCode, fieldName) {
      if (fieldName === 'specificDisease') {
        let types = this.getOptions('diseaseType');
        let targetTypeList = types.filter((type) => {
          return type.typeCode === Number(this.copyInfo.diseaseType);
        });
        let childType = (targetTypeList.length > 0 && targetTypeList[0].childType) ? targetTypeList[0].childType : [];
        let matchedType = Util.getElement('typeCode', typeCode, childType);
        return matchedType.typeName ? matchedType.typeName : '';
      } else {
        return Util.getElement('typeCode', typeCode, this.getOptions(fieldName)).typeName;
      }
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      if (field.must === 1 && !this.copyInfo[fieldName]) {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      this.updateComplaintSympCard();
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticDisease.clientWidth;
        var devideNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度
        while (panelWidth / devideNum > 200 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    }
  },
  mounted() {
    // 更新主诉症状的卡片
    this.updateComplaintSympCard();
    Bus.$on(this.UPDATE_COMPLAINTSYMPTOMS_INFO, this.updateComplaintSympCard);

    Bus.$on(this.QUIT_DIAGNOSTIC_DETAIL, this.cancel);
    Bus.$on(this.EDIT_DIAGNOSTIC_DISEASE, this.startEditing);
    this.recalculateCardWidth();

    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE);
    Bus.$off(this.TOGGLE_LIST_DISPLAY);
    Bus.$off(this.QUIT_DIAGNOSTIC_DETAIL);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    Bus.$off(this.UPDATE_COMPLAINTSYMPTOMS_INFO);
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  watch: {
    '$route.path'() {
      this.updateScrollbar();
    },
    diagnosticDisease: function() {
      // 每次传过来的数据发生变化，就重新初始化 copyInfo
      this.copyInfo = {};
      vueCopy(this.diagnosticDisease, this.copyInfo);
      // 传过来的数据可能会没有某些字段属性，我们接下来将通过 template 来补齐
      // this.supplementCopyInfo();
    }
    // templateLength: function() {
    //  // 如果 template 数据还没到位，那么补齐就会没有效果，所以在获取到 template 后，也要做一次补齐操作
    //   this.supplementCopyInfo();
    // }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@field-line-height: 25px;
@scroll-bar-height: 10px;

@col-name-width: 200px;
@col-time-width: 170px;
@col-select-width: 150px;
@col-remarks-width: 250px;
@row-height: 45px;

@disease-card-height: 130px;

.diagnostic-disease {
  // padding: 0 25px;
  text-align: left;
  .field {
    display: inline-block;
    position: relative;
    width: 50%;
    min-height: @field-height;
    text-align: left;
    vertical-align: top;
    &.whole-line {
      width: 100%;
      .field-input {
        right: 2%;
      }
    }
    .field-name {
      padding: 0 25px;
      display: inline-block;
      position: absolute;
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
    .field-value {
      display: inline-block;
      position: relative;
      left: @field-name-width;
      width: calc(~"96% - @{field-name-width}");
      line-height: @field-line-height;
      font-size: @normal-font-size;
      color: @light-font-color;
    }
    .field-input {
      display: inline-block;
      position: relative;
      top: 0;
      left: @field-name-width;
      width: calc(~"96% - @{field-name-width}");
      line-height: @field-height;
      overflow: visible;
      .warning-text {
        position: absolute;
        top: 10px;
        left: 10px;
        height: 15px;
        color: red;
        font-size: @small-font-size;
        &.below-second-row {
          top: 40px;
        }
      }
      .el-input {
        transform: translateY(-13px);
        .el-input__inner {
          height: 30px;
          border: none;
          background-color: @screen-color;
        }
      }
      .el-textarea {
        vertical-align: middle;
        transform: translateY(-3px);
        .el-textarea__inner {
          border: none;
          background-color: @screen-color;
        }
        &.warning {
          border: 1px solid red;
        }
      }
      .el-select {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
      }
      .warning .el-input__inner {
        border: 1px solid red;
      }
    }
  }
  >.extensible-panel-wrapper.disease-panel{
    margin-top:20px;
    >.content{
      height:@disease-card-height + @card-vertical-margin * 2 + 5px * 2;
    }
  }
  .card {
      position: relative;
      display: inline-block;
      margin: @card-vertical-margin @card-horizontal-margin;
      &.symptoms-card{
        height: @disease-card-height;
      }
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
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
        .name {
          color: @font-color;
        }
      }
      .first-line {
        left: 10px;
        top: 50px;
      }
      .second-line {
        left: 10px;
        top: 75px;
      }
      .third-line {
        left: 10px;
        top: 100px;
      }
  }
}

</style>
