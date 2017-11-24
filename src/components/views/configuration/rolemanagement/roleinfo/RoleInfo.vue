<template lang="html">
  <div class="role-info">
    <div class="header">
      <h3 class="title">角色信息</h3>
      <h5 class="date">创建时间：2017-07-07</h5>
      <div v-show="mode===READING_MODE" class="button edit-button" @click="edit">编辑</div>
      <div v-show="mode===EDITING_MODE" class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode===EDITING_MODE" class="button submit-button" @click="submit">完成</div>
    </div>
    <div class="info-wrapper" ref="scrollArea">
      <div class="content">
        <div class="field">
          <span class="field-name">角色名称:</span>
          <span class="field-value" v-show="mode===READING_MODE">管理员</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input></el-input>
          </span>
        </div>
        <div class="field explain" v-show="mode===EDITING_MODE">系统默认角色，不可修改名称</div>
        <div class="sub-title-bar">
          <h4 class="sub-title">成员列表</h4>
        </div>
        <table class="role-member-panel">
          <tr class="row title-row">
            <td class="col">序号</td>
            <td class="col">姓名</td>
            <td class="col">账号</td>
            <td class="col">创建时间</td>
            <td class="col">科室</td>
            <td class="col">职称</td>
            <td class="col">操作</td>
          </tr>
          <tr class="row">
            <td class="col">1</td>
            <td class="col">张三</td>
            <td class="col">zhangsan</td>
            <td class="col">2017-9-1</td>
            <td class="col">神经内科</td>
            <td class="col">科室主任</td>
            <td class="col">操作</td>
          </tr>
          <tr class="row">
            <td class="col">2</td>
            <td class="col">张三</td>
            <td class="col">zhangsan</td>
            <td class="col">2017-9-1</td>
            <td class="col">神经内科</td>
            <td class="col">科室主任</td>
            <td class="col">操作</td>
          </tr>
        </table>
      </div>
      <div class="content">
        <h2 class="title">权限管理</h2>
        <div class="sub-title-bar">
          <h4 class="sub-title">患者管理-我的患者-个人信息</h4>
        </div>
        <table class="role-member-panel">
          <tr class="row title-row">
            <td class="col">功能名称</td>
            <td class="col">创建</td>
            <td class="col">浏览</td>
            <td class="col">编辑</td>
            <td class="col">导出</td>
            <td class="col">导入</td>
            <td class="col">删除</td>
          </tr>
          <tr class="row">
            <td class="col">
              创建患者
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              基础信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              病症信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              其它信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              创建信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              分组信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
        </table>
        <div class="sub-title-bar">
          <h4 class="sub-title">患者管理-我的患者-诊断信息</h4>
        </div>
        <table class="role-member-panel">
          <tr class="row title-row">
            <td class="col">功能名称</td>
            <td class="col">创建</td>
            <td class="col">浏览</td>
            <td class="col">编辑</td>
            <td class="col">导出</td>
            <td class="col">导入</td>
            <td class="col">删除</td>
          </tr>
          <tr class="row">
            <td class="col">
              基础情况
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              病症情况
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              治疗方案
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              医学量表
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              检验检查
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              其它记录
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
        </table>
        <div class="sub-title-bar">
          <h4 class="sub-title">患者管理-分组管理</h4>
        </div>
        <table class="role-member-panel">
          <tr class="row title-row">
            <td class="col">功能名称</td>
            <td class="col">创建</td>
            <td class="col">浏览</td>
            <td class="col">编辑</td>
            <td class="col">导出</td>
            <td class="col">导入</td>
            <td class="col">删除</td>
          </tr>
          <tr class="row">
            <td class="col">
              创建分组
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              分组详情
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
        </table>
        <div class="sub-title-bar">
          <h4 class="sub-title">患者管理-科室患者</h4>
        </div>
        <table class="role-member-panel">
          <tr class="row title-row">
            <td class="col">功能名称</td>
            <td class="col">创建</td>
            <td class="col">浏览</td>
            <td class="col">编辑</td>
            <td class="col">导出</td>
            <td class="col">导入</td>
            <td class="col">删除</td>
          </tr>
          <tr class="row">
            <td class="col">
              个人信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              诊断信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              创建信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              分组信息
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
        </table>
        <div class="sub-title-bar">
          <h4 class="sub-title">统计分析-基础统计</h4>
        </div>
        <table class="role-member-panel">
          <tr class="row title-row">
            <td class="col">功能名称</td>
            <td class="col">创建</td>
            <td class="col">浏览</td>
            <td class="col">编辑</td>
            <td class="col">导出</td>
            <td class="col">导入</td>
            <td class="col">删除</td>
          </tr>
          <tr class="row">
            <td class="col">
              患者统计
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              量表统计
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
          <tr class="row">
            <td class="col">
              药物统计
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
            <td class="col">
              <el-checkbox :disabled="mode!==EDITING_MODE"></el-checkbox>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      mode: this.READING_MODE
    };
  },
  computed: {

  },
  methods: {
    edit() {
      this.mode = this.EDITING_MODE;
      this.updateScrollbar();
    },
    cancel() {
      this.mode = this.READING_MODE;
      this.updateScrollbar();
    },
    submit() {
      this.mode = this.READING_MODE;
      this.updateScrollbar();
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    }
  },
  mounted() {
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@header-height: 40px;
@margin-right: 15px;
@field-height: 40px;
@field-name-width: 80px;

.role-info {
  background-color: @screen-color;
  min-width: @min-screen-width - @sidebar-width - @bar-width;
  .header {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    height: @header-height;
    background-color: @background-color;
    .title {
      display: inline-block;
      position: absolute;
      margin: 0;
      left: 20px;
      height: @header-height;
      line-height: @header-height;
      text-align: left;
      font-size: @large-font-size;
      cursor: pointer;
      color: @font-color;
    }
    .date {
      display: inline-block;
      position: absolute;
      margin: 0;
      left: 120px;
      height: @header-height;
      line-height: @header-height;
      text-align: left;
      font-size: @normal-font-size;
      font-weight: normal;
      cursor: pointer;
      color: @light-font-color;
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      font-size: @normal-font-size;
      color: @button-font-color;
      text-align: center;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.edit-button {
        right: 10px;
        background-color: @button-color;
      }
      &.cancel-button {
        right: 30px + @small-button-width;
        background-color: @light-font-color;
      }
      &.submit-button {
        right: 10px;
        background-color: @button-color;
      }
    }
  }
  .info-wrapper {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{header-height} - @{vertical-spacing}");
    overflow: hidden;
    .content {
      position: relative;
      margin: 0 @margin-right @vertical-spacing 0;
      padding: 25px;
      background-color: @background-color;
      font-size: 0;
      text-align: left;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        line-height: @field-height;
        font-size: @normal-font-size;
        text-align: left;
        &.explain {
          color: @inverse-font-color;
        }
        .field-name {
          display: inline-block;
          width: @field-name-width;
          color: @font-color;
        }
        .field-value {
          display: inline-block;
          position: absolute;
          left: @field-name-width;
          right: 8%;
          color: @light-font-color;
        }
        .field-input {
          display: inline-block;
          position: absolute;
          top: 0;
          left: @field-name-width;
          right: 8%;
          line-height: @field-height;
          overflow: visible;
          .el-input {
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
        }
      }
      .title {
        margin: 0;
        font-size: @large-font-size;
        color: @font-color;
      }
      .sub-title-bar {
        position: relative;
        margin: 10px 0 5px;
        height: @field-height;
        line-height: @field-height;
        .sub-title {
          margin: 0;
          font-size: @normal-font-size;
          color: @font-color;
        }
      }
      .role-member-panel {
        margin: 0 0 10px;
        width: 100%;
        border: 1px solid @inverse-font-color;
        border-spacing: 0;
        .row {
          position: relative;
          height: 35px;
          font-size: @normal-font-size;
          color: @font-color;
          &.title-row {
            background-color: @font-color;
            color: #fff;
            .col:before {
              content: " ";
              position: absolute;
              width: 2px;
              background: url("~img/border.png") no-repeat;
              height: 23px;
              top: 6px;
              left: 100%;
            }
            .col:last-child:before {
              display: none;
            }
          }
          .col {
            position: relative;
            width: 100px;
            text-align: center;
          }
        }
      }
    }
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
}
</style>
