<template lang="html">
  <folding-panel :title="'检验检查'" :mode="mutableMode"  v-on:edit="startEditing" v-on:cancel="cancel" v-on:submit="submit" :editable="canEdit">
    <div class="diagnostic-examination" ref="diagnosticExamination">
      <extensible-panel class="panel" :mode="mutableMode" :title="vitalSigns" :isVitalSigns="true" :editable="canEdit">
        <ul class="vitalsigns">
          <li class="vital-item">
            <span class="vital-name">呼吸(次/分):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.breathing}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.breathing" placeholder="请输入检查结果"></el-input>
          </li>
          <li class="vital-item">
            <span class="vital-name">体温(℃):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.temperature}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.temperature" placeholder="请输入检查结果"></el-input>
          </li>
          <li class="vital-item">
            <span class="vital-name">脉搏(次/分):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.pulse}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.pulse" placeholder="请输入检查结果"></el-input>
          </li>
          <li class="vital-item">
            <span class="vital-name">心率(次/分):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.heartRate}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.heartRate" placeholder="请输入检查结果"></el-input>
          </li>
          <li class="vital-item">
            <span class="vital-name">心率情况:</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{showVital(VitalSignsData.rhythm)}}</div>
            <el-select class="vital-select" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.rhythm" placeholder="请选择">
              <el-option v-for="item in heartRate" :key="item.typeCode" :label="item.typeName" :value="item.typeCode">
              </el-option>
            </el-select>
          </li>
          <li class="vital-item">
            <span class="vital-name">血压 :卧位-左/右(mmHg):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.bpDecubitus}}</div>
            <div class="vital-two-vlaue" v-else-if="mutableMode===EDITING_MODE">
              <el-input class="son-vlaue" v-model="vitalData.bpDecubitusL"></el-input>/&nbsp;
              <el-input class="son-vlaue" v-model="vitalData.bpDecubitusR"></el-input>
            </div>
          </li>
          <li class="vital-item">
            <span class="vital-name">血压 :坐位-左/右(mmHg):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.bpSitting}}</div>
            <div class="vital-two-vlaue" v-else-if="mutableMode===EDITING_MODE">
              <el-input class="son-vlaue" v-model="vitalData.bpSittingL"></el-input>/&nbsp;
              <el-input class="son-vlaue" v-model="vitalData.bpSittingR"></el-input>
            </div>
          </li>
          <li class="vital-item">
            <span class="vital-name">血压 :立位-左/右(mmHg):</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.bpOrthostatic}}</div>
            <div class="vital-two-vlaue" v-else-if="mutableMode===EDITING_MODE">
              <el-input class="son-vlaue" v-model="vitalData.bpOrthostaticL"></el-input>/&nbsp;
              <el-input class="son-vlaue" v-model="vitalData.bpOrthostaticR"></el-input>
            </div>
          </li>
          <li class="vital-item">
            <span class="vital-name">智能障碍-MMSE:</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.doiMmse}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.doiMmse" placeholder="请输入检查结果"></el-input>
          </li>
          <li class="vital-item">
            <span class="vital-name">智能障碍-MoCA:</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.doiMoca}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.doiMoca" placeholder="请输入检查结果"></el-input>
          </li>
          <li class="vital-item">
            <span class="vital-name">智能障碍-CDR:</span>
            <div class="vital-vlaue" v-if="mutableMode===READING_MODE">{{VitalSignsData.doiCdr}}</div>
            <el-input class="vital-vlaue" v-else-if="mutableMode===EDITING_MODE" v-model="vitalData.doiCdr" placeholder="请输入检查结果"></el-input>
          </li>
        </ul>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="neurologicCheckTitle" v-on:addNewCard="addNeurologicCheckRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in neurologicCheckList" :key="item.preopsInfoId"
         :title="transformNeurologicCheckType(item.spephysicalInfo)" v-on:editCurrentCard="editNeurologicCheckRecord(item)"
         v-on:deleteCurrentCard="deleteNeurologicCheckRecord(item)">
          <div class="text first-line">
            <span class="name">诊断结果: </span>
            <span class="value">{{item.spephysicalResult}}</span>
          </div>
          <div class="text second-line">
            {{item.ariseTime}}
          </div>
         </card>
      </extensible-panel>
      <extensible-panel class="panel" :mode="mutableMode" :title="biochemicalExamTitle" v-on:addNewCard="addBiochemicalExamRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in biochemicalExamList" :key="item.patientCaseId"
         :title="transformBiochemicalExamType(item.bioexamId)" v-on:editCurrentCard="editBiochemicalExamRecord(item)"
         v-on:deleteCurrentCard="deleteBiochemicalExamRecord(item)">
          <div class="text first-line">
            <span class="name"></span>
            <span class="value"></span>
          </div>
          <div class="text second-line">
            <span class="name"></span>
            <span class="value"></span>
          </div>
        </card>
      </extensible-panel>

      <extensible-panel class="panel" :mode="mutableMode" :title="emgTitle" v-on:addNewCard="addEmgRecord" :editable="canEdit">
        <card class="card" :class="cardWidth" :mode="mutableMode" v-for="item in emgList" :key="item.patientCaseId"
         :title="item.etgName" v-on:editCurrentCard="editEmgRecord(item)"
         v-on:deleteCurrentCard="deleteEmgRecord(item)">
          <div class="text first-line">
            <span class="name">类型</span>
            <span class="value">{{transformEmgType(item.etgType)}}</span>
          </div>
          <div class="text second-line">
            <span class="name">结果</span>
            <span class="value">{{item.patEleResule}}</span>
          </div>
        </card>
      </extensible-panel>
<!-- 医学影像 -->
      <extensible-panel class="panel image-panel" :mode="mutableMode" :title="medicalImagingTitle" v-on:addNewCard="addEmgRecord" :editable="canEdit">
        <card class="card image-card" :class="cardWidth" :mode="mutableMode" v-for="(item,idx) in medicalImagingList" :key="idx"
         :title="item.name" v-on:editCurrentCard="editEmgRecord(item)"
         v-on:deleteCurrentCard="deleteEmgRecord(item)">
          <div class="text first-line">
            <span class="name">{{item.time}}</span>
            <!-- <span class="value">{{transformEmgType(item.etgType)}}</span> -->
            <!-- <span class="value">{{item.time}}</span> -->
          </div>
          <div class="text second-line">
            <span class="name">{{transformMedicalImagingType(item.patientImageReq.imageType)}}</span>
            <!-- <span class="value">{{item.patientImageReq.imageType}}</span> -->
          </div>
          <div class="text third-line">
            <span class="name">{{item.patientImageReq.checkNum}}</span>
          </div>

        </card>
      </extensible-panel>

    </div>
  </folding-panel>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { delEmg, delBiochemical, delNervouSystem, modVitalSigns } from 'api/patient.js';
import { vueCopy } from 'utils/helper';

import FoldingPanel from 'components/foldingpanel/FoldingPanel';
import ExtensiblePanel from 'components/extensiblepanel/ExtensiblePanel';
import Card from 'components/card/Card';

export default {
  data() {
    return {
      mutableMode: this.mode,
      vitalSigns: '生命体征',
      heartRate: [],
      vitalData: {
        breathing: '',
        temperature: '',
        pulse: '',
        heartRate: '',
        rhythm: '',
        bpDecubitus: '',
        bpSitting: '',
        bpOrthostatic: '',
        doiMmse: '',
        doiMoca: '',
        doiCdr: ''
      },
      cardWidth: ''
    };
  },
  props: {
    mode: {
      type: String,
      default: this.READING_MODE
    },
    neurologicCheckList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    biochemicalExamList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    emgList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    medicalImagingList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    VitalSignsData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters([
      'surgicalTypeList',
      'complicationTypeList',
      'neurologicCheckTypeList',
      'bioexamTypeList',
      'emgTypeList',
      'typeGroup',
      'rhythm'
    ]),
    neurologicCheckTitle() {
      return '神经系统检查（' + this.neurologicCheckList.length + '条记录）';
    },
    biochemicalExamTitle() {
      return '生化指标（' + this.biochemicalExamList.length + '条记录）';
    },
    emgTitle() {
      return '肌电图（' + this.emgList.length + '条记录）';
    },
    medicalImagingTitle() {
      return '医学影像（' + this.medicalImagingList.length + '条记录）';
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
    startEditing() {
      this.mutableMode = this.EDITING_MODE;
      this.handleVitalData(this.VitalSignsData);
    },
    cancel() {
      this.mutableMode = this.READING_MODE;
    },
    submit() {
      this.mutableMode = this.READING_MODE;
      // 在此页面点击完成要提交生命体征
      this.submitVitalData(); // 提交生命体征
    },
    showVital(data) {
      if (data === '0') {
        return '不齐';
      } else {
        return '齐';
      }
    },
    submitVitalData() {
      let submitData = this.vitalData;
      for (let key in submitData) {
        switch (key) {
          case 'bpOrthostatic':
          case 'bpSitting':
          case 'bpDecubitus':
            switch (true) {
              case (Boolean(submitData[key + 'L']) === false && Boolean(submitData[key + 'R']) === false): // 左右值都不存在
                submitData[key] = '';
                break;
              case (Boolean(submitData[key + 'L']) && Boolean(submitData[key + 'R'])): // 左右值都存在
                submitData[key] = submitData[key + 'L'] + ',' + submitData[key + 'R'];
                break;
              case (Boolean(submitData[key + 'L']) && Boolean(submitData[key + 'R']) === false): // 左边的值存在
                submitData[key] = submitData[key + 'L'];
                break;
              case (Boolean(submitData[key + 'L']) === false && Boolean(submitData[key + 'R'])): // 右边的值存在
                submitData[key] = ',' + submitData[key + 'R'];
                break;
            }
            delete submitData[key + 'L'];  // 删除这两个辅助值
            delete submitData[key + 'R'];
            break;
        }
      }
      submitData['patientCaseId'] = this.$route.params.caseId;
      modVitalSigns(submitData).then(() => {
        Bus.$emit(this.UPDATE_CASE_INFO);
      }); // 提交生命体征
    },
    handleVitalData(data) {
      // 对生命体征作特殊的处理
      for (let key in data) {
        switch (key) {
          case 'bpOrthostatic':
          case 'bpSitting':
          case 'bpDecubitus':
            switch (true) {
              case data[key] === '':
                // 为空值
                this.$set(this.vitalData, key + 'L', '');
                this.$set(this.vitalData, key + 'R', '');
                break;
              case (Boolean(data[key].split(',')[0]) && Boolean(data[key].split(',')[1])):
                // 左右值都存在
                this.$set(this.vitalData, key + 'L', data[key].split(',')[0]);
                this.$set(this.vitalData, key + 'R', data[key].split(',')[1]);
                break;
              case (Boolean(data[key].split(',')[0]) === true) && data[key].indexOf(',') === -1:
                // 左值存在
                this.$set(this.vitalData, key + 'L', data[key]);
                this.$set(this.vitalData, key + 'R', '');
                break;
              case Boolean(data[key].split(',')[0]) === true && data[key].indexOf(',') !== -1:
                // 右值存在
                this.$set(this.vitalData, key + 'L', '');
                this.$set(this.vitalData, key + 'R', data[key].split(',')[1]);
                break;
            }
            break;
          default:
            this.$set(this.vitalData, key, data[key]);
            break;
        }
      }
    },
    transformNeurologicCheckType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.neurologicCheckTypeList);
      var name = data.spephysicalName ? data.spephysicalName : '';
      return name;
    },
    transformBiochemicalExamType(typeId) {
      // 在 tableData 中找到对应的值
      var data = Util.getElement('id', typeId, this.bioexamTypeList);
      var name = data.examName ? data.examName : '';
      return name;
    },
    transformEmgType(typeId) {
      // 在 tableData 中找到对应的值
      var emgInfo = Util.getElement('typegroupcode', 'eleType', this.typeGroup);
      var types = emgInfo.types ? emgInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    transformMedicalImagingType(typeId) {
      // 在 tableData 中找到对应的值
      var imageInfo = Util.getElement('typegroupcode', 'examType', this.typeGroup);
      var types = imageInfo.types ? imageInfo.types : [];
      typeId = 8;
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
      // return typeId;
    },
    addNeurologicCheckRecord() {
      // 这里要传递 3 个参数，一个是 title，一个是当前数据对象（新建的时候为空），另一个是模态框的类型
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, '新增神经系统检查', {});
      // console.log('add');
    },
    editNeurologicCheckRecord(item) {
      Bus.$emit(this.SHOW_NERVOU_SYSTEM_MODAL, '神经系统检查', item);
      // console.log('edit', item);
    },
    deleteNeurologicCheckRecord(item) { // 删除神经检查
      let NeuroId = {
        patientSpephysicalId: item.patientSpephysicalId
      };
      Bus.$on(this.CONFIRM, () => {
        delNervouSystem(NeuroId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addBiochemicalExamRecord() {
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, '新增生化指标', {});
    },
    editBiochemicalExamRecord(item) {
      Bus.$emit(this.SHOW_BIOCHEMICAL_EXAM_MODAL, '生化指标', item);
    },
    deleteBiochemicalExamRecord(item) { // 删除生化指标
      let BiochemicalId = {
        patientBioexamId: item.patientBioexamId
      };
      Bus.$on(this.CONFIRM, () => {
        delBiochemical(BiochemicalId).then(this._resolveDeletion, this._rejectDeletion);
      });
      Bus.$emit(this.REQUEST_CONFIRMATION);
    },
    addEmgRecord() {
      Bus.$emit(this.SHOW_EMG_MODAL, '新增肌电图', {});
    },
    editEmgRecord(item) {
      Bus.$emit(this.SHOW_EMG_MODAL, '肌电图', item);
    },
    deleteEmgRecord(item) { // 删除肌电图
      let EmgId = {
        id: item.id
      };
      Bus.$on(this.CONFIRM, () => {
        delEmg(EmgId).then(this._resolveDeletion, this._rejectDeletion);
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
        var panelWidth = this.$refs.diagnosticExamination.clientWidth;
        var cardNum = 1.0;
        // 20px 是卡片的横向间距，定义在了 varaibles.less 中，200px 是卡片的最小宽度，一排最多显示 10 个卡片
        while (panelWidth / (cardNum + 1) > 200 + 20 && cardNum < 10) {
          cardNum += 1.0;
        }
        this.cardWidth = 'width-1-' + parseInt(cardNum, 10);
      });
    },
    handleDictionary(type) {
      let flag = false;
      for (let key in this.typeGroup) {
        // console.log(this.typeGroup[key]);
        if (this.typeGroup[key]['typegroupcode'] === type) {
          // console.log(dictionData[key]['types']);
          flag = true;
          return this.typeGroup[key]['types'];
        }
      }
      if (!flag) {
        return [];
      }
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
    // 取出生命体征中的心率情况数组
    vueCopy(this.handleDictionary('rhythm'), this.heartRate);
  },
  beforeDestroy() {
    // 还是记得销毁组件前，解除事件绑定
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.recalculateCardWidth);
    Bus.$off(this.TOGGLE_LIST_DISPLAY, this.recalculateCardWidth);
    Bus.$off(this.RECALCULATE_CARD_WIDTH, this.recalculateCardWidth);
    Bus.$off(this.CONFIRM);
    Bus.$off(this.GIVE_UP);
  },
  watch: {
    VitalSignsData: {
      handler: function(newVal) {
        vueCopy(newVal, this.vitalData);
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@image-card-height: 130px;

@vital-item-width: 158px;
.diagnostic-examination {
  .panel {
    text-align: left;
    &.image-panel .content {
      height: @image-card-height + @card-vertical-margin * 2 + 5px * 2;
      &.extended {
        height: auto;
      }
    }
    .card {
      display: inline-block;
      position: relative;
      margin: @card-vertical-margin @card-horizontal-margin; // min-width: 200px;
      // max-width: 250px;
      &.image-card{
        height: @image-card-height;
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
    .vitalsigns {
      position: relative;
      width: 100%;
      height: auto;
      .vital-item {
        position: relative;
        display: inline-block;
        width: 50%;
        height: 50px;
        font-size: 0px;
        .vital-name {
          font-size: @normal-font-size;
          display: inline-block;
          width: @vital-item-width;
          line-height: 50px;
        }
        .vital-vlaue {
          display: inline-block;
          font-size: @normal-font-size;
          position: absolute;
          left: @vital-item-width;
          right: 4%;
          line-height: 50px;
          width: calc(~"100% - @{vital-item-width}");
          .el-input__inner {
            width: 90%;
          }
        }
        .el-select {
          width: calc(~"(100% - @{vital-item-width})*0.9");
          position: absolute;
          left: @vital-item-width;
          right: 4%;
        }
        .vital-two-vlaue {
          display: inline-block;
          font-size: @normal-font-size;
          position: absolute;
          left: @vital-item-width;
          right: 4%;
          line-height: 50px;
          width: calc(~"100% - @{vital-item-width}");
          .son-vlaue {
            position: relative;
            width: 45%;
            .el-input__inner {
              width: 97%;
            }
          }
        }
      }
    }
  }
}
</style>
