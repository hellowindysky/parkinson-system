<template lang="html">
  <folding-panel :title="'其它信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="other-info">

      <extensible-panel class="panel" :mode="mode" :title="medHistoryTitle" v-on:addNewCard="addMedRecord">
        <card class="card" :mode="mode" v-for="item in medHistoryList" :key="item.medName"
         :title="item.medName">
          <div class="text first-line">一天{{item.medDose}}次</div>
          <div class="text start-time">{{item.medStart}} ~</div>
          <div class="text end-time">{{item.medEnd}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="diseaseHistoryTitle" v-on:addNewCard="addDiseaseRecord">
        <card class="card" :mode="mode" v-for="item in diseaseHistoryList" :key="item.surgeryHistory"
         :title="item.surgeryHistory">
          <div class="text first-line">是否住院： {{transform(item, 'isHospitalization', diseaseHistoryDictionary)}}</div>
          <div class="text start-time">{{item.beginTime}} ~</div>
          <div class="text end-time">{{item.endTime}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="familyHistoryTitle" v-on:addNewCard="addFamilyRecord">
        <card class="card" :mode="mode" v-for="item in familyHistoryList" :key="item.patientFamilyId"
         :title="item.diseaseName">
          <div class="text first-line">{{transform(item, 'similarRole', familyHistoryDictionary)}}</div>
          <div class="text start-time">{{transform(item, 'diseaseType', familyHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="personHistoryTitle" v-on:addNewCard="addPersonRecord">
        <card class="card" :mode="mode" v-for="item in coffeeHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', coffeeHistoryDictionary)">
          <div class="text first-line">{{item.doseInfo}} 杯/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in teaHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', teaHistoryDictionary)">
          <div class="text first-line">{{item.doseInfo}} 杯/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in smokeHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', smokeHistoryDictionary)">
          <div class="text first-line">{{item.doseInfo}} 支/天</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in wineHistoryList" :key="item.patientHabitId"
         :title="transform(item, 'patientHabitId', wineHistoryDictionary)">
          <div class="text first-line">{{item.doseInfo}} mL/周</div>
          <div class="text start-time">{{item.startTime}}</div>
        </card>
        <card class="card" :mode="mode" v-for="item in exerciseHistoryList" :key="item.patientExerciseId"
         :title="item.exeName">
          <div class="text first-line">{{transform(item, 'grade', exerciseHistoryDictionary)}}</div>
          <div class="text second-line">{{transform(item, 'ageStage', exerciseHistoryDictionary)}}</div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mode" :title="toxicHistoryTitle" v-on:addNewCard="addToxicRecord">
        <card class="card" :mode="mode" v-for="item in processedToxicList" :key="item.expmaterialName"
         :title="item.expmaterialName">
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
      var matchedField = dictionary.filter((dictionaryField) => {
        return dictionaryField.fieldName === fieldName;
      })[0];
      return matchedField ? matchedField : {};
    },
    getTypes(fieldName, dictionary) {
      // 在 typegroup 里面查找到 fieldName 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(fieldName, dictionary);
      var typeInfo = this.typeGroup.filter((type) => {
        return type.typegroupcode === dictionaryField.fieldEnumId;
      })[0];
      return typeInfo ? typeInfo.types : [];
    },
    transform(item, fieldName, dictionary) {
      // 传递3个参数，最后一个代表需要去查询的字典
      var types = this.getTypes(fieldName, dictionary);
      var result = types.filter((type) => {
        return type.typeCode === item[fieldName];
      })[0];
      return result && result.typeName ? result.typeName : '';
    },
    addMedRecord() {
      // 这里要传递 3 个参数，一个是 title，一个是当前数据对象（新建的时候为空），另一个是模态框的类型
      Bus.$emit(this.SHOW_MODAL_BOX, '新增用药史', {}, this.MEDICINE_MODAL);
    },
    addDiseaseRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增既往史', {}, this.DISEASE_MODAL);
    },
    addFamilyRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增家族史', {}, this.FAMILY_MODAL);
    },
    addPersonRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增个人史', {}, this.PERSON_MODAL);
    },
    addToxicRecord() {
      Bus.$emit(this.SHOW_MODAL_BOX, '新增毒物接触史', {}, this.TOXIC_MODAL);
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
