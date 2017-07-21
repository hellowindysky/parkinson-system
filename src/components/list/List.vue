<template lang="html">
  <div class="list">
    <div class="top-area">
      <div class="num-info">{{totalNumText}}</div>
      <div class="filter-button" @click="togglePanelDisplay" :class="{'active': panelDisplay}">
        筛选条件
        <span class="iconfont icon-moreunfold"></span>
      </div>
    </div>
    <div class="search-area">
      <el-input class="search-input" size="small" placeholder="请输入姓名或身份证号" icon="search" v-model="searchInput" :on-icon-click="clickSearchIcon"></el-input>
    </div>

    <div class="list-area" v-if="this.listType === 'patients'">
      <patientListItem :id="10001"></patientListItem>
      <patientListItem :id="10002"></patientListItem>
    </div>
    <div class="list-area" v-else-if="this.listType === 'groups'">
      <groupListItem :id="90001"></groupListItem>
      <groupListItem :id="90002"></groupListItem>
      <groupListItem :id="90003"></groupListItem>
    </div>
    <div class="list-area" v-if="this.listType === 'otherPatients'">
      <patientListItem :id="20001"></patientListItem>
      <patientListItem :id="20002"></patientListItem>
    </div>

    <transition name="slide-fade">
      <el-form class="filter-panel" :model="filterPatientsForm" :rules="rules" ref="filterPatientsForm"
      label-width="20%"  v-show="panelDisplay" v-if="this.listType === 'patients' || this.listType === 'otherPatients'">
        <el-form-item label="" prop="group" class="item">
          <label class="alterLabel">分组</label>
          <el-select v-model="filterPatientsForm.group">
            <el-option label="不限" value="all"></el-option>
            <el-option label="FOG1组" value="fog1"></el-option>
            <el-option label="FOG2组" value="fog2"></el-option>
            <el-option label="帕金森1组" value="parkinson1"></el-option>
            <el-option label="一个名字很长很长很长很长很长很长很长很长的组" value="longName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="gender" class="item">
          <label class="alterLabel">性别</label>
          <el-select v-model="filterPatientsForm.gender">
            <el-option label="不限" value="all"></el-option>
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="district" class="item">
          <label class="alterLabel">地区</label>
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
        <el-form-item label="" class="item">
          <label class="alterLabel">病程</label>
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
        <el-form-item label="" class="item">
          <label class="alterLabel">年龄</label>
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
          <el-button @click="resetForm('filterPatientsForm')" class="button">重置</el-button>
          <el-button type="primary" @click="submitForm('filterPatientsForm')" class="button">应用</el-button>
        </el-form-item>
      </el-form>

      <el-form class="filter-panel" :model="filterGroupsForm" :rules="rules" ref="filterGroupsForm"
      label-width="20%"  v-show="panelDisplay" v-else-if="this.listType === 'groups'">
        <el-form-item label="" prop="category" class="item">
          <label class="alterLabel">分类</label>
          <el-select v-model="filterGroupsForm.category">
            <el-option label="不限" value="all"></el-option>
            <el-option label="临床" value="clinical"></el-option>
            <el-option label="科研" value="research"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item" label-width="0">
          <el-button @click="resetForm('filterPatientsForm')" class="button">重置</el-button>
          <el-button type="primary" @click="submitForm('filterPatientsForm')" class="button">应用</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script>
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
      } else if (/^\/patients\/otherlist/.test(path)) {
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
    }
  },
  mounted() {

  },
  methods: {
    clickSearchIcon(event) {
      console.log(event);
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

<style lang="less" scoped>
@import "~styles/variables.less";
@top-area-height: 40px;
@filter-text-height: 30px;

.list {
  box-sizing: border-box;
  background-color: #eee;
  overflow: hidden;
  .top-area {
    position: relative;
    width: 100%;
    height: @top-area-height;
    background-color: #e0e0e0;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    font-size: @normal-font-size;
    text-align: left;
    .num-info {
      position: absolute;
      display: inline-block;
      left: 0;
      width: 50%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      line-height: @top-area-height;
      cursor: default;
    }
    .filter-button {
      position: absolute;
      display: inline-block;
      left: 50%;
      width: 50%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      line-height: @top-area-height;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.active {
        background-color: #aaa;
      }
      .iconfont {
        padding-left: 20px;
        font-size: @large-font-size;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
  .search-area {
    position: relative;
    width: 100%;
    height: 36px;
    padding: 3px 5px;
    box-sizing: border-box;
    background-color: #ccc;
    .search-input {
      // width: calc(~"100% - 20px");
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0.42,0,1,1);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(200px);
    opacity: 0;
  }
  .filter-panel {
    position: absolute;
    top: @top-area-height;
    width: 100%;
    height: calc(~"100% - @{top-area-height}");
    padding-top: 20px;
    background-color: rgba(32,32,32,0.9);
    font-size: @normal-font-size;
    z-index: 150;
    .item {
      padding-left: 10px;
      padding-right: 10px;
      color: #fff;
      // 控件自带label，但是没找到单独调节颜色的办法，所以想办法插入了一个自定义的label
      .alterLabel {
        position: absolute;
        left: -22%;
      }
      .button {
        margin: 30px 10px;
        width: 35%;
      }
    }
  }
}
</style>
