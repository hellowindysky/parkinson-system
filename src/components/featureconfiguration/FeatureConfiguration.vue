<template>
    <div class='fConfig-wrapper'>
        <ul class='feature-topbar'>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'minepait'}" @click="chooseMinepait" >我的患者</li>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'groupmana'}" @click="chooseGroupmana">分组管理</li>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'department'}" @click="chooseDepartment" >科室患者</li>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'statisticalanalysis'}" @click="chooseStatisticalanalysis" >统计分析</li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>

export default {
  computed: {
    currentTopItem() {
      var path = this.$route.path;
      if (/\/minepait/.test(path)) {
        return 'minepait';
      } else if (/\/groupmana/.test(path)) {
        return 'groupmana';
      } else if (/\/department/.test(path)) {
        return 'department';
      } else if (/\/statisticalanalysis/.test(path)) {
        return 'statisticalanalysis';
      }
    }
  },
  methods: {
    chooseMinepait() {
      if (!/\/featureConfiguration\/minepait/.test(this.$route.path)) {
        this.$router.push({ name: 'minepait' });
      }
    },
    chooseGroupmana() {
      if (!/\/featureConfiguration\/groupmana/.test(this.$route.path)) {
        this.$router.push({ name: 'groupmana' });
      }
    },
    chooseDepartment() {
      if (!/\/featureConfiguration\/department/.test(this.$route.path)) {
        this.$router.push({ name: 'department' });
      }
    },
    chooseStatisticalanalysis() {
      if (!/\/featureConfiguration\/statisticalanalysis/.test(this.$route.path)) {
        this.$router.push({ name: 'statisticalanalysis' });
      }
    }
  },
  mounted() {
    if (!/^\/featureConfiguration\/minepait/.test(this.$route.path)) {
      this.$router.push({ name: 'minepait' });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.fConfig-wrapper {
    margin: 0 12px;
    z-index: 200;
    .feature-topbar {
        margin: 0;
        padding: 0;
        list-style: none;
        height: 60px;
        box-sizing: border-box;
        text-align: left;
        .topbar-item {
            position: relative;
            display: inline-block;
            text-align: center;
            width: @middle-button-width;
            height: @middle-button-height;
            margin: 10px 14px 0 14px;
            line-height: @middle-button-height;
            font-size: @large-font-size;
            border-radius: 20px;
            background: @table-middle-button-color;
            color: @button-font-color;
            cursor: pointer;
            &:hover {
                background-color: lighten(@table-middle-button-color, -10%);
            }
            &.current-top-item{
                background: @button-color;
            }
        }
    }
}
</style>
