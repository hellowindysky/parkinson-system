<template>
  <div class='login'>
    <particles></particles>
    <div class="panel">
      <h1 class="title">睿云</h1>
      <h3 class="subtitle">帕金森疾病病历管理系统</h3>
      <div class="tabs-wrapper">
        <span class="tab tab-place-1" :class="{'current-tab':loginType===ACCOUNT}" @click="accountLogin">账号登录</span>
        <span class="tab tab-place-2" :class="{'current-tab':loginType===TEL}" @click="telLogin">手机登录</span>
        <div class="tab-bottom-bar" :class="tabPlaceClass"></div>
      </div>
      <el-form class="input-wrapper" :model="loginForm" :rules="rules" ref="loginForm" label-width="0">
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" auto-complete="off" :placeholder="holderText"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入6-10位数字和字母的密码"></el-input>
        </el-form-item>
        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember" class="checkbox" label="记住用户名" name="type"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="submitForm">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5';
// import axios from 'axios';

import particles from 'components/particles/Particles';

const ACCOUNT_LOGIN = 1;
const TEL_LOGIN = 2;

export default {
  name: 'login',
  data() {
    return {
      loginType: ACCOUNT_LOGIN,
      ACCOUNT: ACCOUNT_LOGIN,
      TEL: TEL_LOGIN,
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
        return '请输入您的睿云账号';
      } else if (this.loginType === TEL_LOGIN) {
        return '请输入您的手机号码';
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
    telLogin() {
      this.loginType = TEL_LOGIN;
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
          // 暂时模拟一个延时登录效果
          setTimeout(() => {
            this.$router.push('/patients');
          }, 1000);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  components: {
    particles
  }
};
</script>

<style lang="less" scoped>
@import '~styles/variables.less';
@tab-width: 60px;
@tab-horizontal-space: 20px;

.panel {
  position: absolute;
  left: 50%; top: 45%;
  width: 300px;
  height: 400px;
  transform: translate(-50%, -50%);
  background-color: rgba(224,224,224,0);
  border-radius: 30px;
  z-index: 100;
  .title {
    margin: 10px auto;
    height: 40px;
    line-height: 40px;
    font-size: 34px;
    color: @theme-color;
  }
  .subtitle {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
  }
  .tabs-wrapper {
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
      color: #666;
      cursor: pointer;
      &:hover {
        color: @font-color;
      }
    }
    .current-tab {
      color: @theme-color;
      &:hover {
        color: @theme-color;
      }
    }
    .tab-bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: @tab-width;
      height: 2px;
      background-color: @theme-color;
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
    width: 250px;
    height: 130px;
    .checkbox {
      float: left;
    }
    .button {
      width: 100px;
    }
  }
}
</style>
