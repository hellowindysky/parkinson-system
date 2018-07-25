<template lang="html">
  <folding-panel :title="'现病史'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit"
    :folded-status="foldedStatus" :editable="canEdit">
    <!-- 现病史开始 ↓-->
    <div class="disease-info" ref="diseaseInfo">

      <!-- 起病情况开始 ↓-->
      <div class="group">

        <h3>起病情况</h3>
        <!-- template 第一部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[0]" :class="checkField(field)" v-show="field.fieldName!=='specificDisease'||specificDiseaseState">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="field.fieldName==='ariTime'">{{ onsetTime(copyInfo[field.fieldName]) }}</span>
            <span v-else-if="field.fieldName==='ariAge'">{{ariAge}}{{theUnit(field.fieldName)}}</span>
            <span v-else-if="field.fieldName==='courseOfDisease'">
              {{diseaseCourse.year}}
              <span v-if="diseaseCourse.year+''">年</span>
              {{diseaseCourse.month}}
              <span v-if="diseaseCourse.month+''">月</span>
            </span>
            <span v-else-if="getUIType(field)===3">
              {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else-if="getUIType(field)===5">
              {{ translateCodes(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="field.fieldName==='ariAge'">{{ariAge}}{{theUnit(field.fieldName)}}</span>
            <span v-else-if="field.fieldName==='courseOfDisease'">
              <span class="field-course-input">
                <el-input
                 v-model="diseaseCourse.year"
                 :id="'year'"
                 :class="{'warning': warningResults.year}"
                 @change="updateWarning({fieldName: 'year'})"
                 placeholder="填写年">
                </el-input>
                <span class="warning-text">{{getWarningText('year')}}</span>
              </span>
              <span>年</span>
              <span class="field-course-input">
                <el-input
                 v-model="diseaseCourse.month"
                 :id="'month'"
                 :class="{'warning': warningResults.month}"
                 @change="updateWarning({fieldName: 'month'})"
                 placeholder="填写月">
                </el-input>
                <span class="warning-text">{{getWarningText('month')}}</span>
              </span>
              <span>月</span>
            </span>


            <span v-else-if="getUIType(field)===1" v-show="copyInfo.diseaseType === 7">
              <el-input v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc"
                type= text
                :maxlength="50"></el-input>
            </span>

            <span v-else-if="getUIType(field)===1">
              <el-input v-model="copyInfo[field.fieldName]" :disabled="field.fieldName==='ariAge'"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc"></el-input>
            </span>
            <span v-else-if="getUIType(field)===3">
              <el-select v-model="copyInfo[field.fieldName]" clearable @change="updateWarning(field)"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :class="{'warning': warningResults[field.fieldName]}">
                <el-option v-for="type in getTypes(field.fieldName)" :label="type.typeName"
                  :value="type.typeCode" :key="type.typeCode"></el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <span v-else-if="getUIType(field)===6">
              <el-date-picker
                v-model="copyInfo[field.fieldName]"
                type="month"
                :class="{'warning': warningResults[field.fieldName]}"
                :picker-options="pickerOptions"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc"
                @change="updateWarning(field)">
              </el-date-picker>
            </span>
            <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
          </div>
        </div>
        <!-- template 第一部分 ↑↑↑↑ -->

        <!-- 发病顺序 ↓ ↓ ↓ -->
        <div class="field custom-field">
          <span class="field-name">发病顺序</span>
          <div class="field-value" v-show="mode===READING_MODE">

            <div class="custom-item" v-for="(item,index) in copyInfo['patientDiseaseOrders']" :key="index">
              <span>{{transform(item.arisePart, diseaseOrderOpt)}}</span>
              <span>{{formatDate(item.time)}}</span>
              <i class="iconfont icon-single-right" v-show="item.arisePart && index!==copyInfo.patientDiseaseOrders.length-1"></i>
            </div>

          </div>
          <div class="field-input" v-show="mode===EDITING_MODE">

            <div class="custom-item" v-for="(item,index) in copyInfo['patientDiseaseOrders']" :key="index">
              <i class="iconfont icon-remove" @click="reduceOrder(index)"></i>
              <span class="sub-item">
                <el-select v-model="item.arisePart" clearable placeholder="请选择">
                  <el-option
                   v-for="item in diseaseOrderOpt" :key="item.typeCode"
                   :label="item.typeName"
                   :value="item.typeCode"
                   :disabled="item.disabled">
                  </el-option>
                </el-select>
              </span>
              <span class="sub-item">
                <el-date-picker
                  v-model="item.time"
                  type="month"
                  placeholder="选择发生年月"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  clearable>
                </el-date-picker>
              </span>
            </div>

            <i class="iconfont icon-plus"  @click="addOrder"></i>

          </div>
        </div>
        <!-- 发病顺序 ↑ ↑ ↑-->

        <!-- template 第二部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[1]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="getUIType(field)===3">
              {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else-if="getUIType(field)===5">
              {{ translateCodes(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===1">
              <el-input v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :type="field.fieldName==='chiefComplaint'?'textarea':'text'"></el-input>
            </span>
            <span v-else-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]" @change="updateWarning(field)"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :class="{'warning': warningResults[field.fieldName]}">
                <el-checkbox v-for="type in checkType" :label="type.typeCode"
                :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
          </div>
        </div>
        <!-- template 第二部分 ↑↑↑ -->

        <extensible-panel class="disease-card" :title="firstSymTitle" @addNewCard="addFirstSymptomsRecord" :editable="canEdit">
          <Card class="card symptoms-card" :mode="mode" :class="cardWidth"
           v-for="item in firstSymbolData" :key="item.id" :title="transform(item.symName, getSymOptions(item.symType))"
           v-on:editCurrentCard="editFirstSymptomsRecord(item)"
           v-on:viewCurrentCard="viewFirstSymptomsRecord(item)"
           v-on:deleteCurrentCard="deleteFirstSymptomsRecord(item)">
            <div class="text first-line">
              <span class="name">首发症状类型：</span>
              <!-- <span class="value" v-if="item.symType === 2">{{transform(item.symName, getNoSportOptions(item.notSportTypeId))}}</span> -->
              <span class="value">{{transform(item.symType, allFirstSymptomsType)}}</span>
            </div>
            <div class="text second-line">
              <span class="name">是否规律出现：</span>
              <span class="value">{{transform(item.whetherLaw, getTypeGroupitem('digitYN'))}}</span>
            </div>
            <div class="text third-line">
              <span class="name">出现时间：</span>
              <span class="value">{{theAriseTime(item)}}</span>
            </div>
          </Card>
        </extensible-panel>

      </div>
      <!-- 起病情况结束 ↑-->

      <!-- 就诊情况开始 ↓-->
      <div class="group">
        <h3>就诊情况</h3>

        <!-- template 第三部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[2]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <!-- <span class="required-mark" v-show="true">*</span> -->
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="getUIType(field)===3">
              {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else-if="getUIType(field)===5">
              {{ translateCodes(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <!-- <span class="warning-text"></span> -->
          </div>
        </div>
        <!-- template 第三部分 ↑↑↑ -->

        <extensible-panel class="disease-card" :title="firstTreatmentsTitle" @addNewCard="addFirstTreatmentRecord" :editable="canEdit">
          <Card class="card symptoms-card" :mode="mode" :class="cardWidth"
           v-for="item in firstVisitTreatmentData" :key="item.id" :title="transform(item.firstVisitType, allFirstVisitType)"
           v-on:editCurrentCard="editFirstTreatmentRecord(item)"
           v-on:viewCurrentCard="viewFirstTreatmentRecord(item)"
           v-on:deleteCurrentCard="deleteFirstTreatmentRecord(item)">
            <div v-if="item.firstVisitType === 1">
              <div class="text first-line">
                <span class="name">药物名称</span>
                <span class="value">{{transform(item.medicineName, getMedNameOptions(item.medicineClassification))}}</span>
              </div>
              <div class="text second-line">
                <span class="name">每日用量</span>
                <span class="value">{{item.dailyDosage}} mg/日</span>
              </div>
              <div class="text third-line">
                <span class="name">初次用药时间</span>
                <span class="value">{{item.firstTime}}</span>
              </div>
            </div>
            <div v-else-if="item.firstVisitType === 2">
              <div class="text first-line">
                <span class="name">治疗类型</span>
                <span class="value">{{transform(item.treatmentType,treatmentTypeOpt)}}</span>
              </div>
              <div class="text second-line">
                <span class="name">治疗手段</span>
                <span class="value">{{transform(item.treatmentMethod, getTreatment(item.treatmentType))}}</span>
              </div>
              <div class="text third-line">
                <span class="name">治疗时间</span>
                <span class="value">{{item.treatmentTime}}</span>
              </div>
            </div>

          </Card>
        </extensible-panel>

        <extensible-panel class="disease-card" :title="visitRecordTitle" @addNewCard="addVisitRecord" :editable="canEdit">
          <Card class="card symptoms-card" :mode="mode" :class="cardWidth"
           v-for="item in patientHistorysData" :key="item.patientHistoryId" :title="item.ariseTime"
           v-on:editCurrentCard="editVisitRecord(item)"
           v-on:viewCurrentCard="viewVisitRecord(item)"
           v-on:deleteCurrentCard="deleteVisitRecord(item)">
            <div class="text first-line">
              <span class="name">医院名称：</span>
              <span class="value">{{item.hospName}}</span>
            </div>
            <div class="text second-line">
              <span class="name">患者主诉：</span>
              <span class="value">{{item.chiefComplaint}}</span>
            </div>
            <!-- <div class="text second-line">
              <span class="name">就诊时间：</span>
              <span class="value">{{item.ariseTime}}</span>
            </div> -->
            <!-- <div class="text third-line">
              <span class="name">日期</span>
              <span class="value"></span>
            </div> -->
          </Card>
        </extensible-panel>

        <!-- template 第四部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[3]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <!-- <span class="required-mark" v-show="true">*</span> -->
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="getUIType(field)===3">
              {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else-if="getUIType(field)===5">
              {{ translateCodes(copyInfo[field.fieldName], field.fieldName) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <!-- <span class="warning-text"></span> -->
          </div>
        </div>
        <!-- template 第四部分 ↑↑↑ -->

      </div>
      <!-- 就诊情况结束 ↑-->
    </div>
    <!-- 现病史结束 ↑-->
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
import { deepCopy, vueCopy, pruneObj, reviseDateFormat } from 'utils/helper.js';
import FoldingPanel from 'public/folding-panel/FoldingPanel';
import ExtensiblePanel from 'public/extensible-panel/ExtensiblePanel';
import Card from 'public/card/Card';
import {queryPatientFirstSymbol, deletePatientFirstSymbol, queryPatientFirstVisitTreatment, delPatientFirstVisitTreatment, queryVisitDignosticRecord, delVisitDignosticRecord, modDiseaseHistory } from 'api/patient.js';

const HALF_LINE_FIELD_LIST = ['diseaseType', 'specificDisease', 'diagnoseState', 'diseaseTypeRemark', 'ariTime', 'courseOfDisease', 'firTime', 'surTime', 'firMedinfo',
  'firMedtime', 'ariAge', 'symmetries', 'symmetriesTime', 'firHosp', 'surHosp'];

export default {
  data() {
    return {
      firstSymbolData: [], // 首发症状
      firstVisitTreatmentData: [], // 初诊治疗
      patientHistorysData: [], // 就诊记录
      diseaseCourse: {
        year: '',
        month: ''
      },
      copyInfo: {
        patientDiseaseOrders: [
          {
            arisePart: '',
            time: ''
          }
        ]
      },
      warningResults: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      mode: this.READING_MODE,
      foldedStatus: true,
      cardWidth: '',
      specificDiseaseState: false
    };
  },
  props: {
    diseaseInfo: {
      type: Object,
      default: () => {}
    },
    birthday: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'diseaseInfoDictionaryGroups',
      'diseaseInfoTemplateGroups',
      'typeGroup',
      'symptomType',
      'noSportType',
      'medicineInfo'
    ]),
    patientId() {
      return this.$route.params.id;
    },
    existed() {
      return !(this.patientId === 'newPatient');
    },
    ariAge() {
      if (this.copyInfo.ariTime) {
        var years = Util.calculateYearsBetween(this.birthday, this.copyInfo.ariTime);
        this.$set(this.copyInfo, 'ariAge', years);
        return years;
      } else {
        return this.getMatchedField('ariAge').cnFieldDesc;
        // return '——选择起病时间自动计算——';
      }
    },
    diseaseInfoDictionary() {
      // 对 diseaseInfoDictionaryGroups 进行扁平化处理，方便之后操作
      var flattenedGroup = [];
      for (let group of this.diseaseInfoDictionaryGroups) {
        flattenedGroup = flattenedGroup.concat(group);
      }
      return flattenedGroup;
    },
    firstSymTitle() {
      return '首发症状（' + (this.firstSymbolData ? this.firstSymbolData : []).length + '条记录）';
    },
    firstTreatmentsTitle() {
      // v2.5.0 [RY-971] 初诊治疗-药物治疗-LEDD概念有歧义，暂时隐藏，不做业务显示
      // var ledd = Number(this.calcTotalLevodopaDoseOfAllOtherMedicine().toFixed(5));
      // return '初诊治疗（' + (this.firstVisitTreatmentData ? this.firstVisitTreatmentData : []).length + '条记录） LEDD: ' + ledd + ' mg';
      return '初诊治疗（' + (this.firstVisitTreatmentData ? this.firstVisitTreatmentData : []).length + '条记录）';
    },
    visitRecordTitle() {
      return '就诊记录（' + (this.patientHistorysData ? this.patientHistorysData : []).length + '条记录）';
    },
    allFirstSymptomsType() {
      // 首发症状类型的集合
      return this.getTypeGroupitem('SympType');
    },
    allFirstVisitType() {
      // 初诊治疗类型的集合
      return this.getTypeGroupitem('firstVisitType');
    },
    treatmentTypeOpt() {
      // 非药物治疗治疗类型的集合
      return this.getTypeGroupitem('treatPro');
    },
    diseaseOrderOpt() {
      // 发病顺序集合
      if (this.copyInfo.symmetries === 1) {
        let firBody = this.getTypeGroupitem('firBody');
        let part = this.copyInfo.patientDiseaseOrders.map((option) => {
          return option.arisePart;
        });
        console.log(firBody);
        for (let i = 0; i < firBody.length; i++) {
          let firBody1 = firBody.slice(7, 9);
          let firBody2 = firBody.slice(4, 7);
          // console.log(firBody2);
          let firBody3 = firBody1.concat(firBody2);
          // console.log(firBody3);
          firBody.forEach((item) => {
            if (part.indexOf(item.typeCode) !== -1) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
          return firBody3;
        }
      } else if (this.copyInfo.symmetries === 0) {
        let firBody = this.getTypeGroupitem('firBody');
        let part = this.copyInfo.patientDiseaseOrders.map((option) => {
          return option.arisePart;
        });
        // console.log(firBody);
        for (let i = 0; i < firBody.length; i++) {
          let firBody1 = firBody.slice(0, 7);
          // console.log(firBody1);
          firBody.forEach((item) => {
            if (part.indexOf(item.typeCode) !== -1) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
          return firBody1;
        }
      }
    },
    checkType() {
      let firBody = this.getTypeGroupitem('firBody');
      for (let i = 0; i < firBody.length; i++) {
        return firBody.slice(0, 7);
      };
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    },
    medicalTreatmentCard() {
      // 把card中的药物治疗过滤出来
      return this.firstVisitTreatmentData.filter((obj) => {
        return obj.firstVisitType === 1;
      });
    }
  },
  methods: {
    courseChange(e) {
      if (e.data === null) {
        if (e.target.parentNode.parentNode.id === 'month') {
          this.$set(this.diseaseCourse, 'month', '');
        }
        if (e.target.parentNode.parentNode.id === 'year') {
          this.$set(this.diseaseCourse, 'year', '');
        }
      }
    },
    calcTotalLevodopaDoseOfAllOtherMedicine() {
      let ledd = 0;
      for (let item of this.medicalTreatmentCard) {
        // 用来计算的药物要满足 2 个条件：未停药，---
        if (item.whetherContinue !== 0) {
          ledd += (item.ledd ? item.ledd : 0);
        }
      }
      return ledd;
    },
    checkIfComtExistsAmongOtherMedicine(targetMedicine) {
      // 遍历其它所有未停药的药物，看是否存在 COMT 抑制剂
      var hasCOMT = false;
      for (let item of this.medicalTreatmentCard) {
        var medicineInfoObj = Util.getElement('medicineId', item.medicineName, this.medicineInfo);
        if (item.medicineName !== targetMedicine.medicineName && medicineInfoObj.medicalType === 3) {
          hasCOMT = true;
        }
      }
      return hasCOMT;
    },
    onsetTime(dateStr) {
      if (dateStr) {
        return Util.simplifyDate(dateStr).split('-').slice(0, 2).join('-');
      } else {
        return dateStr;
      }
    },
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
          return '';
        }
      }
    },
    theUnit(fieldName) {
      if (this.copyInfo['ariTime']) {
        return fieldName === 'ariAge' ? ' 岁' : '';
      } else {
        return '';
      }
    },
    updatafirstSymbolCard() {
      // 查询首发症状
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      queryPatientFirstSymbol({patientId: this.patientId}).then((data) => {
        this.firstSymbolData = data;
      });
    },
    updatafirstVisitTreatmentCard() {
      // 查询初诊治疗
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      queryPatientFirstVisitTreatment({patientId: this.patientId}).then((data) => {
        this.firstVisitTreatmentData = data;
      });
    },
    updatapatientHistorysCard() {
      // 查询就诊记录
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      queryVisitDignosticRecord({patientId: this.patientId}).then((data) => {
        this.patientHistorysData = data;
      });
    },
    startEditing() {
      this.mode = this.EDITING_MODE;
      this.foldedStatus = false;
      this.clearWarning();
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
    getMedNameOptions(fieldType) {
      return this.medicineInfo.filter((obj) => {
        return obj.firstTreatMedicalType === fieldType;
      }).map((obj) => {
        return {
          typeCode: obj.medicineId,
          typeName: obj.medicineName
        };
      });
    },
    getTreatment(fieldType) {
      return this.treatmentTypeOpt.filter((obj) => {
        return obj.typeCode === fieldType;
      }).map((obj) => {
        return obj.childType;
      })[0];
    },
    transform(id, arr) {
      id = parseInt(id, 10);
      arr = arr ? arr : [];
      return arr.filter((obj) => {
        return parseInt(obj.typeCode, 10) === id;
      }).map((obj) => {
        return obj.typeName;
      })[0];
    },
    addOrder() {
      this.copyInfo.patientDiseaseOrders.push({
        arisePart: '',
        time: ''
      });
    },
    formatDate(d) {
      // 阅读状态下发病顺序的日期
      if (d) {
        return '（' + Util.simplifyDate(d).slice(0, -3) + '）';
      } else {
        return '';
      }
    },
    reduceOrder(idx) {
      this.copyInfo.patientDiseaseOrders.splice(idx, 1);
    },
    getMatchedField(fieldName) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', fieldName, this.diseaseInfoDictionary);
    },
    checkField(field) {
      // 用来检测当前 field 的特殊样式
      var dictionaryField = this.getMatchedField(field.fieldName);
      var name = dictionaryField.fieldName;
      var classNameList = [];

      // 判断该字段是否是半行
      if (HALF_LINE_FIELD_LIST.indexOf(name) > -1) {
        classNameList.push('half-line');
      }
      // 判断该字段的名字是否比较长
      if (field.cnfieldName.length > 6) {
        classNameList.push('long-label-field');
      }
      if (field.cnfieldName === '备注' && this.copyInfo.diseaseType !== 7) {
         classNameList.push('short-label-field');
      }
      // 判断该字段是否是多选框
      if (this.getUIType(field) === 5) {
        classNameList.push('multiple-select');
      }
      // 判断是否是textarea，好像没有对应的UIType
      if (field.fieldName === 'chiefComplaint') {
        classNameList.push('textarea-field');
      };
      // 判断是否是病程
      if (field.fieldName === 'courseOfDisease') {
        classNameList.push('field-courseOfDisease');
      }
      return classNameList.join(' ');
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field.fieldName).uiType;
    },
    getTypes(fieldName) {
      if (fieldName === 'specificDisease') {
        let types = this.getTypes('diseaseType');
        let targetTypeList = types.filter((type) => {
          return type.typeCode === Number(this.copyInfo.diseaseType);
        });
        let childType = (targetTypeList.length > 0 && targetTypeList[0].childType) ? targetTypeList[0].childType : [];
        if (childType.length > 0) {
          this.specificDiseaseState = true;
        } else {
          this.$set(this.copyInfo, 'specificDisease', '');
          this.specificDiseaseState = false;
        };
        return childType;

      } else if (fieldName === 'diagnoseState' && this.copyInfo['diseaseType'] === 1) {
        let typeItem = Util.getElement('typegroupcode', 'diagnoseStateForPD', this.typeGroup);
        return typeItem.types ? typeItem.types : [];
      } else {
        // 在 typegroup 里面查找到 field 所对应的 types（选项组）
        var dictionaryField = this.getMatchedField(fieldName);
        var value = dictionaryField.fieldEnumId;
        var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
        return typeInfo.types ? typeInfo.types : [];
      }
    },
    transformTypeCode(typeCode, fieldName) {
      // 根据 typeCode 找到对应的 typeName
      var types = this.getTypes(fieldName);
      var matchedType = Util.getElement('typeCode', typeCode, types);
      return matchedType.typeName ? matchedType.typeName : '';
    },
    translateCodes(typeCodes, fieldName) {
      // 将形如 [1, 2, 4] 的字段信息 转换成 '内容 1，内容 2，内容 4' 这样的单字符串进行显示
      if (!typeCodes) {
        return '';
      }
      var result = [];

      for (let typeCode of typeCodes) {
        result.push(this.transformTypeCode(typeCode, fieldName));
      }
      let str = result.join('，');
      str = str[0] === '，' ? str.slice(1) : str;
      return str;
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var copyFieldValue = this.copyInfo[fieldName];
      if (fieldName === 'year' || fieldName === 'month') {
        let val = this.diseaseCourse[fieldName];
        if (!Util.checkIfNonNegativeInteger(val) && val !== '') {
          this.$set(this.warningResults, fieldName, '填正整数');
          return;
        }
      }
      if (this.getUIType(field) === 6) {
        // 日期控件(el-date-picker)给的是一个表示完整日期对象的字符串，我们需要格式化之后再校验
        copyFieldValue = Util.simplifyDate(copyFieldValue);
      }
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !copyFieldValue && copyFieldValue !== 0;
        var isEmptyArray = copyFieldValue instanceof Array && copyFieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
          this.$set(this.warningResults, fieldName, '必填项');
          return;
        }
      }
      if (copyFieldValue && copyFieldValue.toString().indexOf(' ') > -1) {
        this.$set(this.warningResults, fieldName, '不能包含空格');

      } else {
        // 初始化组件的时候，对应字段的警告文本为 undefined，判断之后，就为实际文本或 null
        // null 代表该字段项的填写没有毛病
        this.$set(this.warningResults, fieldName, null);
      }
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 diseaseInfo 的复制对象，同时不要忘了重新对其进行特殊处理
      let field = ['diseaseType', 'specificDisease', 'diagnoseState', 'diseaseTypeRemark',
        'ariTime', 'ariAge', 'courseOfDisease', 'symmetries', 'patientDiseaseOrders',
        'firBody', 'chiefComplaint', 'diagMode', 'getDisFac', 'getDisFac0'];
      let transDiseaseInfo = Object.assign({}, this.diseaseInfo);
      field.forEach((item) => {
        if (!transDiseaseInfo.hasOwnProperty(item)) {
          if (item === 'patientDiseaseOrders') {
            transDiseaseInfo[item] = [];
          } else {
            transDiseaseInfo[item] = '';
          }
        } else if (item === 'patientDiseaseOrders' && transDiseaseInfo[item].length === 0) {
          transDiseaseInfo[item] = [{arisePart: '', time: ''}];
        };
      });
      this.$set(this.copyInfo, 'patientDiseaseOrders', []);
      vueCopy(transDiseaseInfo, this.copyInfo);

      this.changeCopyInfo();
      this.mode = this.READING_MODE;
    },
    changeCopyInfo() {
      // 复制得到的 copyInfo 有几个字段的值需要特殊处理一下
      // uiType 为 5 (多选框)的字段，形如 “1，3，4” 要转化为 [1, 3, 4]
      // 我们先将 CopyInfo 所有属性的名字放到一个数组里，然后遍历 diseaseInfoDictionary 下的所有 field
      // 看 哪些 field 的 fieldName 在这个数组里，同时该 field 的 uiType 为 5，这时就把 copyInfo 的相应字段进行转换
      var nameList = [];
      for (let fieldName in this.copyInfo) {
        nameList.push(fieldName);
      }
      for (let field of this.diseaseInfoDictionary) {
        let name = field.fieldName;
        let val = this.copyInfo[name];
        if (nameList.indexOf(name) > -1 && field.uiType === 5 && (typeof val) === 'string') {
          var codesArray = val.split(',').map((str) => {
            return parseInt(str, 10);
          });
          if (val === '') {
            this.copyInfo[name] = [];
          } else {
            this.copyInfo[name] = codesArray;
          };

        } else if (field.uiType === 5) {
          // 这种情况指的是，得到的信息没有相应的字段，那么我们就为它建一个空数组，注意为了让 Vue 动态检测，这里采用 set 方法
          this.$set(this.copyInfo, name, []);
        };
      };
    },
    submit() {
      reviseDateFormat(this.copyInfo);
      for (let group of this.diseaseInfoTemplateGroups) {
        for (let field of group) {
          // 首先检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
          this.updateWarning(field);
          if (this.warningResults[field.fieldName]) {
            return false;
          }
        }
      }
      this.updateWarning({fieldName: 'year'});
      this.updateWarning({fieldName: 'month'});
      if (this.warningResults['year'] || this.warningResults['month']) {
        return;
      }
      if (this.copyInfo.diseaseType !== 7) {
        this.copyInfo.diseaseTypeRemark = '';
      }

      this.copyInfo.ariTime = Util.simplifyDate(this.copyInfo.ariTime);

      var submitData = deepCopy(this.copyInfo);
      delete submitData.firMed;
      delete submitData.firSym;
      delete submitData.treatPro;
      delete submitData.patientFirstSymbols;
      delete submitData.patientFirstVisitTreatments;
      delete submitData.patientHistorys;
      pruneObj(submitData);
      for (let key in submitData) {
        if (Array.isArray(submitData[key]) && key !== 'patientDiseaseOrders') {
          let valStr = submitData[key].join(',');
          valStr = valStr[0] === ',' ? valStr.slice(1) : valStr;
          submitData[key] = valStr;
        } else if (key === 'patientDiseaseOrders') {
          let transferArr = [];
          submitData[key].forEach((item) => {
            if (Object.keys(item).length > 0) {
              transferArr.push(item);
            };
          });
          submitData[key] = transferArr;
          this.$set(this.copyInfo, key, transferArr);
          for (let i = 0; i < transferArr.length; i++) {
            let item = transferArr[i];
            if (item.arisePart === '' || item.arisePart === undefined) {
              this.$message({
                message: '请选择发病部位',
                type: 'warning'
              });
              // 此时发病部位没填，当点击确定之后，不知为什么这个arisePart就被删了，再填就填不了了，不得已加了下面一句话
              this.$set(this.copyInfo['patientDiseaseOrders'][i], 'arisePart', '');
              return;
            };
            if (item.time === '' || item.time === undefined) {
              this.$message({
                message: '请填写发病年月',
                type: 'warning'
              });
              // 此时发病年月没填，当点击确定之后，不知为什么这个time就变成undefined了，再填就填不了了，不得已加了下面一句话
              this.$set(this.copyInfo['patientDiseaseOrders'][i], 'time', '');
              return;
            };
          };
        };
      };

      submitData.patientId = this.$route.params.id;
      modDiseaseHistory(submitData).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
        this.mode = this.READING_MODE;
      });
    },
    addFirstSymptomsRecord() {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'firstSymptomsModal', this.SHOW_FIRSTSYMPTOMS_MODAL, this.ADD_NEW_CARD, {});
    },
    editFirstSymptomsRecord(item) {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'firstSymptomsModal', this.SHOW_FIRSTSYMPTOMS_MODAL, this.EDIT_CURRENT_CARD, item);
    },
    viewFirstSymptomsRecord(item) {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'firstSymptomsModal', this.SHOW_FIRSTSYMPTOMS_MODAL, this.VIEW_CURRENT_CARD, item);
    },
    deleteFirstSymptomsRecord(item) {
      var firSymId = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientFirstSymbol(firSymId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addFirstTreatmentRecord() {
      var hasCOMT = this.checkIfComtExistsAmongOtherMedicine({});
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'firstTreatmentModal', this.SHOW_FIRSTTREATMENT_MODAL, this.ADD_NEW_CARD, {}, hasCOMT);
    },
    editFirstTreatmentRecord(item) {
      var hasCOMT = this.checkIfComtExistsAmongOtherMedicine(item);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'firstTreatmentModal', this.SHOW_FIRSTTREATMENT_MODAL, this.EDIT_CURRENT_CARD, item, hasCOMT);
    },
    viewFirstTreatmentRecord(item) {
      var hasCOMT = this.checkIfComtExistsAmongOtherMedicine(item);
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'firstTreatmentModal', this.SHOW_FIRSTTREATMENT_MODAL, this.VIEW_CURRENT_CARD, item, hasCOMT);
    },
    deleteFirstTreatmentRecord(item) {
      var firTreatmentId = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        delPatientFirstVisitTreatment(firTreatmentId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addVisitRecord() {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'diagnosticRecordModal', this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.ADD_NEW_CARD, {});
    },
    editVisitRecord(item) {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'diagnosticRecordModal', this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.EDIT_CURRENT_CARD, item);
    },
    viewVisitRecord(item) {
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, 'diagnosticRecordModal', this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.VIEW_CURRENT_CARD, item);
    },
    deleteVisitRecord(item) {
      var patientHistory = {
        patientHistoryId: item.patientHistoryId
      };
      Bus.$on(this.CONFIRM, () => {
        delVisitDignosticRecord(patientHistory).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        if (!this.$refs.diseaseInfo) {
          return;
        }
        var panelWidth = this.$refs.diseaseInfo.clientWidth;
        var devideNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度
        while (panelWidth / devideNum > 200 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.cardWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    },
    getWarningText(fieldName) {
      var warningResult = this.warningResults[fieldName];
      return warningResult ? warningResult : '';
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      // Bus.$emit(this.UPDATE_PATIENT_INFO);
      // 重新查询首发症状等三个
      this.updatafirstSymbolCard();
      this.updatafirstVisitTreatmentCard();
      this.updatapatientHistorysCard();
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  watch: {
    diseaseInfo: function(newBasicInfo) {
      // 当 diseaseInfo这个属性变量发生变化时（包括第一次传递进来），我们都对其进行浅复制，复制到 copyInfo 对象中。
      // 这样一来，编辑状态下修改 copyInfo 对象的属性时，就不会影响到 diseaseInfo 对象本身。
      // 如果组件的 diseaseInfo 属性发生变化，copyInfo 对象就会重置，而我们对 copyInfo 所做的还未提交的修改则会丢失
      vueCopy(newBasicInfo, this.copyInfo);
      // 这里对 copyInfo 的某些字段进行特殊处理
      // 因为要等到 diseaseInfo 和 diseaseInfoDictionaryGroups 这两个对象都异步调用成功才能有效执行
      // 所以我们对它们同时进行监控，任何一个调用成功，都会试图执行该函数（只有一个成功时，执行该函数是没有效果的）
      // 这样就保证，当两个异步数据都调用成功的时候，一定会有效地执行 changeCopyInfo
      this.changeCopyInfo();
    },
    diseaseInfoDictionaryGroups: function() {
      for (let group of this.diseaseInfoTemplateGroups) {
        for (let field of group) {
          if (this.copyInfo[field.fieldName] !== undefined) {
            this.$set(this.copyInfo, field.fieldName, '');
          }
        }
      }
      this.changeCopyInfo();
    },
    diseaseCourse: {
      handler: function(newObj) {
        if (isNaN(Number(newObj.year)) || isNaN(Number(newObj.month))) {
          return;
        }
        if (newObj.year === '' && newObj.month === '') {
          this.$set(this.copyInfo, 'ariTime', '');
          return;
        }
        let year = newObj.year ? Number(newObj.year) : 0;
        let month = newObj.month ? Number(newObj.month) : 0;
        let months = year * 12 + month;
        let today = new Date();
        today.setDate(1);
        today.setMonth(today.getMonth() - months);
        let ariTime = today;
        ariTime = Util.simplifyDate(ariTime);
        this.$set(this.copyInfo, 'ariTime', ariTime);
      },
      deep: true
    },
    'copyInfo.ariTime': function(newVal) {
      if (newVal) {
        let today = new Date();
        today.setDate(1);
        let courseDis = Util.calculateMonthsBetween(newVal, today);
        let year = parseInt(courseDis / 12, 10);
        let month = courseDis % 12;
        this.$set(this.diseaseCourse, 'year', year);
        this.$set(this.diseaseCourse, 'month', month);
        this.$set(this.copyInfo, 'courseOfDisease', courseDis);
      } else {
        this.$set(this.diseaseCourse, 'year', '');
        this.$set(this.diseaseCourse, 'month', '');
        this.$set(this.copyInfo, 'courseOfDisease', '');
      }
      this.updateWarning({fieldName: 'year'});
      this.updateWarning({fieldName: 'month'});
    }
  },
  created() {
    // 当用户在页面中跳转，导致本组件重新装载的时候，需要将 copyInfo 进行恢复
    // 注意，这里之所以选择 created 钩子函数而不是 mounted，是因为 el-date-picker 组件的绑定数据模型是 copyInfo 下的属性
    // 如果在 DOM 都加载好了之后再去修改 this.copyInfo，会发现跟 el-date-picker 相关的属性会出现问题
    // this.shallowCopy(this.diseaseInfo);
    // this.changeCopyInfo();
  },
  mounted() {
    // console.log(this.diseaseInfoTemplateGroups);
    // console.log(this.diseaseInfoDictionary);
    Bus.$on(this.EDIT_DISEASE_INFO, this.startEditing);
    this.updatafirstSymbolCard();
    Bus.$on(this.UPDATE_FIRSTSYMPTOMS_INFO, this.updatafirstSymbolCard);
    this.updatafirstVisitTreatmentCard();
    Bus.$on(this.UPDATE_FIRSTTREATMENT_INFO, this.updatafirstVisitTreatmentCard);
    this.updatapatientHistorysCard();
    Bus.$on(this.UPDATE_VISITDIAGNOSTICRECORD_INFO, this.updatapatientHistorysCard);

    for (let group of this.diseaseInfoTemplateGroups) {
      for (let field of group) {
        this.$set(this.copyInfo, field.fieldName, '');
      }
    }
    this.$nextTick(() => {
      vueCopy(this.diseaseInfo, this.copyInfo);
      this.changeCopyInfo();
    });
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
    Bus.$off(this.UPDATE_FIRSTSYMPTOMS_INFO);
    Bus.$off(this.UPDATE_FIRSTTREATMENT_INFO);
    Bus.$off(this.UPDATE_VISITDIAGNOSTICRECORD_INFO);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@long-field-name-width: 160px;

@disease-card-height: 130px;
// @field-item-width: 150px;
// @field-height: 45px;

.disease-info {
  padding: 0 25px 20px;
  .group {
    margin-left:20px;
    padding: 0;
    text-align: left;
    >h3{
      margin-left:-20px;
      font-size:@large-font-size;
    }
    .disease-card{
      margin-top:20px;
      >.header{
        padding-left:0;
        >.title{
          padding-left: 0;
        }
        .button{
          &.add-button {
            right: 20px + @small-button-width;
          }
          &.extend-button{
            right:0;
          }
          &.shrink-button {
            right: 0;
          }
        }
      }
      >.content{
        margin-left:0;
        margin-right:0;
        height: @disease-card-height + @card-vertical-margin * 2 + 5px * 2;
        &.extended {
          height: auto;
        }
      }
      .card {
        display: inline-block;
        position: relative;
        margin: @card-vertical-margin @card-horizontal-margin; // min-width: 200px;
        // max-width: 250px;
        &.symptoms-card{
          height: @disease-card-height;
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
    .field {
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      text-align: left;
      &.field-courseOfDisease {
        .field-input {
          .field-course-input {
            position: relative;
            .warning-text {
              line-height: 25px;
              top: 20px;
            }
          }
          .el-input {
            width: 36%;
          }
        }
      }
      &.half-line {
        width: 50%;
        .field-input {
          right: 4%;
        }
      }
      &.long-label-field {
        .field-name {
          width: @long-field-name-width;
        }
        .field-value {
          left: @long-field-name-width;
        }
        .field-input {
          left: @long-field-name-width;
        }
      }
      &.short-label-field {
        .field-name {
          // width: 0;
          // font-size: 0;
          display: none;
        }
      }
      &.multiple-select {
        transform: translateY(@field-height * 0.4);
        height: auto;
        min-height: @field-height * 1.0;
        .field-name {
          line-height: @field-height * 0.3;
        }
        .field-value {
          line-height: @field-height * 0.3;
        }
        .field-input {
          position: relative;
          padding-bottom: 10px;
          width: calc(~"100% - @{field-name-width}");
          line-height: @field-height * 0.3;
          .warning-text {
            position: relative;
            top: -4px;
            left: 0;
            height: 15px;
            line-height: 15px;
            color: red;
            font-size: @small-font-size;
          }
        }
        &.long-label-field {
          .field-input {
            width: calc(~"100% - @{long-field-name-width}");
          }
        }
      }
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: @field-name-width;
        line-height: @field-height;
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
        position: absolute;
        top: 0;
        left: @field-name-width;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        max-width: 350px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

      }
      .field-input {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        right: 0;
        font-size: @normal-font-size;
        line-height: @field-height;
        overflow: visible;
        .warning-text {
          position: absolute;
          top: 25px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
        }
        .el-input {
          .el-input__inner {
            height: 30px;
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
        .el-textarea {
          margin-bottom: 15px;
          // transform: translateY(-3px);
          .el-textarea__inner {
            border: none;
            background-color: @screen-color;
          }
        }
        .el-checkbox-group {
          .el-checkbox {
            margin-left: 0;
            margin-right: 15px;
          }
          .el-checkbox__input {
            line-height: 18px;
          }
        }
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
      &.textarea-field{
        transform: translateY(10px);
        .field-name{
          line-height:25px;
        }
        .field-value{
          position: relative;
          line-height:25px;
          width: calc(~"100% - 100px");
        }
        .field-input{
          position: relative;
          width: calc(~"100% - 100px");
        }
      }
      &.custom-field{
        height:auto;
        min-height:30px;
        margin-top:10px;
        margin-bottom:3px;
        .field-name{
          line-height:30px;
        }
        .field-value{
          line-height:30px;
          position: relative;
          .custom-item{
            display:inline-block;
            margin-right: 5px;
            i{
              font-size:14px;
            }
          }
        }
        .field-input{
          position: relative;
          line-height:30px;
          .custom-item{
            display:inline-block;
            width:300px;
            margin-right:10px;
            margin-bottom:6px;
            >i{
              color:#d20000f5;
            }
            .sub-item{
              display:inline-block;
              width:45%;
            }
          }
          i{
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
