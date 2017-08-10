<template lang="html">
  <folding-panel :title="'基础信息'" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="basic-info">
      <div class="group" v-for="group in patientInfoTemplateGroups">
        <div class="field" v-for="field in group">
          <span class="field-name">{{field.cnfieldName}}</span>
          <span class="field-value">{{basicInfo[field.fieldName]}}</span>
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
    }, 1000);
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
