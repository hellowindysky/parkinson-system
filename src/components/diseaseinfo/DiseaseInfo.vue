<template lang="html">
  <folding-panel :title="'病症信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diseaseInfo">
      <div class="group" v-for="(group, groupIndex) in diseaseInfoTemplateGroups">
        <div class="field" v-for="field in group" :class="checkField(field, groupIndex)">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>

          <div class="field-value" v-show="mode==='reading'">
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
                 :value="type.typeCode" :key="type.typeCode"></el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===4">
              4
            </span>
            <span v-else-if="getUIType(field, groupIndex)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]">
                <el-checkbox v-for="type in getTypes(field, groupIndex)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <span v-else-if="getUIType(field, groupIndex)===6">
              <el-date-picker v-model="copyInfo[field.fieldName]" type="date" placeholder="选择日期"></el-date-picker>
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
// import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';

import { READING_MODE, EDITING_MODE } from 'utils/constant.js';

const halfLineFieldList = ['diseaseType', 'ariTime', 'firTime', 'surTime'];

export default {
  props: {
    diseaseInfo: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data() {
    return {
      mode: READING_MODE,
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
      this.mode = EDITING_MODE;
    },
    cancel() {
      this.mode = READING_MODE;
    },
    submit() {
      this.mode = READING_MODE;
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

      // 判断该字段是否是半行
      if (halfLineFieldList.indexOf(dictionaryField.fieldName) > -1) {
        return 'half-line';
      } else if (this.getUIType(field, groupIndex) === 5) {
        return 'multiple-select';
      }
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
      if (!typeCodes) {
        return '';
      }
      var result = [];

      for (let typeCode of typeCodes) {
        result.push(this.transformTypeCode(typeCode, field, groupIndex));
      }
      return result.join('，');
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
  mounted() {
    setTimeout(() => {
      console.log(this.diseaseInfo);
      console.log(this.diseaseInfoDictionaryGroups);
      console.log(this.diseaseInfoTemplateGroups);
      // console.log(this.typeGroup);
    }, 2000);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@long-field-name-width: 170px;

.diseaseInfo {
  width: 100%;
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
      &.multiple-select {
        height: @field-height * 1.3;
        .field-name {
          width: @long-field-name-width;
          line-height: @field-height * 0.3;
        }
        .field-value {
          left: @long-field-name-width;
          line-height: @field-height * 0.3;
        }
        .field-input {
          left: @long-field-name-width;
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
