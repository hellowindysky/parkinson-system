<template>
    <div class='diction-manage-wrapper'>
        <ul class='diction-topbar'>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'diagnosisdata'}" @click="chooseMinepait" >诊断信息资料库</li>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'personalinformationdata'}" @click="chooseGroupmana">个人信息资料库</li>
            <li class='topbar-item' :class="{'current-top-item': currentTopItem === 'patientdatabase'}" @click="chooseDepartment" >患者资料库</li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>

export default {
  computed: {
    currentTopItem() {
      var path = this.$route.path;
      if (/\/diagnosisdata/.test(path)) {
        return 'diagnosisdata';
      } else if (/\/personalinformationdata/.test(path)) {
        return 'personalinformationdata';
      } else if (/\/patientdatabase/.test(path)) {
        return 'patientdatabase';
      }
    }
  },
  methods: {
    chooseMinepait() {
      if (!/\/dictionaryManagement\/diagnosisdata/.test(this.$route.path)) {
        this.$router.push({ name: 'diagnosisdata' });
      }
    },
    chooseGroupmana() {
      if (!/\/dictionaryManagement\/personalinformationdata/.test(this.$route.path)) {
        this.$router.push({ name: 'personalinformationdata' });
      }
    },
    chooseDepartment() {
      if (!/\/dictionaryManagement\/patientdatabase/.test(this.$route.path)) {
        this.$router.push({ name: 'patientdatabase' });
      }
    }
    // checkRoute() {
    //   var path = this.$route.path;
    //   var reList = new RegExp(/\/dictionaryManagement\/diagnosisdata/);
    //   var isConfigPatientsList = reList.test(path);
    //   // 路由还停留在在配置我的患者这一层，但没有指明是个人信息还是诊断信息，那么就默认跳转到个人信息
    //   if (isConfigPatientsList) {
    //     this.$router.push({ name: 'configpersonalinf' });
    //   }
    // }
  },
  mounted() {
    if (!/\/dictionaryManagement\/diagnosisdata/.test(this.$route.path)) {
      this.$router.push({ name: 'diagnosisdata' });
    }
    // this.checkRoute();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
@first-bar-height: 60px;
.diction-manage-wrapper {
    margin: 0 12px;
    z-index: 200;
    .diction-topbar {
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
