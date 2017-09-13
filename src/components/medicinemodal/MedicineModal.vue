<template lang="html">
  <div class="medicine-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal">
      <h3 class="title">{{title}}</h3>
      <div class="field" v-for="field in medicineTemplate">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{warningResults[field.fieldName]}}</span>
          <el-input v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
           :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)"></el-input>
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
      warningResults: {}
    };
  },
  computed: {
    ...mapGetters([
      'medicineDictionary',
      'medicineTemplate'
    ])
  },
  methods: {
    showModal(title, item) {
      this.title = title;
      this.displayModal = true;
      // console.log(this.medicineTemplate);
      // console.log(this.medicineDictionary);

      this.medicine = Object.assign({}, item);
      console.log(this.medicine);
      this.initMedicine();
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
      for (let field of this.medicineTemplate) {
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
