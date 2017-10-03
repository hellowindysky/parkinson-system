<template lang="html">
  <div class="item" :class="{'current': selected}" @click="select">
    <img class="image" src="~img/profile.png" alt="">
    <div class="name">{{patient.name}}</div>
    <div class="date">{{patient.createDate}}</div>
    <div class="age">{{patient.age}}岁</div>
    <div class="gender iconfont icon-male" :class="genderIcon"></div>
    <div class="location">{{patient.homeProvince}}</div>
  </div>
</template>

<script>
export default {
  props: {
    patient: {
      type: Object
    }
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断自己是否被选择
    selected() {
      var path = this.$route.path;
      var re = new RegExp('^\/patients\/list\/' + this.patient.patientId);
      if (re.test(path)) {
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
    }
  },
  mounted() {
  },
  methods: {
    select() {
      this.$router.push({
        name: 'patientInfo',
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
