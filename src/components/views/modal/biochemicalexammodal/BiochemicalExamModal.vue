<template lang="html">
  <div class="biochemical-modal-wrapper" v-show="displayModal">
    <div class="biochemical-modal" ref="biochemicalModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            检查名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.bioexamId}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{getFieldValue(copyInfo.bioexamId, 'bioexamName')}}</span>
            <el-select v-else :class="{'warning': warningResults.bioexamId}" placeholder="请选择检查名称" v-model="copyInfo.bioexamId"
              @change="changeBioexam" :disabled="mode===EDIT_CURRENT_CARD">
              <el-option v-for="bioexItem in bioexamTypeList" :key="bioexItem.bioexamId"
                :label="bioexItem.examName" :value="bioexItem.id" ></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.checkDate}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.checkDate}}</span>
            <el-date-picker v-else :class="{'warning': warningResults.checkDate}" @change="updateWarning('checkDate')"
              placeholder="请输入检查时间" v-model="copyInfo.checkDate"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            血液标本编号:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <!-- <span class="warning-text">{{warningResults.checkDate}}</span> -->
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.checkDate}}</span>
            <el-input v-else placeholder="请输入血液标本编号" v-model="copyInfo.checkDate"></el-input>
          </span>
        </div>
        <div class="form-wrapper" ref="formWrapper">
          <table class="form">
            <tr class="row first-row">
              <td class="col col-id">
                序号
              </td>
              <td class="col col-name">
                项目名称
              </td>
              <td class="col col-english">
                英文缩写
              </td>
              <td class="col col-result">
                检查结果
              </td>
              <td class="col col-unit">
                单位名称
              </td>
              <td class="col col-range">
                参考范围
              </td>
              <td class="col col-remarks">
                备注
              </td>
            </tr>
             <tr v-for="(item, index) in targetBioexam" class="row">
              <td class="col col-id">{{index + 1}}</td>
              <td class="col col-name">
                {{item.projectName}}
                <span class="required-mark" v-show="copyInfo.bioexamId===12&&checkRequired(item.id)">*</span>
              </td>
              <td class="col col-english">
                {{item.englishAbbreviation}}
              </td>
              <td class="col col-result">
                <span class="warning-text" v-show="warningResults.checkDate&&copyInfo.bioexamId===12&&checkRequired(item.id)">必填项</span>
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.bioexamResult[index].result}}</span>
                <el-input v-else v-model="copyInfo.bioexamResult[index].result" :class="{'warning': warningResults.checkDate&&copyInfo.bioexamId===12&&checkRequired(item.id)}"
                  placeholder="请输入检查结果" :maxlength="500"></el-input>
              </td>
              <td class="col col-unit">
                {{item.projectUnit}}
              </td>
              <td class="col col-range">
                {{item.referenceRanges}}
              </td>
              <td class="col col-remarks">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.bioexamResult[index].remarks}}</span>
                <el-input v-else v-model="copyInfo.bioexamResult[index].remarks"
                  placeholder="请输入备注" :maxlength="500"></el-input>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" @click="switchToEditingMode" v-show="mode===VIEW_CURRENT_CARD && canEdit">编辑</div>
      <div class="button submit-button" @click="submit" v-show="mode!==VIEW_CURRENT_CARD">确定</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy } from 'utils/helper';
import { addBiochemical, modifyBiochemical } from 'api/patient.js';
export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      warningResults: {
        bioexamId: '',
        checkDate: ''
      },
      copyInfo: {},
      targetBioexam: [],
      lockSubmitButton: false,
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'bioexamTypeList'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增生化指标';
      } else {
        return '生化指标';
      }
    },
    patientId() {
      return this.$route.params.id;
    },
    patientCaseId() {
      return this.$route.params.caseId;
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
    checkRequired(id) {
      if (id === 55 || id === 68 || id === 69 || id === 70 || id === 75 || id === 63 || id === 62) {
        return true;
      };
      return false;
    },
    showPanel(cardOperation, item, showEdit) {
      this.displayModal = true;
      this.mode = cardOperation;
      // console.log('item', item);
      this.showEdit = showEdit;
      this.copyInfo = {};
      this.$set(this.copyInfo, 'bioexamId', '');
      this.$set(this.copyInfo, 'bioexamResult', []);
      this.$set(this.copyInfo, 'checkDate', '');
      this.$set(this.copyInfo, 'remarks', '');

      if (this.mode === this.ADD_NEW_CARD) {
        this.$set(this.copyInfo, 'patientCaseId', this.patientCaseId);
        this.$set(this.copyInfo, 'patientId', this.patientId);

      } else {
        vueCopy(item, this.copyInfo);
      }

      this.updateTemplate();

      this.$nextTick(() => {
        this.clearWarning();
      });
    },
    updateTemplate() {
      this.targetBioexam = [];
      for (let bioexam of this.bioexamTypeList) {
        if (bioexam.id === this.copyInfo.bioexamId) {
          vueCopy(bioexam.projects, this.targetBioexam);
          // console.log('targetBioexam', this.targetBioexam);
        }
      }
      this.updateScrollbar();
    },
    changeBioexam() {
      console.log(this.targetBioexam);
      this.updateWarning('bioexamId');
      this.updateTemplate();

      // 接下来要根据新的 targetBioexam 重置 this.copyInfo.bioexamResult
      this.$set(this.copyInfo, 'bioexamResult', []);
      for (let i = 0; i < this.targetBioexam.length; i++) {
        this.$set(this.copyInfo.bioexamResult, i, {});
        this.$set(this.copyInfo.bioexamResult[i], 'bioexamProjectId', this.targetBioexam[i].id);

        if (this.mode === this.ADD_NEW_CARD) {
          this.$set(this.copyInfo.bioexamResult[i], 'patientCaseId', this.patientCaseId);
          this.$set(this.copyInfo.bioexamResult[i], 'patientId', this.patientId);
        }
        this.$set(this.copyInfo.bioexamResult[i], 'remarks', '');
        this.$set(this.copyInfo.bioexamResult[i], 'result', '');
      }
      // console.log('current', this.copyInfo['bioexamResult']);
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
      this.targetBioexam = [];
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

      for (var fieldName in this.warningResults) {
        if (this.warningResults.hasOwnProperty(fieldName)) {
          this.updateWarning(fieldName);
          if (this.warningResults[fieldName] !== '') {
            this.lockSubmitButton = false;
            return;
          }
        }
      }

      let submitData = deepCopy(this.copyInfo);
      submitData.checkDate = Util.simplifyDate(submitData.checkDate);
      // console.log(submitData.checkDate instanceof Date);

      if (this.mode === this.EDIT_CURRENT_CARD) {
        modifyBiochemical(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      } else if (this.mode === this.ADD_NEW_CARD) {
        addBiochemical(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.displayModal = false;
    },
    updateWarning(fieldName) {
      if (this.copyInfo[fieldName]) {
        this.$set(this.warningResults, fieldName, '');
      } else {
        this.$set(this.warningResults, fieldName, '必填项');
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
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.formWrapper);
        Ps.initialize(this.$refs.formWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    getFieldValue(code, fieldName) {
      if (fieldName === 'bioexamName') {
        let info = Util.getElement('id', code, this.bioexamTypeList);
        return info.examName;
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.updateScrollbar();
    Bus.$on(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.showPanel);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.showPanel);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 110px;
@long-field-name-width: 160px;

@col-id-width: 40px;
@col-name-width: 180px;
@col-english-width: 70px;
@col-result-width: 160px;
@col-unit-width: 70px;
@col-range-width: 100px;
@col-remarks-width: 180px;

.biochemical-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .biochemical-modal {
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
      font-size: 0;
      .field {
        padding: 5px 0;
        text-align: left;
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        font-size: @normal-font-size;
        text-align: left;
        transform: translateX(10px);  // 这一行是为了修补视觉上的偏移
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
            top: 22px;
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
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .form-wrapper {
        position: relative;
        max-height: 250px;
        height: auto;
        width: 100%;
        // padding-right: 10px;
        border: 1px solid @inverse-font-color;
        overflow: hidden;
        .form {
          position: relative;
          width: 100%;
          // left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
          border-spacing: 0;
          .row {
            height: 45px;
            &.first-row {
              background-color: @screen-color;
              height: 30px;
            }
            .col {
              font-size: @normal-font-size;
              text-align: center;
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
                position: relative;
                .warning-text {
                  position: absolute;
                  top: 38px;
                  left: 10px;
                  height: 15px;
                  color: red;
                  font-size: @small-font-size;
                }
                .warning .el-input__inner {
                  border: 1px solid red;
                }
              }
              &.col-unit {
                width: @col-unit-width;
              }
              &.col-range {
                width: @col-range-width;
              }
              &.col-remarks {
                padding-right: 5px;
                width: @col-remarks-width;
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
