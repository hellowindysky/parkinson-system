<template lang="html">
  <div class="diagnostic-update-wrapper" v-show="displayUpdateScale">
    <div class="title-bar">
      <h2 class="title" v-if="pageTpye==='update'">{{scaleName}}</h2>
      <h2 class="title" v-else>新增量表信息</h2>
      <div class="button back-button" @click="goBack">返回</div>
    </div>
    <div class="scroll-area" ref="scrollArea">
      <div class="scale-selecter" v-show="pageTpye!=='update'">
         <div class="choose-scale">
           <span>选择量表:</span>
             <el-select  placeholder="请选择量表" v-model="patientScale['scaleInfoId']">
               <el-option v-for="item in scaleNameArr" :key="item.name" :label="item.name" :value="item.scaleId"></el-option>
             </el-select> 
         </div>
         <div class="choose-scale">
           <span>量表类型:</span>
           <el-select  placeholder="" v-model="scaleType" disabled>
               <el-option v-for="item in scaleTypeData" :key="item.typeName" :label="item.typeName" :value="item.typeCode"></el-option>
           </el-select>   
         </div>
      </div>   
      <div class="scale-selecter" v-show="pageTpye!=='update'">            
         <div class="choose-time-type">
           <span>量表填写时间:</span>
             <el-date-picker type="date" v-model="patientScale['inspectTime']"  placeholder="请选择量表填写时间" :picker-options="pickerOptions0">
             </el-date-picker>  
         </div>
         <div class="choose-time-type">
           <span>末次服药时间:</span>
             <el-date-picker type="date" v-model="patientScale['lastTakingTime']"  placeholder="请选择末次服药时间" :picker-options="pickerOptions0">
             </el-date-picker>  
         </div>
         <div class="choose-time-type">
           <span>开关状态:</span>
           <el-select  placeholder="请选择量表开关状态" v-model="patientScale['switchType']">
               <el-option v-for="item in switchScaleArr" :key="item.options" :label="item.options" :value="item.status"></el-option>
           </el-select>
         </div>
      </div>
      <folding-panel :title="'关联症状'" class="associated-symptom" v-show="pageTpye!=='update'">
        <div class="symptom-item" v-for="(list, listkey) in scaleSympInfoName" :key="listkey">
            <el-checkbox class="symptom-item-title" v-model="list.status">{{list.name}}</el-checkbox>
            <div class="symptom-item-start">
              <span>出现时间:</span>
              <el-date-picker type="date" v-model="patientScale['lastTakingTime']"  placeholder="请输入出现关联症状的时间">
              </el-date-picker>    
            </div>
            <div class="symptom-item-dose">
              <span>服用药物:</span>
              <el-input placeholder="请输入复合用药物"></el-input>    
            </div>
        </div>  
                                            
      </folding-panel>
      <div v-for="(item, key) in scaleSonDate['questions']" v-if="pageTpye==='update'">
         <div class="scale-questions">
           <p class="question-title" @mouseenter="showOption(key)" @mouseleave="hideOption(key)">题目名称: <span>{{item.subjectName}}</span><span>得分{{correctGrade['grade'+key]}}</span></p>
           <el-radio-group v-show="isShowOption['showoption'+key]" class="question-body" :class="{'absolu': isShowOption['showoption'+key]}" :key="key" v-model="correctanswer['answer'+key]">
               <el-radio class="question-selection" :label="sonitem.optionName" v-for="(sonitem, key1) in item['options']" :key="key1" disabled></el-radio>
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
import { deepCopy } from 'utils/helper.js';
// import Util from 'utils/util.js';
import { mapGetters } from 'vuex';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      patientScale: {},  // 需要向服务器提交的对象
      displayUpdateScale: false,  // 此组件是否显示
      scaleData: {},  // 获取到所有的量表数据
      scaleSonDate: {}, // 这是通过量表的ID筛选出的其中一个量表
      scaleName: '',  // 筛选出来的量表的名字
      scaleAnswer: [],  // 放筛选出来的量表病人填写答案的数组
      correctGrade: [], // 放筛选出来的量表题目的分数的数组
      correctanswer: {}, // 通过函数处理后得出的对应答案选项数组
      pageTpye: '',  // 确定到底是新增量表还是修改量表页面
      scaleNameArr: [], // 获取到所有量表的名字,类型,和量表ID
      dictionaryData: [], // 获取到量表的字典项
      scaleTypeData: [], // 这是从量表的字典项中查到的量表类型具体信息
      scaleType: '',   // 这个值是量表类型下拉框绑定的变量改变它可以随时改变量表类型下拉框
      isShowOption: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      switchScaleArr: [
        {
          status: 1,
          options: '开'
        },
        {
          status: 0,
          options: '关'
        }
      ],
      scaleSympInfoName: [
        {
          name: '异动症剂峰',
          status: false,
          code: 0
        },
        {
          name: '异动症剂末',
          status: false,
          code: 1
        },
        {
          name: '剂末现象',
          status: false,
          code: 2
        },
        {
          name: '痛性痉挛',
          status: false,
          code: 3
        },
        {
          name: '晨僵',
          status: false,
          code: 4
        },
        {
          name: '开关现象',
          status: false,
          code: 5
        }
      ]
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
      // this.scaleSonDate = {};
      this.scaleName = '';
      this.scaleAnswer = [];
      this.correctanswer = {};
      this.correctGrade = [];
      this.pageTpye = '';
      this.scaleNameArr = [];
      this.dictionaryData = [];
      this.scaleTypeData = [];
      this.scaleType = '';
      // this.isShowOption = [];
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
              this.scaleSonDate = deepCopy(sonData);
              this.scaleName = sonData['gaugeName'];
              console.log(this.scaleSonDate);
            }
          }
        }
      }
    },
    getCorrectAnswer1(data) {
      // 取出量表的选中答案以及对应的分数
      console.log(this.scaleAnswer);
      for (let key in data) {
        let sondata = data[key]['options'];
        let isNull = true;
        let answer = '';
        let grade = '';
        for (let sonkey in sondata) {
          let sondata1 = sondata[sonkey];
          for (let i = 0; i < this.scaleAnswer.length; i++) {
            if (sondata1['scaleOptionId'] === this.scaleAnswer[i]) {
              isNull = false;
              answer = sondata1['optionName'];
              grade = sondata1['grade'];
            }
          }
        }
        if (isNull) {
          this.$set(this.correctanswer, 'answer' + key, null);
          this.$set(this.correctGrade, 'grade' + key, null);
        } else {
          this.$set(this.correctanswer, 'answer' + key, answer);
          this.$set(this.correctGrade, 'grade' + key, grade);
        }
        console.log(this.correctGrade);
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
    },
    initIsShowOption(len) {
      for (let i = 0; i < len; i++) {
        this.$set(this.isShowOption, 'showoption' + i, false);
      }
      console.log(this.isShowOption);
    },
    showOption(key) {
      let that = this;
      setTimeout(
        function() {
          that.$set(that.isShowOption, 'showoption' + key, true);
        }, 500);
    },
    hideOption(key) {
      let that = this;
      setTimeout(
        function() {
          that.$set(that.isShowOption, 'showoption' + key, false);
        }, 500);
    },
    initPatientScale() {
      // 初始化patientScale对象
      this.$set(this.patientScale, 'inspectTime', '');
      this.$set(this.patientScale, 'lastTakingTime', '');
      this.$set(this.patientScale, 'scaleOptionIds', []);
      this.$set(this.patientScale, 'scaleInfoId', '');
      this.$set(this.patientScale, 'switchType', '');
      this.$set(this.patientScale, 'scaleSympInfoList', []);
      console.log(this.patientScale);
      // 获取量表的template

    },
    handlerSympInfo(newVal) {
      for (let key in newVal) {
        let sonData = newVal[key];
        let sympName = sonData['name'];
        let flag = false;
        if (!this.patientScale['scaleSympInfoList'].length) {
          flag = true;
        } else {
          flag = true;
          for (let key in this.patientScale['scaleSympInfoList']) {
            let obj = this.patientScale['scaleSympInfoList'][key];
            if (obj['sympName'] === sympName) {
              flag = false;
            }
          }
        }
        if (sonData['status'] === true) {
          if (flag) {
            this.patientScale['scaleSympInfoList'].push({});
            let len = this.patientScale['scaleSympInfoList'].length - 1;
            let code = '';
            for (let key in this.scaleSympInfoName) {
              if (this.scaleSympInfoName[key]['name'] === sympName) {
                code = this.scaleSympInfoName[key]['code'];
              }
            }
            this.$set(this.patientScale['scaleSympInfoList'][len], 'sympName', sonData['name']);
            this.$set(this.patientScale['scaleSympInfoList'][len], 'sympCode', code);
            this.$set(this.patientScale['scaleSympInfoList'][len], 'ariseTime', '');
            this.$set(this.patientScale['scaleSympInfoList'][len], 'scaleMedicine', '');
          }
        } else {
          for (let key in this.patientScale['scaleSympInfoList']) {
            let sonData1 = this.patientScale['scaleSympInfoList'][key];
            if (sonData1['sympName'] === sonData['name']) {
              this.patientScale['scaleSympInfoList'].splice(key, 1);
            }
          }
        }
      }
    }
  },
  mounted() {
    // 获取到量表的数据
    this.getPatientScaleInfo();
    // 获取到字典项的所有数据
    this.getDictionaryData();
    // 初始化提交到服务器的对象
    this.initPatientScale();
    Bus.$on(this.UPDATE_SCALE_DETAIL, this.showDetailPanel);
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.UPDATE_SCALE_DETAIL, this.showDetailPanel);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  },
  components: {
    FoldingPanel
  },
  computed: {
    ...mapGetters([
      'scaleTemplateGroups'
    ])
  },
  watch: {
    scaleSonDate: {
      handler: function(newVal) {
        if (newVal) {
          this.scaleData = newVal;
          this.getCorrectAnswer1(newVal['questions']);
          this.initIsShowOption(newVal['questions'].length);
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
    dictionaryData: {
      handler: function(newVal) {
        this.getScaleTypeData(newVal);
      }
    },
    patientScale: {
      handler: function(newVal) {
        if (newVal && this.displayUpdateScale) {
          console.log(newVal);
          this.linkAgeScaleType(newVal['scaleInfoId']);
        }
      },
      deep: true
    },
    scaleSympInfoName: {
      handler: function(newVal) {
        if (newVal && this.displayUpdateScale) {
          // 监听这个对象的目的是用户点击了check多选框如果选中了那个就在patientScale下面添加相应的对象
          // console.log(newVal);
          console.log(newVal);
          this.handlerSympInfo(newVal);
        }
        // console.log(this.patientScale['scaleSympInfoList']);
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
@select-topbottom-padding: 12px;

@symptom-item-title-padding: 40px;
@symptom-item-title-width: 220px;

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
      position: relative;
      text-align: left;
      background: white;
      font-size: 14px;
      margin-right: @margin-right;
      margin-bottom: @vertical-spacing;
      padding-left: @title-left-padding; // padding-bottom: @title-bottom-padding;
      box-sizing: border-box;
      .question-title {
        line-height: 62px;
        font-weight: bold;
        span {
          color: @secondary-button-color;
        }
        span:nth-of-type(2) {
          float: right;
          margin-right: 50px;
        }
      }
      .question-body {
        margin: 0;
        padding: 0;
        color: @secondary-button-color;
        font-weight: 100;
        display: block; // display: none;
        &.absolu {
          position: absolute;
          height: auto;
          background: @button-color;
          z-index: 1000;
          width: 600px;
        }
        .question-selection {
          margin: 0;
          line-height: 38px;
          display: block;
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
      box-sizing: border-box; // overflow: hidden;
      .choose-scale {
        position: relative;
        font-size: 14px;
        padding: 24px 0;
        span {
          font-weight: bold;
          display: inline-block;
          width: 90px;
        }
        .el-select {
          position: absolute;
          min-width: 190px;
          left: 100px;
          top: 14px;
          right: 2%;
        }
      }
      .choose-scale:nth-of-type(2) {
        margin-bottom: @title-bar-margin-bottom; 
      } 
      .choose-time-type {
        position: relative;
        display: inline-block;
        font-size: 14px;
        width: 50%;
        padding: 24px 0;
        span {
          font-weight: bold;
          display: inline-block;
          width: 90px;
        }
        .el-select {
          position: absolute;
          left: 100px;
          min-width: 190px;
          top: 14px;
          right: 4%;
          .el-input {
            // width: 100%;
          }
        }
        .el-date-editor {
          position: absolute !important;
          left: 100px !important;
          min-width: 190px !important;
          top: 14px !important;
          right: 4% !important;
          width: auto !important;
        }
      }
    }
    .associated-symptom {
      margin-right: @margin-right;
      text-align: left;
      .symptom-item { // 这是一个关联症状的外层盒子
        position: relative; 
        width: 100%;
        display: inline-block;
        font-size: 0;
        line-height: 60px;
        height: 60px;
         .symptom-item-title { // 标题固定一个宽度
           box-sizing: border-box;
           padding-left: @symptom-item-title-padding;
           width: @symptom-item-title-width;
           display: inline-block;
           .el-checkbox__input {
             position: relative;
             top: -4px !important;
           }
         }
         .symptom-item-start {
           position: relative;
           width: calc(~"50% - @{symptom-item-title-width}/2");
           height: 60px;
           line-height: 60px;
           display: inline-block;
           font-size: 0;
            span {
              display: inline-block;
              width: 90px;
              text-align: center;
              font-size: 14px;
            }
            .el-date-editor {
              position: absolute;
              left: 100px;
              right: 4%;
              width: auto; 
            }
         }
         .symptom-item-dose {
           width: calc(~"50% - @{symptom-item-title-width}/2");
           height: 60px;
           line-height: 60px;
           position: relative;
           display: inline-block;
           font-size: 0;
           span {
              display: inline-block;
              width: 90px;
              text-align: center;
              font-size: 14px;
            }
            .el-input {
              position: absolute;
              left: 100px;
              right: 4%;
              width: auto; 
            }           
         }
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: -2px;
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
