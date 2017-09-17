<template lang="html">
  <div class="medicine-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal">
      <h3 class="title">{{title}}</h3>
      <div class="field" v-for="field in firstTemplateGroup">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{warningResults[field.fieldName]}}</span>
          <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
            <span>{{medicine[field.fieldName]}}</span>
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
            <el-time-select v-model="medicine.patientMedicineDetail[i - 1].takeTime" :class="{'warning': false}" placeholder="具体时间点">
            </el-time-select>
          </td>
          <td class="col col-amount">
            <el-input v-model="medicine.patientMedicineDetail[i - 1].takeDose" :class="{'warning': false}" placeholder="单次服用量"></el-input>
          </td>
          <td class="col col-unit">{{medicineUnit}}</td>
        </tr>
      </table>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
      completeInit: false,
      computeUnit: 0,
      medicineUnit: ''
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
    medicalSpec() {
      // 这个变量用来保存当前药物的规格，是一个数字，默认是 0
      // 先根据 medicineId 去 this.medicineInfo 里面找到对应的药物
      let targetMedicine = Util.getElement('medicineId', this.medicine.medicineId, this.medicineInfo);
      let specGroups = targetMedicine.spec ? targetMedicine.spec : [];
      let spec = Util.getElement('specOral', this.medicine.medicalSpecUsed, specGroups);
      return spec.medicalPec;   // 你没有看错，数据库里面就拼写错误了，正确的应该是 'medicalSpec'
    },
    rowArray() {
      var arr = [];   // 这个数组用来帮助生成表格，其中的元素就是每行的序号

      // this.medicine对象下有个属性，patientMedicineDetail，它是一个数组，每个原素都是一个对象。
      // 这个数组的长度 始终和 this.rowArray 保持一致，因此把这个数组的初始化逻辑放在了 rowArray() 中
      this.medicine.patientMedicineDetail = [];
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
            value = this.originalMedicine.patientMedicineDetail[i][fieldName];
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
      return arr;
    }
  },
  methods: {
    showModal(title, item) {
      this.title = title;
      this.displayModal = true;
      this.completeInit = false;

      setTimeout(() => {
        // console.log('firstTemplate', this.firstTemplateGroup);
        console.log('secondTemplate', this.secondTemplateGroup);
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
      var options = [];
      var dictionaryField = this.getMatchedField(fieldName);
      if (dictionaryField.fieldName === 'medicineId') {
        for (let medicineItem of this.medicineInfo) {
          options.push({name: medicineItem.medicineName, code: medicineItem.medicineId});
        }

      } else if (dictionaryField.fieldName === 'medicalSpecUsed') {
        // 如果是药物规格，则先根据 medicineId 去 this.medicineInfo 里面找到对应的药物
        let targetMedicine = Util.getElement('medicineId', this.medicine.medicineId, this.medicineInfo);
        let specGroups = targetMedicine.spec ? targetMedicine.spec : [];
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

      // 字段的修改会影响到关联文本的变动
      if (field.fieldName === 'medicineId') {
        // 通用名
        let targetMedicine = Util.getElement('medicineId', this.medicine.medicineId, this.medicineInfo);
        this.medicine['commonName'] = targetMedicine.commonName;

        // 药物类型
        let medicalTypeNum = targetMedicine.medicalType;
        let typeInfo = Util.getElement('typegroupcode', 'durgType', this.typeGroup);  // 数据库拼写错误，把 drug 拼成了 drug
        this.medicine['medicalType'] = Util.getElement('typeCode', medicalTypeNum, typeInfo.types).typeName;

        // 药物规格
        if (this.completeInit) {
          this.medicine['medicalSpecUsed'] = '';
        }

        // 药物计算单位
        var unitTypes = Util.getElement('typegroupcode', 'oralUnit', this.typeGroup).types;
        this.computeUnit = targetMedicine.oralUnit;
        console.log(targetMedicine);
        this.medicineUnit = Util.getElement('typeCode', this.computeUnit, unitTypes).typeName;
      }
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

      if (fieldValue && fieldValue.toString().indexOf(' ') > -1) {
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
    .field {
      padding: 5px 0;
      text-align: left;
      display: inline-block;
      position: relative;
      width: 50%;
      height: @field-height;
      text-align: left;
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
      .field-input {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        right: 10%;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
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
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
    }
    .form {
      position: relative;
      left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
      border: 1px solid @inverse-font-color;
      border-spacing: 0;
      width: @col-id-width + @col-time-width + @col-amount-width + @col-unit-width;
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
