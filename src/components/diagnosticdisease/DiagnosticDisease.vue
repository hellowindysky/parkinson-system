<template lang="html">
  <folding-panel :title="'病症情况'" :mode="mutableMode"  v-on:edit="startEditing"
    v-on:cancel="cancel" v-on:submit="submit" v-on:toggleFoldedPanel="updateScrollbar">
    <div class="diagnostic-disease">
      <div v-for="field in diagnosticDiseaseTemplate" class="field"
        :class="{'whole-line': field.fieldName === 'caseSymptom', 'multi-line': field.fieldName === 'caseSymptom'}">
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
            :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)">
          </el-input>
          <el-select v-else-if="getUIType(field.fieldName)===3" v-model="copyInfo[field.fieldName]"
            :class="{'warning': warningResults[field.fieldName]}" :placeholder="getMatchedField(field).cnFieldDesc"
            @change="updateWarning(field)">
            <el-option v-for="option in getOptions(field.fieldName)" :label="option.typeName"
              :value="option.typeCode" :key="option.typeCode"></el-option>
          </el-select>
        </div>
      </div>

      <div class="form-wrapper">
        <h4 class="form-title">运动症状</h4>
        <div class="scroll-area" ref="scrollArea1">
          <table class="form-content">
            <tr class="row first-row">
              <td v-for="field in diagnosticDiseaseMsTemplate" class="col" :class="getClass(field.fieldName)">
                {{field.cnfieldName}}
                <!-- <span class="required-mark" v-show="field.must === 1">*</span> -->
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
                    <el-input v-model="symptom[field.fieldName]" :placeholder="getMatchedField(field.fieldName).cnFieldDesc"></el-input>
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
      </div>

      <div class="form-wrapper">
        <h4 class="form-title">运动并发症</h4>
        <div class="scroll-area" ref="scrollArea2">
          <table class="form-content">
            <tr class="row first-row">
              <td v-for="field in diagnosticDiseaseMcTemplate" class="col" :class="getClass(field.fieldName)">
                {{field.cnfieldName}}
                <!-- <span class="required-mark" v-show="field.must === 1">*</span> -->
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
                    <el-input v-model="symptom[field.fieldName]"
                     :placeholder="getMatchedField(field.fieldName).cnFieldDesc"></el-input>
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
      </div>

      <div class="form-wrapper">
        <h4 class="form-title">非运动症状</h4>
        <div class="scroll-area" ref="scrollArea3">
          <table class="form-content">
            <tr class="row first-row">
              <td v-for="field in diagnosticDiseaseNmsTemplate" class="col" :class="getClass(field.fieldName)">
                {{field.cnfieldName}}
                <!-- <span class="required-mark" v-show="field.must === 1">*</span> -->
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
                    <el-input v-model="symptom[field.fieldName]" :placeholder="getMatchedField(field.fieldName).cnFieldDesc"></el-input>
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
      </div>
    </div>
  </folding-panel>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import { modifyDiagnosticDisease } from 'api/patient.js';
import { reviseDateFormat } from 'utils/helper.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';

export default {
  data() {
    return {
      mutableMode: this.mode,
      copyInfo: {},
      warningResults: {},
      MS_SYMPTOM: '运动症状',
      MC_SYMPTOM: '运动并发症',
      NMS_SYMPTOM: '非运动症状'
    };
  },
  computed: {
    ...mapGetters([
      'diagnosticDiseaseDictionary',
      'diagnosticDiseaseMsDictionary',
      'diagnosticDiseaseMcDictionary',
      'diagnosticDiseaseNmsDictionary',
      'diagnosticDiseaseTemplate',
      'diagnosticDiseaseMsTemplate',
      'diagnosticDiseaseMcTemplate',
      'diagnosticDiseaseNmsTemplate',
      'symptomType',
      'typeGroup'
    ]),
    totalDictionary() {
      return [].concat(this.diagnosticDiseaseDictionary, this.diagnosticDiseaseMsDictionary,
      this.diagnosticDiseaseMcDictionary, this.diagnosticDiseaseNmsDictionary);
    },
    allSymptom() {
      if (!this.copyInfo.patientSymptom) {
        this.$set(this.copyInfo, 'patientSymptom', []);
      }
      return this.copyInfo.patientSymptom;
    },
    msSymptom() {
      // 运动症状
      var msSymptom = [];
      for (let symptom of this.allSymptom) {
        if (symptom.symType === this.MS_SYMPTOM) {
          msSymptom.push(symptom);
        }
      }
      return msSymptom;
    },
    mcSymptom() {
      // 运动并发症
      var mcSymptom = [];
      for (let symptom of this.allSymptom) {
        if (symptom.symType === this.MC_SYMPTOM) {
          mcSymptom.push(symptom);
        }
      }
      return mcSymptom;
    },
    nmsSymptom() {
      // 非运动症状
      var nmsSymptom = [];
      for (let symptom of this.allSymptom) {
        if (symptom.symType === this.NMS_SYMPTOM) {
          nmsSymptom.push(symptom);
        }
      }
      return nmsSymptom;
    },
    templateLength() {
      // 这个计算属性的返回值本身并没有价值，我设定它，只是为了在 watch 中监控 几个 Vuex 对象（因为不能直接监控它们）
      var t1 = this.diagnosticDiseaseMsTemplate ? this.diagnosticDiseaseMsTemplate : [];
      var t2 = this.diagnosticDiseaseMcTemplate ? this.diagnosticDiseaseMcTemplate : [];
      var t3 = this.diagnosticDiseaseNmsTemplate ? this.diagnosticDiseaseNmsTemplate : [];
      return [t1.length, t2.length, t3.length];  // 这个值并没有意义
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
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.copyInfo = {};
      vueCopy(this.diagnosticDisease, this.copyInfo);
      this.warningResults = {};
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      // 先手动执行一遍 updateWarning()，因为有的字段在初始化的时候并没有经过校验
      for (let field of this.diagnosticDiseaseTemplate) {
        this.updateWarning(field);
      }

      // 然后检查 warningResults
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p)) {
          if (this.warningResults[p]) {
            return;
          }
        }
      }

      // 症状列表并没有用 warningResults 来校验，所以这里手动校验每一行的名字 —— 既不为空，又没有重复
      for (let symptom of this.allSymptom) {
        if (!this.isSymptomValid(symptom)) {
          return;
        }
      }

      // 把 this.copyInfo.patientSymptom 下的日期对象转换为符合传输格式的字符串
      reviseDateFormat(this.copyInfo);

      // 到这里，就可以准备提交数据了
      this.copyInfo.patientId = this.$route.params.id;
      this.copyInfo.patientCaseId = this.$route.params.caseId;

      // console.log(this.copyInfo);
      // 临时将 submit 事件的回调函数卸掉，等数据传输完毕后再加回来。这样可以避免用户在短时间内多次发出重复的提交请求
      this.$off(this.SUBMIT, this.submit);
      modifyDiagnosticDisease(this.copyInfo).then(() => {
        this.updateAndClose();
        this.$on(this.SUBMIT, this.submit);
      });
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.mutableMode = this.READING_MODE;
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea1);
        Ps.destroy(this.$refs.scrollArea2);
        Ps.destroy(this.$refs.scrollArea3);
        Ps.initialize(this.$refs.scrollArea1, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
        Ps.initialize(this.$refs.scrollArea2, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
        Ps.initialize(this.$refs.scrollArea3, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    supplementCopyInfo() {
      // this.copyInfo.patientSymptom 这个数组下的对象，有可能没有足够的属性，
      // 这个时候我们需要根据相应的 template，给这些属性值补上，赋值为空字符串
      if (!this.copyInfo.patientSymptom) {
        return;   // 如果该对象不存在，就直接返回
      }
      for (let symptom of this.copyInfo.patientSymptom) {
        if (symptom.symType === this.MS_SYMPTOM) {
          for (let field of this.diagnosticDiseaseMsTemplate) {
            if (!symptom[field.fieldName]) {
              this.$set(symptom, field.fieldName, '');
            }
          }
        } else if (symptom.symType === this.MC_SYMPTOM) {
          for (let field of this.diagnosticDiseaseMcTemplate) {
            if (!symptom[field.fieldName]) {
              this.$set(symptom, field.fieldName, '');
            }
          }
        } else if (symptom.symType === this.NMS_SYMPTOM) {
          for (let field of this.diagnosticDiseaseNmsTemplate) {
            if (!symptom[field.fieldName]) {
              this.$set(symptom, field.fieldName, '');
            }
          }
        }
      }
    },
    getClass(fieldName) {
      if (['symptomTypeId'].indexOf(fieldName) > -1) {
        return 'col-name';
      } else if (['ariseTime', 'ariseTimeLeftUp', 'ariseTimeRightUp', 'ariseTimeLeftDown', 'ariseTimeRightDown'].indexOf(fieldName) > -1) {
        return 'col-time';
      } else if (['whetherLaw'].indexOf(fieldName) > -1) {
        return 'col-select';
      } else if (['remarks'].indexOf(fieldName) > -1) {
        return 'col-remarks';
      }
    },
    getFieldValue(symptom, fieldName) {
      if (fieldName === 'symptomTypeId') {
        var symptomType = symptom[fieldName];
        var symptomTypeItem = Util.getElement('id', symptomType, this.symptomType);
        return symptomTypeItem.sympName;
      } else {
        return symptom[fieldName];
      }
    },
    deleteSymptom(targetSymptom, indexOfItsType) {
      // 删除 this.copyInfo.patientSymptom 中的 item 对象
      var subIndex = 0;
      for (var i = 0; i < this.copyInfo.patientSymptom.length; i++) {
        if (this.copyInfo.patientSymptom[i].symType === targetSymptom.symType) {
          if (subIndex === indexOfItsType) {
            this.copyInfo.patientSymptom.splice(i, 1);
            return;
          }
          subIndex += 1;
        }
      }
    },
    addSymtom(type) {
      // 在 this.copyInfo.patientSymptom 中添加对象，传入的参数代表症状类型
      var newSymptom = {};
      var template = [];
      switch (type) {
        case this.MS_SYMPTOM:
          template = this.diagnosticDiseaseMsTemplate;
          newSymptom.symType = this.MS_SYMPTOM;
          break;
        case this.MC_SYMPTOM:
          template = this.diagnosticDiseaseMcTemplate;
          newSymptom.symType = this.MC_SYMPTOM;
          break;
        case this.NMS_SYMPTOM:
          template = this.diagnosticDiseaseNmsTemplate;
          newSymptom.symType = this.NMS_SYMPTOM;
          break;
        default:
          return;
      }

      // 然后为这条症状记录补上相应的属性值，因为它们无需被 Vue 做数据绑定，所以直接定义属性即可
      newSymptom.patientId = parseInt(this.$route.params.id, 10);
      newSymptom.patientCaseId = this.$route.params.caseId;

      for (let field of template) {
        this.$set(newSymptom, field.fieldName, '');
      }

      var index = 0;
      if (this.copyInfo.patientSymptom && this.copyInfo.patientSymptom instanceof Array) {
        index = this.copyInfo.patientSymptom.length;
        this.$set(this.copyInfo.patientSymptom, index, newSymptom);
      }
    },
    isSymptomValid(symptom) {
      // 检查一个症状的名字(实际上是检查其 ID)，第一个是不能为空，第二个是不能和现有列表中的重复
      var symptomTypeId = symptom.symptomTypeId;
      if (symptomTypeId === undefined || symptomTypeId === null || symptomTypeId === '') {
        return false;
      }

      var count = 0;
      for (let existedSymptom of this.allSymptom) {
        if (existedSymptom.symptomTypeId === symptomTypeId) {
          count += 1;
          if (count > 1) {
            return false;
          }
        }
      }
      return true;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.totalDictionary);
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
        var dictionaryField = Util.getElement('fieldName', fieldName, this.totalDictionary);
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
    }
  },
  mounted() {
    this.updateScrollbar();

    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.updateScrollbar);
    Bus.$on(this.QUIT_DIAGNOSTIC_DETAIL, this.cancel);

    setTimeout(() => {
      // console.log(this.copyInfo);
      // console.log(this.diagnosticDisease);
      // console.log(this.diagnosticDiseaseTemplate);
      // console.log(this.diagnosticDiseaseDictionary);
      // console.log(this.diagnosticDiseaseMsTemplate);
      // console.log(this.diagnosticDiseaseMcTemplate);
      // console.log(this.diagnosticDiseaseNmsTemplate);
      // console.log(this.diagnosticDiseaseMsDictionary);
      // console.log(this.diagnosticDiseaseMcDictionary);
      // console.log(this.diagnosticDiseaseNmsDictionary);
      // console.log(this.symptomType);
      // console.log(this.totalDictionary);
    }, 3000);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE);
    Bus.$off(this.TOGGLE_LIST_DISPLAY);
    Bus.$off(this.QUIT_DIAGNOSTIC_DETAIL);
  },
  components: {
    FoldingPanel
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
      this.supplementCopyInfo();
    },
    templateLength: function() {
      // 如果 template 数据还没到位，那么补齐就会没有效果，所以在获取到 template 后，也要做一次补齐操作
      this.supplementCopyInfo();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@scroll-bar-height: 10px;

@col-name-width: 200px;
@col-time-width: 170px;
@col-select-width: 150px;
@col-remarks-width: 250px;
@row-height: 45px;

.diagnostic-disease {
  padding: 0 25px;
  text-align: left;
  .field {
    display: inline-block;
    position: relative;
    width: 50%;
    height: @field-height;
    text-align: left;
    &.whole-line {
      width: 100%;
      .field-input {
        right: 2%;
      }
    }
    &.multi-line {
      height: @field-height * 1.5;
    }
    .field-name {
      display: inline-block;
      width: @field-name-width;
      line-height: @field-height;
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
      line-height: @field-height;
      font-size: @normal-font-size;
      color: @light-font-color;
    }
    .field-input {
      display: inline-block;
      position: absolute;
      top: 0;
      left: @field-name-width;
      right: 4%;
      line-height: @field-height;
      overflow: visible;
      .warning-text {
        position: absolute;
        top: 25px;
        left: 10px;
        height: 15px;
        color: red;
        font-size: @small-font-size;
        &.below-second-row {
          top: 47px;
        }
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
        transform: translateY(10px);
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
  .form-wrapper {
    .form-title {
      margin: 10px 0 15px;
      padding: 0;
      text-align: left;
      font-size: @normal-font-size;
    }
    .scroll-area {
      position: relative;
      width: 100%;
      padding-bottom: 10px;
      overflow: hidden;
      .form-content {
        border: 1px solid @light-gray-color;
        border-spacing: 0;
        table-layout: fixed;
        .row {
          height: @row-height;
          &.first-row {
            background-color: @screen-color;
            height: 30px;
            line-height: 30px;
            .add-button {
              position: absolute;
              left: 5px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                opacity: 0.9;
              }
            }
          }
          .col {
            position: relative;
            font-size: @normal-font-size;
            text-align: center;
            &.col-name {
              min-width: @col-name-width;
              .el-input {
                margin-left: 20px;
                width: @col-name-width - 30px;
              }
            }
            &.col-time {
              min-width: @col-time-width;
            }
            &.col-select {
              min-width: @col-select-width;
            }
            &.col-remarks {
              min-width: @col-remarks-width;
            }
            .required-mark {
              color: red;
              font-size: 20px;
              vertical-align: middle;
            }
            .delete-button {
              position: absolute;
              left: 5px;
              top: 13px;
              color: @alert-color;
              cursor: pointer;
              z-index: 10;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                opacity: 0.9;
              }
            }
            .el-input {
              margin-left: 2%;
              width: 90%;
              .el-input__inner {
                height: 30px;
                border: none;
                background-color: @screen-color;
              }
            }
            .warning .el-input__inner {
              border: 1px solid red;
            }
          }
        }
      }
      .ps__scrollbar-x-rail {
        position: absolute;
        height: @scroll-bar-height;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
        opacity: 0.3;
        transition: opacity 0.3s;
        .ps__scrollbar-x {
          position: relative;
          height: @scroll-bar-height;
          background-color: #aaa;
          border-radius: 20px;
        }
      }
      &:hover {
        .ps__scrollbar-x-rail {
          opacity: 0.6;
        }
      }
    }
  }
}

</style>
