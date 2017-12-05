<template lang="html">
  <div class="physiontherapy-modal-wrapper" v-show="displayModal">
    <div class="physiontherapy-modal" ref="scrollArea">
         <h3 class="title">{{title}}</h3>
         <div class="content">
            <div class="field whole-line">
          <span class="field-name">
            物理治疗类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
             <span>{{physiType}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.physiType}}</span>
            <el-select v-model="physiType" placeholder="经颅磁刺激" @change="updateWarning('physiType')"
              :class="{'warning': warningResults.physiType}">
              <el-option
                v-for="item in getOptions('physiType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option> 
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
           记录时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{recordDate}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.recordDate}}</span>
            <el-date-picker
              v-model="recordDate"
              :class="{'warning': warningResults.recordDate}"
              type="date"
              placeholder="请选择记录时间"
              :picker-options="pickerOptions"
              @change="updateWarning('recordDate')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            设备型号:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{deviceType}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input v-model="deviceType" placeholder="请输入设备型号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            刺激强度（T）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{stimulusIntensity}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="stimulusIntensity" placeholder="请输入刺激强度"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            刺激频率（HZ）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{stimulusFrequency}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="stimulusFrequency" placeholder="请输入刺激频率"></el-input>
          </span>
        </div>
         <div class="field">
          <span class="field-name">
           刺激侧:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{stimulusSide}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.stimulusSide}}</span>
            <el-select v-model="stimulusSide" placeholder="请选择刺激侧" @change="updateWarning('stimulusSide')"
              :class="{'warning': warningResults.stimulusSide}">
              <el-option
                v-for="item in getOptions('stimulusSide')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            刺激时长（分钟）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{stimulusDuration}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="stimulusDuration" placeholder="请输入刺激时长"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            治疗前左侧运动阈值:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{leftThresholdBefore}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.leftThresholdBefore}}</span>
            <el-input v-model="leftThresholdBefore" placeholder="请输入运动阈值" :class="{'warning': warningResults.leftThresholdBefore}" @change="updateWarning('leftThresholdBefore')"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
             治疗前右侧运动阈值:
             <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{rightThresholdBefore}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.rightThresholdBefore}}</span>
            <el-input v-model="rightThresholdBefore" placeholder="请输入运动阈值" :class="{'warning': warningResults.rightThresholdBefore}" @change="updateWarning('rightThresholdBefore')" ></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
             治疗后左侧运动阈值:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{leftThresholdAfter}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="leftThresholdAfter" placeholder="请输入运动阈值"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
             治疗后右侧运动阈值:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{rightThresholdAfter}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="rightThresholdAfter" placeholder="请输入运动阈值"></el-input>
          </span>
        </div>
      </div>

       <div class="seperate-line"></div>
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-show="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import { addPhysiontherapy, modifyPhysiontherapy } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,

      patientPhytheTmsId: '',
      patientPhytheTms: '',
      physiType: '',
      recordDate: '',
      deviceType: '',
      stimulusIntensity: '',
      stimulusFrequency: '',
      stimulusSide: '',
      stimulusDuration: '',
      leftThresholdBefore: '',
      rightThresholdBefore: '',
      leftThresholdAfter: '',
      rightThresholdAfter: '',
      warningResults: {
        physiType: '',
        recordDate: '',
        leftThresholdBefore: '',
        rightThresholdBefore: ''
      },
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
        return '新增物理治疗';
      } else {
        return '物理治疗';
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

      // console.log('item: ', item);
      this.patientPhytheTmsId = item.patientPhytheTmsId ? item.patientPhytheTmsId : '';
      this.recordDate = item.recordDate ? item.recordDate : '';
      this.physiType = item.physiType ? item.physiType : '';
      this.deviceType = item.deviceType ? item.deviceType : '';
      this.stimulusIntensity = item.stimulusIntensity ? item.stimulusIntensity : '';
      this.stimulusSide = item.stimulusSide ? item.stimulusSide : '';
      this.stimulusDuration = item.stimulusDuration ? item.stimulusDuration : '';
      this.leftThresholdBefore = item.leftThresholdBefore ? item.leftThresholdBefore : '';
      this.rightThresholdBefore = item.rightThresholdBefore ? item.rightThresholdBefore : '';
      this.leftThresholdAfter = item.leftThresholdAfter ? item.leftThresholdAfter : '';
      this.rightThresholdAfter = item.rightThresholdAfter ? item.rightThresholdAfter : '';

      this.$nextTick(() => {
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
      if (this.completeInit && !this[fieldName]) {
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
      var physicsInfo = {};
      physicsInfo.patientCaseId = this.$route.params.caseId;

      physicsInfo.physiType = this.physiType;
      physicsInfo.recordDate = this.recordDate;
      physicsInfo.deviceType = this.deviceType;
      physicsInfo.stimulusIntensity = this.stimulusIntensity;
      physicsInfo.stimulusFrequency = this.stimulusFrequency;
      physicsInfo.stimulusSide = this.stimulusSide;
      physicsInfo.stimulusDuration = this.stimulusDuration;
      physicsInfo.leftThresholdBefore = this.leftThresholdBefore;
      physicsInfo.rightThresholdBefore = this.rightThresholdBefore;
      physicsInfo.leftThresholdAfter = this.leftThresholdAfter;
      physicsInfo.rightThresholdAfter = this.rightThresholdAfter;

      reviseDateFormat(physicsInfo);
      pruneObj(physicsInfo);

      if (this.mode === this.ADD_NEW_CARD) {
        addPhysiontherapy(physicsInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        physicsInfo.patientPhytheTmsId = this.patientPhytheTmsId;
        modifyPhysiontherapy(physicsInfo).then(() => {
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
    Bus.$on(this.SHOW_PHYSIONTHERAPY_MODAL, this.showPanel);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_PHYSIONTHERAPY_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 150px;
@long-field-name-width: 160px;

@col-id-width: 100px;
@col-time-width: 200px;
@col-amount-width: 150px;
@col-unit-width: 150px;

.physiontherapy-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .physiontherapy-modal {
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
      .seperate-line {
        border-style: none;
        border-top: 1px solid @light-gray-color;
        margin-top: 5px;
        margin-bottom: 15px;
      }
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
          position: relative;
          left: @field-name-width;
          width: calc(~"90% - @{field-name-width}");
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
      .field-file {
        margin-bottom: 10px;
        transform: translateX(10px);
        .field-name {
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          width: @field-name-width;
          line-height: 20px;
          font-size: @normal-font-size;
          color: @font-color;
        }
        .field-input {
          display: block;
          position: relative;
          left: @field-name-width;
          width: 96%;
          padding-right: @field-name-width;
          box-sizing: border-box;
          font-size: @normal-font-size;
          .last-files {
            margin-bottom: 10px;
            width: 100%;
            .last-files-title {
              transform: translateY(-5px);
              margin-bottom: 5px;
              height: 30px;
              line-height: 30px;
              background-color: @font-color;
              color: #fff;
              text-align: center;
              cursor: default;
            }
            .file {
              position: relative;
              padding-left: 5px;
              height: 30px;
              line-height: 30px;
              transition: 0.2s;
              cursor: default;
              .icon {
                display: inline-block;
                width: 20px;
              }
              .file-name {
                display: inline-block;
                padding: 0 3px;
                line-height: 20px;
                transform: translateX(-3px);
                cursor: pointer;
                &:hover {
                  border-bottom: 1px solid @font-color;
                }
              }
              .close-button {
                display: none;
                position: absolute;
                right: 0;
                width: 22px;
                text-align: center;
                color: @light-font-color;
                font-size: 13px;
              }
              &.editing {
                cursor: pointer;
                &:hover {
                  background-color: @screen-color;
                  .close-button {
                    display: inline-block;
                    &:hover {
                      color: @font-color;
                    }
                  }
                }
              }
            }
          }
          .upload-area {
            .el-upload {
              width: 100%;
              text-align: left;
              .el-button {
                width: 100%;
                height: 30px;
                border-radius: 10px;
                &:hover {
                  opacity: 0.7;
                }
                &:active {
                  opacity: 0.85;
                }
                &.el-button--text {
                  background-color: @light-font-color;
                  color: #fff;
                  &:disabled {
                    background-color: @gray-color;
                    cursor: not-allowed;
                  }
                }
              }
            }
            .el-upload__tip {
              line-height: normal;
              margin-top:0;
            }
            .el-upload-list {
              // max-height: 80px;
              // overflow-y: scroll;
            }
          }
        }
      }
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
