<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box" :class="{'high-box': modalType === DISEASE_HISTORY_MODAL}" ref="scrollArea">
      <h3 class="title">{{title}}</h3>

      <!-- 这个 field 是专门为个人史准备的，用来确定最终的 template 到底是哪个子类 -->
      <div class="field" v-show="modalType === PERSON_HISTORY_MODAL">
        <span class="field-name">
          个人史类型
          <span class="required-mark">*</span>
        </span>
        <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          {{getSubModalVal(subModalType)}}
        </span>
        <span class="field-input" v-else>
          <span class="warning-text">{{getWarningText('subModal')}}</span>
          <el-select v-model="subModalType" :class="{'warning': warningResults['subModal']}"
            placeholder="请输入个人史类型" @change="chooseSubModal" :disabled="disableChangingSubModal">
            <el-option label="饮酒史" :value="WINE_HISTORY_MODAL"></el-option>
            <el-option label="吸烟史" :value="SMOKE_HISTORY_MODAL"></el-option>
            <el-option label="喝茶史" :value="TEA_HISTORY_MODAL"></el-option>
            <el-option label="咖啡史" :value="COFFEE_HISTORY_MODAL"></el-option>
            <el-option label="锻炼史" :value="EXERCISE_HISTORY_MODAL"></el-option>
          </el-select>
        </span>
      </div>
      <div class="seperate-line" v-show="this.modalType === this.PERSON_HISTORY_MODAL && this.subModalType !== ''"></div>

      <div class="field" v-for="field in template">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>
        <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          <span v-if="getUIType(field)===3">
            {{getFieldValue(field)}}
          </span>
          <span v-else>{{copyInfo[field.fieldName]}}</span>
        </span>
        <span class="field-input" v-else>
          <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
          <span v-if="getUIType(field)===1">
            <el-input v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :maxlength="500"></el-input>
          </span>
          <span v-else-if="getUIType(field)===3">
            <el-select v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)">
              <el-option v-for="type in getTypes(field)" :label="type.typeName"
                :value="type.typeCode" :key="type.typeName"></el-option>
            </el-select>
          </span>
          <span v-else-if="getUIType(field)===6">
            <el-date-picker v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}" type="date"
              :placeholder="getMatchedField(field).cnFieldDesc" :picker-options="pickerOptions0" format="yyyy-MM-dd" @change="updateWarning(field)"></el-date-picker>
          </span>
        </span>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-show="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD"
        class="button submit-button" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit"
        class="button edit-button" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

import { addPatientPresentHistory, modifyPatientPresentHistory,
         addPatientMedHistory, modifyPatientMedHistory,
         addPatientDisease, modifyPatientDisease,
         addPatientFamily, modifyPatientFamily,
         addPatientToxicExposure, modifyPatientToxicExposure,
         addPatientCoffee, modifyPatientCoffee,
         addPatientTea, modifyPatientTea,
         addPatientWine, modifyPatientWine,
         addPatientSmoke, modifyPatientSmoke,
         addPatientExercise, modifyPatientExercise
       } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      title: '',
      copyInfo: {},
      warningResults: {},
      lockSubmitButton: false,   // 这个变量用来锁住确定按钮，避免短时间内多次点击造成重复提交
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'presentHistoryTemplate',
      'medHistoryTemplate',
      'diseaseHistoryTemplate',
      'familyHistoryTemplate',
      'coffeeHistoryTemplate',
      'teaHistoryTemplate',
      'smokeHistoryTemplate',
      'wineHistoryTemplate',
      'exerciseHistoryTemplate',
      'toxicExposureHistoryTemplate',

      'presentHistoryDictionary',
      'medHistoryDictionary',
      'diseaseHistoryDictionary',
      'familyHistoryDictionary',
      'coffeeHistoryDictionary',
      'teaHistoryDictionary',
      'smokeHistoryDictionary',
      'wineHistoryDictionary',
      'exerciseHistoryDictionary',
      'toxicExposureHistoryDictionary',

      'typeGroup'
    ]),
    dictionary() {
      if (this.modalType === this.PRESENT_HISTORY_MODAL) {
        return this.presentHistoryDictionary;
      } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
        return this.medHistoryDictionary;
      } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
        return this.diseaseHistoryDictionary;
      } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
        return this.familyHistoryDictionary;
      } else if (this.modalType === this.PERSON_HISTORY_MODAL) {
        // 如果是个人史面板，则有几个子模版，需要在选择个人史子类型后，自动确定新的 dictionary
        if (this.subModalType === this.WINE_HISTORY_MODAL) {
          return this.wineHistoryDictionary;
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          return this.teaHistoryDictionary;
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          return this.coffeeHistoryDictionary;
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          return this.smokeHistoryDictionary;
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          return this.exerciseHistoryDictionary;
        } else {
          return [];
        }
      } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
        return this.toxicExposureHistoryDictionary;
      } else {
        return [];
      }
    },
    template() {
      if (this.modalType === this.PRESENT_HISTORY_MODAL) {
        return this.presentHistoryTemplate;
      } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
        return this.medHistoryTemplate;
      } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
        return this.diseaseHistoryTemplate;
      } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
        return this.familyHistoryTemplate;
      } else if (this.modalType === this.PERSON_HISTORY_MODAL) {
        // 如果是个人史面板，则有几个子模版，需要在选择个人史类型后，自动确定新的模版
        if (this.subModalType === this.WINE_HISTORY_MODAL) {
          return this.wineHistoryTemplate;
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          return this.teaHistoryTemplate;
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          return this.coffeeHistoryTemplate;
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          return this.smokeHistoryTemplate;
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          return this.exerciseHistoryTemplate;
        } else {
          return [];
        }
      } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
        return this.toxicExposureHistoryTemplate;
      } else {
        return [];
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
    showPanel(cardOperation, title, originalInfo, modalType) {
      this.displayModal = true;
      // 由 cardOperation 来决定，到底是新增记录，浏览记录，还是修改记录
      // 这三个值分别为 this.ADD_NEW_CARD, this.VIEW_CURRENT_CARD, this.EDIT_CURRENT_CARD
      this.mode = cardOperation;

      // 如果传过来的 modalType 是个人史下的子类，则将其赋值为 this.subModalType，而 this.modalType 还是个人史
      // 同时，还要禁止个人史下子类的选择，因为此时子类不可更换
      const SUB_MODAL_LIST = [this.TEA_HISTORY_MODAL, this.COFFEE_HISTORY_MODAL, this.WINE_HISTORY_MODAL, this.SMOKE_HISTORY_MODAL, this.EXERCISE_HISTORY_MODAL];
      if (SUB_MODAL_LIST.indexOf(modalType) > -1) {
        this.subModalType = modalType;
        this.modalType = this.PERSON_HISTORY_MODAL;
        this.disableChangingSubModal = true;
      } else {
        this.subModalType = '';
        this.modalType = modalType;
        this.disableChangingSubModal = false;
      }

      this.title = title;
      this.copyInfo = Object.assign({}, originalInfo);

      // 每次打开这个模态框，都会重新初始化 this.copyInfo
      this.initCopyInfo();

      // 清空警告信息
      // 改变 copyInfo 的时候会触发 warningResults 的跟踪变化（这里的自动触发是由 el-date-picker 的 v-model造成的）
      // 因此这一步要等到 copyInfo 变化结束之后再执行，我们将其放到下一个事件循环 tick 中
      this.$nextTick(() => {
        this.clearWarning();
      });

      for (var i = 0; i < this.template.length; i++) {
        // console.log(this.template[i].fieldName);
      }

      this.updateScrollbar();
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    submit() {
      // 如果确定按钮被锁住了，则不执行下面的逻辑，防止重复点击
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      // 对于特殊的个人史，检查 subModal 字段是否有被选择
      if (this.modalType === this.PERSON_HISTORY_MODAL && this.subModalType === '') {
        this.$set(this.warningResults, 'subModal', '请选择');
      }

      // 检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
      for (let field of this.template) {
        this.updateWarning(field);
      }
      for (let fieldName in this.warningResults) {
        if (this.warningResults[fieldName]) {
          this.lockSubmitButton = false;
          return false;
        }
      };
      // console.log(this.copyInfo);
      // 准备提交之前，需要将日期格式调整成符合服务器传输的字符串
      for (let field of this.template) {
        if (this.getUIType(field) === 6) {
          var dateStr = this.copyInfo[field.fieldName];
          this.copyInfo[field.fieldName] = Util.simplifyDate(dateStr);
        }
      };
      var startTime;
      var endTime;
      if (this.modalType === this.PERSON_HISTORY_MODAL) {
        startTime = this.copyInfo.startTime;
        endTime = this.copyInfo.endTime;
      };
      if (this.modalType === this.DISEASE_HISTORY_MODAL) {
        startTime = this.copyInfo.beginTime;
        endTime = this.copyInfo.endTime;
      };
      if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
        startTime = this.copyInfo.medStart;
        endTime = this.copyInfo.medEnd;
      };
      if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      };
      this.copyInfo.patientId = parseInt(this.$route.params.id, 10);
      // 到这里，检验合格，准备提交数据了
      if (this.mode === this.ADD_NEW_CARD) {
        if (this.modalType === this.PRESENT_HISTORY_MODAL) {
          addPatientPresentHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
          addPatientMedHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
          addPatientDisease(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
          addPatientFamily(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
          addPatientToxicExposure(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          addPatientCoffee(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          addPatientTea(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.WINE_HISTORY_MODAL) {
          addPatientWine(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          addPatientSmoke(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          addPatientExercise(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        }

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        if (this.modalType === this.PRESENT_HISTORY_MODAL) {
          modifyPatientPresentHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
          modifyPatientMedHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
          modifyPatientDisease(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
          modifyPatientFamily(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
          modifyPatientToxicExposure(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          modifyPatientCoffee(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          modifyPatientTea(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.WINE_HISTORY_MODAL) {
          modifyPatientWine(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          modifyPatientSmoke(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          modifyPatientExercise(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError());
        }
      }
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      this.displayModal = false;
      this.lockSubmitButton = false;  // 为按钮解锁
    },
    initCopyInfo() {
      // 遍历当前的 template，对其中的每个 field，检查 this.copyInfo 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of this.template) {
        let name = field.fieldName;
        if (this.copyInfo[name] === undefined) {
          this.$set(this.copyInfo, name, '');
        }
      }
    },
    getMatchedField(field) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', field.fieldName, this.dictionary);
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
    getFieldValue(field) {
      var code = this.copyInfo[field.fieldName];
      if (code === undefined || code === '') {
        return '';
      }
      var types = this.getTypes(field);
      var targetType = Util.getElement('typeCode', code, types);
      return targetType.typeName ? targetType.typeName : '';
    },
    getSubModalVal(subModalType) {
      if (subModalType === this.COFFEE_HISTORY_MODAL) {
        return '咖啡史';
      } else if (subModalType === this.WINE_HISTORY_MODAL) {
        return '饮酒史';
      } else if (subModalType === this.SMOKE_HISTORY_MODAL) {
        return '吸烟史';
      } else if (subModalType === this.TEA_HISTORY_MODAL) {
        return '喝茶史';
      } else if (subModalType === this.EXERCISE_HISTORY_MODAL) {
        return '锻炼史';
      }
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var fieldValue = this.copyInfo[fieldName];
      if (this.getUIType(field) === 6) {
        // 日期控件(el-date-picker)给的是一个表示完整日期对象的字符串，我们需要格式化之后再校验
        fieldValue = Util.simplifyDate(fieldValue);
      }
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
          this.$set(this.warningResults, fieldName, '必填项');
          return;
        }
      }

      if (fieldValue && fieldValue.toString().indexOf(' ') > -1) {
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
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
      this.updateScrollbar();
    },
    _handleError(error) {
      // 当调用 api 发生错误时，执行此函数，注意在此时需要为“确定”按钮解锁
      console.log(error);
      this.lockSubmitButton = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MODAL_BOX, this.showPanel);
  },
  watch: {
    template: function() {
      // 只有在 template 更新后，才去初始化 this.copyInfo 的值
      this.initCopyInfo();
    },
    $route: function() {
      // 路由被手动变化之后，自动关闭模态框
      this.cancel();
    }
  },
  beforeDestroy() {
    // 依然要记得，销毁组件之前解除绑定在自己身上的事件监听器·
    Bus.$off(this.SHOW_MODAL_BOX, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 5%;
    width: 600px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
    &.high-box {
      top: 6%;
    }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      display: inline-block;
      position: relative;
      margin-bottom: 10px;
      width: 100%;
      min-height: 40px;
      text-align: left;
      transform: translateX(10px);
      // overflow: hidden;
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
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
      .field-input {
        display: inline-block;
        position: relative;
        top: 0;
        left: @field-name-width;
        width: calc(~"96% - @{field-name-width}");
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        .warning-text {
          position: absolute;
          top: 25px;
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
