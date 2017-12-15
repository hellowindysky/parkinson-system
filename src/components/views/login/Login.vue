<template>
  <div class='login'>
    <!-- <particles></particles> -->
    <div class="panel">
      <img class="logo" src="static/img/logo.png" alt="logo.png">
      <h1 class="title">{{title}}</h1>
      <h3 class="subtitle"></h3>

      <div class="tabs-wrapper" v-if="false">
        <span class="tab tab-place-1" :class="{'current-tab':loginType===1}" @click="accountLogin">账号登录</span>
        <span class="tab tab-place-2" :class="{'current-tab':loginType===2}" @click="">备用</span>
        <div class="tab-bottom-bar" :class="tabPlaceClass"></div>
      </div>

      <el-form class="input-wrapper" v-if="!mustResetPassword" :model="loginForm" :rules="rules" ref="loginForm" label-width="0">
        <el-form-item prop="account">
          <el-input class="round-input" v-model="loginForm.account" auto-complete="off" :placeholder="holderText"
            @keyup.enter.native="submitForm" autofocus="autofocus"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="round-input" v-model="loginForm.password" type="password" auto-complete="new-password"
            placeholder="请输入6-10位数字和字母的密码" @keyup.enter.native="submitForm"></el-input>
        </el-form-item>
        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember" class="checkbox" label="记住用户名" name="type"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="submitForm">登 录</el-button>
        </el-form-item>
      </el-form>

      <el-form class="input-wrapper" v-if="mustResetPassword" :model="resetForm" :rules="resetRules" ref="resetForm" label-width="0">
        <div class="notice" v-if="mustResetPassword">
          首次登录需要修改初始密码<span class="phone-num">【手机尾号 {{lastNumbers}}】</span>
        </div>
        <el-form-item prop="originalPassword">
          <el-input class="round-input" v-model="resetForm.originalPassword" type="password" auto-complete="new-password"
            placeholder="请输入当前密码" autofocus="autofocus" @keyup.enter.native="submitResetForm"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input class="round-input" v-model="resetForm.newPassword" type="password" auto-complete="new-password"
            placeholder="请输入新密码(字母，数字或符号，8-16位)" @keyup.enter.native="submitResetForm"></el-input>
          <div class="password-strength">{{passwordStrength}}</div>
        </el-form-item>
        <el-form-item prop="repeatedNewPassword">
          <el-input class="round-input" v-model="resetForm.repeatedNewPassword" type="password" auto-complete="new-password"
            placeholder="请再次输入新密码" @keyup.enter.native="submitResetForm"></el-input>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input class="round-input short" v-model="resetForm.verificationCode" type="text" auto-complete="new-password"
            placeholder="请输入短信验证码" @keyup.enter.native="submitResetForm"></el-input>
          <el-button class="button code-button" type="primary" @click="sendCode" :disabled="codeButtonStatus===1">{{codeButtonText}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="submitResetForm">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="version-info">版本 V2.0</div>
  </div>
</template>

<script>
import md5 from 'md5';
import { getLoginInfo } from 'api/login';
import { sendVerificationCode, resetPassword } from 'api/user';

// import particles from 'components/views/login/particles/Particles';

const ACCOUNT_LOGIN = 1;

export default {
  name: 'login',
  data() {
    var validateOriginalPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'));
      } else if (value !== this.currentPassword) {
        callback(new Error('当前密码输入不正确'));
      } else {
        if (this.resetForm.originalPassword !== '') {
          this.$refs.resetForm.validateField('newPassword');
        }
        callback();
      }
    };
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value === this.resetForm.originalPassword) {
        callback(new Error('新密码不能和当前密码一致'));
      } else if (value.indexOf(' ') >= 0) {
        callback(new Error('不能包含空格'));
      } else if (value.length < 8) {
        callback(new Error('新密码长度不能少于8位'));
      } else if (value.length > 16) {
        callback(new Error('新密码长度不能多于16位'));
      } else {
        var strengthLevel = this.getPasswordStrength(value);
        if (strengthLevel === 0) {
          callback(new Error('含有非法字符'));
        } else if (strengthLevel > 0 && this.resetForm.newPassword !== '') {
          this.$refs.resetForm.validateField('repeatedNewPassword');
          callback();
        }
      }
    };
    var validateRepeatedNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.resetForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateVerificationCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (!(/^[0-9]*$/.test(value))) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    return {
      loginType: 1,

      token: '',
      accountNumber: '',
      name: '',
      userName: '',
      userType: '',
      orgName: '',
      subjects: [],

      lockSendButton: false,
      lockSubmitButton: false,
      mustResetPassword: false,
      currentPassword: '',
      codeButtonStatus: 0,  // 0 初始状态，1 禁止状态，2 重新点击状态
      codeButtonCount: 0,
      countDown: null,      // 用来开启和关闭倒计时

      loginForm: {
        account: '',
        password: '',
        remember: false
      },
      resetForm: {
        originalPassword: '',
        newPassword: '',
        repeatedNewPassword: '',
        verificationCode: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '长度至少为 6 个字符', trigger: 'blur' }
        ]
      },
      resetRules: {
        originalPassword: [
          {validator: validateOriginalPass, trigger: 'blur'}
        ],
        newPassword: [
          {validator: validateNewPass, trigger: 'blur'}
        ],
        repeatedNewPassword: [
          {validator: validateRepeatedNewPass, trigger: 'blur'}
        ],
        verificationCode: [
          {validator: validateVerificationCode, trigger: 'blur'}
        ]
      }
    };
  },
  computed: {
    title() {
      return process.env.TITLE;
    },
    tabPlaceClass() {
      return 'tab-place-' + this.loginType;
    },
    holderText() {
      if (this.loginType === ACCOUNT_LOGIN) {
        return '请输入您的睿云账号/手机号码';
      }
    },
    md5Password() {
      return md5(this.password);
    },
    passwordStrength() {
      var value = this.resetForm.newPassword;
      if (value !== '' && value !== this.resetForm.originalPassword && value.indexOf(' ') < 0 &&
        value.length >= 8 && value.length <= 16) {

        var strengthLevel = this.getPasswordStrength(value);
        if (strengthLevel === 1) {
          return '密码强度: 弱';
        } else if (strengthLevel === 2) {
          return '密码强度: 中';
        } else if (strengthLevel === 3) {
          return '密码强度: 强';
        }
      } else {
        return '';
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
    lastNumbers() {
      if (this.accountNumber) {
        var numStr = String(this.accountNumber);
        if (numStr.length >= 4) {
          return numStr.slice(numStr.length - 4, numStr);
        }
      }
      return '****';  // 返回正确的情况下，不会运行这一行
    }
  },
  methods: {
    accountLogin() {
      this.loginType = ACCOUNT_LOGIN;
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
    },
    getPasswordStrength(value) {
      // 返回值为 0，1，2，3，分别代表 非法，弱，中，强
      var regValid = new RegExp(/^(?:[0-9a-zA-Z!@#$%^&*()\-_=+`~\[{\]};:'",<.>\/?\\|]+)$/);
      var regNum = new RegExp(/[0-9]+/);
      var regAlphabet = new RegExp(/[a-zA-Z]+/);
      var regSpecialCharacter = new RegExp(/[!@#$%^&*()\-_=+`~\[{\]};:'",<.>\/?\\|]+/);

      var isValid = regValid.test(value);
      var hasNum = regNum.test(value);
      var hasAlphabet = regAlphabet.test(value);
      var hasSpecialCharacter = regSpecialCharacter.test(value);

      var count = 0;
      count += (hasNum ? 1 : 0);
      count += (hasAlphabet ? 1 : 0);
      count += (hasSpecialCharacter ? 1 : 0);

      if (!isValid) {
        return 0;
      } else {
        return count;
      }
    },
    enterApp() {
      sessionStorage.setItem('token', this.token);
      sessionStorage.setItem('accountNumber', this.accountNumber);
      sessionStorage.setItem('name', this.name);
      sessionStorage.setItem('userName', this.userName);
      sessionStorage.setItem('userType', this.userType);
      sessionStorage.setItem('orgName', this.orgName);
      sessionStorage.setItem('subjects', JSON.stringify(this.subjects));

      // 登录时默认进入医院入口
      this.$store.commit('UPDATE_SUBJECT_ID', this.SUBJECT_ID_FOR_HOSPITAL);
      sessionStorage.setItem('subjectId', this.SUBJECT_ID_FOR_HOSPITAL);

      // 重新记录操作时间点
      this.$store.commit('UPDATE_LAST_OPERATION_TIME');
      sessionStorage.setItem('lastOperationTime', this.$store.state.lastOperationTime);

      this.$router.push('/');
    },
    submitForm() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          if (this.loginForm.remember) {
            // 记住用户名
            localStorage.setItem('account', this.loginForm.account);
          } else {
            // 没有勾选 记住用户名
            localStorage.removeItem('account');
          }

          getLoginInfo(this.loginForm.account, this.loginForm.password).then((data) => {
            this.lockSubmitButton = false;
            this.token = data.loginToken;
            this.accountNumber = data.user.accountNumber;
            this.name = data.user.name;
            this.userName = data.user.userName;
            this.userType = data.user.userType;
            this.orgName = data.orgs && data.orgs[0] && data.orgs[0].orgName ? data.orgs[0].orgName : '';
            this.subjects = data.tasks ? data.tasks : [];

            var commonRequest = {
              'userId': 93242,
              'accountNumber': this.accountNumber,
              'userType': this.userType,
              'orgId': 34,
              'orgType': 2,
              'viewType': 2   // 1 表示全部显示，2表示脱敏显示
            };
            sessionStorage.setItem('commonRequest', JSON.stringify(commonRequest));

            // 将正确密码缓存起来，在重置密码的时候会用到
            this.currentPassword = this.loginForm.password;

            // 0 需要修改密码 1表示已经修改过密码
            var changePassword = data.user.changePassword;
            this.mustResetPassword = changePassword === 0;

            if (!this.mustResetPassword) {
              this.enterApp();
            }

          }, (error) => {
            this.lockSubmitButton = false;
            if (error.code === 21) {
              this.$message({
                message: '用户名或密码错误',
                type: 'warning',
                duration: 2000
              });
            }
          });
        } else {
          this.lockSubmitButton = false;
          console.log('input invalid');
          return;
        }
      });
    },
    submitResetForm() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      this.$refs['resetForm'].validate((valid) => {
        // 校验字段之后，发送修改密码的请求，如果再返回正确，则跳转到系统
        if (valid) {
          resetPassword(this.resetForm.originalPassword, this.resetForm.newPassword, this.resetForm.verificationCode).then(() => {
            this.$message({
              message: '已成功修改密码',
              type: 'success',
              duration: 2000
            });
            this.enterApp();
            this.lockSubmitButton = false;

          }, (error) => {
            if (error.code === 25) {
              // 由于我们在前端就做了校验，所以正常情况下不会执行到这里
              this.$message({
                message: '当前密码输入错误',
                type: 'warning',
                duration: 2000
              });
            } else if (error.code === 33) {
              this.$message({
                message: '验证码输入错误或已失效',
                type: 'warning',
                duration: 2000
              });
            }
            console.log(error);
            this.lockSubmitButton = false;
          });

        } else {
          console.log('input invalid');
          this.lockSubmitButton = false;
          return;
        }
      });
    }
  },
  components: {
    // particles
  },
  mounted() {
    // 如果之前登录的时候勾选了“记住用户名”，则在浏览器中读取上次的用户名
    var account = localStorage.getItem('account');
    if (account !== null) {
      this.loginForm.account = account;
      this.loginForm.remember = true;
    } else {
      this.loginForm.account = '';
      this.loginForm.remember = false;
    }

    // 回到登陆界面时，清空 token 和 支持医生的信息
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('supportedDoctor');

    // 每次回到登录界面的时候，都要清空显示敏感信息的权限
    this.$store.commit('DISCARD_RIGHT_OF_DISPLAYING_SENSITIVE_INFO');
  }
};
</script>

<style lang="less">
@import '~styles/variables.less';
@tab-width: 60px;
@tab-horizontal-space: 20px;
@input-width: 320px;
@input-height: 45px;

.login {
  width: 100vw;
  height: 100vh;
  background-color: @theme-color;
  position: relative;
  min-height: 666px;
  min-width: @min-screen-width;
  .panel {
    position: absolute;
    left: 50%;
    top: 50%;
    width: @input-width;
    height: 500px;
    transform: translate(-50%, -320px);
    border-radius: 30px;
    z-index: 100;
    .logo {
      width: 160px;
      height: 160px;
    }
    .title {
      margin: 0 auto 50px;
      height: 40px;
      line-height: 40px;
      font-size: 30px;
      color: #fff;
    }
    .subtitle {
      display: none;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
    }
    .tabs-wrapper {
      display: none;
      position: relative;
      margin: 0 auto;
      padding: 0;
      width: @tab-width * 2  + @tab-horizontal-space;
      height: 25px;
      line-height: 25px;
      .tab {
        position: absolute;
        margin: 0;
        width: @tab-width;
        left: 0;
        box-sizing: border-box;
        text-align: center;
        font-size: @normal-font-size;
        color: #eee;
        cursor: pointer;
        &:hover {
          color: #bbb;
        }
      }
      .current-tab {
        color: @button-color;
        &:hover {
          color: @button-color;
        }
      }
      .tab-bottom-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: @tab-width;
        height: 2px;
        background-color: @button-color;
        transition: 0.2s;
      }
      .tab-place-1 {
        transform: translateX(0);
      }
      .tab-place-2 {
        transform: translateX(@tab-width + @tab-horizontal-space);
      }
    }
    .input-wrapper {
      position: relative;
      margin: 20px auto;
      width: @input-width;
      height: 130px;
      text-align: left;
      .notice {
        position: absolute;
        width: @input-width;
        top: -25px;
        line-height: 25px;
        font-size: @normal-font-size;
        color: #fff;
        text-align: center;
        .phone-num {
          color: @button-color;
        }
      }
      .round-input input {
        height: @input-height;
        border-radius: 50px;
        padding-left: 20px;
      }
      .password-strength {
        position: absolute;
        left: 100%;
        top: 0;
        width: 100px;
        padding-left: 10px;
        line-height: @input-height;
        color: #fff;
        font-size: @normal-font-size;
      }
      .short {
        width: @input-width * 0.5;
      }
      .checkbox {
        float: left;
        margin-left: 20px;
        .is-checked .el-checkbox__inner {
          background-color: @button-color;
          border-color: @button-color;
        }
        .el-checkbox__label {
          color: #fff;
        }
      }
      .el-form-item__error {
        padding-left: 22px;
      }
      .button {
        width: @input-width;
        height: @input-height;
        border-radius: 50px;
        background-color: @button-color;
        color: @button-font-color;
        &.code-button {
          position: absolute;
          right: 0;
          width: @input-width * 0.4;
          background-color: @light-font-color;
        }
        &.is-disabled {
          border-color: @theme-color;
          background-color: @gray-color;
          color: #fff;
        }
      }
    }
  }
  .version-info {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 100px;
    height: 40px;
    line-height: 40px;
    transform: translateX(-50%);
    color: #fff;
    font-size: 14px;
  }
}
</style>
