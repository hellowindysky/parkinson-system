<template lang="html">
  <div class="user-info">
    <div class="header">
      <h3 class="title">用户信息</h3>
      <h5 class="date">创建时间：2017-07-07</h5>
      <div v-show="mode===READING_MODE" class="button edit-button" @click="edit">编辑</div>
      <div v-show="mode===EDITING_MODE" class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode===EDITING_MODE" class="button submit-button" @click="submit">完成</div>
    </div>
    <div class="content">
      <div class="fields-wrapper">
        <div class="field">
          <span class="field-name">用户角色</span>
          <span class="field-value" v-show="mode===READING_MODE">管理员</span>
          <span class="field-input" v-show="mode===EDITING_MODE"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    },
    cancel() {
      this.mode = this.READING_MODE;
    },
    submit() {
      this.mode = this.READING_MODE;
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@header-height: 40px;
@margin-right: 15px;

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
  .content {
    position: relative;
    margin: 0 @margin-right @vertical-spacing 0;
    background-color: @background-color;
    height: 100px;
  }
}
</style>
