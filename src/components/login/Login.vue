<template>
  <div class='login'>
    <!-- <particles></particles> -->
    <div class="panel">
      <img class="logo" src="static/img/logo.png" alt="logo.png">
      <h1 class="title">睿云</h1>
      <h3 class="subtitle"></h3>
      <div class="tabs-wrapper">
        <span class="tab tab-place-1" :class="{'current-tab':loginType===1}" @click="accountLogin">账号登录</span>
        <span class="tab tab-place-2" :class="{'current-tab':loginType===2}" @click="">备用</span>
        <div class="tab-bottom-bar" :class="tabPlaceClass"></div>
      </div>
      <el-form class="input-wrapper" :model="loginForm" :rules="rules" ref="loginForm" label-width="0">
        <el-form-item prop="account">
          <el-input class="round-input" v-model="loginForm.account" auto-complete="off" :placeholder="holderText"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="round-input" v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入6-10位数字和字母的密码"></el-input>
        </el-form-item>
        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember" class="checkbox" label="记住用户名" name="type"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="submitForm">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="version-info">版本 V1.0</div>
  </div>
</template>

<script>
import md5 from 'md5';
// import axios from 'axios';

// import particles from 'components/particles/Particles';

const ACCOUNT_LOGIN = 1;

export default {
  name: 'login',
  data() {
    return {
      loginType: 1,
      loginForm: {
        account: '',
        password: '',
        remember: false
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '长度至少为 6 个字符', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
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
      // axios.post('http://apitest.gyenno.com/pdms/usermgr/userSignIn', {
      //   'accountNumber': '15012670416',
      //   'pwd': 'e10adc3949ba59abbe56e057f20f883e',
      //   'userType': 1
      // })
      // .then(function(response) {
      //   console.log(response);
      //   self.$router.push('/patients');
      // })
      // .catch(function(error) {
      //   console.log(error);
      // });

      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          // 一旦登录验证成功，就向服务器调取相应的数据，如字典项信息
          this.$store.dispatch('getWholeDictionary');

          // 暂时模拟一个延时登录效果
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  components: {
    // particles
  }
};
</script>

<style lang="less">
@import '~styles/variables.less';
@tab-width: 60px;
@tab-horizontal-space: 20px;
@input-width: 280px;
@input-height: 45px;

.login {
  width: 100vw;
  height: 100vh;
  background-color: @theme-color;
  .panel {
    position: absolute;
    left: 50%; top: 45%;
    width: 300px;
    height: 500px;
    transform: translate(-50%, -50%);
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
