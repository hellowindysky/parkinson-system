<template lang="html">
  <folding-panel :title="'基础信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit"
    :folded-status="foldedStatus" :editable="canEdit">
    <div class="basic-info">
      <div class="group" v-for="group in basicInfoTemplateGroups">
        <div class="field" v-for="field in group" :class="{'whole-line': checkIfWholeLine(field)}">
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
            <span v-if="getUIType(field)===1">
              <el-input v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
                :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :maxlength="50" @input="inputing(field)"></el-input>
            </span>
            <span v-else-if="getUIType(field)===3">
              <el-select v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
                :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :clearable="true">
                <el-option v-for="type in getTypes(field)" :label="type.typeName"
                  :value="type.typeCode" :key="type.typeCode"></el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field)===6">
              <el-date-picker v-model="copyInfo[field.fieldName]" type="date" :class="{'warning': warningResults[field.fieldName]}"
                :placeholder="getMatchedField(field).cnFieldDesc"
                @change="updateWarning(field)">
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

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';

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
      mode: this.READING_MODE,
      foldedStatus: false,
      copyInfo: {},
      warningResults: {},
      lockSubmitButton: false
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
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return 'myPatients';
      } else if (this.$route.matched.some(record => record.meta.otherPatients)) {
        return 'otherPatients';
      } else {
        return 'unknown';
      }
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
      this.clearWarning();
    },
    cancel() {
      this.lockSubmitButton = false;
      // 如果是新增患者界面，点击取消按钮，则回到患者列表的第一个患者
      if (this.$route.params.id === 'newPatient') {
        Bus.$on(this.CONFIRM, () => {
          if (this.listType === 'myPatients') {
            this.$router.push({name: 'myPatients'});
          } else if (this.listType === 'otherPatients') {
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
      var submitData = deepCopy(this.copyInfo);
      reviseDateFormat(submitData);
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
        addPatientInfo(submitData).then((data) => {
          var newId = data.patientId;
          if (this.listType === 'myPatients') {
            this.$router.push({
              name: 'patientInfo',
              params: {id: newId}
            });
            Bus.$emit(this.UPDATE_MY_PATIENTS_LIST);

          } else if (this.listType === 'otherPatients') {
            this.$router.push({
              name: 'otherPatientInfo',
              params: {id: newId}
            });
            Bus.$emit(this.UPDATE_OTHER_PATIENTS_LIST);
          }

          // 如果是新增患者，还要在确定之后，将个人信息的病症信息面板置为编辑状态，同时收起基础信息面板
          this.$nextTick(() => {
            Bus.$emit(this.FOLD_BASIC_INFO);
            Bus.$emit(this.EDIT_DISEASE_INFO);
            // Bus.$emit(this.EDIT_OTHER_INFO);
          });
          this.lockSubmitButton = false;

        }, (error) => {
          console.log(error);
          if (error.code === 23) {
            this.$message({
              message: '该用户已经存在',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 31) {
            this.$message({
              message: '医院患者编码重复',
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
          if (this.listType === 'myPatients') {
            Bus.$emit(this.UPDATE_MY_PATIENTS_LIST);
          } else if (this.listType === 'otherPatients') {
            Bus.$emit(this.UPDATE_OTHER_PATIENTS_LIST);
          }

          this.mode = this.READING_MODE;
          this.lockSubmitButton = false;
        }, (error) => {
          console.log(error);
          if (error.code === 23) {
            this.$message({
              message: '该用户已经存在',
              type: 'error',
              duration: 2000
            });
          } else if (error.code === 31) {
            this.$message({
              message: '医院患者编码重复',
              type: 'error',
              duration: 2000
            });
          }
          this.lockSubmitButton = false;
        });
      }
    },
    shallowCopy(obj) {
      // 进行浅复制之后，修改复制对象的属性，不会影响到原始对象
      // 下面这行有一个特殊作用，能让 Vue 动态检测已有对象的新添加的属性，参看 https://cn.vuejs.org/v2/guide/reactivity.html
      this.copyInfo = Object.assign({}, obj);

      // 如果传过来的数据对象缺少某些属性，则根据 template 补上
      for (let group of this.basicInfoTemplateGroups) {
        for (let field of group) {
          if (this.copyInfo[field.fieldName] === undefined) {
            this.$set(this.copyInfo, field.fieldName, '');
          }
        }
      }

      this.handleSpecialField();
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
      return WHOLE_LINE_FIELD_LIST.indexOf(dictionaryField.fieldName) > -1;
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
      return typeInfo.types ? typeInfo.types : [];
    },
    transformTypeCode(typeCode, field) {
      // 根据 typeCode 找到对应的 typeName
      var types = this.getTypes(field);
      var matchedType = Util.getElement('typeCode', typeCode, types);
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
        let result = Util.checkId(copyFieldValue).split(',');
        if (copyFieldValue === '' || copyFieldValue === undefined) {
          this.$set(this.warningResults, fieldName, null);
          return;
        } else if (result.length <= 1) {
          this.$set(this.warningResults, fieldName, result[0]);
          return;
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
      } else if (fieldName === 'height' || fieldName === 'weight') {
        if (parseFloat(this.copyInfo[fieldName], 10) < 0) {
          this.$set(this.warningResults, fieldName, '身高和体重必须大于0');
          return;
        };
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

      } else if (copyFieldValue && copyFieldValue.toString().indexOf(' ') > -1) {
        this.$set(this.warningResults, fieldName, '不能包含空格');

      } else {
        // 初始化组件的时候，对应字段的警告文本为 undefined，判断之后，就为实际文本或 null
        // null 代表该字段项的填写没有毛病
        this.$set(this.warningResults, fieldName, null);
      }
    },
    getWarningText(fieldName) {
      var warningResult = this.warningResults[fieldName];
      return warningResult ? warningResult : '';
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
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
    }
  },
  mounted() {
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
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
    }
  }
}
</style>
