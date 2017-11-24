<template>
  <div class='secondbar-content'>
    <ul class='secondbar-wrapper'>
      <li class="tab one-tab" :class="{'current-tab': currentTab === 'othermedicationhistory'}" @click="chooseTreatmentPlan">其他用药史</li>
      <li class="tab two-tab" :class="{'current-tab': currentTab === 'pasthistory'}" @click="chooseMedicalScale">既往史</li>
      <li class="tab three-tab" :class="{'current-tab': currentTab === 'familyhistory'}" @click="chooseInspection">家庭史</li>
      <li class="tab four-tab" :class="{'current-tab': currentTab === 'personalhistory'}" @click="chooseImageDatas">个人史</li>
      <li class="tab five-tab" :class="{'current-tab': currentTab === 'toxicexposure'}" @click="chooseDuWuJie">毒物接触史</li>      
      <li class="tab-bottom-bar" :class="currentTabBottomBar"></li>
    </ul>
    <div class="scroll-content">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    currentTab() {
      let path = this.$route.path;
      let reTreatmentPlan = new RegExp(/\/othermedicationhistory(\/|$)/);
      let reMedicalScale = new RegExp(/\/pasthistory(\/|$)/);
      let reInspection = new RegExp(/\/familyhistory(\/|$)/);
      let reImageDatas = new RegExp(/\/personalhistory(\/|$)/);
      let reDuWuJie = new RegExp(/\/toxicexposure(\/|$)/);
      if (reTreatmentPlan.test(path)) {
        return 'othermedicationhistory';
      } else if (reMedicalScale.test(path)) {
        return 'pasthistory';
      } else if (reInspection.test(path)) {
        return 'familyhistory';
      } else if (reImageDatas.test(path)) {
        return 'personalhistory';
      } else if (reDuWuJie.test(path)) {
        return 'toxicexposure';
      } else {
        // 逻辑正确的话，不会返回这行的。只是怕以后路由修改，出现问题。
        return 'something wrong here';
      }
    },
    currentTabBottomBar() {
      if (this.currentTab === 'othermedicationhistory') {
        return 'first-tab';
      } else if (this.currentTab === 'pasthistory') {
        return 'second-tab';
      } else if (this.currentTab === 'familyhistory') {
        return 'third-tab';
      } else if (this.currentTab === 'personalhistory') {
        return 'fourth-tab';
      } else if (this.currentTab === 'toxicexposure') {
        return 'fifth-tab';
      } else {
        return 'Oops! check currentTab';
      }
    }
  },
  methods: {
    chooseTreatmentPlan() {
      if (!/\/othermedicationhistory(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'othermedicationhistory' });
      }
    },
    chooseMedicalScale() {
      if (!/\/pasthistory(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'pasthistory' });
      }
    },
    chooseInspection() {
      if (!/\/familyhistory(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'familyhistory' });
      }
    },
    chooseImageDatas() {
      if (!/\/personalhistory(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'personalhistory' });
      }
    },
    chooseDuWuJie() {
      if (!/\/toxicexposure(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'toxicexposure' });
      }
    }
  },
  mounted() {
    this.$router.push({ name: 'othermedicationhistory' });
  },
  components: {
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@tabs-wrapper-height: 40px;
@tab-width: 80px;
@first-tab-x: 20px;
@second-tab-x: 120px;
@third-tab-x: 220px;
@fourth-tab-x: 320px;
@fifth-tab-x: 420px;
@margin-right: 20px;
@first-bar-height: 60px;
@second-bar-height: 45px;

.secondbar-content {
  position: relative;
  height: calc(~"100% - @{first-bar-height}");
  .secondbar-wrapper {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @tabs-wrapper-height;
    background-color: @background-color;
    box-shadow: 0 10px 10px @screen-color;
    list-style: none;
    .tab {
      position: absolute;
      width: @tab-width;
      line-height: 40px;
      box-sizing: border-box;
      font-size: @large-font-size;
      font-weight: bold;
      cursor: pointer;
      color: @inverse-font-color;
      &:hover {
        color: darken(@inverse-font-color, 10%);
      }
      &.one-tab {
        left: @first-tab-x;
      }
      &.two-tab {
        left: @second-tab-x;
      }
      &.three-tab {
        left: @third-tab-x;
      }
      &.four-tab {
        left: @fourth-tab-x;
      }
      &.five-tab {
        left: @fifth-tab-x;
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
        transform: translate3d(100px, 0, 0);
      }
      &.third-tab {
        transform: translate3d(200px, 0, 0);
      }
      &.fourth-tab {
        transform: translate3d(300px, 0, 0);
      }
      &.fifth-tab {
        transform: translate3d(400px, 0, 0);
      }
    }
  }
  .scroll-content {
    position: relative;
    height: calc(~"100% - @{second-bar-height}");
  }
}
</style>
