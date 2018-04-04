<template lang="html">
  <ul class="sidebar">
    <li class="item" :class="{'current-item': currentItem === 'patients'}" @click="togglePatientsList"
      v-if="showPatientsManagement">
      <div class="menu-icon iconfont icon-patients-management"></div>
      <div class="title">患者管理</div>
      <div class="fold-icon iconfont" :class="showPatientsList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showPatientsList}" v-if="showPatientsManagement">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'myPatients'}" @click="chooseMyPatients">
        我的患者
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'groupsManagement'}" @click="chooseGroupsManagement">
        分组管理
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'otherPatients'}"
        @click="chooseOtherPatients" v-if="!inSubject">
        科室患者
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'subjectPatients'}"
        @click="chooseSubjectPatients" v-if="false">
        项目患者
      </li>
    </ul>
    <li class="item" :class="{'current-item': currentItem === 'analytics'}" @click="toggleAnalyticsList" v-if="showAnalytics">
      <div class="menu-icon iconfont icon-analytics"></div>
      <div class="title">统计分析</div>
      <div class="fold-icon iconfont" :class="showAnalyticsList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showAnalyticsList}" v-if="showAnalytics">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'basicAnalytics'}" @click="chooseBasicAnalytics">
        基础统计
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'advancedAnalytics'}"
        @click="chooseAdvancedAnalytics" v-if="false">
        高级统计
      </li>
    </ul>
    <li class="item" :class="{'current-item': currentItem === 'statistics'}" @click="toggleStatisticsList" v-if="showStatistics">
      <div class="menu-icon iconfont icon-statistics"></div>
      <div class="title">运营分析</div>
      <div class="fold-icon iconfont" :class="showStatisticsList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showStatisticsList}" v-if="showStatistics">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'dataEntryDetail'}"
        @click="chooseDataEntryDetail">
        录入统计
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'historyStatistics'}"
        @click="chooseHistoryStatistics">
        历史统计
      </li>
    </ul>
    <li class="item" :class="{'current-item': currentItem === 'experiment'}" @click="toggleExperimentList"
      v-if="showExperiment && subjectRole > 0">
      <div class="menu-icon iconfont icon-experiment"></div>
      <div class="title">实验研究</div>
      <div class="fold-icon iconfont" :class="showExperimentList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showExperimentList}"
      v-if="showExperiment && subjectRole > 0">
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'therapistsPatients'}"
        @click="chooseTherapist" v-if="subjectRole===1">
        治疗者
      </li>
      <li class="sub-item" :class="{'current-sub-item': currentSubItem === 'appraisersPatients'}"
        @click="chooseAppraiser" v-if="subjectRole===2">
        评估者
      </li>
    </ul>
    <li class="item" :class="{'current-item': currentItem === 'configuration'}" @click="toggleConfigurationList"
      v-if="showConfiguration">
      <div class="menu-icon iconfont icon-configuration"></div>
      <div class="title">系统配置</div>
      <div class="fold-icon iconfont" :class="showConfigurationList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showConfigurationList}" v-if="showConfiguration">
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
    <li class="item" :class="{'current-item': currentItem === 'institutionConfiguration'}" @click="toggleInstitutionList"
      v-if="showInstitutionConfiguration">
      <div class="menu-icon iconfont icon-organization"></div>
      <div class="title">机构配置</div>
      <div class="fold-icon iconfont" :class="showInstitutionList ? 'icon-up' : 'icon-down'"></div>
    </li>
    <ul class="sub-item-list" :class="{'folded': !showInstitutionList}" v-if="showInstitutionConfiguration">
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
import Util from 'utils/util.js';

export default {
  data() {
    return {
      showPatientsList: true,
      showAnalyticsList: false,
      showStatisticsList: false,
      showExperimentList: false,
      showConfigurationList: false,
      showInstitutionList: false
    };
  },
  computed: {
    currentItem() {
      var path = this.$route.path;
      if (/^\/patients/.test(path)) {
        if (this.$route.matched.some(record => record.meta.therapistsPatients) ||
          this.$route.matched.some(record => record.meta.appraisersPatients)) {
          return 'experiment';
        } else {
          return 'patients';
        }
      } else if (/^\/analytics/.test(path)) {
        return 'analytics';
      } else if (/^\/configuration/.test(path)) {
        return 'configuration';
      } else if (/^\/statistics/.test(path)) {
        return 'statistics';
      }
    },
    inSubject() {
      return this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL;
    },
    subjectId() {
      return this.$store.state.subjectId;
    },
    subjectRole() {
      var subjects = sessionStorage.getItem('subjects');
      subjects = JSON.parse(subjects);

      var currentSubject = Util.findTargetObj(subjects, 'taskRoleType', 'id', this.subjectId);
      return currentSubject ? Number(currentSubject.taskRoleType) : 0;
    },
    currentSubItem() {
      var path = this.$route.path;
      if (/^\/patients\/list/.test(path)) {
        return 'myPatients';
      } else if (/^\/patients\/groups/.test(path)) {
        return 'groupsManagement';
      } else if (/^\/patients\/otherList/.test(path)) {
        return 'otherPatients';
      } else if (/^\/patients\/subjectList/.test(path)) {
        return 'subjectPatients';
      } else if (/^\/patients\/therapistsPatientList/.test(path)) {
        return 'therapistsPatients';
      } else if (/^\/patients\/appraisersPatientList/.test(path)) {
        return 'appraisersPatients';
      } else if (/^\/analytics\/basic/.test(path)) {
        return 'basicAnalytics';
      } else if (/^\/analytics\/advanced/.test(path)) {
        return 'advancedAnalytics';
      } else if (/^\/statistics\/dataEntryDetail/.test(path)) {
        return 'dataEntryDetail';
      } else if (/^\/statistics\/history/.test(path)) {
        return 'historyStatistics';
      } else if (/^\/configuration\/featureConfiguration/.test(path)) {
        return 'featureConfiguration';
      } else if (/^\/configuration\/userManagement/.test(path)) {
        return 'userManagement';
      } else if (/^\/configuration\/roleManagement/.test(path)) {
        return 'roleManagement';
      } else if (/^\/configuration\/dictionaryManagement/.test(path)) {
        return 'dictionaryManagement';
      }
    },
    showPatientsManagement() {
      var userType = Number(sessionStorage.getItem('userType'));
      return (userType === 2 || userType === 4 || userType === 5 || userType === 6);
    },
    showAnalytics() {
      var userType = Number(sessionStorage.getItem('userType'));
      return (userType === 2 || userType === 4 || userType === 5 || userType === 6);
    },
    showStatistics() {
      // 只有内部人员才可以看到这个菜单
      var userType = Number(sessionStorage.getItem('userType'));
      return (userType === 3 || userType === 6);
    },
    showExperiment() {
      return this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL;
    },
    showConfiguration() {
      var userType = Number(sessionStorage.getItem('userType'));
      return userType === 4;
    },
    showInstitutionConfiguration() {
      var userType = Number(sessionStorage.getItem('userType'));
      return userType === 3;
    }
  },
  methods: {
    togglePatientsList() {
      this.showPatientsList = !this.showPatientsList;
    },
    toggleAnalyticsList() {
      this.showAnalyticsList = !this.showAnalyticsList;
    },
    toggleStatisticsList() {
      this.showStatisticsList = !this.showStatisticsList;
    },
    toggleExperimentList() {
      this.showExperimentList = !this.showExperimentList;
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
    chooseSubjectPatients() {
      // 如果当前路径不是以“/patients/subjectList”开头了，才发生跳转
      if (!/^\/patients\/subjectList/.test(this.$route.path)) {
        this.$router.push({name: 'subjectPatients'});
      }
    },
    chooseBasicAnalytics() {
      // 如果当前路径不是以“/analytics”开头了，才发生跳转
      if (!/^\/analytics/.test(this.$route.path)) {
        this.$router.push({name: 'analytics'});
      }
    },
    chooseAdvancedAnalytics() {},
    chooseDataEntryDetail() {
      // 如果当前路径不是以“/statistics/dataEntryDetail”开头了，才发生跳转
      if (!/^\/statistics\/dataEntryDetail/.test(this.$route.path)) {
        this.$router.push({name: 'dataEntryDetail'});
      }
    },
    chooseHistoryStatistics() {
      // 如果当前路径不是以“/statistics/history”开头了，才发生跳转
      if (!/^\/statistics\/history/.test(this.$route.path)) {
        this.$router.push({name: 'historyStatistics'});
      }
    },
    chooseTherapist() {
      if (!/^\/patients\/therapistsPatientList/.test(this.$route.path)) {
        this.$router.push({name: 'therapistsPatients'});
      }
    },
    chooseAppraiser() {
      if (!/^\/patients\/appraisersPatientList/.test(this.$route.path)) {
        this.$router.push({name: 'appraisersPatients'});
      }
    },
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
    // 加载菜单栏这个组件的时候，自动跳转到病患管理
    if (!/^\/patients/.test(this.$route.path)) {
      this.$router.replace({ name: 'myPatients' });
    }
  },
  watch: {
    '$route.path'() {
      // 如果路由变为'/'，则自动跳转到病患管理
      if (/^\/$/.test(this.$route.path)) {
        this.$router.replace({ name: 'myPatients' });
      }
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
