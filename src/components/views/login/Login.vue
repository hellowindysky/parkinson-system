<template>
  <div class='login'>
    <!-- <particles></particles> -->
    <div class="panel">
      <img class="logo" src="static/img/logo.png" alt="logo.png">
      <h1 class="title">{{title}}</h1>
      <h3 class="subtitle"></h3>

      <div class="tabs-wrapper">
        <span class="tab tab-place-1" v-if="loginType!==3 && loginType !== 4 " :class="{'current-tab':loginType===1}" @click="accountLogin">用户名密码</span>
        <span class="tab tab-place-2" v-if="loginType!==3 && loginType !== 4" :class="{'current-tab':loginType===2}" @click="dynamicPassword">动态密码</span>
        <div class="tab-bottom-bar" :class="tabPlaceClass"></div>
      </div>
      <el-form class="input-wrapper" v-if="!mustResetPassword" :model="loginForm" :rules="rules" ref="loginForm" label-width="0">
        <el-form-item prop="account" v-if="loginType!==4">
          <el-input class="round-input" clearable v-model="loginForm.account" auto-complete="off" :placeholder="holderText"
            @keyup.enter.native="submitForm" autofocus="autofocus"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="loginType===1 || loginType===5">
          <el-input class="round-input" clearable v-model="loginForm.password" type="password" auto-complete="new-password"
            placeholder="请输入6-16位数字和字母的密码" @keyup.enter.native="submitForm"></el-input>
        </el-form-item>

        <el-form-item prop="identifyingCode" v-if="loginType===2">
          <el-input class="round-input short" clearable v-model="loginForm.identifyingCode" auto-complete="new-password" placeholder="请输入短信验证码" @keyup.enter.native="submitForm" autofocus="autofocus"></el-input>
        <el-button class="button code-button" type="primary" @click="sendCodes" :disabled="codeButtonStatus===1">{{codeButtonText}}</el-button>
        </el-form-item>

        <el-form-item prop="identifyingCode" v-if="loginType===3">
          <el-input class="round-input short" clearable v-model="loginForm.identifyingCode" auto-complete="new-password" placeholder="请输入短信验证码" @keyup.enter.native="submitForm" autofocus="autofocus"></el-input>
          <el-button class="button code-button" type="primary" @click="sendCodes" :disabled="codeButtonStatus===1">{{codeButtonText}}</el-button>
        </el-form-item>

        <el-form class="input-wrapper" v-if="loginType===4" :model="resetFormPassword" :rules="resetRulesPassword" ref="resetFormPassword" label-width="0">
          <el-form-item prop="formNewPassword" v-if="loginType===4">
            <el-input class="round-input" v-model="resetFormPassword.formNewPassword" type="password" auto-complete="new-password"
              placeholder="请输入8-16位数字或字母的新密码" @keyup.enter.native="submitResetFormPassword"></el-input>
            <div class="password-strength">{{passwordStrength}}</div>
          </el-form-item>
          <el-form-item prop="repeatedFormNewPassword" v-if="loginType===4">
            <el-input class="round-input" clearable type="password" v-model="resetFormPassword.repeatedFormNewPassword" auto-complete="new-password" placeholder="请确认输入8-16位数字或字母的新密码" @keyup.enter.native="submitResetFormPassword" autofocus="autofocus"></el-input>
            <span class="iconfont icon-ok note" v-show="repeatedSuccessfully"></span>
          </el-form-item>
        </el-form>

        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember"  v-if="loginType!==3 && loginType !== 4" class="checkbox" label="记住用户名" name="type"></el-checkbox>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <span class="forget" type="primary" v-if="loginType!==3 && loginType !== 4" :class="{'current-tab':loginType===3}" @click="forgetPassword">忘记密码</span>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" v-if="loginType===1 || loginType===2 || loginType===5" @click="submitForm">登 录</el-button>
          <el-button class="button" type="primary" v-if="loginType===3" :class="{'current-tab':loginType===4}"  @click="submitForm">确定</el-button>
          <el-button class="button" type="primary" v-if="loginType===4" :class="{'current-tab':loginType===4}" @click="submitResetFormPassword">确定</el-button>
        </el-form-item>
      </el-form>


      <div class="sign-up-text" v-if="!mustResetPassword">
        还没有账号？
        <a class="link" target="_blank" href="https://www.wjx.top/jq/19488329.aspx">点击这里</a>申请试用
      </div>

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
    <div class="version-info">版本 V2.4.0</div>
  </div>
</template>

<script>
import md5 from 'md5';
import { getLoginInfo } from 'api/login';
import { setRequestToken, clearRequestToken } from 'api/common';
import { sendVerificationCode, sendVerificationCodes, resetPassword, resetPasswordByIdentifyingCode } from 'api/user';
import Bus from 'utils/bus';

// import particles from 'views/login/particles/Particles';

const ACCOUNT_LOGIN = 1;
const DYNAMIC_PASSWORD = 2;
const FORGET_PASSWORD = 3;
const TO_CHANGE_PASSWORD = 4;
const BACK_HOMEPAGE = 5;

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
        } else if (strengthLevel > 0 && this.resetFormPassword.formNewPassword !== '') {
          this.$refs.resetFormPassword.validateField('repeatedFormNewPassword');
          callback();
        }
      }
    };
    var validateRepeatedNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.resetForm.newPassword && value !== this.resetFormPassword.formNewPassword) {
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
    var identifyingCodeCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (!(/^[0-9]*$/.test(value))) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    var differentiateAccount = (rule, value, callback) => {
      if (value === '') {
        if (this.loginType === 1 || this.loginType === 5) {
          callback(new Error('请输入账号'));
        } else if (this.loginType === 2 || this.loginType === 3) {
          callback(new Error('请输入手机号'));
        }
      } else if (!(/^\S{2,20}$/.test(value)) && this.loginType !== 2 && this.loginType !== 3) {
        callback(new Error('请输入长度在 2 到 20 个字符'));
      } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(value)) && this.loginType !== 1 && this.loginType !== 5) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      loginType: 1,

      token: '',
      userId: '',
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
        remember: false,
        identifyingCode: ''
      },
      resetForm: {
        originalPassword: '',
        newPassword: '',
        repeatedNewPassword: '',
        verificationCode: ''
      },
      resetFormPassword: {
        formNewPassword: '',
        repeatedFormNewPassword: ''
      },
      rules: {
        account: [
          // { required: true, message: '请输入账号/手机号码', trigger: 'change' },
          // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          {validator: differentiateAccount, trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '长度至少为 6 个字符', trigger: 'blur' }
        ],
        identifyingCode: [
          {validator: identifyingCodeCode, trigger: 'blur'}
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
      },
      resetRulesPassword: {
        formNewPassword: [
          {validator: validateNewPass, trigger: 'blur'}
        ],
        repeatedFormNewPassword: [
          {validator: validateRepeatedNewPass, trigger: 'blur'}
        ]
      }
    };
  },
  computed: {
    title() {
      return process.env.TITLE;
    },
    isAlone() {
      if (process.env.NODE_ENV_NAME === 'alone') {
        return true;
      }
    },
    tabPlaceClass() {
      if (this.loginType === 1 || this.loginType === 2) {
        return 'tab-place-' + this.loginType;
      } else if (this.loginType === 5) {
        return 'tab-place-1';
      } else {
        return 'tab-place-0';
      }
    },
    holderText() {
      if (this.loginType === ACCOUNT_LOGIN || this.loginType === BACK_HOMEPAGE) {
        return '请输入您的睿云账号/手机号码';
      } else if (this.loginType === DYNAMIC_PASSWORD) {
        return '请输入您的手机号码';
      } else if (this.loginType === FORGET_PASSWORD) {
        return '请输入您的手机号码';
      }
    },
    md5Password() {
      return md5(this.password);
    },
    passwordStrength() {
      // var value = this.resetForm.newPassword;
      var value = this.resetFormPassword.formNewPassword;
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
    repeatedSuccessfully() {
      if (this.resetFormPassword.repeatedFormNewPassword === this.resetFormPassword.formNewPassword &&
        this.resetFormPassword.formNewPassword.length >= 8 && this.resetFormPassword.formNewPassword.length <= 16) {
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
      this.$refs['loginForm'].validate();
    },
    dynamicPassword() {
      this.loginType = DYNAMIC_PASSWORD;
      this.$refs['loginForm'].validate();
    },
    forgetPassword() {
      this.loginType = FORGET_PASSWORD;
    },
    toChangePassword() {
      this.loginType = TO_CHANGE_PASSWORD;
    },
    backHomepage() {
      this.loginType = BACK_HOMEPAGE;
      localStorage.removeItem('account');
      this.loginForm.remember = false;
      this.loginForm.account = '';
      this.loginForm.identifyingCode = '';
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
    sendCodes() {
      if (this.lockSendButton) {
        return;
      }
      this.lockSendButton = true;
      var verificationInfos = {
        'businessType': 5,
        'accountNumber': this.loginForm.account
      };
      sendVerificationCodes(verificationInfos).then(() => {
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
        } else if (error.code === 1) {
          this.$message({
            message: '您输入的手机号码不存在',
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
      sessionStorage.setItem('userId', this.userId);
      sessionStorage.setItem('accountNumber', this.accountNumber);
      sessionStorage.setItem('name', this.name);
      sessionStorage.setItem('userName', this.userName);
      // sessionStorage.setItem('identifyingCode', this.identifyingCode);
      sessionStorage.setItem('userType', this.userType);
      sessionStorage.setItem('orgName', this.orgName);
      sessionStorage.setItem('subjects', JSON.stringify(this.subjects));

      // 提醒控件 userId 已经更新（涉及到 stomp 连接的重新订阅）
      Bus.$emit(this.UPDATE_USER_ID);

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

          getLoginInfo(this.loginForm.account, this.loginForm.password, this.loginForm.identifyingCode).then((data) => {
            this.lockSubmitButton = false;
            this.token = data.loginToken;
            this.userId = data.user.userIdV1;
            this.accountNumber = data.user.accountNumber;
            this.userName = data.user.userName;
            this.name = data.user.name;
            // this.identifyingCode = data.user.identifyingCode;
            this.userType = data.user.userType;
            this.orgName = data.orgs && data.orgs[0] && data.orgs[0].orgName ? data.orgs[0].orgName : '';
            this.subjects = data.tasks ? data.tasks : [];

            setRequestToken(this.token);

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

            if (this.loginType === 3 && this.resetFormPassword.formNewPassword.length !== '' && this.resetFormPassword.repeatedFormNewPassword.length !== '') {
              this.toChangePassword();
            } else if (!this.mustResetPassword) {
              this.enterApp();
            }

          }, (error) => {
            this.lockSubmitButton = false;
            if (error.code === 21 && this.loginType === 1) {
              this.$message({
                message: '用户名或密码错误',
                type: 'warning',
                duration: 2000
              });
            } else if (error.code === 21 && this.loginType === 2) {
              this.$message({
                message: '手机号码或者验证码错误',
                type: 'warning',
                duration: 2000
              });
            } else if (error.code === 21 && this.loginType === 3) {
              this.$message({
                message: '手机号码或者验证码错误',
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
          resetPassword(this.resetForm.originalPassword, this.resetForm.newPassword, this.resetForm.verificationCode, this.resetForm.identifyingCode).then(() => {
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
    },
    submitResetFormPassword() {
      console.log('break');
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      this.$refs['resetFormPassword'].validate((valid) => {
        console.log(valid);
        // 校验字段之后，发送修改密码的请求，如果再返回正确，则跳转到系统
        if (valid) {

          resetPasswordByIdentifyingCode(this.resetFormPassword.formNewPassword).then(() => {
            this.$message({
              message: '已成功修改密码',
              type: 'success',
              duration: 2000
            });
            if (this.loginType === 4) {
              this.backHomepage();
            } else {
              this.enterApp();
            }
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
    // console.log(this.title);
    // 如果之前登录的时候勾选了“记住用户名”，则在浏览器中读取上次的用户名
    var account = localStorage.getItem('account');
    if (account !== null) {
      this.loginForm.account = account;
      this.loginForm.remember = true;
    } else {
      this.loginForm.account = '';
      this.loginForm.remember = false;
    }

    // 清除请求头里的 token 信息
    clearRequestToken();

    // 回到登陆界面时，清空 sessionStorage
    // sessionStorage.removeItem('token');
    // sessionStorage.removeItem('supportedDoctor');
    sessionStorage.clear();

    // 每次回到登录界面的时候，都要清空显示敏感信息的权限
    this.$store.commit('DISCARD_RIGHT_OF_DISPLAYING_SENSITIVE_INFO');

    // 清空导出权限
    this.$store.commit('CHANGE_EXPORT_RIGHT', false);

    // 取消之前登录产生的订阅
    Bus.$emit(this.UNSUBSCRIBE);
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
      // display: none;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
    }
    .tabs-wrapper {
      // display: none;
      position: relative;
      margin: 0 auto;
      padding: 0;
      width: @tab-width * 2  + @tab-horizontal-space;
      height: 25px;
      line-height: 25px;
      .tab {
        position: absolute;
        margin: 0;
        width: @tab-width + @tab-horizontal-space;
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
        width: @tab-width + @tab-horizontal-space;
        height: 2px;
        background-color: @button-color;
        transition: 0.2s;
      }
      .tab-place-0 {
        display: none;
      }
      .tab-place-1 {
        transform: translateX(-70px);
      }
      .tab-place-2 {
        transform: translateX(@tab-width*2 + @tab-horizontal-space);
      }
    }
    .input-wrapper {
      position: relative;
      margin: 20px auto;
      width: @input-width;
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
      .forget {
        float: right;
        margin-right: 8px;
        position: absolute;
        right: 0;
        top: -55px;
        border: none;
        color:#fff;
        &:hover {
          opacity: .6;
          background-color: #505b6b;
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
      .note {
        position: absolute;
        left: calc(~"110%");
        top: 12px;
        font-size: @normal-font-size;
        &.icon-ok {
          color: #00aa60;
        }
      }
    }
    .sign-up-text {
      line-height: 20px;
      text-align: center;
      color: #fff;
      font-size: @normal-font-size;
      transform: translateY(-10px);
      .link {
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.6;
        }
        &:active {
          opacity: 0.8;
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
