<template lang="html">
  <div class="rejection-modal-wrapper">
    <div class="rejection-modal" ref="scrollArea">
      <h3 class="title">退回</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            退回节点
          </span>
          <span class="field-input">
            筛选入组
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            接收人
          </span>
          <span class="field-input">
            {{doctor}}
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            处理意见：
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
              placeholder="请输入处理意见">
            </el-input>
          </span>
        </div>

        <div class="seperate-line"></div>

        <h4 class="table-title">请根据患者评估情况选择</h4>
        <table class="table">
          <thead>
            <tr class="row title-row">
              <th class="col wide-col">入选标准</th>
              <th class="col">是</th>
              <th class="col">否</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row" v-for="(item,index) in beChosenStandard" :key="index">
              <td class="col">{{item.detailName}}</td>
              <td class="col">
                <el-radio class="radio" v-model="standardDetailOptions[index].optionId" :label="1"></el-radio>
              </td>
              <td class="col">
                <el-radio class="radio" v-model="standardDetailOptions[index].optionId" :label='0'></el-radio>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table">
          <thead>
            <tr class="row title-row">
              <th class="col wide-col">排除标准</th>
              <th class="col">是</th>
              <th class="col">否</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row" v-for="(item,index) in excludeStandard" :key="index">
              <td class="col">{{item.detailName}}</td>
              <td class="col">
                <el-radio class="radio" v-model="standardDetailOptions[beChosenStandard.length+index].optionId" :label="1"></el-radio>
              </td>
              <td class="col">
                <el-radio class="radio" v-model="standardDetailOptions[beChosenStandard.length+index].optionId" :label='0'></el-radio>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { mapGetters } from 'vuex';
import { rejectEnteringExperiment } from 'api/experiment';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      remark: '',
      doctor: '',
      showEdit: true,
      standardDetailOptions: [],
      beChosenStandard: [],
      excludeStandard: []
    };
  },
  computed: {
    ...mapGetters([
      'standardInfo'
    ]),
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    updateTemplate() {
      this.beChosenStandard = this.standardInfo.filter((item) => {
        return item.standardId === 1;
      });
      this.excludeStandard = this.standardInfo.filter((item) => {
        return item.standardId === 2;
      });
      this.updateScrollbar();
    },
    initStandardOptions() {
      this.updateTemplate();
      this.beChosenStandard.forEach((item) => {
        // this.$set(this.standardDetailOptions, index, {standardDetailId: item.id, optionId: 1});
        this.standardDetailOptions.push({standardDetailId: item.id, optionId: ''});
      });
      this.excludeStandard.forEach((item) => {
        // this.$set(this.standardDetailOptions, this.beChosenStandard.length + index, {standardDetailId: item.id, optionId: 0});
        this.standardDetailOptions.push({standardDetailId: item.id, optionId: ''});
      });
    },
    showPanel(cardOperation, item, showEdit, doctor) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      // console.log('item: ', item);

      this.remark = '';
      this.doctor = doctor;

      this.initStandardOptions();

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
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
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
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

      var experimentInfo = {
        remark: this.remark,
        patientId: this.$route.params.id,
        tcTaskId: this.$store.state.subjectId,
        standardDetailOptions: Object.assign([], this.standardDetailOptions)
      };
      for (let item of experimentInfo.standardDetailOptions) {
        if (!item.optionId && (item.optionId !== 0)) {
          this.$message({
            message: '请完成标准选择！',
            type: 'warning',
            duration: 2000
          });
          this.lockSubmitButton = false;
          return;
        }
      };
      rejectEnteringExperiment(experimentInfo).then(this.updateAndClose, this._handleError);
    },
    _handleError(error) {
      console.log(error);
      if (error.code === 2009) {
        this.$message({
          message: '当前操作无法完成，请刷新页面后再试',
          type: 'warning',
          duration: 2000
        });
      }
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.$message({
        message: '已拒绝将该患者加入实验组',
        type: 'warning',
        duration: 2000
      });
      Bus.$emit(this.UPDATE_EXPERIMENT_INFO);
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.scrollArea) {
          Ps.destroy(this.$refs.scrollArea);
          Ps.initialize(this.$refs.scrollArea, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_REJECTION_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_REJECTION_MODAL);
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
@field-name-width: 150px;

.rejection-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .rejection-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 660px;
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
          left: @field-line-height;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
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
          .el-date-editor {
            width: 100%;
          }
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .table-title {
        font-size: 14px;
        font-weight: normal;
        margin-left: 36px;
      }
      .table {
        margin: 10px 0 20px;
        width: 92%;
        margin-left: calc(~"@{field-line-height} + 10px");
        border: 1px solid @light-gray-color;
        border-collapse: collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          th {
            font-weight: normal;
          }
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            &.wide-col {
              width: 80%;
              text-align: center !important;
            }
            &:first-child {
              text-align: left;
              padding-left:10px;
            }
            .el-radio__label {
              font-size: 0;
              padding-left: 0;
            }
          }
        }
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
