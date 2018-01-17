<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <img class="image" src="~img/profile.png" alt="">
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
      if (this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL) {
        if (this.patient.status !== undefined &&
          ([this.MY_PATIENTS_TYPE, this.SUBJECT_PATIENTS_TYPE].indexOf(this.listType) >= 0)) {
          return 'icon-experiment';
        } else if (this.patient.status !== undefined &&
          ([this.THERAPISTS_PATIENTS_TYPE, this.APPRAISERS_PATIENTS_TYPE].indexOf(this.listType) >= 0)) {
          if (this.patient.status === this.EXPERIMENT_STEP_SCREENING) {
            return 'icon-shai';
          } else if (this.patient.status === this.EXPERIMENT_STEP_THERAPY) {
            return 'icon-zhi';
          } else if (this.patient.status === this.EXPERIMENT_STEP_FOLLOW_UP) {
            return 'icon-sui';
          } else if (this.patient.status === this.EXPERIMENT_STEP_COMPLETE) {
            return 'icon-wan';
          }
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
    &.icon-shai {
      color: @alert-color;
    }
    &.icon-zhi {
      color: @light-font-color;
    }
    &.icon-sui {
      color: @button-color;
    }
    &.icon-wan {
      color: @green-color;
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
