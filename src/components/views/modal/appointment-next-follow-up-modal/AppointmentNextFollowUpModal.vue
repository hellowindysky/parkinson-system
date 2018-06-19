<template lang="html">
  <div class="appoint-next-follow-up-wrapper">
    <div class="appoint-next-follow-up-modal">
      <h3 class="title">预约下次随访</h3>
      <div class="content">

        <div class="field whole-line">
          <span class="field-name">
            注意事项：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{msg}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="msg"
              type="textarea"
              :rows="4"
              :maxlength="500"
              placeholder="请输入随访注意事项">
            </el-input>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            就诊医院:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{msg}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="msg" placeholder="请选择就诊医院" clearable >
              <el-option
                :label="'ddd医院'"
                :value="5">
              </el-option>
            </el-select>
          </span>
        </div>

      </div>

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
export default {
  data() {
    return {
      mode: '',
      msg: ''
    };
  },
  methods: {
    cancel() {
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 110px;

.appoint-next-follow-up-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .appoint-next-follow-up-modal {
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
      &.btn-margin {
        margin-top: 10px;
      }
    }
  }
}
</style>
