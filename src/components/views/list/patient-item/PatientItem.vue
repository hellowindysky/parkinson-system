<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <img class="image" src="~img/profile.png" alt="" :class="{'image-die' :patient.liveStatus===2}">
    <span class="experiment-icon iconfont" :class="experimentStatusIcon" v-if="experimentStatusIcon"></span>
    <div class="name">{{patient.name}}</div>
    <div class="date">{{patient.createDate}}</div>
    <div class="age">{{patient.age}}岁</div>
    <div class="gender iconfont" :class="genderIcon"></div>
    <div class="location">{{patient.homeProvince}}</div>
  </div>
</template>

<script>
export default {
  props: {
    patient: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    listType() {
      return this.$store.state.listType;
    },
    hospitalType() {
      return this.$store.state.hospitalType;
    },
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    selected() {
      if (Number(this.$route.params.id) === Number(this.patient.patientId)) {
        return true;
      } else {
        return false;
      }
    },
    genderIcon() {
      if (this.patient.sex === 0) {
        return 'icon-male';
      } else if (this.patient.sex === 1) {
        return 'icon-female';
      }
    },
    experimentStatusIcon() {
      if (this.patient.status !== undefined &&
        Number(this.patient.status) !== 0 &&
        Number(this.patient.status) !== 50 &&
        this.$store.state.subjectId === this.SUBJECT_ID_FOR_HOSPITAL &&
        this.listType === this.MY_PATIENTS_TYPE) {
        return 'icon-experiment';

      } else if (this.patient.status !== undefined &&
        this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL &&
        ([this.MY_PATIENTS_TYPE, this.THERAPISTS_PATIENTS_TYPE, this.APPRAISERS_PATIENTS_TYPE,
          this.SUBJECT_PATIENTS_TYPE].indexOf(this.listType) >= 0)) {
        let status = Number(this.patient.status);
        let isInThisSubject = this.patient.taskInfoId === this.$store.state.subjectId;
        if (status === this.EXPERIMENT_STEP_FILTERING && isInThisSubject) {
          if (this.hospitalType === 2 || this.hospitalType === 1) {
            return 'icon-shai';
          }
        } else if (status === this.EXPERIMENT_STEP_SCREENING && isInThisSubject) {
          if (this.hospitalType === 1) {
            return 'icon-shai';
          } else if (this.hospitalType === 2) {
            return 'icon-ji';
          }
        } else if (status === this.EXPERIMENT_STEP_THERAPY && isInThisSubject) {
          return 'icon-zhi';
        } else if (status === this.EXPERIMENT_STEP_FOLLOW_UP && isInThisSubject) {
          return 'icon-sui';
        } else if (status === this.EXPERIMENT_STEP_COMPLETE && isInThisSubject) {
          return 'icon-wan';
        }
      }
      return '';
    }
  },
  mounted() {
  },
  methods: {
    select() {
      var routeName = '';
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        routeName = 'patientInfo';
      } else if (this.$route.matched.some(record => record.meta.otherPatients)) {
        routeName = 'otherPatientInfo';
      } else if (this.$route.matched.some(record => record.meta.subjectPatients)) {
        routeName = 'subjectPatientInfo';
      } else if (this.$route.matched.some(record => record.meta.therapistsPatients)) {
        routeName = 'therapistsPatientInfo';
      } else if (this.$route.matched.some(record => record.meta.appraisersPatients)) {
        routeName = 'appraisersPatientInfo';
      } else {
        return;
      }
      this.$router.push({
        name: routeName,
        params: { id: this.patient.patientId }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";

.item {
  position: relative;
  width: 100%;
  height: 60px;
  padding: 5px;
  .image {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 35px;
    height: 35px;
    &.image-die {
      filter: grayscale(100%);
    }
  }
  .experiment-icon {
    display: inline-block;
    position: absolute;
    left: 27px;
    top: 27px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    font-size: 25px;
    border-radius: 50%;
    background-color: #fff;
    &.icon-ji {
      color: #813cee;
    }
    &.icon-shai {
      color: #ff3952;
    }
    &.icon-zhi {
      color: #59a0fb;
    }
    &.icon-sui {
      color: #ff9c2d;
    }
    &.icon-wan {
      color: #00c75c;
    }
  }
  .name {
    position: absolute;
    font-size: @normal-font-size;
    left: 60px;
    top: 10px;
    width: 100px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .gender {
    position: absolute;
    font-size: @small-font-size;
    left: 60px;
    top: 35px;
    &.icon-male {
      color: @male-color;
    }
    &.icon-female {
      color: @female-color;
    }
  }
  .date {
    position: absolute;
    font-size: @small-font-size;
    right: 20px;
    top: 12px;
  }
  .age {
    position: absolute;
    font-size: @small-font-size;
    left: 85px;
    top: 35px;
  }
  .location {
    position: absolute;
    font-size: @small-font-size;
    left: 120px;
    top: 35px;
  }
}
</style>
