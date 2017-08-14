<template lang="html">
  <folding-panel :title="'基础信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="basic-info">
      <div class="group" v-for="(group, groupIndex) in patientInfoTemplateGroups">
        <div class="field" v-for="field in group" :class="{'whole-line': checkIfWholeLine(field, groupIndex)}">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>

          <div class="field-value" v-show="mode==='reading'">
            <span v-if="getUIType(field, groupIndex)===3">
              {{ transformTypeCode(copyInfo[field.fieldName], field, groupIndex) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode==='editing'">
            <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
            <span v-if="getUIType(field, groupIndex)===1">
              <el-input v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
               :placeholder="getMatchedField(field, groupIndex).cnFieldDesc" @change="updateWarning(field)"></el-input>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===2">
              2
            </span>
            <span v-else-if="getUIType(field, groupIndex)===3">
              <el-select v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}" @change="updateWarning(field)">
                <el-option v-for="type in getTypes(field, groupIndex)" :label="type.typeName"
                 :value="parseInt(type.typeCode, 10)" :key="type.typeCode"></el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===4">
              4
            </span>
            <span v-else-if="getUIType(field, groupIndex)===5">
              5
            </span>
            <span v-else-if="getUIType(field, groupIndex)===6">
              <el-date-picker v-model="copyInfo[field.fieldName]" type="date" placeholder="选择日期"
               :picker-options="futureDisabledptions"></el-date-picker>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===7">
              7
            </span>
          </div>
        </div>
      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';

import { modifyPatientInfo } from 'api/patient.js';

const READING_MODE = 'reading';
const EDITING_MODE = 'editing';

const wholeLineFieldList = ['homeAddress'];
const converToDecimalList = ['height', 'weight'];

export default {
  props: {
    basicInfo: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data() {
    return {
      mode: READING_MODE,
      copyInfo: {},
      futureDisabledptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      warningResults: {}
    };
  },
  computed: {
    ...mapGetters([
      'basicInfoDictionaryGroups',
      'patientInfoTemplateGroups',
      'typeGroup'
    ])
  },
  methods: {
    startEditing() {
      this.mode = EDITING_MODE;
    },
    shallowCopy(obj) {
      // 进行浅复制之后，修改复制对象的属性，不会影响到原始对象
      // 下面这行有一个特殊作用，能让 Vue 动态检测已有对象的新添加的属性，参看 https://cn.vuejs.org/v2/guide/reactivity.html
      this.copyInfo = Object.assign({}, obj);

      // 复制过来的 basicInfo 有几个字段的值需要特殊处理一下
      for (let fieldName of converToDecimalList) {
        if (this.copyInfo[fieldName]) {
          this.$set(this.copyInfo, fieldName, this.copyInfo[fieldName] / 10);
        }
      }
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
      this.shallowCopy(this.basicInfo);
      console.log(this.copyInfo);
      this.mode = READING_MODE;
    },
    submit() {
      // 首先检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
      for (let group of this.patientInfoTemplateGroups) {
        for (let field of group) {
          this.updateWarning(field);
        }
      }
      for (let fieldName in this.warningResults) {
        if (this.warningResults[fieldName]) {
          return false;
        }
      }

      // 点击提交按钮，将修改后的 copyInfo 提交到服务器，一旦提交成功，basicInfo也会更新，这个时候再切换回阅读状态
      this.copyInfo.patientId = this.$route.params.id;
      modifyPatientInfo(this.copyInfo).then(() => {
        Bus.$emit('updatePatientInfo');
        this.mode = READING_MODE;
      });
    },
    getMatchedField(field, groupIndex) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      var matchedGroup = this.basicInfoDictionaryGroups[groupIndex];
      if (!matchedGroup) {
        matchedGroup = [];
      }
      var matchedField = matchedGroup.filter((dictionaryField) => {
        return dictionaryField.fieldName === field.fieldName;
      })[0];
      if (!matchedField) {
        return {};
      } else {
        return matchedField;
      }
    },
    checkIfWholeLine(field, groupIndex) {
      var dictionaryField = this.getMatchedField(field, groupIndex);
      // 判断该字段是否跨行
      return wholeLineFieldList.indexOf(dictionaryField.fieldName) > -1;
    },
    getUIType(field, groupIndex) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field, groupIndex).uiType;
    },
    getTypes(field, groupIndex) {
      // 在 typegroup 里面查找到 field 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(field, groupIndex);
      var typeInfo = this.typeGroup.filter((type) => {
        return type.typegroupcode === dictionaryField.fieldEnumId;
      })[0];
      return typeInfo ? typeInfo.types : [];
    },
    transformTypeCode(typeCode, field, groupIndex) {
      // 根据 typeCode 找到对应的 typeName
      var types = this.getTypes(field, groupIndex);
      if (types.length === 0) {
        return '';
      } else {
        var matchedType = types.filter((type) => {
          // patientInfo 中用的是数字，而 typegroup 里面的 typeCode 是字符串，因此要确定匹配之前，需要将数字转译为字符串
          return type.typeCode === typeCode + '';
        })[0];
        return matchedType ? matchedType.typeName : '';
      }
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var copyFieldValue = this.copyInfo[fieldName];
      if (field.must === 1 && !copyFieldValue && copyFieldValue !== 0) {
        // must 为 1 代表必填，为 2 代表选填
        // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
        this.$set(this.warningResults, fieldName, '必填项');

      } else if (copyFieldValue.toString().indexOf(' ') > -1) {
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
    }
  },
  components: {
    FoldingPanel
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.basicInfo);
      // console.log(this.basicInfoDictionaryGroups);
      // console.log(this.patientInfoTemplateGroups);
      // console.log(this.typeGroup);
    }, 2000);
  },
  watch: {
    basicInfo: function(newBasicInfo) {
      // 当 basicInfo这个属性变量发生变化时（包括第一次传递进来），我们都对其进行浅复制，复制到 copyInfo 对象中。
      // 这样一来，编辑状态下修改 copyInfo 对象的属性时，就不会影响到 basicInfo 对象本身。
      // 如果组件的 basicInfo 属性发生变化，copyInfo 对象就会重置，而我们对 copyInfo 所做的还未提交的修改则会丢失。
      this.shallowCopy(newBasicInfo);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;

.basic-info {
  width: 100%;
  .group {
    padding: 15px 0;
    border-bottom: 1px solid @light-gray-color;
    text-align: left;
    &:first-child {
      padding-top: 0;
    }
    &:nth-child(3) {
      padding-bottom: 0;
      border: none;
    }
    .field {
      display: inline-block;
      width: 50%;
      height: @field-height;
      text-align: left;
      &.whole-line {
        width: 100%;
        .field-input {
          width: 81%;
        }
      }
      .field-name {
        display: inline-block;
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
      .field-value {
        display: inline-block;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
      }
      .field-input {
        display: inline-block;
        position: relative;
        width: 62%;
        overflow: visible;
        .warning-text {
          position: absolute;
          top: 32px;
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
  }
}
</style>
