<template lang="html">
  <div class="adverse-event-modal-wrapper" v-show="displayModal">
    <div class="adverse-event-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>  
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            开始发生时间：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{occurTime}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="occurTime"
              type="datetime"
              placeholder="请选择开始发生时间"
              :picker-options="pickerOptions"
              @change="updateWarning('occurTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            不良事件名称：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{adverseName}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="adverseName"
              @change="updateWarning('adverseName')"
              placeholder="请输入不良事件名称">
            </el-input>
          </span>
        </div>  
        <div class="field whole-line">
          <span class="field-name">
            不良事件描述：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{adverseDescribe}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="adverseDescribe"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入不良事件描述">
            </el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           是否采取措施：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(measureFlag,'measureFlag')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="measureFlag" clearable placeholder="请选择" @change="updateWarning('measureFlag')">
              <el-option
                v-for="item in getOptions('measureFlag')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           严重程度：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(severity,'severity')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="severity" clearable placeholder="请选择" @change="updateWarning('severity')">
              <el-option
                v-for="item in getOptions('severity')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           是否与本次治疗有关：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(treatmentRelate,'treatmentRelate')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="treatmentRelate" clearable placeholder="请选择" @change="updateWarning('treatmentRelate')">
              <el-option
                v-for="item in getOptions('treatmentRelate')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           是否严重不良事件：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(seriousFlag,'seriousFlag')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="seriousFlag" clearable placeholder="请选择" @change="updateWarning('seriousFlag')">
              <el-option
                v-for="item in getOptions('seriousFlag')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
          严重不良事件：
          </span>
          <div class="moveLeft lead-death">
            <el-checkbox 
              v-model="hasNoReaction"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
            导致死亡
          </div>
          <div class="moveLeft life-threatening">
            <el-checkbox 
              v-model="hasNoReaction"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
            威胁生命  
          </div>
          <div class="moveLeft cause-hospital">
            <el-checkbox 
              v-model="hasNoReaction"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
            导致住院  
          </div>
          <div class="moveLeft lead-continuous">
            <el-checkbox 
              v-model="hasNoReaction"
              :disabled="mode===VIEW_CURRENT_CARD"> 
            </el-checkbox>  
            导致持续或验证残疾/能力丧失  
          </div>
          <div class="moveLeft cause-exception">
            <el-checkbox 
              v-model="hasNoReaction"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>
            导致先天性异常或出生障碍  
          </div>
          <div class="moveLeft medical-events">
            <el-checkbox 
              v-model="hasNoReaction"
              :disabled="mode===VIEW_CURRENT_CARD">
            </el-checkbox>  
            重要医学事件  
          </div>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备注：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入备注">
            </el-input>
          </span>
        </div>
        <div class="seperate-line">
          <div class="toggle-fold-button" @click="toggleContentFolded">
            治疗措施
            <span class="iconfont" :class="iconToggleFolded"></span>
          </div>
        </div>
        <div class="foldable-content" :class="{'folded': foldedConditionalContent}">
          <div class="field whole-line">
              <span class="field-name">
              其他治疗措施：
              </span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{remark}}
              </span>
              <span class="field-input" v-else>
              <el-input
                  v-model="remark"
                  type="textarea"
                  :rows="2"
                  :maxlength="500"
                  placeholder="请输入其他治疗措施">
              </el-input>
              </span>
          </div>
          <div class="field whole-line">
            <span class="field-name">
              实验室检查：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{remark}}
            </span>
            <span class="field-input" v-else>
              <el-input
                v-model="remark"
                type="textarea"
                :rows="2"
                :maxlength="500"
                placeholder="请输入实验室检查详情">
              </el-input>
            </span>
          </div>
        </div>
        <div class="seperate-line">
          <div class="toggle-fold-button" @click="toggleContentFolded">
            不良事件结束
            <span class="iconfont" :class="iconToggleFolded"></span>
          </div>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           不良事件结局：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(adverseResult,'adverseResult')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="adverseResult" clearable placeholder="请选择发生不良事件的结局" @change="updateWarning('adverseResult')">
              <el-option
                v-for="item in getOptions('adverseResult')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            缓解日期：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{relieveDate}}</span>
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="relieveDate"
              type="datetime"
              placeholder="请选择缓解日期  "
              :picker-options="pickerOptions"
              @change="updateWarning('relieveDate')">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
           不良事件影响：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(adverseEffect,'adverseEffect')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="adverseEffect" clearable placeholder="请选择" @change="updateWarning('adverseEffect')">
              <el-option
                v-for="item in getOptions('adverseEffect')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
      </div>  
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: true,
      mode: '',
      completeInit: false,

      occurTime: '',
      adverseName: '',
      adverseDescribe: '',
      measureFlag: '',
      severity: '',
      treatmentRelate: '',
      seriousFlag: '',
      seriousAdverse: '',
      remark: '',
      otherMeasure: '',
      aboratoryExam: '',
      adverseResult: '',
      relieveDate: '',
      adverseEffect: '',
      hasNoReaction: false,
      foldedConditionalContent: false,   // 这个变量用来控制是否显示治疗措施和不良时间结束
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    iconToggleFolded() {
      return this.folded ? 'doubleArrow-up' : 'doubleArrow-down';
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增不良事件';
      } else {
        return '不良事件';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      for (let reaction of this.patientPhytheReaction) {
        reaction.severityLevel = '';
      }
      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
      this.foldedConditionalContent = true;
      this.updateScrollbar();
    },
    transform(code, fieldName) {
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    updateWarning(fieldName) {
      if (this[fieldName] === '') {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    toggleContentFolded() {
      this.foldedConditionalContent = !this.foldedConditionalContent;
      setTimeout(() => {
        this.updateScrollbar();
      }, 150);
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.lockSubmitButton = false;
      this.displayModal = false;
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
    }
  },
  mounted() {
    Bus.$on(this.SHOW_ADVERSE_EVENT_MODAL, this.showPanel);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_ADVERSE_EVENT_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 170px;

.adverse-event-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .adverse-event-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .moveLeft {
      position: relative;
      top: 0;
      left: @field-name-width;
      float: left;
      padding-right: 10px;
      margin-bottom: 10px;
    }
    // .lead-death, 
    // .life-threatening, 
    // .cause-hospital,
    // .lead-continuous,
    // .cause-exception,
    // .medical-events {
    // }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        font-size: @normal-font-size;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translate3d(10px, 5px, 0); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width}");
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: @field-line-height;
          width: @field-name-width;
          line-height: @field-line-height;
        //   font-size: @normal-font-size;
          color: @font-color;
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .el-input {
            transform: translateY(-3px);
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-textarea {
            margin-bottom: 10px;
            vertical-align: middle;
            transform: translateY(-3px);
            .el-textarea__inner {
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
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
      text-align: center;
      .foldable-content {
       padding: 5px 0;
        height: auto;
        overflow: hidden;
        transition: 0.15s;
        &.folded {
          padding: 0;
          height: 0;
        }
      }
      .iconfont {
        display: inline-block;
        margin-left: 10px;
        height: @field-line-height;
        line-height: @field-line-height;
        color: @button-color;
      }
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 10px 20px 20px 20px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &.cancel-button {
        background-color: @light-font-color;
      }
      &.submit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.btn-margin {
        margin-top: 10px;
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
