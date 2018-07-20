<template lang="html">
  <div class="treatment-modal-wrapper">
    <div class="treatment-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            初诊治疗类型
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(copyInfo.firstVisitType,firstTreatmentTypeOptions)}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.firstVisitType}}</span>
            <el-select v-model="copyInfo.firstVisitType" placeholder="请选择初诊治疗类型" clearable
             @change="updateWarning('firstVisitType'),clearVal('firstVisitType')" :class="{'warning': warningResults.firstVisitType}" >
              <el-option
                v-for="item in firstTreatmentTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
          </el-select>
          </span>
        </div>

        <!-- 以下是 药物治疗才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-if="copyInfo.firstVisitType===1">
          <div class="field half-line">
            <span class="field-name">
              药物商品名
              <span class="required-mark">*</span>
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.medicineName,medicineNameOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.medicineName}}</span>
              <el-select v-model="copyInfo.medicineName" placeholder="请选择药物商品名" clearable filterable
               @change="getMedicalType()"
               :class="{'warning': warningResults.medicineName}">
                <el-option
                 v-for="item in medicineInfo"
                 :key="item.medicineId"
                 :label="item.medicineName"
                 :value="item.medicineId">
                </el-option>
                <!-- <el-option
                 v-for="item in medicineNameOpt"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option> -->
              </el-select>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              化学名
              <span class="required-mark">*</span>
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{commonMedicineName}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.commonMedicineName}}</span>
              <el-input v-model="commonMedicineName" placeholder="选择药物名称自动匹配" disabled
              @change="updateWarning('commonMedicineName')"
              :class="{'warning': warningResults.commonMedicineName}">
              </el-input>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              药物规格
              <span class="required-mark">*</span>
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.medicalSpecUsed}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.medicalSpecUsed}}</span>
              <el-select v-model="copyInfo.medicalSpecUsed" placeholder="请选择药物规格" clearable
               @change="updateWarning('medicalSpecUsed')"
               :class="{'warning': warningResults.medicalSpecUsed}">
                <el-option
                 v-for="(item,index) in medicineSpec"
                 :key="item.specOral+index"
                 :label="item.specOral"
                 :value="item.specOral">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              药物类型
              <span class="required-mark">*</span>
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.medicineClassification, medicineClassOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">{{warningResults.medicineClassification}}</span> -->
              <el-select v-model="copyInfo.medicineClassification" placeholder="选择药物名称自动匹配" disabled
               @change="updateWarning('medicineClassification')">
                <el-option
                 v-for="item in medicineClassOpt"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>


          <div class="field half-line">
            <span class="field-name">
              每日用量（片）
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.dailyDosagePian}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.dailyDosagePian}}</span>
              <el-input v-model="copyInfo.dailyDosagePian" placeholder="请输入每日用量" :class="{'warning': warningResults.dailyDosagePian}"
               @change="updateWarning('dailyDosagePian')"></el-input>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              每日用量（mg）
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.dailyDosage}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.dailyDosage}}</span>
              <!-- <el-input v-model="copyInfo.dailyDosage" placeholder="请输入每日用量" :class="{'warning': warningResults.dailyDosage}"
               @change="updateWarning('dailyDosage')"></el-input> -->
               <span v-if="leddAttr1||leddAttr1===0">{{leddAttr1}}</span>
               <span v-else>{{fieldHint('dailyDosage')}}</span>
            </span>
          </div>
          <div class="field half-line">
            <span class="field-name">
              LEDD（mg）
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.ledd}}</span>
              <span class="enhance" v-show="enhanceEffect && leddAttr">( +33% )</span>
            </span>
            <span class="field-input" v-else>
              <span>
                <span v-if="leddAttr||leddAttr===0">{{leddAttr}}</span>
                <span v-else>{{fieldHint('ledd')}}</span>
                <span class="enhance" v-show="enhanceEffect && leddAttr">( +33% )</span>
              </span>
              <!-- <el-input v-model="copyInfo.ledd" placeholder="根据用量自动计算" disabled></el-input> -->
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              初次用药时间
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.firstTime}}</span>
            </span>
            <span class="field-input" v-else>
              <el-date-picker v-model="copyInfo.firstTime" type="date" placeholder="请选择初次用药时间" clearable
               :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              用药年限
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.yearsOfMedicine}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.yearsOfMedicine}}</span>
              <el-input v-model="copyInfo.yearsOfMedicine" placeholder="请输入用药年限"
               :class="{'warning': warningResults.yearsOfMedicine}"
               @change="updateWarning('yearsOfMedicine')">
              </el-input>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              是否有效
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.whetherEffect, getOptions('whetherEffect'))}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="copyInfo.whetherEffect" placeholder="请选择" clearable >
                <el-option
                 v-for="(item,index) in getOptions('whetherEffect')"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              不良反应
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.adverse, getOptions('haveType'))}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="copyInfo.adverse" placeholder="请选择" clearable >
                <el-option
                 v-for="(item,index) in getOptions('haveType')"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field half-line">
            <span class="field-name">
              是否继续服用
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.whetherContinue, getOptions('finish'))}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="copyInfo.whetherContinue" placeholder="请选择" clearable >
                <el-option
                 v-for="item in getOptions('finish')"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field half-line" v-if="copyInfo.whetherContinue===0">
            <span class="field-name">
              停药时间
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.stopTime}}</span>
            </span>
            <span class="field-input" v-else>
              <el-date-picker v-model="copyInfo.stopTime" type="date" placeholder="请选择停药时间" clearable
               :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>

          <div class="field" v-if="copyInfo.whetherContinue===0">
            <span class="field-name">
              停药原因
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.stopReason}}</span>
            </span>
            <span class="field-input" v-else>
              <el-input v-model="copyInfo.stopReason" type="textarea" placeholder="请输入停药原因" :maxlength="500"></el-input>
            </span>
          </div>

          <div class="field">
            <span class="field-name">
              备注
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.remarks}}</span>
            </span>
            <span class="field-input" v-else>
              <el-input v-model="copyInfo.remarks" type="textarea" placeholder="请输入备注" :maxlength="500"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 药物治疗才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->


        <!-- 以下是 非药物治疗才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-if="copyInfo.firstVisitType===2">

          <div class="field">
            <span class="field-name">
              治疗类型:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.treatmentType,treatmentTypeOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.treatmentType}}</span>
              <el-select v-model="copyInfo.treatmentType" clearable placeholder="请选择治疗类型"
               @change="updateWarning('treatmentType')"
                :class="{'warning': warningResults.treatmentType}" >
                <el-option
                 v-for="item in treatmentTypeOpt"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name">
              治疗手段:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.treatmentMethod,treatmentMethodOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <el-select v-model="copyInfo.treatmentMethod" clearable placeholder="请选择治疗手段">
                <el-option
                 v-for="item in treatmentMethodOpt"
                 :key="item.typeCode"
                 :label="item.typeName"
                 :value="item.typeCode">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name">
              治疗时间:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.treatmentTime}}</span>
            </span>
            <span class="field-input" v-else>
              <el-date-picker v-model="copyInfo.treatmentTime" type="date" placeholder="请选择治疗时间" clearable
               :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name">
              备注:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.remarks}}</span>
            </span>
            <span class="field-input" v-else>
              <el-input v-model="copyInfo.remarks" type="textarea" placeholder="请输入备注" :maxlength="500"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 非药物治疗才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      </div>

      <div class="seperate-line" v-show="true"></div>



      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-if="mode===VIEW_CURRENT_CARD && canEdit" class="button edit-button" @click="switchToEditingMode">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import Ps from 'perfect-scrollbar';
import Util from 'utils/util.js';
import { mapGetters } from 'vuex';
import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import {addPatientFirstVisitTreatment, modPatientFirstVisitTreatment} from 'api/patient.js';
export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      hasComtAmongOtherMedicine: false, // 需不需要加33%
      copyInfo: {
        firstVisitType: '', // 初诊治疗类型
        treatmentType: '', // 治疗类型
        treatmentMethod: '', // 治疗手段
        treatmentTime: '', // 治疗时间
        remarks: '', // 备注

        medicineClassification: '', // 药物分类
        medicineName: '', // 药物商品名
        medicalSpecUsed: '', // 药物规格
        commonMedicineName: '', // 化学名
        dailyDosage: '', // 每日用量（mg）
        dailyDosagePian: '', // 每日用量（片）
        ledd: '',
        firstTime: '', // 初次用药时间
        yearsOfMedicine: '', // 用药年限
        whetherEffect: '', // 是否有效
        adverse: '', // 不良反应
        whetherContinue: '', // 是否继续服用
        stopTime: '', // 停药时间
        stopReason: '' // 停药原因
      },
      id: '',
      warningResults: {
        firstVisitType: '',
        treatmentType: '',
        // medicineClassification: '',
        medicineName: '', // 药物商品名
        medicalSpecUsed: '', // 药物规格
        dailyDosage: '',
        dailyDosagePian: '',
        yearsOfMedicine: ''
      },
      runClearVal: true, // 是否执行clearVal方法中的置空copyInfo操作
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      lockSubmitButton: false,
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'medicineInfo'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增初诊治疗';
      } else {
        return '初诊治疗';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    },
    verificationFieldList() {
      if (this.copyInfo.firstVisitType === 1) {
        return ['firstVisitType', 'medicineClassification', 'medicineName', 'commonMedicineName', 'medicalSpecUsed'];
      } else if (this.copyInfo.firstVisitType === 2) {
        return ['firstVisitType', 'treatmentType'];
      } else {
        return ['firstVisitType'];
      }
    },
    firstTreatmentTypeOptions() {
      // 初诊治疗类型的select
      return this.getOptions('firstVisitType');
    },
    medicineClassOpt() {
      // 药物类型的select
      return this.getOptions('firstVisitMedType');
    },
    medicineNameOpt() {
      // 药物商品名的select
      let transArr = this.getMedNameOptions(this.copyInfo.medicineClassification);
      if (this.copyInfo.medicineClassification === 9) {
        transArr[0].name = transArr[0].name + '（请在备注中说明）';
      }
      return transArr;
    },
    medicineSpec() {
      // 药物规格的select
      let spec = Util.getElement('medicineId', this.copyInfo.medicineName, this.medicineInfo).spec;
      spec = spec ? spec : [];
      // 如果只有一项，就把这一项自动显示出来
      // if (spec && spec.length === 1) {
      //   this.$nextTick(() => {
      //     this.$set(this.copyInfo, 'medicalSpecUsed', spec[0].specOral);
      //   });
      // }
      return spec;
    },
    commonMedicineName() {
      // 通用名
      // return this.medicineNameOpt.filter((obj) => {
      //   return obj.code === this.copyInfo.medicineName;
      // }).map((obj) => {
      //   return obj.commonName;
      // })[0];
      return this.medicineInfo.filter((obj) => {
        return obj.medicineId === this.copyInfo.medicineName;
      }).map((obj) => {
        return obj.commonName;
      })[0];
    },
    enhanceEffect() {
      // 如果是多巴胺类药物medicalType===0，则要看其它药物中是否存在 COMT 抑制剂，存在则有药效增益的
      // 如果是本身具有左旋多巴等效系数的 COMT 抑制剂，比如达灵复medicalType===3，同样是具有药效增益的
      // 如果是左旋多巴等效系数为 0 的 COMT 抑制剂，比如珂丹medicalType===3，也是视为具有药效增益，因为怎么算最后都是 0
      // 其它情况均不具有药效增益
      // 为true就乘以1.33，为false不乘
      let currMedicalType = Util.getElement('code', this.copyInfo.medicineName, this.medicineNameOpt).medicalType;
      return (currMedicalType === 0 && this.hasComtAmongOtherMedicine) || currMedicalType === 3;
    },
    leddAttr() {
      // LEDD
      let pieces = this.copyInfo.dailyDosagePian;

      let coefficient = this.enhanceEffect ? 1.33 : 1;

      let res = Math.round(this.levodopaFactor * pieces * 100000 * coefficient) / 100000.0;
      res = res || (res === 0) ? res : '';
      this.$set(this.copyInfo, 'ledd', res);
      return res;
    },
    leddAttr1() {
      let medicalSpecUsed = parseFloat(this.copyInfo.medicalSpecUsed, 10); // 药物规格（mg/片）
      let pieces = this.copyInfo.dailyDosagePian;
      let dailyDosage = pieces * medicalSpecUsed;

      dailyDosage = dailyDosage || (dailyDosage === 0) ? dailyDosage : '';
      this.$set(this.copyInfo, 'dailyDosage', dailyDosage);
      return dailyDosage;
    },
    levodopaFactor() {
      // 左旋多巴等效系数
      let spec = Util.getElement('code', this.copyInfo.medicineName, this.medicineNameOpt).spec;
      let levodopaFactor = Util.getElement('specOral', this.copyInfo.medicalSpecUsed, spec).levodopaFactor;
      return levodopaFactor;
    },
    treatmentTypeOpt() {
      // 非药物治疗治疗类型的select
      return this.getOptions('treatPro');
    },
    treatmentMethodOpt() {
      // 治疗手段的select
      return this.treatmentTypeOpt.filter((obj) => {
        return obj.code === this.copyInfo.treatmentType;
      }).map((obj) => {
        return obj.child;
      })[0];
    }
  },
  methods: {
    fieldHint(fieldName) {
      if (fieldName === 'ledd') {
        return '--根据用量自动计算--';
      } else if (fieldName === 'dailyDosage') {
        return '--根据用量自动计算--';
      }
    },
    clearVal(fieldName) {
      if (fieldName === 'firstVisitType') {
        for (let key in this.copyInfo) {
          if (key !== 'firstVisitType' && this.runClearVal) {
            this.$set(this.copyInfo, key, '');
          };
        };
      }

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
    },
    transform(id, arr) {
      arr = arr ? arr : [];
      return arr.filter((obj) => {
        return (parseInt(obj.typeCode, 10) || parseInt(obj.code, 10)) === id;
      }).map((obj) => {
        return (obj.typeName || obj.name);
      })[0];
    },
    showModal(cardOperation, item, hasComtAmongOtherMedicine) {
      this.completeInit = false;
      this.runClearVal = false;
      this.mode = cardOperation;
      this.hasComtAmongOtherMedicine = hasComtAmongOtherMedicine;
      // ----------------------
      this.$set(this.copyInfo, 'firstVisitType', item.firstVisitType);
      this.$set(this.copyInfo, 'medicineClassification', item.medicineClassification);
      this.$set(this.copyInfo, 'medicineName', item.medicineName);
      this.$set(this.copyInfo, 'medicalSpecUsed', item.medicalSpecUsed);
      this.$set(this.copyInfo, 'dailyDosage', item.dailyDosage);
      this.$set(this.copyInfo, 'dailyDosagePian', item.dailyDosagePian);
      this.$set(this.copyInfo, 'ledd', item.ledd);
      this.$set(this.copyInfo, 'firstTime', item.firstTime);
      this.$set(this.copyInfo, 'yearsOfMedicine', item.yearsOfMedicine);
      this.$set(this.copyInfo, 'whetherEffect', item.whetherEffect);
      this.$set(this.copyInfo, 'adverse', item.adverse);
      this.$set(this.copyInfo, 'whetherContinue', item.whetherContinue);
      this.$set(this.copyInfo, 'stopTime', item.stopTime);
      this.$set(this.copyInfo, 'stopReason', item.stopReason);
      this.$set(this.copyInfo, 'treatmentType', item.treatmentType);
      this.$set(this.copyInfo, 'treatmentMethod', item.treatmentMethod);
      this.$set(this.copyInfo, 'treatmentTime', item.treatmentTime);
      this.$set(this.copyInfo, 'remarks', item.remarks);

      // 编辑时的id
      this.id = item.id;
      // -------------------------
      if (this.mode === this.ADD_NEW_CARD) {
        for (let key in this.copyInfo) {
          this.$set(this.copyInfo, key, '');
        };
      };

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.updateScrollbar();
      this.$nextTick(() => {
        this.completeInit = true;
        this.runClearVal = true;
      });
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.scrollArea) {
          Ps.destroy(this.$refs.scrollArea);
          Ps.initialize(this.$refs.scrollArea, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    },
    updateWarning(fieldName) {
      if (fieldName === 'dailyDosage' || fieldName === 'dailyDosagePian' || fieldName === 'yearsOfMedicine') {
        let fieldVal = this.copyInfo[fieldName];
        if (fieldVal !== '' && !Util.checkIfNotMoreThanNDecimalNums(fieldVal, 5)) {
          this.$set(this.warningResults, fieldName, '请填入正数，最多5位小数');
        } else {
          this.$set(this.warningResults, fieldName, '');
        };
      } else if (this.completeInit && !this.copyInfo[fieldName] && this.copyInfo[fieldName] !== 0) {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode,
          child: type.childType
        });
      };
      return options;
    },
    getMedicalType() {
      let type = this.medicineInfo.filter((obj) => {
        return obj.medicineId === this.copyInfo.medicineName;
      }).map((obj) => {
        return obj.firstTreatMedicalType;
      })[0];

      // let type = this.medicineInfo.filter(function(obj) {
      //   return obj.medicineId === this.copyInfo.medicineName;
      // });

      this.copyInfo.medicineClassification = type;
      this.updateWarning('medicineName');
    },
    getMedNameOptions(fieldType) {
      return this.medicineInfo.filter((obj) => {
        return obj.firstTreatMedicalType === fieldType;
      }).map((obj) => {
        return {
          name: obj.medicineName,
          code: obj.medicineId,
          commonName: obj.commonName,
          medicalType: obj.medicalType,
          spec: obj.spec
        };
      });
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

      // 验证必填项 如果没填显示红框，显示必填项三个字
      for (let property in this.warningResults) {
        if (this.verificationFieldList.indexOf(property) >= 0 && this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      };
      // 如果显示了必填项三个字，说明验证没通过，就将确定按钮打开，允许再次验证，并退出
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      };

      // 验证完成，准备请求数据
      let submitData = Object.assign({}, this.copyInfo);
      reviseDateFormat(submitData);
      pruneObj(submitData);
      submitData.patientId = this.$route.params.id;
      if (this.mode === this.ADD_NEW_CARD) {
        addPatientFirstVisitTreatment(submitData).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        submitData.id = this.id;
        modPatientFirstVisitTreatment(submitData).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      };

    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_FIRSTTREATMENT_INFO);
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_FIRSTTREATMENT_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  },
  watch: {
    '$route.path'() {
      this.cancel();
    },
    // medicineNameOpt: function() {
    //   if (this.completeInit) {
    //     this.$set(this.copyInfo, 'medicineName', '');
    //   }
    // },
    medicineSpec: function() {
      if (this.completeInit) {
        this.$set(this.copyInfo, 'medicalSpecUsed', '');
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 110px;
@long-field-name-width: 160px;

.treatment-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .treatment-modal{
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content{
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 100%;
        min-height: 45px;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.half-line {
          width: 50%;
          .field-input {
            width: calc(~"92% - @{field-name-width}");
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
          &.long-field-name {
            width: @long-field-name-width;
          }
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          top: 0;
          left: @field-name-width;
          width: calc(~"96% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
          }
          .enhance {
            display: inline-block;
            margin-left: 2px;
            width: 60px;
            color: @green-color;
            text-align: center;
          }
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
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .el-textarea {
            margin-bottom: 15px;
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
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 15px auto 10px;
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
      &.submit-button, &.edit-button {
        background-color: @button-color;
       }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
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

