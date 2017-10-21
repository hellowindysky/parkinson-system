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
            @change="updateOriginalPassword"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          新密码
        </span>
        <span class="field-input">
          <span class="warning-text">{{newPasswordWarning}}</span>
          <el-input :class="{'warning': newPasswordWarning}" v-model="newPassword"
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
          <el-input :class="{'warning': repeatedNewPasswordWarning}" v-model="repeatedNewPassword"
            type="password" placeholder="请再次输入新密码" @focus="clearRepeatedNewPasswordWarning"></el-input>
        </span>
        <span class="iconfont icon-ok note" v-show="repeatedSuccessfully"></span>
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
      displayModal: false,
      originalPassword: '',
      originalPasswordWarning: '',
      newPassword: '',
      newPasswordWarning: '',
      repeatedNewPassword: '',
      repeatedNewPasswordWarning: '',
      newPasswordNote: ''
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
    }
  },
  methods: {
    showModal() {
      this.displayModal = true;
    },
    cancel() {
      this.displayModal = false;
      this.originalPassword = '';
      this.newPassword = '';
      this.repeatedNewPassword = '';
      this.originalPasswordWarning = '';
      this.newPasswordWarning = '';
      this.repeatedNewPasswordWarning = '';
    },
    submit() {
      if (this.originalPasswordWarning !== '' ||
        this.newPasswordWarning !== '' ||
        this.repeatedNewPasswordWarning !== '') {
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
      if (this.repeatedNewPassword !== this.newPassword) {
        this.repeatedNewPasswordWarning = '两次输入的密码不一致';
      }
    },
    clearOriginalPasswordWarning() {
      if (this.originalPasswordWarning === '请输入当前密码') {
        this.originalPasswordWarning = '';
      }
    },
    updateOriginalPassword() {
      if (this.originalPassword.indexOf(' ') >= 0) {
        this.originalPasswordWarning = '不能包含空格';
      } else {
        this.originalPasswordWarning = '';
      }
    },
    clearNewPasswordWarning() {
      if (this.newPasswordWarning === '请输入新密码') {
        this.newPasswordWarning = '';
      }
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
      if (this.repeatedNewPasswordWarning === '两次输入的密码不一致') {
        this.repeatedNewPasswordWarning = '';
      }
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
@field-name-width: 80px;

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
    top: 20%;
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
      margin: 20px auto 10px;
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
