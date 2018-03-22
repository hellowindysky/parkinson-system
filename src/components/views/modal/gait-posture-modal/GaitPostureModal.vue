<template lang="html">
  <div class="gait-posture-modal-wrapper">
    <div class="gait-posture-modal" ref="gaitPostureModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            采集开始时间：
          </span>
            <span class="field-input">
              <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.ariseTime}}</span>
                <el-date-picker v-else
                  v-model="copyInfo.ariseTime"
                  placeholder="请选择开始时间"
                  type="date"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions">
                </el-date-picker>
            </span>
        </div>
        <div class="field">
          <span class="field-name">
            采集结束时间：
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.ariseTime}}</span>
              <el-date-picker v-else
                v-model="copyInfo.ariseTime"
                placeholder="请选择结束时间"
                type="date"
                format="yyyy-MM-dd"
                :picker-options="pickerOptions">
              </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            设备型号：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{''}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select clearable placeholder="请选择设备型号">
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            设备编号：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{''}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input placeholder="请输入设备编号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查编号：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{''}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input placeholder="请输入检查编号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            数据来源：
          </span>
          <span class="field-input">
            {{"手动录入"}}
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remarks}}</span>
            <el-input v-else type="textarea" placeholder="请输入备注" v-model="copyInfo.remarks" :maxlength="500"></el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            <td class="col col-width-5">序&nbsp;&nbsp;号</td>
            <td class="col col-width-35">检&nbsp;&nbsp;查&nbsp;&nbsp;项</td>
            <td class="col col-width-20">操&nbsp;&nbsp;作</td>
          </tr>
          <tr class="row">
            <td class="col col-width-5">{{ index + 1 }}</td>
            <td class="col col-width-35">{{""}}</td>
            <td class="col col-width-20">
              <span class="text-button" v-if="mode===VIEW_CURRENT_CARD">查&nbsp;&nbsp;看</span>
              <span class="text-button" v-else-if="mode!==VIEW_CURRENT_CARD">编&nbsp;&nbsp;辑</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="seperate-line"></div>
      <div class="content">
        <table class="table">
          <td class="row title-row" colspan="5">时&nbsp;&nbsp;空&nbsp;&nbsp;参&nbsp;&nbsp;数</td>
          <tr class="row">
            <td class="col col-width-1 endways" rowspan="2">时间参数</td>
            <td class="col col-width-25">{{""}}</td>
            <td class="col col-width-30">右&nbsp;&nbsp;侧</td>
            <td class="col col-width-30">左&nbsp;&nbsp;侧</td>
            <td class="col col-width-20">正&nbsp;&nbsp;常&nbsp;&nbsp;值</td>
          </tr>
          <tr class="row">
            <td class="col col-width-1"></td>
            <td class="col col-width-25">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"></el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"></el-input>
              </span>
            </td>
            <td class="col col-width-30">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"></el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"></el-input>
              </span>
            </td>
            <td class="col col-width-30">{{""}}</td>
          </tr>
        </table>
      </div>

      <div class="content">
        <table class="table">
          <tr class="row">
            <td class="col col-width-1 endways" rowspan="2">空间参数</td>
            <td class="col col-width-25">{{""}}</td>
            <td class="col col-width-30">右&nbsp;&nbsp;侧</td>
            <td class="col col-width-30">左&nbsp;&nbsp;侧</td>
            <td class="col col-width-20">正&nbsp;&nbsp;常&nbsp;&nbsp;值</td>
          </tr>
          <tr class="row">
            <td class="col col-width-1"></td>
            <td class="col col-width-25">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"></el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"></el-input>
              </span>
            </td>
            <td class="col col-width-30">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"></el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"></el-input>
              </span>
            </td>
            <td class="col col-width-30">{{""}}</td>
          </tr>
        </table>
      </div>

      <div class="content">
        <table class="table">
          <tr class="row">
            <td class="col col-width-1 endways" rowspan="2">站立角度</td>
            <td class="col col-width-25">{{""}}</td>
            <td class="col col-width-30">右&nbsp;&nbsp;侧</td>
            <td class="col col-width-30">左&nbsp;&nbsp;侧</td>
            <td class="col col-width-20"></td>
          </tr>
          <tr class="row">
            <td class="col col-width-1"></td>
            <td class="col col-width-25">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"></el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"></el-input>
              </span>
            </td>
            <td class="col col-width-30">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"></el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{""}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"></el-input>
              </span>
            </td>
            <td class="col col-width-30">{{""}}</td>
          </tr>
        </table>
      </div>

      <span>
        <div class="button cancel-button" @click="cancel">取消</div>
        <div class="button edit-button" v-if="mode===VIEW_CURRENT_CARD && showEdit" @click="switchToEditingMode">编辑</div>
        <div class="button submit-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="submit">确认</div>
      </span>
      <span>
        <div class="button cancel-button" v-if="mode===VIEW_CURRENT_CARD" @click="closeSubTable">返回</div>
        <span v-else-if="mode!==VIEW_CURRENT_CARD && hasTableExisted">
          <div class="button reset-button" @click="initSubTableDataForTypeCode(subTableCode)">重置</div>
          <div class="button submit-button" @click="closeSubTable">完成</div>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy, deepCopy } from 'utils/helper';
import Util from 'utils/util.js';
// import { addGaitPosture, modifyGaitPosture } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      lockSubmitButton: false,
      showEdit: false,

      FATHER_OPEN: 'fatherOpen',
      SON_OPEN: 'sonOpen',
      tableMode: '',

      copyInfo: {},
      copyItem: {},   //  用来缓存传递进来的数据
      subTableCode: '',
      warningResults: {
        checkType: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'typeField',
      'neurologicCheckTypeList'
    ]),
    hasTableExisted() {
      this.updateScrollbar();
      return this.copyInfo.checkType !== undefined &&
        this.copyInfo.checkType !== '' &&
        this.copyInfo.checkType !== 3;
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增姿势步态';
      } else {
        return '姿势步态';
      }
    },
    itemGroups() {
      var items = this.typeField.filter(item => {
        return Number(item.typeCode) === this.subTableCode &&
        item.typeGroupCode === 'neurologicExam';
      });
      var groups = this.filterItemsIntoGroups(items);
      var resultGroups = [];
      for (let i = 0; i < groups.length; i += 1) {
        resultGroups.push({});
        resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
        resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
        resultGroups[i].anotherColItems = groups[i].filter(item => item.fieldType === 2);
      }
      return resultGroups;
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.tableMode = this.FATHER_OPEN;
      this.initCopyInfo();
      this.copyItem = item;
      if (this.copyItem.checkType) {
        this.copyItem.checkType = Number(this.copyItem.checkType);
      }
      vueCopy(this.copyItem, this.copyInfo);

      this.$nextTick(() => {
        this.clearWarning();
      });
      this.updateScrollbar();
    },
    initCopyInfo() {
      this.copyInfo = {};
      this.$set(this.copyInfo, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.copyInfo, 'patientId', this.$route.params.id);
      this.$set(this.copyInfo, 'checkType', '');
      this.$set(this.copyInfo, 'ariseTime', '');
      this.$set(this.copyInfo, 'spephysicalResult', '');
      this.$set(this.copyInfo, 'remarks', '');

      this.$set(this.copyInfo, 'pullTest', '');
      this.$set(this.copyInfo, 'sittingBloc', '');

      this.initSubTableData();
    },
    initSubTableDataForTypeCode(typeCode) {
      this.$set(this.copyInfo.patientFieldCode, typeCode, {});

      let items = this.typeField.filter(item => {
        return Number(item.typeCode) === typeCode &&
        item.typeGroupCode === 'neurologicExam';
      });
      let groups = this.filterItemsIntoGroups(items);
      let resultGroups = [];
      for (let i = 0; i < groups.length; i += 1) {
        resultGroups.push({});
        resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
        resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
      }

      for (let group of resultGroups) {
        for (let rowItem of group.rowItems) {
          var rowItemCode = rowItem.id;
          this.$set(this.copyInfo.patientFieldCode[typeCode], rowItemCode, {});

          let colItems = group.colItems;
          if (colItems.length === 0) {
            // 特殊情况：如果没有列，则新建一个code为 0 的虚拟列
            colItems = [{id: 0}];
          }

          for (let colItem of colItems) {
            var colItemCode = colItem.id;
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode], colItemCode, {});

            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeGroupCode', 'elecExam');
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeCode', typeCode);
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'rowFieldId', rowItemCode);
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'columnFieldId', colItemCode);
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'fieldValue', '');
          }
        }
      }
    },
    selectSubTable(code) {
      this.subTableCode = code;
      this.tableMode = this.SON_OPEN;
      this.updateScrollbar();
      // console.log(this.itemGroups);
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.updateWarning('checkType');
      if (this.warningResults.checkType !== '') {
        this.lockSubmitButton = false;
        return;
      }

      let submitData = deepCopy(this.copyInfo);
      submitData.typeGroupCode = 'neurologicExam';
      submitData.ariseTime = Util.simplifyDate(submitData.ariseTime);

      submitData.patientFieldCode = {};
      for (let type of this.tableTypes) {
        submitData.patientFieldCode[type.typeCode] = deepCopy(this.copyInfo.patientFieldCode[type.typeCode]);
      }
      if (submitData.checkType !== 3) {
        delete submitData.pullTest;
        delete submitData.sittingBloc;
      } else {
        delete submitData.patientFieldCode;
      }

      if (this.mode === this.EDIT_CURRENT_CARD) {
        // modifyGaitPosture(submitData).then(() => {
        //   Bus.$emit(this.UPDATE_CASE_INFO);
        //   this.updateAndClose();
        // }, this._handleError);

      } else if (this.mode === this.ADD_NEW_CARD) {
        delete submitData.patientSpephysicalId;
        // addGaitPosture(submitData).then(() => {
        //   Bus.$emit(this.UPDATE_CASE_INFO);
        //   this.updateAndClose();
        // }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    closeSubTable() {
      this.tableMode = this.FATHER_OPEN;
      this.updateScrollbar();
      this.$refs.neurologicModal.scrollTop = 0;
      // this.$refs.formWrapper.scrollTop = 0;
    },
    getOptions(fieldName) {
      var options = [];
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    rearrangeRows(items) {
      // 因为有的子表格没有明确的列信息，只有行信息，而且每一行只有字段名字和字段值
      // 因此需要重新排列此表格，一排有4列，分别为字段1的名字，字段1的值，字段2的名字，字段2的值
      var newArray = [];
      var subArray = [];
      var length = items.length;
      for (var i = 0; i < length; i++) {
        subArray.push(items[i]);
        if (i % 2 === 1 || i === length - 1) {
          newArray.push(subArray);
          subArray = [];
        }
      }
      return newArray;
    },
    filterItemsIntoGroups(items) {
      // 根据 item 的 groupNo 属性，装到不同的子数组里面，最后返回最外层的数组
      var groups = [];
      var hasSameGroupNumberBefore = false;

      for (let item of items) {
        hasSameGroupNumberBefore = false;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i][0].groupNo === item.groupNo) {
            hasSameGroupNumberBefore = true;
            groups[i].push(item);
          }
        }
        if (!hasSameGroupNumberBefore) {
          let newGroup = [];
          newGroup.push(item);
          groups.push(newGroup);
        }
      }
      return groups;
    },
    updateWarning(fieldName) {
      if (this.copyInfo[fieldName] === undefined || this.copyInfo[fieldName] === '') {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.formWrapper) {
          Ps.destroy(this.$refs.formWrapper);
          Ps.initialize(this.$refs.formWrapper, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs.neurologicModal) {
          Ps.destroy(this.$refs.neurologicModal);
          Ps.initialize(this.$refs.neurologicModal, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_GAITPOSTURE_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_GAITPOSTURE_MODAL, this.showPanel);
  },
  watch: {
    tableTypes() {
      this.initSubTableData();
      vueCopy(this.copyItem, this.copyInfo);
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.gait-posture-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .gait-posture-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 5%;
    width: 600px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
    .moveLeft {
      text-align: left;
      margin-top: 10px;
    }
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
      transform: translate3d(10px, 5px, 0);
      // overflow: hidden;
      &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width}");
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
      }
      .field-input {
        display: inline-block;
        position: relative;
        left: @field-name-width;
        width: calc(~"92% - @{field-name-width}");
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        &.zero-font-size {
          font-size: 0;
        }
        .warning-text {
          position: absolute;
          top: 22px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
          &.right {
            left: calc(~"60% + 10px");
          }
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
          margin-bottom: 15px;
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
        .warning .el-input__inner, .warning .el-textarea__inner {
          border: 1px solid red;
        }
      }
    }
    .table {
      margin: 10px 0 20px;
      width: 100%;
      border: 1px solid @light-gray-color;
      border-collapse: collapse;
      text-align: center;
      .row {
        height: 40px;
        font-size: @normal-font-size;
        &.title-row {
          background-color: @font-color;
          color: #fff;
          vertical-align: middle;
        }
        .col {
          position: relative;
          width: 10%;
          border: 1px solid @light-gray-color;
           .text-button {
              margin: 0 5px;
              color: @theme-color;
              line-height: 20px;
              border-bottom: 1px solid @theme-color;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }

          &.col-width-5 {
              width: 5%;
            }
          &.col-width-1 {
              width: 1%;
              min-width: 30px;
              letter-spacing: 2px;
              &.endways {
                background-color: @font-color;
                color: #fff;
              }
            }
          &.col-width-10 {
              width: 10%;
            }
          &.col-width-20 {
              width: 20%;
            }
          &.col-width-35 {
              width: 35%;
            }
          &.col-width-25 {
              width: 25%;
            }
          &.col-width-20 {
              width: 20%;
            }
          &.col-width-30 {
              width: 30%;
            }
          &.col-width-80 {
              width: 80%;
            }
          &.title-col {
            background-color: @font-color;
            color: #fff;
          }
          .el-input {
            width: 100%;
            &.warning {
              margin: -1px;
              border: 1px solid red;
            }
            .el-input__inner {
              padding: 0;
              border: none;
              text-align: center;
            }
            .el-input__icon {
              &.el-icon-date {
                width: 12px;
                height: 12px;
                padding: 0 0 18px 10px;
                opacity: 0.3;
              }
              &.el-icon-close {
                width: 12px;
                height: 12px;
                padding: 0 0 18px 10px;
                color: @alert-color;
              }
            }
            &.is-disabled {
              .el-input__inner {
                background-color: rgba(0,0,0,0);
                color: @font-color;
              }
              .el-input__icon {
                display: none;
              }
            }
          }
          .left {
              display: inline-block;
              position: absolute;
              width: 45%;
              height: 100%;
              left: 0;
              top: 0;
              line-height: 43px;
            }
            .right {
              display: inline-block;
              position: absolute;
              width: 45%;
              height: 100%;
              right: 0;
              top: 0;
              line-height: 43px;
            }
          .el-select {
            &.warning {
              .el-input {
                margin: -1px;
                border: 1px solid red;
              }
            }
          }
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
      &.submit-button, &.edit-button {
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
      right: -2px;
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
