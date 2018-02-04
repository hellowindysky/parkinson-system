<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';

export default {
  name: 'app',
  data() {
    return {
      userId: ''
    };
  },
  methods: {
    connectCallback(frame) {
      console.log('连接成功');
      console.log('frame is: \n', frame);
      this.subscribe();
    },
    errorCallback(error) {
      console.log(error);
    },
    subscribe() {
      let url = '/user/' + this.userId + '/msg';
      this.StompClient.subscribe(url, (response) => {
        console.log('已成功订阅');
        console.log('response is: \n' + response);
        let body = JSON.parse(response.body);
        if (body.operateType === 0) {
          Bus.$emit(this.AUTHORIZED_BY_DOCTOR);
        } else if (body.operateType === 1) {
          Bus.$emit(this.DEPRIVED_OF_AUTHORITY_BY_DOCTOR);
        }
      });
    },
    disconnectStomp(callback) {
      // 先取消订阅，再断开连接
      this.StompClient.unsubscribe();
      this.StompClient.disconnect(() => {
        console.log('断开连接');
        callback && callback();
      });
    },
    reconnectStomp() {
      // 先断开之前的 stomp 连接（如果有的话）
      this.disconnectStomp(() => {
        this.StompClient.connect({}, this.connectCallback, this.errorCallback);
      });
    }
  },
  mounted() {
    let userId = sessionStorage.getItem('userId');
    if (userId) {
      this.userId = userId;
      this.StompClient.connect({}, this.connectCallback, this.errorCallback);
    }

    // 如果 userId 还没有，则等别的组件通知，userId 到了就开始连接
    Bus.$on(this.UPDATE_USER_ID, () => {
      this.userId = sessionStorage.getItem('userId');
      this.reconnectStomp();
    });
  },
  beforeDestroy() {
    this.disconnectStomp();
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
