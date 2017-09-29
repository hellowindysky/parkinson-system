<template lang="html">
  <div class="operative-complication-modal-wrapper" v-show="displayModal">
    <div class="operative-complication-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div v-for="field in operativeComplicationTemplate" class="field" :class="{'whole-line': field.fieldName==='remarks'}">
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
              :class="{'warning': warningResults[field.fieldName]}" :type="getType(field.fieldName)"
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
      copyInfo: {},
      warningResults: {}
    };
  },
  computed: {
    ...mapGetters([
      'operativeComplicationDictionary',
      'operativeComplicationTemplate'
    ])
  },
  methods: {
    showModal(changeWay, info) {
      if (changeWay === this.ADD_DATA) {
        this.title = '新增术后并发症';
      } else if (changeWay === this.EDIT_DATA) {
        this.title = '术后并发症';
      }
      vueCopy(info, this.copyInfo);
      console.log(info);
      setTimeout(() => {
        console.log(this.operativeComplicationDictionary);
        console.log(this.operativeComplicationTemplate);
      }, 2000);
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      this.displayModal = false;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.operativeComplicationDictionary);
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
      return options;
    },
    getType(fieldName) {
      if (fieldName === 'remarks') {
        return 'textarea';
      } else {
        return 'text';
      }
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
    Bus.$on(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_OPERATIVE_COMPLICATION_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 100px;
@long-field-name-width: 160px;

.operative-complication-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .operative-complication-modal {
    position: relative;
    margin: auto 30px;
    padding: 0 40px;
    top: 3%;
    min-width: 660px;
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
