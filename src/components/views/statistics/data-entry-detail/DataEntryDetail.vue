<template lang="html">
  <div class="data-entry-detail" ref="dataEntryDetail">
    <div class="condition-bar" ref="conditionBar">
      <div class="field">
        <span class="field-name">
          医&nbsp;&nbsp;&nbsp;&nbsp;院
        </span>
        <span class="field-input">
          <el-input v-model="hospitalName" placeholder="请输入医院名称"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          医&nbsp;&nbsp;&nbsp;&nbsp;生
        </span>
        <span class="field-input">
          <el-input v-model="doctorName" placeholder="请输入医生姓名"></el-input>
        </span>
      </div>
      <div class="field long-field" v-if="type === 'dataEntryDetail'">
        <span class="field-name">
          录入时间
        </span>
        <span class="field-input">
          <el-date-picker
            class="date-picker"
            v-model="startTime"
            type="date"
            placeholder="请选择日期"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions">
          </el-date-picker>
          <span class="middle-text">~</span>
          <el-date-picker
            class="date-picker"
            v-model="endTime"
            type="date"
            placeholder="请选择日期"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions">
          </el-date-picker>
        </span>
      </div>
      <div class="field" v-else-if="type === 'historyStatistics'">
        <span class="field-name">
          录入月份
        </span>
        <span class="field-input">
          <el-date-picker v-model="month" placeholder="请选择录入月份"
            :editable="false" :clearable="false" type="month" :picker-options="pickerOptions">
          </el-date-picker>
        </span>
      </div>
      <div class="button-wrapper">
        <div class="button query" @click="updateFormData">
          查询
        </div>
        <div class="button reset" @click="resetConditions">
          重置
        </div>
      </div>
    </div>
    <div class="menu-bar" :class="{'disabled-to-select': updatingFormData}">
      <el-tabs v-model="activeTab">
        <el-tab-pane :key="item.name" v-for="(item, index) in availableTabs"
          :label="item.title" :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="form-wrapper" ref="formWrapper">
      <custom-table :tableData="tableData"></custom-table>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Util from 'utils/util';
import { getStatisticsData, getStatisticsDetail, getScaleDetail, queryEntryMonth } from 'api/statistics';

const customTable = () => import(/* webpackChunkName: 'statistics' */ 'public/custom-table/CustomTable');

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      hospitalName: '',
      doctorName: '',
      startTime: '',
      endTime: '',
      month: '',
      selectableMonth: [],
      pickerOptions: {
        disabledDate: this.checkIfDisabledDate
      },
      activeTab: '',
      updatingFormData: false,
      supportedDoctorNumber: '',
      tableData: {}
    };
  },
  computed: {
    availableTabs() {
      if (this.type === 'dataEntryDetail') {
        return [{
          title: '录入有效分析',
          name: 'first'
        }];
      } else if (this.type === 'historyStatistics') {
        return [
          {
            title: '当期录入有效分析',
            name: 'second'
          },
          {
            title: '当期录入明细',
            name: 'third'
          },
          {
            title: '当期量表明细',
            name: 'fourth'
          }
        ];
      } else {
        return [];
      }
    }
  },
  methods: {
    initDate() {
      var now = new Date();
      this.endTime = now;
      this.startTime = new Date(now.getTime() - 24 * 3600 * 1000);

      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      month = month < 10 ? '0' + month : '' + month;
      this.month = year + '-' + month;
    },
    querySelectableMonth() {
      queryEntryMonth().then((data) => {
        this.selectableMonth = data;
      }, (error) => {
        console.log(error);
      });
    },
    checkIfDisabledDate(time) {
      // var isFuture = time.getTime() > Date.now();

      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      month = month < 10 ? '0' + month : '' + month;
      var str = year + '-' + month;

      if (this && this.selectableMonth) {
        return !(this.selectableMonth.indexOf(str) >= 0);
      } else {
        return true;
      }

    },
    modifyFormWrapperTop() {
      // 动态调整菜单栏的高度
      this.$nextTick(() => {
        var refs = this.$refs;
        var dataEntryDetail = refs ? refs.dataEntryDetail : null;
        var conditionBar = refs ? refs.conditionBar : null;
        var formWrapper = refs ? refs.formWrapper : null;
        if (dataEntryDetail && conditionBar && formWrapper) {
          // 50 是 menuBar 的高度和它的 margin 之和
          var height = dataEntryDetail.offsetHeight - conditionBar.offsetHeight - 50;
          formWrapper.style.height = height + 'px';
        }
      });
    },
    updateActiveTab() {
      // 更新当前选中的标签
      // 首先将 activeTab 置空，因为旧的 tab 已经销毁，如果当前【选中状态】依然指向这个销毁的对象时，就会出错
      this.activeTab = '';

      // 之所以要把下面的逻辑包裹在 nextTick 中，是因为只有到了下个时钟周期，新的 tab 标签才会生成
      // 这个时候才能将【选中状态】赋给对应的新 tab
      // 否则会报警告信息，提示读取了 undefined 的某个属性（这个 undefined 就是还未生成的新 tab DOM）
      // 总之，这个问题的实质就是由 数据变化 和 视图实际变化 的异步关系所造成
      this.$nextTick(() => {
        if (this.type === 'dataEntryDetail') {
          this.activeTab = 'first';
        } else if (this.type === 'historyStatistics') {
          this.activeTab = 'second';
        }
      });
    },
    updateSupportedDoctorNumber() {
      var supportedDoctor = sessionStorage.getItem('supportedDoctor');
      if (supportedDoctor) {
        supportedDoctor = JSON.parse(supportedDoctor);
        this.supportedDoctorNumber = supportedDoctor.mobileNumber ? supportedDoctor.mobileNumber : '';
      } else {
        this.supportedDoctorNumber = '';
      }
    },
    updateFormData() {
      this.tableData = {
        template: [],
        data: []
      };

      var params = {};

      if (this.hospitalName) {
        params.hospitalName = this.hospitalName;
      }
      if (this.doctorName) {
        params.doctorName = this.doctorName;
      }

      var f = () => {};

      if (this.type === 'dataEntryDetail') {
        if (this.startTime) {
          params.startTime = Util.simplifyDate(this.startTime);
        }
        if (this.endTime) {
          params.endTime = Util.simplifyDate(this.endTime);
        }
        f = getStatisticsData;

      } else if (this.type === 'historyStatistics') {
        if (this.month) {
          var dateText = Util.simplifyDate(this.month);
          params.month = dateText.slice(0, 7);
        }
        if (this.activeTab === 'second') {
          f = getStatisticsData;
        } else if (this.activeTab === 'third') {
          f = getStatisticsDetail;
        } else if (this.activeTab === 'fourth') {
          f = getScaleDetail;
        } else {
          return;
        }

      } else {
        return;
      }

      this.updatingFormData = true;

      var options = {
        target: this.$refs.formWrapper,
        text: '正在加载',
        lock: true
      };
      let loadingInstance = this.$loading(options);

      f(params, this.supportedDoctorNumber).then((res) => {
        this.tableData = res;
        this.tableData.data = res.data && res.data[0] ? res.data : [];
        this.updateScrollbar();
        this.updatingFormData = false;
        loadingInstance.close();
      }, (error) => {
        console.log(error);
        this.updatingFormData = false;
        loadingInstance.close();
      });
    },
    resetConditions() {
      this.hospitalName = '';
      this.doctorName = '';
      this.startTime = '';
      this.endTime = '';
      this.tableData = {};  // 这样在请求返回之前，就不会显示之前的数据
      this.updateFormData();
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.formWrapper);
        Ps.initialize(this.$refs.formWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    }
  },
  mounted() {
    this.initDate();
    this.querySelectableMonth();

    window.onresize = () => {
      this.modifyFormWrapperTop();
      this.updateScrollbar();
    };
    this.modifyFormWrapperTop();
    this.updateScrollbar();

    this.updateSupportedDoctorNumber();

    this.updateActiveTab();
    this.updateFormData();
  },
  components: {
    customTable
  },
  watch: {
    type() {
      this.modifyFormWrapperTop();
      this.updateActiveTab();

      this.$refs.formWrapper.scrollTop = 0;
      this.$refs.formWrapper.scrollLeft = 0;
      this.updateScrollbar();
    },
    activeTab() {
      this.updateFormData();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-width: 240px;
@field-name-width: 60px;
@long-field-width: @field-width * 2 - @field-name-width;

.data-entry-detail {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: @screen-color;
  .condition-bar {
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: #fff;
    text-align: left;
    font-size: 0;
    .field {
      display: inline-block;
      position: relative;
      padding: 3px 0;
      width: @field-width;
      line-height: @field-line-height;
      box-sizing: border-box;
      text-align: left;
      vertical-align: top;
      &.long-field {
        width: @long-field-width;
        .field-input {
          width: @long-field-width - @field-name-width;
        }
      }
      .field-name {
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 0;
        width: @field-name-width;
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @font-color;
      }
      .field-input {
        display: inline-block;
        position: relative;
        left: @field-name-width;
        width: @field-width - @field-name-width;
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        .middle-text {
          display: inline-block;
          width: 20px;
          text-align: center;
        }
        .date-picker {
          width: @field-width - @field-name-width - 25px;;
        }
        .el-input {
          width: @field-width - @field-name-width - 25px;;
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
        }
      }
    }
    .button-wrapper {
      display: inline-block;
      .button {
        display: inline-block;
        position: relative;
        top: 3px;
        width: @small-button-width;
        height: @small-button-height;
        line-height: @small-button-height;
        font-size: @normal-font-size;
        color: #fff;
        text-align: center;
        cursor: pointer;
        &.query {
          margin-right: 15px;
          background-color: @button-color;
        }
        &.reset {
          background-color: @font-color;
        }
        &:hover {
          opacity: 0.6;
        }
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  .menu-bar {
    width: 100%;
    margin: 10px 0 0 0;
    // padding: 10px 20px;
    height: 40px;
    box-sizing: border-box;
    background-color: #fff;
    text-align: left;
    &.disabled-to-select {
      opacity: 0.6;
      pointer-events: none;
    }
    .el-tabs__header {
      margin-bottom: 0;
      .el-tabs__item {
        height: 40px;
        font-size: @large-font-size;
        font-weight: bold;
        color: @light-font-color;
        &.is-active {
          color: @button-color;
        }
      }
      .el-tabs__active-bar {
        background-color: @button-color;
      }
    }
    .el-tabs__content {
      display: none;
    }
    .tab {
      font-size: @large-font-size;
      font-weight: bold;
      color: @light-font-color;
      cursor: pointer;
    }
  }
  .form-wrapper {
    position: relative;
    height: 0;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    .ps__scrollbar-x-rail {
      position: absolute;
      height: 12px;
      bottom: 0;
      padding: 0;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s;
      .ps__scrollbar-x {
        position: relative;
        height: 100%;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 12px;
      right: 0;
      padding: 0;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-x-rail, .ps__scrollbar-y-rail {
        opacity: 0.6;
      }
    }
  }
}
</style>
