<template lang="html">
  <div class="patient-info">
    <div class="tabs-wrapper">
      <div class="tab first-tab" :class="{'current-tab': currentTab === 'personalInfo'}"
        @click="choosePersonal" v-if="existed">个人信息</div>
      <div class="tab second-tab" :class="{'current-tab': currentTab === 'diagnosticInfo'}"
        @click="chooseDiagnostic" v-if="existed">诊断信息</div>
      <div class="tab third-tab" :class="{'current-tab': currentTab === 'experimentInfo'}"
        @click="chooseExperiment" v-if="existed && inSubject && hospitalType !== -1">{{experimentTitle}}</div>
      <div class="patient-id" :class="{'left-shift': false}" v-if="existed">患者ID: {{patientId}}</div>
      <!-- <div class="button" v-if="existed && listType===MY_PATIENTS_TYPE">导出病历</div> -->
      <div class="tab-bottom-bar" :class="currentTabBottomBar" v-if="this.existed"></div>
      <div class="title" v-if="!existed">新增患者</div>
    </div>
    <div class="info-wrapper" ref="scrollArea">
      <div class="shared-info" v-show="this.existed">
        <div class="info">
          <span class="info-title">归属医生: </span>
          <span class="info-text">{{ belongDoctor }}</span>
        </div>
        <div class="info">
          <span class="info-title">创建时间: </span>
          <span class="info-text">{{ createDate }}</span>
        </div>
        <div class="info whole-line" v-show="listType!==SUBJECT_PATIENTS_TYPE">
          <span class="info-title">分组情况: </span>
          <span class="info-text">
            <span class="tags-wrapper">
              <el-tooltip v-for="group in belongGroups"
                :key="group.groupName"
                class="tag"
                effect="dark"
                :content="group.groupName"
                placement="top">
                <el-button>{{group.groupName}}</el-button>
              </el-tooltip>
            </span>
            <span class="iconfont icon-group" v-if="listType!==OTHER_PATIENTS_TYPE"
              @click="toggleGroupPanel"></span>
          </span>
        </div>
        <div class="info whole-line" v-show="showProjectTags">
          <span class="info-title">课题标签: </span>
          <span class="info-text">
            <span class="tags-wrapper">
              <el-tooltip v-for="subject in belongSubjects"
                :key="subject.fullTaskName"
                class="tag"
                effect="dark"
                :content="subject.fullTaskName"
                placement="top">
                <el-button>{{getSubjectName(subject)}}</el-button>
              </el-tooltip>
            </span>
            <span class="iconfont icon-subject" @click="toggleSubjectPanel"></span>
          </span>
        </div>
        <div class="info" v-show="listType===SUBJECT_PATIENTS_TYPE">
          <span class="info-title">所属医院: </span>
          <span class="info-text">{{ belongHospital }}</span>
        </div>
      </div>
      <div class="respective-info">
        <router-view v-if="this.existed" :patient-info="patientInfo" :patient-case-list="patientCaseList"></router-view>
        <basic-info v-else ref="newPatientWindow" :basic-info="{}"></basic-info>
      </div>
    </div>
    <diagnostic-detail class="diagnostic-detail"
      :patient-info="patientInfo.patientInfo ? patientInfo.patientInfo : {}">
    </diagnostic-detail>
    <scale-modal class="diagnostic-handle-scale"></scale-modal>
    <group-panel class="group-panel" :class="{'hide': !displayGroupPanel}" :belongGroups="belongGroups"
      :display="displayGroupPanel" :patientId="Number(patientId)" @hideGroupPanel="hideGroupPanel"
      @updatePatientGroupInfo="updatePatientGroupInfo"></group-panel>
    <subject-panel class="subject-panel" :class="{'hide': !displaySubjectPanel}" :belongSubjects="belongSubjects"
      :display="displaySubjectPanel" :patientName="patientInfo.patientInfo ? patientInfo.patientInfo.name : ''" :patientId="Number(patientId)" @hideSubjectPanel="hideSubjectPanel"
      @updatePatientSubjectInfo="updatePatientSubjectInfo"></subject-panel>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

import { getPatientInfo, getPatientGroupInfo, getPatientSubjectInfo, getPatientCaseList } from 'api/patient';

import DiagnosticDetail from 'patient/diagnostic-info/diagnostic-detail/DiagnosticDetail';
import ScaleModal from 'modal/scale-modal/ScaleModal';
import BasicInfo from 'patient/personal-info/basic-info/BasicInfo';
import GroupPanel from 'public/group-panel/GroupPanel';
import SubjectPanel from 'public/subject-panel/SubjectPanel';

export default {
  data() {
    return {
      patientInfo: {},
      patientCaseList: [],
      belongDoctor: '',
      belongHospital: '',
      belongGroups: [],
      belongSubjects: [],
      createDate: '',
      displayGroupPanel: false,
      displaySubjectPanel: false
    };
  },
  computed: {
    patientId() {
      return this.$route.params.id;
    },
    showSensitiveInfo() {
      return this.$store.state.showSensitiveInfo;
    },
    existed() {
      return !(this.patientId === 'newPatient');
    },
    listType() {
      return this.$store.state.listType;
    },
    currentTab() {
      var path = this.$route.path;
      var rePersonal = new RegExp(/\/personalInfo(\/|$)/);
      var reDiagnostic = new RegExp(/\/diagnosticInfo(\/|$)/);
      var reExperiment = new RegExp(/\/experimentInfo(\/|$)/);
      if (rePersonal.test(path)) {
        return 'personalInfo';
      } else if (reDiagnostic.test(path)) {
        return 'diagnosticInfo';
      } else if (reExperiment.test(path)) {
        return 'experimentInfo';
      } else {
        // 逻辑正确的话，不会返回这行的。只是怕以后路由修改，出现问题。
        return 'something wrong here';
      }
    },
    currentTabBottomBar() {
      if (this.currentTab === 'personalInfo') {
        return 'first-tab';
      } else if (this.currentTab === 'diagnosticInfo') {
        return 'second-tab';
      } else if (this.currentTab === 'experimentInfo') {
        return 'third-tab';
      } else {
        return 'Oops! check currentTab';
      }
    },
    inSubject() {
      return this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL;
    },
    hospitalType() {
      return this.$store.state.hospitalType;
    },
    experimentTitle() {
      if (this.hospitalType === 2) {
        return '课题记录';
      } else {
        return '实验记录';
      }
    },
    showProjectTags() {
      // 课题标签这一栏的显示取决于:
      // 必须是我的患者（不允许操作科室患者）
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    choosePersonal() {
      this.$router.push('personalInfo');
    },
    chooseDiagnostic() {
      this.$router.push('diagnosticInfo');
    },
    chooseExperiment() {
      this.$router.push('experimentInfo');
    },
    checkRoute() {
      // 首先判断是不是新增患者
      if (!this.existed) {
        this.$refs.newPatientWindow.$emit(this.EDIT);
        return;
      }

      var withDetail = this.$route.matched.some(record => {
        return record.meta.personalInfo || record.meta.diagnosticInfo || record.meta.experimentInfo;
      });
      var withoutDetail = !withDetail;

      // 路由还停留在在病患信息这一层，但没有指明是个人信息还是诊断信息还是实验信息，那么就默认跳转到个人信息
      if (this.listType === this.MY_PATIENTS_TYPE && withoutDetail) {
        this.$router.replace({ name: 'personalInfo' });
      } else if (this.listType === this.OTHER_PATIENTS_TYPE && withoutDetail) {
        this.$router.replace({ name: 'otherPersonalInfo' });
      } else if (this.listType === this.SUBJECT_PATIENTS_TYPE && withoutDetail) {
        this.$router.replace({ name: 'subjectPersonalInfo' });
      } else if (this.listType === this.THERAPISTS_PATIENTS_TYPE && withoutDetail) {
        this.$router.replace({ name: 'therapistsPatientsPersonalInfo' });
      } else if (this.listType === this.APPRAISERS_PATIENTS_TYPE && withoutDetail) {
        this.$router.replace({ name: 'appraisersPatientsPersonalInfo' });
      }
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        // 之所以弃用 update 方法，是因为它在某些情况下会出现问题，导致滚动条不能有效刷新
        // Ps.update(this.$refs.scrollArea);

        // 如果之前有绑定滚动条的话，先进行解除
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updatePatientInfo() {
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      var subjectNum = this.inSubject ? this.$store.state.subjectId : 0;

      // type: 1我的患者, 2科室患者, 3项目中我的患者, 4项目中项目患者, 5实验研究中治疗者, 6实验研究中评估者
      var type = null;
      if (this.listType === this.MY_PATIENTS_TYPE) {
        type = this.inSubject ? 3 : 1;
      } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
        type = 2;
      } else if (this.listType === this.SUBJECT_PATIENTS_TYPE) {
        type = 4;
      } else if (this.listType === this.THERAPISTS_PATIENTS_TYPE) {
        type = 5;
      } else if (this.listType === this.APPRAISERS_PATIENTS_TYPE) {
        type = 6;
      }

      getPatientInfo(this.patientId, subjectNum, type).then((data) => {
        // console.log('patientInfo: ', data);
        this.patientInfo = data;
        this.createDate = data.createDate;
        this.belongDoctor = data.belongDoctor;
        this.belongGroups = data.belongGroups;
        this.belongSubjects = data.belongTasks;
        this.belongHospital = data.belongHospital ? data.belongHospital : '';
      }, (error) => {
        console.log(error);
      });

      this.updatePatientCaseList();
    },
    updatePatientCaseList() {
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      getPatientCaseList(this.patientId).then((data) => {
        // console.log('patientCaseList: ', data);
        this.patientCaseList = data;
      }, (error) => {
        console.log(error);
      });
    },
    updatePatientGroupInfo() {
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      var condition = {
        'patientId': this.patientId
      };
      condition.groupModule = this.inSubject ? this.$store.state.subjectId : 0;
      getPatientGroupInfo(condition).then((data) => {
        this.belongGroups = data;
      }, (error) => {
        console.log(error);
      });
    },
    updatePatientSubjectInfo() {
      // 如果是新增患者，则不去请求数据
      if (!this.existed) {
        return;
      }
      getPatientSubjectInfo(this.patientId).then((data) => {
        this.belongSubjects = data;
      }, (error) => {
        console.log(error);
      });
    },
    getSubjectName(subject) {
      if (subject.tasks && subject.tasks.length > 0) {
        return subject.tasks[0].taskName;
      } else {
        return subject.taskName;
      }
    },
    toggleGroupPanel() {
      this.displayGroupPanel = !this.displayGroupPanel;
      if (this.displayGroupPanel) {
        this.hideSubjectPanel();
      }
    },
    hideGroupPanel() {
      this.displayGroupPanel = false;
    },
    toggleSubjectPanel() {
      this.displaySubjectPanel = !this.displaySubjectPanel;
      if (this.displaySubjectPanel) {
        this.hideGroupPanel();
      }
    },
    hideSubjectPanel() {
      this.displaySubjectPanel = false;
    }
  },
  components: {
    DiagnosticDetail,
    ScaleModal,
    BasicInfo,
    GroupPanel,
    SubjectPanel
  },
  mounted() {
    this.updatePatientInfo();
    this.updatePatientGroupInfo();

    this.checkRoute();

    this.updateScrollbar();
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);

    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);

    // 监听子组件是否要求刷新病患数据
    Bus.$on(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);

    // 监听组件是否要求更新诊断卡片列表
    Bus.$on(this.UPDATE_PATIENT_CASE_LIST, this.updatePatientCaseList);
  },
  watch: {
    '$route.path'() {
      this.checkRoute();
      this.displayGroupPanel = false;  // 路由变化时，关闭分组面板
      this.$refs.scrollArea.scrollTop = 0;  // 切换自组件时，滚动条还原到顶部
      this.updateScrollbar();
    },
    showSensitiveInfo() {
      this.updatePatientInfo();
    },
    existed() {
      // 因为 existed 这个变量变化时会导致几个子面板的 显示／隐藏，所以需要它们重新计算各自内部的卡片宽度
      Bus.$emit(this.RECALCULATE_CARD_WIDTH);
    }
  },
  beforeDestroy() {
    // 在组件销毁前，移除绑定在当前组件下的事件监听器
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
    Bus.$off(this.UPDATE_PATIENT_CASE_LIST, this.updatePatientCaseList);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.checkRoute();
    });
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@tabs-wrapper-height: 40px;
@tab-width: 70px;
@first-tab-x: 20px;
@second-tab-x: 120px;
@third-tab-x: 220px;

@margin-right: 15px;

.patient-info {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .diagnostic-detail {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 300;
  }
  .diagnostic-handle-scale {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 400;
    background: @screen-color;
  }
  .group-panel, .subject-panel {
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s;
  }
  .group-panel {
    z-index: 200;
    &.hide {
      right: -@group-panel-width;
    }
  }
  .subject-panel {
    z-index: 210;
    &.hide {
      right: -@group-panel-width;
    }
  }
  .tabs-wrapper {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @tabs-wrapper-height;
    background-color: @background-color;
    box-shadow: 0 10px 10px @screen-color;
    .tab {
      position: absolute;
      width: @tab-width;
      height: 100%;
      line-height: @tabs-wrapper-height;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      cursor: pointer;
      color: @inverse-font-color;
      &:hover {
        color: darken(@inverse-font-color, 10%);
      }
      &.first-tab {
        left: @first-tab-x;
      }
      &.second-tab {
        left: @second-tab-x;
      }
      &.third-tab {
        left: @third-tab-x;
      }
      &.current-tab {
        color: @button-color;
      }
    }
    .tab-bottom-bar {
      position: absolute;
      width: @tab-width;
      height: 3px;
      bottom: 0;
      background-color: @button-color;
      left: @first-tab-x;
      transition: transform 0.2s;
      &.first-tab {
        transform: translate3d(0, 0, 0);
      }
      &.second-tab {
        transform: translate3d(@second-tab-x - @first-tab-x, 0, 0);
      }
      &.third-tab {
        transform: translate3d(@third-tab-x - @first-tab-x, 0, 0);
      }
    }
    .patient-id {
      position: absolute;
      right: 30px;
      line-height: @tabs-wrapper-height;
      font-size: @normal-font-size;
      font-weight: bold;
      color: @light-font-color;
      &.left-shift {
        transform: translateX(-@small-button-width);
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
    }
    .title {
      position: absolute;
      left: @first-tab-x;
      width: @tab-width;
      height: 100%;
      line-height: 40px;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      color: @font-color;
    }
  }
  .info-wrapper {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{tabs-wrapper-height} - @{vertical-spacing}");
    overflow: hidden;
    .shared-info {
      position: relative;
      margin: 0 @margin-right @vertical-spacing 0;
      padding: 5px 25px;
      box-sizing: border-box;
      background-color: @background-color;
      font-size: 0;
      text-align: left;
      .info {
        display: inline-block;
        width: 50%;
        height: 34px;
        line-height: 30px;
        font-size: @normal-font-size;
        &.whole-line{
          width: 100%;
        }
        .tags-wrapper {
          display: inline-block;
          max-width: calc(~"100% - 85px - 50px");
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .tag {
            display: inline-block;
            padding: 0 10px;
            height: 30px;
            background-color: @light-font-color;
            border: 0;
            border-radius: 5px;
            color: #fff;
            cursor: default;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .info-title {
          display: inline-block;
          width: 85px;
          vertical-align: top;
          color: @font-color;
        }
        .info-text {
          color: @light-font-color;
          .iconfont {
            display: inline-block;
            font-size: 20px;
            line-height: 30px;
            vertical-align: top;
            cursor: pointer;
            &:hover {
              color: darken(@light-font-color, 20%);
            }
            &:active {
              color: darken(@light-font-color, 10%);
            }
          }
        }
      }
    }
    .respective-info {
      position: relative;
      margin-right: @margin-right;
      box-sizing: border-box;
      background-color: @background-color;
    }

    // 下面这组 CSS 是为了让 perfect-scrollbar正常工作的，不知道为什么，默认状态下这个组件不能正常显示
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
}
</style>
