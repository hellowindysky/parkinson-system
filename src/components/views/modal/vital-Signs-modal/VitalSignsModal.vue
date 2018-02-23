<template lang="html">
  <div class="vital-signs-modal-wrapper">
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
              type="datetime"
              format="yyyy-MM-dd HH:mm"
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
              <span class="warning-text">{{warningResults.breathing}}</span>
              <el-input
                v-model="breathing"
                placeholder="请输入每分钟呼吸频率"
                :class="{'warning': warningResults.breathing}"
                @change="updateWarning('breathing')">
              </el-input>
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
            <span class="warning-text">{{warningResults.temperature}}</span>
            <el-input
              v-model="temperature"
              placeholder="请输入体温"
              :class="{'warning': warningResults.temperature}"
              @change="updateWarning('temperature')">
            </el-input>
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
            <span class="warning-text">{{warningResults.pulse}}</span>
          <el-input
            v-model="pulse"
            placeholder="请输入每分钟脉搏频率"
            :class="{'warning': warningResults.pulse}"
            @change="updateWarning('pulse')"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            心率情况:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          <span>{{transform(rhythm,'rhythm')}}</span>
          </span>
          <span class="field-input" v-else>
          <el-select v-model="rhythm" placeholder="请选择心率情况" clearable>
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
          <table class="table">
          <tr class="row title-row">
            <td class="col" colspan="3" rowspan="1">卧立位血压</td>
            <td class="col col-4" rowspan="2">心率（次/分）</td>
            <td class="col col-5" rowspan="2">头晕</td>
          </tr>
          <tr class="row">
            <td class="col title-col col-1">卧立位血压</td>
            <td class="col title-col col-2">体侧</td>
            <td class="col title-col col-3">收缩压 / 舒张压（mmHg）</td>
          </tr>
           <tr class="row" v-for="sign in patientVitalSignDetail">
            <td class="col col-1">
              {{transform(sign.bp,'vitalSignBP')}}
            </td>
            <td class="col col-2">
              <span v-if="mode===VIEW_CURRENT_CARD">{{transform(sign.side,'vitalSignSide')}}</span>
              <el-select v-else v-model="sign.side" clearable placeholder="请选择体侧" @change="updateWarning('vitalSignSide')">
              <el-option
                v-for="item in getOptions('vitalSignSide')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            </td>
            <td class="col col-3">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{sign.systolic}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left" v-model="sign.systolic" @blur="transformToNumber(sign, 'systolic')"></el-input>
              </span>
              <span>/</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{sign.diastolic}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right" v-model="sign.diastolic" @blur="transformToNumber(sign, 'diastolic')"></el-input>
              </span>
            </td>
            <td class="col col-4">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span>{{sign.heartrate}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input v-model="sign.heartrate" @blur="transformToNumber(sign, 'heartrate', 0)"></el-input>
              </span>
            </td>
            <td class="col col-5">
              <span v-if="mode===VIEW_CURRENT_CARD">{{transform(sign.dizzy,'vitalSignDizzy')}}</span>
              <el-select v-else v-model="sign.dizzy" clearable placeholder="是否头晕" @change="updateWarning('vitalSignDizzy')">
              <el-option
                v-for="item in getOptions('vitalSignDizzy')"
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
        <div v-show="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy, pruneObj } from 'utils/helper.js';
import { addVitalSigns, modifyVitalSigns } from 'api/patient.js';
export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      id: '',
      patientVitalSign: '',
      checkTime: '',
      breathing: '',
      temperature: '',
      pulse: '',
      rhythm: '',
      patientVitalSignDetail: [
        {
          'bp': 1,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        },
        {
          'bp': 2,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        },
        {
          'bp': 3,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        },
        {
          'bp': 4,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        },
        {
          'bp': 5,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        },
        {
          'bp': 6,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        },
        {
          'bp': 7,
          'side': '',
          'systolic': '',
          'diastolic': '',
          'heartrate': '',
          'dizzy': ''
        }
      ],
      warningResults: {
        checkTime: '',
        breathing: '',
        temperature: '',
        heartrate: '',
        diastolic: '',
        pulse: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      showEdit: false
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
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      for (let sign of this.patientVitalSignDetail) {
        sign.side = '';
        sign.dizzy = '';
        sign.systolic = '';
        sign.diastolic = '';
        sign.heartrate = '';
      }

      // console.log('item: ', item);
      this.id = item.id;
      this.checkTime = item.checkTime ? item.checkTime : '';
      this.breathing = item.breathing ? item.breathing : '';
      this.temperature = item.temperature ? item.temperature : '';
      this.pulse = item.pulse ? item.pulse : '';
      this.rhythm = item.rhythm;
      vueCopy(item.patientVitalSignDetail, this.patientVitalSignDetail);

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      // this.displayModal = true;
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
    transformToNumber(obj, property, decimalDigits) {
      var value = parseFloat(obj[property]);
      if (obj[property] !== '' && obj[property] !== value) {
        obj[property] = isNaN(value) ? '' : value;
      }
      if (decimalDigits !== undefined && obj[property] !== '') {
        obj[property] = Number(obj[property].toFixed(decimalDigits));
      }
    },
    updateWarning(fieldName) {
      var list = ['checkTime'];
      if (list.indexOf(fieldName) >= 0 && !this[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      };
      var menu = ['breathing', 'pulse'];
      for (var i = 0 ; i < menu.length ; i++) {
        if (fieldName === menu[i]) {
          let fieldVal = this[fieldName];
          if (fieldVal !== '' && !Util.checkIfPositiveInteger(fieldVal)) {
            this.$set(this.warningResults, fieldName, '请填入正整数');
          } else {
            this.$set(this.warningResults, fieldName, '');
          }
        }
      };
      if (fieldName === 'temperature') {
        let fieldVal = this[fieldName];
        if (fieldVal !== '' && !Util.checkIfNotMoreThanNDecimalNums(fieldVal, 2)) {
          this.$set(this.warningResults, fieldName, '请填入正数,仅保留两位小数');
        } else {
          this.$set(this.warningResults, fieldName, '');
        }
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
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

      this.updateWarning('checkTime');
      for (const property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }

      var vitalSignsInfo = {};
      vitalSignsInfo.patientCaseId = this.$route.params.caseId;
      vitalSignsInfo.patientVitalSign = this.patientVitalSign;
      vitalSignsInfo.checkTime = Util.simplifyTime(this.checkTime);
      vitalSignsInfo.breathing = this.breathing;
      vitalSignsInfo.temperature = this.temperature;
      vitalSignsInfo.pulse = this.pulse;
      vitalSignsInfo.rhythm = this.rhythm;
      vitalSignsInfo.patientVitalSignDetail = deepCopy(this.patientVitalSignDetail);
      pruneObj(vitalSignsInfo);

      if (this.mode === this.ADD_NEW_CARD) {
        addVitalSigns(vitalSignsInfo).then(() => {
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        vitalSignsInfo.id = this.id;
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
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
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
  },
  watch: {
    '$route.path'() {
      // if (this.displayModal) {
      //   this.cancel();
      // }
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 110px;

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
    width: 660px;
    max-height: 90%;
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
            width: calc(~"98% - @{field-name-width}");
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
            width: 20%;
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
            &.col-1,
            &.col-4,
            &.col-5 {
              width: 10%;
            }
            &.col-2 {
              width: 12%;
            }
            &.col-3 {
              width: 16%;
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
                height: 34px;
                text-align: center;
              }
              .el-input__icon {
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
              line-height: 35px;
            }
            .right {
              display: inline-block;
              position: absolute;
              width: 45%;
              height: 100%;
              right: 0;
              top: 0;
              line-height: 35px;
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
