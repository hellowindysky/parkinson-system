<template lang="html">
  <div class="surgical-method-modal-wrapper" v-show="displayModal">
    <div class="surgical-method-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div v-for="field in surgicalMethodTemplate" class="field" :class="{'whole-line': field.fieldName==='remarks'}">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <el-select v-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
             :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)">
             <el-option v-for="option in getOptions(field.fieldName)" :label="option.name"
              :value="option.code" :key="option.code"></el-option>
            </el-select>
            <el-date-picker v-else-if="getUIType(field.fieldName)===6" v-model="copyInfo[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}"></el-date-picker>
            <el-input v-else-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}" type="textarea"
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
// import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { vueCopy } from 'utils/helper.js';

export default {
  data() {
    return {
      displayModal: false,
      title: '',
      warningResults: {},
      copyInfo: {}
    };
  },
  computed: {
    ...mapGetters([
      'surgicalMethodDictionary',
      'surgicalMethodTemplate'
    ])
  },
  methods: {
    showModal(changeWay, info) {
      if (changeWay === this.ADD_DATA) {
        this.title = '新增手术方案';
      } else if (changeWay === this.EDIT_DATA) {
        this.title = '手术方案';
      }
      vueCopy(info, this.copyInfo);
      console.log(this.copyInfo);
      setTimeout(() => {
        // console.log(this.surgicalMethodDictionary);
        // console.log(this.surgicalMethodTemplate);
      }, 2000);
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      // 先将日期格式改成符合服务器传输的格式
      this.copyInfo.surgicalDate = Util.simplifyDate(this.copyInfo.surgicalDate);
      console.log(this.copyInfo);

      // 点击确定按钮的时候，需要手动为这些字段校验一遍
      for (let field of this.surgicalMethodTemplate) {
        this.updateWarning(field);
      }

      // 然后检查 warningResults，看填写的数据是否合规
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p) && this.warningResults[p]) {
          return;
        }
      }

      // 到这里，就可以提交了
      this.displayModal = false;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.surgicalMethodDictionary);
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getOptions(fieldName) {
      // 为下拉框准备列表
      var options = [];
      if (fieldName) {
        options = [];
      }
      // var dictionaryField = this.getMatchedField(fieldName);
      // if (dictionaryField.fieldName === 'medicineId') {
      //   for (let medicineItem of this.medicineInfo) {
      //     options.push({name: medicineItem.medicineName, code: medicineItem.medicineId});
      //   }
      //
      // } else if (dictionaryField.fieldName === 'medicalSpecUsed') {
      //   let specGroups = this.medicineInfoObj.spec ? this.medicineInfoObj.spec : [];
      //   for (let spec of specGroups) {
      //     options.push({name: spec.specOral, code: spec.specOral});
      //   }
      //
      // } else {
      //   // 如果是其它下拉框，属于普通字段，去 typeGroup 里面查就可以了
      //   var typegroupName = dictionaryField.fieldName;
      //   if (dictionaryField.fieldName === 'sideeffectType') {
      //     typegroupName = 'drugEffect';
      //   }
      //   let typeInfo = Util.getElement('typegroupcode', typegroupName, this.typeGroup);
      //   let types = typeInfo.types ? typeInfo.types : [];
      //   for (let type of types) {
      //     options.push({name: type.typeName, code: type.typeCode});
      //   }
      // }
      return options;
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var fieldValue = this.copyInfo[fieldName];
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          this.$set(this.warningResults, fieldName, '必填项');
          return;
        }
      }
    }
  },
  mounted() {
    Bus.$on(this.SHOW_SURGICAL_METHOD_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SURGICAL_METHOD_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 80px;
@long-field-name-width: 160px;

.surgical-method-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .surgical-method-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
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
            right: 4%;
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
          right: 8%;
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
