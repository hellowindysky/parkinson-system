<template lang="html">
  <folding-panel :title="'其它信息'" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="">
      其它信息
    </div>
  </folding-panel>
</template>

<script>
import FoldingPanel from 'components/foldingpanel/FoldingPanel';

const READING_MODE = 'reading';
const EDITING_MODE = 'editing';

export default {
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
  }
};
</script>

<style lang="less">
</style>
