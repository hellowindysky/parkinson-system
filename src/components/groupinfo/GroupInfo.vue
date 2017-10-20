<template lang="html">
  <div class="group-info">
    <div class="title-bar">
      <h3 class="title">
        <span v-show="titleMode === READING_MODE">{{groupName}}</span>
        <span v-show="titleMode === EDITING_MODE">
          <el-input class="title-input" v-model="copyGroupName"></el-input>
        </span>
        <span class="iconfont icon-edit" v-show="mode===READING_MODE && titleMode===READING_MODE" @click="editTitle"></span>
        <span class="iconfont icon-cancel" v-show="mode===READING_MODE && titleMode===EDITING_MODE" @click="cancelEditingTitle"></span>
        <span class="iconfont icon-ok" v-show="mode===READING_MODE && titleMode===EDITING_MODE" @click="submitEditedTitle"></span>
        <span class="iconfont icon-explain" v-show="mode===READING_MODE" :class="{'on': descPanelDisplay}"
          @click="toggleDescPanelDisplay"></span>
      </h3>
      <div class="button button-operate" v-show="mode===READING_MODE" @click="switchMode(REMOVING_MODE)">移出患者</div>
      <div class="button button-add" v-show="mode===READING_MODE" @click="switchMode(ADDING_MODE)">添加患者</div>
      <div class="button button-return" v-show="mode!==READING_MODE" @click="switchMode(READING_MODE)">返回</div>
    </div>
    <!-- <div class="seperate-bar"></div> -->
    <div class="card-wrapper" ref="cardWrapper">
      <div v-show="mode!==ADDING_MODE" class="card" :class="devideWidth" v-for="(patient, i) in groupPatients" :title="patient.name" v-on:clickCurrentCard="seeDetail(patient)">
        <img class="image" src="~img/profile.png" alt="">
        <el-checkbox class="select" v-model="groupPatientsSelectedList[i]" v-show="mode===REMOVING_MODE"></el-checkbox>
        <div class="text first-line">
          <span class="name">{{patient.name}}</span>
          <span class="iconfont" :class="getGenderIcon(patient.sex)"></span>
        </div>
        <div class="text second-line">
          <span>年龄</span>
          <span class="age">{{patient.age}}</span>
          <span class="date">{{patient.createDate}}</span>
        </div>
      </div>

      <div v-show="mode===ADDING_MODE" class="card" :class="devideWidth" v-for="(patient, i) in nonGroupPatients" :title="patient.name" v-on:clickCurrentCard="seeDetail(patient)">
        <img class="image" src="~img/profile.png" alt="">
        <el-checkbox class="select" v-show="mode===ADDING_MODE" v-model="nonGroupPatientsSelectedList[i]"></el-checkbox>
        <div class="text first-line">
          <span class="name">{{patient.name}}</span>
          <span class="iconfont" :class="getGenderIcon(patient.sex)"></span>
        </div>
        <div class="text second-line">
          <span>年龄</span>
          <span class="age">{{patient.age}}</span>
          <span class="date">{{patient.createDate}}</span>
        </div>
      </div>
    </div>
    <div class="operate-bar" v-show="mode!==READING_MODE">
      <el-checkbox class="select-all" v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
      <div class="button remove-button" v-show="mode===REMOVING_MODE" @click="removeMembers">移出分组</div>
      <div class="button add-button" v-show="mode===ADDING_MODE" @click="addMembers">加入分组</div>
    </div>
    <div class="group-description" v-show="descPanelDisplay">
      <div class="iconfont icon-close" @click="closeDescPanel"></div>
      <p class="description-content" v-show="descriptionMode===READING_MODE">{{remarks}}</p>
      <el-input type="textarea" v-model="copyRemarks" v-show="descriptionMode===EDITING_MODE" :rows="8"></el-input>
      <div class="button-wrapper">
        <div class="button cancel-button" v-show="descriptionMode===EDITING_MODE" @click="cancelDescInput">取消</div>
        <div class="button submit-button" v-show="descriptionMode===EDITING_MODE" @click="submitDescInput">确定</div>
        <div class="button edit-button" v-show="descriptionMode===READING_MODE" @click="editDesc">编辑</div>
      </div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { getGroupInfo, modifyGroupInfo, getGroupMembers, addGroupMembers, removeGroupMembers } from 'api/group.js';

export default {
  data() {
    return {
      devideWidth: '',
      mode: this.READING_MODE,
      ADDING_MODE: 'addingMode',
      REMOVING_MODE: 'removingMode',
      groupName: '',
      copyGroupName: '',
      titleMode: this.READING_MODE,
      remarks: '',
      copyRemarks: '',
      descPanelDisplay: false,
      descriptionMode: this.READING_MODE,
      groupPatients: [],
      groupPatientsSelectedList: [],
      nonGroupPatients: [],
      nonGroupPatientsSelectedList: [],
      selectAll: false
    };
  },
  computed: {
    groupId() {
      return this.$route.params.id;
    }
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
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.cardWrapper);
        Ps.initialize(this.$refs.cardWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    seeDetail(item) {
      console.log(item);
    },
    updateGroupInfo(cb) {
      let groupInfo = {
        'groupId': this.groupId
      };
      getGroupInfo(groupInfo).then((data) => {
        this.groupName = data.groupName;
        this.copyGroupName = this.groupName;
        this.remarks = data.remarks;
        this.copyRemarks = this.remarks;
        cb && cb();
      }, (error) => {
        console.log(error);
      });
    },
    updateGroupMembers(cb) {
      let groupCondition = {
        'patientGroupId': this.groupId,
        'includeType': 1  // 1代表组内，2代表非组内
      };
      getGroupMembers(groupCondition).then((data) => {
        this.groupPatients = data;
        let length = this.groupPatients.length;
        this.groupPatientsSelectedList = [];
        for (var i = 0; i < length; i++) {
          this.$set(this.groupPatientsSelectedList, i, false);
        }
        this.updateScrollbar();
        cb && cb();
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
    switchMode(mode) {
      this.cancelEditingTitle();
      this.closeDescPanel();
      if (mode === this.ADDING_MODE) {
        this.nonGroupPatientsSelectedList = [];
        this.mode = mode;
        let groupCondition = {
          'patientGroupId': this.groupId,
          'includeType': 2  // 1代表组内，2代表非组内
        };
        getGroupMembers(groupCondition).then((data) => {
          this.nonGroupPatients = data;
          let length = this.nonGroupPatients.length;
          for (var i = 0; i < length; i++) {
            this.$set(this.nonGroupPatientsSelectedList, i, false);
          }
        });
      } else if (mode === this.REMOVING_MODE) {
        for (var i = 0; i < this.groupPatientsSelectedList.length; i++) {
          this.groupPatientsSelectedList[i] = false;
        }
        this.mode = mode;
      } else {
        // 返回到阅读状态时，将“全部选中”置为 false
        this.selectAll = false;
        this.mode = mode;
      }
    },
    editTitle() {
      this.titleMode = this.EDITING_MODE;
    },
    cancelEditingTitle() {
      this.copyGroupName = this.groupName;
      this.titleMode = this.READING_MODE;
    },
    submitEditedTitle() {
      var groupInfo = {
        'groupId': this.groupId,
        'groupeName': this.copyGroupName
      };
      modifyGroupInfo(groupInfo).then(() => {
        this.updateGroupInfo(() => {
          this.titleMode = this.READING_MODE;
          Bus.$emit(this.UPDATE_GROUP_LIST);
        });
      });
    },
    toggleDescPanelDisplay() {
      this.descPanelDisplay = !this.descPanelDisplay;
    },
    closeDescPanel() {
      this.cancelDescInput();
      this.descPanelDisplay = false;
    },
    editDesc() {
      this.descriptionMode = this.EDITING_MODE;
    },
    cancelDescInput() {
      this.copyRemarks = this.remarks;
      this.descriptionMode = this.READING_MODE;
    },
    submitDescInput() {
      var groupInfo = {
        'groupId': this.groupId,
        'remarks': this.copyRemarks
      };
      modifyGroupInfo(groupInfo).then(() => {
        this.updateGroupInfo(() => {
          this.descriptionMode = this.READING_MODE;
        });
      });
    },
    toggleSelectAll() {
      var value = this.selectAll;
      if (this.mode === this.ADDING_MODE) {
        for (let i = 0; i < this.nonGroupPatientsSelectedList.length; i++) {
          this.$set(this.nonGroupPatientsSelectedList, i, value);
        }
      } else if (this.mode === this.REMOVING_MODE) {
        for (let i = 0; i < this.groupPatientsSelectedList.length; i++) {
          this.$set(this.groupPatientsSelectedList, i, value);
        }
      }
    },
    addMembers() {
      var memberList = [];
      for (var i = 0; i < this.nonGroupPatients.length; i++) {
        if (this.nonGroupPatientsSelectedList[i]) {
          memberList.push(this.nonGroupPatients[i].patientId);
        }
      }
      addGroupMembers(this.groupId, memberList).then(() => {
        this.updateGroupMembers();
        this.switchMode(this.READING_MODE);
        Bus.$emit(this.UPDATE_GROUP_LIST);
      }, (error) => {
        console.log(error);
      });
    },
    removeMembers() {
      var memberList = [];
      for (var i = 0; i < this.groupPatients.length; i++) {
        if (this.groupPatientsSelectedList[i]) {
          memberList.push(this.groupPatients[i].patientId);
        }
      }
      removeGroupMembers(this.groupId, memberList).then(() => {
        this.updateGroupMembers();
        this.switchMode(this.READING_MODE);
        Bus.$emit(this.UPDATE_GROUP_LIST);
      }, (error) => {
        console.log(error);
      });
    }
  },
  mounted() {
    // 如果收到 [确认对话框] 发过来的 “取消” 事件，则解除 “确认” 事件的回调函数
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });
    // 如果收到屏幕宽度变化，或者内容区域宽度变化的事件，则重新计算卡片的宽度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();
    this.updateGroupInfo();
    this.updateGroupMembers();
    this.updateScrollbar();
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE);
    Bus.$off(this.TOGGLE_LIST_DISPLAY);
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
        cursor: pointer;
        &.icon-edit {
          color: @light-font-color;
        }
        &.icon-cancel {
          color: @inverse-font-color;
        }
        &.icon-ok {
          color: @button-color;
          &:hover {
            color: @button-color;
            opacity: 0.8;
          }
        }
        &:hover {
          color: @font-color;
        }
        &:active {
          opacity: 0.8;
        }
        &.icon-explain {
          margin-left: 20px;
          color: @inverse-font-color;
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
      &.button-return {
        right: 10px;
        background-color: @secondary-button-color;
      }
    }
  }
  // .seperate-bar {
  //   height: 3px;
  //   width: calc(~"100% - @{margin-right}");
  // }
  .card-wrapper {
    position: relative;
    text-align: left;
    margin-left: -5px;
    // margin-bottom: 5px;
    padding-right: @margin-right - 5px;
    height: calc(~"100% - @{bar-height} - @{vertical-spacing}");
    overflow: hidden;
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
      .select {
        position: absolute;
        right: 10px;
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
  .operate-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: @margin-right;
    height: 45px;
    background-color: @background-color;
    text-align: left;
    box-shadow: 0 -1px 10px @light-gray-color;
    z-index: 100;
    .select-all {
      margin-left: 25px;
      line-height: 45px;
    }
    .button {
      position: absolute;
      right: 10px;
      top: 8px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      text-align: center;
      color: #fff;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
      &.remove-button {
        background-color: @secondary-button-color;
      }
      &.add-button {
        background-color: @button-color;
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
    .icon-close {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 22px;
      color: #fff;
      cursor: pointer;
      z-index: 200;
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
    }
    .description-content {
      position: absolute;
      width: 350px;
      left: 25px;
      top: 5px;
      box-sizing: border-box;
      padding: 5px;
      // background-color: @font-color;
      color: #fff;
      text-align: left;
    }
    .el-textarea {
      position: absolute;
      width: 350px;
      left: 25px;
      top: 20px;
      .el-textarea__inner {
        background-color: @font-color;
        color: #fff;
        border: none;
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
