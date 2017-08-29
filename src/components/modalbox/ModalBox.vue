<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>
      <div class="field" v-for="field in template">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>
        <span class="field-input">
          <span v-if="getUIType(field)===1">
            <el-input v-model="item[field.fieldName]" :class="{'warning': false}"
             :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)"></el-input>
          </span>
          <span v-else-if="getUIType(field)===3">
            <el-select v-model="item[field.fieldName]" :class="{'warning': false}"
             :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)">
              <el-option v-for="type in getTypes(field)" :label="type.typeName"
               :value="type.typeCode" :key="type.typeCode"></el-option>
            </el-select>
          </span>
          <span v-else-if="getUIType(field)===6">
            <el-date-picker v-model="item[field.fieldName]" type="date" :placeholder="getMatchedField(field).cnFieldDesc"
             format="yyyy-MM-dd" @change="updateDate(field)"></el-date-picker>
          </span>
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

export default {
  data() {
    return {
      displayModal: false,
      modalType: '',
      title: '',
      item: {}
    };
  },
  computed: {
    ...mapGetters([
      'medHistoryTemplate',
      'diseaseHistoryTemplate',
      'familyHistoryTemplate',
      'coffeeHistoryTemplate',
      'teaHistoryTemplate',
      'smokeHistoryTemplate',
      'wineHistoryTemplate',
      'exerciseHistoryTemplate',
      'toxicExposureHistoryTemplate',

      'medHistoryDictionary',
      'diseaseHistoryDictionary',
      'familyHistoryDictionary',
      'coffeeHistoryDictionary',
      'teaHistoryDictionary',
      'smokeHistoryDictionary',
      'wineHistoryDictionary',
      'exerciseHistoryDictionary',
      'toxicExposureHistoryDictionary',

      'typeGroup'
    ]),
    dictionary() {
      if (this.modalType === this.MEDICINE_MODAL) {
        return this.medHistoryDictionary;
      } else if (this.modalType === this.DISEASE_MODAL) {
        return this.diseaseHistoryDictionary;
      } else if (this.modalType === this.FAMILY_MODAL) {
        return this.familyHistoryDictionary;
      } else if (this.modalType === this.PERSON_MODAL) {
        // 如果是个人史面板，则将几个子字典合并成一个新的总字典
        return [].concat(this.coffeeHistoryDictionary, this.teaHistoryDictionary,
           this.smokeHistoryDictionary, this.wineHistoryDictionary, this.exerciseHistoryDictionary);
      } else if (this.modalType === this.TOXIC_MODAL) {
        return this.toxicExposureHistoryDictionary;
      }
    },
    template() {
      if (this.modalType === this.MEDICINE_MODAL) {
        return this.medHistoryTemplate;
      } else if (this.modalType === this.DISEASE_MODAL) {
        return this.diseaseHistoryTemplate;
      } else if (this.modalType === this.FAMILY_MODAL) {
        return this.familyHistoryTemplate;
      } else if (this.modalType === this.PERSON_MODAL) {
        // 如果是个人史面板，则有几个子模版，需要在选择个人史类型后，自动确定新的模版
        return [];
      } else if (this.modalType === this.TOXIC_MODAL) {
        return this.toxicExposureHistoryTemplate;
      }
    }
  },
  methods: {
    showPanel(title, item, modalType) {
      this.displayModal = true;
      this.modalType = modalType;
      this.title = title;
      this.item = Object.assign({}, item);

      for (var i = 0; i < this.template.length; i++) {
        // console.log(this.template[i].fieldName);
      }
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      this.displayModal = false;
      console.log(this.item);
    },
    initItem() {
      // 遍历当前的 template，对其中的每个 field，检查 this.item 下有没有名字对应的属性值，没有的化，就初始化为 ''
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of this.template) {
        let name = field.fieldName;
        if (this.item[name] === undefined) {
          this.$set(this.item, name, '');
        }
      }
    },
    getMatchedField(field) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      var matchedField = this.dictionary.filter((dictionaryField) => {
        return dictionaryField.fieldName === field.fieldName;
      })[0];
      return matchedField ? matchedField : {};
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field).uiType;
    },
    getTypes(field) {
      // 在 typegroup 里面查找到 field 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(field);
      var typeInfo = this.typeGroup.filter((type) => {
        return type.typegroupcode === dictionaryField.fieldEnumId;
      })[0];
      return typeInfo ? typeInfo.types : [];
    },
    updateDate(field) {
      var dateStr = this.item[field.fieldName];
      var dateObj = new Date(dateStr);
      var year = dateObj.getFullYear();
      var month = dateObj.getMonth() + 1;
      var date = dateObj.getDate();
      this.item[field.fieldName] = year + '-' + month + '-' + date;
      this.updateWarning(field);
    },
    updateWarning(field) {
      return field;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MODAL_BOX, this.showPanel);
  },
  watch: {
    template: function() {
      // 只有在 template 更新后，才去初始化 this.item 的值
      this.initItem();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 125px;

.modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    background-color: @background-color;
    .title {
      padding: 10px 0;
    }
    .field {
      padding: 10px 0;
      text-align: left;
      display: inline-block;
      position: relative;
      width: 100%;
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
        right: 2%;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
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
      margin: 20px auto 0;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 20px;
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
