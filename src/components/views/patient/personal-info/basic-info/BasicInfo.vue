<template lang="html">
  <folding-panel :title="'基础信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit"
    :folded-status="foldedStatus" :editable="canEdit">
    <div class="basic-info">
      <div class="group" v-for="group in basicInfoTemplateGroups">
        <div class="field" v-for="field in group" :class="checkIfWholeLine(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="getUIType(field)===3 && field.fieldName!=='homeProvince'">
              {{ transformTypeCode(copyInfo[field.fieldName], field) }}
            </span>
            <span v-else>
              {{ copyInfo[field.fieldName] }}
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span class="warning-text">{{getWarningText(field.fieldName)}}</span>

            <span v-if="checkIfBlocking(field.fieldName)" class="desensitized-value">
              {{ copyInfo[field.fieldName] }}
            </span>

            <span v-else-if="getUIType(field)===1">
              <el-autocomplete v-if="field.fieldName==='nation'" v-model="copyInfo[field.fieldName]"
                :fetch-suggestions="querySearchAsync"
                @select="handleSelect"
                :placeholder="getMatchedField(field).cnFieldDesc">
              </el-autocomplete>
              <el-autocomplete v-else-if="field.fieldName==='nationality'" v-model="copyInfo[field.fieldName]"
                :fetch-suggestions="querySearchAsync2"
                @select="handleSelect"
                :placeholder="getMatchedField(field).cnFieldDesc">
              </el-autocomplete>
              <el-input v-else v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}" :disabled="field.fieldName==='bmi'"
                :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :maxlength="50" @input="inputing(field)"></el-input>
            </span>
            <span v-else-if="getUIType(field)===3">
              <el-select v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
                :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :clearable="true">
                <el-option v-for="(type, index) in getTypes(field)" :key="type.typeName + type.typeCode + '-' + index"
                 :label="type.typeName"
                 :value="type.typeCode">
                </el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field)===6">
              <el-date-picker
                v-model="copyInfo[field.fieldName]"
                type="date"
                :class="{'warning': warningResults[field.fieldName]}"
                :placeholder="getMatchedField(field).cnFieldDesc"
                @change="updateWarning(field)"
                :picker-options="pickerOptions">
              </el-date-picker>
            </span>
          </div>
        </div>
      </div>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import { modifyPatientInfo, addPatientInfo } from 'api/patient.js';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { reviseDateFormat, pruneObj, deepCopy } from 'utils/helper.js';

import FoldingPanel from 'public/folding-panel/FoldingPanel';

const WHOLE_LINE_FIELD_LIST = ['homeAddress'];
const CONVERT_TO_DECIMAL_LIST = ['height', 'weight'];

export default {
  props: {
    basicInfo: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      completeInit: false,
      mode: this.READING_MODE,
      foldedStatus: false,
      copyInfo: {},
      warningResults: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      completeEditingForTheFirstTime: false,  // 用来控制某些字段是否需要校验
      lockSubmitButton: false,
      allNation: [], // 所有民族
      allNationality: [] // 所有国籍
    };
  },
  computed: {
    ...mapGetters([
      'basicInfoDictionaryGroups',
      'basicInfoTemplateGroups',
      'typeGroup'
    ]),
    basicInfoDictionary() {
      // 对 basicInfoDictionaryGroups 进行扁平化处理，方便之后操作
      var flattenedGroup = [];
      for (let group of this.basicInfoDictionaryGroups) {
        flattenedGroup = flattenedGroup.concat(group);
      }
      return flattenedGroup;
    },
    listType() {
      return this.$store.state.listType;
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    startEditing() {
      this.shallowCopy(this.basicInfo);
      this.mode = this.EDITING_MODE;
      this.completeEditingForTheFirstTime = false;
      this.clearWarning();
    },
    checkIfBlocking(fieldName) {
      // 1.脱敏字段；2.在脱敏状态下；3.非新增病患 ———— 这个函数用来返回是否同时满足前面 3 个条件
      let blockingFieldList = ['name', 'cardId', 'phone', 'phone2', 'homeAddress'];
      if (!this.$store.state.showSensitiveInfo && blockingFieldList.indexOf(fieldName) >= 0 &&
        this.$route.params.id !== 'newPatient') {
        return true;
      } else {
        return false;
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      // 如果是新增患者界面，点击取消按钮，则回到患者列表的第一个患者
      if (this.$route.params.id === 'newPatient') {
        Bus.$on(this.CONFIRM, () => {
          if (this.listType === this.MY_PATIENTS_TYPE) {
            this.$router.push({name: 'myPatients'});
          } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
            this.$router.push({name: 'otherPatients'});
          }
          Bus.$off(this.CONFIRM);
          Bus.$off(this.GIVE_UP);
          return;
        });
        Bus.$on(this.GIVE_UP, () => {
          Bus.$off(this.CONFIRM);
          Bus.$off(this.GIVE_UP);
          return;
        });
        Bus.$emit(this.REQUEST_CONFIRMATION, '提示', '确认取消吗？取消将放弃所有更改');

      } else {
        // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 basicInfo 的复制对象
        this.shallowCopy(this.basicInfo);
        this.mode = this.READING_MODE;
      }
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      this.completeEditingForTheFirstTime = true;

      // 首先检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
      for (let group of this.basicInfoTemplateGroups) {
        for (let field of group) {
          this.updateWarning(field);
        }
      }
      for (let group of this.basicInfoTemplateGroups) {
        for (let field of group) {
          if (this.warningResults[field.fieldName]) {
            this.lockSubmitButton = false;
            return;
          }
        }
      }

      // 在提交前，将 copyInfo 中的数据还原成适合服务器传输的格式，并将提交按钮锁定
      reviseDateFormat(this.copyInfo);
      var submitData = deepCopy(this.copyInfo);

      for (let group of this.basicInfoTemplateGroups) {
        for (let field of group) {
          var fieldName = field.fieldName;
          // 有几个字段的值在取过来的时候进行了特殊处理，这里在传回给服务器的时候要还原成一开始的格式
          if (CONVERT_TO_DECIMAL_LIST.indexOf(fieldName) > -1 && submitData[fieldName] !== '') {
            submitData[fieldName] = parseInt(submitData[fieldName] * 10, 10);
          }
        }
      }
      pruneObj(submitData);

      // 判断是新增患者还是修改已有患者
      if (this.$route.params.id === 'newPatient') {
        if (this.$store.state.subjectId !== this.SUBJECT_ID_FOR_HOSPITAL) {
          submitData.taskInfoId = this.$store.state.subjectId;
        }
        addPatientInfo(submitData).then((data) => {
          var newId = data.patientId;
          if (this.listType === this.MY_PATIENTS_TYPE) {
            this.$router.push({
              name: 'patientInfo',
              params: {id: newId}
            });

          } else if (this.listType === this.OTHER_PATIENTS_TYPE) {
            this.$router.push({
              name: 'otherPatientInfo',
              params: {id: newId}
            });

          } else if (this.listType === this.SUBJECT_PATIENTS_TYPE) {
            this.$router.push({
              name: 'subjectPatientInfo',
              params: {id: newId}
            });
          }
          Bus.$emit(this.UPDATE_PATIENTS_LIST);

          // 如果是新增患者，还要在确定之后，将个人信息的病症信息面板置为编辑状态，同时收起基础信息面板
          this.$nextTick(() => {
            Bus.$emit(this.FOLD_BASIC_INFO);
            Bus.$emit(this.EDIT_DISEASE_INFO);
            // Bus.$emit(this.EDIT_OTHER_INFO);
          });
          this.lockSubmitButton = false;

        }, (error) => {
          console.log(error);
          if (error.code === 31) {
            this.$message({
              message: '医院患者编码重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2006) {
            this.$message({
              message: '门诊病例号重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2007) {
            this.$message({
              message: '住院病例号重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2008) {
            this.$message({
              message: '身份证号重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2011) {
            // 姓名相同，而且联系电话存在重复
            this.$message({
              message: '该患者已存在，请检查姓名和联系电话',
              type: 'error',
              duration: 2000
            });
          }
          this.lockSubmitButton = false;
        });

      } else {
        // 一旦提交成功，basicInfo也会更新，这个时候再切换回阅读状态
        submitData.patientId = this.$route.params.id;
        modifyPatientInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_PATIENT_INFO);

          // 即使是编辑已有记录，也要更新患者列表（因为列表中存在年龄，性别等信息）
          Bus.$emit(this.UPDATE_PATIENTS_LIST);

          this.mode = this.READING_MODE;
          this.lockSubmitButton = false;
        }, (error) => {
          console.log(error);
          if (error.code === 31) {
            this.$message({
              message: '医院患者编码重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2006) {
            this.$message({
              message: '门诊病例号重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2007) {
            this.$message({
              message: '住院病例号重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2008) {
            this.$message({
              message: '身份证号重复',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 2011) {
            // 姓名相同，而且联系电话存在重复
            this.$message({
              message: '该患者已存在，请检查姓名和联系电话',
              type: 'error',
              duration: 2000
            });
          }
          this.lockSubmitButton = false;
        });
      }
    },
    shallowCopy(obj) {
      this.completeInit = false;
      // 进行浅复制之后，修改复制对象的属性，不会影响到原始对象
      // 下面这行有一个特殊作用，能让 Vue 动态检测已有对象的新添加的属性，参看 https://cn.vuejs.org/v2/guide/reactivity.html
      this.copyInfo = Object.assign({}, obj);
      if (this.copyInfo.homeCity) {
        this.copyInfo.homeCity = parseInt(this.copyInfo.homeCity, 10);
      }
      // 如果传过来的数据对象缺少某些属性，则根据 template 补上
      for (let group of this.basicInfoTemplateGroups) {
        for (let field of group) {
          if (this.copyInfo[field.fieldName] === undefined) {
            this.$set(this.copyInfo, field.fieldName, '');
          }
        }
      }

      this.handleSpecialField();
      this.$nextTick(() => {
        this.completeInit = true;
      });
    },
    handleSpecialField() {
      // basicInfo 有几个字段的值需要特殊处理一下
      // 身高和体重的数值，在传输的时候用的是 Int 整型，例如 178.8 cm 在传输的时候用的数值是 1788
      for (let fieldName of CONVERT_TO_DECIMAL_LIST) {
        if (this.copyInfo[fieldName]) {
          this.copyInfo[fieldName] = this.copyInfo[fieldName] / 10;
        }
      }
    },
    getMatchedField(field) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', field.fieldName, this.basicInfoDictionary);
    },
    checkIfWholeLine(field) {
      var dictionaryField = this.getMatchedField(field);
      // 判断该字段是否跨行
      // return WHOLE_LINE_FIELD_LIST.indexOf(dictionaryField.fieldName) > -1;
      let fieldClass = [];
      if (WHOLE_LINE_FIELD_LIST.indexOf(dictionaryField.fieldName) > -1) {
        fieldClass.push('whole-line');
      };
      if (field.fieldName === 'homeProvince') {
        fieldClass.push('field-Province');
      }
      if (field.fieldName === 'homeCity') {
        fieldClass.push('field-city');
      }
      return fieldClass.join(' ');
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field).uiType;
    },
    getTypes(field) {
      // 在 typegroup 里面查找到 field 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(field);
      var value = dictionaryField.fieldEnumId;
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      if (field.fieldName === 'homeCity') {
        typeInfo = Util.getElement('typegroupcode', 'homeProvince', this.typeGroup);
        let provinceCode = this.copyInfo.homeProvince;
        let types = typeInfo.types ? typeInfo.types : [];
        return Util.getElement('typeCode', provinceCode, types).childType;
      }
      return typeInfo.types ? typeInfo.types : [];
    },
    transformTypeCode(typeCode, field) {
      // 根据 typeCode 找到对应的 typeName
      var types = this.getTypes(field);
      var matchedType = Util.getElement('typeCode', parseInt(typeCode, 10), types);
      return matchedType.typeName ? matchedType.typeName : '';
    },
    inputing(field) {
      var fieldName = field.fieldName;
      var copyFieldValue = this.copyInfo[fieldName];
      if (copyFieldValue.length === 50) {
        this.$message({
          message: '不能超过50个字',
          type: 'warning',
          duration: 2000
        });
      }
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var copyFieldValue = this.copyInfo[fieldName];
      // 如果是身份证信息，先对其进行校验
      if (fieldName === 'cardId') {
        // 这里插入一段特殊逻辑，如果是修改病患信息（不是新增），而且处于脱敏显示状态下，
        // 那么由于服务器返回的加密字段是连续18个星号，这里就得让其通过校验
        if (this.$route.params.id !== 'newPatient' &&
          !this.$store.state.showSensitiveInfo &&
          /^[*]{18}$/.test(copyFieldValue)) {
          this.$set(this.warningResults, fieldName, null);
          return;
        }

        let result = Util.checkId(copyFieldValue).split(',');
        if (copyFieldValue === '' || copyFieldValue === undefined || result[0] === '港澳台身份证') {
          this.$set(this.warningResults, fieldName, null);
          return;
        } else if (result.length <= 1) {
          // 下面这句 if 是为了提升体验，在第一次输入且还没输完的时候，避免显示“非法身份证”的警告文字
          if (result[0] !== '非法身份证' || this.completeEditingForTheFirstTime) {
            this.$set(this.warningResults, fieldName, result[0]);
            return;
          }
        } else {
          // 这里插入一段逻辑,如果身份证信息变化，而且输入合法，则相应地更新出生日期和性别（应该还加上籍贯信息）
          this.$set(this.warningResults, fieldName, null);
          // var province = result[0];
          var birthday = result[1];
          var gender = result[2];
          // 只有在相应的字段没有初始值的时候才会去覆盖它们
          if (this.copyInfo.birthday === '') {
            this.copyInfo.birthday = birthday;
            // this.homeProvince = province;
          }
          if (this.copyInfo.sex === '') {
            this.copyInfo.sex = gender === '男' ? 0 : 1;
          }
        }
      } else if (fieldName === 'thighLength' || fieldName === 'calfLength') {
        if (copyFieldValue === '' || copyFieldValue === undefined) {
          this.$set(this.warningResults, fieldName, null);
        } else {
          if (Util.checkIfNotMoreThanNDecimalNums(copyFieldValue, 1)) {
            this.$set(this.warningResults, fieldName, null);
          } else {
            this.$set(this.warningResults, fieldName, '请输入数字，最多1位小数');
          }
        }
        return;
      } else if (fieldName === 'email') {
        let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (reg.test(copyFieldValue) || copyFieldValue === '' || copyFieldValue === undefined) {
          this.$set(this.warningResults, fieldName, null);
        } else {
          this.$set(this.warningResults, fieldName, '请输入正确的邮箱');
        };
        return;
      }

      if (this.getUIType(field) === 6) {
        // 日期控件(el-date-picker)给的是一个表示完整日期对象的字符串，我们需要格式化之后再校验
        copyFieldValue = Util.simplifyDate(copyFieldValue);
      }
      if (field.must === 1 && !copyFieldValue && copyFieldValue !== 0) {
        // must 为 1 代表必填，为 2 代表选填

        // !copyFieldValue 为真 代表 copyFieldValue 为 undefined, null, '', 0 这些值，
        // 但是 0 是有意义的值，所以要把 0 排除掉
        // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
        this.$set(this.warningResults, fieldName, '必填项');
        return;

      } else if (field.must === 2 && (copyFieldValue === '' || copyFieldValue === undefined)) {
        this.$set(this.warningResults, fieldName, null);
        return;
      } else if (copyFieldValue && copyFieldValue.toString().indexOf(' ') > -1) {
        this.$set(this.warningResults, fieldName, '不能包含空格');
        return;

      } else if (copyFieldValue !== '' && ['height', 'weight'].indexOf(fieldName) >= 0) {
        if (copyFieldValue === 0 || copyFieldValue === '0') {
          this.$set(this.warningResults, fieldName, '身高和体重必须大于0');
          return;
        } else if (!Util.checkIfNotMoreThanNDecimalNums(copyFieldValue, 1)) {
          this.$set(this.warningResults, fieldName, '必须为数字，且不超过1位小数');
          return;
        }

      } else if (copyFieldValue !== '' && ['phone', 'phone2'].indexOf(fieldName) >= 0) {
        if (this.$route.params.id !== 'newPatient' &&
          !this.$store.state.showSensitiveInfo &&
          /^[*]{11}$/.test(copyFieldValue)) {
          this.$set(this.warningResults, fieldName, null);
          return;

        } else if (!Util.checkIfValidPhoneNum(copyFieldValue)) {
          this.$set(this.warningResults, fieldName, '只能由数字和短横线组成');
          return;
        }

      } else if (copyFieldValue !== '' && ['yearsOfEducation'].indexOf(fieldName) >= 0) {
        if (!Util.checkIfNonNegativeInteger(copyFieldValue)) {
          this.$set(this.warningResults, fieldName, '只能填入非负整数');
          return;
        } else if (copyFieldValue > 30) {
          this.$set(this.warningResults, fieldName, '不能超过30');
          return;
        }

      }

      // 初始化组件的时候，对应字段的警告文本为 undefined，判断之后，就为实际文本或 null
      // null 代表该字段项的填写没有毛病
      this.$set(this.warningResults, fieldName, null);
    },
    getWarningText(fieldName) {
      var warningResult = this.warningResults[fieldName];
      return warningResult ? warningResult : '';
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    autoComplete(types, queryStr) {
      types = types ? types : [];
      let results = queryStr ? types.filter((state) => {
        return (state.typeName.indexOf(queryStr) !== -1);
      }) : types;
      results = results.map((obj) => {
        return {
          value: obj.typeName,
          code: obj.typeCode
        };
      });
      return results;
    },
    querySearchAsync(queryStr, callback) {
      callback(this.autoComplete(this.allNation, queryStr));
    },
    querySearchAsync2(queryStr, callback) {
      callback(this.autoComplete(this.allNationality, queryStr));
    },
    handleSelect() {
      // console.log(item);
    }
  },
  components: {
    FoldingPanel
  },
  watch: {
    basicInfo: function(newBasicInfo) {
      // 当 basicInfo这个属性变量发生变化时（包括第一次传递进来），我们都对其进行浅复制，复制到 copyInfo 对象中。
      // 这样一来，编辑状态下修改 copyInfo 对象的属性时，就不会影响到 basicInfo 对象本身。
      // 如果组件的 basicInfo 属性发生变化，copyInfo 对象就会重置，而我们对 copyInfo 所做的还未提交的修改则会丢失。
      this.shallowCopy(newBasicInfo);
    },
    basicInfoTemplateGroups: function() {
      Bus.$emit(this.SCREEN_SIZE_CHANGE);
    },
    ['copyInfo.height']: function(val) {
      // 监听身高
      let h = parseFloat(val, 10);
      let w = parseFloat(this.copyInfo.weight, 10);
      if (h && w) {
        let res = w / ((h / 100) * (h / 100));
        res = parseFloat(res.toFixed(1), 10);
        this.copyInfo.bmi = res;
      } else {
        this.copyInfo.bmi = '';
      }
    },
    ['copyInfo.weight']: function(val) {
      // 监听体重
      let h = parseFloat(this.copyInfo.height, 10);
      let w = parseFloat(val, 10);
      if (h && w) {
        let res = w / ((h / 100) * (h / 100));
        res = parseFloat(res.toFixed(1), 10);
        this.copyInfo.bmi = res;
      } else {
        this.copyInfo.bmi = '';
      }
    },
    'copyInfo.homeProvince': function() {
      if (this.completeInit) {
        this.$set(this.copyInfo, 'homeCity', '');
      }
    }
  },
  mounted() {
    // console.log(this.basicInfoTemplateGroups);
    // console.log(this.basicInfoDictionaryGroups);
    this.allNation = Util.getElement('typegroupcode', 'nation', this.typeGroup).types;
    this.allNationality = Util.getElement('typegroupcode', 'nationality', this.typeGroup).types;
    this.$on(this.EDIT, this.startEditing);
    Bus.$on(this.FOLD_BASIC_INFO, () => {
      this.foldedStatus = true;
    });
  },
  created() {
    // 注意，这里之所以选择 created 钩子函数而不是 mounted，是因为 el-date-picker 组件的绑定数据模型是 copyInfo 下的属性
    // 如果在 DOM 都加载好了之后再去修改 this.copyInfo，会发现跟 el-date-picker 相关的属性会出现问题
    this.shallowCopy(this.basicInfo);
    setTimeout(() => {
      // console.log(this.basicInfoDictionaryGroups);
      // console.log(this.basicInfoTemplateGroups);
      // console.log(this.copyInfo);
    }, 2000);
  },
  beforeDestroy() {
    Bus.$off(this.GIVE_UP);
    Bus.$off(this.FOLD_BASIC_INFO);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 100px;

.basic-info {
  padding: 0 25px 10px;
  .group {
    padding: 15px 0;
    border-bottom: 1px solid @light-gray-color;
    text-align: left;
    &:first-child {
      padding-top: 0;
    }
    &:nth-child(3) {
      padding-bottom: 0;
      border: none;
    }
    .field {
      display: inline-block;
      position: relative;
      width: 50%;
      min-height: 50px;
      text-align: left;
      vertical-align: top;
      transform: translateY(5px);
      &.whole-line {
        width: 100%;
        .field-name, .field-input {
          width: calc(~"98% - @{field-name-width}");
        }
      }
      &.field-Province {
        width: 30%;
      }
      &.field-city {
        width: 46%;
        .field-input,.field-value {
          left: 0;
        }
      }
      .field-name {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
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
        position: absolute;
        top: 0;
        left: @field-name-width;
        width: calc(~"96% - @{field-name-width}");
        line-height: @field-line-height;
        overflow: visible;
        .warning-text {
          position: absolute;
          top: 22px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
        }
        .desensitized-value {
          font-size: @normal-font-size;
        }
        .el-input {
          transform: translateY(-3px);
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
          &.is-disabled  .el-input__inner{
            color: @light-font-color;
          }
        }
        .el-select {
          width: 100%;
        }
        .el-autocomplete {
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
  }
}
</style>
