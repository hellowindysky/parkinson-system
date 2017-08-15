<template lang="html">
  <folding-panel :title="'病症信息'" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diseaseInfo">
      <div class="group" v-for="(group, groupIndex) in diseaseInfoTemplateGroups">
      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
// import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';

import { READING_MODE, EDITING_MODE } from 'utils/constant.js';

export default {
  props: {
    diseaseInfo: {
      type: Object,
      required: true,
      default: {}
    }
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
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.diseaseInfo);
      console.log(this.diseaseInfoDictionaryGroups);
      console.log(this.diseaseInfoTemplateGroups);
    }, 2000);
  }
};
</script>

<style lang="less">
.diseaseInfo {
  width: 100%;
}
</style>
