<template lang="html">
  <div class="treatment-modal-wrapper" v-show="displayModal">
    <div class="treatment-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name long-field-name">
            初诊治疗类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(copyInfo.firstVisitType,firstTreatmentTypeOptions)}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.firstVisitType}}</span>
            <el-select v-model="copyInfo.firstVisitType" placeholder="请选择初诊治疗类型" clearable
             @change="updateWarning('firstVisitType'),clearVal(['firstVisitType'])" :class="{'warning': warningResults.firstVisitType}" >
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
          <div class="field">
            <span class="field-name long-field-name">
              药物分类:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.medicineClassification, medicineClassOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.medicineClassification}}</span>
              <el-select v-model="copyInfo.medicineClassification" placeholder="请选择药物分类" clearable
               @change="updateWarning('medicineClassification'),clearVal(['firstVisitType','medicineClassification'])"
                :class="{'warning': warningResults.medicineClassification}" >
                <el-option
                 v-for="item in medicineClassOpt"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              药物商品名:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <!-- <span>{{copyInfo.medicineName}}</span> -->
              <span>{{transform(copyInfo.medicineName,medicineNameOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="copyInfo.medicineName" placeholder="请选择药物名称" clearable >
                <el-option
                 v-for="item in medicineNameOpt"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              化学名:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{commonMedicineName}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="commonMedicineName" placeholder="选择药物名称自动匹配" disabled></el-input>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              每日用量（mg）:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.dailyDosage}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.dailyDosage}}</span>
              <el-input v-model="copyInfo.dailyDosage" placeholder="请输入每日用量" :class="{'warning': warningResults.dailyDosage}"
               @change="updateWarning('dailyDosage')"></el-input>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              初次用药时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.firstTime}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.firstTime" type="date" placeholder="请选择初次用药时间" clearable
               :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.remarks}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="copyInfo.remarks" type="textarea" placeholder="请输入备注" :maxlength="500"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 药物治疗才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->


        <!-- 以下是 非药物治疗才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-if="copyInfo.firstVisitType===2">

          <div class="field">
            <span class="field-name long-field-name">
              治疗类型:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(copyInfo.treatmentType,treatmentTypeOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.treatmentType}}</span>
              <el-select v-model="copyInfo.treatmentType" clearable placeholder="请选择治疗类型"
               @change="updateWarning('treatmentType'),clearVal(['firstVisitType','treatmentType'])"
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
            <span class="field-name long-field-name">
              治疗手段:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <!-- <span>{{copyInfo.treatmentMethod}}</span> -->
              <span>{{transform(copyInfo.treatmentMethod,treatmentMethodOpt)}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
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
            <span class="field-name long-field-name">
              治疗时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.treatmentTime}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.treatmentTime" type="date" placeholder="请选择治疗时间" clearable
               :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.remarks}}</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="copyInfo.remarks" type="textarea" placeholder="请输入备注" :maxlength="500"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 非药物治疗才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      </div>

      <div class="seperate-line" v-show="true"></div>

      

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit" class="button edit-button" @click="switchToEditingMode">编辑</div>

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
      displayModal: false,
      mode: '',
      completeInit: false,
      copyInfo: {
        firstVisitType: '', // 初诊治疗类型
        treatmentType: '', // 治疗类型
        treatmentMethod: '', // 治疗手段
        treatmentTime: '', // 治疗时间
        remarks: '', // 备注

        medicineClassification: '', // 药物分类
        medicineName: '', // 药物名称
        // commonMedicineName: '', // 通用名
        dailyDosage: '', // 每日用量
        firstTime: '' // 初次用药时间
      },
      id: '',
      warningResults: {
        firstVisitType: '',
        treatmentType: '',
        medicineClassification: '',
        dailyDosage: ''
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
        return ['firstVisitType', 'medicineClassification'];
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
      // 药物分类的select
      return this.getOptions('firstVisitMedType');
    },
    medicineNameOpt() {
      // 药物名称的select
      return this.getMedNameOptions(this.copyInfo.medicineClassification);
    },
    commonMedicineName() {
      // 通用名
      return this.medicineNameOpt.filter((obj) => {
        return obj.code === this.copyInfo.medicineName;
      }).map((obj) => {
        return obj.commonName;
      })[0];
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
    clearVal(fieldName) {
      for (let key in this.copyInfo) {
        if (fieldName.indexOf(key) === -1 && this.runClearVal) {
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
    },
    transform(id, arr) {
      arr = arr ? arr : [];
      return arr.filter((obj) => {
        return (parseInt(obj.typeCode, 10) || parseInt(obj.code, 10)) === id;
      }).map((obj) => {
        return (obj.typeName || obj.name);
      })[0];
    },
    showModal(cardOperation, item) {
      this.completeInit = false;
      this.runClearVal = false;
      this.mode = cardOperation;
      // ----------------------
      this.$set(this.copyInfo, 'firstVisitType', item.firstVisitType);
      this.$set(this.copyInfo, 'treatmentType', item.treatmentType);
      this.$set(this.copyInfo, 'treatmentMethod', item.treatmentMethod);
      this.$set(this.copyInfo, 'treatmentTime', item.treatmentTime);
      this.$set(this.copyInfo, 'remarks', item.remarks);
      this.$set(this.copyInfo, 'medicineClassification', item.medicineClassification);
      this.$set(this.copyInfo, 'medicineName', item.medicineName);
      this.$set(this.copyInfo, 'dailyDosage', item.dailyDosage);
      this.$set(this.copyInfo, 'firstTime', item.firstTime);

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
      this.completeInit = true;
      this.displayModal = true;
      this.updateScrollbar();
      this.$nextTick(() => {
        this.runClearVal = true;
      });
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updateWarning(fieldName) {
      if (fieldName === 'dailyDosage') {
        let fieldVal = this.copyInfo[fieldName];
        if (fieldVal !== '' && !Util.checkIfNotMoreThanNDecimalNums(fieldVal, 7)) {
          this.$set(this.warningResults, fieldName, '请填入正数');
        } else {
          this.$set(this.warningResults, fieldName, '');
        };
      } else if (this.completeInit && !this.copyInfo[fieldName] && this.copyInfo[fieldName] !== 0) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
      // this.$set(this.warningResults, fieldName, null);
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
    getMedNameOptions(fieldType) {
      return this.medicineInfo.filter((obj) => {
        return obj.firstTreatMedicalType === fieldType;
      }).map((obj) => {
        return {
          name: obj.medicineName,
          code: obj.medicineId,
          commonName: obj.commonName
        };
      });
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
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_FIRSTTREATMENT_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 90px;
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
          left: @long-field-name-width;
          width: calc(~"96% - @{long-field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
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

