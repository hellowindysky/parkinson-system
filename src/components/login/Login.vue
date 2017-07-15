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
      <div class="input-wrapper">
        <el-input class="input" v-model="account" :placeholder="holderText"></el-input>
        <el-input class="input" v-model="password" placeholder="请输入6-10位数字和字母的密码"></el-input>
        <el-checkbox class="checkbox" v-model="autoLogin">自动登录</el-checkbox>
      </div>
      <el-button class="button" type="primary" @click="submit">登 录</el-button>
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
      account: '',
      password: '',
      autoLogin: false
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
    submit() {
      var self = this;
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

      // 暂时模拟一个登录效果
      setTimeout(function() {
        self.$router.push('/patients');
      }, 1000);
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
  // position: relative;
  padding: 20px;
  width: 400px;
  height: 370px;
  position: absolute;
  left: 50%; top: 40%;
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
    width: 300px;
    height: 130px;
    .input {
      margin-bottom: 10px;
    }
    .checkbox {
      margin-top: 10px;
      float: left;
    }
  }
  .button {
    margin: 10px auto;
    width: 150px;
  }
}
</style>
