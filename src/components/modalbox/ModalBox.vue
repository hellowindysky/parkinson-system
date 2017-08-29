<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>

      <!-- 这个 field 是专门为个人史准备的，用来确定最终的 template 到底是哪个子类 -->
      <div class="field" v-show="this.modalType === this.PERSON_MODAL">
        <span class="field-name">
          个人史类型
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{getWarningText('subModal')}}</span>
          <el-select v-model="subModalType" :class="{'warning': warningResults['subModal']}"
           placeholder="请输入个人史类型" @change="chooseSubModal">
            <el-option label="饮酒史" :value="WINE_MODAL"></el-option>
            <el-option label="吸烟史" :value="SMOKE_MODAL"></el-option>
            <el-option label="喝茶史" :value="TEA_MODAL"></el-option>
            <el-option label="咖啡史" :value="COFFEE_MODAL"></el-option>
            <el-option label="锻炼史" :value="EXERCISE_MODAL"></el-option>
          </el-select>
        </span>
      </div>
      <div class="seperate-line" v-show="this.modalType === this.PERSON_MODAL && this.subModalType !== ''"></div>

      <div class="field" v-for="field in template">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
          <span v-if="getUIType(field)===1">
            <el-input v-model="item[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
             :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)"></el-input>
          </span>
          <span v-else-if="getUIType(field)===3">
            <el-select v-model="item[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
             :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)">
              <el-option v-for="type in getTypes(field)" :label="type.typeName"
               :value="type.typeCode" :key="type.typeName"></el-option>
            </el-select>
          </span>
          <span v-else-if="getUIType(field)===6">
            <el-date-picker v-model="item[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}" type="date"
             :placeholder="getMatchedField(field).cnFieldDesc" format="yyyy-MM-dd" @change="updateDate(field)"></el-date-picker>
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
import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: false,
      modalType: '',
      subModalType: '',
      title: '',
      item: {},
      warningResults: {}
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
        if (this.subModalType === this.WINE_MODAL) {
          return this.wineHistoryTemplate;
        } else if (this.subModalType === this.TEA_MODAL) {
          return this.teaHistoryTemplate;
        } else if (this.subModalType === this.COFFEE_MODAL) {
          return this.coffeeHistoryTemplate;
        } else if (this.subModalType === this.SMOKE_MODAL) {
          return this.smokeHistoryTemplate;
        } else if (this.subModalType === this.EXERCISE_MODAL) {
          return this.exerciseHistoryTemplate;
        }

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

      // 每次打开这个模态框，都会重新初始化 this.item
      this.initItem();

      for (var i = 0; i < this.template.length; i++) {
        // console.log(this.template[i].fieldName);
      }
    },
    cancel() {
      this.displayModal = false;
      this.clearWarning();
      this.subModalType = '';
    },
    submit() {
      // 对于特殊的个人史，检查 subModal 字段是否有被选择
      if (this.subModalType === '') {
        this.$set(this.warningResults, 'subModal', '请选择');
      }

      // 检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
      for (let field of this.template) {
        this.updateWarning(field);
      }
      for (let fieldName in this.warningResults) {
        if (this.warningResults[fieldName]) {
          return false;
        }
      }

      this.displayModal = false;
      this.clearWarning();
      this.subModalType = '';
    },
    initItem() {
      // 遍历当前的 template，对其中的每个 field，检查 this.item 下有没有名字对应的属性值，没有的化，就初始化为空字符串
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
      return Util.getElement('fieldName', field.fieldName, this.dictionary);
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field).uiType;
    },
    getTypes(field) {
      // 在 typegroup 里面查找到 field 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(field);
      var value = dictionaryField.fieldEnumId;
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
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
      var fieldName = field.fieldName;
      var fieldValue = this.item[fieldName];
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        var isEmptyDate = fieldValue && fieldValue instanceof String && fieldValue.indexOf('NaN') > -1;
        if (isEmptyValue || isEmptyArray || isEmptyDate) {
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
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
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
      padding: 30px 0 10px;
      font-size: @large-font-size;
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
