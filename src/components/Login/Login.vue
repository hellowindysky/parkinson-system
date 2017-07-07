<template>
  <div class='login'>
    <div id='particles'></div>
    <!-- <div class='iconfont icon-medicine'></div> -->
    <div class="panel">
      <h1 class="title">睿云</h1>
      <h3 class="subtitle">帕金森疾病病历管理系统</h3>
      <div class="tabs-wrapper">
        <span id="accountLogin" class="tab" :class="{'current-tab':loginType===0}" @click="accountLogin">账号登录</span>
        <span id="telLogin" class="tab" :class="{'current-tab':loginType===1}" @click="telLogin">手机登录</span>
      </div>
      <div id="tabBottomBar" class="tab-bottom-bar"></div>
      <div class="input-wrapper">
        <el-input class="input" v-model="account" placeholder="请输入您的睿云账号"></el-input>
        <el-input class="input" v-model="password" placeholder="请输入6-10位数字和字母的密码"></el-input>
        <el-checkbox class="checkbox" v-model="autoLogin">自动登录</el-checkbox>
        <span class="hint">使用账号登录</span>
      </div>
      <el-button class="button" type="primary">登 录</el-button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

const ACCOUT_LOGIN = 0;
const TEL_LOGIN = 1;

var tabBottomBar;
var accountOffsetLeft, telOffsetLeft;

export default {
  name: 'login',
  data() {
    return {
      loginType: ACCOUT_LOGIN,
      account: '',
      password: '',
      autoLogin: false
    };
  },
  mounted() {
    tabBottomBar = $('#tabBottomBar');
    accountOffsetLeft = $('#accountLogin').position().left;
    telOffsetLeft = $('#telLogin').position().left;
    tabBottomBar.css({'transform': `translate3d(${accountOffsetLeft}px,0,0)`});
    window.setTimeout(function() {
      tabBottomBar.css({'transition': '0.3s'});
    }, 0);
  },
  methods: {
    accountLogin() {
      this.loginType = ACCOUT_LOGIN;
      tabBottomBar.css({'transform': `translate3d(${accountOffsetLeft}px,0,0)`});
    },
    telLogin() {
      this.loginType = TEL_LOGIN;
      tabBottomBar.css({'transform': `translate3d(${telOffsetLeft}px,0,0)`});
    }
  }
};
</script>

<style lang="less" scoped>
@import '~styles/variables.less';
#particles {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
}
.panel {
  // position: relative;
  // margin: 100px auto;
  padding: 20px;
  width: 400px;
  height: 370px;
  position: absolute;
  left: 50%; top: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(224,224,224,0.3);
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
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    .tab {
      margin: auto 20px;
      padding: 2px;
      width: 50px;
      text-align: center;
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
  }
  .tab-bottom-bar {
    width: 60px;
    height: 2px;
    background-color: @theme-color;
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
    .hint {
      margin-top: 10px;
      float: right;
      font-size: 14px;
    }
  }
  .button {
    margin: 10px auto;
    width: 150px;
  }
}
</style>
