<template lang="html">
  <div class="emg-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal" ref="medicineModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            检查名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <el-select  placeholder="请肌电图名称" v-model="EmgTypeData['elecTroGramId']"  :disabled="mode===MODIFY_MODE" @change="selectFatherTempData">
               <el-option v-for="bioexItem in EmgNameArr" :key="bioexItem.id" :label="bioexItem.emgName" :value="bioexItem.id" ></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查结果:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <el-input type="textarea" :rows="2" v-model="EmgTypeData['patEleResule']" placeholder="请输入检查结果"></el-input>    
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            提示内容:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <el-input type="textarea" :rows="2" v-model="EmgTypeData['patEleHint']" placeholder="请输入提示信息"></el-input> 
          </span>
        </div>
        <div class="form-wrapper" ref="formWrapper">
          <table class="form" v-if="tableMode===FATHER_OPEN">
            <tr class="row first-row">
              <td class="col col-id">
                序号
              </td>
              <td class="col col-name">
                检查项
              </td>
              <td class="col col-name">
                更新时间
              </td>
              <td class="col col-name">
                操作
              </td>
            </tr>
            <tr class="row" v-for="(item, key) in emgTableName">
              <td class="col col-id">
                {{key+1}}
              </td>
              <td class="col col-name">
                {{item.tableName}}
              </td>
              <td class="col col-name">
              </td>
              <td class="col col-name">
                <span @click="selectSonTemp(item.arr)">编辑</span>
                <span>重置</span>
              </td>
            </tr>
          </table>
          <table class="form" v-if="tableMode===SON_OPEN">
             <tr class="row first-row">
              <td class="col col-id">
                序号
              </td>
              <td class="col col-width70">
                神经类型
              </td>
              <td class="col col-width150">
                Nerve and Site
              </td>
              <td class="col col-width70">
                Latency（ms）
              </td>
              <td class="col col-width70">
                Amplitude（mV）
              </td>
              <td class="col col-width150">
                Segment
              </td>
              <td class="col col-width100">
                Latency Difference（ms）
              </td>
              <td class="col col-width100">
                Distance（mm）
              </td>
              <td class="col col-width100">
                Conduction Velocity（m/s）
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" v-if="tableMode===FATHER_OPEN" @click="cancel">取消</div>
      <div class="button son-submit-button" v-if="tableMode===FATHER_OPEN">确认</div>
      <div class="button son-submit-button" v-if="tableMode===SON_OPEN">编辑完成</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';

import { isEmptyObject } from 'utils/helper.js';
export default {
  data() {
    return {
      FATHER_OPEN: 'fatheropen',
      SON_OPEN: 'sonopen',
      tableMode: '',
      ADD_MODE: 'addMode',
      MODIFY_MODE: 'modifymode',
      displayModal: false,
      mode: '',
      currentTable: '',
      title: '',
      item: {},
      warningResults: {},
      dictionData: [],
      EmgTypeData: {},
      EmgNameArr: [],
      FatherTempData: {},
      SonTempData: [],
      emgTableName: [
        {
          arr: 'fwavStuItem',
          tableName: 'F波研究'
        },
        {
          arr: 'intPatAnaItem',
          tableName: '干扰项分析'
        },
        {
          arr: 'motNerCondItem',
          tableName: '运动神经传导项'
        },
        {
          arr: 'motUniAnaItem',
          tableName: '运动单元分析'
        },
        {
          arr: 'needExamItem',
          tableName: '针刺肌电图检查'
        },
        {
          arr: 'senNerCondItem',
          tableName: '感觉神经传导项'
        }
      ],
      sonTableList: []
    };
  },
  computed: {
    ...mapGetters([
      'emgTypeList'
    ])
  },
  methods: {
    showPanel(title, item) {
      // 刚进入模态框的时候父表格打开
      this.tableMode = this.FATHER_OPEN;
      this.displayModal = true;
      // 拷贝dictionary的数据
      vueCopy(this.emgTypeList, this.dictionData);
      // console.log('emgTypeList', this.emgTypeList);
      // 在dictionary中取出肌电图的名字和ID
      for (let i = 0; i < this.dictionData.length; i++) {
        this.$set(this.EmgNameArr, i, {});
        for (let key in this.dictionData[i]) {
          if (key === 'emgName') {
            this.$set(this.EmgNameArr[i], key, this.dictionData[i][key]);
          } else if (key === 'id') {
            this.$set(this.EmgNameArr[i], key, this.dictionData[i][key]);
          }
        }
      }
      // 通过检查 item 参数是否为空对象 {}，来决定提交时是新增记录，还是修改记录
      if (isEmptyObject(item)) {
        // 如果是新增生化指标那么需要新造一个对象来提交
        this.mode = this.ADD_MODE;
        // this.$set(this.EmgTypeData, 'patientCaseId', this.$route.params.caseId);
        // this.$set(this.EmgTypeData, 'patientId', this.$route.params.id);

      } else {
        // 修改生化指标那么直接拷贝它
        vueCopy(item, this.EmgTypeData);
        this.mode = this.MODIFY_MODE;
      }
      this.title = title;
      // 改变 item 的时候会触发 warningResults 的跟踪变化（这里的自动触发是由 el-date-picker 的 v-model造成的）
      // 因此这一步要等到 item 变化结束之后再执行，我们将其放到下一个事件循环 tick 中
      this.$nextTick(() => {
        this.clearWarning();
      });
    },
    selectFatherTempData() {
      for (let i = 0; i < this.dictionData.length; i++) {
        if (this.dictionData[i]['id'] === this.EmgTypeData['elecTroGramId']) {
          vueCopy(this.dictionData[i], this.FatherTempData);
        }
      }
    },
    selectSonTemp(arrName) {
      // 点击编辑按钮之后就通过arr的名字来生成一个肌电图的子表格
      // 在dictionary中找到这个数组
      for (let key in this.FatherTempData) {
        if (key === arrName) {
          vueCopy(this.FatherTempData[key], this.SonTempData);
          console.log('succss');
        }
      }
      // 取到这个值之后就要关闭父表格，打开子表格
      this.tableMode = this.SON_OPEN;
    },
    cancel() {
      this.displayModal = false;
      this.templateData = [];
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
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        // 之所以弃用 update 方法，是因为它在某些情况下会出现问题，导致滚动条不能有效刷新
        // Ps.update(this.$refs.scrollArea);

        // 如果之前有绑定滚动条的话，先进行解除
        Ps.destroy(this.$refs.formWrapper);
        Ps.initialize(this.$refs.formWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    }
  },
  mounted() {
    this.updateScrollbar();
    Bus.$on(this.SHOW_EMG_MODAL, this.showPanel);
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);

    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);

    // 监听子组件是否要求刷新病患数据
    Bus.$on(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
  },
  watch: {
    dictionData: {
      handler: function(newVal) {
        if (newVal) {
          for (let i = 0; i < this.dictionData.length; i++) {
            if (this.dictionData[i]['id'] === this.EmgTypeData['elecTroGramId']) {
              vueCopy(this.dictionData[i], this.FatherTempData);
              console.log('FatherTempData', this.FatherTempData);
            }
          }
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_EMG_MODAL, this.showPanel);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.UPDATE_PATIENT_INFO, this.updatePatientInfo);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 52px;
@field-name-width: 110px;
@long-field-name-width: 160px;

@col-id-width: 40px;
@col-name-width: 180px;
@col-english-width: 70px;
@col-result-width: 160px;
@col-danwei-width: 70px;
@col-cankao-width: 70px;
@col-beizhu-width: 180px;

@col-table-width70: 70px;
@col-table-width150: 150px; 
@col-table-width100: 100px; 

.emg-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .medicine-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 800px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      .field {
        padding: 5px 0;
        text-align: left;
        display: inline-block;
        position: relative;
        width: 90%;
        height: @field-height;
        text-align: left;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 4%;
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
          &.long-field-name {
            width: @long-field-name-width;
          }
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
          right: 8%;
          line-height: @field-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
          }
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
          .el-textarea {
            vertical-align: middle;
            transform: translateY(5px);
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
      .form-wrapper {
        position: relative;
        max-height: 250px;
        height: auto;
        width: 100%;
        border: 1px solid @inverse-font-color;
        overflow: hidden;
        .form {
          position: relative;
          margin-bottom: 5px;
          width: 100%; // left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
          border-spacing: 0;
          .row {
            height: 45px;
            &.first-row {
              background-color: @screen-color;
              height: 30px;
            }

            .col {
              font-size: @small-font-size;
              text-align: center;
              span {
                color: @theme-color;
                text-decoration: underline;
                cursor: pointer;
                margin-right: 8px; 
              }
              &.col-id {
                width: @col-id-width;
              }
              &.col-name {
                width: @col-name-width;
              }
              &.col-english {
                width: @col-english-width;
              }
              &.col-result {
                width: @col-result-width;
              }
              &.col-danwei {
                width: @col-danwei-width;
              }
              &.col-cankao {
                width: @col-cankao-width;
              }
              &.col-beizhu {
                width: @col-beizhu-width;
              }
              &.col-width70 {
                width: @col-table-width70;
              }
              &.col-width100 {
                width: @col-table-width100;
              }
              &.col-width150 {
                width: @col-table-width150;
              }
              .required-mark {
                color: red;
                font-size: 20px;
                vertical-align: middle;
              }
              .el-input {
                margin-left: 2%;
                width: 90%;
                .el-input__inner {
                  height: 30px;
                  border: none;
                  background-color: @screen-color;
                  text-align: center;
                }
              }
              .warning .el-input__inner {
                border: 1px solid red;
              }
            }
          }
        }
        .ps__scrollbar-y-rail {
          position: absolute;
          padding: 0;
          top: 0;
          width: 10px !important;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s;
          .ps__scrollbar-y {
            position: relative;
            border-radius: 0 !important;
            background-color: #aaa;
          }
        }
        &:hover {
          .ps__scrollbar-y-rail {
            opacity: 0.6;
          }
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 15px auto 10px;
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
      &.son-submit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
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
