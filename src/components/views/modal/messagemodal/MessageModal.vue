<template lang="html">
  <div class="message-modal-wrapper" v-show="displayModal">
    <div class="message-modal">
      <div class="title">确认提醒</div>
      <div class="desc">阿三开的飞机啊身份卡上的发生地附近卡是大家发    IE无法点击发送的福利卡上的快乐法卡是大家反馈了</div>
      <div class="field account">当前账号手机: 18612345678</div>
      <div class="field">
        <el-input class="verification-code" v-model="verificationCode" placeholder="请输入验证码"></el-input>
        <span class="send-button">获取验证码</span>
      </div>
      <div class="field agreement">
        <el-checkbox v-model="readAgreement"></el-checkbox>
        我已阅读并同意<span class="link">睿云系统保密协议</span>
      </div>
      <div class="seperate-line"></div>
      <div class="button-wrapper">
        <div class="button cancel-button" @click="cancel">取消</div>
        <div class="button submit-button" @click="submit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      displayModal: true,
      lockSubmitButton: false,
      desc: '',
      verificationCode: '',
      readAgreement: false
    };
  },
  methods: {
    showModal() {
      this.displayModal = true;
      this.technicalSupportAccount = '';
      this.verificationCode = '';
      this.readAgreement = false;
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    submit() {
      if (this.lockSubmitButton || !this.readAgreement) {
        return;
      }
      this.lockSubmitButton = true;

      this.lockSubmitButton = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_AUTHORIZATION_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_AUTHORIZATION_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 45px;

.message-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .message-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 15%;
    width: 400px;
    text-align: left;
    font-size: 0;
    background-color: @background-color;
    .title {
      padding: 30px 0 20px;
      width: 100%;
      text-align: center;
      font-size: @large-font-size;
    }
    .desc {
      padding: 10px 0;
      width: 100%;
      line-height: 20px;
      text-align: left;
      font-size: @normal-font-size;
      white-space: pre-wrap;
    }
    .field {
      padding: 0;
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      line-height: @field-height;
      font-size: @normal-font-size;
      text-align: left;
      &.account {
        color: @button-color;
      }
      &.agreement {
        padding-top: 10px;
        .link {
          border-bottom: 1px solid @light-font-color;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
          &:active {
            opacity: 0.85;
          }
        }
      }
      .verification-code {
        display: inline-block;
        width: 60%;
      }
      .send-button {
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 7px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        margin-left: 30px;
        text-align: center;
        vertical-align: center;
        background-color: @light-font-color;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
      }
      .el-input {
        .el-input__inner {
          height: 30px;
          border: none;
          background-color: @screen-color;
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
    }
    .button-wrapper {
      width: 100%;
      text-align: center;
      .button {
        display: inline-block;
        width: 100px;
        margin: 10px 20px 20px 20px;
        height: 30px;
        line-height: 30px;
        font-size: @normal-font-size;
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
}
</style>
