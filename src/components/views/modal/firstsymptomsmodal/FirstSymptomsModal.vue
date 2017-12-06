<template lang="html">
  <div class="symptoms-modal-wrapper" v-show="displayModal">
    <div class="symptoms-modal" ref="scrollArea">
      <h3 class="title">{{title+title2}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name long-field-name">
            {{title2}}类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>ggggggggg</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.firSymType}}</span>
            <el-select v-model="copyInfo.firSymType" placeholder="请选择首发症状类型" clearable
             @change="updateWarning('firSymType'),clearVal('firSymType')" :class="{'warning': warningResults.firSymType}" >
              <el-option
                v-for="item in getOptions('SympType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
          </el-select>
          </span>
        </div>

        <!-- 以下是 运动症状才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="copyInfo.firSymType===0">
          <div class="field">
            <span class="field-name long-field-name">
              症状名称:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.firSymName}}</span>
              <el-select v-model="copyInfo.firSymName" placeholder="请选择症状名称" clearable
               @change="updateWarning('firSymName')" :class="{'warning': warningResults.firSymName}" >
                <el-option
                 v-for="item in getSymOptions(copyInfo.firSymType)" 
                 :key="item.code" :label="item.name" 
                 :value="item.code"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              左上肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>左上肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.ariseTimeLeftUp" type="date" placeholder="请选择左上肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              右上肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>右上肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.ariseTimeRightUp" type="date" placeholder="请选择右上肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              左下肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>左下肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.ariseTimeLeftDown" type="date" placeholder="请选择左下肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              右下肢出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>右下肢出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.ariseTimeRightDown" type="date" placeholder="请选择右下肢出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              是否规律出现:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>是否规律出现</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="copyInfo.regular" placeholder="请选择是否规律出现">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
            </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>备注</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="copyInfo.remarks" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 运动症状才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->


        <!-- 以下是 运动并发症才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="copyInfo.firSymType===1">
          
          <div class="field">
            <span class="field-name long-field-name">
              症状名称:---222----
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.firSymName}}</span>
              <el-select v-model="copyInfo.firSymName" placeholder="请选择症状名称" clearable
               @change="updateWarning('firSymName')" :class="{'warning': warningResults.firSymName}" >
                <el-option v-for="item in getSymOptions(copyInfo.firSymType)" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.ariseTime" type="date" placeholder="请选择出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              是否规律出现:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>是否规律出现</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="copyInfo.regular"
                placeholder="请选择是否规律出现">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              持续时长（小时/天）:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>持续时长</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="copyInfo.lastTime" placeholder="请输入持续时长"></el-input>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>备注</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="copyInfo.remarks" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 运动并发症才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

        <!-- 以下是 非运动症状才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="copyInfo.firSymType===2">

          <div class="field">
            <span class="field-name long-field-name">
              非运动症状类型:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.notSportType}}</span>
              <el-select v-model="copyInfo.notSportType" placeholder="请选择非运动症状类型"
               @change="updateWarning('notSportType')" :class="{'warning': warningResults.notSportType}" >
                <el-option
                 v-for="item in getOptions('noSportSymType')"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
                </el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              症状名称:---333----
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>症状名称值</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.firSymName}}</span>
              <el-select v-model="copyInfo.firSymName" placeholder="请选择症状名称" clearable
               @change="updateWarning('firSymName')" :class="{'warning': warningResults.firSymName}" >
                <el-option v-for="item in getNoSportOptions(copyInfo.notSportType)" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              出现时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>出现时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.ariseTime" type="date" placeholder="请选择出现时间" clearable ></el-date-picker>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              是否规律出现:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>是否规律出现</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="copyInfo.regular"
                placeholder="请选择是否规律出现">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              备注:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>备注</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="copyInfo.remarks" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 非运动症状才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      </div>

      <div class="seperate-line" v-show="true"></div>

      

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode!==VIEW_CURRENT_CARD" class="button submit-button" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit" class="button edit-button" @click="switchToEditingMode">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import { addPatientFirstSymbol, addPatientSymptom} from 'api/patient.js';
export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,
      title2: 'ttt',
      copyInfo: {
        firSymType: '', // int 首发症状类型 0 1 2
        firSymName: '', // int 症状名称
        ariseTimeLeftDown: '', // 左下肢出现时间
        ariseTimeLeftUp: '', // 左上肢出现时间
        ariseTimeRightDown: '', // 右下肢出现时间
        ariseTimeRightUp: '', // 右上肢出现时间
        regular: '',
        remarks: '',
        ariseTime: '', // 出现时间
        lastTime: '', // 持续时间
        notSportType: '' // 非运动症状类型
      },
      warningResults: {
        firSymType: '',
        firSymName: '',
        notSportType: ''
      },
      lockSubmitButton: false,
      showEdit: true
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'symptomType',
      'noSportType'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增';
      } else {
        return '';
      }
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.showEdit) {
        return true;
      } else {
        return false;
      }
    },
    verificationFieldList() {
      if (this.copyInfo.firSymType === 0 || this.copyInfo.firSymType === 1) {
        return ['firSymType', 'firSymName'];
      } else if (this.copyInfo.firSymType === 2) {
        return ['firSymType', 'firSymName', 'notSportType'];
      } else {
        return ['firSymType'];
      }
    }
  },
  methods: {
    clearVal(fieldName) {
      for (let key in this.copyInfo) {
        if (key !== fieldName) {
          this.$set(this.copyInfo, key, '');
        };
      };
      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
    },
    showModal(cardOperation, item, title2) {
      this.completeInit = false;
      console.log(cardOperation, item);
      this.mode = cardOperation;
      this.title2 = title2;
      // jjjj

      if (this.mode === this.ADD_NEW_CARD) {
        for (let key in this.copyInfo) {
          this.$set(this.copyInfo, key, '');
        };
      };

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
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
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
    getSymOptions(fieldType) {
      return this.symptomType.filter((obj) => {
        return obj.symptomtype === fieldType;
      }).map((obj) => {
        return {
          name: obj.sympName,
          code: obj.id
        };
      });
    },
    getNoSportOptions(fieldType) {
      return this.noSportType.filter((obj) => {
        return obj.noSportType === fieldType;
      }).map((obj) => {
        return {
          name: obj.noSportName,
          code: obj.id
        };
      });
    },
    updateWarning(fieldName) {
      if (this.completeInit && !this.copyInfo[fieldName] && this.copyInfo[fieldName] !== 0) {
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

      // 验证必填项 如果没填显示红框，显示必填项三个字
      for (let property in this.warningResults) {
        if (this.verificationFieldList.indexOf(property) >= 0 && this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      };
      // 如果显示了必填项三个字，说明验证没通过，就将确定按钮锁住，并退出
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      };

      // 验证完成，准备请求数据
      if (this.title2 === '主诉症状') {
        var ComplaintsInfo = {}; // 主诉症状数据
        ComplaintsInfo.patientId = this.$route.params.id;
        ComplaintsInfo.patientCaseId = this.$route.params.caseId;

        ComplaintsInfo.symType = this.copyInfo.firSymType;
        ComplaintsInfo.symptomTypeId = this.copyInfo.firSymName;
        ComplaintsInfo.ariseTimeLeftUp = this.copyInfo.ariseTimeLeftUp;
        ComplaintsInfo.ariseTimeRightUp = this.copyInfo.ariseTimeRightUp;
        ComplaintsInfo.ariseTimeLeftDown = this.copyInfo.ariseTimeLeftDown;
        ComplaintsInfo.ariseTimeRightDown = this.copyInfo.ariseTimeRightDown;
        ComplaintsInfo.whetherLaw = this.copyInfo.regular === 1 ? '是' : '否';
        ComplaintsInfo.remarks = this.copyInfo.remarks;
        ComplaintsInfo.ariseTime = this.copyInfo.ariseTime;
        ComplaintsInfo.lastTime = this.copyInfo.lastTime;
        ComplaintsInfo.notSportType = this.copyInfo.notSportType;
      };

      reviseDateFormat(ComplaintsInfo);
      pruneObj(ComplaintsInfo);

      console.log(ComplaintsInfo);
      // if (true) {
      //   return;
      // };
      if (this.mode === this.ADD_NEW_CARD) {
        if (this.title2 === '主诉症状') {
          addPatientSymptom(ComplaintsInfo).then(() => {
            this.updateAndClose();
            this.lockSubmitButton = false;
          }, this._handleError);
        } else {
          // addPatientFirstSymbol(ComplaintsInfo).then(() => {
          //   this.updateAndClose();
          //   this.lockSubmitButton = false;
          // }, this._handleError);
        };
      };

    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_FIRSTSYMPTOMS_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 90px;
@long-field-name-width: 160px;

.symptoms-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .symptoms-modal{
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
        vertical-align: top;
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
          position: relative;
          top: 0;
          left: @long-field-name-width;
          width: calc(~"96% - @{long-field-name-width}");
          line-height: @field-line-height;
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
            margin-bottom: 15px;
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

