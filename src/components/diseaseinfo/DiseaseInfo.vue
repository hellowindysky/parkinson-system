<template lang="html">
  <folding-panel :title="'病症信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="disease-info">
      <div class="group" v-for="(group, groupIndex) in diseaseInfoTemplateGroups">
        <div class="field" v-for="field in group" :class="checkField(field, groupIndex)">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="getUIType(field, groupIndex)===3">
              {{ transformTypeCode(copyInfo[field.fieldName], field, groupIndex) }}
            </span>
            <span v-else-if="getUIType(field, groupIndex)===5">
              {{ translateCodes(copyInfo[field.fieldName], field, groupIndex) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
            <span v-if="getUIType(field, groupIndex)===1">
              <el-input v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
               :placeholder="getMatchedField(field, groupIndex).cnFieldDesc" @change="updateWarning(field)"></el-input>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===2">
              2
            </span>
            <span v-else-if="getUIType(field, groupIndex)===3">
              <el-select v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
               :placeholder="getMatchedField(field, groupIndex).cnFieldDesc" @change="updateWarning(field)">
                <el-option v-for="type in getTypes(field, groupIndex)" :label="type.typeName"
                 :value="type.typeCode" :key="type.typeCode"></el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===4">
              4
            </span>
            <span v-else-if="getUIType(field, groupIndex)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]" @change="updateWarning(field)"
               :placeholder="getMatchedField(field, groupIndex).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field, groupIndex)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===6">
              <el-date-picker v-model="copyInfo[field.fieldName]" type="date" :placeholder="getMatchedField(field, groupIndex).cnFieldDesc"
               format="yyyy-MM-dd" @change="updateDate(field)"></el-date-picker>
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

import { modifyPatientDiseaseInfo } from 'api/patient.js';

const halfLineFieldList = ['diseaseType', 'ariTime', 'firTime', 'surTime'];

export default {
  props: {
    diseaseInfo: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      mode: this.READING_MODE,
      copyInfo: {},
      warningResults: {}
    };
  },
  computed: {
    ...mapGetters([
      'diseaseInfoDictionaryGroups',
      'diseaseInfoTemplateGroups',
      'typeGroup'
    ])
  },
  components: {
    FoldingPanel
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 diseaseInfo 的复制对象，同时不要忘了重新对其进行特殊处理
      this.shallowCopy(this.diseaseInfo);
      this.changeCopyInfo();
      this.mode = this.READING_MODE;
    },
    submit() {
      // 首先检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
      for (let group of this.diseaseInfoTemplateGroups) {
        for (let field of group) {
          this.updateWarning(field);
        }
      }
      for (let fieldName in this.warningResults) {
        if (this.warningResults[fieldName]) {
          return false;
        }
      }

      // 对于那些 uiType 为 5 的字段来说，我们需要将形如 [1,2] 这样的数组转化为 "1,2"这样的字符串
      this.restoreCopyInfo();

      // 点击提交按钮，将修改后的 copyInfo 提交到服务器，一旦提交成功，diseaseInfo也会更新，这个时候再切换回阅读状态
      this.copyInfo.patientId = this.$route.params.id;
      modifyPatientDiseaseInfo(this.copyInfo).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
        this.mode = this.READING_MODE;
      });
    },
    shallowCopy(obj) {
      // 进行浅复制之后，修改复制对象的属性，不会影响到原始对象
      // 下面这行有一个特殊作用，能让 Vue 动态检测已有对象的新添加的属性，参看 https://cn.vuejs.org/v2/guide/reactivity.html
      this.copyInfo = Object.assign({}, obj);
    },
    changeCopyInfo() {
      // 复制得到的 copyInfo 有几个字段的值需要特殊处理一下
      // uiType 为 5 (多选框)的字段，形如 “1，3，4” 要转化为 [1, 3, 4]
      // 我们先将 CopyInfo 所有属性的名字放到一个数组里，然后遍历 diseaseInfoDictionaryGroups 下的所有 field
      // 看 哪些 field 的 fieldName 在这个数组里，同时该 field 的 uiType 为 5，这时就把 copyInfo 的相应字段进行转换
      var nameList = [];
      for (let fieldName in this.copyInfo) {
        nameList.push(fieldName);
      }
      for (let group of this.diseaseInfoDictionaryGroups) {
        for (let field of group) {
          let name = field.fieldName;
          if (nameList.indexOf(name) > -1 && field.uiType === 5) {
            var codesArray = this.copyInfo[name].split(',').map((str) => {
              return parseInt(str, 10);
            });
            this.copyInfo[name] = codesArray;
          } else if (field.uiType === 5) {
            // 这种情况指的是，得到对信息没有相应的字段，那么我们就为它建一个空数组，注意为了让 Vue 动态检测，这里采用 set 方法
            this.$set(this.copyInfo, name, []);
          }
        }
      }
    },
    restoreCopyInfo() {
      // 这个函数可以看作和 changeCopyInfo 起到完全相反的作用，让我们的结构化数据变成适应服务器的字符串格式
      var nameList = [];
      for (let fieldName in this.copyInfo) {
        nameList.push(fieldName);
      }
      for (let group of this.diseaseInfoDictionaryGroups) {
        for (let field of group) {
          let name = field.fieldName;
          if (nameList.indexOf(name) > -1 && field.uiType === 5) {
            var codesString = this.copyInfo[name].join(',');
            this.copyInfo[name] = codesString;
          }
        }
      }
    },
    getMatchedField(field, groupIndex) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      var matchedGroup = this.diseaseInfoDictionaryGroups[groupIndex];
      if (!matchedGroup) {
        matchedGroup = [];
      }
      var matchedField = matchedGroup.filter((dictionaryField) => {
        return dictionaryField.fieldName === field.fieldName;
      })[0];
      return matchedField ? matchedField : {};
    },
    checkField(field, groupIndex) {
      // 用来检测当前 field 的特殊样式
      var dictionaryField = this.getMatchedField(field, groupIndex);
      var name = dictionaryField.fieldName;
      var classNameList = [];

      // 判断该字段是否是半行
      if (halfLineFieldList.indexOf(name) > -1) {
        classNameList.push('half-line');
      }
      // 判断该字段的名字是否比较长
      if (field.cnfieldName.length > 6) {
        classNameList.push('long-label-field');
      }
      // 判断该字段是否是多选框
      if (this.getUIType(field, groupIndex) === 5) {
        classNameList.push('multiple-select');
      }
      return classNameList.join(' ');
    },
    checkIfHalfLine(field, groupIndex) {
      var dictionaryField = this.getMatchedField(field, groupIndex);
      // 判断该字段是否跨行
      return halfLineFieldList.indexOf(dictionaryField.fieldName) > -1;
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
          return type.typeCode === typeCode;
        })[0];
        return matchedType ? matchedType.typeName : '';
      }
    },
    translateCodes(typeCodes, field, groupIndex) {
      // 将形如 [1, 2, 4] 的字段信息 转换成 '内容 1，内容 2，内容 4' 这样的单字符串进行显示
      if (!typeCodes) {
        return '';
      }
      var result = [];

      for (let typeCode of typeCodes) {
        result.push(this.transformTypeCode(typeCode, field, groupIndex));
      }
      return result.join('，');
    },
    updateDate(field) {
      var dateStr = this.copyInfo[field.fieldName];
      var dateObj = new Date(dateStr);
      var year = dateObj.getFullYear();
      var month = dateObj.getMonth() + 1;
      var date = dateObj.getDate();
      this.copyInfo[field.fieldName] = year + '-' + month + '-' + date;
      this.updateWarning(field);
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var copyFieldValue = this.copyInfo[fieldName];
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !copyFieldValue && copyFieldValue !== 0;
        var isEmptyArray = copyFieldValue instanceof Array && copyFieldValue.length === 0;
        var isEmptyDate = copyFieldValue && copyFieldValue instanceof String && copyFieldValue.indexOf('NaN') > -1;
        if (isEmptyValue || isEmptyArray || isEmptyDate) {
          // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
          this.$set(this.warningResults, fieldName, '必填项');
          return;
        }

      }
      if (copyFieldValue && copyFieldValue.toString().indexOf(' ') > -1) {
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
  watch: {
    diseaseInfo: function(newBasicInfo) {
      // 当 diseaseInfo这个属性变量发生变化时（包括第一次传递进来），我们都对其进行浅复制，复制到 copyInfo 对象中。
      // 这样一来，编辑状态下修改 copyInfo 对象的属性时，就不会影响到 diseaseInfo 对象本身。
      // 如果组件的 diseaseInfo 属性发生变化，copyInfo 对象就会重置，而我们对 copyInfo 所做的还未提交的修改则会丢失。
      this.shallowCopy(newBasicInfo);

      // 这里对 copyInfo 的某些字段进行特殊处理
      // 因为要等到 diseaseInfo 和 diseaseInfoDictionaryGroups 这两个对象都异步调用成功才能有效执行
      // 所以我们对它们同时进行监控，任何一个调用成功，都会试图执行该函数（只有一个成功时，执行该函数是没有效果的）
      // 这样就保证，当两个异步数据都调用成功的时候，一定会有效地执行 changeCopyInfo
      this.changeCopyInfo();
    },
    diseaseInfoDictionaryGroups: function() {
      this.changeCopyInfo();
    }
  },
  created() {
    // 当用户在页面中跳转，导致本组件重新装载的时候，需要将 copyInfo 进行恢复
    // 注意，这里之所以选择 created 钩子函数而不是 mounted，是因为 el-date-picker 组件的绑定数据模型是 copyInfo 下的属性
    // 如果在 DOM 都加载好了之后再去修改 this.copyInfo，会发现跟 el-date-picker 相关的属性会出现问题
    this.shallowCopy(this.diseaseInfo);
    this.changeCopyInfo();

    setTimeout(() => {
      // console.log(this.diseaseInfo);
      // console.log(this.diseaseInfoDictionaryGroups);
      // console.log(this.diseaseInfoTemplateGroups);
      // console.log(this.typeGroup);
    }, 2000);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@long-field-name-width: 160px;

.disease-info {
  padding: 0 25px;
  .group {
    padding: 15px 0;
    text-align: left;
    .field {
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      text-align: left;
      &.half-line {
        width: 50%;
        .field-input {
          right: 4%;
        }
      }
      &.long-label-field {
        .field-name {
          width: @long-field-name-width;
        }
        .field-value {
          left: @long-field-name-width;
        }
        .field-input {
          left: @long-field-name-width;
        }
      }
      &.multiple-select {
        margin-top: 5px;
        height: @field-height * 1.3;
        .field-name {
          line-height: @field-height * 0.3;
        }
        .field-value {
          line-height: @field-height * 0.3;
        }
        .field-input {
          line-height: @field-height * 0.3;
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
        .required-mark {
          color: red;
          font-size: 20px;
          vertical-align: middle;
        }
      }
      .field-value {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
      }
      .field-input {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        right: 2%;
        line-height: @field-height;
        overflow: visible;
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
        .el-checkbox-group {
          .el-checkbox__input {
            line-height: 18px;
          }
        }
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
    }
  }
}
</style>
