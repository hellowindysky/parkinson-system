<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// 引入关于 webSocket 连接所需要的对象
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

import Bus from 'utils/bus.js';
import { baseUrl } from 'api/common.js';

export default {
  name: 'app',
  data() {
    return {
      userId: '',
      StompClient: {},
      hasInitializedClientObj: false,
      subscriptionList: []
    };
  },
  methods: {
    connectCallback(frame) {
      console.log('连接成功');
      console.log('frame is: \n', frame);
      this.subscribe(this.userId);
    },
    errorCallback(error) {
      console.log(error);
    },
    subscribe(id) {
      let url = '/user/' + id + '/msg';
      // 进行订阅，同时将返回对象存到 subscriptionList 数组中，方便以后取消订阅
      var subscription = this.StompClient.subscribe(url, (response) => {
        console.log('已成功订阅');
        console.log('response is: \n' + response);
        let body = JSON.parse(response.body);
        if (body.operateType === 0) {
          Bus.$emit(this.AUTHORIZED_BY_DOCTOR);
        } else if (body.operateType === 1) {
          Bus.$emit(this.DEPRIVED_OF_AUTHORITY_BY_DOCTOR);
        }
      });
      this.subscriptionList.push(subscription);
    },
    disconnectStomp(callback) {
      this.StompClient.disconnect(() => {
        console.log('断开连接');
        callback && callback();
      });
    },
    initializeClientObj() {
      // 建立连接对象（还未发起连接）
      var socket = new SockJS(baseUrl + '/webSocketServer');
      // 获取 STOMP 子协议的客户端对象
      this.StompClient = Stomp.over(socket);
      this.StompClient.reconnectDelay = 5000;
      this.hasInitializedClientObj = true;
    }
  },
  mounted() {
    let userId = sessionStorage.getItem('userId');
    if (userId) {
      // 如果在根组件的 mounted 钩子里就已经存在 userId，说明用户刚刚刷新页面
      this.userId = userId;
      if (!this.hasInitializedClientObj) {
        this.initializeClientObj();
      }
      this.StompClient.connect({}, this.connectCallback, this.errorCallback);
    }

    // 如果 userId 还没有（一般情况是首次打开浏览器标签，并进入 login 页面）
    // 则等别的组件（目前就是 login 组件）通知，userId 到了就开始连接
    Bus.$on(this.UPDATE_USER_ID, () => {
      this.userId = sessionStorage.getItem('userId');
      if (!this.hasInitializedClientObj) {
        this.initializeClientObj();
      }
      // console.log(this.StompClient);
      if (this.StompClient.connected) {
        this.subscribe(this.userId);
      } else {
        this.StompClient.connect({}, this.connectCallback, this.errorCallback);
      }
    });

    Bus.$on(this.UNSUBSCRIBE, () => {
      // 取消之前的订阅（如果有的话），这种情况一般发生在用户回到 login 页面，也就是退出登录
      for (let subscription of this.subscriptionList) {
        subscription.unsubscribe();
      }
    });
  },
  beforeDestroy() {
    if (this.hasInitializedClientObj) {
      this.disconnectStomp();
    }
    Bus.$off(this.UPDATE_USER_ID);
  }
};
</script>

<style lang="less">
@import '~styles/variables.less';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @font-color;
  user-select: none;
  overflow: hidden;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  input[type='number'] {
    -moz-appearance: textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
