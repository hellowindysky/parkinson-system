<template lang="html">
  <ul class="sidebar">
    <li class="item" :class="{'current-item': currentItem === 'patients'}" @click="togglePatientsList">
      <div class="menu-icon iconfont icon-patients-management"></div>
      <div class="title">患者管理</div>
      <div class="fold-icon iconfont" :class="showPatientsList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showPatientsList}">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'myPatients'}" @click="chooseMyPatients">
        我的患者
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'groupsManagement'}" @click="chooseGroupsManagement">
        分组管理
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'otherPatients'}" @click="chooseOtherPatients">
        科室患者
      </li>
    </ul>
    <li class="item" :class="{'current': currentItem === 'analytics'}" @click="toggleAnalyticsList">
      <div class="menu-icon iconfont icon-analytics"></div>
      <div class="title">统计分析</div>
      <div class="fold-icon iconfont" :class="showAnalyticsList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showAnalyticsList}">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'basicAnalytics'}" @click="chooseBasicAnalytics">
        基础统计
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'advancedAnalytics'}" @click="chooseAdvancedAnalytics">
        高级统计
      </li>
    </ul>
    <li class="item" :class="{'current-item': currentItem === 'configuration'}" @click="toggleConfigurationList">
      <div class="menu-icon iconfont icon-configuration"></div>
      <div class="title">系统配置</div>
      <div class="fold-icon iconfont" :class="showConfigurationList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showConfigurationList}">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'featureConfiguration'}" @click="chooseFeatureConfiguration">
        功能配置
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'userManagement'}" @click="chooseUserManagement">
        用户管理
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'roleManagement'}" @click="chooseRoleManagement">
        角色管理
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'dictionaryManagement'}" @click="chooseDictionaryManagement">
        档案管理
      </li>
    </ul>
    <li class="item" :class="{'current-item': currentItem === 'institutionConfiguration'}" @click="toggleInstitutionList">
      <div class="menu-icon iconfont icon-configuration"></div>
      <div class="title">机构配置</div>
      <div class="fold-icon iconfont" :class="showConfigurationList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showInstitutionList}">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'institutionInfo'}" @click="chooseInstitutionInfo">
        机构信息
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'functionConfiguration'}" @click="chooseFunctionConfiguration">
        功能配置
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'userConfiguration'}" @click="chooseUserConfiguration">
        用户配置
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'roleConfiguration'}" @click="chooseRoleConfiguration">
        角色配置
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'projectConfiguration'}" @click="chooseProjectConfiguration">
        课题配置
      </li>
    </ul>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      showPatientsList: false,
      showAnalyticsList: false,
      showConfigurationList: false,
      showInstitutionList: false
    };
  },
  computed: {
    currentItem() {
      var path = this.$route.path;
      if (/^\/patients/.test(path)) {
        return 'patients';
      } else if (/^\/analytics/.test(path)) {
        return 'analytics';
      } else if (/^\/configuration/.test(path)) {
        return 'configuration';
      }
    },
    currentSubItem() {
      var path = this.$route.path;
      if (/^\/patients\/list/.test(path)) {
        return 'myPatients';
      } else if (/^\/patients\/groups/.test(path)) {
        return 'groupsManagement';
      } else if (/^\/patients\/otherList/.test(path)) {
        return 'otherPatients';
      } else if (/^\/configuration\/featureConfiguration/.test(path)) {
        return 'featureConfiguration';
      } else if (/^\/configuration\/userManagement/.test(path)) {
        return 'userManagement';
      } else if (/^\/configuration\/roleManagement/.test(path)) {
        return 'roleManagement';
      } else if (/^\/configuration\/dictionaryManagement/.test(path)) {
        return 'dictionaryManagement';
      }
    }
  },
  methods: {
    togglePatientsList() {
      this.showPatientsList = !this.showPatientsList;
    },
    toggleAnalyticsList() {
      this.showAnalyticsList = !this.showAnalyticsList;
    },
    toggleConfigurationList() {
      this.showConfigurationList = !this.showConfigurationList;
    },
    toggleInstitutionList() {
      this.showInstitutionList = !this.showInstitutionList;
    },
    chooseMyPatients() {
      // 如果当前路径不是以“/patients/list”开头了，才发生跳转
      if (!/^\/patients\/list/.test(this.$route.path)) {
        this.$router.push({name: 'myPatients'});
      }
    },
    chooseGroupsManagement() {
      // 如果当前路径不是以“/patients/groups”开头了，才发生跳转
      if (!/^\/patients\/groups/.test(this.$route.path)) {
        this.$router.push({name: 'groupsManagement'});
      }
    },
    chooseOtherPatients() {
      // 如果当前路径不是以“/patients/otherList”开头了，才发生跳转
      if (!/^\/patients\/otherList/.test(this.$route.path)) {
        this.$router.push({name: 'otherPatients'});
      }
    },
    chooseBasicAnalytics() {},
    chooseAdvancedAnalytics() {},
    chooseFeatureConfiguration() {
      // 如果当前路径不是以“/configuration/featureConfiguration”开头了，才发生跳转
      if (!/^\/configuration\/featureConfiguration/.test(this.$route.path)) {
        this.$router.push({name: 'featureConfiguration'});
      }
    },
    chooseUserManagement() {
      // 如果当前路径不是以“/configuration/userManagement”开头了，才发生跳转
      if (!/^\/configuration\/userManagement/.test(this.$route.path)) {
        this.$router.push({name: 'userManagement'});
      }
    },
    chooseRoleManagement() {
      // 如果当前路径不是以“/configuration/roleManagement”开头了，才发生跳转
      if (!/^\/configuration\/roleManagement/.test(this.$route.path)) {
        this.$router.push({name: 'roleManagement'});
      }
    },
    chooseDictionaryManagement() {
      // 如果当前路径不是以“/configuration/dictionaryManagement”开头了，才发生跳转
      if (!/^\/configuration\/dictionaryManagement/.test(this.$route.path)) {
        this.$router.push({name: 'dictionaryManagement'});
      }
    },
    chooseInstitutionInfo() {},
    chooseFunctionConfiguration() {},
    chooseUserConfiguration() {},
    chooseRoleConfiguration() {},
    chooseProjectConfiguration() {}
  },
  mounted() {
    // 初始化该组件时，自动跳转到病患管理
    if (!/^\/patients/.test(this.$route.path)) {
      this.$router.replace({ name: 'myPatients' });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@item-height: 60px;

.sidebar {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: @theme-color;
  color: @inverse-font-color;
  .item {
    position: relative;
    margin-top: 0;
    width: 100%;
    height: @item-height;
    cursor: pointer;
    list-style: none;
    &:hover {
      background-color: lighten(@theme-color, 10%);
    }
    &.current-item {
      background-color: @button-color;
      color: @button-font-color;
    }
    .iconfont {
      display: inline-block;
      position: absolute;
      line-height: @item-height;
      vertical-align: middle;
      &.menu-icon {
        left: 5px;
        font-size: 20px;
      }
      &.fold-icon {
        left: 95px;
        font-size: @normal-font-size;
      }
    }
    .title {
      display: inline-block;
      position: absolute;
      left: 30px;
      font-size: @normal-font-size;
      line-height: @item-height;
      vertical-align: middle;
    }
  }
  .sub-item-list {
    margin: 0;
    padding: 10px 0 20px;
    box-sizing: border-box;
    background-color: @font-color;
    overflow: hidden;
    transition: 0.2s;
    &.folded {
      height: 0;
      padding: 0;
    }
    .sub-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        background-color: lighten(@font-color, 10%);
      }
      &.current-sub-item {
        color: @button-color;
      }
    }
  }
}
</style>
