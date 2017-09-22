<template lang="html">
  <div class="user-info">
    <div class="header">
      <h3 class="title">用户信息</h3>
      <h5 class="date">创建时间：2017-07-07</h5>
      <div v-show="mode===READING_MODE" class="button edit-button" @click="edit">编辑</div>
      <div v-show="mode===EDITING_MODE" class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode===EDITING_MODE" class="button submit-button" @click="submit">完成</div>
    </div>
    <div class="info-wrapper" ref="scrollArea">
      <div class="content">
        <div class="field">
          <span class="field-name">用户角色</span>
          <span class="field-value" v-show="mode===READING_MODE">管理员</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-select v-model="test">
              <el-option label="全部" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">用户状态</span>
          <span class="field-value" v-show="mode===READING_MODE">启用</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-select v-model="test">
              <el-option label="全部" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">用户名称</span>
          <span class="field-value" v-show="mode===READING_MODE">陈奕迅</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">用户账号</span>
          <span class="field-value" v-show="mode===READING_MODE">7a865rdf2</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">联系电话</span>
          <span class="field-value" v-show="mode===READING_MODE">13612344321</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">性别</span>
          <span class="field-value" v-show="mode===READING_MODE">启用</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-select v-model="test">
              <el-option label="全部" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="sub-title-bar">
          <h4 class="sub-title">执业情况</h4>
        </div>
        <div class="field whole-line">
          <span class="field-name">医院</span>
          <span class="field-value" v-show="mode===READING_MODE">北京市一个非常非常厉害的医院</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">所在科室</span>
          <span class="field-value" v-show="mode===READING_MODE">全部</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-select v-model="test">
              <el-option label="全部" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">行政职位</span>
          <span class="field-value" v-show="mode===READING_MODE">全部</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-select v-model="test">
              <el-option label="全部" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="sub-title-bar">
          <h4 class="sub-title">管理下属</h4>
          <div class="button">添加</div>
        </div>
        <div class="member-panel">
          <el-tag v-for="tag in tags" class="member" :key="tag.name" :closable="mode===EDITING_MODE" :type="'primary'" :close-transition="false"
           @close="handleClose(tag)">
            {{tag.name}}
          </el-tag>
        </div>
        <div class="field">
          <span class="field-name">个人擅长</span>
          <span class="field-value" v-show="mode===READING_MODE">FOG</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">职称选择</span>
          <span class="field-value" v-show="mode===READING_MODE">全部</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-select v-model="test">
              <el-option label="全部" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line multi-line">
          <span class="field-name">曾获荣誉</span>
          <span class="field-value" v-show="mode===READING_MODE">XXX领域的领军人物</span>
          <span class="field-input" v-show="mode===EDITING_MODE">
            <el-input type="textarea"></el-input>
          </span>
        </div>
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
      mode: this.READING_MODE,
      tags: [
        { name: '下属医生一' },
        { name: '下属医生二' },
        { name: '下属医生三' },
        { name: '下属医生四' },
        { name: '下属医生五' },
        { name: '下属医生六' }
      ],
      test: 1
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
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
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

.user-info {
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
          .el-textarea {
            vertical-align: middle;
            transform: translateY(10px);
            .el-textarea__inner {
              border: none;
              background-color: @screen-color;
            }
          }
          .el-select {
            width: 100%;
          }
        }
        &.whole-line {
          width: 100%;
          .field-value, .field-input {
            right: 4%;
          }
        }
        &.multi-line {
          height: 60px;
        }
      }
      .sub-title-bar {
        position: relative;
        margin: 20px 0 10px;
        height: @field-height;
        line-height: @field-height;
        .sub-title {
          font-size: @normal-font-size;
          color: @font-color;
        }
        .button {
          position: absolute;
          right: -15px;
          top: 6px;
          width: @small-button-width;
          height: @small-button-height;
          line-height: @small-button-height;
          background-color: @secondary-button-color;
          font-size: @normal-font-size;
          color: #fff;
          text-align: center;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          &:active {
            opacity: 0.9;
          }
        }
      }
      .member-panel {
        margin: 0 0 20px;
        width: 100%;
        border: 1px solid @light-gray-color;
        .member {
          margin: 10px;
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
