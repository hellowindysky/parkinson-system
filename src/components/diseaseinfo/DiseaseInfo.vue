<template lang="html">
  <folding-panel :title="'病症信息'" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diseaseInfo">
      <div class="group" v-for="(group, groupIndex) in diseaseInfoTemplateGroups">
        <div class="field" v-for="field in group" :class="{'half-line': checkIfHalfLine(field, groupIndex)}">
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
      copyInfo: {}
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
    getMatchedField(field, groupIndex) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      var matchedGroup = this.diseaseInfoDictionaryGroups[groupIndex];
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
          // patientInfo 中用的是数字，而 typegroup 里面的 typeCode 是字符串，因此要确定匹配之前，需要将数字转译为字符串
          return type.typeCode === typeCode + '';
        })[0];
        return matchedType ? matchedType.typeName : '';
      }
    },
    watch: {
      diseaseInfo: function(newBasicInfo) {
        // 当 diseaseInfo这个属性变量发生变化时（包括第一次传递进来），我们都对其进行浅复制，复制到 copyInfo 对象中。
        // 这样一来，编辑状态下修改 copyInfo 对象的属性时，就不会影响到 diseaseInfo 对象本身。
        // 如果组件的 diseaseInfo 属性发生变化，copyInfo 对象就会重置，而我们对 copyInfo 所做的还未提交的修改则会丢失。
        this.shallowCopy(newBasicInfo);
      }
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
@field-name-width: 160px;

.diseaseInfo {
  width: 100%;
  .group {
    padding: 15px 0;
    text-align: left;
    .field {
      display: inline-block;
      width: 100%;
      height: @field-height;
      text-align: left;
      &.half-line {
        width: 50%;
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
    }
  }
}
</style>
