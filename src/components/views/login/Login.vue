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
        <el-form-item prop="originalPassword">
          <el-input class="round-input" v-model="resetForm.originalPassword" type="password" auto-complete="new-password"
            placeholder="请输入当前密码" autofocus="autofocus"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input class="round-input" v-model="resetForm.newPassword" type="password" auto-complete="new-password"
            placeholder="请输入新密码(字母，数字或符号，8-16位)"></el-input>
        </el-form-item>
        <el-form-item prop="repeatedNewPassword">
          <el-input class="round-input" v-model="resetForm.resetNewPassword" type="password" auto-complete="new-password"
            placeholder="请再次输入新密码"></el-input>
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
import {getLoginInfo} from 'api/login';

// import particles from 'components/views/login/particles/Particles';

const ACCOUNT_LOGIN = 1;

export default {
  name: 'login',
  data() {
    return {
      loginType: 1,
      mustResetPassword: false,
      loginForm: {
        account: '',
        password: '',
        remember: false
      },
      resetForm: {
        originalPassword: '',
        newPassword: '',
        repeatedNewPassword: ''
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

        ],
        newPassword: [

        ],
        repeatedNewPassword: [

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
    }
  },
  methods: {
    accountLogin() {
      this.loginType = ACCOUNT_LOGIN;
    },
    submitForm() {
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
            var token = data.loginToken;
            var accountNumber = data.user.accountNumber;
            var name = data.user.name;
            var userName = data.user.userName;
            var userType = data.user.userType;
            var orgName = data.orgs && data.orgs[0] && data.orgs[0].orgName ? data.orgs[0].orgName : '';
            var subjects = data.tasks ? data.tasks : [];

            // 0 需要修改密码 1表示已经修改过密码
            var changePassword = data.user.changePassword;
            this.mustResetPassword = changePassword === 0;

            if (!this.mustResetPassword) {
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('accountNumber', accountNumber);
              sessionStorage.setItem('name', name);
              sessionStorage.setItem('userName', userName);
              sessionStorage.setItem('userType', userType);
              sessionStorage.setItem('orgName', orgName);
              sessionStorage.setItem('subjects', JSON.stringify(subjects));

              var commonRequest = {
                'userId': 93242,
                'accountNumber': accountNumber,
                'userType': userType,
                'orgId': 34,
                'orgType': 2
              };

              sessionStorage.setItem('commonRequest', JSON.stringify(commonRequest));

              // 登录时默认进入医院入口
              this.$store.commit('UPDATE_SUBJECT_ID', this.SUBJECT_ID_FOR_HOSPITAL);
              sessionStorage.setItem('UPDATE_SUBJECT_ID', this.SUBJECT_ID_FOR_HOSPITAL);

              // 重新记录操作时间点
              this.$store.commit('UPDATE_LAST_OPERATION_TIME');
              sessionStorage.setItem('lastOperationTime', this.$store.state.lastOperationTime);

              this.$router.push('/');
            }

          }, (error) => {
            if (error.code === 21) {
              this.$message({
                message: '用户名或密码错误',
                type: 'warning',
                duration: 2000
              });
            }
          });
        } else {
          console.log('input invalid');
          return;
        }
      });
    },
    submitResetForm() {

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
  min-height: 500px;
  min-width: @min-screen-width;
  .panel {
    position: absolute;
    left: 50%;
    top: 6%;
    width: 300px;
    height: 500px;
    transform: translate(-50%, 0);
    background-color: rgba(224,224,224,0);
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
      margin: 20px auto;
      width: @input-width;
      height: 130px;
      .round-input input {
        height: @input-height;
        border-radius: 50px;
        padding-left: 20px;
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
      .button {
        width: @input-width;
        height: @input-height;
        border-radius: 50px;
        background-color: @button-color;
        color: @button-font-color;
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
