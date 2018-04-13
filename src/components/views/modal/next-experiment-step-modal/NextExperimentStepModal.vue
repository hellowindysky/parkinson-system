<template lang="html">
  <div class="experiment-step-modal-wrapper">
    <div class="experiment-step-modal" :class="{'follow-up-modal': milestoneNum===40}" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            下一节点
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input">
            <span>{{transform(milestoneNum, 'taskStatus')}}</span>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            接收人
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{name}}</span>
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

      </div>

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button"
        @click="submit">确定</div>
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
      title: '课题流转',
      mode: '',
      milestoneNum: '',
      name: '',
      remark: ''
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    hospitalType() {
      return this.$store.state.hospitalType;
    }
  },
  methods: {
    showModal(cardOperation, item, showEdit, name) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.milestoneNum = this.getMilestoneNum(item);
      this.remark = item.remark ? item.remark : '';
      this.name = name ? name : '';

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
    getStatus(step) {
      var phase = step.phase;
      if (phase) {
        var status = phase.split('.')[1];
        if (status !== undefined) {
          return Number(status);
        }
      }
      return '';
    },
    transform(code, fieldName) {
      if (fieldName === 'taskStatus') {
        // 特殊处理
        if (code === 10) {
          if (this.hospitalType === 1) {
            return '入组诊断';
          } else if (this.hospitalType === 2) {
            return '筛选入组';
          }
        } else if (code === 20) {
          return '基线评估';
        } else if (code === 30) {
          return '治疗期';
        } else if (code === 40) {
          return '随访期';
        } else if (code === 50) {
          return '治疗期';
        }
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
    submit() {

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
    Bus.$on(this.SHOW_NEXT_EXPERIMENT_STEP_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NEXT_EXPERIMENT_STEP_MODAL);
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
@field-name-width: 100px;
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
    width: 500px;
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
