<template lang="html">
  <div class="diagnostic-detail-wrapper" v-show="displayDetail">
    <div class="title-bar">
      <h2 class="title">{{caseDetail.caseName}}</h2>
      <div class="button back-button" @click="goBack">返回</div>
      <div class="button file-button" @click="fileCase">归档</div>
    </div>
    <div class="scroll-area" ref="scrollArea">
      <diagnostic-basic class="folding-panel" :mode="mode" :diagnosticBasic="diagnosticBasic"></diagnostic-basic>
      <diagnostic-disease class="folding-panel" :mode="mode"></diagnostic-disease>
      <diagnostic-medicine class="folding-panel" :mode="mode"></diagnostic-medicine>
      <diagnostic-surgery class="folding-panel" :mode="mode"></diagnostic-surgery>
      <diagnostic-scale class="folding-panel" :patientScale="caseDetail.patientScale" :mode="mode"></diagnostic-scale>
      <diagnostic-examination class="folding-panel" :mode="mode"></diagnostic-examination>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getPatientCase } from 'api/patient.js';

import DiagnosticBasic from 'components/diagnosticbasic/DiagnosticBasic';
import DiagnosticDisease from 'components/diagnosticdisease/DiagnosticDisease';
import DiagnosticMedicine from 'components/diagnosticmedicine/DiagnosticMedicine';
import DiagnosticSurgery from 'components/diagnosticsurgery/DiagnosticSurgery';
import DiagnosticScale from 'components/diagnosticscale/DiagnosticScale';
import DiagnosticExamination from 'components/diagnosticexamination/DiagnosticExamination';

export default {
  data() {
    return {
      displayDetail: false,
      caseDetail: {},
      mode: this.READING_MODE
    };
  },
  computed: {
    diagnosticBasic() {
      var obj = {};
      obj.diagTime = this.caseDetail.diagTime;
      return obj;
    }
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
    checkRoute() {
      var path = this.$route.path;

      if (/^\/patients\/list\/[0-9]+\/diagnosticInfo\/?$/.test(path)) {
        // 一旦发现路由地址中还没有 caseId，则不显示诊断详情面板
        this.closePanel();
      } else if (/^\/patients\/list\/[0-9]+\/diagnosticInfo\/[0-9a-zA-Z]+$/.test(path)) {
        // 如果路由地址中有 caseId，则显示面板并获取对应的诊断数据
        var caseId = this.$route.params.caseId;
        this.showDetailPanel(caseId);
      } else {
        this.closePanel();
      }
    },
    showDetailPanel(patientCaseId) {
      // 接收到相应的消息之后，打开诊断详情窗口，然后再向服务器请求数据
      this.displayDetail = true;

      var patientId = this.$route.params.id;
      getPatientCase(patientId, patientCaseId).then((data) => {
        this.caseDetail = Object.assign({}, data.patientCase);
        this.updateScrollbar();
        console.log('caseDetail: ', this.caseDetail);
      });
    },
    goBack() {
      // 按下返回按钮，实际上是修改的路由地址 ———— 因为我们是监控路由地址来决定这个详情窗口是否显示的
      this.$router.push({name: 'diagnosticInfo'});
    },
    closePanel() {
      this.displayDetail = false;
      this.caseDetail = {};
    },
    fileCase() {
      console.log('要归档了');
    }
  },
  components: {
    DiagnosticBasic,
    DiagnosticDisease,
    DiagnosticMedicine,
    DiagnosticSurgery,
    DiagnosticScale,
    DiagnosticExamination
  },
  mounted() {
    this.checkRoute();

    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  },
  watch: {
    $route() {
      this.checkRoute();
    },
    displayDetail: function() {
      Bus.$emit(this.RECALCULATE_CARD_WIDTH);
    }
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
    margin-bottom: 5px;
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
      margin-bottom: @vertical-spacing;
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
