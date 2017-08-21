<template lang="html">
  <folding-panel :title="'其它信息'" :mode="mode" v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit">
    <div class="other-info">
      <extensible-panel class="panel" :mode="mode" :title="'其它用药史'">
        <card class="card" v-for="item in medHistroyList" :key="item.medName" :title="item.medName">
          <div class="text dose">一天{{item.medDose}}次</div>
          <div class="text start-time">{{item.medStart}} ~</div>
          <div class="text end-time">{{item.medEnd}}</div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mode" :title="'既往史'">
        <card class="card" v-for="item in diseaseList" :key="item.surgeryHistory" :title="item.surgeryHistory">
          <div class="text dose">是否住院： {{transform(item, 'isHospitalization')}}</div>
          <div class="text start-time">{{item.beginTime}} ~</div>
          <div class="text end-time">{{item.endTime}}</div>
        </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mode" :title="'个人史'">

      </extensible-panel>
      <extensible-panel class="panel" :mode="mode" :title="'毒物接触史'">

      </extensible-panel>
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
// import Bus from 'utils/bus.js';
import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

import { READING_MODE, EDITING_MODE } from 'utils/constant.js';

export default {
  props: {
    medHistroyList: {
      type: Array,
      default: () => []
    },
    diseaseList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mode: READING_MODE
    };
  },
  computed: {
    ...mapGetters([
      'diseaseHistoryDictionary',
      'typeGroup'
    ])
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  methods: {
    startEditing() {
      this.mode = EDITING_MODE;
    },
    cancel() {
      this.mode = READING_MODE;
    },
    submit() {
      this.mode = READING_MODE;
    },
    getMatchedField(fieldName) {
      // 在字典项中查询该名字所对应的字段，从而方便我们得到该字段的详细信息
      var matchedField = this.diseaseHistoryDictionary.filter((dictionaryField) => {
        return dictionaryField.fieldName === fieldName;
      })[0];
      return matchedField ? matchedField : {};
    },
    getTypes(fieldName) {
      // 在 typegroup 里面查找到 fieldName 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(fieldName);
      var typeInfo = this.typeGroup.filter((type) => {
        return type.typegroupcode === dictionaryField.fieldEnumId;
      })[0];
      return typeInfo ? typeInfo.types : [];
    },
    transform(item, fieldName) {
      var types = this.getTypes(fieldName);
      var result = types.filter((type) => {
        return type.typeCode === item[fieldName];
      })[0];
      return result && result.typeName ? result.typeName : '';
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.diseaseHistoryDictionary);
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
      .dose {
        left: 10px;
        top: 50px;
      }
      .start-time {
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
