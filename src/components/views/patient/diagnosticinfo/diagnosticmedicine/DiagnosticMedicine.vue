<template lang="html">
  <folding-panel :title="'治疗方案'" :archived="archived" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel"
    v-on:submit="submit" :editable="canEdit" :folded-status="foldedStatus" >
    <div class="diagnostic-physiontherapy" ref="diagnosticPhysiontherapy">
      <extensible-panel class="panel" :mode="mutableMode" :title="physiontherapyTitle" v-on:addNewCard="addPhysiontherapy"
        :editable="canEdit">
        <card class="card" :class="devideWidth" :mode="mutableMode" v-for="item in physiontherapyList" :key="item.physiType"
          :title="transform(item, 'physiType', physiontherapyDictionary)" v-on:editCurrentCard="editPhysiontherapy(item,PHYSIONTHERAPY_MODAL)"
          v-on:deleteCurrentCard="deletePhysiontherapy(item)" v-on:viewCurrentCard="viewPhysiontherapy(item,PHYSIONTHERAPY_MODAL)">
          <div class="text first-line">{{transform(item, 'grade', exerciseHistoryDictionary)}}</div>
          <div class="text second-line">{{transform(item, 'ageStage', exerciseHistoryDictionary)}}</div>
         
        </card>
      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deletePhysiontherapy } from 'api/patient.js';

import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

export default {
  data() {
    return {
      mutableMode: this.READING_MODE,
      foldedStatus: true,
      devideWidth: ''
    };
  },
  props: {
    physiontherapyList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    archived: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'physiontherapyDictionary',
      'typeGroup'
      // 'physiontherapyInfo'
    ]),
    id() {
      return parseInt(this.$route.params.id, 10);
    },
    physiontherapyTitle() {
      var totalCount = this.physiontherapyList.length ;
      return '物理治疗（' + totalCount + '条记录）';
    },
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients) && this.archived) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
      this.foldedStatus = false;
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
    },
    getMatchedField(fieldName, dictionary) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      return Util.getElement('fieldName', fieldName, this.dictionary);
    },
    getTypes(fieldName, dictionary) {
      // 在 typegroup 里面查找到 fieldName 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(fieldName, dictionary);
      var value = dictionaryField.fieldEnumId;
      value = fieldName; // TODO 等以后字典项返回 OK 了，就去掉这一行
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    transform(item, fieldName, dictionary) {
      var types = this.getTypes(fieldName, dictionary);
      var matchedType = Util.getElement('typeCode', item[fieldName], types);
      return matchedType.typeName ? matchedType.typeName : '';
    },
    addPhysiontherapy() {
      Bus.$emit(this.SHOW_PHYSIONTHERAPY_MODAL, this.ADD_NEW_CARD, '新增物理治疗', {}, this.PERSON_HISTORY_MODAL);
    },
    viewPhysiontherapy(item, modal) {
      Bus.$emit(this.SHOW_PHYSIONTHERAPY_MODAL, this.VIEW_CURRENT_CARD, '物理治疗', item, modal);
    },
    editPhysiontherapy(item, modal) {
      Bus.$emit(this.SHOW_PHYSIONTHERAPY_MODAL, this.EDIT_CURRENT_CARD, '物理治疗', item, modal);
    },
    deletePhysiontherapy(item) {
      var patientPhysiontherapy = {
        physiType: parseInt(this.$route.params.id, 1),
        patientCaseId: this.$route.params.patientCaseId,
        patientId: item.patientId
      };
      Bus.$on(this.CONFIRM, () => {
        deletePhysiontherapy(patientPhysiontherapy).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    _resolveDeletion() {
      // 如果成功删除记录，则重新发出请求，获取最新数据。同时解除 [确认对话框] 的 “确认” 回调函数
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$off(this.CONFIRM);
    },
    _rejectDeletion() {
      // 即使删除不成功，也要解除 [确认对话框] 的 “确认” 回调函数
      Bus.$off(this.CONFIRM);
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
.diagnostic-medicine {
  position: relative;
  .panel {
    text-align: left;
    .card {
      display: inline-block;
      margin: @card-vertical-margin @card-horizontal-margin;
      &.width-1-1, &.width-1-0 {
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
