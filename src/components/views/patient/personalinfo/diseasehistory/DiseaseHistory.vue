<template lang="html">
  <folding-panel :title="'现病史'" :mode="mode" :editable="canEdit">
    <div class="disease-info">
      <div class="group" v-for="group in diseaseInfoTemplateGroups">

      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
export default {
  data() {
    return {
      mode: this.READING_MODE
    };
  },
  computed: {
    ...mapGetters([
      'diseaseInfoDictionaryGroups',
      'diseaseInfoTemplateGroups',
      'typeGroup'
    ]),
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    FoldingPanel
  },
  mounted() {
    console.log(this.diseaseInfoTemplateGroups);
    console.log(111);
    console.log(this.diseaseInfoDictionaryGroups);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@long-field-name-width: 160px;

.disease-info {
  padding: 0 25px 20px;
  .group {
    padding: 0;
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
        transform: translateY(@field-height * 0.4);
        height: auto;
        min-height: @field-height * 1.0;
        .field-name {
          line-height: @field-height * 0.3;
        }
        .field-value {
          line-height: @field-height * 0.3;
        }
        .field-input {
          position: relative;
          padding-bottom: 10px;
          width: calc(~"100% - @{field-name-width}");
          line-height: @field-height * 0.3;
          .warning-text {
            position: relative;
            top: -8px;
            left: 0;
            height: 15px;
            line-height: 15px;
            color: red;
            font-size: @small-font-size;
          }
        }
        &.long-label-field {
          .field-input {
            width: calc(~"100% - @{long-field-name-width}");
          }
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
        font-size: @normal-font-size;
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
          .el-checkbox {
            margin-left: 0;
            margin-right: 15px;
          }
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
