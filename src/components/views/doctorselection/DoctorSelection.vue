<template lang="html">
  <div class="doctor-selection">
    <div class="top-bar shadow">
      <h2 class="title">{{title}}</h2>
    </div>
    <div class="info-line">
      <span class="desc">技术支持授权医生：（每次只能同时为1位医生提供技术支持服务）</span>
      <span class="count">可选：{{doctorNumber}}人</span>
    </div>
    <div class="search-line">
      <div class="area shadow" :class="devideWidth">

      </div>
      <div class="search-input-wrapper shadow" :class="searchInputWrapperLeft">

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
    height: 80px;
    background-color: @background-color;
    text-align: center;
    .title {
      margin: 0;
      line-height: 80px;
      color: @button-color;
      font-size: 24px;
    }
  }
  .info-line {
    width: 100%;
    height: 40px;
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
    height: 60px;
    padding: 0 20px;
    box-sizing: content-box;
    text-align: left;
    .area {
      display: inline-block;
      margin: 0 @this-card-horizontal-margin;
      height: 50px;
      background-color: @background-color;
    }
    .search-input-wrapper {
      position: absolute;
      right: 25px;
      top: 0;
      height: 50px;
      background: @background-color;
      &.left-1-1, &.left-1-0 {
        left: calc(~"100% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-2 {
        left: calc(~"50% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-3 {
        left: calc(~"33.3333% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-4 {
        left: calc(~"25% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-5 {
        left: calc(~"20% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-6 {
        left: calc(~"16.6666% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-7 {
        left: calc(~"14.2857% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-8 {
        left: calc(~"12.5% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-9 {
        left: calc(~"11.1111% + @{this-card-horizontal-margin} * 2 + 2px");
      }
      &.left-1-10 {
        left: calc(~"10% + @{this-card-horizontal-margin} * 2 + 2px");
      }
    }
  }
  .card-wrapper {
    position: relative;
    padding: 0 20px;
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
