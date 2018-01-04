<template lang="html">
  <div class="endof-followup-modal-wrapper" v-show="displayModal">
    <div class="endof-followup-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name field-title">
            本期随访总结
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            随访形式：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{followupForm}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="followupForm" clearable placeholder="请选择">
              <el-option
                v-for="item in followupForms"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            受访者是否正常完成随访：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{nomalFollowup}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="nomalFollowup" clearable placeholder="请选择">
              <el-option
                v-for="item in nomalFollowups"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            未能正常完成随访原因：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{reason}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="reason" clearable placeholder="请选择">
              <el-option
                v-for="item in reasons"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            原因描述： 
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请详述具体原因">
            </el-input>
          </span>
        </div>            
        <div class="field whole-line">
          <span class="field-name">
            受访者是否愿意继续随访：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{willing}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="willing" clearable placeholder="请选择">
              <el-option
                v-for="item in willingness"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>      
        <div class="seperate-line"></div>
        <div class="field whole-line">
          <span class="field-name">
            下一节点：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{node}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="node" clearable placeholder="请选择下一节点">
              <el-option
                v-for="item in nextNodes"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            处理意见：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{remark}}
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remark"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入处理意见">
            </el-input>
          </span>
        </div>
        <div class="field">
          <div class="menu-icon iconfont icon-caution"></div>
          <span class="field-name foot-section">
            请确认患者已经完成所有随访点，结束实验后，实验期间记录将会归档
          </span>
        </div>
      </div> 
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: true,
      mode: '',
      completeInit: false,
      remark: '',
      followupForm: '',
      nomalFollowup: '',
      reason: '',
      willing: '',
      node: '',
      followupForms: [{
        code: '1',
        name: '访视'
      }, {
        code: '2',
        name: '电话访视'
      }],
      nomalFollowups: [{
        code: '1',
        name: '是'
      }, {
        code: '2',
        name: '否'
      }],
      reasons: [{
        code: '1',
        name: '失访'
      }, {
        code: '2',
        name: '因其它疾病原因导致无法正常随访'
      }, {
        code: '3',
        name: '因经济等客观因素导致无法正常随访'
      }, {
        code: '4',
        name: '家人不支持'
      }, {
        code: '5',
        name: '觉得随访无意义'
      }, {
        code: '6',
        name: '其它'
      }],
      willingness: [{
        code: '1',
        name: '是'
      }, {
        code: '2',
        name: '否'
      }],
      nextNodes: [{
        code: '1',
        name: '随访期'
      }, {
        code: '2',
        name: '实验结束（等待揭盲）'
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '本期随访结束';
      } else {
        return '本期随访结束';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.displayModal = true;
      this.updateScrollbar();
    },
    transform(code, fieldName) {
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name;
    },
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    updateWarning(fieldName) {
      if (this[fieldName] === '') {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    }
  },
  mounted() {
    Bus.$on(this.SHOW_ENDOF_FOLLOWUP_MODAL, this.showPanel);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_ENDOF_FOLLOWUP_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 200px;

.endof-followup-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .endof-followup-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translate3d(10px, 5px, 0); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"94% - @{field-name-width}");
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @font-color;
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-title {
          font-weight: 700;
        }
        .foot-section {
          margin: 10px 100px;
          font-weight: 700;
          width: 200%;
        }
        .iconfont {
          display: inline-block;
          position: absolute;
          line-height: @field-line-height;
          vertical-align: middle;
          &.menu-icon {
            left: 60px;
            top: 9px;
            font-size: 25px;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .el-input {
            transform: translateY(-3px);
            .el-input__inner {
              height: 30px;
              border: none;
              background-color: @screen-color;
            }
          }
          .el-textarea {
            margin-bottom: 10px;
            vertical-align: middle;
            transform: translateY(-3px);
            .el-textarea__inner {
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
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
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
      &.btn-margin {
        margin-top: 10px;
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
