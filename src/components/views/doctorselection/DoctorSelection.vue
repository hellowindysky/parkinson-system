<template lang="html">
  <div class="doctor-selection">
    <div class="top-bar shadow">
      <h2 class="title">{{title}}</h2>
      <!-- <div class="fresh-button">
        <span class="iconfont icon-refresh"></span>
      </div> -->
      <el-button class="fresh-button" type="primary" :loading="refreshing" @click="refreshList">
        <span class="iconfont icon-refresh" v-show="!refreshing"></span>
        <span class="text">刷新</span>
      </el-button>
    </div>
    <div class="info-line">
      <span class="desc">技术支持授权医生：（每次只能同时为1位医生提供技术支持服务）</span>
      <span class="count">可选：{{doctorNumber}}人</span>
    </div>
    <div class="search-line">
      <div class="area shadow" :class="devideWidth">
        <span class="text">地区</span>
        <el-select v-model="district"></el-select>
      </div>
      <div class="search-input-wrapper shadow" :class="searchInputWrapperLeft">
        <span class="iconfont icon-search"></span>
        <el-input v-model="searchKeyword" placeholder="请输入医院名称、医生姓名、医生睿云账号或手机号码"></el-input>
        <span class="button">搜索</span>
      </div>
    </div>
    <div class="card-wrapper" ref="cardWrapper">
      <div class="card shadow" :class="devideWidth" v-for="i in [1,2,3,4,5,6,7,8,9,10,11,12,13]">

      </div>
    </div>
    <!-- <water-mark></water-mark> -->
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import waterMark from 'components/public/watermark/WaterMark';

export default {
  data() {
    return {
      district: '',
      searchKeyword: '',
      refreshing: false,
      devideWidth: '',
      searchInputWrapperLeft: ''
    };
  },
  computed: {
    title() {
      return '欢迎您，' + sessionStorage.getItem('name');
    },
    doctorNumber() {
      return 17;
    }
  },
  methods: {
    recalculateCardWidth() {
      var panelWidth = this.$refs.cardWrapper.clientWidth;
      panelWidth += 10 * 2;
      var devideNum = 1.0;
      // 10px 是卡片的横向间距，定义在了 varaibles.less 中，240px 是卡片的最小宽度
      while (panelWidth / devideNum > 240 + 10) {
        devideNum += 1.0;
      }
      devideNum -= 1;
      // 一排最多显示 10 个卡片
      devideNum = devideNum <= 10 ? devideNum : 10;
      this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      this.searchInputWrapperLeft = 'left-1-' + parseInt(devideNum, 10);
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
    refreshList() {
      this.refreshing = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 3000);
    }
  },
  mounted() {
    this.recalculateCardWidth();
    this.updateScrollbar();
  },
  components: {
    waterMark
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
    .fresh-button {
      position: absolute;
      width: 100px;
      height: 30px;
      top: 24px;
      right: 15px;
      padding-left: 30px;
      font-size: @large-font-size;
      border: none;
      background-color: rgba(0, 0, 0, 0);
      color: @font-color;
      cursor: pointer;
      .el-icon-loading {
        position: absolute;
        top: 8px;
        left: 10px;
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
  .info-line {
    width: 100%;
    height: @this-info-line-height;
    padding: 0 30px;
    text-align: left;
    line-height: 40px;
    font-size: @normal-font-size;
    .desc {
    }
    .count {
      position: absolute;
      right: 30px;
      color: @button-color;
      font-weight: bold;
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
        width: calc(~"100% - 120px");
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
        left: calc(~"100% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-2 {
        left: calc(~"50% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-3 {
        left: calc(~"33.3333% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-4 {
        left: calc(~"25% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-5 {
        left: calc(~"20% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-6 {
        left: calc(~"16.6666% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-7 {
        left: calc(~"14.2857% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-8 {
        left: calc(~"12.5% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-9 {
        left: calc(~"11.1111% + @{this-card-horizontal-margin} * 2 - 2px");
      }
      &.left-1-10 {
        left: calc(~"10% + @{this-card-horizontal-margin} * 2 - 2px");
      }
    }
  }
  .card-wrapper {
    position: relative;
    padding: 0 10px;
    height: calc(~"100% - @{this-top-bar-height} - @{this-info-line-height} - @{this-search-line-height}");
    text-align: left;
    overflow: hidden;
    .card {
      display: inline-block;
      margin: 3px @this-card-horizontal-margin;
      height: 130px;
      background-color: @background-color;
      .title {
        left: 20px;
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        &.first-line {
          left: 20px;
          top: 45px;
          right: 20px;
          color: @font-color;
        }
        &.second-line {
          left: 20px;
          top: 65px;
          right: 20px;
          line-height: 16px;
          color: @light-font-color;
          white-space: pre-wrap;
        }
        &.third-line {
          left: 20px;
          top: 100px;
          right: 20px;
          .third-line-content {
            color: @light-font-color;
            &.unarchived {
              color: @button-color;
            }
          }
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
  .width-1-1, &.width-1-0 {
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
