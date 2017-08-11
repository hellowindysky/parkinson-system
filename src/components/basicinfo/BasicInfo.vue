<template lang="html">
  <folding-panel :title="'基础信息'" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="basic-info">
      <div class="group" v-for="(group, groupIndex) in patientInfoTemplateGroups">
        <div class="field" v-for="field in group">
          <span class="field-name">{{field.cnfieldName}}</span>
          <span class="field-value" v-show="mode==='reading'">{{basicInfo[field.fieldName]}}</span>
          <field-input class="field-value" v-show="mode==='editing'" :field="field" :dictionary-field="getDictionaryField(field, groupIndex)" :model-object="copyInfo"></field-input>
        </div>
      </div>
      <div class="group2">

      </div>
      <div class="group3">

      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import FieldInput from 'components/fieldinput/FieldInput';

const READING_MODE = 'reading';
const EDITING_MODE = 'editing';

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

      // 因为 copyInfo 是 Object，所以我们将它作为 props 传递到子组件后，实际上传递的是一个引用对象。
      // 我们在子组件里面修改这个属性对象的属性值，会直接影响到父组件的 copyInfo 对象
      copyInfo: {}
    };
  },
  computed: {
    ...mapGetters([
      'basicInfoDictionaryGroups',
      'patientInfoTemplateGroups'
    ])
  },
  methods: {
    startEditing() {
      this.mode = EDITING_MODE;
    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
      this.copyInfo = Object.assign({}, this.basicInfo);
      this.mode = READING_MODE;
    },
    submit() {
      // 点击提交按钮，将修改后的 copyInfo 提交到服务器，一旦提交成功，basicInfo也会更新，这个时候再切换回阅读状态
      this.mode = READING_MODE;
    },
    getDictionaryField(field, groupIndex) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，然后得到其 uiType 等信息
      var matchedGroup = this.basicInfoDictionaryGroups[groupIndex];
      if (!matchedGroup) {
        return {};
      }
      var matchedField = matchedGroup.filter((dictionaryField) => {
        return dictionaryField.fieldName === field.fieldName;
      })[0];
      if (!matchedField) {
        return {};
      } else {
        return matchedField;
      }
    }
  },
  components: {
    FoldingPanel,
    FieldInput
  },
  mounted() {
    setTimeout(() => {
      console.log(this.basicInfo);
      console.log(this.basicInfoDictionaryGroups);
      console.log(this.patientInfoTemplateGroups);
    }, 1500);
  },
  watch: {
    basicInfo: function(newBasicInfo) {
      // 当 basicInfo这个属性变量发生变化时（包括第一次传递进来），我们都对其进行浅复制，复制到 copyInfo 对象中。
      // 这样一来，编辑状态下修改 copyInfo 对象的属性时，就不会影响到 basicInfo 对象本身。
      // 如果组件的 basicInfo 属性发生变化，copyInfo 对象就会重置，而我们对 copyInfo 所做的还未提交的修改则会丢失。
      this.copyInfo = Object.assign({}, newBasicInfo);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@field-height: 36px;

.basic-info {
  width: 100%;
  .group {
    padding: 15px 0;
    border-bottom: 1px solid @light-gray-color;
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
      .field-name {
        display: inline-block;
        width: 100px;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @font-color;
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
