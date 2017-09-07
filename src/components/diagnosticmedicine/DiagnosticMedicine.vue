<template lang="html">
  <folding-panel :title="'药物方案'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="">

    </div>
  </folding-panel>
</template>

<script>
// import { mapGetters } from 'vuex';
// import Util from 'utils/util.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
// import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
// import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
    }
  },
  components: {
    FoldingPanel
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

</style>
