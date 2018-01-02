<template lang="html">
  <div class="message-modal-wrapper" v-show="displayModal">
    <div class="message-modal">
      <div class="title">{{title}}</div>
      <div class="desc">{{desc}}</div>
      <div class="field account">{{accountNumberInfo}}</div>
      <div class="field">
        <span class="warning-text">{{verificationCodeWarning}}</span>
        <el-input class="verification-code" :class="{'warning': verificationCodeWarning}"
          v-model="verificationCode" placeholder="请输入验证码" @change="updateVerificationCode">
        </el-input>
        <span class="send-button" :class="{'disabled': codeButtonStatus===1}" @click="sendCode">
          {{codeButtonText}}
        </span>
      </div>
      <div class="field agreement">
        <el-checkbox v-model="readAgreement"></el-checkbox>
        我已阅读并同意<span class="link" @click="showSecretAgreement">睿云系统保密协议</span>
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
import { sendVerificationCode, verifyMessageCode } from 'api/user.js';

export default {
  data() {
    return {
      displayModal: false,
      lockSubmitButton: false,

      businessType: '',    // 1.修改密码业务 2.授权技术支持业务 3.脱敏业务
      title: '',
      desc: '',
      verificationCode: '',
      verificationCodeWarning: '',
      readAgreement: false,
      doctorAccountNumber: '',

      codeButtonStatus: 0,
      codeButtonCount: 0,
      countDown: null,
      lockSendButton: false
    };
  },
  computed: {
    codeButtonText() {
      if (this.codeButtonStatus === 0) {
        return '获取验证码';
      } else if (this.codeButtonStatus === 1) {
        return '重新获取 (' + this.codeButtonCount + ')';
      } else if (this.codeButtonStatus === 2) {
        return '重新获取';
      }
    },
    accountNumberInfo() {
      if (this.businessType === 4) {
        return '医生账号手机: ' + this.accountNumberWithPartialHiding;
      } else {
        return '当前账号手机: ' + this.accountNumberWithPartialHiding;
      }
    },
    accountNumberWithPartialHiding() {
      var accountNumber = sessionStorage.getItem('accountNumber');
      if (this.businessType === 4) {
        accountNumber = this.doctorAccountNumber;
      }
      if (accountNumber) {
        var accountNumberStr = String(accountNumber);
        var length = accountNumberStr.length;
        if (length >= 8) {
          return accountNumberStr.slice(0, length - 8) + '****' + accountNumberStr.slice(length - 4, length);
        }
      }
      return '****';    // 正常情况下不会返回这一行
    }
  },
  methods: {
    showModal(businessType, title, desc, doctorAccountNumber) {
      if (this.businessType !== businessType || this.codeButtonStatus === 2) {
        // 如果更换了验证码对应的业务类型，或者发送按钮的文字已经是“重新发送”，则将发送按钮还原成初始状态
        this.codeButtonStatus = 0;
      }

      // 1.修改密码业务 2.授权技术支持业务 3.脱敏业务 4.技术支持业务(录入员为医生提供支持前输入医生的验证码)
      this.businessType = businessType;

      this.title = title;
      this.desc = desc;
      this.doctorAccountNumber = doctorAccountNumber ? doctorAccountNumber : '';

      this.verificationCode = '';
      this.verificationCodeWarning = '';
      this.readAgreement = false;

      this.displayModal = true;
    },
    sendCode() {
      if (this.lockSendButton) {
        return;
      }
      this.lockSendButton = true;
      var verificationInfo = {
        businessType: this.businessType
      };
      if (this.businessType === 4) {
        verificationInfo.accountNumber = this.doctorAccountNumber;
      }
      sendVerificationCode(verificationInfo).then(() => {
        this.lockSendButton = false;
        this.codeButtonStatus = 1;
        this.codeButtonCount = 180;
        this.countDown = setInterval(() => {
          this.codeButtonCount -= 1;
          if (this.codeButtonCount <= 0) {
            clearInterval(this.countDown);
            this.codeButtonStatus = 2;
          }
        }, 1000);
      }, (error) => {
        console.log(error);
        this.lockSendButton = false;
        if (error.code === 32) {
          this.$message({
            message: '请等待足够时间后再发送验证码',
            type: 'warning',
            duration: 2000
          });
        }
      });
    },
    updateVerificationCode() {
      if (/^[0-9]*$/.test(this.verificationCode)) {
        this.verificationCodeWarning = '';
      } else {
        this.verificationCodeWarning = '请输入数字';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      if (!this.readAgreement) {
        this.$message({
          message: '请阅读并同意保密协议',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      }

      if (this.verificationCode === '') {
        this.verificationCodeWarning = '请输入验证码';
      } else {
        this.updateVerificationCode();
      }

      if (this.verificationCodeWarning !== '') {
        this.lockSubmitButton = false;
        return;
      }
      var verificationInfo = {
        code: this.verificationCode,
        businessType: this.businessType
      };
      verifyMessageCode(verificationInfo).then(() => {
        if (this.businessType === 3) {
          Bus.$emit(this.PERMIT_DISPLAYING_SENSITIVE_INFO);
        } else if (this.businessType === 4) {
          Bus.$emit(this.PERMIT_SUPPORT_THE_DOCTOR);
        }

        this.displayModal = false;
        this.lockSubmitButton = false;

      }, (error) => {
        if (error.code === 33) {
          this.verificationCodeWarning = '验证码输入错误或已失效';
        }
        this.lockSubmitButton = false;
        console.log(error);
      });
    },
    showSecretAgreement() {
      Bus.$emit(this.SHOW_SECRET_AGREEMENT_MODAL);
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MESSAGE_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_MESSAGE_MODAL);
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
      font-weight: bold;
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
        font-weight: bold;
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
        border-radius: 5px;
        background-color: @light-font-color;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
        &.disabled {
          pointer-events: none;
          background-color: @gray-color;
          cursor: default;
        }
      }
      .warning-text {
        position: absolute;
        top: 25px;
        left: 10px;
        height: 15px;
        color: red;
        font-size: @small-font-size;
      }
      .el-input {
        .el-input__inner {
          height: 30px;
          border: none;
          background-color: @screen-color;
        }
      }
      .warning .el-input__inner {
        border: 1px solid red;
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
