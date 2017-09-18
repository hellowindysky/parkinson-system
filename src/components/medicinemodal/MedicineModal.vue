<template lang="html">
  <div class="medicine-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field" v-for="field in firstTemplateGroup">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
              <span v-if="field.fieldName==='commonName'">{{commonName}}</span>
              <span v-else-if="field.fieldName==='medicalType'">{{medicalType}}</span>
              <span v-else-if="field.fieldName==='totalMeasure'">{{totalMeasure}} mg</span>
              <span v-else>{{medicine[field.fieldName]}}</span>
            </span>
            <!-- <el-input v-else-if="getUIType(field.fieldName)===1" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
             :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)">
            </el-input> -->
            <el-select v-else-if="getUIType(field.fieldName)===3" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
             :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
             <el-option v-for="option in getOptions(field.fieldName)" :label="option.name"
              :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>

        <div class="form-wrapper" ref="formWrapper">
          <table class="form">
            <tr class="row first-row">
              <td class="col col-id">
                序号
              </td>
              <td class="col col-time">
                时间
                <span class="required-mark">*</span>
              </td>
              <td class="col col-amount">
                服用量
                <span class="required-mark">*</span>
              </td>
              <td class="col col-unit">
                计算单位
              </td>
            </tr>
            <tr v-for="i in rowArray" class="row">
              <td class="col col-id">{{i}}</td>
              <td class="col col-time">
                <el-time-select v-model="medicine.patientMedicineDetail[i - 1].takeTime"
                 :class="{'warning': false}" placeholder="具体时间点">
                </el-time-select>
              </td>
              <td class="col col-amount">
                <el-input v-model="medicine.patientMedicineDetail[i - 1].takeDose"
                 :class="{'warning': false}" placeholder="单次服用量"></el-input>
              </td>
              <td class="col col-unit">{{medicineUnit}}</td>
            </tr>
          </table>
        </div>

        <div class="field" v-for="field in thirdTemplateGroup" :class="{'whole-line': field.fieldName==='remarks'}">
          <span class="field-name" :class="{'long-field-name': isLongName(field.fieldName)}">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span class="field-input"
          :class="{'long-field-name': isLongName(field.fieldName)}">
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
              <span v-if="field.fieldName==='levodopaDose'">{{levodopaDose}}</span>
              <span v-else>{{medicine[field.fieldName]}}</span>
            </span>
            <el-input v-else-if="getUIType(field.fieldName)===1" v-model="medicine[field.fieldName]"
             :class="{'warning': warningResults[field.fieldName]}" :type="getInputType(field.fieldName)"
             :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)">
            </el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: false,
      title: '',
      medicine: {},
      originalMedicine: {},
      warningResults: {},
      completeInit: false
    };
  },
  computed: {
    ...mapGetters([
      'medicineDictionary',
      'medicineTemplateGroups',
      'medicineInfo',
      'typeGroup'
    ]),
    firstTemplateGroup() {
      return this.medicineTemplateGroups[0] ? this.medicineTemplateGroups[0] : [];
    },
    secondTemplateGroup() {
      return this.medicineTemplateGroups[1] ? this.medicineTemplateGroups[1] : [];
    },
    thirdTemplateGroup() {
      return this.medicineTemplateGroups[2] ? this.medicineTemplateGroups[2] : [];
    },
    totalTemplate() {
      // 把 template 的几个 group 拼到一起
      return [].concat(this.firstTemplateGroup, this.secondTemplateGroup, this.thirdTemplateGroup);
    },
    medicineInfoObj() {
      // 根据最新的 medicineId，去 this.medicineInfo 里面获取相应的对象，从而获得该类型药物的详细参考信息
      return Util.getElement('medicineId', this.medicine.medicineId, this.medicineInfo);
    },
    commonName() {
      // 通用名，这个计算属性是用来渲染的，而每次更新这个计算属性的时候，都会为 this.medicine 进行相应的赋值
      let commonName = this.medicineInfoObj.commonName;
      this.medicine.commonName = commonName;
      return commonName;
    },
    medicalType() {
      // 药物类型，这个计算属性也是用来渲染的，而每次更新这个计算属性的时候，都会为 this.medicine 进行相应的赋值
      let medicalTypeNum = this.medicineInfoObj.medicalType;
      let typeInfo = Util.getElement('typegroupcode', 'durgType', this.typeGroup);  // 数据库拼写错误，把 drug 拼成了 drug
      let medicalType = Util.getElement('typeCode', medicalTypeNum, typeInfo.types).typeName;
      this.medicine.medicalType = medicalType;
      return medicalType;
    },
    totalAmount() {
      // 这个变量用来计算服用量之和，是一个数字，我们再利用它来计算单日总剂量和单日左旋多巴等效剂量
      let amount = 0;
      if (!this.medicine.patientMedicineDetail || !(this.medicine.patientMedicineDetail instanceof Array)) {
        this.medicine.totalMeasure = 0;
        return 0;
      }
      for (let item of this.medicine.patientMedicineDetail) {
        let dose = parseInt(item.takeDose, 10);
        dose = isNaN(dose) ? 0 : dose;  // 如果上一步算出来的为 NaN，那么就取 0
        amount += dose;
      }
      return amount;
    },
    totalMeasure() {
      // 日总剂量，由药物规格和每日总服用量相乘得到。同时，每次更新这个计算属性的时候，同时更新 this.medicine 下的相应属性值
      let spec = this.medicalSpec;
      spec = isNaN(spec) ? 0 : spec;
      this.medicine.totalMeasure = this.totalAmount * spec;
      return this.totalAmount * spec;
    },
    computeUnit() {
      // 计算单位，是一个数字，这个计算属性是在和服务器进行数据交互时使用的，在 rowArray() 中有用到
      return this.medicineInfoObj.oralUnit;
    },
    medicineUnit() {
      // 计算单位，它是 this.computeUnit 所对应的 字符串
      let unitTypes = Util.getElement('typegroupcode', 'oralUnit', this.typeGroup).types;
      return Util.getElement('typeCode', this.computeUnit, unitTypes).typeName;
    },
    medicalSpec() {
      // 这个变量用来保存当前药物的规格，是一个数字
      let specGroups = this.medicineInfoObj.spec ? this.medicineInfoObj.spec : [];
      let spec = Util.getElement('specOral', this.medicine.medicalSpecUsed, specGroups);
      return spec.medicalPec;   // 你没有看错，数据库里面就拼写错误了，正确的应该是 'medicalSpec'，少了一个 S
    },
    rowArray() {
      var arr = [];   // 这个数组用来帮助生成表格，其中的元素就是每行的序号

      // this.medicine对象下有个属性，patientMedicineDetail，它是一个数组，每个原素都是一个对象。
      // 这个数组的长度 始终和 this.rowArray 保持一致，因此把这个数组的初始化逻辑放在了 rowArray() 中
      this.$set(this.medicine, 'patientMedicineDetail', []);
      for (let i = 0; i < this.medicine.usages; i++) {
        this.medicine.patientMedicineDetail.push({});

        // 这个 secondTemplateGroup 数组里的原素，对应着表格的列，也对应着 patientMedicineDetail 里的不同属性
        for (let field of this.secondTemplateGroup) {
          var fieldName = field.fieldName;

          var value = '';
          // 下面这个是为了初始化 this.medicine 的时候不覆盖掉 originalMedicine.patientMedicineDetail 的值，
          // 就设定了一个条件 ———— 如果药物名和每日服药次数都是原来的值的话，就把原来的每次服药时间 和 每次服用量 都复制过来
          if (this.medicine.usages === this.originalMedicine.usages && this.medicine.medicineId &&
           this.medicine.medicineId === this.originalMedicine.medicineId) {

            // 记得验证原始值是否存在
            if (this.originalMedicine.patientMedicineDetail &&
             this.originalMedicine.patientMedicineDetail[i]) {
              value = this.originalMedicine.patientMedicineDetail[i][fieldName];
            }
          }

          if (fieldName === 'computUnit') { // 数据库拼写错误，掉了一个 e
            value = this.computeUnit;
          }
          value = value ? value : '';
          this.$set(this.medicine.patientMedicineDetail[i], fieldName, value);
        }
      }

      for (let i = 1; i <= this.medicine.usages; i++) {
        arr.push(i);
      }

      this.updateScrollbar();
      return arr;
    },
    levodopaDose() {
      // 单日左旋多巴等效剂量，更新这个计算属性的同时也更新 this.medicine.levodopaDose
      let levodopaFactor = this.medicine.levodopaFactorUsed;
      this.medicine.levodopaDose = this.totalAmount * levodopaFactor;
      return this.totalAmount * levodopaFactor;
    }
  },
  methods: {
    showModal(title, item) {
      this.title = title;
      this.displayModal = true;
      this.completeInit = false;

      setTimeout(() => {
        // console.log('firstTemplate', this.firstTemplateGroup);
        // console.log('secondTemplate', this.secondTemplateGroup);
        console.log('thirdTemplate', this.thirdTemplateGroup);
        // console.log('dictionary', this.medicineDictionary);
        // console.log('medicineInfo', this.medicineInfo);
      }, 2000);

      this.initMedicine(item);
      console.log(this.medicine);

      for (let field of this.totalTemplate) {
        this.updateField(field);
      }

      // 改变 this.medicine 的时候会触发 warningResults 的跟踪变化（这里的自动触发是由 v-model 造成的）
      // 因此这一步要等到 this.medicine 变化结束之后再执行，我们将其放到下一个事件循环 tick 中
      this.$nextTick(() => {
        this.clearWarning();

        // 这里加一个开关，用来标记数字是否会改变
        this.completeInit = true;
      });
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      console.log(this.medicine);
      // this.displayModal = false;
    },
    initMedicine(item) {
      // originalMedicine 是原始数据，在修改表格的时候需要参考这个对象，medicine 是我们编辑和上传的对象
      this.medicine = Object.assign({}, item);
      this.originalMedicine = Object.assign({}, item);

      // 遍历 firstTemplateGroup，对其中的每个 field，检查 this.medicine 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of this.firstTemplateGroup.concat(this.thirdTemplateGroup)) {
        let name = field.fieldName;
        if (this.medicine[name] === undefined) {
          this.$set(this.medicine, name, '');
        }
      }
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.medicineDictionary);
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getOptions(fieldName) {
      // 为下拉框准备列表
      var options = [];
      var dictionaryField = this.getMatchedField(fieldName);
      if (dictionaryField.fieldName === 'medicineId') {
        for (let medicineItem of this.medicineInfo) {
          options.push({name: medicineItem.medicineName, code: medicineItem.medicineId});
        }

      } else if (dictionaryField.fieldName === 'medicalSpecUsed') {
        let specGroups = this.medicineInfoObj.spec ? this.medicineInfoObj.spec : [];
        for (let spec of specGroups) {
          options.push({name: spec.specOral, code: spec.specOral});
        }

      } else {
        // 如果是其它下拉框，属于普通字段，去 typeGroup 里面查就可以了
        let typeInfo = Util.getElement('typegroupcode', dictionaryField.fieldName, this.typeGroup);
        let types = typeInfo.types ? typeInfo.types : [];
        for (let type of types) {
          options.push({name: type.typeName, code: type.typeCode});
        }
      }
      return options;
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateField(field) {
      this.updateWarning(field);

      // 如果修改了药物名称 (medicineId)，那么就将药物规格清空，注意这一步逻辑一定要在初始化之后才会执行
      if (field.fieldName === 'medicineId' && this.completeInit) {
        this.medicine.medicalSpecUsed = '';
      }
    },
    isLongName(name) {
      const LONG_NAME_LIST = ['levodopaFactorUsed', 'levodopaDose'];
      if (LONG_NAME_LIST.indexOf(name) > -1) {
        return true;
      } else {
        return false;
      }
    },
    getInputType(name) {
      return name === 'remarks' ? 'textarea' : 'text';
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.formWrapper);
        Ps.initialize(this.$refs.formWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var fieldValue = this.medicine[fieldName];
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
          this.$set(this.warningResults, fieldName, '必填项');
          return;
        }
      }

      if (fieldValue && fieldValue.toString().indexOf(' ') > -1 && fieldName !== 'remarks') {
        // 允许备注信息里面有空格
        this.$set(this.warningResults, fieldName, '不能包含空格');

      } else {
        // 初始化组件的时候，对应字段的警告文本为 undefined，判断之后，就为实际文本或 null
        // null 代表该字段项的填写没有毛病
        this.$set(this.warningResults, fieldName, null);
      }
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MEDICINE_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_MEDICINE_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 80px;
@long-field-name-width: 160px;

@col-id-width: 100px;
@col-time-width: 200px;
@col-amount-width: 150px;
@col-unit-width: 150px;

.medicine-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .medicine-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 5%;
    width: 660px;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      .field {
        padding: 5px 0;
        text-align: left;
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        text-align: left;
        transform: translateX(10px);  // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 5%;
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
          position: absolute;
          top: 0;
          left: @field-name-width;
          right: 10%;
          line-height: @field-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
          }
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
          .el-textarea {
            vertical-align: middle;
            transform: translateY(5px);
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
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .form-wrapper {
        position: relative;
        max-height: 170px;
        width: 100%;
        border: 1px solid @inverse-font-color;
        overflow: hidden;
        .form {
          position: relative;
          margin-bottom: 5px;
          width: 100%;
          // left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
          border-spacing: 0;
          .row {
            height: 45px;
            &.first-row {
              background-color: @screen-color;
              height: 30px;
            }
            .col {
              font-size: @normal-font-size;
              text-align: center;
              &.col-id {
                width: @col-id-width;
              }
              &.col-time {
                width: @col-time-width;
              }
              &.col-amount {
                width: @col-amount-width;
              }
              &.col-unit {
                width: @col-unit-width;
              }
              .required-mark {
                color: red;
                font-size: 20px;
                vertical-align: middle;
              }
              .el-input {
                margin-left: 2%;
                width: 90%;
                .el-input__inner {
                  height: 30px;
                  border: none;
                  background-color: @screen-color;
                  text-align: center;
                }
              }
              .warning .el-input__inner {
                border: 1px solid red;
              }
            }
          }
        }
        .ps__scrollbar-y-rail {
          position: absolute;
          top: 0;
          width: 10px;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s, padding 0.2s;
          .ps__scrollbar-y {
            position: relative;
            background-color: #aaa;
          }
        }
        &:hover {
          .ps__scrollbar-y-rail {
            opacity: 0.6;
          }
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
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
      &.submit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style>
