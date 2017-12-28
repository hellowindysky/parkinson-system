<template lang="html">
  <div class="neurologic-modal-wrapper" v-show="displayModal">
    <div class="neurologic-modal" ref="neurologicModal">
      <h3 class="title">{{title}}</h3>

      <div class="field">
        <span class="field-name">
          检查类型:
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{warningResults.checkType}}</span>
          <el-select v-if="mode===ADD_NEW_CARD" placeholder="请选择检查类型" v-model="copyInfo.checkType"
            :class="{'warning': warningResults.checkType}" @change="updateWarning('checkType')">
            <el-option v-for="type in getOptions('neurologicExam')" :key="type.code"
              :label="type.name" :value="type.code"></el-option>
          </el-select>
          <span v-else>
            {{transform(copyInfo.checkType, 'neurologicExam')}}
          </span>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          检查时间:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.ariseTime}}</span>
          <el-date-picker v-else v-model="copyInfo.ariseTime" placeholder="请输入检查时间" type="date" format="yyyy-MM-dd"></el-date-picker>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          检查结果:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.spephysicalResult}}</span>
          <el-input v-else type="textarea" placeholder="请输入检查结果" v-model="copyInfo.spephysicalResult" :maxlength="500"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remarks}}</span>
          <el-input v-else type="textarea" placeholder="请输入备注内容" v-model="copyInfo.remarks" :maxlength="500"></el-input>
        </span>
      </div>

      <h3 class="form-title" v-if="tableMode===SON_OPEN && hasTableExisted">{{subTableTitle}}</h3>
      <div class="form-wrapper" v-if="hasTableExisted" ref="formWrapper">
        <table class="form" v-if="tableMode===FATHER_OPEN">
          <tr class="row first-row">
            <td class="col col-width-10">
              序号
            </td>
            <td class="col col-width-30">
              检查项
            </td>
            <td class="col col-width-15">
              操作
            </td>
          </tr>
          <tr class="row" v-for="(type, index) in tableTypes">
            <td class="col col-width-10">
              {{ index + 1 }}
            </td>
            <td class="col col-width-30">
              {{type.typeName}}
            </td>
            <td class="col col-width-15">
              <span class="text-button" v-if="mode===VIEW_CURRENT_CARD" @click="selectSubTable(type.typeCode)">查看</span>
              <span class="text-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="selectSubTable(type.typeCode)">编辑</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- <div class="seperate-line"></div> -->
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" @click="switchToEditingMode" v-if="mode===VIEW_CURRENT_CARD && canEdit">编辑</div>
      <div class="button submit-button" @click="submit" v-else-if="mode!==VIEW_CURRENT_CARD">确定</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import { deepCopy } from 'utils/helper';
import Util from 'utils/util.js';
import { modifyNervouSystem, addNervouSystem } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      lockSubmitButton: false,
      showEdit: true,

      FATHER_OPEN: 'fatherOpen',
      SON_OPEN: 'sonOpen',
      tableMode: '',

      copyInfo: {},
      subTableCode: '',
      warningResults: {
        checkType: ''
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
        return '新增神经系统检查';
      } else {
        return '神经系统检查';
      }
    },
    subTableTitle() {
      if (this.tableMode === this.SON_OPEN) {
        let targetType = Util.getElement('typeCode', this.subTableCode, this.tableTypes);
        return targetType.typeName ? targetType.typeName : '';
      } else {
        return '';
      }
    },
    tableTypes() {
      if (!this.hasTableExisted) {
        return [];
      }
      var typeInfo = Util.getElement('typegroupcode', 'neurologicExam', this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var targetType = Util.getElement('typeCode', Number(this.copyInfo.checkType), types);
      return targetType.childType ? targetType.childType : [];
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
      }
      return resultGroups;
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
      this.displayModal = true;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.tableMode = this.FATHER_OPEN;
      this.initCopyInfo();
      vueCopy(item, this.copyInfo);

      console.log('item: ', item);

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
      this.$set(this.copyInfo, 'patientFieldDetail', {});

      for (let type of this.tableTypes) {
        let typeCode = type.typeCode;
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
      }
    },
    selectSubTable(code) {
      this.subTableCode = code;
      this.tableMode = this.SON_OPEN;
      console.log(this.itemGroups);
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
      submitData.ariseTime = Util.simplifyDate(submitData.ariseTime);

      if (this.mode === this.EDIT_CURRENT_CARD) {
        // 修改的状态
        modifyNervouSystem(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.ADD_NEW_CARD) {
        // 新增的状态
        delete submitData.patientSpephysicalId;
        addNervouSystem(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
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
    Bus.$on(this.SHOW_NEUROLOGIC_MODAL, this.showPanel);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NEUROLOGIC_MODAL, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.neurologic-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .neurologic-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 6%;
    width: 600px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      display: inline-block;
      position: relative;
      width: 100%;
      min-height: 45px;
      vertical-align: top;
      text-align: left;
      transform: translateX(20px);
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
      .field-input {
        display: inline-block;
        position: relative;
        left: @field-name-width;
        width: calc(~"92% - @{field-name-width}");
        line-height: 25px;
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
          margin-bottom: 15px;
          transform: translateY(-3px);
          .el-textarea__inner {
            border: none;
            background-color: @screen-color;
          }
          &.warning {
            border: 1px solid red;
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
    .form-title {
      margin: 0;
      padding: 0;
      line-height: 40px;
      font-size: @normal-font-size;
      color: @font-color;
      text-align: center;
    }
    .form-wrapper {
      position: relative;
      margin-top: 5px;
      max-height: 320px;
      height: auto;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid @inverse-font-color;
      .form {
        position: relative;
        margin-bottom: 5px;
        width: 100%;
        border-spacing: 0;
        font-size: 14px;
        &.small-font {
          font-size: @small-font-size !important;
        }
        .row {
          height: 40px;
          &.first-row {
            background-color: @screen-color;
            height: 30px;
            .col {
              padding: 0 3px;
            }
          }
          .col {
            text-align: center;
            padding: 0;
            margin: 0;
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
              min-width: 40px;
            }
            &.col-width-10 {
              width: 10%;
            }
            &.col-width-15 {
              width: 15%;
            }
            &.col-width-20 {
              width: 20%;
            }
            &.col-width-25 {
              width: 25%;
            }
            &.col-width-30 {
              width: 30%;
            }
            &.col-width-18 {
              width: 18%;
            }
            &.col-width-7 {
              width: 7%;
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
