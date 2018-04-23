<template lang="html">
  <div class="end-experiment-modal-wrapper">
    <div class="end-experiment-modal" ref="scrollArea">
      <h3 class="title">结束试验</h3>
      <div class="content">

        <div class="field whole-line">
          <span class="field-name">
            是否完成试验
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.finish}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.finish}}</span>
            <el-radio class="radio" v-model="copyInfo.finish"
             v-for="(item,index) in getOptions('finish')"
             :key="item.typeName+index"
             :label="item.typeCode"
             @change.native="updateWarning('finish')">
              {{item.typeName}}
            </el-radio>
          </span>
        </div>

        <div class="field whole-line" v-if="copyInfo.finish||copyInfo.finish===0">
          <span class="field-name">
            <span v-if="copyInfo.finish===1">完成</span><span v-if="copyInfo.finish===0">终止</span>日期：
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.finishDate}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.finishDate}}</span>
            <el-date-picker
             v-model="copyInfo.finishDate"
             :class="{'warning': warningResults.finishDate}"
             :placeholder="placeholder"
             @change="updateWarning('finishDate')" clearable>
            </el-date-picker>
          </span>
        </div>

        <h4 class="subTitle">1.终止理由请选择最重要的一个</h4>

        <div class="field-container" v-for="(item,index) in getOptions('factor')" :key="item.typeCode+index">
          <div class="field whole-line">
            <span class="field-name">
              <el-radio class="radio" v-model="copyInfo.factor" :label="item.typeCode">{{item.typeName}}</el-radio>
            </span>
          </div>


          <div class="field whole-line field-indent" v-if="item.typeCode===1&&copyInfo.factor===1">
            <span class="field-name">
              死亡原因：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{copyInfo.factorReason}}
            </span>
            <span class="field-input" v-else>
              <el-input
              v-model="copyInfo.factorReason"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请注明死亡原因">
              </el-input>
            </span>
          </div>

          <div class="field whole-line field-indent" v-if="item.typeCode===1&&copyInfo.factor===1">
            <span class="field-name">
              死亡日期：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{copyInfo.factorDate}}
            </span>
            <span class="field-input" v-else>
              <el-date-picker
               v-model="copyInfo.factorDate"
               placeholder="请选择死亡日期" clearable>
              </el-date-picker>
            </span>
          </div>

          <div class="field whole-line field-indent" v-if="item.typeCode===6&&copyInfo.factor===6">
            <span class="field-name">
              请注明详情：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{copyInfo.factorReason}}
            </span>
            <span class="field-input" v-else>
              <el-input
               v-model="copyInfo.factorReason"
               type="textarea"
               :rows="2"
               :maxlength="500"
               placeholder="请注明详情">
              </el-input>
            </span>
          </div>

          <div class="field whole-line field-indent" v-if="item.typeCode===7&&copyInfo.factor===7">
            <span class="field-name">
              请选择原因：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{copyInfo.factorDetail}}
            </span>
            <span class="field-input" v-else>
              <el-select v-model="copyInfo.factorDetail" placeholder="请选择原因" clearable >
                <el-option
                 v-for="(item,index) in getOptions('factorDetail')"
                 :key="item.typeName+index"
                 :label="item.typeName"
                 :value="item.typeCode">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field whole-line field-indent" v-if="item.typeCode===9&&copyInfo.factor===9">
            <span class="field-name">
              请注明详情：
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              {{copyInfo.factorReason}}
            </span>
            <span class="field-input" v-else>
              <el-input
               v-model="copyInfo.factorReason"
               type="textarea"
               :rows="2"
               :maxlength="500"
               placeholder="请注明详情">
              </el-input>
            </span>
          </div>

        </div>

        <h4 class="subTitle">2.患者的药物编号是否被揭盲</h4>

        <div class="field whole-line field-indent">
          <span class="field-name">
            <el-radio class="radio" v-model="copyInfo.exposeMedicine"
             v-for="(item,index) in getOptions('finish')"
             :key="item.typeName+index"
             :label="item.typeCode">
              {{item.typeName}}
            </el-radio>
          </span>
        </div>

        <div class="field whole-line field-indent" v-if="copyInfo.exposeMedicine===1">
          <span class="field-name">
            揭盲日期：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.exposeDate}}
          </span>
          <span class="field-input" v-else>
            <el-date-picker
              v-model="copyInfo.exposeDate"
              placeholder="请选择揭盲日期" clearable>
            </el-date-picker>
          </span>
        </div>

      </div>

      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin">编辑</div>

    </div>
  </div>
</template>

<script>
import Util from 'utils/util.js';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus';
import { mapGetters } from 'vuex';
import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import { completeFollowUp } from 'api/experiment.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      lockSubmitButton: false,
      copyInfo: {
        finish: '',
        finishDate: '',
        factor: '',
        factorReason: '',
        factorDate: '',
        factorDetail: '',
        exposeMedicine: '',
        exposeDate: ''
      },
      warningResults: {
        finish: '',
        finishDate: ''
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    placeholder() {
      return '请选择' + (this.copyInfo.finish === 1 ? '完成' : this.copyInfo.finish === 0 ? '终止' : '') + '日期';
    }
  },
  methods: {
    showModal(cardOperation) {
      this.completeInit = false;
      this.mode = cardOperation;
      // 绑定数据
      // 绑定数据
      // 绑定数据
      // 绑定数据
      // 绑定数据
      // 绑定数据
      // 绑定数据
      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
      this.completeInit = true;
      this.updateScrollbar();
    },
    getOptions(fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    updateWarning(fieldName) {
      if (this.completeInit && !this.copyInfo[fieldName] && this.copyInfo[fieldName] !== 0) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
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
          this.$message({
            message: '请完成必填项',
            type: 'warning',
            duration: 2000
          });
          return;
        }
      }

      let patientExperiment = {
        patientExperimentModel: {
          patientId: this.$route.params.id,
          tcTaskId: this.$store.state.subjectId
        },
        terminateExperimentModel: this.copyInfo
      };
      reviseDateFormat(patientExperiment);
      pruneObj(patientExperiment);

      // console.log(patientExperiment);
      completeFollowUp(patientExperiment, this.$store.state.hospitalType).then(() => {
        this.updateAndClose();
      }, this._handleError);
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UPDATE_EXPERIMENT_INFO);
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
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
    Bus.$on(this.SHOW_END_EXPERIMENT_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);

    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_END_EXPERIMENT_MODAL);
  },
  watch: {
    '$route.path'() {
      this.cancel();
    },
    'copyInfo.factor': function() {
      this.copyInfo.factorReason = '';
      this.copyInfo.factorDate = '';
      this.copyInfo.factorDetail = '';
    },
    'copyInfo.exposeMedicine': function(newVal) {
      if (newVal === 0) {
        this.copyInfo.exposeDate = '';
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 100px;
@long-field-name-width: 140px;

.end-experiment-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .end-experiment-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    max-height: 80%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      .subTitle {
        margin: 20px 10px 20px;
        font-size: 14px;
      }
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
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
        &.whole-line.field-indent {
          margin-left: 23px;
          width: calc(~"100% - 23px");
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @font-color;
          &.long-field-name {
            width: @long-field-name-width;
          }
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
          &.long-field-name {
            left: @long-field-name-width;
            width: calc(~"96% - @{long-field-name-width}");
          }
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
            &.textarea-warning {
              margin-top: -22px;
              margin-left: 10px;
              position: static;
              display:block;
            }
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
            margin-bottom: 15px;
            vertical-align: middle;
            transform: translateY(-3px);
            .el-textarea__inner {
              border: none;
              background-color: @screen-color;
            }
            textarea {
              height: 54px;
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
      .field-container {
        margin-left: 20px;
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
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
