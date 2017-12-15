<template lang="html">
  <folding-panel :title="'现病史'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit"
    :folded-status="foldedStatus" :editable="canEdit">
    <!-- 现病史开始 ↓-->
    <div class="disease-info" ref="diseaseInfo">
      
      <!-- 起病情况开始 ↓-->
      <div class="group">
        
        <h3>起病情况</h3>
        <!-- template 第一部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[0]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <!-- <span class="required-mark" v-show="true">*</span> -->
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="true">
              起病类型值
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===1">
              <el-input v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc"></el-input>
            </span>
            <span v-else-if="getUIType(field)===3">
              <el-select v-model="copyInfo[field.fieldName]" clearable
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-option v-for="type in getTypes(field.fieldName)" :label="type.typeName"
                  :value="type.typeCode" :key="type.typeCode"></el-option>
              </el-select>
            </span>
            <span v-else-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <span v-else-if="getUIType(field)===6">
              <el-date-picker v-model="copyInfo[field.fieldName]" type="date"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc" format="yyyy-MM-dd" ></el-date-picker>
            </span>
            <!-- <span class="warning-text"></span> -->
          </div>
        </div>
        <!-- template 第一部分 ↑↑↑↑ -->

        <!-- 发病顺序 ↓ ↓ ↓ -->
        <div class="field custom-field">
          <span class="field-name">发病顺序</span>
          <div class="field-value" v-show="mode===READING_MODE">

            <div class="custom-item" v-for="(item,index) in diseaseOrder" :key="index">
              <span>{{transform(item.arisePart, diseaseOrderOpt)}}</span>
              <span>{{formatDate(item.time)}}</span>
              <i class="iconfont icon-single-right" v-show="item.arisePart"></i>
            </div>

          </div>
          <div class="field-input" v-show="mode===EDITING_MODE">

            <div class="custom-item" v-for="(item,index) in diseaseOrder" :key="index">
              <i class="iconfont icon-remove" @click="reduceOrder(index)"></i>
              <span class="sub-item">
                <el-select v-model="item.arisePart" placeholder="请选择" clearable >
                  <el-option
                   v-for="item in diseaseOrderOpt" :key="item.typeCode" 
                   :label="item.typeName"
                   :value="item.typeCode">
                  </el-option>
                </el-select>
              </span>
              <span class="sub-item">
                <el-date-picker v-model="item.time" type="date" placeholder="选择发生日期" clearable ></el-date-picker>
              </span>
            </div>

            <i class="iconfont icon-plus"  @click="addOrder"></i>

          </div>
        </div>
        <!-- 发病顺序 ↑ ↑ ↑-->

        <!-- template 第二部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[1]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <!-- <span class="required-mark" v-show="true">*</span> -->
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="true">
              起病类型值
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===1">
              <el-input v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc"></el-input>
            </span>
            <span v-else-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <!-- <span class="warning-text"></span> -->
          </div>
        </div>
        <!-- template 第二部分 ↑↑↑ -->

        <extensible-panel class="disease-card" :title="firstSymTitle" @addNewCard="addFirstSymptomsRecord">
          <Card class="card symptoms-card" :mode="mode" :class="cardWidth"
           v-for="item in diseaseInfo.patientFirstSymbols" :key="item.id" :title="item.symType"
           v-on:editCurrentCard="editFirstSymptomsRecord(item)" 
           v-on:viewCurrentCard="viewFirstSymptomsRecord(item)"
           v-on:deleteCurrentCard="deleteFirstSymptomsRecord(item)">
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
          </Card>
        </extensible-panel>

      </div>
      <!-- 起病情况结束 ↑-->

      <!-- 就诊情况开始 ↓-->
      <div class="group">
        <h3>就诊情况</h3>

        <!-- template 第三部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[2]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <!-- <span class="required-mark" v-show="true">*</span> -->
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="true">
              起病类型值
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <!-- <span class="warning-text"></span> -->
          </div>
        </div>
        <!-- template 第三部分 ↑↑↑ -->

        <extensible-panel class="disease-card" :title="firstTreatmentsTitle" @addNewCard="addFirstTreatmentRecord">
          <Card class="card symptoms-card" :mode="mode" :class="cardWidth"
           v-for="item in diseaseInfo.patientFirstVisitTreatments" :key="item.id" :title="transform(item.firstVisitType, allFirstVisitType)"
           v-on:editCurrentCard="editFirstTreatmentRecord(item)" 
           v-on:viewCurrentCard="viewFirstTreatmentRecord(item)"
           v-on:deleteCurrentCard="deleteFirstTreatmentRecord(item)">
            <div class="text first-line">
              <span class="name">{{item.firstVisitType ===1?'药物名称':item.firstVisitType ===2?'治疗类型':''}}</span>
              <span class="value">{{item.firstVisitType ===1 ? transform(item.medicineName, getMedNameOptions(item.medicineClassification)) : item.firstVisitType ===2 ? transform(item.treatmentType,treatmentTypeOpt): ''}}</span>
            </div>
            <div class="text second-line">
              <span class="name">{{item.firstVisitType ===1 ? '每日用量' : item.firstVisitType ===2 ? '治疗手段': ''}}</span>
              <span class="value">{{item.firstVisitType ===1 ? item.dailyDosage+'mg/日' : item.firstVisitType ===2 ? transform(item.treatmentMethod, getTreatment(item.treatmentType)): ''}}</span>
            </div>
            <div class="text third-line">
              <span class="name">{{item.firstVisitType ===1 ? '初次用药时间' : item.firstVisitType ===2 ? '治疗时间': ''}}</span>
              <span class="value">{{item.firstVisitType ===1 ? item.firstTime : item.firstVisitType ===2 ? item.treatmentTime: ''}}</span>
            </div>
          </Card>
        </extensible-panel>

        <extensible-panel class="disease-card" :title="visitRecordTitle" @addNewCard="addVisitRecord">
          <Card class="card symptoms-card" :mode="mode" :class="cardWidth"
           v-for="item in diseaseInfo.patientHistorys" :key="item.patientHistoryId" :title="item.diagnosis"
           v-on:editCurrentCard="editVisitRecord(item)" 
           v-on:viewCurrentCard="viewVisitRecord(item)"
           v-on:deleteCurrentCard="deleteVisitRecord(item)">
            <div class="text first-line">
              <span class="name">医院名称：</span>
              <span class="value">{{item.hospName}}</span>
            </div>
            <div class="text second-line">
              <span class="name">就诊时间：</span>
              <span class="value">{{item.ariseTime}}</span>
            </div>
            <div class="text third-line">
              <!-- <span class="name">日期</span> -->
              <span class="value"></span>
            </div>
          </Card>
        </extensible-panel>

        <!-- template 第四部分 ↓↓↓↓ -->
        <div class="field" v-for="field in diseaseInfoTemplateGroups[3]" :class="checkField(field)">
          <span class="field-name">
            {{field.cnfieldName}}
            <!-- <span class="required-mark" v-show="true">*</span> -->
          </span>

          <div class="field-value" v-show="mode===READING_MODE">
            <span v-if="true">
              起病类型值
            </span>
          </div>

          <div class="field-input" v-show="mode===EDITING_MODE">
            <span v-if="getUIType(field)===5">
              <el-checkbox-group v-model="copyInfo[field.fieldName]" @change="testchange(copyInfo[field.fieldName])"
                :placeholder="getMatchedField(field.fieldName).cnFieldDesc">
                <el-checkbox v-for="type in getTypes(field.fieldName)" :label="type.typeCode"
                 :key="type.typeCode">{{type.typeName}}</el-checkbox>
              </el-checkbox-group>
            </span>
            <!-- <span class="warning-text"></span> -->
          </div>
        </div>
        <!-- template 第四部分 ↑↑↑ -->

      </div>
      <!-- 就诊情况结束 ↑-->
    </div>
    <!-- 现病史结束 ↑-->
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Bus from 'utils/bus.js';
// import { reviseDateFormat, pruneObj } from 'utils/helper.js';
import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';
import { deletePatientFirstSymbol, delPatientFirstVisitTreatment, delVisitDignosticRecord } from 'api/patient.js';

const HALF_LINE_FIELD_LIST = ['diseaseType', 'specificDisease', 'ariTime', 'courseOfDisease', 'firTime', 'surTime', 'firMedinfo',
  'firMedtime', 'ariAge', 'symmetries', 'symmetriesTime', 'firHosp', 'surHosp'];

export default {
  data() {
    return {
      test1: '',
      test2: '',
      copyInfo: {},
      diseaseOrder: [ // 发病顺序
        {
          arisePart: '',
          time: ''
        }
      ],
      mode: this.READING_MODE,
      foldedStatus: true,
      warningResults: {},
      cardWidth: ''
    };
  },
  props: {
    diseaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters([
      'diseaseInfoDictionaryGroups',
      'diseaseInfoTemplateGroups',
      'typeGroup',
      'medicineInfo'
    ]),
    diseaseInfoDictionary() {
      // 对 diseaseInfoDictionaryGroups 进行扁平化处理，方便之后操作
      var flattenedGroup = [];
      for (let group of this.diseaseInfoDictionaryGroups) {
        flattenedGroup = flattenedGroup.concat(group);
      }
      return flattenedGroup;
    },
    firstSymTitle() {
      return '首发症状（' + (this.diseaseInfo.patientFirstSymbols ? this.diseaseInfo.patientFirstSymbols : []).length + '条记录）';
    },
    firstTreatmentsTitle() {
      return '初诊治疗（' + (this.diseaseInfo.patientFirstVisitTreatments ? this.diseaseInfo.patientFirstVisitTreatments : []).length + '条记录）';
    },
    visitRecordTitle() {
      return '就诊记录（' + (this.diseaseInfo.patientHistorys ? this.diseaseInfo.patientHistorys : []).length + '条记录）';
    },
    allFirstVisitType() {
      // 初诊治疗类型的集合
      return this.getTypeGroupitem('firstVisitType');
    },
    treatmentTypeOpt() {
      // 非药物治疗治疗类型的集合
      return this.getTypeGroupitem('treatPro');
    },
    diseaseOrderOpt() {
      // 发病顺序集合
      return this.getTypeGroupitem('firBody');
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
    testchange(ff) {
      console.log(ff);
    },
    startEditing() {
      this.mode = this.EDITING_MODE;
      this.foldedStatus = false;
      this.clearWarning();
    },
    getTypeGroupitem(fieldName) {
      let opt = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      return (opt ? opt : []);
    },
    getMedNameOptions(fieldType) {
      return this.medicineInfo.filter((obj) => {
        return obj.firstTreatMedicalType === fieldType;
      }).map((obj) => {
        return {
          typeCode: obj.medicineId,
          typeName: obj.medicineName
        };
      });
    },
    getTreatment(fieldType) {
      return this.treatmentTypeOpt.filter((obj) => {
        return obj.typeCode === fieldType;
      }).map((obj) => {
        return obj.childType;
      })[0];
    },
    transform(id, arr) {
      return arr.filter((obj) => {
        return parseInt(obj.typeCode, 10) === id;
      }).map((obj) => {
        return obj.typeName;
      })[0];
    },
    addOrder() {
      this.diseaseOrder.push({
        arisePart: '',
        time: ''
      });
    },
    formatDate(d) {
      if (d) {
        return '（' + Util.simplifyDate(d) + '）';
      } else {
        return '';
      }
    },
    reduceOrder(idx) {
      this.diseaseOrder.splice(idx, 1);
    },
    getMatchedField(fieldName) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', fieldName, this.diseaseInfoDictionary);
    },
    checkField(field) {
      // 用来检测当前 field 的特殊样式
      var dictionaryField = this.getMatchedField(field.fieldName);
      var name = dictionaryField.fieldName;
      var classNameList = [];

      // 判断该字段是否是半行
      if (HALF_LINE_FIELD_LIST.indexOf(name) > -1) {
        classNameList.push('half-line');
      }
      // 判断该字段的名字是否比较长
      if (field.cnfieldName.length > 6) {
        classNameList.push('long-label-field');
      }
      // 判断该字段是否是多选框
      if (this.getUIType(field) === 5) {
        classNameList.push('multiple-select');
      }
      return classNameList.join(' ');
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field.fieldName).uiType;
    },
    getTypes(fieldName) {
      if (fieldName === 'specificDisease') {
        let types = this.getTypes('diseaseType');
        let targetTypeList = types.filter((type) => {
          return type.typeCode === Number(this.copyInfo.diseaseType);
        });
        return targetTypeList.length > 0 ? targetTypeList[0].childType : [];

      } else {
        // 在 typegroup 里面查找到 field 所对应的 types（选项组）
        var dictionaryField = this.getMatchedField(fieldName);
        var value = dictionaryField.fieldEnumId;
        var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
        return typeInfo.types ? typeInfo.types : [];
      }

    },
    cancel() {
      // 点击取消按钮，将我们对 copyInfo 所做的临时修改全部放弃，还原其为 diseaseInfo 的复制对象，同时不要忘了重新对其进行特殊处理
      this.shallowCopy(this.diseaseInfo);
      this.changeCopyInfo();
      this.mode = this.READING_MODE;
    },
    shallowCopy(obj) {
      // 进行浅复制之后，修改复制对象的属性，不会影响到原始对象
      // 下面这行有一个特殊作用，能让 Vue 动态检测已有对象的新添加的属性，参看 https://cn.vuejs.org/v2/guide/reactivity.html
      this.copyInfo = Object.assign({}, obj);
    },
    changeCopyInfo() {
      // 复制得到的 copyInfo 有几个字段的值需要特殊处理一下
      // uiType 为 5 (多选框)的字段，形如 “1，3，4” 要转化为 [1, 3, 4]
      // 我们先将 CopyInfo 所有属性的名字放到一个数组里，然后遍历 diseaseInfoDictionary 下的所有 field
      // 看 哪些 field 的 fieldName 在这个数组里，同时该 field 的 uiType 为 5，这时就把 copyInfo 的相应字段进行转换
      var nameList = [];
      for (let fieldName in this.copyInfo) {
        nameList.push(fieldName);
      }
      for (let field of this.diseaseInfoDictionary) {
        let name = field.fieldName;
        if (nameList.indexOf(name) > -1 && field.uiType === 5 && (typeof this.copyInfo[name]) === 'string') {
          var codesArray = this.copyInfo[name].split(',').map((str) => {
            return parseInt(str, 10);
          });
          this.copyInfo[name] = codesArray;
        } else if (field.uiType === 5) {
          // 这种情况指的是，得到的信息没有相应的字段，那么我们就为它建一个空数组，注意为了让 Vue 动态检测，这里采用 set 方法
          this.$set(this.copyInfo, name, []);
        }
      }
    },
    submit() {
      console.log(this.copyInfo);
      if ('请求成功后') {
        this.mode = this.READING_MODE;
      }
    },
    addFirstSymptomsRecord() {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.ADD_NEW_CARD, {}, '首发症状');
    },
    editFirstSymptomsRecord(item) {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.EDIT_CURRENT_CARD, item, '首发症状');
    },
    viewFirstSymptomsRecord(item) {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.VIEW_CURRENT_CARD, item, '首发症状');
    },
    deleteFirstSymptomsRecord(item) {
      var firSymId = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientFirstSymbol(firSymId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addFirstTreatmentRecord() {
      Bus.$emit(this.SHOW_FIRSTTREATMENT_MODAL, this.ADD_NEW_CARD, {});
    },
    editFirstTreatmentRecord(item) {
      Bus.$emit(this.SHOW_FIRSTTREATMENT_MODAL, this.EDIT_CURRENT_CARD, item);
    },
    viewFirstTreatmentRecord(item) {
      Bus.$emit(this.SHOW_FIRSTTREATMENT_MODAL, this.VIEW_CURRENT_CARD, item);
    },
    deleteFirstTreatmentRecord(item) {
      var firTreatmentId = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        delPatientFirstVisitTreatment(firTreatmentId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addVisitRecord() {
      Bus.$emit(this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.ADD_NEW_CARD, {});
    },
    editVisitRecord(item) {
      Bus.$emit(this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.EDIT_CURRENT_CARD, item);
    },
    viewVisitRecord(item) {
      Bus.$emit(this.SHOW_DIAGNOSTIC_RECORD_MODAL, this.VIEW_CURRENT_CARD, item);
    },
    deleteVisitRecord(item) {
      var patientHistory = {
        patientHistoryId: item.patientHistoryId
      };
      Bus.$on(this.CONFIRM, () => {
        delVisitDignosticRecord(patientHistory).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        if (!this.$refs.diseaseInfo) {
          return;
        }
        var panelWidth = this.$refs.diseaseInfo.clientWidth;
        var devideNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度
        while (panelWidth / devideNum > 200 + 20) {
          devideNum += 1.0;
        }
        devideNum -= 1;
        // 一排最多显示 10 个卡片
        devideNum = devideNum <= 10 ? devideNum : 10;
        this.cardWidth = 'width-1-' + parseInt(devideNum, 10);
      });
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    this.changeCopyInfo();
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();
    console.log(this.diseaseInfoTemplateGroups);
    console.log(this.diseaseInfoDictionary);
    console.log(this.typeGroup);
    // console.log(this.copyInfo);
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 50px;
@field-name-width: 100px;
@long-field-name-width: 160px;

@disease-card-height: 130px;
// @field-item-width: 150px;
// @field-height: 45px;

.disease-info {
  padding: 0 25px 20px;
  .group {
    padding: 0;
    text-align: left;
    >h3{
      font-size:@large-font-size;
    }
    .disease-card{
      >.header{
        padding-left:0;
        >.title{
          padding-left: 0;
        }
        .button{
          &.add-button {
            right: 20px + @small-button-width;
          }
          &.extend-button{
            right:0;
          }
          &.shrink-button {
            right: 0;
          }
        }
      }
      >.content{
        margin-left:0;
        margin-right:0;
        height: @disease-card-height + @card-vertical-margin * 2 + 5px * 2;
      }
      .card {
        display: inline-block;
        position: relative;
        margin: @card-vertical-margin @card-horizontal-margin; // min-width: 200px;
        // max-width: 250px;
        &.symptoms-card{
          height: @disease-card-height;
        }
        &.width-1-1,
        &.width-1-0 {
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
          left: 10px;
          right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .name {
            color: @font-color;
          }
          .value {
            padding-left: 10px;
            color: @light-font-color;
          }
        }
        .first-line {
          top: 50px;
        }
        .second-line {
          top: 75px;
        }
        .third-line {
          top: 100px;
        }
        .line-1 {
          top: 10px;
        }
        .line-2 {
          top: 35px;
        }
        .line-3 {
          top: 60px;
        }
        .line-4 {
          top: 85px;
        }
        .line-5 {
          top: 110px;
        }
        .line-6 {
          top: 135px;
        }
        .line-7 {
          top: 160px;
        }
      }
    }
    .field {
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      text-align: left;
      &.half-line {
        width: 50%;
        .field-input {
          right: 4%;
        }
      }
      &.long-label-field {
        .field-name {
          width: @long-field-name-width;
        }
        .field-value {
          left: @long-field-name-width;
        }
        .field-input {
          left: @long-field-name-width;
        }
      }
      &.multiple-select {
        transform: translateY(@field-height * 0.4);
        height: auto;
        min-height: @field-height * 1.0;
        .field-name {
          line-height: @field-height * 0.3;
        }
        .field-value {
          line-height: @field-height * 0.3;
        }
        .field-input {
          position: relative;
          padding-bottom: 10px;
          width: calc(~"100% - @{field-name-width}");
          line-height: @field-height * 0.3;
          .warning-text {
            position: relative;
            top: -8px;
            left: 0;
            height: 15px;
            line-height: 15px;
            color: red;
            font-size: @small-font-size;
          }
        }
        &.long-label-field {
          .field-input {
            width: calc(~"100% - @{long-field-name-width}");
          }
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
        .required-mark {
          color: red;
          font-size: 20px;
          vertical-align: middle;
        }
      }
      .field-value {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
      }
      .field-input {
        display: inline-block;
        position: absolute;
        top: 0;
        left: @field-name-width;
        right: 0;
        font-size: @normal-font-size;
        line-height: @field-height;
        overflow: visible;
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
        .el-select {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
        }
        .el-checkbox-group {
          .el-checkbox {
            margin-left: 0;
            margin-right: 15px;
          }
          .el-checkbox__input {
            line-height: 18px;
          }
        }
        .warning .el-input__inner {
          border: 1px solid red;
        }
      }
      &.custom-field{
        height:auto;
        min-height:30px;
        margin-top:10px;
        margin-bottom:3px;
        .field-name{
          line-height:30px;
        }
        .field-value{
          line-height:30px;
          position: relative;
          .custom-item{
            display:inline-block;
            i{
              font-size:14px;
            }
          }
        }
        .field-input{
          position: relative;
          line-height:30px;
          .custom-item{
            display:inline-block;
            width:300px;
            margin-right:10px;
            margin-bottom:6px;
            >i{
              color:#d20000f5;
            }
            .sub-item{
              display:inline-block;
              width:45%;
            }
          }
          i{
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
