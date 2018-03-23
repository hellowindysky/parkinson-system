<template lang="html">
  <div class="doctor-selection" @click="clickScreen">
    <div class="top-bar shadow">
      <h2 class="title">{{title}}</h2>
      <div class="quit" @click="reLogin">
        <span class="iconfont icon-quit"></span>
        退出
      </div>
    </div>
    <div class="info-line">
      <span class="desc">技术支持授权医生：
        <span class="count">{{doctorNumber}}人</span>
        （每次只能同时为1位医生提供技术支持服务）
      </span>
      <el-button class="fresh-button" type="primary" :loading="refreshing" @click="updateDoctorList">
        <span class="iconfont icon-refresh" v-show="!refreshing"></span>
        <span class="text">刷新</span>
      </el-button>
    </div>
    <div class="search-line">
      <div class="area shadow" :class="devideWidth">
        <span class="text">地区</span>
        <el-select v-model="district" :clearable="true" @change="searchDoctor">
          <el-option v-for="option in getOptions('homeProvince')" :label="option.typeName"
            :value="option.typeCode" :key="option.typeCode"></el-option>
        </el-select>
      </div>
      <div class="search-input-wrapper shadow" :class="searchInputWrapperLeft">
        <span class="iconfont icon-search"></span>
        <el-input v-model="searchKeyword" placeholder="请输入医院名称、医生姓名、医生睿云账号或手机号码"
          @change="searchWithDelay"></el-input>
        <!-- <span class="button" @click="searchDoctor">搜索</span> -->
      </div>
    </div>
    <div class="card-wrapper" ref="cardWrapper">
      <div class="card shadow" :class="devideWidth" v-for="doctor in doctorList" @click="clickDoctorCard(doctor)">
        <span class="text first-line">
          <span class="name">医生姓名</span>
          <span class="value">{{doctor.doctorName}}</span>
        </span>
        <span class="text second-line">
          <span class="name">医生账号</span>
          <span class="value">{{doctor.userName}}</span>
        </span>
        <span class="text third-line">
          <span class="name">所在医院</span>
          <span class="value">{{doctor.hospName}}</span>
        </span>
      </div>
    </div>
    <data-entry-detail class="statistics" :type="'dataEntryDetail'"></data-entry-detail>
    <water-mark></water-mark>
    <component :is="componentName"></component>
    <secret-agreement-modal></secret-agreement-modal>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { setRequestToken } from 'api/common.js';
import { getSupportMessage, getSupportedDoctorList } from 'api/user.js';
import Util from 'utils/util.js';

const dataEntryDetail = () => import(/* webpackChunkName: 'statistcs' */ 'views/statistics/data-entry-detail/DataEntryDetail');
const messageModal = () => import(/* webpackChunkName: 'modal' */ 'modal/message-modal/MessageModal');

import waterMark from 'public/water-mark/WaterMark';
import secretAgreementModal from 'modal/secret-agreement-modal/SecretAgreementModal';

export default {
  data() {
    return {
      dynamicArr: [],
      componentName: '',
      district: '',
      timeout: null,
      searchKeyword: '',
      refreshing: false,
      devideWidth: '',
      searchInputWrapperLeft: '',
      doctorList: []
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      return '欢迎您，' + sessionStorage.getItem('name');
    },
    doctorNumber() {
      return this.doctorList.length;
    }
  },
  methods: {
    recalculateCardWidth() {
      var panelWidth = this.$refs.cardWrapper.clientWidth;
      panelWidth += 10 * 2;
      var devideNum = 1.0;
      // 10px 是卡片的横向间距，定义在了 varaibles.less 中，260px 是卡片的最小宽度
      while (panelWidth / devideNum > 260 + 10) {
        devideNum += 1.0;
      }
      devideNum -= 1;
      // 一排最多显示 10 个卡片
      devideNum = devideNum <= 10 ? devideNum : 10;
      this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      this.searchInputWrapperLeft = 'left-1-' + parseInt(devideNum, 10);
    },
    getOptions(fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      // console.log(this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    reLogin() {
      this.$router.push({name: 'login'});
    },
    updateDoctorList(condition) {
      this.refreshing = true;
      getSupportedDoctorList(condition).then((data) => {
        this.doctorList = data ? data : [];
        this.refreshing = false;
        this.updateMessage();

      }, (error) => {
        this.refreshing = false;
        console.log(error);
      });

      // 最多 3 秒，然后将按钮状态还原，否则请求出错的话按钮会一直处于禁用状态
      setTimeout(() => {
        this.refreshing = false;
      }, 3000);
    },
    updateMessage() {
      getSupportMessage().then((data) => {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            (() => {
              let authorizationInfo = data[i];
              let operationType = authorizationInfo.operateType;  // 0 为授权，1 为解除授权
              let hospitalName = authorizationInfo.hospName ? authorizationInfo.hospName : '-';
              let doctorName = authorizationInfo.doctor ? authorizationInfo.doctor : '-';
              let userName = authorizationInfo.username ? authorizationInfo.username : '-';
              let date = authorizationInfo.date ? authorizationInfo.date : '-';
              let gender = authorizationInfo.sex ? authorizationInfo.sex : 0;

              var title = '';
              var type = '';
              var message = '';
              var thirdPerson = gender === 0 ? '他' : '她';

              if (operationType === 0) {
                title = '授权提醒';
                type = 'success';
                message = '【' + hospitalName + '】的 ' + doctorName + ' 医生（账号：' +
                  userName + '）在【' + date + '】成功授权你成为' + thirdPerson + '的技术支持专员';

              } else if (operationType === 1) {
                title = '解除授权通知';
                type = 'warning';
                message = '【' + hospitalName + '】的 ' + doctorName + ' 医生（账号：' +
                  userName + '）在【' + date + '】取消了对你的技术支持授权';
              }

              setTimeout(() => {
                this.$notify({
                  title: title,
                  message: message,
                  type: type,
                  duration: 6000
                });
              }, 2000 * i);
            })();
          }
        }

      }, (error) => {
        console.log(error);
      });
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.cardWrapper);
        Ps.initialize(this.$refs.cardWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    },
    searchWithDelay() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.searchDoctor();
      }, 300);
    },
    searchDoctor() {
      // 相当于带条件地刷新
      var condition = {};
      if (this.district) {
        condition.province = this.district;
      }
      if (this.searchKeyword) {
        condition.keyword = this.searchKeyword;
      }
      this.updateDoctorList(condition);
    },
    clickDoctorCard(doctor) {
      // 0表示不需要验证,1表示需要验证
      var verifyStatus = doctor.verifyStatus;

      if (verifyStatus === 0) {
        this.selectDoctor(doctor);

      } else if (verifyStatus === 1) {
        this.dynamicArr = [this.SHOW_MESSAGE_MODAL, 4, '提醒', '需要医生验证后才能为其提供技术支持', doctor.mobileNumber];
        this.componentName = 'messageModal';

        Bus.$off(this.PERMIT_SUPPORT_THE_DOCTOR);
        Bus.$on(this.PERMIT_SUPPORT_THE_DOCTOR, () => {
          this.selectDoctor(doctor);
        });
      }
    },
    selectDoctor(doctor) {
      var commonRequest = JSON.parse(sessionStorage.getItem('commonRequest'));
      commonRequest.supportNumber = doctor.mobileNumber;
      sessionStorage.setItem('commonRequest', JSON.stringify(commonRequest));

      sessionStorage.setItem('supportedDoctor', JSON.stringify(doctor));

      setTimeout(() => {
        this.$message({
          message: '已选择服务医生：' + doctor.doctorName,
          type: 'success',
          duration: 3000
        });
      }, 3000);
      this.$router.push('/');
    },
    clickScreen() {
      this.checkIfNoOperationForTooLong(this.$store.state.lastOperationTime);
    },
    checkIfNoOperationForTooLong(lastOperationTime) {
      this.$store.commit('UPDATE_LAST_OPERATION_TIME');
      var thisOperationTime = this.$store.state.lastOperationTime;

      // 如果本次点击的时间离上一次的点击时间间隔过长，则返回登录界面
      if (thisOperationTime - lastOperationTime > this.MAX_NO_OPERATION_TIME) {
        this.$message({
          message: '长时间未操作，请重新登录',
          type: 'warning',
          duration: 2000
        });
        this.$router.push('/login');
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.recalculateCardWidth();
    };
    this.updateScrollbar();
    this.updateDoctorList();
    this.recalculateCardWidth();
    this.$store.dispatch('getWholeDictionary');
    sessionStorage.removeItem('supportedDoctor');

    Bus.$on(this.AUTHORIZED_BY_DOCTOR, this.updateDoctorList);
    Bus.$on(this.DEPRIVED_OF_AUTHORITY_BY_DOCTOR, this.updateDoctorList);

    // 等待动态组件完成挂载
    Bus.$on(this.DYNAMIC_COMPONENT_MOUNTED, () => {
      Bus.$emit(this.dynamicArr[0], this.dynamicArr[1], this.dynamicArr[2], this.dynamicArr[3], this.dynamicArr[4]);
    });
    // 卸载动态组件
    Bus.$on(this.UNLOAD_DYNAMIC_COMPONENT, () => {
      this.componentName = '';
    });
  },
  beforeRouteEnter(to, from, next) {
    var userType = parseInt(sessionStorage.getItem('userType'), 10);
    var token = sessionStorage.getItem('token');
    if (userType === 5 && token) {
      setRequestToken(token);
      next();
    } else {
      next(from.path);
    }
  },
  beforeDestroy() {
    Bus.$off(this.PERMIT_SUPPORT_THE_DOCTOR);
    Bus.$off(this.AUTHORIZED_BY_DOCTOR);
    Bus.$off(this.DEPRIVED_OF_AUTHORITY_BY_DOCTOR);
  },
  components: {
    waterMark,
    messageModal,
    secretAgreementModal,
    dataEntryDetail
  }
};
</script>

<style lang="less">
@import '~styles/variables.less';

@this-card-horizontal-margin: 5px;
@this-top-bar-height: 80px;
@this-info-line-height: 40px;
@this-search-line-height: 60px;

.doctor-selection {
  width: 100vw;
  height: 100vh;
  background-color: @screen-color;
  position: relative;
  min-height: 666px;
  min-width: @min-screen-width;
  .shadow {
    box-shadow: 0px 0px 5px @light-gray-color;
  }
  .top-bar {
    width: 100%;
    height: @this-top-bar-height;
    background-color: @background-color;
    text-align: center;
    .title {
      margin: 0;
      line-height: 80px;
      color: @button-color;
      font-size: 24px;
    }
    .quit {
      display: inline-block;
      position: absolute;
      top: 20px;
      right: 3px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
      .iconfont {
        margin-right: 6px;
      }
    }
  }
  .statistics {
    position: absolute;
    width: auto;
    height: auto;
    top: @this-top-bar-height + 10px;
    bottom: 0;
    left: 15px;
    right: 15px;
    z-index: 100;
  }
  .info-line {
    position: relative;
    width: 100%;
    height: @this-info-line-height;
    padding: 0 30px;
    text-align: left;
    line-height: 40px;
    font-size: @normal-font-size;
    .desc {
    }
    .count {
      // color: @button-color;
      font-weight: bold;
    }
    .fresh-button {
      position: absolute;
      width: 100px;
      height: 30px;
      top: 5px;
      right: 55px;
      padding-left: 30px;
      font-size: @large-font-size;
      border: none;
      background-color: rgba(0, 0, 0, 0);
      color: @font-color;
      cursor: pointer;
      .el-icon-loading {
        position: absolute;
        top: 9px;
        left: 12px;
      }
      .iconfont {
        position: absolute;
        display: inline-block;
        top: 8px;
        left: 10px;
        font-size: 20px;
      }
      .text {
        position: absolute;
        display: inline-block;
        top: 9px;
        left: 40px;
      }
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }
  .search-line {
    position: relative;
    height: @this-search-line-height;
    padding: 0 10px;
    box-sizing: content-box;
    text-align: left;
    .area {
      display: inline-block;
      margin: 0 @this-card-horizontal-margin;
      padding: 10px 20px;
      height: 50px;
      box-sizing: border-box;
      font-size: @normal-font-size;
      background-color: @background-color;
      .text {
        display: inline-block;
        width: 50px;
        line-height: 30px;
      }
      .el-select {
        display: inline-block;
        width: calc(~"100% - 60px");
        .el-input__inner {
          height: 30px;
          border: none;
          background-color: @screen-color;
        }
      }
    }
    .search-input-wrapper {
      position: absolute;
      padding: 10px 20px;
      right: 15px;
      top: 0;
      height: 50px;
      margin-left: @this-card-horizontal-margin;
      box-sizing: border-box;
      background: @background-color;
      .iconfont {
        display: inline-block;
        margin-right: 5px;
        line-height: 30px;
        color: @gray-color;
      }
      .el-input {
        display: inline-block;
        // width: calc(~"100% - 120px");
        width: calc(~"100% - 40px");
        .el-input__inner {
          height: 30px;
          border: none;
          border-radius: 0;
          border-bottom: 1px solid @light-gray-color;
        }
      }
      .button {
        display: inline-block;
        position: absolute;
        right: 20px;
        top: 12px;
        width: @small-button-width;
        height: @small-button-height;
        line-height: @small-button-height;
        text-align: center;
        font-size: @normal-font-size;
        background-color: @light-font-color;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
      }
      &.left-1-1, &.left-1-0 {
        left: calc(~"100% + @{this-card-horizontal-margin}");
      }
      &.left-1-2 {
        left: calc(~"49.4% + @{this-card-horizontal-margin}");
      }
      &.left-1-3 {
        left: calc(~"33.1% + @{this-card-horizontal-margin}");
      }
      &.left-1-4 {
        left: calc(~"25% + @{this-card-horizontal-margin}");
      }
      &.left-1-5 {
        left: calc(~"20.08% + @{this-card-horizontal-margin}");
      }
      &.left-1-6 {
        left: calc(~"16.8% + @{this-card-horizontal-margin}");
      }
      &.left-1-7 {
        left: calc(~"14.48% + @{this-card-horizontal-margin}");
      }
      &.left-1-8 {
        left: calc(~"12.65% + @{this-card-horizontal-margin}");
      }
      &.left-1-9 {
        left: calc(~"11.3% + @{this-card-horizontal-margin}");
      }
      &.left-1-10 {
        left: calc(~"10.2% + @{this-card-horizontal-margin}");
      }
    }
  }
  .card-wrapper {
    position: relative;
    padding: 0 10px;
    height: calc(~"100% - @{this-top-bar-height} - @{this-info-line-height} - @{this-search-line-height}");
    box-sizing: content-box;
    text-align: left;
    overflow: hidden;
    .card {
      display: inline-block;
      position: relative;
      margin: 3px @this-card-horizontal-margin;
      height: 105px;
      background-color: @background-color;
      font-size: @normal-font-size;
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 5px @gray-color;
      }
      &:active {
        box-shadow: 0 0 5px @light-gray-color;
      }
      .text {
        display: inline-block;
        position: absolute;
        width: 100%;
        &.first-line {
          left: 20px;
          top: 15px;
        }
        &.second-line {
          left: 20px;
          top: 45px;
        }
        &.third-line {
          left: 20px;
          top: 75px;
        }
        .name {
          display: inline-block;
          position: absolute;
          left: 0;
          width: 70px;
        }
        .value {
          display: inline-block;
          position: absolute;
          left: 70px;
          right: 25px;
          color: @light-font-color;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
      padding: 0 3px;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s, padding 0.2s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.6;
        &:hover {
          padding: 0;
        }
      }
    }
  }
  .width-1-1, .width-1-0 {
    width: calc(~"100% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-2 {
    width: calc(~"50% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-3 {
    width: calc(~"33.3333% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-4 {
    width: calc(~"25% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-5 {
    width: calc(~"20% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-6 {
    width: calc(~"16.6666% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-7 {
    width: calc(~"14.2857% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-8 {
    width: calc(~"12.5% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-9 {
    width: calc(~"11.1111% - @{this-card-horizontal-margin} * 2");
  }
  .width-1-10 {
    width: calc(~"10% - @{this-card-horizontal-margin} * 2");
  }
}
</style>
