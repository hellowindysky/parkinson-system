<template lang="html">
  <div class="gene-modal-wrapper" v-show="displayModal">
    <div class="gene-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            检查名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{checkName}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.checkName}}</span>
            <el-input v-model="checkName" placeholder="请输入检查名称" :class="{'warning': warningResults.checkName}" @change="updateWarning('checkName')"></el-input>
          </span>
        </div>
        <div class="field half-line">
          <span class="field-name">
            标本类型:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{getFieldValue(sampleType, 'sampleType')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select v-model="sampleType" placeholder="请选择标本类型">
              <el-option
                v-for="item in getOptions('sampleType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field half-line">
          <span class="field-name">
            检查时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{checkDate}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.checkDate}}</span>
            <el-date-picker
              v-model="checkDate"
              type="date"
              placeholder="选择日期"
              :class="{'warning': warningResults.checkDate}"
              @change="updateWarning('checkDate')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            标本号:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{sampleNo}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="sampleNo" placeholder="请输入标本号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查结果:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{checkResult}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.checkResult}}</span>
            <el-input v-model="checkResult" placeholder="请输入检查结果" :class="{'warning': warningResults.checkResult}" @change="updateWarning('checkResult')"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            备注:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{remarks}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="remarks"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入备注">
            </el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" v-show="mode===VIEW_CURRENT_CARD && canEdit" @click="switchToEditingMode">编辑</div>
      <div class="button submit-button" v-show="mode!==VIEW_CURRENT_CARD" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { reviseDateFormat } from 'utils/helper.js';
// import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import { addGeneCheck, modifyGeneCheck } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,
      lockSubmitButton: false,
      checkDate: '', // 检查时间
      checkName: '', // 检查名称
      sampleNo: '', // 标本号
      sampleType: '', // 标本类型
      checkResult: '', // 检查结果
      remarks: '', // 备注
      warningResults: {
        checkDate: '',
        checkName: '',
        checkResult: ''
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
        return '新增基因检查';
      } else {
        return '基因检查';
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
    showModal(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.checkDate = item.checkDate;
      this.checkName = item.checkName;
      this.sampleNo = item.sampleNo;
      this.sampleType = item.sampleType;
      this.checkResult = item.checkResult;
      this.remarks = item.remarks;

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
      this.completeInit = true;
      this.displayModal = true;
      // console.log(item);
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
    getFieldValue(code, fieldName) {
      code = parseInt(code, 10);
      var options = this.getOptions(fieldName);
      var targetOption = Util.getElement('code', code, options);
      return targetOption.name ? targetOption.name : '';
    },
    updateWarning(fieldName) {
      if (this.completeInit && !this[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.displayModal = false;
      this.lockSubmitButton = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
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
      };

      var geneInfo = {};
      geneInfo.patientCaseId = this.$route.params.caseId;
      geneInfo.checkDate = this.checkDate;
      geneInfo.checkName = this.checkName;
      geneInfo.sampleNo = this.sampleNo;
      geneInfo.sampleType = this.sampleType;
      geneInfo.checkResult = this.checkResult;
      geneInfo.remarks = this.remarks;
      reviseDateFormat(geneInfo);

      // console.log(geneInfo);
      if (this.mode === this.ADD_NEW_CARD) {
        addGeneCheck(geneInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        modifyGeneCheck(geneInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);
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
    }
  },
  mounted() {
    Bus.$on(this.SHOW_GENE_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 90px;
@long-field-name-width: 160px;

.gene-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .gene-modal{
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content{
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 100%;
        min-height: 45px;
        box-sizing: border-box;
        text-align: left;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.half-line {
          width: 50%;
          .field-input {
            width: calc(~"92% - @{field-name-width}");
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
          // &.long-field-name {
          //   width: @long-field-name-width;
          // }
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
          width: calc(~"96% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          // &.long-field-name {
          //   left: @long-field-name-width;
          // }
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
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .el-textarea {
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
