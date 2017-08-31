<template lang="html">
  <folding-panel :title="'其它信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="other-info">

      <extensible-panel class="panel" :mode="mode" :title="medHistoryTitle" v-on:addNewCard="addMedRecord">
        <card class="card" :mode="mode" v-for="item in medHistoryList" :key="item.medName"
         :title="item.medName" v-on:editCurrentCard="editMedRecord(item)"
         v-on:deleteCurrentCard="deleteMedRecord(item)">
          <div class="text first-line">一天{{item.medDose}}次</div>
          <div class="text start-time">{{item.medStart}} ~</div>
          <div class="text end-time">{{item.medEnd}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="diseaseHistoryTitle" v-on:addNewCard="addDiseaseRecord">
        <card class="card" :mode="mode" v-for="item in diseaseHistoryList" :key="item.diseaseRelationId"
         :title="transform(item, 'diseaseRelationId', diseaseHistoryDictionary)" v-on:editCurrentCard="editDiseaseRecord(item)"
         v-on:deleteCurrentCard="deleteDiseaseRecord(item)">
          <div class="text first-line">是否住院： {{transform(item, 'isHospitalization', diseaseHistoryDictionary)}}</div>
          <div class="text start-time">{{item.beginTime}} ~</div>
          <div class="text end-time">{{item.endTime}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="familyHistoryTitle" v-on:addNewCard="addFamilyRecord">
        <card class="card" :mode="mode" v-for="item in familyHistoryList" :key="item.patientFamilyId"
         :title="item.diseaseName" v-on:editCurrentCard="editFamilyRecord(item)"
         v-on:deleteCurrentCard="deleteFamilyRecord(item)">
          <div class="text first-line">{{transform(item, 'similarRole', familyHistoryDictionary)}}</div>
          <div class="text start-time">{{transform(item, 'diseaseType', familyHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="personHistoryTitle" v-on:addNewCard="addPersonRecord">
        <card class="card" :mode="mode" v-for="item in coffeeHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', coffeeHistoryDictionary)"
         v-on:editCurrentCard="editPersonRecord(item, COFFEE_MODAL)"
         v-on:deleteCurrentCard="deleteCoffeeRecord(item)">
          <div class="text first-line">{{item.doseInfo}} 杯/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in teaHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', teaHistoryDictionary)"
         v-on:editCurrentCard="editPersonRecord(item, TEA_MODAL)"
         v-on:deleteCurrentCard="deleteTeaRecord(item)">
          <div class="text first-line">{{item.doseInfo}} 杯/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in smokeHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', smokeHistoryDictionary)"
         v-on:editCurrentCard="editPersonRecord(item, SMOKE_MODAL)"
         v-on:deleteCurrentCard="deleteSmokeRecord(item)">
          <div class="text first-line">{{item.doseInfo}} 支/天</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in wineHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', wineHistoryDictionary)"
         v-on:editCurrentCard="editPersonRecord(item, WINE_MODAL)"
         v-on:deleteCurrentCard="deleteWineRecord(item)">
          <div class="text first-line">{{item.doseInfo}} mL/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in exerciseHistoryList" :key="item.patientExerciseId"
         :title="item.exeName" v-on:editCurrentCard="editPersonRecord(item, EXERCISE_MODAL)"
         v-on:deleteCurrentCard="deleteExerciseRecord(item)">
          <div class="text first-line">{{transform(item, 'grade', exerciseHistoryDictionary)}}</div>
          <div class="text second-line">{{transform(item, 'ageStage', exerciseHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="toxicHistoryTitle" v-on:addNewCard="addToxicRecord">
        <card class="card" :mode="mode" v-for="item in processedToxicList" :key="item.expmaterialName"
         :title="item.expmaterialName" v-on:editCurrentCard="editToxicRecord(item)"
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

import { deletePatientMedHistory, deletePatientDisease, deletePatientFamily,
         deletePatientCoffee, deletePatientTea, deletePatientSmoke,
         deletePatientWine, deletePatientExercise, deletePatientToxicExposure
       } from 'api/patient.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

export default {
  props: {
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
      mode: this.READING_MODE
    };
  },
  computed: {
    ...mapGetters([
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
    addMedRecord() {
      // 这里要传递 3 个参数，一个是 title，一个是当前数据对象（新建的时候为空），另一个是模态框的类型
      Bus.$emit(this.SHOW_MODAL_BOX, '新增用药史', {}, this.MEDICINE_MODAL);
    },
    editMedRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, '用药史', item, this.MEDICINE_MODAL);
    },
    deleteMedRecord(item) {
      var patientMed = {
        patientId: this.id,
        patientMedHistoryId: item.patientMedHistoryId,
        version: item.version
      };
      deletePatientMedHistory(patientMed).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    addDiseaseRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增既往史', {}, this.DISEASE_MODAL);
    },
    editDiseaseRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, '既往史', item, this.DISEASE_MODAL);
    },
    deleteDiseaseRecord(item) {
      var patientDisease = {
        patientId: this.id,
        patientDiseaseId: item.patientDiseaseId,
        version: item.version
      };
      deletePatientDisease(patientDisease).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    addFamilyRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增家族史', {}, this.FAMILY_MODAL);
    },
    editFamilyRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, '家族史', item, this.FAMILY_MODAL);
    },
    deleteFamilyRecord(item) {
      var patientFamily = {
        patientId: this.id,
        patientFamilyId: item.patientFamilyId,
        version: item.version
      };
      deletePatientFamily(patientFamily).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    addPersonRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增个人史', {}, this.PERSON_MODAL);
    },
    editPersonRecord(item, modal) {
      // 个人史下面有几个子类（咖啡史，喝茶史，饮酒史，吸烟史，锻炼史），作为第二个参数传进来
      Bus.$emit(this.SHOW_MODAL_BOX, '个人史', item, modal);
    },
    deleteCoffeeRecord(item) {
      var patientCoffee = {
        patientId: this.id,
        patientCoffeeId: item.patientCoffeeId,
        version: item.version
      };
      deletePatientCoffee(patientCoffee).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    deleteTeaRecord(item) {
      var patientTea = {
        patientId: this.id,
        patientTeaId: item.patientTeaId,
        version: item.version
      };
      deletePatientTea(patientTea).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    deleteWineRecord(item) {
      var patientWine = {
        patientId: this.id,
        patientWineId: item.patientWineId,
        version: item.version
      };
      deletePatientWine(patientWine).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    deleteSmokeRecord(item) {
      var patientSmoke = {
        patientId: this.id,
        patientSmokeId: item.patientSmokeId,
        version: item.version
      };
      deletePatientSmoke(patientSmoke).then(() => {
        Bus.$emit(this.UPDATE_PATIENT_INFO);
      });
    },
    deleteExerciseRecord(item) {
      var patientExercise = {
        patientId: this.id,
        patientExerciseId: item.patientExerciseId,
        version: item.version
      };
      deletePatientExercise(patientExercise).then(() => {
        this.item.patientId = parseInt(this.$route.params.id, 10);
      });
    },
    addToxicRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增毒物接触史', {}, this.TOXIC_MODAL);
    },
    editToxicRecord(item) {
      Bus.$emit(this.SHOW_MODAL_BOX, '毒物接触史', item, this.TOXIC_MODAL);
    },
    deleteToxicRecord(item) {
      var patientToxic = {
        patientId: this.id,
        patientCideexposedId: item.patientCideexposedId,
        version: item.version
      };
      deletePatientToxicExposure(patientToxic).then(() => {
        this.item.patientId = parseInt(this.$route.params.id, 10);
      });
    }
  },
  mounted() {
    setTimeout(() => {
      // console.log(this.toxicExposureHistoryList);
      // console.log(this.medHistoryDictionary);
      // console.log(this.typeGroup);
    }, 2000);
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
      width: calc(~"25% - @{card-horizontal-margin} * 2");
      min-width: 200px;
      max-width: 250px;
      .text {
        position: absolute;
        font-size: @small-font-size;
        color: @light-font-color;
      }
      .first-line {
        left: 10px;
        top: 50px;
      }
      .start-time, .second-line {
        left: 10px;
        top: 75px;
      }
      .end-time {
        left: 85px;
        top: 75px;
      }
    }
  }
}
</style>
