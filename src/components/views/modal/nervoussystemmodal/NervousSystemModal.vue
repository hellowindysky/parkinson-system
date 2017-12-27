<template lang="html">
  <div class="nervous-modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>

      <div class="field">
        <span class="field-name">
          检查类型:
          <span class="required-mark">*</span>
        </span>
        <span class="field-input">
          <span class="warning-text">{{warningResults.checkType}}</span>
          <el-select v-if="mode===ADD_NEW_CARD" placeholder="请选择检查类型" v-model="item.checkType"
            :class="{'warning': warningResults.checkType}" @change="updateWarning('checkType')">
            <el-option v-for="type in getOptions('neurologicExam')" :key="type.code"
              :label="type.name" :value="type.code"></el-option>
          </el-select>
          <span v-else>
            {{transform(item.checkType, 'neurologicExam')}}
          </span>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          检查时间:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{item.ariseTime}}</span>
          <el-date-picker v-else v-model="item.ariseTime" placeholder="请输入检查时间" type="date" format="yyyy-MM-dd"></el-date-picker>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          检查结果:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{item.spephysicalResult}}</span>
          <el-input v-else type="textarea" placeholder="请输入检查结果" v-model="item.spephysicalResult" :maxlength="500"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
          备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:
        </span>
        <span class="field-input">
          <span v-if="mode===VIEW_CURRENT_CARD">{{item.remarks}}</span>
          <el-input v-else type="textarea" placeholder="请输入备注内容" v-model="item.remarks" :maxlength="500"></el-input>
        </span>
      </div>

      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" @click="switchToEditingMode" v-if="mode===VIEW_CURRENT_CARD && canEdit">编辑</div>
      <div class="button submit-button" @click="submit" v-else-if="mode!==VIEW_CURRENT_CARD">确定</div>
    </div>
  </div>
</template>

<script>
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
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      item: {},
      showItem: {},
      warningResults: {
        checkType: ''
      },
      spephysicalType: [],
      lockSubmitButton: false,
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'neurologicCheckTypeList'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增神经系统检查';
      } else {
        return '神经系统检查';
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
      this.displayModal = true;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      if (this.mode === this.ADD_NEW_CARD) {
        // 如果是新增卡片那么需要造一个对象
        this.$set(this.item, 'ariseTime', '');
        this.$set(this.item, 'patientCaseId', this.$route.params.caseId);
        this.$set(this.item, 'patientId', this.$route.params.id);
        this.$set(this.item, 'checkType', '');
        this.$set(this.item, 'remarks', '');
        this.$set(this.item, 'checkType', '');
        this.$set(this.item, 'spephysicalResult', '');
      } else {
        // 如果是阅读或修改卡片内容，那么直接渲染传进来的数据
        vueCopy(item, this.item);
        vueCopy(item, this.showItem);
      }
      console.log('item: ', item);

      // 处理一下检查类型
      // let typeDiction = deepCopy(this.neurologicCheckTypeList);
      // for (let j = 0; j < typeDiction.length; j++) {
      //   this.$set(this.spephysicalType, j, {});
      //   for (let key in typeDiction[j]) {
      //     if (key === 'id') {
      //       this.$set(this.spephysicalType[j], 'spephysicalInfo', typeDiction[j][key]);
      //     } else if (key === 'spephysicalName') {
      //       this.$set(this.spephysicalType[j], 'spephysicalName', typeDiction[j][key]);
      //     }
      //   }
      // }

      this.$nextTick(() => {
        this.clearWarning();
      });
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

      let submitData = deepCopy(this.item);
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
    },
    cancel() {
      this.lockSubmitButton = false;
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
    updateWarning(fieldName) {
      if (this.item[fieldName] === undefined || this.item[fieldName] === '') {
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
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
    }
  },
  mounted() {
    Bus.$on(this.SHOW_NERVOU_SYSTEM_MODAL, this.showPanel);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NERVOU_SYSTEM_MODAL, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.nervous-modal-box-wrapper {
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
      display: inline-block;
      position: relative;
      width: 100%;
      min-height: 45px;
      vertical-align: top;
      text-align: left;
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
  }
}
</style>
