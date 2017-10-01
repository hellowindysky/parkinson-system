
<template>
  <div class="department-wrapper">
    <feature-table-head></feature-table-head>
    <div class="scroll-wrapper">
      <div class="freature-person-conf-wrapper" ref="scrollArea">
        <basic-infoConfig :basicInfoF="basicInfoF" :basicInfoS="basicInfoS" :basicInfoT="basicInfoT"></basic-infoConfig>
        <diseage-infoConfig :diseaseInfoF="diseaseInfoF" :diseaseInfoS="diseaseInfoS" :diseaseInfoT="diseaseInfoT"></diseage-infoConfig>
        <other-infoConfig :medHistoryList="medHistoryList" :diseaseHistoryList="diseaseHistoryList" :familyHistoryList="familyHistoryList" :coffeeHistoryList="coffeeHistoryList" :smokeHistoryList="smokeHistoryList" :wineHistoryList="wineHistoryList" :teaHistoryList="teaHistoryList" :exerciseHistoryList="exerciseHistoryList" :toxicExposureHistoryList="toxicExposureHistoryList"></other-infoConfig>
      </div>
    </div>
  </div>
</template>

<script>
import FeatureTableHead from 'components/tablehead/FeatureTableHead';
import BasicInfoConfig from '../basicinfoconfig/BasicInfoConfig';
import DiseageInfoConfig from '../diseageinfoconfig/DiseageInfoConfig';
import OtherInfoConfig from '../otherinfoconfig/OtherInfoConfig';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

import { getTemplate } from 'api/user';

export default {
  data() {
    return {
      userInfo: {
        all: []
      }
    };
  },
  components: {
    BasicInfoConfig,
    DiseageInfoConfig,
    OtherInfoConfig,
    FeatureTableHead
  },
  methods: {
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
    updateUserInfo() {
      getTemplate().then((data) => {
        this.userInfo.all = data;
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
          processedGroups.push(groups[i].fields);
        }
        return processedGroups;
      }
    }
  },
  mounted() {
    this.updateScrollbar();
    this.updateUserInfo();
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
    basicInfoF() {
      // 基本信息模块一
      return this.getGroups(this.userInfo, 'tc_patient_info')[0];
    },
    basicInfoS() {
      // 基本信息模块二
      return this.getGroups(this.userInfo, 'tc_patient_info')[1];
    },
    basicInfoT() {
      // 基本信息模块三
      return this.getGroups(this.userInfo, 'tc_patient_info')[2];
    },
    diseaseInfoF() {
      // 患病信息模块一
      return this.getGroups(this.userInfo, 'tc_patient_disease_info')[0];
    },
    diseaseInfoS() {
      // 患病信息模块二
      return this.getGroups(this.userInfo, 'tc_patient_disease_info')[1];
    },
    diseaseInfoT() {
      // 患病信息模块三
      return this.getGroups(this.userInfo, 'tc_patient_disease_info')[2];
    },
    medHistoryList() {
      // 用药史
      return this.getGroups(this.userInfo, 'tc_patient_medhistory')[0];
    },
    diseaseHistoryList() {
      // 既往史
      return this.getGroups(this.userInfo, 'tc_patient_disease')[0];
    },
    familyHistoryList() {
      // 家族史
      return this.getGroups(this.userInfo, 'tc_family_history')[0];
    },
    coffeeHistoryList() {
      // 咖啡史
      return this.getGroups(this.userInfo, 'tc_patient_coffee')[0];
    },
    smokeHistoryList() {
      // 吸烟史
      return this.getGroups(this.userInfo, 'tc_patient_smoke')[0];
    },
    wineHistoryList() {
      // 饮酒史
      return this.getGroups(this.userInfo, 'tc_patient_wine')[0];
    },
    teaHistoryList() {
      // 喝茶史
      return this.getGroups(this.userInfo, 'tc_patient_tea')[0];
    },
    exerciseHistoryList() {
      // 锻炼史
      return this.getGroups(this.userInfo, 'tc_patient_exercise')[0];
    },
    toxicExposureHistoryList() {
      // 毒物接触史
      return this.getGroups(this.userInfo, 'tc_cideexposed_history')[0];
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@tabs-wrapper-height: 15px;
@table-head-height: 57px;
.department-wrapper {
  position: relative;
  height: calc(~"100% - @{table-head-height}");
  .scroll-wrapper {
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
}
</style>
