<template lang="html">
  <div class="diagnostic-update-wrapper" v-show="displayUpdateScale">
    <div class="title-bar">
      <h2 class="title" v-if="pageTpye==='update'">{{scaleName}}</h2>
      <h2 class="title" v-else>新增量表信息</h2>
      <div class="button back-button" @click="goBack">返回</div>
    </div>
    <div class="scroll-area" ref="scrollArea">
      <div v-for="(item, key) in scaleSonDate['questions']" v-if="pageTpye==='update'">
         <div class="scale-questions">
           <p class="question-title">题目名称: <span>{{item.subjectName}}</span></p>
           <el-checkbox-group class="question-body" v-for="(sonitem, sonkey) in item['options']" :key="sonkey" v-model="correctanswer['answer'+key]">
               <el-checkbox class="question-selection" :label="sonitem.optionName" disabled></el-checkbox>
           </el-checkbox-group>  
         </div> 
      </div>
      <div v-else>        
      </div>
    </div>
  </div>  
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getScaleInfo } from 'api/patient';

export default {
  data() {
    return {
      displayUpdateScale: false,
      mode: this.READING_MODE,
      scaleData: {},
      scaleSonDate: {},
      scaleName: '',
      scaleAnswer: [],
      correctanswer: {},
      pageTpye: '',
      scaleNameArr: []
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
    showDetailPanel(item, type) {
      // 接收到相应的消息之后，打开诊断详情窗口
      this.displayUpdateScale = true;
      if (arguments.length) {
        // 通过bus传递过来量表ID来获取量表的信息
        this.getTitleAndScale(item.scaleInfoId);
        console.log(item.scaleOptionIds);
        // 获取量表选择答案的数组
        this.scaleAnswer = item.scaleOptionIds;
        // 获取页面的类型（到底是添加页面还是修改页面）
        this.pageTpye = type;
      }
    },
    goBack() {
      // 按下返回按钮，把所有的数据都初始化一遍
      this.displayUpdateScale = false;
      this.correctanswer = [];
      this.scaleData = {};
      this.scaleSonDate = {};
      this.scaleName = '';
      this.scaleAnswer = [];
      this.correctanswer = {};
      this.pageTpye = '';
      this.scaleNameArr = [];
    },
    closePanel() {
      this.displayUpdateScale = false;
      this.scaleDetail = {};
    },
    getPatientScaleInfo() {
      getScaleInfo().then((data) => {
        this.scaleData = data['scales'];
      });
    },
    getTitleAndScale(scaleInfoId) {
      // 通过量表的ID来找到量表的名字
      for (let key in this.scaleData) {
        let sonData = this.scaleData[key];
        for (let sonkey in sonData) {
          if (sonkey === 'scaleInfoId') {
            // 获取对应量表的数据
            if (sonData[sonkey] === scaleInfoId) {
              this.scaleSonDate = sonData;
              this.scaleName = sonData['gaugeName'];
            }
          }
        }
      }
    },
    getCorrectAnswer(data) {
      // 取出量表的正确答案
      for (let key in data) {
        let sondata = data[key]['options'];
        for (let sonkey in sondata) {
          let sondata1 = sondata[sonkey];
          for (let i = 0; i < this.scaleAnswer.length; i++) {
            if (sondata1['scaleOptionId'] === this.scaleAnswer[i]) {
              this.$set(this.correctanswer, 'answer' + i, [sondata1['optionName']]);
            }
          }
        }
      }
    },
    getScaleNameArr(scaledata) {
      for (let key in scaledata) {
        let data = scaledata[key];
        if (data['gaugeName']) {
          this.scaleNameArr.push(data['gaugeName']);
          console.log(this.scaleNameArr);
        }
      }
    }
  },
  mounted() {
    // 获取到量表的数据
    this.getPatientScaleInfo();
    Bus.$on(this.UPDATE_SCALE_DETAIL, this.showDetailPanel);
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.UPDATE_SCALE_DETAIL, this.showDetailPanel);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  },
  watch: {
    scaleSonDate: {
      handler: function(newVal) {
        if (newVal) {
          this.scaleData = newVal;
          this.getCorrectAnswer(newVal['questions']);
          console.log(newVal);
        }
      },
      deep: true
    },
    displayUpdateScale: {
      handler: function() {
        this.getPatientScaleInfo();
      },
      deep: true
    },
    scaleAnswer: {
      handler: function(newVal) {
        if (newVal) {
          this.scaleAnswer = newVal;
        }
      },
      deep: true
    },
    scaleData: {
      handler: function(newVal) {
        if (newVal && this.displayUpdateScale) {
          this.scaleAnswer = newVal;
          this.getScaleNameArr(newVal);
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@title-bar-height: 40px;
@title-bar-margin-bottom: 10px;
@margin-right: 15px;
@title-left-padding: 40px;
@title-bottom-padding: 10px;

.diagnostic-update-wrapper {
  p {margin: 0;}
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
        right: 10px;
      }
    }
  }
  .scroll-area {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{title-bar-height} - @{title-bar-margin-bottom}");
    overflow: hidden;
    .scale-questions {
      text-align: left;
      background: white;
      font-size: 14px;
      margin-right: @margin-right;
      margin-bottom: @vertical-spacing;
      padding-left: @title-left-padding;
      padding-bottom: @title-bottom-padding; 
      box-sizing: border-box;
      .question-title {
        line-height: 62px;
        font-weight: bold;
        span {
          color: @secondary-button-color;
        }
      }
      .question-body {
        margin: 0;
        padding: 0;
        color: @secondary-button-color;
        font-weight: 100;
        list-style: none;
          .question-selection {
            margin: 0;
            line-height: 38px;
          }
      }
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
