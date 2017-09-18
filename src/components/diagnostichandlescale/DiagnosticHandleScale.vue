<template lang="html">
  <div class="diagnostic-update-wrapper" v-show="displayUpdateScale">
    <div class="title-bar">
      <h2 class="title" v-if="pageTpye==='update'">{{scaleName}}</h2>
      <h2 class="title" v-else>新增量表信息</h2>
      <div class="button back-button" @click="goBack">返回</div>
    </div>
    <div class="scroll-area" ref="scrollArea">
      <div class="scale-selecter">
         <div class="choose-scale">
           <span>选择量表:</span>
             <el-select  placeholder="请选择" v-model="scaleSelect">
               <el-option v-for="item in scaleNameArr" :key="item.name" :label="item.name" :value="item.scaleId"></el-option>
             </el-select> 
         </div>
         <div class="choose-time-type">
           <span>量表填写时间:</span>
           <el-select  placeholder="请选择" v-model="scaleSelect">
               <el-option v-for="item in scaleNameArr" :key="item.name" :label="item.name" :value="item.scaleId"></el-option>
           </el-select>   
         </div>
         <div class="choose-time-type">
           <span>量表类型:</span>
           <el-select  placeholder="请选择" v-model="scaleType">
               <el-option v-for="item in scaleTypeData" :key="item.typeName" :label="item.typeName" :value="item.typeCode"></el-option>
           </el-select>   
         </div>
         <div class=" choose-time-type">
           <span>末次服药时间:</span>
           <el-select  placeholder="请选择" v-model="scaleSelect">
               <el-option v-for="item in scaleNameArr" :key="item.name" :label="item.name" :value="item.scaleId"></el-option>
           </el-select>   
         </div>
         <div class="choose-time-type">
           <span>量表状态:</span>
           <el-select  placeholder="请选择" v-model="scaleSelect">
               <el-option v-for="item in scaleNameArr" :key="item.name" :label="item.name" :value="item.scaleId"></el-option>
           </el-select>   
         </div>
      </div>
      <div v-for="(item, key) in scaleSonDate['questions']" v-if="pageTpye==='update'">
         <div class="scale-questions">
           <p class="question-title">题目名称: <span>{{item.subjectName}}</span></p>
           <el-radio-group class="question-body" v-for="(sonitem, sonkey) in item['options']" :key="sonkey" v-model="correctanswer['answer'+key]">
               <el-radio class="question-selection" :label="sonitem.optionName"></el-radio>
           </el-radio-group>  
         </div> 
      </div>       
      </div>
    </div>
  </div>  
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getScaleInfo } from 'api/patient';
import { getDictionary } from 'api/user.js';

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
      scaleNameArr: [],
      scaleSelect: '',
      dictionaryData: [],
      scaleTypeData: [],
      scaleType: ''
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
        // console.log(item);
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
      this.scaleSelect = '';
      this.dictionaryData = [];
      this.scaleTypeData = [];
      this.scaleType = '';
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
    getDictionaryData() {
      getDictionary().then((data) => {
        this.dictionaryData = data['typegroup'];
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
              this.$set(this.correctanswer, 'answer' + i, sondata1['optionName']);
            }
          }
        }
      }
    },
    getScaleNameArr(scaledata) {
      for (let i = 0; i < scaledata.length; i++) {
        let data = scaledata[i];
        if (data['gaugeName']) {
          // this.scaleNameArr.push(data['gaugeName']);
          this.scaleNameArr.push({});
          this.$set(this.scaleNameArr[i], 'name', data['gaugeName']);
          this.$set(this.scaleNameArr[i], 'type', data['gaugeType']);
          this.$set(this.scaleNameArr[i], 'scaleId', data['scaleInfoId']);
          // console.log(this.scaleNameArr);
        }
      }
    },
    getScaleTypeData(data) {
      // 获取到dictionary的数据之后再取出对应的量表类型数据
      for (let i = 0; i < data.length; i++) {
        if (data[i]['typegroupcode'] === 'gaugeType') {
          let typeData = data[i]['types'];
          for (let j = 0; j < typeData.length; j++) {
            this.scaleTypeData.push({});
            this.$set(this.scaleTypeData[j], 'typeCode', typeData[j]['typeCode']);
            this.$set(this.scaleTypeData[j], 'typeName', typeData[j]['typeName']);
          }
        }
      }
    },
    linkAgeScaleType(scaleId) {
      // 通过量表的ID查询到量表的类型并且改变量表类型选择框
      for (let key in this.scaleData) {
        let sonData = this.scaleData[key];
        for (let sonkey in sonData) {
          if (sonkey === 'scaleInfoId') {
            if (sonData[sonkey] === scaleId) {
              this.scaleType = String(sonData['gaugeType']);
            }
          }
        }
      }
    }
  },
  mounted() {
    // 获取到量表的数据
    this.getPatientScaleInfo();
    this.getDictionaryData();
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
          // console.log(newVal);
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
    },
    scaleSelect: {
      handler: function(newVal) {
        if (newVal && this.displayUpdateScale) {
          // 量表改变之后同时改变量表的类型
          this.linkAgeScaleType(newVal);
        }
      }
    },
    dictionaryData: {
      handler: function(newVal) {
        this.getScaleTypeData(newVal);
      }
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
@select-topbottom-padding: 12px;

.diagnostic-update-wrapper {
  p {
    margin: 0;
  }
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
        display: block !important;
        .question-selection {
          margin: 0;
          line-height: 38px;
        }
      }
    }
    .scale-selecter {
      text-align: left;
      background: white;
      font-size: 0px;
      margin-right: @margin-right;
      margin-bottom: @vertical-spacing;
      padding-left: @title-left-padding;
      padding-bottom: @title-bottom-padding;
      padding-top: @select-topbottom-padding;
      padding-bottom: @select-topbottom-padding; 
      box-sizing: border-box;
      // overflow: hidden;
       .choose-scale {
         position: relative;
         font-size: 14px;
         padding: 12px 0;
         span {
           font-weight: bold;
         }
         .el-select {
           position: relative;
           width: 88%;
           .el-input {
             width: 100%;
           }
         }
       }
       .choose-time-type {
         position: relative;
         display: inline-block;
         font-size: 14px;
         width: 50%;
         min-width: 310px !important;
         padding: 12px 0;
         span {
           font-weight: bold;
         }
         .el-select {
           position: absolute;
           left: 100px;
           top: 6px;
           right: 4%;
           .el-input {
             // width: 100%;
           }
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
