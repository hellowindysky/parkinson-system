<template lang="html">
  <div class="diagnostic-update-wrapper" v-show="displayScaleModal">
    <div class="title-bar">
      <h2 class="title" v-if="mode!==ADD_NEW_CARD">{{scaleName}}</h2>
      <h2 class="title" v-else>新增量表信息</h2>
      <div class="button back-button" @click="goBack">返回</div>
      <div class="button edit-button" @click="edit" v-if="mode===VIEW_CURRENT_CARD">编辑</div>
      <div class="button save-button" @click="submit" v-if="mode!==VIEW_CURRENT_CARD">保存</div>
    </div>

    <div class="scroll-area" ref="scrollArea">
      <div class="scale-selector" v-if="mode!==VIEW_CURRENT_CARD">
        <div class="field whole-line">
          <span class="field-name">选择量表:</span>
          <span class="field-value">
            <el-select placeholder="请选择量表" v-model="patientScale.scaleInfoId"
              :disabled="mode===EDIT_CURRENT_CARD || isSelected" @change="selectScale">
              <el-option v-for="item in scaleNameArr" :key="item.name" :label="item.name" :value="item.scaleId"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">量表类型:</span>
          <span class="field-value">
            <el-select v-model="scaleType" disabled>
              <el-option v-for="item in getOptions('gaugeType')" :key="item.code"
                :label="item.name" :value="item.code"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">开关状态:</span>
          <span class="field-value">
            <el-select v-model="patientScale.switchType" placeholder="请选择量表开关状态">
              <el-option v-for="item in switchScaleArr" :key="item.status" :value="item.status" :label="item.options"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">量表填写时间:</span>
          <span class="field-value">
            <el-date-picker type="datetime" v-model="patientScale.inspectTime"  placeholder="请选择量表填写时间">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">末次服药时间:</span>
          <span class="field-value">
            <el-date-picker type="datetime" v-model="patientScale.lastTakingTime"  placeholder="请选择末次服药时间">
            </el-date-picker>
          </span>
        </div>
      </div>

      <div class="scale-selector" v-if="mode===VIEW_CURRENT_CARD">
        <div class="field">
          <span class="field-name">量表类型:</span>
          <span class="field-value">{{readingScaleType}}</span>
        </div>
        <div class="field" v-if="Boolean(String(patientScale.switchType))!==false">
          <span class="field-name">开关状态:</span>
          <span class="field-value">{{getFieldValue(patientScale.switchType, 'switchType')}}</span>
        </div>
        <div class="field" v-if="Boolean(String(patientScale.inspectTime))!==false">
          <span class="field-name">量表填写时间:</span>
          <span class="field-value">{{patientScale.inspectTime}}</span>
        </div>
        <div class="field" v-if="Boolean(String(patientScale.lastTakingTime))!==false">
          <span class="field-name">末次服药时间:</span>
          <span class="field-value">{{patientScale.lastTakingTime}}</span>
        </div>
      </div>

      <folding-panel :title="'关联症状'" :folded-status="mode===VIEW_CURRENT_CARD" class="associated-symptom" :editable="canEdit">
        <div class="symptom-item" v-for="(list, listkey) in patientScale.scaleSympInfoList" :key="listkey">
          <el-checkbox class="symptom-item-title" v-model="list.status" :disabled="isSubjectDisabled">
            {{list.sympName}}
          </el-checkbox>
          <div class="symptom-item-start">
            <span class="field-name">出现时间:</span>
            <el-date-picker type="datetime" format="yyyy-MM-dd" v-model="list.ariseTime"
              placeholder="请输入出现关联症状的时间" :disabled="isSubjectDisabled || !list.status">
            </el-date-picker>
          </div>
          <div class="symptom-item-dose">
            <span class="field-name">服用药物:</span>
            <el-input v-model="list.scaleMedicine"  placeholder="请输入服用药物"
              :disabled="isSubjectDisabled || !list.status"></el-input>
          </div>
        </div>
      </folding-panel>

      <div v-for="(item, key) in targetScale.questions" v-if="mode!==ADD_NEW_CARD">
        <div class="scale-questions">
          <p class="question-title">
            <span>{{item.subjectName}}</span>
          </p>
          <el-radio-group class="question-body" :key="key" v-model="patientScale.scaleOptionIds[key]">
            <el-radio class="question-selection" v-for="(sonitem, i) in item.options"
              :label="sonitem.scaleOptionId" :key="i" :disabled="isSubjectDisabled">
                {{sonitem.optionName}}
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <div v-for="(item, key) in scaleToAdd.questions" v-if="mode===ADD_NEW_CARD && isSelected">
        <div class="scale-questions">
          <p class="question-title">
            <span>{{item.subjectName}}</span>
          </p>
          <el-radio-group class="question-body" :key="key" v-model="patientScale.scaleOptionIds[key]">
            <el-radio class="question-selection" v-for="(sonitem, i) in item.options"
              :label="sonitem.scaleOptionId" :key="i">
              {{sonitem.optionName}}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getScaleInfo } from 'api/patient';
import { mapGetters } from 'vuex';
import { vueCopy } from 'utils/helper';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import Util from 'utils/util.js';
import { deepCopy } from 'utils/helper';
import { modifyScaleInfo, addScaleInfo } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      useless: {},
      isSelected: false, // 在新增的时候选了一次就改变状态
      readingScaleType: '',
      isSubjectDisabled: true,
      patientScale: {},  // 需要向服务器提交的对象
      displayScaleModal: false,  // 此组件是否显示
      scaleList: {},  // 获取到所有的量表数据
      targetScale: {}, // 这是通过量表的ID筛选出的其中一个量表
      scaleToAdd: {}, // 新增量表的时候选中量表后的题目数据
      scaleName: '',  // 筛选出来的量表的名字
      scaleAnswer: [],  // 放筛选出来的量表病人填写答案的数组
      correctanswer: [], // 通过函数处理后得出的对应答案选项数组
      scaleNameArr: [], // 获取到所有量表的名字,类型,和量表ID
      scaleType: '',   // 这个值是量表类型下拉框绑定的变量改变它可以随时改变量表类型下拉框
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
      scaleSympInfoName: [],
      switchNum: 0
    };
  },
  computed: {
    ...mapGetters([
      'scaleTemplateGroups',
      'typeGroup'
    ]),
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    selectScale() {
      if (this.switchNum > 0) {
        this.isSelected = true;
      }
      for (let scale of this.scaleList) {
        for (let sonkey in scale) {
          if (sonkey === 'scaleInfoId') {
            // 获取对应量表的数据
            if (scale[sonkey] === this.patientScale['scaleInfoId']) {
              vueCopy(scale, this.scaleToAdd);
            }
          }
        }
      }
      this.switchNum += 1;
      this.updateScrollbar();
    },
    getFieldValue(code, fieldName) {
      if (fieldName === 'switchType') {
        if (code === 1) {
          return '开';
        } else {
          return '关';
        }
      } else {
        return '';
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    },
    showDetailPanel(cardOperation, item) {
      this.mode = cardOperation;
      this.displayScaleModal = true;
      this.switchNum = 0;
      // console.log('item', item);
      if (this.mode !== this.ADD_NEW_CARD) {
        // 如果不是新增量表
        // 通过量表ID来获取量表的信息
        this.getTitleAndScale(item.scaleInfoId);

        this.scaleAnswer = [];
        for (let i = 0; i < item.scaleOptionIds.length; i++) {
          let answer = item.scaleOptionIds[i];
          this.$set(this.scaleAnswer, i, answer);
        }

        this.isSubjectDisabled = this.mode === this.VIEW_CURRENT_CARD;

        // 在修改页面的状态下将原来的数据对象给服务器的对象
        this.patientScale = {};
        vueCopy(item, this.patientScale);
        // console.log(this.targetScale.questions);
        this.getCorrectAnswer(this.targetScale.questions);

        if (this.patientScale['scaleSympInfoList']) {
          for (let i = 0; i < this.scaleSympInfoName.length; i++) {
            let sympKey = this.scaleSympInfoName[i];
            if (this.patientScale['scaleSympInfoList']) {
              for (let j = 0; j < this.patientScale['scaleSympInfoList'].length; j++) {
                let patientKey = this.patientScale['scaleSympInfoList'][j];
                if (sympKey['sympName'] === patientKey['sympName']) {
                  this.$set(this.scaleSympInfoName, i, this.patientScale['scaleSympInfoList'][j]);
                  this.$set(this.scaleSympInfoName[i], 'status', true);
                }
              }
            }
          }
          vueCopy(this.scaleSympInfoName, this.patientScale['scaleSympInfoList']);

        } else {
          this.$set(this.patientScale, 'scaleSympInfoList', []);
          vueCopy(this.scaleSympInfoName, this.patientScale['scaleSympInfoList']);
          for (let j = 0; j < this.patientScale['scaleSympInfoList'].length; j++) {
            this.$set(this.patientScale['scaleSympInfoList'][j], 'status', false);
          }
          console.log('error', this.scaleSympInfoName);
        }
        // 把关联症状那个数组赋值给这个提交的对象
        this.isSelected = false;
      } else {
        // 新增量表模式
        this.initPatientScale();
        vueCopy(this.scaleSympInfoName, this.patientScale['scaleSympInfoList']);
        this.isSelected = false;
      }
      this.$refs.scrollArea.scrollTop = 0;
      // console.log('patientScale: ', this.patientScale);
    },
    goBack() {
      // 按下返回按钮，把所有的数据都初始化一遍
      this.correctanswer = [];
      this.scaleList = {};
      this.scaleName = '';
      this.scaleAnswer = [];
      this.scaleNameArr = [];
      this.scaleType = '';
      this.isSubjectDisabled = true;
      this.scaleToAdd = {};
      this.displayScaleModal = false;
      this.isSelected = false;
      this.switchNum = 0;
    },
    edit() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.isSubjectDisabled = false;
    },
    submit() {
      this.isSubjectDisabled = true;
      let submitData = deepCopy(this.patientScale);
      // 删除不需要的字段
      delete submitData.scaleSympName;
      delete submitData.scaleSympTip;
      for (let key in submitData) {
        switch (key) {
          case 'inspectTime' :
          case 'lastTakingTime' :
            submitData[key] = Util.simplifyTime(submitData[key]);
            break;
          case 'scaleSympInfoList' :
            if (submitData[key].length) {
              let sympInfo = submitData[key];
              let flag = false;
              for (let j = 0; j < sympInfo.length; j++) {
                let sonSympInfo = sympInfo[j];
                for (let sonSympKey in sonSympInfo) {
                  this.useless = sonSympKey;
                  if (sonSympInfo['status'] === false) {
                    sympInfo.splice(j, 1);
                  } else {
                    flag = true;
                    delete sonSympInfo.status;
                  }
                }
              }
              if (!flag) {
                submitData[key] = [];
              }
            }
            for (let i = 0; i < submitData[key].length; i++) {
              for (let sonkey in submitData[key][i]) {
                // console.log(submitData[key][i]);
                if (sonkey === 'ariseTime') {
                  submitData[key][i][sonkey] = Util.simplifyTime(submitData[key][i][sonkey]);
                  console.log('succ');
                }
              }
            }
        }
      }
      if (this.mode === this.ADD_NEW_CARD) {
        // console.log('add', submitData);
        // 新增量表的接口
        addScaleInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.goBack();
        });
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        // 修改量表的接口
        console.log(submitData);
        modifyScaleInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.goBack();
        });
      }
    },
    closePanel() {
      this.displayScaleModal = false;
      // this.scaleDetail = {};
    },
    getPatientScaleInfo() {
      getScaleInfo().then((data) => {
        this.scaleList = data.scales;
      });
    },
    initScaleSympInfoName() {
      var typesInfo = Util.getElement('typegroupcode', 'scaleSymp', this.typeGroup);
      var types = typesInfo.types ? typesInfo.types : [];
      vueCopy(types, this.scaleSympInfoName);
      for (let i = 0; i < this.scaleSympInfoName.length; i++) {
        this.$set(this.scaleSympInfoName[i], 'status', false);
        this.$set(this.scaleSympInfoName[i], 'ariseTime', '');
        this.$set(this.scaleSympInfoName[i], 'scaleMedicine', '');
        this.$set(this.scaleSympInfoName[i], 'sympName', this.scaleSympInfoName[i]['typeName']);
        this.$set(this.scaleSympInfoName[i], 'sympCode', this.scaleSympInfoName[i]['typeCode']);
        delete this.scaleSympInfoName[i]['typeName'];
        delete this.scaleSympInfoName[i]['typeCode'];
      }
    },
    getTitleAndScale(scaleInfoId) {
      var targetScale = Util.getElement('scaleInfoId', scaleInfoId, this.scaleList);
      vueCopy(targetScale, this.targetScale);
      this.scaleName = targetScale.gaugeName;
      var options = this.getOptions('gaugeType');
      var option = Util.getElement('code', targetScale.gaugeType, options);
      this.readingScaleType = option.name;
    },
    getCorrectAnswer(questions) {
      // 取出量表的选中答案以及对应的分数
      this.$set(this.patientScale, 'scaleOptionIds', []);
      for (let j = 0; j < questions.length; j++) {
        let sondata = questions[j].options;
        let isNull = true;
        let answer = '';
        for (let sonkey in sondata) {
          let sondata1 = sondata[sonkey];
          for (let i = 0; i < this.scaleAnswer.length; i++) {
            if (sondata1['scaleOptionId'] === this.scaleAnswer[i]) {
              isNull = false;
              answer = sondata1['scaleOptionId'];
            }
          }
        }
        if (isNull) {
          this.$set(this.patientScale['scaleOptionIds'], j, null);
        } else {
          this.$set(this.patientScale['scaleOptionIds'], j, answer);
        }
      }
    },
    getOptions(fieldName) {
      var options = [];
      var typesInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typesInfo.types ? typesInfo.types : [];
      for (let type of types) {
        options.push({
          code: type.typeCode,
          name: type.typeName
        });
      }
      return options;
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
        }
      }
    },
    linkAgeScaleType(scaleId) {
      // 通过量表的ID查询到量表的类型并且改变量表类型选择框
      for (let key in this.scaleList) {
        let sonData = this.scaleList[key];
        for (let sonkey in sonData) {
          if (sonkey === 'scaleInfoId') {
            if (sonData[sonkey] === scaleId) {
              this.scaleType = sonData['gaugeType'];
            }
          }
        }
      }
    },
    initPatientScale() {
      // 初始化patientScale对象
      this.$set(this.patientScale, 'inspectTime', '');
      this.$set(this.patientScale, 'lastTakingTime', '');
      this.$set(this.patientScale, 'scaleOptionIds', []);
      this.$set(this.patientScale, 'scaleInfoId', '');
      this.$set(this.patientScale, 'switchType', '');
      this.$set(this.patientScale, 'scaleSympInfoList', []);
      this.$set(this.patientScale, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.patientScale, 'patientId', this.$route.params.id);
    }
  },
  mounted() {
    // 获取到量表的数据
    this.getPatientScaleInfo();
    // 初始化关联症状的字段
    this.initScaleSympInfoName();
    // 初始化提交到服务器的对象
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
  watch: {
    targetScale: {
      handler: function(newVal) {
        if (newVal) {
          this.getCorrectAnswer(newVal['questions']);
        }
      },
      deep: true
    },
    displayScaleModal: {
      handler: function() {
        this.getPatientScaleInfo();
      },
      deep: true
    },
    scaleList: {
      handler: function(newVal) {
        if (newVal && this.displayScaleModal) {
          this.getScaleNameArr(newVal);
        }
      },
      deep: true
    },
    patientScale: {
      handler: function(newVal) {
        if (newVal && this.displayScaleModal) {
          this.linkAgeScaleType(newVal['scaleInfoId']);
          // console.log('patientScale', newVal);
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
@title-left-padding: 30px;
@title-bottom-padding: 10px;
@select-top-padding: 12px;

@symptom-item-title-padding: 30px;
@symptom-item-title-width: 130px;

@field-name-width: 95px;

.diagnostic-update-wrapper {
  width: 100%;
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
      &.edit-button {
        background-color: @button-color;
        right: 100px;
      }
      &.save-button {
        background-color: @button-color;
        right: 100px;
      }
    }
  }
  .scroll-area {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{title-bar-height} - @{title-bar-margin-bottom}");
    padding-right: @margin-right;
    box-sizing: border-box;
    overflow: hidden;
    .scale-questions {
      position: relative;
      margin-bottom: @vertical-spacing;
      padding: 0 @title-left-padding 10px;
      text-align: left;
      background: white;
      font-size: 14px;;
      box-sizing: border-box;
      .question-title {
        margin: 0;
        padding: 15px 0;
        line-height: 25px;
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
        font-weight: normal;
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
    .scale-selector {
      text-align: left;
      width: 100%;
      background: white;
      font-size: 0px;
      margin-right: @margin-right;
      margin-bottom: @vertical-spacing;
      padding: @select-top-padding @title-left-padding;
      box-sizing: border-box; // overflow: hidden;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        height: 45px;
        line-height: 45px;
        &.whole-line {
          width: 100%;
          .field-value {
            right: 2%;
          }
        }
        .field-name {
          display: inline-block;
          width: @field-name-width;
          font-weight: bold;
          font-size: @normal-font-size;
        }
        .field-value {
          position: absolute;
          left: @field-name-width;
          right: 4%;
          font-size: @normal-font-size;
        }
        .el-input {
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
          &.is-disabled {
            .el-input__inner {
              background-color: #f0f1f2;
              color: @gray-color;
            }
          }
        }
        .el-select {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
        }
      }
    }
    .associated-symptom {
      margin-bottom: @vertical-spacing;
      width: 100%;
      text-align: left;
      .symptom-item {
        // 这是一个关联症状的外层盒子
        display: inline-block;
        position: relative;
        width: 100%;
        box-sizing: border-box;
        padding: 0 @symptom-item-title-padding;
        font-size: 0;
        line-height: 50px;
        height: 50px;
        .el-input {
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
          &.is-disabled {
            .el-input__inner {
              background-color: #f0f1f2;
              color: @gray-color;
            }
          }
        }
        .symptom-item-title {
          display: inline-block;
          width: @symptom-item-title-width;
          .el-checkbox__input {
            position: relative;
            top: -5px;
          }
        }
        .symptom-item-start, .symptom-item-dose {
          display: inline-block;
          position: relative;
          width: calc(~"50% - @{symptom-item-title-width}/2");
          font-size: 0;
          .field-name {
            display: inline-block;
            width: 90px;
            text-align: center;
            font-size: @normal-font-size;
            color: @light-font-color;
          }
          .el-input {
            position: absolute;
            left: 85px;
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
