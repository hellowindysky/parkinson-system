<template lang="html">
  <folding-panel :title="'其它信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit"
    :folded-status="foldedStatus" :editable="canEdit">
    <div class="other-info" ref="otherInfo">

      <extensible-panel class="panel" :mode="mode" :title="presentHistoryTitle" v-on:addNewCard="addPresentRecord" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in presentHistoryList" :key="item.medName"
          :title="item.chiefComplaint" v-on:editCurrentCard="editPresentRecord(item)" v-on:viewCurrentCard="viewPresentRecord(item)"
          v-on:deleteCurrentCard="deletePresentRecord(item)">
          <div class="text first-line">{{item.hospName}}</div>
          <div class="text start-time">{{item.ariseTime}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="medHistoryTitle" v-on:addNewCard="addMedRecord" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in medHistoryList" :key="item.medName"
          :title="item.medName" v-on:editCurrentCard="editMedRecord(item)"
          v-on:viewCurrentCard="viewMedRecord(item)"
          v-on:deleteCurrentCard="deleteMedRecord(item)">
          <div class="text first-line">一天{{item.medDose}}次</div>
          <div class="text start-time">{{item.medStart}}</div>
          <div class="text end-time">
            <span v-show="item.medEnd">~</span>
            {{item.medEnd}}
          </div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="diseaseHistoryTitle" v-on:addNewCard="addDiseaseRecord" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in diseaseHistoryList" :key="item.diseaseRelationId"
          :title="transform(item, 'diseaseRelationId', diseaseHistoryDictionary)" v-on:editCurrentCard="editDiseaseRecord(item)"
          v-on:viewCurrentCard="viewDiseaseRecord(item)" v-on:deleteCurrentCard="deleteDiseaseRecord(item)">
          <div class="text first-line">是否住院： {{transform(item, 'isHospitalization', diseaseHistoryDictionary)}}</div>
          <div class="text start-time">{{item.beginTime}}</div>
          <div class="text end-time">
            <span v-show="item.endTime">~</span>
            {{item.endTime}}
          </div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="familyHistoryTitle" v-on:addNewCard="addFamilyRecord" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in familyHistoryList" :key="item.patientFamilyId"
          :title="item.diseaseName" v-on:editCurrentCard="editFamilyRecord(item)" v-on:viewCurrentCard="viewFamilyRecord(item)"
          v-on:deleteCurrentCard="deleteFamilyRecord(item)">
          <div class="text first-line">{{transform(item, 'similarRole', familyHistoryDictionary)}}</div>
          <div class="text start-time">{{transform(item, 'diseaseType', familyHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="personHistoryTitle" v-on:addNewCard="addPersonRecord" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in coffeeHistoryList" :key="item.patientHabitId"
          :title="transform(item, 'patientHabitId', coffeeHistoryDictionary)"
          v-on:editCurrentCard="editPersonRecord(item, COFFEE_HISTORY_MODAL)"
          v-on:viewCurrentCard="viewPersonRecord(item, COFFEE_HISTORY_MODAL)"
          v-on:deleteCurrentCard="deleteCoffeeRecord(item)">
          <div class="text first-line">{{item.doseInfo}} 杯/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in teaHistoryList" :key="item.patientHabitId"
          :title="transform(item, 'patientHabitId', teaHistoryDictionary)"
          v-on:editCurrentCard="editPersonRecord(item, TEA_HISTORY_MODAL)"
          v-on:viewCurrentCard="viewPersonRecord(item, TEA_HISTORY_MODAL)"
          v-on:deleteCurrentCard="deleteTeaRecord(item)">
          <div class="text first-line">{{item.doseInfo}} 杯/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in smokeHistoryList" :key="item.patientHabitId"
          :title="transform(item, 'patientHabitId', smokeHistoryDictionary)"
          v-on:editCurrentCard="editPersonRecord(item, SMOKE_HISTORY_MODAL)"
          v-on:viewCurrentCard="viewPersonRecord(item, SMOKE_HISTORY_MODAL)"
          v-on:deleteCurrentCard="deleteSmokeRecord(item)">
          <div class="text first-line">{{item.doseInfo}} 支/天</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in wineHistoryList" :key="item.patientHabitId"
          :title="transform(item, 'patientHabitId', wineHistoryDictionary)"
          v-on:editCurrentCard="editPersonRecord(item, WINE_HISTORY_MODAL)"
          v-on:viewCurrentCard="viewPersonRecord(item, WINE_HISTORY_MODAL)"
          v-on:deleteCurrentCard="deleteWineRecord(item)">
          <div class="text first-line">{{item.doseInfo}} mL/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in exerciseHistoryList" :key="item.patientExerciseId"
          :title="item.exeName" v-on:editCurrentCard="editPersonRecord(item, EXERCISE_HISTORY_MODAL)"
          v-on:viewCurrentCard="viewPersonRecord(item, EXERCISE_HISTORY_MODAL)"
          v-on:deleteCurrentCard="deleteExerciseRecord(item)">
          <div class="text first-line">{{transform(item, 'grade', exerciseHistoryDictionary)}}</div>
          <div class="text second-line">{{transform(item, 'ageStage', exerciseHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="toxicHistoryTitle" v-on:addNewCard="addToxicRecord" :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mode" v-for="item in processedToxicList" :key="item.expmaterialName"
          :title="transform(item, 'exposedType', toxicExposureHistoryDictionary)" v-on:editCurrentCard="editToxicRecord(item)"
          v-on:viewCurrentCard="viewToxicRecord(item)"
          v-on:deleteCurrentCard="deleteToxicRecord(item)">
          <div class="text first-line">{{item.exposedFrquency}}</div>
          <div class="text second-line">{{transform(item, 'lifeStage', toxicExposureHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

import { deletePatientPresentHistory, deletePatientMedHistory, deletePatientDisease,
         deletePatientFamily, deletePatientCoffee, deletePatientTea, deletePatientSmoke,
         deletePatientWine, deletePatientExercise, deletePatientToxicExposure
       } from 'api/patient.js';

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

export default {
  props: {
    presentHistoryList: {
      type: Array,
      default: () => []
    },
    medHistoryList: {
      type: Array,
      default: () => []
    },
    diseaseHistoryList: {
      type: Array,
      default: () => []
    },
    familyHistoryList: {
      type: Array,
      default: () => []
    },
    coffeeHistoryList: {
      type: Array,
      default: () => []
    },
    teaHistoryList: {
      type: Array,
      default: () => []
    },
    wineHistoryList: {
      type: Array,
      default: () => []
    },
    smokeHistoryList: {
      type: Array,
      default: () => []
    },
    exerciseHistoryList: {
      type: Array,
      default: () => []
    },
    toxicExposureHistoryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mode: this.READING_MODE,
      foldedStatus: true,
      devideWidth: ''
    };
  },
  computed: {
    ...mapGetters([
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
    id() {
      return parseInt(this.$route.params.id, 10);
    },
    presentHistoryTitle() {
      return '现病史（' + this.presentHistoryList.length + '条记录）';
    },
    medHistoryTitle() {
      return '其它用药史（' + this.medHistoryList.length + '条记录）';
    },
    diseaseHistoryTitle() {
      return '既往史（' + this.diseaseHistoryList.length + '条记录）';
    },
    familyHistoryTitle() {
      return '家族史（' + this.familyHistoryList.length + '条记录）';
    },
    personHistoryTitle() {
      var totalCount = this.coffeeHistoryList.length + this.teaHistoryList.length +
       this.smokeHistoryList.length + this.wineHistoryList.length +
       this.exerciseHistoryList.length;
      return '个人史（' + totalCount + '条记录）';
    },
    toxicHistoryTitle() {
      return '毒物接触史（' + this.processedToxicList.length + '条记录）';
    },
    processedToxicList() {
      if (this.toxicExposureHistoryList.length === 0) {
        return [];
      } else {
        // 得到的数据因为特殊处理过，所以这里需要拉平了才能使用
        var processedList = [];
        this.toxicExposureHistoryList.forEach((item) => {
          processedList = processedList.concat(item.list);
        });
        return processedList;
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
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  methods: {
    startEditing() {
      this.mode = this.EDITING_MODE;
      this.foldedStatus = false;
    },
    cancel() {
      this.mode = this.READING_MODE;
    },
    submit() {
      this.mode = this.READING_MODE;
    },
    getMatchedField(fieldName, dictionary) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, dictionary);
    },
    getTypes(fieldName, dictionary) {
      // 在 typegroup 里面查找到 fieldName 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(fieldName, dictionary);
      var value = dictionaryField.fieldEnumId;
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    transform(item, fieldName, dictionary) {
      // 传递 3 个参数，最后一个代表需要去查询的字典
      var types = this.getTypes(fieldName, dictionary);
      var matchedType = Util.getElement('typeCode', item[fieldName], types);
      return matchedType.typeName ? matchedType.typeName : '';
    },
    addPresentRecord() {
      // 这里要传递 4 个参数，一个是卡片打开方式，一个是 title，一个是当前数据对象（新建的时候为空），另一个是模态框的类型
      Bus.$emit(this.SHOW_MODAL_BOX, this.ADD_NEW_CARD, '新增现病史', {}, this.PRESENT_HISTORY_MODAL);
    },
    viewPresentRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.VIEW_CURRENT_CARD, '现病史', item, this.PRESENT_HISTORY_MODAL);
    },
    editPresentRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.EDIT_CURRENT_CARD, '现病史', item, this.PRESENT_HISTORY_MODAL);
    },
    deletePresentRecord(item) {
      var presentHistory = {
        patientId: this.id,
        patientHistoryId: item.patientHistoryId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientPresentHistory(presentHistory).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addMedRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, this.ADD_NEW_CARD, '新增用药史', {}, this.MEDICINE_HISTORY_MODAL);
    },
    viewMedRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.VIEW_CURRENT_CARD, '用药史', item, this.MEDICINE_HISTORY_MODAL);
    },
    editMedRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.EDIT_CURRENT_CARD, '用药史', item, this.MEDICINE_HISTORY_MODAL);
    },
    deleteMedRecord(item) {
      var patientMed = {
        patientId: this.id,
        patientMedHistoryId: item.patientMedHistoryId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientMedHistory(patientMed).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addDiseaseRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, this.ADD_NEW_CARD, '新增既往史', {}, this.DISEASE_HISTORY_MODAL);
    },
    viewDiseaseRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.VIEW_CURRENT_CARD, '既往史', item, this.DISEASE_HISTORY_MODAL);
    },
    editDiseaseRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.EDIT_CURRENT_CARD, '既往史', item, this.DISEASE_HISTORY_MODAL);
    },
    deleteDiseaseRecord(item) {
      var patientDisease = {
        patientId: this.id,
        patientDiseaseId: item.patientDiseaseId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientDisease(patientDisease).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addFamilyRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, this.ADD_NEW_CARD, '新增家族史', {}, this.FAMILY_HISTORY_MODAL);
    },
    viewFamilyRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.VIEW_CURRENT_CARD, '家族史', item, this.FAMILY_HISTORY_MODAL);
    },
    editFamilyRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.EDIT_CURRENT_CARD, '家族史', item, this.FAMILY_HISTORY_MODAL);
    },
    deleteFamilyRecord(item) {
      var patientFamily = {
        patientId: this.id,
        patientFamilyId: item.patientFamilyId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientFamily(patientFamily).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addPersonRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, this.ADD_NEW_CARD, '新增个人史', {}, this.PERSON_HISTORY_MODAL);
    },
    viewPersonRecord(item, modal) {
      // 个人史下面有几个子类（咖啡史，喝茶史，饮酒史，吸烟史，锻炼史），作为第二个参数传进来
      Bus.$emit(this.SHOW_MODAL_BOX, this.VIEW_CURRENT_CARD, '个人史', item, modal);
    },
    editPersonRecord(item, modal) {
      // 个人史下面有几个子类（咖啡史，喝茶史，饮酒史，吸烟史，锻炼史），作为第二个参数传进来
      Bus.$emit(this.SHOW_MODAL_BOX, this.EDIT_CURRENT_CARD, '个人史', item, modal);
    },
    deleteCoffeeRecord(item) {
      var patientCoffee = {
        patientId: this.id,
        patientCoffeeId: item.patientCoffeeId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientCoffee(patientCoffee).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    deleteTeaRecord(item) {
      var patientTea = {
        patientId: this.id,
        patientTeaId: item.patientTeaId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientTea(patientTea).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    deleteWineRecord(item) {
      var patientWine = {
        patientId: this.id,
        patientWineId: item.patientWineId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientWine(patientWine).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    deleteSmokeRecord(item) {
      var patientSmoke = {
        patientId: this.id,
        patientSmokeId: item.patientSmokeId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientSmoke(patientSmoke).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    deleteExerciseRecord(item) {
      var patientExercise = {
        patientId: this.id,
        patientExerciseId: item.patientExerciseId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientExercise(patientExercise).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addToxicRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, this.ADD_NEW_CARD, '新增毒物接触史', {}, this.TOXIC_HISTORY_MODAL);
    },
    viewToxicRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.VIEW_CURRENT_CARD, '毒物接触史', item, this.TOXIC_HISTORY_MODAL);
    },
    editToxicRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, this.EDIT_CURRENT_CARD, '毒物接触史', item, this.TOXIC_HISTORY_MODAL);
    },
    deleteToxicRecord(item) {
      var patientToxicExposure = {
        patientId: this.id,
        patientCideexposedId: item.patientCideexposedId,
        version: item.version
      };
      Bus.$on(this.CONFIRM, () => {
        deletePatientToxicExposure(patientToxicExposure).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        if (!this.$refs.otherInfo) {
          return;
        }
        var panelWidth = this.$refs.otherInfo.clientWidth;
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
    // 如果收到 [确认对话框] 发过来的 “取消” 事件，则解除 “确认” 事件的回调函数
    Bus.$on(this.GIVE_UP, () => {
      Bus.$off(this.CONFIRM);
    });

    // 如果收到屏幕宽度变化，或者内容区域宽度变化的事件，则重新计算卡片的宽度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();

    Bus.$on(this.EDIT_OTHER_INFO, this.startEditing);

    setTimeout(() => {
      // console.log(this.toxicExposureHistoryList);
      // console.log(this.medHistoryDictionary);
      // console.log(this.typeGroup);
    }, 2000);
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
    Bus.$off(this.EDIT_OTHER_INFO);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.other-info {
  .panel {
    text-align: left;
    .card {
      display: inline-block;
      margin: @card-vertical-margin @card-horizontal-margin;
      // min-width: 200px;
      // max-width: 250px;
      &.width-1-1 {
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .first-line {
        left: 10px;
        right: 10px;
        top: 50px;
      }
      .start-time, .second-line {
        left: 10px;
        top: 75px;
      }
      .end-time {
        left: 75px;
        top: 75px;
      }
    }
  }
}
</style>
