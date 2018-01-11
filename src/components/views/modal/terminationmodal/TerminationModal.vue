<template lang="html">
  <div class="termination-modal-wrapper" v-show="displayModal">
    <div class="termination-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">

        <div class="field whole-line">
          <span class="field-name">
            下一节点
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>view状态下一节点文本</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.nextStep}}</span>
            <el-select v-model="nextStep" placeholder="请选择下一节点" clearable>
              <el-option v-for="option in getOptions('nextStatus')" :value="option.code"
                :label="option.name" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            接收人
          </span>
          <span class="field-input">
            view状态接收人
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>view状态处理意见文本</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入处理意见">
            </el-input>
          </span>
        </div>

        <hr class="seperate-line">
      </div>

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD" class="button submit-button">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus';
import Util from 'utils/util';
import { mapGetters } from 'vuex';
import { completeExperiment } from 'api/experiment';

export default {
  data() {
    return {
      displayModal: false,
      title: '结束治疗',
      mode: '',
      showEdit: '',
      warningResults: {
        nextStep: ''
      },

      nextStep: '',
      remark: ''
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ])
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      // console.log('item: ', item);

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    },
    transform(code, fieldName) {
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    getOptions(fieldName) {
      var options = [];
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
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
      completeExperiment().then(this.updateAndClose, this._handleError);
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.$message({
        message: '已结束治疗过程',
        type: 'success',
        duration: 2000
      });
      Bus.$emit(this.UPDATE_EXPERIMENT_INFO);
      this.lockSubmitButton = false;
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_TERMINATION_MODAL, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@field-line-height: 25px;
@field-name-width: 100px;
@long-field-name-width: 160px;

.termination-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .termination-modal{
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
    .content{
      text-align: left;
      font-size: 0;
      .seperate-line {
        border-style: none;
        border-top: 1px solid @light-gray-color;
        margin-top: 10px;
        margin-bottom: 10px;
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
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @font-color;
          // &.long-field-name {
          //   width: @long-field-name-width;
          // }
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
          // &.long-field-name {
          //   left: @long-field-name-width;
          // }
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
    }
  }
}
</style>
