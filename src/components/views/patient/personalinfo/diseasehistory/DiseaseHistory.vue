<template lang="html">
  <folding-panel :title="'现病史'" :mode="mode" :editable="canEdit">
    <div class="disease-info" ref="diseaseInfo">
      <!-- 现病史开始 -->
      <div class="group"><!-- 起病情况开始 -->
        <h3>起病情况</h3>
        <div class="field">
          <span class="field-name">
            起病类型
            <span class="required-mark" v-show="true">*</span>
          </span>

          <div class="field-value" v-show="true">
            <span v-if="true">
              起病类型值
            </span>
            <span v-else-if="true">
              起病类型值
            </span>
            <span v-else>
              起病类型值
            </span>
          </div>

          <div class="field-input" v-show="true">
            <span v-if="true">
              <el-input v-model="mode"></el-input>
            </span>
            <span v-else-if="getUIType(field)===3">
              
            </span>
            <span v-else-if="getUIType(field)===5">
              
            </span>
            <span v-else-if="getUIType(field)===6">
              
            </span>
            <span class="warning-text"></span>
          </div>
        </div>
        <extensible-panel class="disease-card" :title="'首发症状（x 条记录）'" @addNewCard="addFirstSymptomsRecord">
          <Card class="card symptoms-card" :class="cardWidth" :title="'运动症状'">
            <div class="text first-line">
              <!-- <span class="name">类型</span> -->
              <span class="value">面具脸</span>
            </div>
            <div class="text second-line">
              <!-- <span class="name">编号</span> -->
              <span class="value">咕咕咕咕</span>
            </div>
            <div class="text third-line">
              <!-- <span class="name">日期</span> -->
              <span class="value">哈哈哈哈</span>
            </div>
          </Card>
        </extensible-panel>
      </div><!-- 起病情况结束 -->
      <div class="group"><!-- 就诊情况开始 -->
        <h3>就诊情况</h3>

        <div class="field">
          <span class="field-name">
            初诊方式
          </span>

          <div class="field-value" v-show="true">
            <span v-if="false">
              初诊方式值
            </span>
          </div>

          <div class="field-input" v-show="true">
            <span v-if="true">
              <el-checkbox-group v-model="mode">
                <el-checkbox>SPECT</el-checkbox>
                <el-checkbox>PET</el-checkbox>
                <el-checkbox>医生的临床诊断</el-checkbox>
              </el-checkbox-group>
            </span>
          </div>
        </div>

        <extensible-panel class="disease-card" :title="'初诊治疗（x 条记录）'">
          <Card class="card symptoms-card" :class="cardWidth" :title="'药物治疗'">
            <div class="text first-line">
              <!-- <span class="name">类型</span> -->
              <span class="value">美多芭</span>
            </div>
            <div class="text second-line">
              <!-- <span class="name">编号</span> -->
              <span class="value">250mg/日</span>
            </div>
            <div class="text third-line">
              <!-- <span class="name">日期</span> -->
              <span class="value">2017-05-26</span>
            </div>
          </Card>
        </extensible-panel>

        <extensible-panel class="disease-card" :title="'就诊记录（x 条记录）'">
          <Card class="card symptoms-card" :class="cardWidth" :title="'心脏病'">
            <div class="text first-line">
              <!-- <span class="name">类型</span> -->
              <span class="value">红十字医院</span>
            </div>
            <div class="text second-line">
              <!-- <span class="name">编号</span> -->
              <span class="value">2017-11-11</span>
            </div>
            <div class="text third-line">
              <!-- <span class="name">日期</span> -->
              <span class="value">哈哈哈哈</span>
            </div>
          </Card>
        </extensible-panel>

        <div class="field long-label-field">
          <span class="field-name">
            初次获得疾病信息途径
          </span>

          <div class="field-value" v-show="true">
            <span v-if="false">
              初诊方式值
            </span>
          </div>

          <div class="field-input" v-show="true">
            <span v-if="true">
              <el-checkbox-group v-model="mode">
                <el-checkbox>报纸</el-checkbox>
                <el-checkbox>广播电视</el-checkbox>
                <el-checkbox>社区服务</el-checkbox>
              </el-checkbox-group>
            </span>
          </div>
        </div>

      </div><!-- 就诊情况结束 -->
      <!-- 现病史结束 -->
    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import FoldingPanel from 'components/public/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/public/extensiblepanel/ExtensiblePanel';
import Card from 'components/public/card/Card';

export default {
  data() {
    return {
      mode: this.READING_MODE,
      cardWidth: ''
    };
  },
  computed: {
    ...mapGetters([
      'diseaseInfoDictionaryGroups',
      'diseaseInfoTemplateGroups',
      'typeGroup'
    ]),
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    addFirstSymptomsRecord() {
      Bus.$emit(this.SHOW_FIRSTSYMPTOMS_MODAL, this.ADD_NEW_CARD, {});
    },
    recalculateCardWidth() {
      this.$nextTick(() => {
        var panelWidth = this.$refs.diseaseInfo.clientWidth - 50;
        var cardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (cardNum + 1) > 200 + 20 && cardNum < 10) {
          cardNum += 1.0;
        }
        this.cardWidth = 'width-1-' + parseInt(cardNum, 10);
      });
    }
  },
  components: {
    FoldingPanel,
    ExtensiblePanel,
    Card
  },
  mounted() {
    console.log(this.diseaseInfoTemplateGroups);
    console.log(1111);
    console.log(this.diseaseInfoDictionaryGroups);
    // 第一次加载的时候，去计算一次卡片宽度
    this.recalculateCardWidth();
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
    }
  }
}
</style>
