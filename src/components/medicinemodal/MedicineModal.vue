<template lang="html">
  <div class="medicine-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal">
      <h3 class="title">{{title}}</h3>
      <div class="field" v-for="field in firstTemplateGroup">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark">*</span>
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
    secondeTemplateGroup() {
      return this.medicineTemplateGroups[1] ? this.medicineTemplateGroups[1] : [];
    },
    thirdTemplateGroup() {
      return this.medicineTemplateGroups[2] ? this.medicineTemplateGroups[2] : [];
    },
    medicalSpec() {
      // 这个变量用来保存当前药物的规格，是一个数字，默认是 0
      // 先根据 medicineId 去 this.medicineInfo 里面找到对应的药物
      let targetMedicine = Util.getElement('medicineId', this.medicine.medicineId, this.medicineInfo);
      let specGroups = targetMedicine.spec ? targetMedicine.spec : [];
      let spec = Util.getElement('specOral', this.medicine.medicalSpecUsed, specGroups);
      return spec.medicalPec;   // 你没有看错，数据库里面就拼写错误了，正确的应该是 'medicalSpec'
    }
  },
  methods: {
    showModal(title, item) {
      this.title = title;
      this.displayModal = true;
      this.completeInit = false;

      setTimeout(() => {
        console.log('firstTemplate', this.firstTemplateGroup);
        console.log('dictionary', this.medicineDictionary);
        console.log('medicineInfo', this.medicineInfo);
      }, 2000);

      this.medicine = Object.assign({}, item);
      console.log(this.medicine);
      this.initMedicine();

      for (let field of [].concat(this.firstTemplateGroup, this.secondeTemplateGroup, this.thirdTemplateGroup)) {
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
      this.displayModal = false;
    },
    initMedicine() {
      // 遍历当前的 template，对其中的每个 field，检查 this.medicine 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of this.firstTemplateGroup) {
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
        let typeInfo = Util.getElement('typegroupcode', 'medType', this.typeGroup);
        this.medicine['medicalType'] = Util.getElement('typeCode', medicalTypeNum, typeInfo.types).typeName;

        // 药物规格
        console.log(this.completeInit);
        if (this.completeInit) {
          this.medicine['medicalSpecUsed'] = '';
          console.log(this.medicine['medicalSpecUsed']);
        }
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
    top: 10%;
    width: 600px;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      padding: 10px 0;
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
