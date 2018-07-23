<template>
  <div class="scale-details" ref="scrollArea">
    <div class="title-bar">
      <h2 class="title">量表基本信息</h2>
      <div class="button back-button" @click="goBack">取消</div>
      <div class="button edit-button" @click="edit" v-if="mode === READING_MODE">编辑</div>
      <div class="button save-button" @click="submit" v-else-if="mode !== READING_MODE">保存</div>
    </div>
    <div class="scale-info">
      <div class="field multi-line">
        <span class="field-name">
          量表名称<span class="required-mark" >*</span>
        </span>
        <div class="field-value" v-if="mode === READING_MODE">
          <span>{{ copyInfo.gaugeName }}</span>
        </div>
        <div class="field-input" v-else-if="mode !== READING_MODE">
          <el-input v-model="copyInfo.gaugeName"
            type="text" placeholder="请输入量表名称" :maxlength="100"></el-input>
        </div>
      </div>
      <div class="field multi-line">
        <span class="field-name">
          英文缩写<span class="required-mark" >*</span>
        </span>
        <div class="field-value" v-if="mode === READING_MODE">
          <span>{{ copyInfo.gaugeNameEn }}</span>
        </div>
        <div class="field-input" v-else-if="mode !== READING_MODE">
          <el-input v-model="copyInfo.gaugeNameEn"
            type="text" placeholder="请输入量表名称" :maxlength="100"></el-input>
        </div>
      </div>
      <div class="field multi-line">
        <span class="field-name">
          量表类型<span class="required-mark" >*</span>
        </span>
        <div class="field-value" v-if="mode === READING_MODE">
          <span>{{ getGaugeTypeText(copyInfo.gaugeType) }}</span>
        </div>
        <div class="field-input" v-else-if="mode !== READING_MODE">
          <el-select v-model="copyInfo.gaugeType" placeholder="请选择量表类型">
            <el-option v-for="option in getOptions('gaugeType')" :label="option.name"
              :value="option.code" :key="option.code"></el-option>
          </el-select>
        </div>
      </div>
      <div class="field multi-line">
        <span class="field-name">
          状态<span class="required-mark" >*</span>
        </span>
        <div class="field-value" v-if="mode === READING_MODE">
          <span>{{ getScaleStateText(copyInfo.isUse) }}</span>
        </div>
        <div class="field-input" v-else-if="mode !== READING_MODE">
          <el-select v-model="copyInfo.isUse" placeholder="请选择量表开关状态">
            <el-option v-for="option in getOptions('isScaleUse')" :label="option.name"
              :value="option.code" :key="option.code"></el-option>
          </el-select>
        </div>
      </div>
      <!-- <div class="field multi-line">
        <span class="field-name">
          题型<span class="required-mark" >*</span>
        </span>
        <div class="field-value" v-if="mode === READING_MODE">
          <span>{{ copyInfo.gaugeName }}</span>
        </div>
        <div class="field-input" v-else-if="mode !== READING_MODE">
          <el-select v-model="copyInfo.switchType" placeholder="请选择量表开关状态">
            <el-option v-for="option in getOptions('scaleQuestionType')" :label="option.name"
              :value="option.code" :key="option.code"></el-option>
          </el-select>
        </div>
      </div> -->
      <div class="field whole-line">
        <span class="field-name">
          量表描述
        </span>
        <div class="field-value" v-if="mode === READING_MODE">
          <span>{{ copyInfo.gaugeName }}</span>
        </div>
        <div class="field-input" v-else-if="mode !== READING_MODE">
        </div>
      </div>
    </div>

    <div class="title-bar">
      <h2 class="title">量表详情</h2>
      <div class="switcher">
        <span>一键快答</span>
        <el-switch
          v-model="copyInfo.oneQuickAnswer"
          :active-value="1"
          :inactive-value="0"
          :disabled="mode === READING_MODE">
        </el-switch>
      </div>
      <div class="switcher">
        <span>快速答题</span>
        <el-switch
          v-model="copyInfo.quickAnswer"
          :active-value="1"
          :inactive-value="0"
          :disabled="mode === READING_MODE">
        </el-switch>
      </div>
    </div>

    <div class="scale-question">
      <div class="question" v-for="(question, qIndex) in copyInfo.questions" :key="qIndex">
        <div class="question-header clearfix">
          <div class="question-type" v-if="mode === READING_MODE">
            <span>{{ copyInfo.gaugeName }}</span>
          </div>
          <div class="question-type" v-else-if="mode !== READING_MODE">
            <el-select v-model="question.questionType" placeholder="请选择量表开关状态">
              <el-option v-for="option in getOptions('scaleQuestionType')" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
          </div>
          <span class="question-number" v-if="mode===READING_MODE">{{ question.questionNumber }}</span>
          <el-input class="question-number" v-model="question.questionNumber" v-else-if="mode !== READING_MODE"
            type="number" placeholder="请输入题号" :maxlength="200"></el-input>
          <div class="button-delete delete-question" v-if="mode !== READING_MODE"><i class="iconfont icon-remove"></i></div>
        </div>
        <div class="question-name">
          <span v-if="mode===READING_MODE">{{ question.subjectName }}</span>
          <el-input v-model="copyInfo.gaugeName" v-else-if="mode !== READING_MODE"
            type="text" placeholder="请输入题目名称，字数在1-100个以内" :maxlength="200"></el-input>
        </div>
        <div class="question-answer">
          <div v-if="question.questionType === 0 || question.questionType === 1">
            <div v-for="option in question.options" :key="option.scaleOptionId">
              <div class="answer-option clearfix" v-if="mode === READING_MODE">
                <span class="option-name">{{ option.optionName }}</span>
                <span class="option-grade">{{ option.grade }}</span>
              </div>
              <div  class="answer-option edit clearfix" v-else>
                <div class="button-delete delete-option"><i class="iconfont icon-remove"></i></div>
                <el-input v-model="option.optionName" class="option-name"
                  type="text" placeholder="请输入选项名称，字数在1-100个以内" :maxlength="200"></el-input>
                <el-input v-model="option.grade" class="option-grade"
                  type="number" placeholder="请输入得分" :maxlength="200"></el-input>
              </div>
            </div>
            <div class="button-add add-option" v-if="mode !== READING_MODE"
              @click="addOption(qIndex)">
              <i class="iconfont icon-plus"></i>
            </div>
          </div>
          <div v-if="question.questionType === 2 || question.questionType === 3">
            <el-input v-model="option.grade" class="option-grade"
                  type="number" placeholder="请输入得分" :maxlength="200"></el-input>
          </div>
        </div>
      </div>
      <div class="button-add add-question" v-if="mode !== READING_MODE"
        @click="addQuestion">
        <i class="iconfont icon-plus"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Ps from 'perfect-scrollbar';
import { deepCopy } from 'utils/helper';

export default {
  data() {
    return {
      mode: '',
      scaleInfoId: '',
      copyInfo: {
        gaugeName: '',
        gaugeNameEn: '',
        gaugeType: '',
        remarks: '',
        isUse: 1,
        formType: '',
        gaugeTaskType: 1,
        quickAnswer: 0,
        oneQuickAnswer: 0,
        showPad: '',
        questions: []
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'allScale'
    ])
  },
  methods: {
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
    /**
     * 根据量表字段获取对应的显示值
     */
    getGaugeTypeText(code) {
      var options = this.getOptions('gaugeType');
      var option = Util.getElement('code', code, options);
      return option.name ? option.name : '';
    },
    getScaleStateText(code) {
      var options = this.getOptions('isScaleUse');
      var option = Util.getElement('code', code, options);
      return option.name ? option.name : '';
    },
    /**
     * 取消
     */
    goBack() {
      if (this.mode === this.EDITING_MODE) {
        this.mode = this.READING_MODE;
        this.initScaleInfo();
      } else {
        this.$router.push({name: 'scalemanagement'});
      }
    },
    /**
     * 编辑
     */
    edit() {
      this.mode = this.EDITING_MODE;
    },
    /**
     * 保存
     */
    submit() {

    },
    /**
     * 编辑模式下初始化各个属性值
     */
    initScaleInfo() {
      for (let i = 0; i < this.allScale.length; i++) {
        if (this.allScale[i].scaleInfoId === this.scaleInfoId) {
          this.copyInfo.gaugeName = this.allScale[i].gaugeName;
          this.copyInfo.gaugeNameEn = this.allScale[i].gaugeNameEn;
          this.copyInfo.gaugeType = this.allScale[i].gaugeType;
          this.copyInfo.remarks = this.allScale[i].remarks;
          this.copyInfo.isUse = this.allScale[i].isUse;
          this.copyInfo.formType = this.allScale[i].formType;
          this.copyInfo.gaugeTaskType = this.allScale[i].gaugeTaskType;
          this.copyInfo.quickAnswer = this.allScale[i].quickAnswer;
          this.copyInfo.oneQuickAnswer = this.allScale[i].oneQuickAnswer;
          this.copyInfo.showPad = this.allScale[i].showPad;
          this.copyInfo.questions = deepCopy(this.allScale[i].questions);
          break;
        }
      }
      this.updateScrollbar();
    },
    /**
     * 添加问题
     */
    addQuestion() {
      let list = this.copyInfo.questions;
      list.push({});
      this.$set(list[list.length - 1], 'questionNumber', '');
      this.$set(list[list.length - 1], 'subjectName', '');
      this.$set(list[list.length - 1], 'questionType', '');
      this.$set(list[list.length - 1], 'options', []);
    },
    /**
     * 添加问题答案选项
     */
    addOption(questionIndex) {
      let option = this.copyInfo.questions[questionIndex].options;
      option.push({});
      this.$set(option[option.length - 1], 'optionName', '');
      this.$set(option[option.length - 1], 'grade', '');
    }
  },
  mounted() {
    // console.log(this.$route.params.id);
    if (this.$route.params.id === 'new') {
      this.mode = this.ADDING_MODE;
    } else {
      this.mode = this.READING_MODE;
      this.scaleInfoId = this.$route.params.id;
      this.initScaleInfo();
    }
    // this.resizeTableHeight();
    // window.onresize = () => {
    //   this.resizeTableHeight();
    // };
  },
  watch: {

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

@field-height: 50px;
@field-name-width: 100px;

  .scale-details {
    .title-bar {
      position: relative;
      height: @title-bar-height;
      margin-right: @margin-right;
      margin: 5px 0;
      background-color: @background-color;
      .title {
        margin: 0;
        position: absolute;
        display: inline-block;
        left: 0;
        width: 100%;
        height: @title-bar-height;
        padding-left: 20px;
        line-height: @title-bar-height;
        text-align: left;
        font-size: @large-font-size;
        cursor: pointer;
        color: @font-color;
        .complete-status {
          color: light-font-color;
        }
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
      .switcher {
        float: right;
        height: @title-bar-height;
        margin: 0 15px;
        line-height: @title-bar-height;
        font-size: @large-font-size;
        span {
          padding-right: 5px;
        }
      }
    }
    .scale-info {
      padding-left: 20px;
      font-size: 0;
      text-align: left;
      background: @background-color;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        text-align: left;
        vertical-align: middle;
        &.whole-line {
          width: 100%;
          .field-value, .field-input {
            width: calc(~"98% - @{field-name-width}");
          }
        }
        &.multi-line {
          // height: @field-height * 1.5;
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          width: @field-name-width;
          line-height: @field-height;
          font-size: @normal-font-size;
          color: @font-color;
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-value {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          top: 12.5px;
          width: calc(~"100% - @{field-name-width}");
          line-height: 25px;
          font-size: @normal-font-size;
          color: @light-font-color;
        }
        .field-input {
          display: inline-block;
          position: relative;
          top: 0;
          left: @field-name-width;
          width: calc(~"96% - @{field-name-width}");
          line-height: @field-height;
          overflow: visible;
          .read-only-text {
            font-size: @normal-font-size;
            color: @light-font-color;
          }
          .warning-text {
            position: absolute;
            top: 25px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .el-input {
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-textarea {
            vertical-align: middle;
            transform: translateY(10px);
            .el-textarea__inner {
              height: 60px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .warning .el-input__inner {
            border: 1px solid red;
          }
        }
      }
    }
    .scale-question {
      .question {
        margin: 10px 0;
        padding: 10px 25px;
        text-align: left;
        font-size: 14px;
        background: @background-color;
        border: 1px solid @secondary-button-color;
        .question-header {
          .question-type,
          .question-number {
            float: left;
            width: 200px;
            margin-right: 5px;
          }
          .delete-question {
            float: right;
          }
        }
        .question-name {
          margin: 10px 0;
        }
        .question-answer {
          line-height: 30px;
          .answer-option{
            margin: 2px 0;
            .option-name {
              float: left;
              width: 80%;
            }
            .option-grade {
              float: right;
              width: 20%;
            }
            &.edit {
              .delete-option {
                float: left;
                width: 30px;
                text-align: center;
                cursor: pointer;
              }
              .option-name {
                float: left;
                width: calc(~"80% - 30px");;
              }
            }
          }
        }
        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
      .button-add {
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px dashed #3c485a;
        border-radius: 4px;
        cursor: pointer;
        &.add-question {
          float: right;
          width: 100px;
          margin-top: 20px;
          color: #fff;
          background-color: @button-color;
          border: none;
        }
      }
      .icon-remove {
        color: #d20000f5;
      }
    }
  }
  .clearfix:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
</style>

