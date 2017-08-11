<template lang="html">
  <div class="field-input">
    <span v-if="dictionaryField.uiType===1">
      <el-input v-model="modelObject[field.fieldName]"></el-input>
    </span>
    <span v-else-if="dictionaryField.uiType===2">
      2
    </span>
    <span v-else-if="dictionaryField.uiType===3">
      3
    </span>
    <span v-else-if="dictionaryField.uiType===4">
      4
    </span>
    <span v-else-if="dictionaryField.uiType===5">
      5
    </span>
    <span v-else-if="dictionaryField.uiType===6">
      6
    </span>
  </div>
</template>

<script>
// uitype: 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
export default {
  props: {
    field: {
      type: Object,
      required: true,
      default: {}
    },
    dictionaryField: {
      type: Object,
      required: true,
      default: {}
    },
    modelObject: {
      type: Object,
      required: false
    }
  },
  methods: {
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.field-input {
  .el-input {
    .el-input__inner {
      border: none;
      background-color: @screen-color;
    }
  }

}
</style>
