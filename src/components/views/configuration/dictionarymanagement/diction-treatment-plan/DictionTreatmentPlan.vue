<template>
  <div class="scroll-wrapper">
    <div class="freature-person-conf-wrapper" ref="scrollArea">
      <common-drugs></common-drugs>
      <ReasonsWithDrawal></ReasonsWithDrawal>
      <SideEffects></SideEffects>
      <SurgicalProgram></SurgicalProgram>
    </div>
  </div>
</template>
<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import CommonDrugs from 'views/configuration/dictionarymanagement/common-drugs/CommonDrugs';
import ReasonsWithDrawal from 'views/configuration/dictionarymanagement/reasons-with-drawal/ReasonsWithDrawal';
import SideEffects from 'views/configuration/dictionarymanagement/side-effects/SideEffects';
import SurgicalProgram from 'views/configuration/dictionarymanagement/surgical-program/SurgicalProgram';
// import FeatureFoldingPanel from 'public/feature-folding-panel/FeatureFoldingPanel';
import { getDictionary } from 'api/user';

export default {
  data() {
    return {
      userInfo: {
        all: []
      }
    };
  },
  components: {
    CommonDrugs,
    ReasonsWithDrawal,
    SideEffects,
    SurgicalProgram
  },
  methods: {
    updateUserInfo() {
      getDictionary().then((data) => {
        this.userInfo.all = data;
      });
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    getGroups(state, tableName) {
      // 如果 state.all 为空，则返回一个空数组
      if (state.all.length === 0) {
        return [];

      } else {
        var table = state.all.filter((table) => {
          return table.tableName === tableName;
        })[0];
        var groups = table && table.groups ? table.groups : [];

        // 然后对这个数组进行加工，让它更扁平化，方便我们在组件中使用
        var processedGroups = [];
        for (var i = 0; i < groups.length; i++) {
          for (let key in groups[i].fields) {
            groups[i].fields[key]['tableName'] = table.tableName;
          }
          processedGroups.push(groups[i].fields);
        }
        return processedGroups;
      }
    }
  },
  mounted() {
    this.updateScrollbar();
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    // 在组件销毁前，移除绑定在当前组件下的事件监听器
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  computed: {
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@tabs-wrapper-height: 15px;
@table-head-height: 0px;
.scroll-wrapper {
  position: relative;
  height: calc(~"100% - @{table-head-height}");
  margin-right: 20px;
  .freature-person-conf-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    height: 100%;
    .ps__scrollbar-y-rail {
      position: absolute;
      top: 0;
      width: 15px;
      right: -2px;
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
