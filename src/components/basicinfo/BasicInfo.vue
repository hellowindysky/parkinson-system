<template lang="html">
  <folding-panel :title="'基础信息'" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="basic-info">
      <div class="group" v-for="(group, groupIndex) in patientInfoTemplateGroups">
        <div class="field" v-for="field in group">
          <span class="field-name">{{field.cnfieldName}}</span>
          <span class="field-value" v-show="mode==='reading'">{{basicInfo[field.fieldName]}}</span>
          <span class="field-value" v-show="mode==='editing'">
            <span v-if="checkUIType(field, groupIndex)===1">
              1
            </span>
            <span v-else-if="checkUIType(field, groupIndex)===2">
              2
            </span>
            <span v-else-if="checkUIType(field, groupIndex)===3">
              3
            </span>
            <span v-else-if="checkUIType(field, groupIndex)===4">
              4
            </span>
            <span v-else-if="checkUIType(field, groupIndex)===5">
              5
            </span>
            <span v-else-if="checkUIType(field, groupIndex)===6">
              6
            </span>
          </span>
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

const READING_MODE = 'reading';
const EDITING_MODE = 'editing';

export default {
  props: {
    basicInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mode: READING_MODE
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
      this.mode = READING_MODE;
    },
    submit() {
      this.mode = READING_MODE;
    },
    checkUIType(field, groupIndex) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，然后得到其 uiType 类型
      // uitype: 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      var matchedField = this.basicInfoDictionaryGroups[groupIndex].filter((fieldInDictionary) => {
        return fieldInDictionary.fieldName === field.fieldName;
      })[0];
      var uiType = matchedField ? matchedField.uiType : '';
      return uiType;
    }
  },
  components: {
    FoldingPanel
  },
  mounted() {
    setTimeout(() => {
      console.log(this.basicInfo);
      console.log(this.basicInfoDictionaryGroups);
      console.log(this.patientInfoTemplateGroups);
    }, 1500);
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
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
      }
    }
  }
}
</style>
