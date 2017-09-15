<template lang="html">
  <div class="diagnostic-info-wrapper" ref="diagnosticInfo">
    <folding-panel class="panel" :title="'看诊记录'" :mode="mode" :isCardsPanel="true" v-on:edit="startEditing" v-on:cancel="cancel"
     v-on:submit="submit" v-on:addNewCard="addRecord">
      <card class="card" :class="devideWidth" :mode="mode" v-for="item in patientCaseList" :key="item.caseName"
       :title="item.caseName" v-on:clickCurrentCard="seeDetail(item)" v-on:deleteCurrentCard="deleteRecord(item)">
        <div class="text first-line">诊断内容：</div>
        <div class="text second-line" v-html="getDiagnosticContent(item)"></div>
        <div class="text third-line">归档情况：<span class="third-line-content"> 已归档</span></div>
      </card>
    </folding-panel>
    <folding-panel class="panel" v-show="false" :title="'随诊记录'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
      <card class="card" :class="devideWidth" :mode="mode" v-for="item in [1,2,3,4,5,6,7,8,9]" :key="item" :title="'第' + item+ '条'">
      </card>
    </folding-panel>
  </div>
</template>

<script>
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import Card from 'components/card/Card';
import Bus from 'utils/bus.js';

export default {
  props: {
    patientCaseList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      mode: this.READING_MODE,
      devideWidth: ''
    };
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
    },
    cancel() {
      this.mode = this.READING_MODE;
    },
    submit() {
      this.mode = this.READING_MODE;
    },
    recalculateCardWidth() {
      var panelWidth = this.$refs.diagnosticInfo.clientWidth;
      panelWidth += 10 * 2;
      var devideNum = 1.0;
      // 10px 是卡片的横向间距，定义在了 varaibles.less 中，260px 是卡片的最小宽度
      while (panelWidth / devideNum > 260 + 10) {
        devideNum += 1.0;
      }
      devideNum -= 1;
      // 一排最多显示 10 个卡片
      devideNum = devideNum <= 10 ? devideNum : 10;
      this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
    },
    getDiagnosticContent(item) {
      var content = '';
      var diagnosticDictionary = [
        {fieldName: 'scaleBrief', cnName: '量表信息'},
        {fieldName: 'sideeffectBrief', cnName: '副作用'},
        {fieldName: 'spephysicalBrief', cnName: '神经检查'},
        {fieldName: 'surgicalBrief', cnName: '外科治疗'},
        {fieldName: 'bioexaBrief', cnName: '生化检查'},
        {fieldName: 'etgBrief', cnName: '肌电图检查'},
        {fieldName: 'auxiliaryexamBrief', cnName: '辅助信息'}
      ];
      for (let field of diagnosticDictionary) {
        if (item[field.fieldName]) {
          // 正因为这里需要加入连续空格，所以我们才使用 v-html 指令来直接解析 html
          content += field.cnName + ' <span>&nbsp;&nbsp;</span> ';
        }
      }
      // 去掉尾部空格
      content = content.trim();
      return content;
    },
    seeDetail(item) {
      this.$router.push({
        name: 'diagnosticDetail',
        params: { caseId: item.patientCaseId }
      });
    },
    deleteRecord(item) {
      Bus.$on(this.CONFIRM, () => {
        console.log('要删除了: ', item);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addRecord() {
      console.log('现在要新增一个诊断信息');
    }
  },
  components: {
    FoldingPanel,
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
  },
  watch: {
    patientCaseList: function() {
      // console.log(this.patientCaseList);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@this-card-horizontal-margin: 5px;

.diagnostic-info-wrapper {
  background-color: @screen-color;
  .panel {
    text-align: left;
    margin-bottom: 5px;
    .content {
      // 下面几行为了覆盖 FoldingPanel 子组件内的 content 样式，注意父组件的 style 标签不能加 scoped
      margin: 0 -@this-card-horizontal-margin;
      padding: 3px 0 !important;
      background-color: @screen-color;
      &.folded {
        padding: 0 !important;
      }
    }
    .card {
      display: inline-block;
      margin: 3px @this-card-horizontal-margin;
      height: 130px;
      background-color: @background-color;
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{this-card-horizontal-margin} * 2");
      }
      .title {
        left: 20px;
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        &.first-line {
          left: 20px;
          top: 45px;
          right: 20px;
          color: @font-color;
        }
        &.second-line {
          left: 20px;
          top: 65px;
          right: 20px;
          color: @light-font-color;
        }
        &.third-line {
          left: 20px;
          top: 100px;
          right: 20px;
          .third-line-content {
            color: @light-font-color;
          }
        }
      }
    }
  }
}
</style>
