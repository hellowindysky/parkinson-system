<template lang="html">
  <div class="medicine-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal" ref="medicineModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field" v-for="field in firstTemplateGroup">
          <span class="field-name">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
              <span v-if="field.fieldName==='commonName'">{{commonName}}</span>
              <span v-else-if="field.fieldName==='medicalType'">{{medicalType}}</span>
              <span v-else-if="field.fieldName==='totalMeasure'">{{totalMeasure}} mg</span>
              <span v-else>{{medicine[field.fieldName]}}</span>
            </span>
            <span v-else-if="getUIType(field.fieldName)===3">
              {{getFieldValue(field)}}
            </span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
              <span v-if="field.fieldName==='commonName'">{{commonName}}</span>
              <span v-else-if="field.fieldName==='medicalType'">{{medicalType}}</span>
              <span v-else-if="field.fieldName==='totalMeasure'">{{totalMeasure}} mg</span>
              <span v-else>{{medicine[field.fieldName]}}</span>
            </span>
            <el-select v-else-if="getUIType(field.fieldName)===3" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
              <el-option v-for="option in getOptions(field.fieldName)" :label="option.name"
              :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>

        <div class="form-wrapper" ref="formWrapper">
          <table class="form">
            <tr class="row first-row">
              <td class="col col-id">
                序号
              </td>
              <td class="col col-time">
                时间
                <!-- <span class="required-mark">*</span> -->
              </td>
              <td class="col col-amount">
                服用量
                <span class="required-mark">*</span>
              </td>
              <td class="col col-unit">
                计算单位
              </td>
            </tr>
            <tr v-for="i in rowArray" class="row">
              <td class="col col-id">{{i}}</td>
              <td class="col col-time">
                <span v-if="mode===VIEW_CURRENT_CARD">{{medicine.patientMedicineDetail[i - 1].takeTime}}</span>
                <el-time-select v-else v-model="medicine.patientMedicineDetail[i - 1].takeTime" @change="updateTime(i - 1)"
                 :class="{'warning': false}" placeholder="具体时间点"
                 :editable="false" :picker-options="{start: '00:00', step: '00:30', end: '23:30'}">
                </el-time-select>
              </td>
              <td class="col col-amount">
                <span v-if="mode===VIEW_CURRENT_CARD">{{medicine.patientMedicineDetail[i - 1].takeDose}}</span>
                <el-input v-else v-model="medicine.patientMedicineDetail[i - 1].takeDose" @change="updateDose(i - 1)"
                 :class="{'warning': warningResults.patientMedicineDetail[i - 1].takeDose}" placeholder="单次服用量"></el-input>
                <div class="warning-text-wrapper">
                  <span class="warning-text">{{warningResults.patientMedicineDetail[i - 1].takeDose}}</span>
                </div>
              </td>
              <td class="col col-unit">{{medicineUnit}}</td>
            </tr>
          </table>
        </div>

        <div class="field" v-for="field in thirdTemplateGroup" :class="{'whole-line': field.fieldName==='remarks'}">
          <span class="field-name" :class="{'long-field-name': isLongName(field.fieldName)}">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span v-if="mode===VIEW_CURRENT_CARD" class="field-input" :class="{'long-field-name': isLongName(field.fieldName)}">
            <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
              <span v-if="field.fieldName==='levodopaDose'">{{levodopaDose}}</span>
              <span v-else-if="field.fieldName==='levodopaFactorUsed'">{{levodopaFactor}}</span>
              <span v-else>{{medicine[field.fieldName]}}</span>
            </span>
            <span v-else>{{medicine[field.fieldName]}}</span>
          </span>
          <span v-else class="field-input" :class="{'long-field-name': isLongName(field.fieldName)}">
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <span v-if="getMatchedField(field.fieldName).readOnlyType===2">
              <span v-if="field.fieldName==='levodopaDose'">{{levodopaDose}}</span>
              <span v-else-if="field.fieldName==='levodopaFactorUsed'">{{levodopaFactor}}</span>
              <span v-else>{{medicine[field.fieldName]}}</span>
            </span>
            <el-input v-else-if="getUIType(field.fieldName)===1" v-model="medicine[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}" :type="getInputType(field.fieldName)"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)"
              :maxlength="500">
            </el-input>
          </span>
        </div>

        <div class="seperate-line"></div>
        <div class="field" v-for="field in fourthTemplateGroup" :class="{'whole-line': field.fieldName==='stopRemark'}">
          <span class="field-name" :class="{'long-field-name': isLongName(field.fieldName)}">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1">*</span>
          </span>
          <span v-if="mode===VIEW_CURRENT_CARD" class="field-input" :class="{'long-field-name': isLongName(field.fieldName)}">
            <span v-if="getUIType(field.fieldName)===3">{{getFieldValue(field)}}</span>
            <span v-else>{{medicine[field.fieldName]}}</span>
          </span>
          <span v-else class="field-input" :class="{'long-field-name': isLongName(field.fieldName)}">
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <el-input v-if="getUIType(field.fieldName)===1" v-model="medicine[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}" :type="getInputType(field.fieldName)"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)"
              :maxlength="500">
            </el-input>
            <el-select v-else-if="getUIType(field.fieldName)===3" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
              <el-option v-for="option in getOptions(field.fieldName)" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
            <el-date-picker v-else-if="getUIType(field.fieldName)===6" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
           </el-date-picker>
          </span>
        </div>

        <div class="seperate-line"></div>
        <div class="field" v-for="field in fifthTemplateGroup" :class="{'whole-line': field.fieldName==='sideeffectRemark'}">
          <span class="field-name" :class="{'long-field-name': isLongName(field.fieldName)}">
            {{field.cnfieldName}}
            <span class="required-mark" v-show="field.must===1 || hasSideEffect">*</span>
          </span>
          <span v-if="mode===VIEW_CURRENT_CARD" class="field-input" :class="{'long-field-name': isLongName(field.fieldName)}">
            <span v-if="getUIType(field.fieldName)===3">{{getFieldValue(field)}}</span>
            <span v-else>{{medicine[field.fieldName]}}</span>
          </span>
          <span v-else class="field-input" :class="{'long-field-name': isLongName(field.fieldName)}">
            <span class="warning-text">{{warningResults[field.fieldName]}}</span>
            <el-input v-if="getUIType(field.fieldName)===1" v-model="medicine[field.fieldName]"
              :class="{'warning': warningResults[field.fieldName]}" :type="getInputType(field.fieldName)"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateWarning(field)" :maxlength="500">
            </el-input>
            <el-select v-else-if="getUIType(field.fieldName)===3" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
              <el-option v-for="option in getOptions(field.fieldName)" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
            <el-date-picker v-else-if="getUIType(field.fieldName)===6" v-model="medicine[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field.fieldName).cnFieldDesc" @change="updateField(field)">
           </el-date-picker>
          </span>
        </div>
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
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { addPatientMedicine, modifyPatientMedicine } from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      medicine: {},
      originalMedicine: {},
      warningResults: {},
      completeInit: false,
      hasSideEffect: false,  // 这个变量用来控制是否有副反应
      totalLevodopaDoseOfAllOtherMedicine: 0,  // 用来供 COMT 抑制剂药物(如珂丹) 计算左旋多巴等效剂量
      lockSubmitButton: false
    };
  },
  computed: {
    ...mapGetters([
      'medicineDictionary',
      'medicineTemplateGroups',
      'medicineInfo',
      'medicineStopReason',
      'typeGroup'
    ]),
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增药物方案';
      } else {
        return '药物方案';
      }
    },
    firstTemplateGroup() {
      return this.medicineTemplateGroups[0] ? this.medicineTemplateGroups[0] : [];
    },
    secondTemplateGroup() {
      return this.medicineTemplateGroups[1] ? this.medicineTemplateGroups[1] : [];
    },
    thirdTemplateGroup() {
      return this.medicineTemplateGroups[2] ? this.medicineTemplateGroups[2] : [];
    },
    fourthTemplateGroup() {
      return this.medicineTemplateGroups[3] ? this.medicineTemplateGroups[3] : [];
    },
    fifthTemplateGroup() {
      return this.medicineTemplateGroups[4] ? this.medicineTemplateGroups[4] : [];
    },
    totalTemplate() {
      // 把 template 的几个 group 拼到一起
      return [].concat(this.firstTemplateGroup, this.secondTemplateGroup, this.thirdTemplateGroup);
    },
    medicineInfoObj() {
      // 根据最新的 medicineId，去 this.medicineInfo 里面获取相应的对象，从而获得该类型药物的详细参考信息
      return Util.getElement('medicineId', this.medicine.medicineId, this.medicineInfo);
    },
    commonName() {
      // 通用名，这个计算属性是用来渲染的，而每次更新这个计算属性的时候，都会为 this.medicine 进行相应的赋值
      let commonName = this.medicineInfoObj.commonName;
      this.medicine.commonName = commonName;
      return commonName;
    },
    medicalType() {
      // 药物类型，这个计算属性也是用来渲染的，而每次更新这个计算属性的时候，都会为 this.medicine 进行相应的赋值
      let medicalTypeNum = this.medicineInfoObj.medicalType;
      let typeInfo = Util.getElement('typegroupcode', 'durgType', this.typeGroup);  // 数据库拼写错误，把 drug 拼成了 drug
      let medicalType = Util.getElement('typeCode', medicalTypeNum, typeInfo.types).typeName;
      this.medicine.medicalType = medicalType;
      return medicalType;
    },
    totalAmount() {
      // 这个变量用来计算服用量之和，是一个数字，我们再利用它来计算单日总剂量和单日左旋多巴等效剂量
      let amount = 0;
      if (!this.medicine.patientMedicineDetail || !(this.medicine.patientMedicineDetail instanceof Array)) {
        this.medicine.totalMeasure = 0;
        return 0;
      }
      for (let item of this.medicine.patientMedicineDetail) {
        let dose = Number(item.takeDose);
        dose = isNaN(dose) ? 0 : dose;  // 如果上一步算出来的为 NaN，那么就取 0
        amount += dose;
      }
      return amount;
    },
    totalMeasure() {
      // 日总剂量，由药物规格和每日总服用量相乘得到。同时，每次更新这个计算属性的时候，同时更新 this.medicine 下的相应属性值
      let spec = this.medicalSpec;
      spec = isNaN(spec) ? 0 : spec;
      var totalMeasure = Math.round(this.totalAmount * spec * 100000) / 100000.0;
      this.medicine.totalMeasure = totalMeasure;
      return totalMeasure;
    },
    computeUnit() {
      // 计算单位，是一个数字，这个计算属性是在和服务器进行数据交互时使用的，在 rowArray() 中有用到
      return this.medicineInfoObj.oralUnit;
    },
    medicineUnit() {
      // 计算单位，它是 this.computeUnit 所对应的 字符串
      let unitTypes = Util.getElement('typegroupcode', 'oralUnit', this.typeGroup).types;
      return Util.getElement('typeCode', this.computeUnit, unitTypes).typeName;
    },
    medicalSpec() {
      // 这个变量用来保存当前药物的规格，是一个数字
      let specGroups = this.medicineInfoObj.spec ? this.medicineInfoObj.spec : [];
      let spec = Util.getElement('specOral', this.medicine.medicalSpecUsed, specGroups);
      return spec.medicalPec;   // 你没有看错，数据库里面就拼写错误了，正确的应该是 'medicalSpec'，少了一个 S
    },
    levodopaFactor() {
      // 左旋多巴等效系数，这个计算属性是根据 medicineId 而变化的，同时更新 this.medicine.medicineId
      // 先根据 medicineId 在 tableData 里面找到对应的 medicineInfoObj，然后找到它下面的 规格数组（spec属性）
      var specGroups = this.medicineInfoObj.spec;
      specGroups = specGroups && (specGroups instanceof Array) ? specGroups : [];

      // 再根据选择的药物规格，找到相应的对象，取得该对象的左旋多巴等效系数属性值
      let spec = Util.getElement('specOral', this.medicine.medicalSpecUsed, specGroups);
      let levodopaFactor = spec.levodopaFactor ? spec.levodopaFactor : 0;
      this.medicine.levodopaFactorUsed = levodopaFactor;
      return levodopaFactor;
    },
    levodopaDose() {
      // 单日左旋多巴等效剂量，更新这个计算属性的同时也更新 this.medicine.levodopaDose
      // 注意 COMT 抑制剂类药物（如珂丹），其左旋多巴等效系数为 0，它们的左旋多巴等效剂量，依赖于该次诊断的其它药物
      let levodopaDose = 0;
      if (this.medicineInfoObj.medicalType === 3) {
        levodopaDose = Math.round(this.totalLevodopaDoseOfAllOtherMedicine * 100000 * 0.33) / 100000.0;
      } else {
        let levodopaFactor = this.medicine.levodopaFactorUsed;
        levodopaDose = Math.round(this.totalAmount * levodopaFactor * 100000) / 100000.0;
      }

      this.medicine.levodopaDose = levodopaDose;
      return levodopaDose;
    },
    rowArray() {
      var arr = [];   // 这个数组用来帮助生成表格，其中的元素就是每行的序号

      // this.medicine对象下有个属性，patientMedicineDetail，它是一个数组，每个原素都是一个对象。
      // 这个数组的长度 始终和 this.rowArray 保持一致，因此把这个数组的初始化逻辑放在了 rowArray() 中
      this.$set(this.medicine, 'patientMedicineDetail', []);
      this.$set(this.warningResults, 'patientMedicineDetail', []);

      for (let i = 0; i < this.medicine.usages; i++) {
        this.medicine.patientMedicineDetail.push({});
        this.warningResults.patientMedicineDetail.push({});

        // 这个 secondTemplateGroup 数组里的原素，对应着表格的列，也对应着 patientMedicineDetail 里的不同属性
        for (let field of this.secondTemplateGroup) {
          var fieldName = field.fieldName;

          var value = '';
          // 下面这个是为了初始化 this.medicine 的时候不覆盖掉 originalMedicine.patientMedicineDetail 的值，
          // 就设定了一个条件 ———— 如果药物名和每日服药次数都是原来的值的话，就把原来的每次服药时间 和 每次服用量 都复制过来
          if (this.medicine.usages === this.originalMedicine.usages && this.medicine.medicineId &&
           this.medicine.medicineId === this.originalMedicine.medicineId) {

            // 记得验证原始值是否存在
            if (this.originalMedicine.patientMedicineDetail &&
             this.originalMedicine.patientMedicineDetail[i]) {
              value = this.originalMedicine.patientMedicineDetail[i][fieldName];
            }
          }

          if (fieldName === 'computUnit') { // 数据库拼写错误，掉了一个 e
            value = this.computeUnit;
          }
          value = value ? value : '';

          this.$set(this.medicine.patientMedicineDetail[i], fieldName, value);
          this.$set(this.warningResults.patientMedicineDetail[i], fieldName, null);
        }
      }

      for (let i = 1; i <= this.medicine.usages; i++) {
        arr.push(i);
      }

      this.updateScrollbar();
      return arr;
    }
  },
  methods: {
    showModal(cardOperation, item, totalLevodopaDoseOfAllOtherMedicine) {
      this.mode = cardOperation;
      this.displayModal = true;
      this.completeInit = false;
      this.totalLevodopaDoseOfAllOtherMedicine = totalLevodopaDoseOfAllOtherMedicine;

      setTimeout(() => {
        // console.log('firstTemplate', this.firstTemplateGroup);
        // console.log('secondTemplate', this.secondTemplateGroup);
        // console.log('thirdTemplate', this.thirdTemplateGroup);
        // console.log('secondTemplate', this.fourthTemplateGroup);
        // console.log('thirdTemplate', this.fifthTemplateGroup);
        // console.log('dictionary', this.medicineDictionary);
        // console.log('medicineInfo', this.medicineInfo);
      }, 2000);

      this.initMedicine(item);
      // console.log(this.medicine);

      for (let field of this.totalTemplate) {
        this.updateField(field);
      }

      // 改变 this.medicine 的时候会触发 warningResults 的跟踪变化（这里的自动触发是由 v-model 造成的）
      // 因此这一步要等到 this.medicine 变化结束之后再执行，我们将其放到下一个事件循环 tick 中
      this.$nextTick(() => {
        this.clearWarning();

        // 这里加一个开关，用来标记数字是否会改变
        this.completeInit = true;
      });
    },
    cancel() {
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;
      // console.log(this.medicine);
      // console.log(this.warningResults);

      // 首先，将日期格式改为符合传输标准的字符串
      this.medicine.stopDate = Util.simplifyDate(this.medicine.stopDate);

      // 然后更新一下 warningResults，因为有的组件初始化的时候并不会做校验
      for (let field of [].concat(this.firstTemplateGroup, this.thirdTemplateGroup,
       this.fourthTemplateGroup, this.fifthTemplateGroup)) {
        this.updateWarning(field);
      }
      for (var i = 0; i < this.medicine.patientMedicineDetail.length; i++) {
        let item = this.medicine.patientMedicineDetail[i];
        for (let p in item) {
          if (item.hasOwnProperty(p) && !item[p]) {
            this.warningResults.patientMedicineDetail[i][p] = '必填';
          }
        }
      }

      for (let propertyName in this.warningResults) {
        if (this.warningResults.hasOwnProperty(propertyName)) {
          if (propertyName === 'patientMedicineDetail') {
            let formList = this.warningResults[propertyName];
            formList = formList ? formList : [];
            for (let formItem of formList) {
              for (let p in formItem) {
                if (formItem.hasOwnProperty(p) && formItem[p] && p === 'takeDose') {
                  console.log('表格填写不规范，不允许提交');
                  return;
                }
              }
            }
          } else {
            if (this.warningResults[propertyName]) {
              console.log('填写不合规范，不允许提交');
              return;
            }
          }
        }
      }
      // 准备提交了
      this.medicine.patientId = this.$route.params.id;
      this.medicine.patientCaseId = this.$route.params.caseId;
      if (this.title === '新增药物方案') {
        addPatientMedicine(this.medicine).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this_handleError);
      } else if (this.title === '药物方案') {
        modifyPatientMedicine(this.medicine).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this_handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.displayModal = false;
    },
    initMedicine(item) {
      // originalMedicine 是原始数据，在修改表格的时候需要参考这个对象，medicine 是我们编辑和上传的对象
      this.medicine = Object.assign({}, item);
      this.originalMedicine = Object.assign({}, item);

      // 遍历 firstTemplateGroup，对其中的每个 field，检查 this.medicine 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of [].concat(this.firstTemplateGroup, this.thirdTemplateGroup, this.fourthTemplateGroup, this.fifthTemplateGroup)) {
        let name = field.fieldName;
        if (this.medicine[name] === undefined) {
          this.$set(this.medicine, name, '');
        }
      }
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.medicineDictionary);
    },
    getFieldValue(field) {
      var fieldName = field.fieldName;
      var code = this.medicine[fieldName];
      var options = this.getOptions(fieldName);
      var value = Util.getElement('code', code, options).name;
      return value ? value : '';
    },
    getUIType(fieldName) {
      return this.getMatchedField(fieldName).uiType;
    },
    getOptions(fieldName) {
      // 为下拉框准备列表
      var options = [];
      var dictionaryField = this.getMatchedField(fieldName);
      if (dictionaryField.fieldName === 'medicineId') {
        for (let medicineItem of this.medicineInfo) {
          options.push({
            name: medicineItem.medicineName,
            code: medicineItem.medicineId
          });
        }

      } else if (dictionaryField.fieldName === 'medicalSpecUsed') {
        let specGroups = this.medicineInfoObj.spec ? this.medicineInfoObj.spec : [];
        for (let spec of specGroups) {
          let specOral = spec.specOral;
          if (spec.medicalPec === 0) {
            specOral = '其它规格(在备注中注明)';
          }
          options.push({
            name: specOral,
            code: specOral
          });
        }

      } else if (dictionaryField.fieldName === 'stopReason') {
        for (let reason of this.medicineStopReason) {
          options.push({
            name: reason.stopReason,
            code: reason.id
          });
        }

      } else {
        // 如果是其它下拉框，属于普通字段，去 typeGroup 里面查就可以了
        var typegroupName = dictionaryField.fieldName;
        if (dictionaryField.fieldName === 'sideeffectType') {
          typegroupName = 'drugEffect';
        }
        let typeInfo = Util.getElement('typegroupcode', typegroupName, this.typeGroup);
        let types = typeInfo.types ? typeInfo.types : [];
        for (let type of types) {
          options.push({name: type.typeName, code: type.typeCode});
        }
      }
      return options;
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateField(field) {
      // 如果修改了药物名称 (medicineId)，那么就将药物规格清空，注意这一步逻辑一定要在初始化之后才会执行
      if (field.fieldName === 'medicineId' && this.completeInit) {
        this.medicine.medicalSpecUsed = '';
      }

      // 如果将 “停药原因” 设置为 “药物副反应”，则后续的药物副反应变为必填项
      if (field.fieldName === 'stopReason') {
        var reason = Util.getElement('id', this.medicine.stopReason, this.medicineStopReason);
        if (reason.effectMust === 1) {
          this.hasSideEffect = true;
        } else {
          this.hasSideEffect = false;
          for (let templateField of this.fifthTemplateGroup) {
            this.updateWarning(templateField);
          }
        }
      }

      this.updateWarning(field);
    },
    isLongName(name) {
      const LONG_NAME_LIST = ['levodopaFactorUsed', 'levodopaDose'];
      if (LONG_NAME_LIST.indexOf(name) > -1) {
        return true;
      } else {
        return false;
      }
    },
    getInputType(name) {
      const textAreaNameList = ['remarks', 'stopRemark', 'sideeffectRemark'];
      return textAreaNameList.indexOf(name) > -1 ? 'textarea' : 'text';
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.formWrapper);
        Ps.initialize(this.$refs.formWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
        Ps.destroy(this.$refs.medicineModal);
        Ps.initialize(this.$refs.medicineModal, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updateWarning(field) {
      var fieldName = field.fieldName;

      // 如果是只读类型字段，则不做校验
      if (this.getMatchedField(fieldName).readOnlyType === 2) {
        return;
      }

      var fieldValue = this.medicine[fieldName];
      var isSideEffectField = false;
      for (let templateField of this.fifthTemplateGroup) {
        if (fieldName === templateField.fieldName) {
          isSideEffectField = true;
        }
      }
      if (field.must === 1 || (isSideEffectField && this.hasSideEffect)) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          this.$set(this.warningResults, fieldName, '必填项');

        } else {
          this.$set(this.warningResults, fieldName, null);
        }

      } else if (isSideEffectField && !this.hasSideEffect) {
        this.$set(this.warningResults, fieldName, null);
      }
    },
    updateTime(index) {
      // 更改了表格中的时间后，调用此函数更新 this.warningResults
      // 有个特殊情况要讲一下，每次我们设置了 this.medicine.patientMedicineDetail[index].takeTime 后，
      // el-time-picker 会将其重置为 undefined (我也不知道为什么)
      let time = this.medicine.patientMedicineDetail[index].takeTime;
      if (time === '') {
        // this.warningResults.patientMedicineDetail[index].takeTime = '必填'; // 实际上，这个值并不显示
        this.warningResults.patientMedicineDetail[index].takeTime = null; // 原来要做校验的，现在不做了
      } else {
        this.warningResults.patientMedicineDetail[index].takeTime = null;
      }
    },
    updateDose(index) {
      // 更改了表格中的服用量后，调用此函数更新 this.warningResults
      let dose = this.medicine.patientMedicineDetail[index].takeDose;
      if (!dose) {
        this.warningResults.patientMedicineDetail[index].takeDose = '必填'; // 实际上，这个值并不显示
      } else if (!/^[0-9]+(\.[0-9]{1,5})?$/.test(dose) || Number(dose) === 0) {
        // 检查是否为小数部分至多为5位的正数（整数亦可）
        this.warningResults.patientMedicineDetail[index].takeDose = '应填写正数, 不超过5位小数';
      } else {
        this.warningResults.patientMedicineDetail[index].takeDose = null;
      }
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MEDICINE_MODAL, this.showModal);
    setTimeout(() => {
      // console.log(this.medicineTemplateGroups);
      // console.log(this.medicineDictionary);
    }, 2000);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_MEDICINE_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 110px;
@long-field-name-width: 160px;

@col-id-width: 100px;
@col-time-width: 200px;
@col-amount-width: 150px;
@col-unit-width: 150px;

.medicine-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .medicine-modal {
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
      .field {
        padding: 5px 0;
        text-align: left;
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        text-align: left;
        transform: translateX(10px);  // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 4%;
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: @field-name-width;
          line-height: @field-height;
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
          position: absolute;
          top: 0;
          left: @field-name-width;
          right: 8%;
          line-height: @field-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
          }
          .warning-text {
            position: absolute;
            top: 25px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
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
            transform: translateY(5px);
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
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .form-wrapper {
        position: relative;
        max-height: 170px;
        width: 100%;
        border: 1px solid @inverse-font-color;
        overflow: hidden;
        .form {
          position: relative;
          margin-bottom: 5px;
          width: 100%;
          // left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
          border-spacing: 0;
          .row {
            height: 45px;
            &.first-row {
              background-color: @screen-color;
              height: 30px;
            }
            .col {
              font-size: @normal-font-size;
              text-align: center;
              &.col-id {
                width: @col-id-width;
              }
              &.col-time {
                width: @col-time-width;
              }
              &.col-amount {
                width: @col-amount-width;
              }
              &.col-unit {
                width: @col-unit-width;
              }
              .required-mark {
                color: red;
                font-size: 20px;
                vertical-align: middle;
              }
              .warning-text-wrapper {
                position: relative;
                .warning-text {
                  position: absolute;
                  top: 1px;
                  left: 10px;
                  color: red;
                  font-size: @small-font-size;
                }
              }
              .el-input {
                margin-left: 2%;
                width: 90%;
                .el-input__inner {
                  height: 30px;
                  border: none;
                  background-color: @screen-color;
                  text-align: center;
                }
              }
              .warning .el-input__inner {
                border: 1px solid red;
              }
            }
          }
        }
        .ps__scrollbar-y-rail {
          position: absolute;
          padding: 0;
          top: 0;
          width: 10px !important;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s;
          .ps__scrollbar-y {
            position: relative;
            border-radius: 0 !important;
            background-color: #aaa;
          }
        }
        &:hover {
          .ps__scrollbar-y-rail {
            opacity: 0.6;
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
