<template lang="html">
  <div class="site-inspection-modal-wrapper">
    <div class="site-inspection-modal">
      <h3 class="title">{{title}}</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            诊断时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input field-input-especial" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{ariseTime}}</span>
          </span>
          <span class="field-input field-input-especial" v-else>
            <span class="warning-text">{{warningResults.ariseTime}}</span>
            <el-date-picker
              v-model="ariseTime"
              :class="{'warning': warningResults.ariseTime}"
              placeholder="请输入诊断时间"
              type="date"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="updateWarning('ariseTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            一般情况:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.normal.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear1">正常</el-radio>
            <el-radio v-model="partExamination.normal.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.normal.remark}}</span>
          </span>
          <span class="field-input" v-else >
            <el-input
              v-model="partExamination.normal.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.normal.result===0">
            </el-input>
            <span class="click" v-if='partExamination.normal.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            皮肤、粘膜:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.skin.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear2">正常</el-radio>
            <el-radio v-model="partExamination.skin.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.skin.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.skin.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.skin.result===0">
            </el-input>
            <span class="click" v-if='partExamination.skin.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            浅表淋巴结:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.lymphNode.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear3">正常</el-radio>
            <el-radio v-model="partExamination.lymphNode.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.lymphNode.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.lymphNode.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.lymphNode.result===0">
            </el-input>
            <span class="click" v-if='partExamination.lymphNode.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            头部:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.head.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear4">正常</el-radio>
            <el-radio v-model="partExamination.head.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.head.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.head.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.head.result===0">
            </el-input>
            <span class="click" v-if='partExamination.head.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            颈部:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.neck.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear5">正常</el-radio>
            <el-radio v-model="partExamination.neck.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.neck.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.neck.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.neck.result===0">
            </el-input>
            <span class="click" v-if='partExamination.neck.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            胸部:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.chesk.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear6">正常</el-radio>
            <el-radio v-model="partExamination.chesk.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.chesk.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.chesk.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.chesk.result===0">
            </el-input>
            <span class="click" v-if='partExamination.chesk.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            心脏:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.heart.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear7">正常</el-radio>
            <el-radio v-model="partExamination.heart.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.heart.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.heart.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.heart.result===0">
            </el-input>
            <span class="click" v-if='partExamination.heart.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            腹部:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.abdomen.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear8">正常</el-radio>
            <el-radio v-model="partExamination.abdomen.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.abdomen.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.abdomen.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.abdomen.result===0">
            </el-input>
            <span class="click" v-if='partExamination.abdomen.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            四肢关节:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.limb.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear9">正常</el-radio>
            <el-radio v-model="partExamination.limb.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.limb.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.limb.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.limb.result===0">
            </el-input>
            <span class="click" v-if='partExamination.limb.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            其他:
          </span>
          <span class="field-radio">
            <el-radio v-model="partExamination.other.result" :label="0" :disabled="mode===VIEW_CURRENT_CARD" @change.native="clear10">正常</el-radio>
            <el-radio v-model="partExamination.other.result" :label="1" :disabled="mode===VIEW_CURRENT_CARD">异常</el-radio>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{partExamination.other.remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="partExamination.other.remark"
              type="textarea"
              :rows="2"
              :maxlength="50"
              placeholder="请输入特征描述"
              :disabled="partExamination.other.result===0">
            </el-input>
            <span class="click" v-if='partExamination.other.remark.length > 50'>
              只能输入50个字符
            </span>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      </div>
      <div class="modal-footer">
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { vueCopy } from 'utils/helper';
import { addPatientBodypart, modifyPatientBodypart } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      spephysicalResult: '',
      patientBodypart: '',
      patientBodypartId: '',
      ariseTime: '',
      partExamination: {
        'normal': {
          'result': 0,
          'remark': ''
        },
        'skin': {
          'result': 0,
          'remark': ''
        },
        'lymphNode': {
          'result': 0,
          'remark': ''
        },
        'head': {
          'result': 0,
          'remark': ''
        },
        'neck': {
          'result': 0,
          'remark': ''
        },
        'chesk': {
          'result': 0,
          'remark': ''
        },
        'heart': {
          'result': 0,
          'remark': ''
        },
        'abdomen': {
          'result': 0,
          'remark': ''
        },
        'limb': {
          'result': 0,
          'remark': ''
        },
        'other': {
          'result': 0,
          'remark': ''
        }
      },
      warningResults: {
        ariseTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      showEdit: false
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'treatmentTime'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增部位检查';
      } else {
        return '部位检查';
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
      this.patientBodypartId = item.patientBodypartId;
      this.ariseTime = item.ariseTime ? item.ariseTime : '';

      if (this.mode !== this.ADD_NEW_CARD) {
        vueCopy(JSON.parse(item.partExamination), this.partExamination);
      }
      this.completeInit = true;
      this.updateScrollbar();

      // 同步就诊时间
      if (cardOperation === this.ADD_NEW_CARD) {
        this.$set(this, 'ariseTime', this.treatmentTime);
      }
    },
    clear1() {
      this.partExamination.normal.remark = '';
    },
    clear2() {
      this.partExamination.skin.remark = '';
    },
    clear3() {
      this.partExamination.lymphNode.remark = '';
    },
    clear4() {
      this.partExamination.head.remark = '';
    },
    clear5() {
      this.partExamination.neck.remark = '';
    },
    clear6() {
      this.partExamination.chesk.remark = '';
    },
    clear7() {
      this.partExamination.heart.remark = '';
    },
    clear8() {
      this.partExamination.abdomen.remark = '';
    },
    clear9() {
      this.partExamination.limb.remark = '';
    },
    clear10() {
      this.partExamination.other.remark = '';
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field.fieldName).uiType;
    },
    getMatchedField(fieldName) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', fieldName, this.diseaseInfoDictionary);
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
      var list = ['ariseTime'];
      if (list.indexOf(fieldName) >= 0 && !this[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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

      var patientBodypartInfo = {};
      patientBodypartInfo.patientId = this.$route.params.id;
      patientBodypartInfo.patientCaseId = this.$route.params.caseId;
      patientBodypartInfo.ariseTime = Util.simplifyDate(this.ariseTime);
      patientBodypartInfo.partExamination = JSON.stringify(this.partExamination);
      if (this.mode === this.ADD_NEW_CARD) {
        addPatientBodypart(patientBodypartInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        patientBodypartInfo.patientBodypartId = this.patientBodypartId;
        modifyPatientBodypart(patientBodypartInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_SITE_INSPECTION_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SITE_INSPECTION_MODAL);
  },
  watch: {
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 120px;
@scroll-bar-height: 10px;
@unit-width: 54px;
@computed-cell-color: lighten(@font-color, 55%);

.site-inspection-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .site-inspection-modal {
    position: relative;
    margin: 10px auto;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .site-inspection-event {
      position: relative;
      top: 0;
      // left: @field-name-width;
      .el-checkbox {
        padding-right: 15px;
        margin-left: 0;
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
    }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .large-icon {
      font-size: @large-font-size;
    }
    .modal-body {
      position: relative;
      max-height: 80%;
      overflow-y: auto;
      padding: 0 30px;
      overflow-x: hidden;
    }

    .modal-footer {
      position: relative;
      bottom: 0px;
    }
    .content {
      text-align: left;
      font-size: 0;
      .foldable-content {
        // padding: 5px 0;
        margin-bottom: 20px;
        height: auto;
        overflow: hidden;
        transition: 0.15s;
        &.folded {
          padding: 0;
          height: 0;
        }
      }
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: 25px;
        font-size: @normal-font-size;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translate3d(10px, 5px, 0); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width} * 2");
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          // top: 5px;
          left: 0;
          width: @field-name-width;
          line-height: 25px;
        //   font-size: @normal-font-size;
          color: @font-color;
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-radio {
          display: inline-block;
          position: absolute;
          width: calc(~"@{field-name-width} + 10px");
          left: 100px;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          .el-radio+.el-radio {
            margin-left: 20px;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: calc(~"@{field-name-width} * 2 + 10px");
          width: calc(~"98% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.field-input-especial {
            transform: translateX(-145px);
            width: calc(~"100% - @{field-name-width}");
          }
          .click {
            position: absolute;
            top: 35px;
            left: 8px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .warning-text {
            position: absolute;
            top: 23px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .event-text {
            position: absolute;
            top: 46px;
            }
          .el-input {
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-textarea {
            width: 100%;
            margin-bottom: 14px;
            vertical-align: middle;
            transform: translateY(-8px);
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
      .excursion {
        margin-bottom: -4px;
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
      text-align: center;
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
      &.text1-button {
        width: 200px;
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
