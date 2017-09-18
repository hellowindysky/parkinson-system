<template lang="html">
  <folding-panel :title="title" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="diagnostic-medicine" ref="diagnosticMedicine">
      <extensible-panel class="panel" :mode="mutableMode" :title="subTitle" v-on:addNewCard="addMedicine">
        <card class="card" :class="devideWidth" :mode="mutableMode" v-for="item in medicineList" :key="item.medicineId"
         :title="getTitle(item.medicineId)" v-on:clickCurrentCard="editMedicine(item)"
         v-on:deleteCurrentCard="deleteMedicine(item)">
          <div class="text first-line">{{transform(item, 'usages')}}</div>
          <div class="text second-line">{{item.ariseTime}}</div>
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      title: '药物方案',
      devideWidth: '',
      medicineList: [
        {
          'ariseTime': '2017-09-13',
          'totalMeasure': 800,
          'usages': 4,
          'medicineId': 11,
          'patientCaseId': '8a9e2d385e4b7bd6015e7adaf191025c',
          'patientId': 122,
          'medicalSpecUsed': '200.0mg/片',
          'medicineSpecId': 12,
          'remarks': '测试用药',
          'patientMedicineId': 160,
          'levodopaDose': 264,
          'levodopaFactorUsed': 66,
          'patientMedicineDetail': [
            {
              'id': 236,
              'computUnit': 1,
              'takeDose': '1',
              'takeTime': '17:00',
              'patientMedicineId': 160
            },
            {
              'id': 237,
              'computUnit': 1,
              'takeDose': '1',
              'takeTime': '17:30',
              'patientMedicineId': 160
            },
            {
              'id': 238,
              'computUnit': 1,
              'takeDose': '1',
              'takeTime': '18:00',
              'patientMedicineId': 160
            },
            {
              'id': 239,
              'computUnit': 1,
              'takeDose': '1',
              'takeTime': '18:30',
              'patientMedicineId': 160
            }
          ]
        },
        {
          'ariseTime': '2017-09-11',
          'totalMeasure': 250,
          'usages': 2,
          'medicineId': 4,
          'patientCaseId': '8a9e2d385e4b7bd6015e6ff4325e01a0',
          'patientId': 32,
          'medicalSpecUsed': '50.0mg/片',
          'remarks': 'asda承集合和',
          'patientMedicineId': 156,
          'levodopaDose': 250,
          'levodopaFactorUsed': 50
        },
        {
          'ariseTime': '2017-09-11',
          'totalMeasure': 0.5,
          'usages': 1,
          'medicineId': 6,
          'patientCaseId': '8a9e2d385e4b7bd6015e6ff4325e01a0',
          'patientId': 32,
          'medicalSpecUsed': '0.25mg/片',
          'remarks': '',
          'patientMedicineId': 157,
          'levodopaDose': 50,
          'levodopaFactorUsed': 25
        }
      ]
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    }
  },
  computed: {
    ...mapGetters([
      'medicineDictionary',
      'typeGroup',
      'medicineInfo'
    ]),
    subTitle() {
      var count = this.medicineList.length;
      return this.title + '（' + count + '条记录）';
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.medicineDictionary);
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
      var matchedType = Util.getElement('typeCode', item[fieldName], types);
      return matchedType.typeName ? matchedType.typeName : '';
    },
    getMedicine(medicineId) {
      // 根据药物 id，在相应的 tableData 里面寻找对应的 药物详情
      return Util.getElement('medicineId', medicineId, this.medicineInfo);
    },
    getTitle(medicineId) {
      var medicine = this.getMedicine(medicineId);
      return medicine.medicineName + '(' + medicine.commonName + ')';
    },
    addMedicine() {
      Bus.$emit(this.SHOW_MEDICINE_MODAL, '新增药物方案', {});
    },
    editMedicine(item) {
      Bus.$emit(this.SHOW_MEDICINE_MODAL, '药物方案', item);
    },
    deleteMedicine() {

    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diagnosticMedicine.clientWidth;
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
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    this.recalculateCardWidth();

    Bus.$on(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$on(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$on(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.diagnostic-medicine {
  position: relative;
  .panel {
    text-align: left;
    .card {
      display: inline-block;
      margin: @card-vertical-margin @card-horizontal-margin;
      &.width-1-, &.width-1-0 {
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
    }
  }
}
</style>
