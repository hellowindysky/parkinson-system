<template lang="html">
  <div class="treatment-modal-wrapper" v-show="displayModal">
    <div class="treatment-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name long-field-name">
            初诊治疗类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{copyInfo.firstVisitType}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.firstVisitType}}</span>
            <el-select v-model="copyInfo.firstVisitType" placeholder="请选择初诊治疗类型" clearable
             @change="updateWarning('firstVisitType'),clearVal(['firstVisitType'])" :class="{'warning': warningResults.firstVisitType}" >
              <el-option
                v-for="item in firstTreatmentTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.name">
              </el-option>
          </el-select>
          </span>
        </div>

        <!-- 以下是 药物治疗才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="copyInfo.firstVisitType==='药物治疗'">
          <div class="field">
            <span class="field-name long-field-name">
              药物分类:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>药物分类</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">必填项</span>
              <el-select v-model="copyInfo.medicineClassification" placeholder="请选择药物分类" clearable
               @change="updateWarning('medicineClassification')" :class="{'warning': warningResults.medicineClassification}" >
                  <el-option label="B型单胺氧化抑制剂" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="COMT抑制剂" :value="SMOKE_HISTORY_MODAL"></el-option>
                  <el-option label="多巴胺类制剂" :value="TEA_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              药物名称:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>药物名称</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="value1"
                placeholder="请选择药物名称">
                  <el-option label="药物名称1" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="药物名称2" :value="SMOKE_HISTORY_MODAL"></el-option>
                  <el-option label="药物名称3" :value="TEA_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              通用名:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name">
              <span>选择药物名称自动匹配</span>
            </span>
            <!-- <span class="field-input" v-else>
                <span class="warning-text">必填项</span>
              <el-date-picker v-model="date1" type="date" placeholder="请选择右上肢出现时间" clearable ></el-date-picker>
            </span> -->
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              每日用量（mg）:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>每日用量</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-input v-model="date1" placeholder="请输入每日用量"></el-input>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              初次用药时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>初次用药时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="date1" type="date" placeholder="请选择初次用药时间" clearable ></el-date-picker>
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
              <el-input v-model="date1" placeholder="请输入备注"></el-input>
            </span>
          </div>

        </div>
        <!-- 以上是 药物治疗才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->


        <!-- 以下是 非药物治疗才有的序列 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
        <div v-show="copyInfo.firstVisitType!=='药物治疗'&&copyInfo.firstVisitType">

          <div class="field">
            <span class="field-name long-field-name">
              治疗类型:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>治疗类型</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.treatmentType}}</span>
              <el-select v-model="copyInfo.treatmentType" clearable placeholder="请选择症状名称"
               @change="updateWarning('treatmentType')" :class="{'warning': warningResults.treatmentType}" >
                <el-option label="手术治疗" :value="WINE_HISTORY_MODAL"></el-option>
                <el-option label="物理治疗" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              治疗手段:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>治疗手段</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-select v-model="copyInfo.treatmentMethod" clearable
                placeholder="请选择治疗手段">
                  <el-option label="吃药" :value="WINE_HISTORY_MODAL"></el-option>
                  <el-option label="打针" :value="SMOKE_HISTORY_MODAL"></el-option>
              </el-select>
            </span>
          </div>

          <div class="field">
            <span class="field-name long-field-name">
              治疗时间:
              <!-- <span class="required-mark">*</span> -->
            </span>
            <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
              <span>治疗时间</span>
            </span>
            <span class="field-input" v-else>
              <!-- <span class="warning-text">必填项</span> -->
              <el-date-picker v-model="copyInfo.treatmentTime" type="date" placeholder="请选择治疗时间" clearable ></el-date-picker>
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
        <!-- 以上是 非药物治疗才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      </div>

      <div class="seperate-line" v-show="true"></div>

      

      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-show="true" class="button submit-button" @click="submit">确定</div>
      <div v-show="false" class="button edit-button" @click="switchToEditingMode">编辑</div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import Ps from 'perfect-scrollbar';
import Util from 'utils/util.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      completeInit: false,
      copyInfo: {
        firstVisitType: '', // 初诊治疗类型
        treatmentType: '', // 治疗类型
        treatmentMethod: '', // 治疗手段
        treatmentTime: '', // 治疗时间
        remarks: '', // 备注

        medicineClassification: '', // 药物分类
        medicineName: '', // 药物名称
        commonMedicineName: '', // 通用名
        dailyDosage: '', // 每日用量
        firstTime: '' // 初次用药时间
      },
      warningResults: {
        firstVisitType: '',
        treatmentType: '',
        medicineClassification: ''
      },
      value1: '',
      value2: '',
      date1: ''
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增初诊治疗';
      } else {
        return '初诊治疗';
      }
    },
    firstTreatmentTypeOptions() {
      return this.getOptions('treatPro');
    }
  },
  methods: {
    clearVal(fieldName) {
      for (let key in this.copyInfo) {
        if (fieldName.indexOf(key) === -1) {
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
    showModal(cardOperation, item) {
      // this.completeInit = false;
      console.log(cardOperation, item);
      this.mode = cardOperation;
      // gggg
      // gggg
      // gggg
      // gggg
      // gggg
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
    updateWarning(fieldName) {
      if (this.completeInit && !this.copyInfo[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
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
    cancel() {
      this.displayModal = false;
    },
    switchToEditingMode() {
      // ffff
    },
    submit() {
      // ggg
    }
  },
  mounted() {
    Bus.$on(this.SHOW_FIRSTTREATMENT_MODAL, this.showModal);
    console.log(this.firstTreatmentTypeOptions);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 90px;
@long-field-name-width: 160px;

.treatment-modal-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .treatment-modal{
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
  }
}
</style>

