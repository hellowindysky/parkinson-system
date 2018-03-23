<template lang="html">
  <div class="data-entry-detail">
    <div class="condition-bar">
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
            :picker-options="pickerOptions">
          </el-date-picker>
          <span class="middle-text">~</span>
          <el-date-picker
            class="date-picker"
            v-model="endTime"
            type="date"
            placeholder="请选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </span>
      </div>
      <div class="field" v-else-if="type === 'historyStatistics'">
        <span class="field-name">
          录入月份
        </span>
        <span class="field-input">
          <el-date-picker v-model="month" placeholder="请选择录入月份" type="month"></el-date-picker>
        </span>
      </div>
      <div class="button-wrapper">
        <div class="button query">
          查询
        </div>
        <div class="button reset">
          重置
        </div>
      </div>
    </div>
    <div class="menu-bar" ref="menuBar">
      <el-tabs v-model="activeTab" @tab-click="handleClick" v-if="type==='dataEntryDetail'">
        <el-tab-pane label="录入有效分析" name="first">
          1
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeTab" @tab-click="handleClick" v-if="type==='historyStatistics'">
        <el-tab-pane label="当期录入有效分析" name="second">
          2
        </el-tab-pane>
        <el-tab-pane label="当期录入明细" name="third">
          3
        </el-tab-pane>
        <el-tab-pane label="当期量表明细" name="fourth">
          4
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="form-wrapper" ref="formWrapper">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hospitalName: '',
      doctorName: '',
      startTime: '',
      endTime: '',
      month: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      activeTab: 'first'
    };
  },
  computed: {
    type() {
      if (this.$route.matched.some(record => record.meta.dataEntryDetail)) {
        return 'dataEntryDetail';
      } else if (this.$route.matched.some(record => record.meta.historyStatistics)) {
        return 'historyStatistics';
      } else {
        return '';
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    modifyFormWrapperTop() {
      this.$nextTick(() => {
        var refs = this.$refs;
        var menuBar = refs ? refs.menuBar : null;
        var formWrapper = refs ? refs.formWrapper : null;
        if (menuBar && formWrapper) {
          var top = menuBar.offsetTop + 40;
          formWrapper.style.top = top + 'px';
        }
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.modifyFormWrapperTop();
    }, 1000);
    window.onresize = () => {
      this.modifyFormWrapperTop();
    };
  },
  watch: {
    type(newVal) {
      if (newVal === 'dataEntryDetail') {
        this.activeTab = 'first';
      } else if (newVal === 'historyStatistics') {
        this.activeTab = 'second';
      }
      this.modifyFormWrapperTop();
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
  width: 100%;
  height: 100%;
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
    position: absolute;
    top: 100%;
    bottom: 0;
    left: 15px;
    right: 15px;
    background-color: #fff;
  }
}
</style>
