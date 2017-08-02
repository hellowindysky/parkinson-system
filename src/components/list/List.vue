<template lang="html">
  <div class="list">
    <div class="search-area">
      <span class="iconfont icon-search"></span>
      <input class="search-input" placeholder="请输入姓名或身份证号" v-model="searchInput" @input="search"></input>
    </div>
    <div class="control-area">
      <div class="filter-button" @click="togglePanelDisplay">
        筛选
        <span class="iconfont" :class="togglePanelIcon"></span>
      </div>
      <div class="num-info">{{totalNumText}}</div>
    </div>

    <div class="list-area" ref="listArea">
      <div v-if="this.listType === 'patients'">
        <patient-list-item class="item" :id="10001"></patient-list-item>
        <patient-list-item class="item" :id="10002"></patient-list-item>
        <patient-list-item class="item" :id="10003"></patient-list-item>
        <patient-list-item class="item" :id="10004"></patient-list-item>
        <patient-list-item class="item" :id="10005"></patient-list-item>
        <patient-list-item class="item" :id="10006"></patient-list-item>
        <patient-list-item class="item" :id="10007"></patient-list-item>
        <patient-list-item class="item" :id="10008"></patient-list-item>
        <patient-list-item class="item" :id="10009"></patient-list-item>
        <patient-list-item class="item" :id="10010"></patient-list-item>
        <patient-list-item class="item" :id="10011"></patient-list-item>
        <patient-list-item class="item" :id="10012"></patient-list-item>
      </div>
      <div class="list-area" v-else-if="this.listType === 'groups'">
        <group-list-item :id="90001"></group-list-item>
        <group-list-item :id="90002"></group-list-item>
        <group-list-item :id="90003"></group-list-item>
      </div>
      <div class="list-area" v-else-if="this.listType === 'otherPatients'">
        <patient-list-item :id="20001"></patient-list-item>
        <patient-list-item :id="20002"></patient-list-item>
      </div>
    </div>

    <div class="function-area">
      <div class="function-button left">
        <span class="iconfont icon-new-patient"></span>
        <span class="text">新增患者</span>
      </div>
      <div class="function-button right">
        <span class="iconfont icon-import"></span>
        <span class="text">批量导入</span>
      </div>
    </div>

    <transition name="slide-fade">
      <el-form class="filter-panel" :model="filterPatientsForm" :rules="rules" ref="filterPatientsForm"
      label-width="20%"  v-show="panelDisplay" v-if="this.listType === 'patients' || this.listType === 'otherPatients'">
        <el-form-item label="分组" prop="group" class="item">
          <el-select v-model="filterPatientsForm.group">
            <el-option label="不限" value="all"></el-option>
            <el-option label="FOG1组" value="fog1"></el-option>
            <el-option label="FOG2组" value="fog2"></el-option>
            <el-option label="帕金森1组" value="parkinson1"></el-option>
            <el-option label="一个名字很长很长很长很长很长很长很长很长的组" value="longName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender" class="item">
          <el-select v-model="filterPatientsForm.gender">
            <el-option label="不限" value="all"></el-option>
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="district" class="item">
          <el-select v-model="filterPatientsForm.district">
            <el-option label="不限" value="all"></el-option>
            <el-option label="北京" value="北京"></el-option>
            <el-option label="天津" value="天津"></el-option>
            <el-option label="上海" value="上海"></el-option>
            <el-option label="深圳" value="深圳"></el-option>
            <el-option label="武汉" value="武汉"></el-option>
            <el-option label="杭州" value="杭州"></el-option>
            <el-option label="广州" value="广州"></el-option>
            <el-option label="成都" value="成都"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="病程" class="item">
          <el-col :span="8">
            <el-form-item prop="minCourseYear">
              <el-input v-model.number="filterPatientsForm.minCourseYear" :min="0" :max="120" placeholder="不限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">年 -</el-col>
          <el-col :span="8">
            <el-form-item prop="maxCourseYear">
              <el-input v-model.number="filterPatientsForm.maxCourseYear" :min="0" :max="120" placeholder="不限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">年</el-col>
        </el-form-item>
        <el-form-item label="年龄" class="item">
          <el-col :span="8">
            <el-form-item prop="minAge">
              <el-input v-model.number="filterPatientsForm.minAge" :min="0" :max="120" placeholder="不限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">岁 -</el-col>
          <el-col :span="8">
            <el-form-item prop="maxAge">
              <el-input v-model.number="filterPatientsForm.maxAge" :min="0" :max="120" placeholder="不限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">岁</el-col>
        </el-form-item>
        <el-form-item class="item" label-width="0">
          <el-button @click="resetForm('filterPatientsForm')" class="button reset">重置</el-button>
          <el-button type="primary" @click="submitForm('filterPatientsForm')" class="button apply">应用</el-button>
        </el-form-item>
      </el-form>

      <el-form class="filter-panel" :model="filterGroupsForm" :rules="rules" ref="filterGroupsForm"
      label-width="20%" v-show="panelDisplay" v-else-if="this.listType === 'groups'">
        <el-form-item label="分类" prop="category" class="item">
          <el-select v-model="filterGroupsForm.category">
            <el-option label="不限" value="all"></el-option>
            <el-option label="临床" value="clinical"></el-option>
            <el-option label="科研" value="research"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item" label-width="0">
          <el-button @click="resetForm('filterPatientsForm')" class="button reset">重置</el-button>
          <el-button type="primary" @click="submitForm('filterPatientsForm')" class="button apply">应用</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';

import patientListItem from 'components/patientitem/PatientItem';
import groupListItem from 'components/groupitem/GroupItem';

export default {
  data() {
    // 自定义校验规则，可以为空，数值在 0 ~ 120 之间
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'));
        } else {
          if (value < 0 || value > 120) {
            callback(new Error('0~120之间'));
          } else {
            callback();
          }
        }
      }, 0);
    };
    return {
      searchInput: '',
      panelDisplay: false,
      filterPatientsForm: {
        group: 'all',
        gender: 'all',
        district: 'all',
        minAge: '',
        maxAge: '',
        minCourseYear: '',
        maxCourseYear: '',
        followUp: false
      },
      filterGroupsForm: {
        category: '不限'
      },
      rules: {
        minCourseYear: [
          { validator: checkNum, trigger: 'change' }
        ],
        maxCourseYear: [
          { validator: checkNum, trigger: 'change' }
        ],
        minAge: [
          { validator: checkNum, trigger: 'change' }
        ],
        maxAge: [
          { validator: checkNum, trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    // 根据路由信息对象提供的当前路径，来判断列表类型
    listType() {
      var path = this.$route.path;
      if (/^\/patients\/list/.test(path)) {
        return 'patients';
      } else if (/^\/patients\/groups/.test(path)) {
        return 'groups';
      } else if (/^\/patients\/otherList/.test(path)) {
        return 'otherPatients';
      }
    },
    totalNumText() {
      if (this.listType === 'patients') {
        return '患者：345人';
      } else if (this.listType === 'groups') {
        return '分组：19个';
      } else if (this.listType === 'otherPatients') {
        return '患者：2568人';
      }
    },
    togglePanelIcon() {
      return this.panelDisplay ? 'icon-up' : 'icon-down';
    }
  },
  mounted() {
    // 如果之前有绑定的话，先进行解除
    Ps.destroy(this.$refs.listArea);
    Ps.initialize(this.$refs.listArea, {
      wheelSpeed: 1,
      minScrollbarLength: 40
    });
    // this.$refs.listArea.scrollTop = 20;
    // Ps.update(this.$refs.listArea);
  },
  methods: {
    search() {
      // console.log(this.searchInput);
    },
    togglePanelDisplay() {
      this.panelDisplay = !this.panelDisplay;
    },
    selectFirstItem() {
      // 列表类型切换时，判断当前列表类型，然后自动跳转到该列表下第一个选项
      if (this.listType === 'patients') {
        // TODO 获取病患列表的所有id，然后根据第一个id进行跳转
        this.$router.replace({ name: 'patientInfo', params: { id: 10001 }});

      } else if (this.listType === 'groups') {
        // TODO 获取分组列表的所有id，然后根据第一个id进行跳转
        this.$router.replace({ name: 'groupInfo', params: { id: 90001 }});

      } else if (this.listType === 'otherlist') {
        // TODO 获取科室患者列表的所有id，然后根据第一个id进行跳转
        this.$router.replace({ name: 'otherPatientInfo', params: { id: 20001 }});
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.togglePanelDisplay();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交新的筛选条件，发出post请求
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      this.togglePanelDisplay();
    }
  },
  components: {
    patientListItem,
    groupListItem
  },
  watch: {
    $route() {
      // 路由一旦发生变化，就关闭筛选面板
      this.panelDisplay = false;

      // 一旦发现路由地址中还没有id，就默认加载当前列表中的第一项
      var path = this.$route.path;
      if (/^\/patients\/list$/.test(path)) {
        // TODO 获取病患列表的所有id，然后根据第一个id进行跳转
        this.$router.replace({ name: 'patientInfo', params: { id: 10001 }});

      } else if (/^\/patients\/groups$/.test(path)) {
        // TODO 获取分组列表的所有id，然后根据第一个id进行跳转
        this.$router.replace({ name: 'groupInfo', params: { id: 90001 }});

      } else if (/^\/patients\/otherlist$/.test(path)) {
        // TODO 获取科室患者列表的所有id，然后根据第一个id进行跳转
        this.$router.replace({ name: 'otherPatientInfo', params: { id: 20001 }});
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@search-area-height: 40px;
@control-area-height: 35px;
@function-area-height: 45px;
@vertical-spacing: 5px;

@list-left-padding: 8px;
@list-right-padding: 0px;

@filter-text-height: 30px;

.list {
  box-sizing: border-box;
  background-color: @screen-color;
  padding-left: @list-left-padding;
  padding-right: @list-right-padding;
  overflow: hidden;
  .search-area {
    position: relative;
    margin-bottom: @vertical-spacing;
    width: 100%;
    height: @search-area-height;
    padding-top: 10px;
    padding-left: 15px;
    box-sizing: border-box;
    // box-shadow: 2px 2px 2px @light-gray-color;
    background-color: @background-color;
    font-size: @normal-font-size;
    color: @light-font-color;
    z-index: 200;
    .iconfont {
      float: left;
      padding-right: 10px;
      line-height: 1.9 * @normal-font-size;
      vertical-align: middle;
    }
    .search-input {
      float: left;
      width: 180px;
      padding-left: 10px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid @light-gray-color;
      line-height: 1.6 * @normal-font-size;
      vertical-align: middle;
      color: @light-font-color;
      outline: none;
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
      color: darken(@light-gray-color, 20%);
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: darken(@light-gray-color, 20%);
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: darken(@light-gray-color, 20%);
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: darken(@light-gray-color, 20%);
    }
  }
  .control-area {
    position: relative;
    margin-bottom: @vertical-spacing;
    width: 100%;
    height: @control-area-height;
    background-color: @background-color;
    box-sizing: border-box;
    // box-shadow: 2px 2px 2px @light-gray-color;
    font-size: @normal-font-size;
    text-align: left;
    z-index: 200;
    .filter-button {
      position: absolute;
      display: inline-block;
      left: 0;
      width: 30%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      line-height: @control-area-height;
      cursor: pointer;
      &:hover {
        color: lighten(@font-color, 20%);
      }
      .iconfont {
        padding-left: 5px;
        font-size: @normal-font-size;
        font-weight: bold;
        vertical-align: middle;
        color: @button-color;
      }
    }
    .num-info {
      position: absolute;
      display: inline-block;
      right: 0;
      width: 50%;
      height: 100%;
      padding-right: 10px;
      box-sizing: border-box;
      line-height: @control-area-height;
      text-align: right;
      cursor: default;
    }
  }
  .function-area {
    position: relative;
    bottom: 0;
    margin-top: @vertical-spacing;
    width: 100%;
    height: @function-area-height;
    background-color: @background-color;
    box-sizing: border-box;
    // box-shadow: 2px 2px 2px @light-gray-color;
    font-size: @normal-font-size;
    vertical-align: middle;
    .function-button {
      float: left;
      margin-top: @function-area-height * 0.15;
      margin-bottom: @function-area-height * 0.15;
      width: 50%;
      height: 70%;
      box-sizing: border-box;
      line-height: @function-area-height * 0.7;
      cursor: pointer;
      &.left {
        border-right: 1px solid @light-gray-color;
      }
      &:hover {
        opacity: 0.8;
      }
      .iconfont {
        font-size: 24px;
        line-height: 20px;
        vertical-align: middle;
      }
    }
  }
  .list-area {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{search-area-height} - @{control-area-height} - @{function-area-height} - @{vertical-spacing} * 3");
    background-color: @background-color;
    // box-shadow: 2px 2px 2px @light-gray-color;
    overflow: hidden;
    .item {
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: darken(@background-color, 2%);
      }
      &.current {
        background-color: darken(@background-color, 8%);
        &:hover {
          background-color: darken(@background-color, 8%);
        }
      }
    }
    // 下面这组 CSS 是为了让 perfect-scrollbar正常工作的，不知道为什么，默认状态下这个组件不能正常显示
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
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

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0.42,0,1,1);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-@control-area-height);
    opacity: 0;
  }
  .filter-panel {
    position: absolute;
    top: @search-area-height + @control-area-height + @vertical-spacing;
    margin-right: @list-right-padding;
    width: calc(~"100% - @{list-left-padding} - @{list-right-padding}");
    height: calc(~"100% - @{search-area-height} - @{control-area-height} - @{vertical-spacing}");
    padding-top: 20px;
    background-color: @theme-color;
    font-size: @normal-font-size;
    color: @inverse-font-color;
    z-index: 150;
    .item {
      padding-left: 10px;
      padding-right: 10px;
      .el-form-item__label {
        color: @inverse-font-color;
      }
      .el-form-item__content input{
        // background-color: #414a54;
      }
      .button {
        margin: 30px 10px;
        width: 35%;
        border: none;
        color: @button-font-color;
        &.reset {
          background-color: @secondary-button-color;
        }
        &.apply {
          background-color: @button-color;
        }
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
