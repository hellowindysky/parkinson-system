<template lang="html">
  <div class="experiment-step-modal-wrapper">
    <div class="experiment-step-modal" :class="{'follow-up-modal': milestoneNum===4}" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            实验阶段
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(milestoneNum, 'taskStatus')}}</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text">{{warningResults.name}}</span> -->
            <el-input v-model="milestoneNum" placeholder="请输入实验阶段" :maxlength="50"></el-input>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            处理意见
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{remark}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="remark" placeholder="请输入处理意见" :maxlength="50"></el-input>
          </span>
        </div>

        <hr class="seperate-line" v-if="milestoneNum===4">

        <div v-if="milestoneNum===4">
          <h4 class="sub-title">本期随访总结</h4>
          <div class="field whole-line">
            <span class="field-name long-field-name">
              随访形式
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpType, 'followUpType')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <el-input v-model="followUpType" placeholder="请输入随访形式" :maxlength="50"></el-input>
            </span>
          </div>

          <div class="field whole-line">
            <span class="field-name long-field-name">
              受访者是否正常完成随访
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpComplete, 'followUpComplete')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-select v-model="followUpComplete" placeholder="请选择是否正常完成随访" clearable>
                <el-option :label="'是'" :value="1"></el-option>
                <el-option :label="'否'" :value="0"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field whole-line" v-if="followUpComplete===0">
            <span class="field-name long-field-name">
              未能正常完成随访原因
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpReason, 'followUpReason')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-input v-model="followUpReason" placeholder="请输入未能正常完成随访原因" :maxlength="50"></el-input>
            </span>
          </div>

          <div class="field whole-line" v-if="followUpReason===6">
            <span class="field-name long-field-name">
              原因详述
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{reasonDetail}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-input v-model="reasonDetail" placeholder="请输入原因详述" :maxlength="50"></el-input>
            </span>
          </div>

          <div class="field whole-line">
            <span class="field-name long-field-name">
              受访者是否愿意继续随访
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{transform(followUpContinue, 'followUpContinue')}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-select v-model="followUpContinue" placeholder="请选择是否愿意继续随访" clearable>
                <el-option :label="'是'" :value="1"></el-option>
                <el-option :label="'否'" :value="0"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field whole-line" v-if="nextTime">
            <span class="field-name long-field-name">
              下次随访时间点
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{nextTime}}</span>
            </span>
            <span class="field-input long-field-name" v-else>
              <!-- <span class="warning-text">{{warningResults.name}}</span> -->
              <el-date-picker v-model="nextTime" placeholder="请输入下次随访时间"></el-date-picker>
            </span>
          </div>
        </div>
      </div>

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button">编辑</div>

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
      title: '处理意见',
      mode: '',
      milestoneNum: '',
      remark: '',
      followUpType: '',
      followUpComplete: '',
      followUpReason: '',
      reasonDetail: '',
      followUpContinue: '',
      nextTime: ''
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ])
  },
  methods: {
    showModal(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.milestoneNum = this.getMilestoneNum(item);
      this.remark = item.remark ? item.remark : '';

      var propertyList = ['followUpType', 'followUpComplete', 'followUpReason',
        'reasonDetail', 'followUpContinue', 'nextTime'];
      for (let property of propertyList) {
        this[property] = item.followUpModel && item.followUpModel[property] !== undefined
          ? item.followUpModel[property] : '';
      }

      this.updateScrollbar();
    },
    cancel() {
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    getMilestoneNum(step) {
      var milestoneNum = 0;
      var phase = step.phase;
      if (phase && phase.split('.').length > 0) {
        milestoneNum = Number(phase.split('.')[0]);
      }
      return milestoneNum;
    },
    transform(code, fieldName) {
      if (code === 1 && fieldName === 'taskStatus') {
        // 特殊处理
        return '筛选入组';
      }
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
    Bus.$on(this.SHOW_EXPERIMENT_STEP_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_EXPERIMENT_STEP_MODAL);
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
@field-name-width: 110px;
@long-field-name-width: 170px;

.experiment-step-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .experiment-step-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    max-height: 80%;
    background-color: @background-color;
    overflow: hidden;
    &.follow-up-modal {
      top: 3%;
      max-height: 94%;
    }
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
        margin-top: 5px;
        margin-bottom: 15px;
      }
      .sub-title{
        font-size: @normal-font-size;
        transform: translate3d(10px, 5px, 0);
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
          width: calc(~"96% - @{field-name-width}");
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
