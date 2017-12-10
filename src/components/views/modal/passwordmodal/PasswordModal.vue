<template lang="html">
  <div class="password-modal-wrapper" v-show="displayModal">
    <div class="password-modal">
      <h3 class="title">修改密码</h3>
      <div class="field">
        <span class="field-name">
          当前密码
        </span>
        <span class="field-input">
          <span class="warning-text">{{originalPasswordWarning}}</span>
          <el-input :class="{'warning': originalPasswordWarning}" v-model="originalPassword"
            type="password" placeholder="请输入当前密码" @focus="clearOriginalPasswordWarning"
            @change="updateOriginalPassword" auto-complete="new-password"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          新密码
        </span>
        <span class="field-input">
          <span class="warning-text">{{newPasswordWarning}}</span>
          <el-input :class="{'warning': newPasswordWarning}" v-model="newPassword" auto-complete="new-password"
            type="password" placeholder="请输入新密码(字母，数字或符号，8-16位)" @focus="clearNewPasswordWarning"
            @change="updateNewPassword"></el-input>
        </span>
        <span class="note">{{newPasswordNote}}</span>
      </div>
      <div class="field">
        <span class="field-name">
          确认新密码
        </span>
        <span class="field-input">
          <span class="warning-text">{{repeatedNewPasswordWarning}}</span>
          <el-input :class="{'warning': repeatedNewPasswordWarning}" v-model="repeatedNewPassword" auto-complete="new-password"
            type="password" placeholder="请再次输入新密码" @focus="clearRepeatedNewPasswordWarning"></el-input>
        </span>
        <span class="iconfont icon-ok note" v-show="repeatedSuccessfully"></span>
      </div>
      <div class="seperate-line"></div>
      <div class="field notice">
        <span class="field-name">当前账号手机</span>
        <span class="field-input">{{accuntNumberWithParialHiding}}</span>
      </div>
      <div class="field">
        <span class="field-name">
          验证码
        </span>
        <span class="field-input">
          <span class="warning-text">{{verificationCodeWarning}}</span>
          <el-input class="short-input" :class="{'warning': verificationCodeWarning}" v-model="verificationCode"
            type="password" placeholder="请输入短信验证码" @focus="clearVerificationCodeWarning" auto-complete="new-password"
            @change="updateVerificationCode"></el-input>
          <div class="send-button" :class="{'disabled': codeButtonStatus===1}" @click="sendCode">{{codeButtonText}}</div>
        </span>
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
import { sendVerificationCode, resetPassword } from 'api/user.js';

export default {
  data() {
    return {
      displayModal: false,
      originalPassword: '',
      originalPasswordWarning: '',
      newPassword: '',
      newPasswordWarning: '',
      repeatedNewPassword: '',
      repeatedNewPasswordWarning: '',
      verificationCode: '',
      verificationCodeWarning: '',
      newPasswordNote: '',
      codeButtonStatus: 0,  // 0 初始状态，1 禁止状态，2 重新点击状态
      codeButtonCount: 0,
      countDown: null,      // 用来开启和关闭倒计时
      lockSendButton: false,
      lockSubmitButton: false
    };
  },
  computed: {
    repeatedSuccessfully() {
      if (this.newPasswordWarning === '' && this.repeatedNewPassword === this.newPassword &&
        this.newPassword.length >= 8 && this.newPassword.length <= 16) {
        return true;
      } else {
        return false;
      }
    },
    codeButtonText() {
      if (this.codeButtonStatus === 0) {
        return '获取验证码';
      } else if (this.codeButtonStatus === 1) {
        return '重新获取 (' + this.codeButtonCount + ')';
      } else if (this.codeButtonStatus === 2) {
        return '重新获取';
      }
    },
    accuntNumberWithParialHiding() {
      var accountNumber = sessionStorage.getItem('accountNumber');
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
    showModal() {
      this.originalPassword = '';
      this.newPassword = '';
      this.repeatedNewPassword = '';
      this.originalPasswordWarning = '';
      this.newPasswordWarning = '';
      this.repeatedNewPasswordWarning = '';
      this.verificationCode = '';
      this.verificationCodeWarning = '';
      if (this.codeButtonStatus === 2) {
        this.codeButtonStatus = 0;
      }
      this.displayModal = true;
    },
    cancel() {
      this.lockSubmitButton = false;
      this.lockSendButton = false;
      this.displayModal = false;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }

      if (this.originalPasswordWarning !== '' ||
        this.newPasswordWarning !== '' ||
        this.repeatedNewPasswordWarning !== '' ||
        this.verificationCodeWarning !== '') {
        return;
      }

      if (this.originalPassword === '') {
        this.originalPasswordWarning = '请输入当前密码';
        return;
      }
      if (this.newPassword === '') {
        this.newPasswordWarning = '请输入新密码';
        return;
      }
      if (this.newPassword === this.originalPassword) {
        this.newPasswordWarning = '新密码不能与原来密码相同';
        return;
      }
      if (this.repeatedNewPassword !== this.newPassword) {
        this.repeatedNewPasswordWarning = '两次输入的密码不一致';
        return;
      }
      if (this.verificationCode === '') {
        this.verificationCodeWarning = '请输入验证码';
        return;
      }

      // 在发送请求前，锁住提交按钮
      this.lockSubmitButton = true;
      // 运行到这里，说明满足所有条件，可以更新代码了
      resetPassword(this.originalPassword, this.newPassword, this.verificationCode).then(() => {
        this.$message({
          message: '已成功修改密码',
          type: 'success',
          duration: 2000
        });
        this.displayModal = false;
        this.lockSubmitButton = false;
      }, (error) => {
        if (error.code === 25) {
          this.originalPasswordWarning = '当前密码不正确，请重新输入';
        } else if (error.code === 33) {
          this.verificationCodeWarning = '验证码输入错误或已失效';
        }
        this.lockSubmitButton = false;
      });
    },
    clearOriginalPasswordWarning() {
      this.originalPasswordWarning = '';
      this.updateOriginalPassword();
    },
    updateOriginalPassword() {
      if (this.originalPassword.indexOf(' ') >= 0) {
        this.originalPasswordWarning = '不能包含空格';
      } else {
        this.originalPasswordWarning = '';
      }
    },
    clearNewPasswordWarning() {
      this.newPasswordWarning = '';
      this.updateNewPassword();
    },
    updateNewPassword() {
      if (this.newPassword.indexOf(' ') >= 0) {
        this.newPasswordWarning = '不能包含空格';
        this.newPasswordNote = '';
      } else if (this.newPassword.length < 8) {
        this.newPasswordWarning = '新密码长度不能少于8位';
        this.newPasswordNote = '';
      } else if (this.newPassword.length > 16) {
        this.newPasswordWarning = '新密码长度不能多于16位';
        this.newPasswordNote = '';
      } else {
        this.newPasswordWarning = '';
        var regValid = new RegExp(/^(?:[0-9a-zA-Z!@#$%^&*()\-_=+`~\[{\]};:'",<.>\/?\\|]+)$/);
        var regNum = new RegExp(/[0-9]+/);
        var regAlphabet = new RegExp(/[a-zA-Z]+/);
        var regSpecialCharacter = new RegExp(/[!@#$%^&*()\-_=+`~\[{\]};:'",<.>\/?\\|]+/);

        var isValid = regValid.test(this.newPassword);
        var hasNum = regNum.test(this.newPassword);
        var hasAlphabet = regAlphabet.test(this.newPassword);
        var hasSpecialCharacter = regSpecialCharacter.test(this.newPassword);
        var count = 0;
        count += (hasNum ? 1 : 0);
        count += (hasAlphabet ? 1 : 0);
        count += (hasSpecialCharacter ? 1 : 0);
        if (!isValid) {
          this.newPasswordWarning = '含有非法字符';
        } else if (count === 3) {
          this.newPasswordNote = '密码强度: 强';
        } else if (count === 2) {
          this.newPasswordNote = '密码强度: 中';
        } else if (count === 1) {
          this.newPasswordNote = '密码强度: 弱';
        } else {
          this.newPasswordWarning = '出错了';  // 如果前面正则表达式没问题的话，永远不会运行到这一行
        }
      }
    },
    clearRepeatedNewPasswordWarning() {
      this.repeatedNewPasswordWarning = '';
    },
    clearVerificationCodeWarning() {
      this.verificationCodeWarning = '';
      this.updateVerificationCode();
    },
    updateVerificationCode() {
      if (/^[0-9]*$/.test(this.verificationCode)) {
        this.verificationCodeWarning = '';
      } else {
        this.verificationCodeWarning = '请输入数字';
      }
    },
    sendCode() {
      if (this.lockSendButton) {
        return;
      }

      this.lockSendButton = true;
      var verificationInfo = {
        businessType: 1
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
    }
  },
  mounted() {
    Bus.$on(this.SHOW_PASSWORD_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_PASSWORD_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 90px;

.password-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .password-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 12%;
    width: 560px;
    text-align: left;
    font-size: 0;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      width: 100%;
      text-align: center;
      font-size: @large-font-size;
    }
    .field {
      padding: 10px 0;
      text-align: left;
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      text-align: left;
      &.notice {
        padding: 0;
        height: 40px;
        font-weight: bold;
        .field-name {
          height: 40px;
          color: @button-color;
        }
        .field-input {
          height: 40px;
          color: @button-color;
        }
      }
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 50px;
        width: @field-name-width;
        line-height: @field-height;
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
        position: absolute;
        top: 0;
        left: @field-name-width + 50px;
        right: 100px;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
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
          &.short-input {
            width: 55%;
          }
        }
        .send-button {
          display: inline-block;
          position: absolute;
          right: 0;
          top: 5px;
          width: 35%;
          height: 30px;
          line-height: 30px;
          background-color: @light-font-color;
          color: #fff;
          text-align: center;;
          border-radius: 5px;
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
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
      .note {
        position: absolute;
        left: calc(~"100% - 90px");
        top: 12px;
        font-size: @normal-font-size;
        &.icon-ok {
          color: #00aa60;
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 5px auto 10px;
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
