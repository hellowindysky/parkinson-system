<template lang="html">
  <folding-panel :title="'其它信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="other-info">
      <extensible-panel :mode="mode" :title="'其它用药史'">

      </extensible-panel>
      <extensible-panel :mode="mode" :title="'既往史'">

      </extensible-panel>
      <extensible-panel :mode="mode" :title="'个人史'">

      </extensible-panel>
      <extensible-panel :mode="mode" :title="'毒物接触史'">

      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
// import { mapGetters } from 'vuex';
// import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';

import { READING_MODE, EDITING_MODE } from 'utils/constant.js';

export default {
  data() {
    return {
      mode: READING_MODE
    };
  },
  components: {
    FoldingPanel,
    ExtensiblePanel
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
