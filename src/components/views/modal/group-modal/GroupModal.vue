<template lang="html">
  <div class="group-modal-wrapper" v-show="displayModal">
    <div class="group-modal">
      <h3 class="title">新增分组</h3>
      <div class="field">
        <span class="field-name">
          分组名称
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{groupNameWarning}}</span>
          <el-input :class="{'warning': groupNameWarning}" v-model="groupName"
            placeholder="请输入分组名称" :maxlength="50"></el-input>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          分组类型
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{groupTypeWarning}}</span>
          <el-select :class="{'warning': groupTypeWarning}" v-model="groupType">
            <el-option label="临床" :value="1"></el-option>
            <el-option label="科研" :value="2"></el-option>
          </el-select>
        </span>
      </div>

      <div class="field whole-line">
        <span class="field-name">
          分组说明
        </span>
        <span class="field-input">
          <el-input class="" :class="{'warning': true}" v-model="groupRemarks" type="textarea"
            placeholder="请输入备注信息" :maxlength="500"></el-input>
        </span>
      </div>

      <div class="seperate-line"></div>
      <div class="button-wrapper">
        <div class="button cancel-button" @click="cancel">取消</div>
        <div class="button submit-button" @click="submit">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import { addGroup } from 'api/group.js';

export default {
  data() {
    return {
      displayModal: false,
      groupName: '',
      groupType: '',
      groupRemarks: '',
      checked: false,
      lockSubmitButton: false
    };
  },
  computed: {
    groupNameWarning() {
      if (!this.checked) {
        return '';
      } else {
        if (this.groupName === '') {
          return '组名不能为空';
        } else {
          return '';
        }
      }
    },
    groupTypeWarning() {
      if (!this.checked) {
        return '';
      } else {
        if (this.groupType === '') {
          return '请选择分组类型';
        } else {
          return '';
        }
      }
    }
  },
  methods: {
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.checked = true;
      if (this.groupNameWarning !== '' || this.groupTypeWarning !== '') {
        this.lockSubmitButton = false;
        return;
      }

      var groupInfo = {
        'groupeName': this.groupName,   // 拼写错误是数据库的问题
        'groupType': this.groupType,
        'remarks': this.groupRemarks
      };
      groupInfo.groupModule = this.$store.state.subjectId === this.SUBJECT_ID_FOR_HOSPITAL ? 0 : this.$store.state.subjectId;
      addGroup(groupInfo).then(() => {
        Bus.$emit(this.UPDATE_GROUP_LIST);
        this.displayModal = false;
        this.lockSubmitButton = false;
      }, (error) => {
        if (error.code === 8) {
          this.$message({
            message: '新增分组失败，当前组名已存在！',
            type: 'error',
            duration: 2000
          });
        }
        this.lockSubmitButton = false;
      });
    },
    showModal() {
      this.checked = false;
      this.groupName = '';
      this.groupType = '';
      this.groupRemarks = '';
      this.displayModal = true;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_GROUP_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_GROUP_MODAL);
  },
  watch: {
    '$route.path'() {
      if (this.displayModal) {
        this.cancel();
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 80px;

.group-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .group-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 20%;
    width: 660px;
    text-align: left;
    font-size: 0;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      width: 100%;
      text-align: center;
      font-size: @large-font-size;
    }
    .field {
      padding: 10px 0;
      text-align: left;
      display: inline-block;
      position: relative;
      width: 50%;
      height: @field-height;
      text-align: left;
      &.whole-line {
        width: 100%;
        .field-input {
          right: 2%;
        }
      }
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: @field-name-width;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @font-color;
        .required-mark {
          color: red;
          font-size: 20px;
          vertical-align: middle;
        }
      }
      .field-input {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        right: 4%;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        .warning-text {
          position: absolute;
          top: 25px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
        }
        .el-input {
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
        }
        .el-select {
          width: 100%;
        }
        .warning .el-input__inner {
          border: 1px solid red;
        }
        .el-textarea {
          vertical-align: middle;
          transform: translateY(5px);
          .el-textarea__inner {
            border: none;
            background-color: @screen-color;
          }
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 20px auto 10px;
      background-color: @light-gray-color;
    }
    .button-wrapper {
      width: 100%;
      text-align: center;
      .button {
        display: inline-block;
        width: 100px;
        margin: 10px 20px 20px 20px;
        height: 30px;
        line-height: 30px;
        font-size: @normal-font-size;
        color: #fff;
        cursor: pointer;
        &.cancel-button {
          background-color: @light-font-color;
        }
        &.submit-button {
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
