<template lang="html">
  <div class="list">
    <div class="top-area">
      <div class="num-info">{{totalNumText}}</div>
      <div class="filter-button" @click="togglePanelDisplay" :class="{'active': panelDisplay}">
        筛选条件
        <span class="iconfont icon-moreunfold"></span>
      </div>
    </div>
    <div class="search-area">
      <el-input class="search-input" size="small" placeholder="请输入姓名或身份证号" icon="search" v-model="searchInput" :on-icon-click="clickSearchIcon"></el-input>
    </div>

    <div class="list-area" v-if="this.listType === 'patients'">
      <patientListItem></patientListItem>
      <patientListItem></patientListItem>
    </div>
    <div class="list-area" v-else-if="this.listType === 'groups'">
      <groupListItem></groupListItem>
      <groupListItem></groupListItem>
      <groupListItem></groupListItem>
    </div>

    <transition name="slide-fade">
      <div class="filter-panel" v-show="panelDisplay" v-if="this.listType === 'patients'">
        <div class="filter-condition">
          <span class="name">分组:</span>
          <el-dropdown class="selection" @command="handleGroupCommand" trigger="click">
            <el-button type="primary" class="button">
              {{filterPatientsOptions.group}}
              <i class="el-icon-caret-bottom el-icon--right icon"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="dropdown">
              <el-dropdown-item command="不限">不限</el-dropdown-item>
              <el-dropdown-item command="FOG2组">FOG2组</el-dropdown-item>
              <el-dropdown-item command="帕金森1组">帕金森1组</el-dropdown-item>
              <el-dropdown-item command="帕金森2组">帕金森2组</el-dropdown-item>
              <el-dropdown-item command="一个名字超长的组，很长很长很长很长。。。。">一个名字超长的组，很长很长很长很长。。。。</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="filter-condition">
          <span class="name">性别:</span>
          <el-dropdown class="selection" @command="handleGenderCommand" trigger="click">
            <el-button type="primary" class="button">
              {{filterPatientsOptions.gender}}
              <i class="el-icon-caret-bottom el-icon--right icon"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="dropdown">
              <el-dropdown-item command="不限">不限</el-dropdown-item>
              <el-dropdown-item command="男">男</el-dropdown-item>
              <el-dropdown-item command="女">女</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="filter-condition">
          <span class="name">地区:</span>
          <el-dropdown class="selection" @command="handleDistrictCommand" trigger="click">
            <el-button type="primary" class="button">
              {{filterPatientsOptions.district}}
              <i class="el-icon-caret-bottom el-icon--right icon"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="dropdown">
              <el-dropdown-item command="不限">不限</el-dropdown-item>
              <el-dropdown-item command="北京">北京</el-dropdown-item>
              <el-dropdown-item command="天津">天津</el-dropdown-item>
              <el-dropdown-item command="上海">上海</el-dropdown-item>
              <el-dropdown-item command="深圳">深圳</el-dropdown-item>
              <el-dropdown-item command="广州">广州</el-dropdown-item>
              <el-dropdown-item command="武汉">武汉</el-dropdown-item>
              <el-dropdown-item command="杭州">杭州</el-dropdown-item>
              <el-dropdown-item command="成都">成都</el-dropdown-item>
              <el-dropdown-item command="重庆">重庆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="filter-condition">
          <span class="name">年龄:</span>
          <el-input class="input min" v-model="filterPatientsOptions.minAge" size="small" placeholder="不限"></el-input>
          <span class="text first-unit">岁</span>
          <span class="text dash">~</span>
          <el-input class="input max" v-model="filterPatientsOptions.maxAge" size="small" placeholder="不限"></el-input>
          <span class="text second-unit">岁</span>
        </div>
        <div class="filter-condition">
          <span class="name">随诊:</span>
          <el-checkbox class="checkbox" v-model="filterPatientsOptions.followUp">随诊中</el-checkbox>
        </div>
      </div>
      <div class="filter-panel" v-show="panelDisplay" v-else-if="this.listType === 'group'">

      </div>
    </transition>
  </div>
</template>

<script>
import patientListItem from 'components/patientitem/PatientItem';
import groupListItem from 'components/groupitem/GroupItem';

export default {
  data() {
    return {
      searchInput: '',
      panelDisplay: false,
      filterPatientsOptions: {
        group: '不限',
        gender: '不限',
        district: '不限',
        minAge: '',
        maxAge: '',
        followUp: false
      }
    };
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断列表类型
    listType() {
      var path = this.$route.path;
      if (path.match(/^\/patients\/list/)) {
        return 'patients';
      } else if (path.match(/^\/patients\/groups/)) {
        return 'groups';
      } else if (path.match(/^\/patients\/otherlist/)) {
        return 'patients';
      }
    },
    totalNumText() {
      if (this.listType === 'patients') {
        return '患者：345人';
      } else if (this.listType === 'groups') {
        return '分组：19个';
      }
    }
  },
  methods: {
    clickSearchIcon(event) {
      console.log(event);
    },
    togglePanelDisplay() {
      this.panelDisplay = !this.panelDisplay;
    },
    handleGroupCommand(command) {
      this.filterPatientsOptions.group = command;
    },
    handleGenderCommand(command) {
      this.filterPatientsOptions.gender = command;
    },
    handleDistrictCommand(command) {
      this.filterPatientsOptions.district = command;
    }
  },
  components: {
    patientListItem,
    groupListItem
  },
  watch: {
    // 路由一旦发生变化，就关闭筛选面板
    $route() {
      this.panelDisplay = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@top-area-height: 40px;
@filter-text-height: 30px;

.list {
  box-sizing: border-box;
  background-color: #999;
  .top-area {
    position: relative;
    width: 100%;
    height: @top-area-height;
    background-color: #ddd;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    font-size: @normal-font-size;
    text-align: left;
    .num-info {
      position: absolute;
      display: inline-block;
      left: 0;
      width: 50%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      line-height: @top-area-height;
      cursor: default;
    }
    .filter-button {
      position: absolute;
      display: inline-block;
      left: 50%;
      width: 50%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      line-height: @top-area-height;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.active {
        background-color: #aaa;
      }
      .iconfont {
        padding-left: 20px;
        font-size: @large-font-size;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
  .search-area {
    position: relative;
    width: 100%;
    height: 36px;
    padding: 3px 5px;
    box-sizing: border-box;
    background-color: #aaa;
    .search-input {
      // width: calc(~"100% - 20px");
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0.42,0,1,1);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(200px);
    opacity: 0;
  }
  .filter-panel {
    position: absolute;
    top: @top-area-height;
    width: 100%;
    height: calc(~"100% - @{top-area-height}");
    padding-top: 10px;
    background-color: rgba(32,32,32,0.9);
    font-size: @normal-font-size;
    z-index: 150;
    .filter-condition {
      position: relative;
      height: 42px;
      padding: 6px;
      width: 100%;
      box-sizing: border-box;
      .name {
        position: absolute;
        left: 0;
        width: 20%;
        height: 100%;
        line-height: @filter-text-height;
        color: #fff;
      }
      .selection {
        position: absolute;
        left: 20%;
        width: 75%;
        height: @filter-text-height;
        box-sizing: border-box;
        .button {
          position: relative;
          width: 100%;
          height: @filter-text-height;
          box-sizing: border-box;
          text-align: left;
          line-height: 0;   // 加上这一行，按钮内的文字高度才正常
          .icon {
            position: absolute;
            top: 8px;
            right: 10px;
          }
        }
        .dropdown {
          width: 100%;
          max-height: 200px;
        }
      }
      .text {
        position: absolute;
        line-height: @filter-text-height;
        color: #fff;
      }
      .first-unit {
        left: 43%;
      }
      .second-unit {
        left: 88%;
      }
      .dash {
        left: 55%;
      }
      .input {
        display: inline-block;
        position: absolute;
        width: 50px;
        height: @filter-text-height;
        text-align: center;
        &.min {
          left: 20%;
        }
        &.max {
          left: 65%;
        }
      }
      .checkbox {
        position: absolute;
        left: 20%;
        line-height: @filter-text-height;
        color: #fff;
      }
    }
  }
}

// 以下是为了覆盖element-ui的默认样式
.el-dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
  max-width: 200px;
}
</style>
