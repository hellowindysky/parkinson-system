<template lang="html">
  <div class="authorization-modal-wrapper" v-show="displayModal">
    <div class="authorization-modal" :class="{'narrow': hasAuthorized}">
      <div v-show="!hasAuthorized" class="unauthorized">
        <div class="title">授权技术支持</div>
        <div class="field">请输入需授权的技术支持员账号</div>
        <div class="field input">
          <span class="warning-text">{{supportAccountWarning}}</span>
          <el-input v-model="technicalSupportAccount" @change="updateSupportAccount"
            :class="{'warning':supportAccountWarning}" :placeholder="'请输入技术支持员的睿云账号或手机号'"></el-input>
        </div>
        <div class="field">请输入短信验证码:
          <span class="phone-num">【当前手机账号 {{accountNumber}}】</span>
        </div>
        <div class="field input">
          <span class="warning-text">{{verificationCodeWarning}}</span>
          <el-input class="short-input" v-model="verificationCode" @change="updateVerificationCode"
            :class="{'warning': verificationCodeWarning}" :placeholder="'请输入短信验证码'"></el-input>
          <span class="send-button" :class="{'disabled':codeButtonStatus===1}" @click="sendCode">
            {{codeButtonText}}
          </span>
        </div>
        <div class="field agreement">
          <el-checkbox v-model="readAgreement"></el-checkbox>
          我已阅读并同意<span class="link" @click="showSecretAgreement">授权技术支持协议</span>
        </div>
        <div class="seperate-line"></div>
        <div class="button-wrapper">
          <div class="button cancel-button" @click="cancel">取消</div>
          <div class="button submit-button" @click="submit">确定</div>
        </div>
      </div>
      <div v-show="hasAuthorized" class="authorized">
        <img src="~img/profile.png" alt="icon" class="avatar">
        <div class="authorization-account">{{supportAccountName}}</div>
        <div class="authorization-status">当前授权中</div>
        <div class="authorization-number">
          <span class="iconfont icon-phone"></span>
          {{supportAccountNumber}}
        </div>
        <div class="button terminate-button" @click="terminateAuthorization">解除授权</div>
        <div class="button cancel-button" @click="cancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import { sendVerificationCode, getTechnicalSupport, addAuthentication, removeAuthentication } from 'api/user.js';

export default {
  data() {
    return {
      displayModal: false,
      hasAuthorized: false,
      lockSubmitButton: false,

      technicalSupportAccount: '',
      supportAccountWarning: '',
      accountNumber: '',
      verificationCode: '',
      verificationCodeWarning: '',
      codeButtonStatus: 0,
      readAgreement: false,

      lockSendButton: false,
      codeButtonCount: 0,
      countDown: null,

      technicalSupportAccountInfo: null,
      lockTerminateButton: false
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
    supportAccountName() {
      return (this.technicalSupportAccountInfo && this.technicalSupportAccountInfo.realname)
        ? this.technicalSupportAccountInfo.realname : '';
    },
    supportAccountNumber() {
      return (this.technicalSupportAccountInfo && this.technicalSupportAccountInfo.mobilephone)
        ? this.technicalSupportAccountInfo.mobilephone : '';
    }
  },
  methods: {
    showModal(technicalSupportAccountInfo) {
      if (technicalSupportAccountInfo === null) {
        this.hasAuthorized = false;
      } else {
        this.technicalSupportAccountInfo = technicalSupportAccountInfo;
        this.hasAuthorized = true;
      }

      this.technicalSupportAccount = '';
      this.supportAccountWarning = '';
      this.readAgreement = false;
      this.accountNumber = sessionStorage.getItem('accountNumber');
      this.verificationCode = '';
      this.verificationCodeWarning = '';
      if (this.codeButtonStatus === 2) {
        this.codeButtonStatus = 0;
      }
      this.displayModal = true;
    },
    updateVerificationCode() {
      if (/^[0-9]*$/.test(this.verificationCode)) {
        this.verificationCodeWarning = '';
      } else {
        this.verificationCodeWarning = '请输入数字';
      }
    },
    updateSupportAccount() {
      this.supportAccountWarning = '';
    },
    sendCode() {
      if (this.lockSendButton) {
        return;
      }

      this.lockSendButton = true;
      var verificationInfo = {
        businessType: 2
      };
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
        this.lockSendButton = false;
        console.log(error);
        if (error.code === 32) {
          this.$message({
            message: '请等待足够时间后再发送验证码',
            type: 'warning',
            duration: 2000
          });
        }
      });
    },
    cancel() {
      this.lockSubmitButton = false;
      this.lockSendButton = false;
      this.lockTerminateButton = false;
      this.displayModal = false;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      if (!this.readAgreement) {
        this.$message({
          message: '请阅读并同意授权技术支持协议',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      }

      if (this.technicalSupportAccount === '') {
        this.supportAccountWarning = '请输入技术支持员的账号或手机号';
      }
      if (this.verificationCode === '') {
        this.verificationCodeWarning = '请输入短信验证码';
      }
      if (this.supportAccountWarning !== '' || this.verificationCodeWarning !== '') {
        this.lockSubmitButton = false;
        return;
      }

      getTechnicalSupport(this.technicalSupportAccount).then((data) => {
        if (!data || data.length === 0) {
          this.supportAccountWarning = '请输入正确的技术支持员账号';
          this.lockSubmitButton = false;

        } else if (data.length > 0) {
          let supportAccountList = [data[0].id];
          addAuthentication(supportAccountList, this.verificationCode).then(() => {
            this.$message({
              message: '已成功授权',
              type: 'success',
              duration: 2000
            });
            this.lockSubmitButton = false;
            Bus.$emit(this.UPDATE_AUTHORIZED_STATUS);
            this.displayModal = false;

          }, (error) => {
            if (error.code === 33) {
              this.verificationCodeWarning = '验证码输入错误或已失效';
            }
            console.log(error);
            this.lockSubmitButton = false;
          });
        }

      }, (error) => {
        this.lockSubmitButton = false;
        console.log(error);
      });
    },
    terminateAuthorization() {
      if (this.lockTerminateButton) {
        return;
      }
      this.lockTerminateButton = true;
      this.displayModal = false;

      Bus.$on(this.CONFIRM, () => {
        let supportAccountList = [this.technicalSupportAccountInfo.id];
        removeAuthentication(supportAccountList).then(() => {
          this.$message({
            message: '成功解除授权',
            type: 'success',
            duration: 2000
          });
          Bus.$off(this.CONFIRM);
          Bus.$emit(this.UPDATE_AUTHORIZED_STATUS);

          this.lockTerminateButton = false;

        }, (error) => {
          console.log(error);
          Bus.$off(this.CONFIRM);
          this.lockTerminateButton = false;
        });
      });

      let title = '解除提醒';
      let content = '你确定要解除对【' + this.supportAccountName + '】的授权吗?';
      let confirmButtonText = '确认解除';
      Bus.$emit(this.REQUEST_CONFIRMATION, title, content, confirmButtonText);
    },
    showSecretAgreement() {
      Bus.$emit(this.SHOW_SECRET_AGREEMENT_MODAL);
    }
  },
  mounted() {
    Bus.$on(this.SHOW_AUTHORIZATION_MODAL, this.showModal);
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_AUTHORIZATION_MODAL);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;

.authorization-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .authorization-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 12%;
    width: 360px;
    text-align: left;
    font-size: 0;
    background-color: @background-color;
    transition: 0.1s;
    &.narrow {
      top: 18%;
      width: 220px;
    }
    .unauthorized {
      .title {
        padding: 30px 0 20px;
        width: 100%;
        text-align: center;
        font-size: @large-font-size;
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
        &.input {
          margin-bottom: 15px;
          .warning-text {
            position: absolute;
            top: 25px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
        }
        &.agreement {
          padding-top: 5px;
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
        .phone-num {
          color: @button-color;
        }
        .short-input {
          width: 60%;
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
        .send-button {
          display: inline-block;
          position: absolute;
          right: 0;
          top: 7px;
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
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
    .authorized {
      text-align: center;
      transform: translateY(-30px);
      .avatar {
        display: inline-block;
        width: 90px;
        height: 90px;
        transform: translateY(-15px);
      }
      .authorization-account {
        line-height: 25px;
        font-size: @normal-font-size;
      }
      .authorization-status {
        margin: 0 0 10px;
        line-height: 25px;
        color: @button-color;
        font-size: @normal-font-size;
      }
      .authorization-number {
        padding: 0 15px 0 0;
        line-height: 25px;
        font-size: @normal-font-size;
        color: @light-font-color;
        .iconfont {
          display: inline-block;
          transform: translateY(1px);
        }
      }
      .button {
        margin: 15px auto;
        width: 220px;
        height: 40px;
        line-height: 40px;
        font-size: @normal-font-size;
        color: #fff;
        cursor: pointer;
        &.terminate-button {
          background-color: @light-font-color;
        }
        &.cancel-button {
          margin-bottom: 0;
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
