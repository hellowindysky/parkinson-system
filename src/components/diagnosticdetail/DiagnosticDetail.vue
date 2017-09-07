<template lang="html">
  <div class="diagnostic-detail-wrapper" v-show="displayDetail">
    <div class="title-bar">
      <h2 class="title">{{caseDetail.caseName}}</h2>
      <div class="button back-button" @click="goBack">返回</div>
      <div class="button file-button" @click="fileCase">归档</div>
    </div>
    <div class="scroll-area" ref="scrollArea">
      <folding-panel class="folding-panel" :title="'基础情况'"></folding-panel>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getPatientCase } from 'api/patient.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      displayDetail: false,
      caseDetail: {}
    };
  },
  methods: {
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        // 之所以弃用 update 方法，是因为它在某些情况下会出现问题，导致滚动条不能有效刷新
        // Ps.update(this.$refs.scrollArea);

        // 如果之前有绑定滚动条的话，先进行解除
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    showDetailPanel(patientCaseId) {
      // 接收到相应的消息之后，打开诊断详情窗口，然后再向服务器请求数据
      this.displayDetail = true;

      var patientId = this.$route.params.id;
      getPatientCase(patientId, patientCaseId).then((data) => {
        this.caseDetail = Object.assign({}, data.patientCase);
        this.updateScrollbar();
        console.log('cd: ', this.caseDetail);
      });
    },
    goBack() {
      this.displayDetail = false;
      this.caseDetail = {};
      console.log(this.caseDetail);
    },
    fileCase() {
      console.log('要归档了');
    }
  },
  components: {
    FoldingPanel
  },
  mounted() {
    this.updateScrollbar();

    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);

    Bus.$on(this.SHOW_CASE_DETAIL, (patientCaseId) => {
      this.showDetailPanel(patientCaseId);
    });
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_CASE_DETAIL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@title-bar-height: 40px;
@title-bar-margin-bottom: 10px;
@margin-right: 15px;

.diagnostic-detail-wrapper {
  background-color: @screen-color;
  .title-bar {
    position: relative;
    height: @title-bar-height;
    margin-right: @margin-right;
    margin-bottom: 10px;
    background-color: @background-color;
    .title {
      margin: 0;
      position: absolute;
      display: inline-block;
      padding-left: 20px;
      left: 0;
      width: 100%;
      height: @title-bar-height;
      line-height: @title-bar-height;
      text-align: left;
      font-size: @large-font-size;
      cursor: pointer;
      color: @font-color;
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      color: #fff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.back-button {
        background-color: @secondary-button-color;
        right: 30px + @small-button-width;
      }
      &.file-button {
        background-color: @button-color;
        right: 10px;
      }
    }
  }
  .scroll-area {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{title-bar-height} - @{title-bar-margin-bottom}");
    overflow: hidden;
    .folding-panel {
      margin-right: @margin-right;
    }

    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
      padding: 0 3px;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s, padding 0.2s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.6;
        &:hover {
          padding: 0;
        }
      }
    }
  }
}
</style>
