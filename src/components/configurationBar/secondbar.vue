<template>
    <div class='secondbar-content'>
        <ul class='secondbar-wrapper'>
            <li class="tab left-tab" :class="{'current-tab': currentTab === 'configpersonalinf'}" @click="chooseconfigPersonal">个人信息</li>
            <li class="tab right-tab" :class="{'current-tab': currentTab === 'configdiagnosticinfo'}" @click="chooseConfigDiagnostic">诊断信息</li>
            <li class="tab-bottom-bar" :class="currentTabBottomBar"></li>
        </ul>
        <div class="scroll-content" ref="scrollArea">
            <featureTableHead></featureTableHead>
            <router-view :configbase-info="configbaseInfo"></router-view>
        </div>
    </div>
</template>

<script>
import featureTableHead from '../tableHead/featureTableHead';

import { getPatientConfigTemplate } from 'api/patient';
import Ps from 'perfect-scrollbar';

export default {
  data() {
    return {
      configbaseInfo: {}
    };
  },
  computed: {
    currentTab() {
      var path = this.$route.path;
      var rePersonal = new RegExp(/\/configpersonalinf(\/|$)/);
      var reDiagnostic = new RegExp(/\/configdiagnosticinfo(\/|$)/);
      if (rePersonal.test(path)) {
        return 'configpersonalinf';
      } else if (reDiagnostic.test(path)) {
        return 'configdiagnosticinfo';
      } else {
        // 逻辑正确的话，不会返回这行的。只是怕以后路由修改，出现问题。
        return 'something wrong here';
      }
    },
    currentTabBottomBar() {
      if (this.currentTab === 'configpersonalinf') {
        return 'first-tab';
      } else if (this.currentTab === 'configdiagnosticinfo') {
        return 'second-tab';
      } else {
        return 'Oops! check currentTab';
      }
    }
  },
  methods: {
    chooseconfigPersonal() {
      if (!/\/configpersonalinf(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'configpersonalinf' });
      }
    },
    chooseConfigDiagnostic() {
      if (!/\/configdiagnosticinfo(\/|$)/.test(this.$route.path)) {
        this.$router.push({ name: 'configdiagnosticinfo' });
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
      getPatientConfigTemplate().then((data) => {
        this.configbaseInfo = data;
      });
    }
  },
  mounted() {
    if (!/\/configpersonalinf(\/|$)/.test(this.$route.path)) {
      this.$router.push({ name: 'configpersonalinf' });
    }
    this.updatePatientInfo();
  },
  components: {
    featureTableHead
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@tabs-wrapper-height: 40px;
@tab-width: 70px;
@first-tab-x: 20px;
@second-tab-x: 120px;
@margin-right: 15px;

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
        &.left-tab {
            left: @first-tab-x;
        }
        &.right-tab {
            left: @second-tab-x;
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
    }
    .scroll-content {
      position: relative;
      width: 100%;
      height: calc(~"100% - @{tabs-wrapper-height}");
      overflow: hidden;
    }
}
</style>
