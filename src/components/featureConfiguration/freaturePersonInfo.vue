<template>
  <div class="freature-person-conf-wrapper" ref="scrollArea">
    <basicInfoConfig></basicInfoConfig>
    <diseageInfoConfig></diseageInfoConfig>
    <otherInfoConfig></otherInfoConfig>
  </div>
</template>

<script>

import basicInfoConfig from '../basicinfoconfig/BasicInfoConfig';
import diseageInfoConfig from '../diseageinfoconfig/DiseageInfoConfig';
import otherInfoConfig from '../otherinfoconfig/OtherInfoConfig';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

export default {
  components: {
    basicInfoConfig,
    diseageInfoConfig,
    otherInfoConfig
  },
  methods: {
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        // console.log(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    }
  },
  mounted() {
    this.updateScrollbar();
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    // 监听子组件是否要求刷新病患数据
    Bus.$on(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
  },
  beforeDestroy() {
    // 在组件销毁前，移除绑定在当前组件下的事件监听器
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@tabs-wrapper-height: 40px;

.freature-person-conf-wrapper {
  position: relative;
  width: 100%;
  //overflow: hidden;
  .ps__scrollbar-y-rail {
    position: absolute;
    top: 0;
    width: 15px;
    right: 10px;
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
</style>
