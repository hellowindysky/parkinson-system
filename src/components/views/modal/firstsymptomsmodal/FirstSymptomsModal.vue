<template lang="html">
  <div class="symptoms-modal-wrapper" v-show="displayModal">
    <div class="symptoms-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name long-field-name">
            首发症状类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>ggggggggg</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">必填项</span>
            <el-select v-model="firstType"
            placeholder="请选择首发症状类型">
              <el-option label="运动症状" :value="WINE_HISTORY_MODAL"></el-option>
              <el-option label="运动并发症" :value="SMOKE_HISTORY_MODAL"></el-option>
              <el-option label="非运动症状" :value="TEA_HISTORY_MODAL"></el-option>
          </el-select>
          </span>
        </div>

        <!-- 以下是 运动症状才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="firstType===WINE_HISTORY_MODAL">
          <div class="field">
            <span class="field-name long-field-name">
              症状名称:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">必填项</span>
              <el-select v-model="value1"
              placeholder="请选择症状名称">
                <el-option label="慌张步态" :value="WINE_HISTORY_MODAL"></el-option>
                <el-option label="翻身困难" :value="SMOKE_HISTORY_MODAL"></el-option>
                <el-option label="语言障碍" :value="TEA_HISTORY_MODAL"></el-option>
            </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              左上肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>左上肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择左上肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              右上肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>右上肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择右上肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              左下肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>左下肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择左下肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              右下肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>右下肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择右下肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              是否规律出现:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>是否规律出现</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="value2"
              placeholder="请选择是否规律出现">
                <el-option label="是" :value="WINE_HISTORY_MODAL"></el-option>
                <el-option label="否" :value="SMOKE_HISTORY_MODAL"></el-option>
            </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>备注</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="date1" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 运动症状才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->


        <!-- 以下是 运动并发症才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="firstType===SMOKE_HISTORY_MODAL">

          <div class="field">
            <span class="field-name long-field-name">
              症状名称:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">必填项</span>
              <el-select v-model="value1"
                placeholder="请选择症状名称">
                  <el-option label="症状波动-剂末现象" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="症状波动-开关现象" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              是否规律出现:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>是否规律出现</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="value2"
                placeholder="请选择是否规律出现">
                  <el-option label="是" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="否" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              持续时长（小时/天）:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>持续时长</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="date1" placeholder="请输入持续时长"></el-input>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>备注</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="date1" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 运动并发症才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

        <!-- 以下是 非运动症状才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="firstType===TEA_HISTORY_MODAL">

          <div class="field">
            <span class="field-name long-field-name">
              非运动症状类型:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">必填项</span>
              <el-select v-model="value1"
                placeholder="请选择症状名称">
                  <el-option label="症状波动-剂末现象" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="症状波动-开关现象" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              症状名称:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">必填项</span>
              <el-select v-model="value1"
                placeholder="请选择症状名称">
                  <el-option label="症状波动-剂末现象" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="症状波动-开关现象" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              是否规律出现:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>是否规律出现</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="value2"
                placeholder="请选择是否规律出现">
                  <el-option label="是" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="否" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>备注</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="date1" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 非运动症状才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      </div>

      <div class="seperate-line" v-show="true"></div>

      

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-show="true" class="button submit-button" @click="submit">确定</div>
      <div v-show="false" class="button edit-button" @click="switchToEditingMode">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      firstType: '',
      value1: '',
      value2: '',
      date1: ''
    };
  },
  computed: {
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增首发症状';
      } else {
        return '首发症状';
      }
    }
  },
  methods: {
    showModal(cardOperation, item) {
      console.log(cardOperation, item);
      this.mode = cardOperation;
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
    },
    switchToEditingMode() {
      // ffff
    },
    submit() {
      // ggg
    }
  },
  mounted() {
    Bus.$on(this.SHOW_FIRSTSYMPTOMS_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 90px;
@long-field-name-width: 160px;

.symptoms-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .symptoms-modal{
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content{
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 100%;
        min-height: 45px;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.half-line {
          width: 50%;
          .field-input {
            width: calc(~"92% - @{field-name-width}");
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
          top: 0;
          left: @long-field-name-width;
          width: calc(~"96% - @{long-field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
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
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .el-textarea {
            margin-bottom: 15px;
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
      margin: 15px auto 10px;
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
      &.submit-button, &.edit-button {
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

