<template lang="html">
  <folding-panel :title="'病症情况'" :mode="mutableMode" :folded-status="foldedStatus" v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" v-on:toggleFoldedPanel="updateScrollbar" :editable="canEdit">
    <div class="diagnostic-disease" ref="diagnosticDisease">
      <div v-for="field in diagnosticDiseaseTemplate" class="field"
        :class="{'whole-line': field.fieldName === 'caseSymptom'}">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must === 1">*</span>
        </span>

        <div class="field-value" v-show="mutableMode===READING_MODE">
          <span v-if="getUIType(field.fieldName)===3">
             {{ transformTypeCode(copyInfo[field.fieldName], field.fieldName) }}
          </span>
          <span v-else>
            {{copyInfo[field.fieldName]}}
          </span>
        </div>

        <div class="field-input" v-show="mutableMode===EDITING_MODE">
          <span class="warning-text" :class="{'below-second-row': field.fieldName==='caseSymptom'}" v-show="warningResults[field.fieldName]">
            {{warningResults[field.fieldName]}}
          </span>
          <el-input v-if="getUIType(field.fieldName)===1" v-model="copyInfo[field.fieldName]"
            type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :class="{'warning': warningResults[field.fieldName]}"
            :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :maxlength="500">
          </el-input>
          <el-select v-else-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]"
            :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field).cnFieldDesc"
            @change="updateWarning(field)">
            <el-option v-for="option in getOptions(field.fieldName)" :label="option.typeName"
              :value="option.typeCode" :key="option.typeCode"></el-option>
          </el-select>
        </div>
      </div>

      <!-- <div class="form-wrapper">
        <h4 class="form-title">运动症状</h4>
        <div class="scroll-area" ref="scrollArea1">
          <table class="form-content">
            <tr class="row first-row">
              <td v-for="field in diagnosticDiseaseMsTemplate" class="col" :class="getClass(field.fieldName)">
                {{field.cnfieldName}}
                <span class="required-mark" v-show="field.must === 1">*</span>
                <span class="add-button iconfont icon-plus" @click="addSymtom(MS_SYMPTOM)"
                  v-show="field.fieldName === 'symptomTypeId' && mutableMode===EDITING_MODE">
                </span>
              </td>
            </tr>
            <tr class="row" v-for="(symptom, index) in msSymptom">
              <td v-for="field in diagnosticDiseaseMsTemplate" class="col" :class="getClass(field.fieldName)">
                <span v-if="mutableMode===READING_MODE">
                  {{getFieldValue(symptom, field.fieldName)}}
                </span>
                <span v-else-if="mutableMode===EDITING_MODE">
                  <span v-if="field.fieldName==='symptomTypeId'">
                    <span class="delete-button iconfont icon-remove" @click="deleteSymptom(symptom, index)"></span>
                    <el-select v-model="symptom[field.fieldName]" :class="{'warning': !isSymptomValid(symptom)}"
                      :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                      <el-option v-for="option in getOptions(field.fieldName, 'ms')"
                        :label="option.name" :value="option.code" :key="option.code"></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===1">
                    <el-input v-model="symptom[field.fieldName]" :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :maxlength="500"></el-input>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===3">
                    <el-select v-model="symptom[field.fieldName]"
                      :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                      <el-option label="是" :value="'是'"></el-option>
                      <el-option label="否" :value="'否'"></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===6">
                    <el-date-picker v-model="symptom[field.fieldName]" type="date"
                      format="yyyy-MM-dd" :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                    </el-date-picker>
                  </span>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div> -->

      <!-- <div class="form-wrapper">
        <h4 class="form-title">运动并发症</h4>
        <div class="scroll-area" ref="scrollArea2">
          <table class="form-content">
            <tr class="row first-row">
              <td v-for="field in diagnosticDiseaseMcTemplate" class="col" :class="getClass(field.fieldName)">
                {{field.cnfieldName}}
                <span class="required-mark" v-show="field.must === 1">*</span>
                <span class="add-button iconfont icon-plus" @click="addSymtom(MC_SYMPTOM)"
                  v-show="field.fieldName === 'symptomTypeId' && mutableMode===EDITING_MODE">
                </span>
              </td>
            </tr>
            <tr class="row" v-for="(symptom, index) in mcSymptom">
              <td v-for="field in diagnosticDiseaseMcTemplate" class="col" :class="getClass(field.fieldName)">
                <span v-if="mutableMode===READING_MODE">
                  {{getFieldValue(symptom, field.fieldName)}}
                </span>
                <span v-else-if="mutableMode===EDITING_MODE">
                  <span v-if="field.fieldName==='symptomTypeId'">
                    <span class="delete-button iconfont icon-remove" @click="deleteSymptom(symptom, index)"></span>
                    <el-select v-model="symptom[field.fieldName]" :class="{'warning': !isSymptomValid(symptom)}"
                      :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                      <el-option v-for="option in getOptions(field.fieldName, 'mc')"
                        :label="option.name" :value="option.code" :key="option.code"></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===1">
                    <el-input v-model="symptom[field.fieldName]" :placeholder="getMatchedField(field.fieldName).cnFieldDesc"
                      :maxlength="500"></el-input>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===3">
                    <el-select v-model="symptom[field.fieldName]"
                      :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                      <el-option label="是" :value="'是'"></el-option>
                      <el-option label="否" :value="'否'"></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===6">
                    <el-date-picker v-model="symptom[field.fieldName]" type="date"
                      format="yyyy-MM-dd" :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                    </el-date-picker>
                  </span>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div> -->

      <!-- <div class="form-wrapper">
        <h4 class="form-title">非运动症状</h4>
        <div class="scroll-area" ref="scrollArea3">
          <table class="form-content">
            <tr class="row first-row">
              <td v-for="field in diagnosticDiseaseNmsTemplate" class="col" :class="getClass(field.fieldName)">
                {{field.cnfieldName}}
                <span class="required-mark" v-show="field.must === 1">*</span>
                <span class="add-button iconfont icon-plus" @click="addSymtom(NMS_SYMPTOM)"
                  v-show="field.fieldName === 'symptomTypeId' && mutableMode===EDITING_MODE">
                </span>
              </td>
            </tr>
            <tr class="row" v-for="(symptom, index) in nmsSymptom">
              <td v-for="field in diagnosticDiseaseNmsTemplate" class="col" :class="getClass(field.fieldName)">
                <span v-if="mutableMode===READING_MODE">
                  {{getFieldValue(symptom, field.fieldName)}}
                </span>
                <span v-else-if="mutableMode===EDITING_MODE">
                  <span v-if="field.fieldName==='symptomTypeId'">
                    <span class="delete-button iconfont icon-remove" @click="deleteSymptom(symptom, index)"></span>
                    <el-select v-model="symptom[field.fieldName]" :class="{'warning': !isSymptomValid(symptom)}"
                      :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                      <el-option v-for="option in getOptions(field.fieldName, 'nms')"
                        :label="option.name" :value="option.code" :key="option.code"></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===1">
                    <el-input v-model="symptom[field.fieldName]" :placeholder="getMatchedField(field.fieldName).cnFieldDesc" :maxlength="500"></el-input>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===3">
                    <el-select v-model="symptom[field.fieldName]" :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                      <el-option label="是" :value="'是'"></el-option>
                      <el-option label="否" :value="'否'"></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="getUIType(field.fieldName)===6">
                    <el-date-picker v-model="symptom[field.fieldName]" type="date"
                      format="yyyy-MM-dd" :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                    </el-date-picker>
                  </span>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div> -->
       <extensible-panel class="panel disease-panel" :mode="mutableMode" :title="subTitle" v-on:addNewCard="addFirstSymptomsRecord"
        :editable="canEdit">
        <card class="card symptoms-card" :class="devideWidth" :mode="mutableMode" v-for="item in diagnosticDisease.patientSymptom" :key="item.diseaseId"
          :title="item.symType" :disable-delete="item.statusFlag===0" v-on:editCurrentCard="editFirstSymptomsRecord(item)"
          v-on:deleteCurrentCard="deleteDisease(item)" v-on:viewCurrentCard="viewFirstSymptomsRecord(item)">
          <div class="text first-line">
            <span class="name">症状名称：</span>
            <span class="value">{{item.symName}}</span>
          </div>
          <div class="text second-line">
            <span class="name">是否规律出现：</span>
            <span class="value">{{item.whetherLaw ? item.whetherLaw : '未填写'}}</span>
          </div>
          <div class="text third-line">
            <span class="name">{{item.ariseTime ? '出现时间：' : '...'}}</span>
            <span class="value">{{item.ariseTime}}</span>
          </div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
// import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import { delPatientSymptom } from 'api/patient.js';

// import { reviseDateFormat } from 'utils/helper.js';

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      foldedStatus: true,
      copyInfo: {},
      warningResults: {},
      title: '主诉症状',
      devideWidth: ''
      // MS_SYMPTOM: '运动症状',
      // MC_SYMPTOM: '运动并发症',
      // NMS_SYMPTOM: '非运动症状'
    };
  },
  computed: {
    ...mapGetters([
      'diagnosticDiseaseDictionary',
      // 'diagnosticDiseaseMsDictionary',
      // 'diagnosticDiseaseMcDictionary',
      // 'diagnosticDiseaseNmsDictionary',
      'diagnosticDiseaseTemplate',
      // 'diagnosticDiseaseMsTemplate',
      // 'diagnosticDiseaseMcTemplate',
      // 'diagnosticDiseaseNmsTemplate',
      // 'symptomType',
      'typeGroup'
    ]),
    subTitle() {
      var count = this.diagnosticDisease.patientSymptom.length;
      return this.title + '（' + count + '条记录）';
    },
    // totalDictionary() {
    //   return [].concat(this.diagnosticDiseaseDictionary, this.diagnosticDiseaseMsDictionary,
    //   this.diagnosticDiseaseMcDictionary, this.diagnosticDiseaseNmsDictionary);
    // },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && !this.archived) {
        return true;
      } else {
        return false;
      }
    }
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    diagnosticDisease: {
      type: Object,
      default: {}
    },
    archived: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
      // this.foldedStatus = false;
      // Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
    },
    cancel() {
      // this.copyInfo = {};
      // vueCopy(this.diagnosticDisease, this.copyInfo);
      // this.warningResults = {};
      this.mutableMode = this.READING_MODE;
      // Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.diagnosticDiseaseDictionary);
    },
    getTypes(fieldName) {
      // 在 typegroup 里面查找到 fieldName 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(fieldName);
      var value = dictionaryField.fieldEnumId;
      value = fieldName; // TODO 等以后字典项返回 OK 了，就去掉这一行
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    transform(item, fieldName) {
      var types = this.getTypes(fieldName);
      var diseaseType = Util.getElement('typeCode', item[fieldName], types);
      return diseaseType.typeName ? diseaseType.typeName : '';
    },
    getDisease(diseaseId) {
      // 根据药物 id，在相应的 tableData 里面寻找对应的 药物详情
      return Util.getElement('diseaseId', diseaseId, this.diseaseInfo);
    },
    getTitle(diseaseId) {
      var disease = this.getDisease(diseaseId);
      return disease.diseaseName + '(' + disease.commonName + ')';
    },
    submit() {
      this.mutableMode = this.READING_MODE;
      // 把 this.copyInfo.patientSymptom 下的日期对象转换为符合传输格式的字符串
      // reviseDateFormat(this.copyInfo);
    },
    // updateAndClose() {
    //   Bus.$emit(this.UPDATE_CASE_INFO);
    //   Bus.$emit(this.SCROLL_AREA_SIZE_CHANGE);
    //   this.mutableMode = this.READING_MODE;
    // },
    updateScrollbar() {
      this.$nextTick(() => {
        // Ps.destroy(this.$refs.scrollArea1);
        // Ps.destroy(this.$refs.scrollArea2);
        // Ps.destroy(this.$refs.scrollArea3);
        // Ps.initialize(this.$refs.scrollArea1, {
        //   wheelSpeed: 1,
        //   minScrollbarLength: 40
        // });
        // Ps.initialize(this.$refs.scrollArea2, {
        //   wheelSpeed: 1,
        //   minScrollbarLength: 40
        // });
        // Ps.initialize(this.$refs.scrollArea3, {
        //   wheelSpeed: 1,
        //   minScrollbarLength: 40
        // });
      });
    },
    addFirstSymptomsRecord() {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.ADD_NEW_CARD, {}, '主诉症状');
    },
    viewFirstSymptomsRecord(item) {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.VIEW_CURRENT_CARD, item, '主诉症状');
    },
    editFirstSymptomsRecord(item) {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.EDIT_CURRENT_CARD, item, '主诉症状');
    },
    deleteDisease(item) {
      var patientDisease = {
        // patientId: parseInt(this.$route.params.id, 10),
        // patientCaseId: this.$route.params.caseId,
        // patientDiseaseId: item.patientDiseaseId
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        delPatientSymptom(patientDisease).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getOptions(fieldName, type) {
      // 第二个参数代表主诉的类型（'ms', 'mc', 'nms' 分别代表运动症状，运动并发症，非运动症状），
      // 第二个参数只有在主诉字段内才是必须的
      if (fieldName === 'symptomTypeId') {
        var options = [];
        const typeDict = {
          'ms': 0,
          'mc': 1,
          'nms': 2
        };
        for (let symptomTypeItem of this.symptomType) {
          if (symptomTypeItem.symptomtype === typeDict[type]) {
            options.push({
              name: symptomTypeItem.sympName,
              code: symptomTypeItem.id
            });
          }
        }
        return options;

      } else {
        var dictionaryField = Util.getElement('fieldName', fieldName, this.diagnosticDiseaseDictionary);
        var fieldEnumId = dictionaryField.fieldEnumId;
        var types = Util.getElement('typegroupcode', fieldEnumId, this.typeGroup).types;
        types = types ? types : [];
        return types;
      }

    },
    transformTypeCode(typeCode, fieldName) {
      return Util.getElement('typeCode', typeCode, this.getOptions(fieldName)).typeName;
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      if (field.must === 1 && !this.copyInfo[fieldName]) {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, null);
      }
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticDisease.clientWidth;
        var devideNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度
        while (panelWidth / devideNum > 200 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.devideWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    }
  },
  mounted() {
    Bus.$on(this.QUIT_DIAGNOSTIC_DETAIL, this.cancel);
    Bus.$on(this.EDIT_DIAGNOSTIC_DISEASE, this.startEditing);
    this.recalculateCardWidth();

    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE);
    Bus.$off(this.TOGGLE_LIST_DISPLAY);
    Bus.$off(this.QUIT_DIAGNOSTIC_DETAIL);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  watch: {
    $route() {
      this.updateScrollbar();
    },
    diagnosticDisease: function() {
      // 每次传过来的数据发生变化，就重新初始化 copyInfo
      this.copyInfo = {};
      vueCopy(this.diagnosticDisease, this.copyInfo);

      // 传过来的数据可能会没有某些字段属性，我们接下来将通过 template 来补齐
      // this.supplementCopyInfo();
    }
    // templateLength: function() {
    //  // 如果 template 数据还没到位，那么补齐就会没有效果，所以在获取到 template 后，也要做一次补齐操作
    //   this.supplementCopyInfo();
    // }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@field-line-height: 25px;
@scroll-bar-height: 10px;

@col-name-width: 200px;
@col-time-width: 170px;
@col-select-width: 150px;
@col-remarks-width: 250px;
@row-height: 45px;

@disease-card-height: 130px;

.diagnostic-disease {
  // padding: 0 25px;
  text-align: left;
  .field {
    display: inline-block;
    position: relative;
    width: 50%;
    min-height: @field-height;
    text-align: left;
    vertical-align: top;
    &.whole-line {
      width: 100%;
      .field-input {
        right: 2%;
      }
    }
    .field-name {
      padding: 0 25px;
      display: inline-block;
      position: absolute;
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
    .field-value {
      display: inline-block;
      position: relative;
      left: @field-name-width;
      width: calc(~"96% - @{field-name-width}");
      line-height: @field-line-height;
      font-size: @normal-font-size;
      color: @light-font-color;
    }
    .field-input {
      display: inline-block;
      position: relative;
      top: 0;
      left: @field-name-width;
      width: calc(~"96% - @{field-name-width}");
      line-height: @field-height;
      overflow: visible;
      .warning-text {
        position: absolute;
        top: 10px;
        left: 10px;
        height: 15px;
        color: red;
        font-size: @small-font-size;
        &.below-second-row {
          top: 40px;
        }
      }
      .el-input {
        transform: translateY(-13px);
        .el-input__inner {
          height: 30px;
          border: none;
          background-color: @screen-color;
        }
      }
      .el-textarea {
        vertical-align: middle;
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
  >.extensible-panel-wrapper.disease-panel{
    >.content{
      height:@disease-card-height + @card-vertical-margin * 2 + 5px * 2;
    }
  }
  .card {
      position: relative;
      display: inline-block;
      margin: @card-vertical-margin @card-horizontal-margin;
      &.symptoms-card{
        height: @disease-card-height;
      }
      &.width-1-1, &.width-1-0 {
        width: calc(~"100% - @{card-horizontal-margin} * 2");
      }
      &.width-1-2 {
        width: calc(~"50% - @{card-horizontal-margin} * 2");
      }
      &.width-1-3 {
        width: calc(~"33.3333% - @{card-horizontal-margin} * 2");
      }
      &.width-1-4 {
        width: calc(~"25% - @{card-horizontal-margin} * 2");
      }
      &.width-1-5 {
        width: calc(~"20% - @{card-horizontal-margin} * 2");
      }
      &.width-1-6 {
        width: calc(~"16.6666% - @{card-horizontal-margin} * 2");
      }
      &.width-1-7 {
        width: calc(~"14.2857% - @{card-horizontal-margin} * 2");
      }
      &.width-1-8 {
        width: calc(~"12.5% - @{card-horizontal-margin} * 2");
      }
      &.width-1-9 {
        width: calc(~"11.1111% - @{card-horizontal-margin} * 2");
      }
      &.width-1-10 {
        width: calc(~"10% - @{card-horizontal-margin} * 2");
      }
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
      }
      .first-line {
        left: 10px;
        top: 50px;
      }
      .second-line {
        left: 10px;
        top: 75px;
      }
      .third-line {
        left: 10px;
        top: 100px;
      }
  }
}

</style>
