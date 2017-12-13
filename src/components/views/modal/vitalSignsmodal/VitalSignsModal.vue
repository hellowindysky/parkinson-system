<template lang="html">
  <div class="vital-signs-modal-wrapper" v-show="displayModal">
    <div class="vital-signs-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            检查时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{checkTime}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.checkTime}}</span>
            <el-date-picker
              v-model="checkTime"
              :class="{'warning': warningResults.checkTime}"
              type="date"
              placeholder="请输入检查时间"
              :picker-options="pickerOptions"
              @change="updateWarning('checkTime')">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            呼吸（次/分）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{breathing}}</span>
          </span>
          <span class="field-input" v-else>
           <el-input v-model="breathing" placeholder="请输入每分钟呼吸频率"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            体温（℃）:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{temperature}}</span>
          </span>
          <span class="field-input" v-else>
           <el-input v-model="temperature" placeholder="请输入体温"></el-input>
          </span>
        </div>
      <div class="field">
        <span class="field-name">
         脉搏（次/分）:
        </span>
        <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          <span>{{pulse}}</span>
        </span>
        <span class="field-input" v-else>
         <el-input v-model="pulse" placeholder="请输入每分钟脉搏频率"></el-input>
        </span>
      </div>
      <div class="field">
        <span class="field-name">
        心率情况:
        </span>
        <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          <span>{{rhythm}}</span>
        </span>
        <span class="field-input" v-else>
          <span class="warning-text">{{warningResults.rhythm}}</span>
         <el-select v-model="rhythm" placeholder="请选择心率情况" @change="updateWarning('rhythm')"
              :class="{'warning': warningResults.rhythm}">
              <el-option
                v-for="item in getOptions('rhythm')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
        </span>
      </div>
      <div class="seperate-line"></div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            卧立位血压
            <td class="sol1 wide-col">卧立位血压</td>
            <td class="sol2 wide-col">体侧</td>
            <td class="sol3 wide-col">收缩压/舒张压（mmg）</td>
            <td class="col wide-col">心率（次/分）</td>
            <td class="col">头晕</td>
          </tr>
          <tr class="row" v-for="(reaction, index) in decubitusList">
            <td class="col wide-col">
              {{transformDecubitus(reaction.reactionType, 'reactionType')}}
            </td>
            <td class="col narrow-col">
              <span v-if="mode===VIEW_CURRENT_CARD">{{reaction.decubitusDizzy}}</span>
              <el-select v-else v-model="reaction.decubitusDizzy" @change="updateWarning('decubitusDizzy')">
              <el-option
                v-for="item in getOptions('decubitusDizzy')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            </td>
          </tr>
        </table>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-show="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy, reviseDateFormat, pruneObj } from 'utils/helper.js';
import { addVitalSigns, modifyVitalSigns } from 'api/patient.js';
export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,
      decubitusList: ['卧位', '坐位', '立位立即', '立位 1min', '立位 3min', '立位 5min', '立位 7min'],

      patientVitalSignsId: '',
      patientVitalSign: '',
      checkTime: '',
      breathing: '',
      temperature: '',
      pulse: '',
      rhythm: '',
      patientVitalSignDetail: [
        {
          'reactionType': 1,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 2,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 3,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 4,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 5,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 6,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 7,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 8,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 9,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 10,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 11,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 12,
          'severityLevel': 0,
          'assessType': 1
        },
        {
          'reactionType': 13,
          'severityLevel': 0,
          'assessType': 1
        }
      ],
      warningResults: {
        checkTime: ''
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
        return '新增生命体征';
      } else {
        return '生命体征';
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
      this.patientVitalSignsId = item.patientVitalSignsId ? item. patientVitalSignsId : '';
      this.checkTime = item.checkTime ? item.checkTime : '';
      this.breathing = item.breathing ? item.breathing : '';
      this.temperature = item.temperature ? item.temperature : '';
      this.pulse = item.pulse ? item.pulse : '';
      this.rhythm = item.rhythm ? item.rhythm : '';
      vueCopy(item.patientVitalSign, this.patientVitalSign);
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
    transformDecubitus(code, fieldName) {
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
    getRealName(code, typeGroupCode) {
      var typesInfo = Util.getElement('typegroupcode', typeGroupCode, this.typeGroup);
      var types = typesInfo && typesInfo.types ? typesInfo.types : [];
      var type = Util.getElement('typeCode', code, types);
      return type.typeName ? type.typeName : '';
    },
    transformToNum(obj, property) {
      // 如果填写的不是一个数字，则转换成一个空字符串，如果是一个数字，则将这个数字字符串转化为真正的数字
      var value = obj[property];
      var reg = new RegExp(/^[0-9]+\.{0,1}[0-9]{0,2}$/);
      if (reg.test(value)) {
        obj[property] = Number(value);
      } else {
        obj[property] = '';
      }
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
        if (this.fieldListToCheck.indexOf(property) >= 0 && this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.fieldListToCheck.indexOf(property) >= 0 && this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }
      var vitalSignsInfo = {};
      vitalSignsInfo.patientVitalSignsId = this.$route.params.caseId;
      vitalSignsInfo.patientVitalSign = this.patientVitalSign;
      vitalSignsInfo.checkTime = this.checkTime;
      vitalSignsInfo.breathing = this.breathing;
      vitalSignsInfo.temperature = this.temperature;
      vitalSignsInfo.pulse = this.pulse;
      vitalSignsInfo.rhythm = this.rhythm;
      vitalSignsInfo.patientVitalSign = deepCopy(this.patientVitalSign);
      reviseDateFormat(vitalSignsInfo);
      pruneObj(vitalSignsInfo);

      if (this.mode === this.ADD_NEW_CARD) {
        addVitalSigns(vitalSignsInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        vitalSignsInfo.patientVitalSignsId = this.patientVitalSignsId;
        modifyVitalSigns(vitalSignsInfo).then(() => {
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
    Bus.$on(this.SHOW_VITALSIGNS_MODAL, this.showPanel);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_VITALSIGNS_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.vital-signs-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .vital-signs-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 5%;
    width: 600px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      // text-align: left;
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
      .table {
        margin: 10px 0 20px;
        width: 100%;
        border: 1px solid @light-gray-color;
        border-collapse: collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            .required-mark {
              position: absolute;
              right: 5px;
              top: 8px;
              color: red;
              font-size: 25px;
              vertical-align: middle;
            }
            &.title-col {
              background-color: @font-color;
              color: #fff;
            }
            &.wide-col {
              width: 30%;
            }
            &.narrow-col {
              width: 5%;
            }
            .iconfont {
              position: absolute;
              left: 5px;
              top: 9px;
              cursor: pointer;
              z-index: 20;
              &.icon-remove {
                color: @alert-color;
              }
              &:hover {
                opacity: 0.6;
              }
              &:active {
                opacity: 0.8;
              }
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
      .sol1 {
         position: absolute;
         width: 18%;
         display: inline-block;
         transform: translate(-216px,16px);
         border: 1px solid @light-gray-color;
         text-align: center;
      }
      .sol2 {
         position: absolute;
         width: 10%;
         display: inline-block;
         transform: translate(-90px,16px);
         border: 1px solid @light-gray-color;
         text-align: center;
      }
      .sol3 {
         position: absolute;
         width: 24%;
         display: inline-block;
         transform: translate(-20px,16px);
         border: 1px solid @light-gray-color;
         text-align: center;
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
