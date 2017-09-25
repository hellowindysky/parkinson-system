<template lang="html">
  <folding-panel :title="'外科手术'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-surgery" ref="diagnosticSurgery">
      <extensible-panel class="panel" :mode="mutableMode" :title="preEvaluationTitle" v-on:addNewCard="addPreEvaluationRecord">
        <card class="card" :class="devideWidth" :mode="mutableMode" v-for="item in [1,2,3]" :key="item"
         :title="'ssaa'" v-on:clickCurrentCard="editPreEvaluationRecord(item)"
         v-on:deleteCurrentCard="deletePreEvaluationRecord(item)">
          <div class="text first-line">一天{{11}}次</div>
          <div class="text second-line">{{22}}</div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
// import { mapGetters } from 'vuex';
// import Util from 'utils/util.js';
import Bus from 'utils/bus.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      preEvaluationTitle: 'gogo',
      devideWidth: ''
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
    },
    addPreEvaluationRecord() {
      // 这里要传递 3 个参数，一个是 title，一个是当前数据对象（新建的时候为空），另一个是模态框的类型
      // Bus.$emit(this.SHOW_MODAL_BOX, '新增用药史', {}, this.MEDICINE_MODAL);
      console.log('add');
    },
    editPreEvaluationRecord(item) {
      // Bus.$emit(this.SHOW_MODAL_BOX, '用药史', item, this.MEDICINE_MODAL);
      console.log('edit', item);
    },
    deletePreEvaluationRecord(item) {
      // var patientMed = {
      //   patientId: this.id,
      //   patientMedHistoryId: item.patientMedHistoryId,
      //   version: item.version
      // };
      Bus.$on(this.CONFIRM, () => {
        // deletePatientMedHistory(patientMed).then(this._resolveDeletion, this._rejectDeletion);
        console.log('delete', item);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticSurgery.clientWidth;
        var devideNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度
        while (panelWidth / devideNum > 200 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    // 如果收到 [确认对话框] 发过来的 “取消” 事件，则解除 “确认” 事件的回调函数
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });

    // 如果收到屏幕宽度变化，或者内容区域宽度变化的事件，则重新计算卡片的宽度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.diagnostic-surgery {
  .panel {
    text-align: left;
    .card {
      display: inline-block;
      position: relative;
      margin: @card-vertical-margin @card-horizontal-margin;
      // min-width: 200px;
      // max-width: 250px;
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{card-horizontal-margin} * 2");
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
      }
      .first-line {
        left: 10px;
        top: 50px;
      }
      .second-line {
        left: 10px;
        top: 75px;
      }
    }
  }
}
</style>
