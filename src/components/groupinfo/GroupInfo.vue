<template lang="html">
  <div class="group-info">
    <div class="title-bar">
      <h3 class="title">
        <span v-show="titleMode === READING_MODE">{{groupName}}</span>
        <span v-show="titleMode === EDITING_MODE">
          <el-input class="title-input" v-model="groupName"></el-input>
        </span>
        <span class="iconfont icon-edit" @click="toggleTitleMode"></span>
        <span class="iconfont icon-explain" :class="{'on': descPanelDisplay}" @click="toggleDescPanelDisplay"></span>
      </h3>
      <div class="button button-operate">批量操作</div>
      <div class="button button-add">添加患者</div>
    </div>
    <!-- <div class="seperate-bar"></div> -->
    <div class="card-wrapper" ref="cardWrapper">
      <div class="card" :class="devideWidth" v-for="patient in groupPatients" :title="patient.name" v-on:clickCurrentCard="seeDetail(patient)">
        <img class="image" src="~img/profile.png" alt="">
        <div class="text first-line">
          <span class="name">{{patient.ptname}}</span>
          <span class="iconfont" :class="getGenderIcon(patient.sex)"></span>
        </div>
        <div class="text second-line">
          <span>年龄</span>
          <span class="age">{{patient.age}}</span>
          <span class="date">{{patient.date}}</span>
        </div>
      </div>
    </div>
    <div class="group-description" v-show="descPanelDisplay">
      <p class="description-content" v-show="descriptionMode===READING_MODE">{{remarks}}</p>
      <el-input type="textarea" v-model="remarks" v-show="descriptionMode===EDITING_MODE" :rows="8"></el-input>
      <div class="button-wrapper">
        <div class="button cancel-button" v-show="descriptionMode===EDITING_MODE" @click="cancelDescInput">取消</div>
        <div class="button submit-button" v-show="descriptionMode===EDITING_MODE" @click="submitDescInput">确定</div>
        <div class="button edit-button" v-show="descriptionMode===READING_MODE" @click="editDesc">编辑</div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import { getGroupPatients } from 'api/group.js';

export default {
  data() {
    return {
      devideWidth: '',
      groupName: '',
      titleMode: this.READING_MODE,
      descPanelDisplay: false,
      descriptionMode: this.READING_MODE,
      groupPatients: [],
      remarks: ''
    };
  },
  methods: {
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.cardWrapper.clientWidth;
        var cardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (cardNum + 1) > 200 + 20 && cardNum < 10) {
          cardNum += 1.0;
        }
        this.devideWidth = 'width-1-' + parseInt(cardNum, 10);
      });
    },
    seeDetail(item) {
      console.log(item);
    },
    updateGroupInfo() {
      getGroupPatients(this.$route.params.id).then((data) => {
        this.groupName = data.groupName;
        this.groupPatients = data.list;
        this.remarks = data.remarks;
        // console.log(data);
      }, (error) => {
        console.log(error);
      });
    },
    getGenderIcon(num) {
      num = parseInt(num, 10);
      if (num === 0) {
        return 'icon-male';
      } else if (num === 1) {
        return 'icon-female';
      }
    },
    toggleTitleMode() {
      if (this.titleMode === this.EDITING_MODE) {
        this.titleMode = this.READING_MODE;
      } else if (this.titleMode === this.READING_MODE) {
        this.titleMode = this.EDITING_MODE;
      }
    },
    toggleDescPanelDisplay() {
      this.descPanelDisplay = !this.descPanelDisplay;
    },
    editDesc() {
      this.descriptionMode = this.EDITING_MODE;
    },
    cancelDescInput() {
      this.descriptionMode = this.READING_MODE;
    },
    submitDescInput() {
      this.descriptionMode = this.READING_MODE;
    }
  },
  mounted() {
    // 如果收到 [确认对话框] 发过来的 “取消” 事件，则解除 “确认” 事件的回调函数
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });
    // 如果收到屏幕宽度变化，或者内容区域宽度变化的事件，则重新计算卡片的宽度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();
    this.updateGroupInfo();
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@margin-right: 15px;
@bar-height: 40px;
@this-card-horizontal-margin: 5px;

.group-info {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .title-bar {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @bar-height;
    background-color: @background-color;
    box-shadow: 0 10px 10px @screen-color;
    .title {
      position: absolute;
      left: 20px;
      height: 100%;
      margin: 0;
      line-height: 40px;
      text-align: left;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      color: @font-color;
      .iconfont {
        display: inline-block;
        margin-left: 10px;
        &.icon-edit {
          color: @light-font-color;
        }
        &.icon-explain {
          margin-left: 20px;
          color: @inverse-font-color;
        }
        &:hover {
          color: @font-color;
        }
        &:active {
          opacity: 0.8;
        }
        &.on {
          color: @font-color;
        }
      }
      .title-input {
        display: inline-block;
        width: 150px;
        .el-input__inner {
          width: 100%;
          height: 30px;
          line-height: 30px;
          background-color: @screen-color;
          border: none;
        }
      }
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      cursor: pointer;
      background-color: @button-color;
      right: 10px;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.button-operate {
        right: 30px + @small-button-width;
        background-color: @light-font-color;
      }
      &.button-add {
        right: 10px;
        background-color: @button-color;
      }
    }
  }
  // .seperate-bar {
  //   height: 3px;
  //   width: calc(~"100% - @{margin-right}");
  // }
  .card-wrapper {
    text-align: left;
    margin-left: -5px;
    margin-bottom: 5px;
    margin-right: @margin-right - 5px;
    .card {
      display: inline-block;
      position: relative;
      margin: 3px @this-card-horizontal-margin;
      height: 110px;
      background-color: @background-color;
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{this-card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{this-card-horizontal-margin} * 2");
      }
      .title {
        left: 20px;
      }
      .image {
        position: absolute;
        width: 35px;
        left: 20px;
        top: 10px;
      }
      .text {
        position: absolute;
        &.first-line {
          left: 20px;
          top: 55px;
          right: 20px;
          font-size: @large-font-size;
          color: @font-color;
          .iconfont {
            position: static;
            margin-left: 15px;
            font-size: @normal-font-size;
            &.icon-male {
              color: @male-color;
            }
            &.icon-female {
              color: @female-color;
            }
          }
        }
        &.second-line {
          font-size: @small-font-size;
          left: 20px;
          top: 85px;
          right: 20px;
          color: @light-font-color;
          .age {
            margin-left: 5px;
          }
          .date {
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }
  .group-description {
    position: absolute;
    top: @bar-height;
    left: 0;
    width: 400px;
    height: 250px;
    background-color: @theme-color;
    z-index: 100;
    .description-content {
      position: absolute;
      width: 360px;
      left: 20px;
      box-sizing: border-box;
      padding: 5px;
      // background-color: @font-color;
      color: #fff;
      text-align: left;
    }
    .el-textarea {
      position: absolute;
      width: 360px;
      left: 20px;
      top: 15px;
      .el-textarea__inner {
        background-color: @font-color;
        color: #fff;
      }
    }
    .button-wrapper {
      position: absolute;
      bottom: 10px;
      width: 100%;
      text-align: center;
      .button {
        display: inline-block;
        width: @small-button-width;
        height: @small-button-height;
        line-height: @small-button-height;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
        &.cancel-button {
          background-color: @secondary-button-color;
        }
        &.submit-button {
          margin-left: 30px;
          background-color: @button-color;
        }
        &.edit-button {
          background-color: @button-color;
        }
      }
    }
  }
}
</style>
