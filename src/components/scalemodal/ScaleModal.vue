<template lang="html">
  <div class="diagnostic-update-wrapper" v-show="displayScaleModal">
    <div class="title-bar">
      <h2 class="title" v-if="mode!==ADD_NEW_CARD">{{scaleName}}</h2>
      <h2 class="title" v-else>新增量表信息</h2>
      <div class="button back-button" @click="closePanel">返回</div>
      <div class="button edit-button" @click="edit" v-if="mode===VIEW_CURRENT_CARD">编辑</div>
      <div class="button save-button" @click="submit" v-if="mode!==VIEW_CURRENT_CARD">保存</div>
    </div>

    <div class="scroll-area" ref="scrollArea">
      <div class="scale-selector" v-if="mode!==VIEW_CURRENT_CARD">
        <div class="field whole-line">
          <span class="field-name">选择量表:</span>
          <span class="field-value">
            <el-select placeholder="请选择量表" v-model="copyInfo.scaleInfoId"
              :disabled="copyInfo.scaleInfoId!==''" @change="selectScale">
              <el-option v-for="scale in allScale" :key="scale.scaleInfoId" :label="scale.gaugeName"
                :value="scale.scaleInfoId" v-show="getScaleTypeCode(scale.scaleInfoId)===scaleTypeCode"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">量表类型:</span>
          <span class="field-value">{{scaleType}}</span>
        </div>
        <div class="field">
          <span class="field-name">开关状态:</span>
          <span class="field-value">
            <el-select v-model="copyInfo.switchType" placeholder="请选择量表开关状态">
              <el-option :value="1" label="开"></el-option>
              <el-option :value="0" label="关"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">量表填写时间:</span>
          <span class="field-value">
            <el-date-picker type="datetime" v-model="copyInfo.inspectTime" placeholder="请选择量表填写时间">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">末次服药时间:</span>
          <span class="field-value">
            <el-date-picker type="datetime" v-model="copyInfo.lastTakingTime" placeholder="请选择末次服药时间">
            </el-date-picker>
          </span>
        </div>
      </div>

      <div class="scale-selector" v-if="mode===VIEW_CURRENT_CARD">
        <div class="field">
          <span class="field-name">量表类型:</span>
          <span class="field-value">{{scaleType}}</span>
        </div>
        <div class="field" v-if="Boolean(String(copyInfo.switchType))!==false">
          <span class="field-name">开关状态:</span>
          <span class="field-value">{{getFieldValue(copyInfo.switchType, 'switchType')}}</span>
        </div>
        <div class="field" v-if="Boolean(String(copyInfo.inspectTime))!==false">
          <span class="field-name">量表填写时间:</span>
          <span class="field-value">{{copyInfo.inspectTime}}</span>
        </div>
        <div class="field" v-if="Boolean(String(copyInfo.lastTakingTime))!==false">
          <span class="field-name">末次服药时间:</span>
          <span class="field-value">{{copyInfo.lastTakingTime}}</span>
        </div>
      </div>

      <folding-panel :title="'关联症状'" :folded-status="true" class="associated-symptom" :editable="canEdit">
        <div class="symptom-item" v-for="(symptom, index) in scaleSymptomList">
          <el-checkbox class="symptom-item-title" v-model="symptom.status" :disabled="mode===VIEW_CURRENT_CARD">
            {{symptom.sympName}}
          </el-checkbox>
          <div class="symptom-item-start">
            <span class="field-name">出现时间:</span>
            <el-date-picker type="datetime" format="yyyy-MM-dd" v-model="symptom.ariseTime"
              placeholder="请输入出现关联症状的时间" :disabled="mode===VIEW_CURRENT_CARD || !symptom.status">
            </el-date-picker>
          </div>
          <div class="symptom-item-dose">
            <span class="field-name">服用药物:</span>
            <el-input v-model="symptom.scaleMedicine" placeholder="请输入服用药物"
              :disabled="mode===VIEW_CURRENT_CARD || !symptom.status" :maxlength="500"></el-input>
          </div>
        </div>
      </folding-panel>

      <div v-for="(item, index) in targetScale.questions" class="scale-questions">
        <p class="question-title">
          <span>{{item.subjectName}}</span>
        </p>
        <el-radio-group class="question-body" :key="index" v-model="copyInfo.scaleOptionIds[index]">
          <el-radio class="question-selection" v-for="(option, i) in item.options"
            :label="option.scaleOptionId" :key="i" :disabled="mode===VIEW_CURRENT_CARD">
              {{option.optionName}}
          </el-radio>
        </el-radio-group>
      </div>

    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { modifyScaleInfo, addScaleInfo } from 'api/patient';
import { mapGetters } from 'vuex';
import { vueCopy, deepCopy } from 'utils/helper';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      displayScaleModal: false,
      mode: '',
      copyInfo: {},
      scaleTypeCode: '',

      scaleSymptomList: [], // 关联症状列表，长度由 typeGroup 决定
      scaleAnswer: []       // 放筛选出来的量表病人填写答案的数组
    };
  },
  computed: {
    ...mapGetters([
      'scaleTemplateGroups',
      'typeGroup',
      'allScale'
    ]),
    targetScale() {
      let scale = Util.getElement('scaleInfoId', this.copyInfo.scaleInfoId, this.allScale);
      return scale;
    },
    scaleName() {
      return this.targetScale.gaugeName ? this.targetScale.gaugeName : '';
    },
    scaleType() {
      var options = this.getOptions('gaugeType');
      var option = Util.getElement('code', this.scaleTypeCode, options);
      return option.name ? option.name : '';
    },
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
    showDetailPanel(cardOperation, item, scaleTypeCode) {
      this.mode = cardOperation;

      this.initPatientScale(item);
      this.scaleTypeCode = scaleTypeCode;
      this.initSymptomList();
      this.scaleAnswer = [];

      // console.log('item', item);

      // 只有阅读和修改的状态下，item.scaleOptionIds 才可能不为空
      if (item.scaleOptionIds) {
        for (let i = 0; i < item.scaleOptionIds.length; i++) {
          let answer = item.scaleOptionIds[i];
          this.$set(this.scaleAnswer, i, answer);
        }
      }

      this.getCorrectAnswer();

      this.displayScaleModal = true;
      this.$refs.scrollArea.scrollTop = 0;
      // console.log('copyInfo: ', this.copyInfo);
    },
    edit() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    submit() {
      let submitData = deepCopy(this.copyInfo);
      // console.log('submitData', submitData);

      // 去掉空答案
      var optionIds = [];
      for (let i = 0; i < submitData.scaleOptionIds.length; i++) {
        if (submitData.scaleOptionIds[i] !== '') {
          optionIds.push(submitData.scaleOptionIds[i]);
        }
      }
      submitData.scaleOptionIds = optionIds;

      submitData.inspectTime = Util.simplifyTime(submitData.inspectTime);
      submitData.lastTakingTime = Util.simplifyTime(submitData.lastTakingTime);

      var scaleSympInfoList = deepCopy(this.scaleSymptomList);
      submitData.scaleSympInfoList = [];
      for (let symptom of scaleSympInfoList) {
        if (symptom.status) {
          symptom.ariseTime = Util.simplifyTime(symptom.ariseTime);
          delete symptom.status;
          submitData.scaleSympInfoList.push(symptom);
        }
      }

      if (this.mode === this.ADD_NEW_CARD) {
        // 新增量表的接口
        // console.log('add', submitData);
        addScaleInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.closePanel();
        });
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        // 修改量表的接口
        // console.log('modify', submitData);
        modifyScaleInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.closePanel();
        });
      }
    },
    closePanel() {
      this.displayScaleModal = false;
    },
    getCorrectAnswer() {
      // 取出量表的选中答案以及对应的分数
      if (!this.targetScale.questions) {
        return;
      }
      this.$set(this.copyInfo, 'scaleOptionIds', []);
      for (var i = 0; i < this.targetScale.questions.length; i++) {
        let options = this.targetScale.questions[i].options;
        let isNull = true;
        let targetAnswer = '';
        for (let option of options) {
          for (let answer of this.scaleAnswer) {
            if (option.scaleOptionId === answer) {
              isNull = false;
              targetAnswer = option.scaleOptionId;
            }
          }
        }
        if (isNull) {
          this.$set(this.copyInfo.scaleOptionIds, i, '');
        } else {
          this.$set(this.copyInfo.scaleOptionIds, i, targetAnswer);
        }
      }
    },
    getScaleTypeCode(scaleInfoId) {
      var scale = Util.getElement('scaleInfoId', scaleInfoId, this.allScale);
      return scale.gaugeType;
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
    initPatientScale(item) {
      // 初始化copyInfo对象
      this.copyInfo = {};
      this.$set(this.copyInfo, 'scaleInfoId', '');
      this.$set(this.copyInfo, 'inspectTime', '');
      this.$set(this.copyInfo, 'lastTakingTime', '');
      this.$set(this.copyInfo, 'scaleOptionIds', []);
      this.$set(this.copyInfo, 'switchType', '');
      this.$set(this.copyInfo, 'scaleSympInfoList', []);
      this.$set(this.copyInfo, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.copyInfo, 'patientId', this.$route.params.id);
      vueCopy(item, this.copyInfo);
    },
    initSymptomList() {
      var typesInfo = Util.getElement('typegroupcode', 'scaleSymp', this.typeGroup);
      var types = typesInfo.types ? typesInfo.types : [];

      this.scaleSymptomList = [];
      for (let i = 0; i < types.length; i++) {
        this.$set(this.scaleSymptomList, i, {});
        this.$set(this.scaleSymptomList[i], 'status', false);
        this.$set(this.scaleSymptomList[i], 'ariseTime', '');
        this.$set(this.scaleSymptomList[i], 'scaleMedicine', '');
        this.$set(this.scaleSymptomList[i], 'sympName', types[i].typeName);
        this.$set(this.scaleSymptomList[i], 'sympCode', types[i].typeCode);

        if (this.copyInfo.scaleSympInfoList) {
          for (let patientScaleSymptom of this.copyInfo.scaleSympInfoList) {
            if (patientScaleSymptom.sympName === types[i].typeName) {
              this.$set(this.scaleSymptomList, i, patientScaleSymptom);
              this.$set(this.scaleSymptomList[i], 'status', true);
            }
          }
        }
      }
    }
  },
  mounted() {
    // 初始化提交到服务器的对象
    Bus.$on(this.SHOW_SCALE_MODAL, this.showDetailPanel);
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SCALE_MODAL, this.showDetailPanel);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  },
  components: {
    FoldingPanel
  },
  watch: {
    $route() {
      this.displayScaleModal = false;
    },
    typeGroup: function() {
      this.initSymptomList();
    },
    targetScale: function() {
      this.getCorrectAnswer();
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
        display: block;
        margin: 0;
        padding: 0;
        color: @secondary-button-color;
        font-weight: normal;
        .question-selection {
          margin: 0;
          line-height: 38px;
          display: block;
          .is-disabled {
            .el-radio__inner {
              background-color: @inverse-font-color;
              border-color: @inverse-font-color;
            }
            &+.el-radio__label {
              color: @inverse-font-color;
            }
          }
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
            &.is-disabled {
              .el-checkbox__inner {
                background-color: @inverse-font-color;
                border-color: @inverse-font-color;
              }
              &+.el-checkbox__label {
                color: @inverse-font-color;
              }
            }
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
