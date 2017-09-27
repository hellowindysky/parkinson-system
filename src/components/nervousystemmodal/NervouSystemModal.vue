<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title"></h3>
      <div class="field">
        <span class="field-name">
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text"></span>
        </span>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
// import Bus from 'utils/bus.js';
// import Util from 'utils/util.js';

import { isEmptyObject } from 'utils/helper.js';
const ADD_MODE = 'add';
const MODIFY_MODE = 'modify';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      title: '',
      item: {},
      warningResults: {}
    };
  },
  computed: {},
  methods: {
    showPanel(title, item, modalType) {
      this.displayModal = true;
      // 通过检查 item 参数是否为空对象 {}，来决定提交时是新增记录，还是修改记录
      if (isEmptyObject(item)) {
        this.mode = ADD_MODE;
      } else {
        this.mode = MODIFY_MODE;
      }
      this.title = title;
      // 每次打开这个模态框，都会重新初始化 this.item
      // this.initItem();

      // 清空警告信息
      // 改变 item 的时候会触发 warningResults 的跟踪变化（这里的自动触发是由 el-date-picker 的 v-model造成的）
      // 因此这一步要等到 item 变化结束之后再执行，我们将其放到下一个事件循环 tick 中
      this.$nextTick(() => {
        this.clearWarning();
      });

      for (var i = 0; i < this.template.length; i++) {
        // console.log(this.template[i].fieldName);
      }
    },
    cancel() {
      this.displayModal = false;
    },
    initItem() {
      // 遍历当前的 template，对其中的每个 field，检查 this.item 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of this.template) {
        let name = field.fieldName;
        if (this.item[name] === undefined) {
          this.$set(this.item, name, '');
        }
      }
    },
    getWarningText(fieldName) {
      var warningResult = this.warningResults[fieldName];
      return warningResult ? warningResult : '';
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
    }
  },
  mounted() {
    // Bus.$emit(this.SHOW_MODAL_BOX, this.showPanel);
  },
  watch: {},
  beforeDestroy() {
    // Bus.$off(this.SHOW_MODAL_BOX, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 125px;

.modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      padding: 10px 0;
      text-align: left;
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      text-align: left;
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
        right: 2%;
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
        .el-date-editor {
          width: 100%;
        }
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 10px 20px 20px 20px;
      height: 30px;
      line-height: 30px;
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
</style>
