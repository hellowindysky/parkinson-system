<template lang="html">
  <div class="emg-modal-wrapper" v-show="displayModal">
    <div class="emg-modal" ref="emgModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            肌电图名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if='mode===VIEW_CURRENT_CARD'>{{getFieldValue(copyInfo.elecTroGramId, 'emgName')}}</span>
            <el-select v-else placeholder="请选择肌电图名称" v-model="copyInfo.elecTroGramId"
              :disabled="mode!==ADD_NEW_CARD" @change="selectEmg">
              <el-option v-for="emg in emgTypeList" :key="emg.id" :label="emg.emgName" :value="emg.id" ></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            肌电图类型:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span>{{getFieldValue(copyInfo.etgType, 'emgType')}}</span>
          </span>
        </div>
        <div class="field whole-line multi-line">
          <span class="field-name">
            检查结果:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patEleResult}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="copyInfo.patEleResult" placeholder="请输入检查结果"></el-input>
          </span>
        </div>
        <div class="field whole-line multi-line">
          <span class="field-name">
            提示内容:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patEleHint}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="copyInfo.patEleHint" placeholder="请输入提示信息"></el-input>
          </span>
        </div>
        <h3 class="form-title" v-if="tableMode===SON_OPEN">{{currentTableName}}</h3>
        <div class="form-wrapper" :class="{'father-open':tableMode==='' && mode===ADD_NEW_CARD}" ref="formWrapper">
          <table class="form" v-if="tableMode===FATHER_OPEN">
            <tr class="row first-row">
              <td class="col col-width-10">
                序号
              </td>
              <td class="col col-width-30">
                检查项
              </td>
              <td class="col col-width-15">
                操作
              </td>
            </tr>
            <tr class="row" v-for="(table, index) in emgTableList">
              <td class="col col-width-10">
                {{index+1}}
              </td>
              <td class="col col-width-30">
                {{table.cnName}}
              </td>
              <td class="col col-width-15">
                <span v-show="mode===VIEW_CURRENT_CARD" @click="selectTable(table.name)">查看</span>
                <span v-show="mode!==VIEW_CURRENT_CARD" @click="selectTable(table.name)">编辑</span>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'small-font':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===MOT_NER_COND_ITEM">
             <tr class="row first-row">
              <td class="col col-width-5">
                序号
              </td>
              <td class="col col-width-10">
                神经类型
              </td>
              <td class="col col-width-20">
                Nerve and Site
              </td>
              <td class="col col-width-10">
                Latency(ms)
              </td>
              <td class="col col-width-10">
                Amplitude(mV)
              </td>
              <td class="col col-width-15">
                Segment
              </td>
              <td class="col col-width-10">
                Latency Difference(ms)
              </td>
              <td class="col col-width-10">
                Distance(mm)
              </td>
              <td class="col col-width-10">
                Conduction Velocity(m/s)
              </td>
            </tr>
            <tr class="row" v-for="(item, index) in emgTable">
              <td class="col col-width-5">
                {{index+1}}
              </td>
              <td class="col col-width-10">
                <el-input v-model="item.nervName" disabled></el-input>
              </td>
              <td class="col col-width-20">
                <el-input v-model="item.nerveAndSite" disabled></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientMotNerCondResu[index].latency"></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientMotNerCondResu[index].amplitude"></el-input>
              </td>
              <td class="col col-width-15">
                <el-input v-model="item.segment"></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientMotNerCondResu[index].latencyDifference"></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientMotNerCondResu[index].distance"></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientMotNerCondResu[index].conductionVelocity"></el-input>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'small-font':tableMode===SON_OPEN}" v-else-if="tableMode===SON_OPEN && currentTable===F_WAV_STU_ITEM">
             <tr class="row first-row">
              <td class="col col-width-5">
                序号
              </td>
              <td class="col col-width-25">
                Nerve
              </td>
              <td class="col col-width-25">
                M-Latency
              </td>
              <td class="col col-width-25">
                F-Latency
              </td>
              <td class="col col-width-20">
                F%
              </td>
            </tr>
            <tr class="row" v-for="(item, index) in emgTable">
              <td class="col col-width-5">
                {{index+1}}
              </td>
              <td class="col col-width-25">
                <el-input v-model="item.nerve" disabled></el-input>
              </td>
              <td class="col col-width-25">
                <el-input v-model="copyInfo.patienFWaStuResu[index].mLatency"></el-input>
              </td>
              <td class="col col-width-25">
                <el-input v-model="copyInfo.patienFWaStuResu[index].fLatency"></el-input>
              </td>
              <td class="col col-width-20">
                <el-input v-model="copyInfo.patienFWaStuResu[index].fProportion"></el-input>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'small-font':tableMode===SON_OPEN}" v-else-if="tableMode===SON_OPEN && currentTable===SEN_NER_COND_ITEM">
             <tr class="row first-row">
              <td class="col col-width-5">
                序号
              </td>
              <td class="col col-width-10">
                神经类型
              </td>
              <td class="col col-width-15">
                Nerve and Site
              </td>
              <td class="col col-width-10">
                Onset Latency(ms)
              </td>
              <td class="col col-width-10">
                Peak Latency(ms)
              </td>
              <td class="col col-width-10">
                Amplitude(μV)
              </td>
              <td class="col col-width18">
                Segment
              </td>
              <td class="col col-width-10">
                Latency Difference(ms)
              </td>
              <td class="col col-width-5">
                Distance(mm)
              </td>
              <td class="col col-width-7">
                Conduction Velocity(m/s)
              </td>
            </tr>
             <tr class="row" v-for="(item, index) in emgTable">
              <td class="col col-width-5">
                {{index+1}}
              </td>
              <td class="col col-width-10">
                 <el-input v-model="item.nervName" disabled></el-input>
              </td>
              <td class="col col-width-15">
                 <el-input v-model="item.nerveAndSite" disabled></el-input>
              </td>
              <td class="col col-width-10">
                 <el-input v-model="copyInfo.patientSenNerCondResu[index].onsetLatency"></el-input>
              </td>
              <td class="col col-width-10">
                 <el-input v-model="copyInfo.patientSenNerCondResu[index].peakLatency"></el-input>
              </td>
              <td class="col col-width-10">
                 <el-input v-model="copyInfo.patientSenNerCondResu[index].amplitude"></el-input>
              </td>
              <td class="col col-width18">
                 <el-input v-model="item.segment" disabled></el-input>
              </td>
              <td class="col col-width-10">
                 <el-input v-model="copyInfo.patientSenNerCondResu[index].latencyDifference"></el-input>
              </td>
              <td class="col col-width-5">
                 <el-input v-model="copyInfo.patientSenNerCondResu[index].distance"></el-input>
              </td>
              <td class="col col-width-7">
                 <el-input v-model="copyInfo.patientSenNerCondResu[index].conductionVelocity"></el-input>
              </td>
            </tr>
          </table>
           <table class="form" :class="{'small-font':tableMode===SON_OPEN}" v-else-if="tableMode===SON_OPEN && currentTable===NEED_EXAM_ITEM">
             <tr class="row first-row">
              <td class="col col-width-5">
                序号
              </td>
              <td class="col col-width-25">
                Muscle
              </td>
              <td class="col col-width-10">
                Insertional
              </td>
              <td class="col col-width-7">
                Fibs(Spontaneous Activity)
              </td>
              <td class="col col-width-7">
                +Wave(Spontaneous Activity)
              </td>
              <td class="col col-width-7">
                Fasc(Spontaneous Activity)
              </td>
              <td class="col col-width-7">
                Duration(Volitional MUAPs)
              </td>
              <td class="col col-width-7">
                Amplitude(Volitional MUAPs)
              </td>
              <td class="col col-width-7">
                Poly(Volitional MUAPs)
              </td>
            </tr>
            <tr class="row" v-for="(item, index) in emgTable">
              <td class="col col-width-5">
                {{index+1}}
              </td>
              <td class="col col-width-25">
                <el-input v-model="item.muscle"></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].insertional"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].spoActFib"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].spoActWave"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].spoActFasc"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].volMuapdur"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].volmuapamp"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientNeedExamItemResu[index].volmuappoly"></el-input>
              </td>
            </tr>
          </table>
           <table class="form" :class="{'small-font':tableMode===SON_OPEN}" v-else-if="tableMode===SON_OPEN && currentTable===MOT_UNI_ANA_ITEM">
             <tr class="row first-row">
              <td class="col col-width-5">
                序号
              </td>
              <td class="col col-width-25">
                Muscle
              </td>
              <td class="col col-width-30">
                检查项名称
              </td>
              <td class="col col-width-7">
                Duration(ms)
              </td>
              <td class="col col-width-7">
                Amplitude(μV)
              </td>
              <td class="col col-width-7">
                Phases
              </td>
              <td class="col col-width-7">
                Spike Duration(ms)
              </td>
              <td class="col col-width-10">
                备注
              </td>
            </tr>
            <tr class="row" v-for="(item, index) in emgTable">
              <td class="col col-width-5">
                {{index+1}}
              </td>
              <td class="col col-width-25">
                <el-input v-model="item.nervName" disabled></el-input>
              </td>
              <td class="col col-width-30">
                <el-input v-model="item.examItemName" disabled></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientMotUniAnaResu[index].duration"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientMotUniAnaResu[index].amplitude"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientMotUniAnaResu[index].phases"></el-input>
              </td>
              <td class="col col-width-7">
                <el-input v-model="copyInfo.patientMotUniAnaResu[index].spikeDuration"></el-input>
              </td>
              <td class="col col-width-10">
                <el-input v-model="copyInfo.patientMotUniAnaResu[index].remarks"></el-input>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'small-font':tableMode===SON_OPEN}" v-else-if="tableMode===SON_OPEN && currentTable===INT_PAT_ANA_ITEM">
             <tr class="row first-row">
              <td class="col col-width-5">
                序号
              </td>
              <td class="col col-width-30">
                Muscle
              </td>
              <td class="col col-width-25">
                Turn/Second(T)
              </td>
              <td class="col col-width-20">
                Amplitude/Turn(M)(μV)
              </td>
              <td class="col col-width-20">
                Ratio(M/T)(%)
              </td>
            </tr>
            <tr class="row" v-for="(item, index) in emgTable">
              <td class="col col-width-5">
                {{index+1}}
              </td>
              <td class="col col-width-30">
                <el-input v-model="item.muscle" disabled></el-input>
              </td>
              <td class="col col-width-25">
                <el-input v-model="copyInfo.patientIntPatAnaItem[index].turn"></el-input>
              </td>
              <td class="col col-width-20">
                <el-input v-model="copyInfo.patientIntPatAnaItem[index].amplitude" ></el-input>
              </td>
              <td class="col col-width-20">
                <el-input v-model="copyInfo.patientIntPatAnaItem[index].ratio"></el-input>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="button cancel-button" v-show="tableMode!==SON_OPEN" @click="cancel">取消</div>
      <div class="button son-submit-button" v-show="tableMode===FATHER_OPEN && mode===VIEW_CURRENT_CARD && canEdit" @click="switchToEditingMode">编辑</div>
      <div class="button son-submit-button" v-show="tableMode===FATHER_OPEN && mode!==VIEW_CURRENT_CARD" @click="submit">确认</div>
      <div class="button son-submit-button" v-show="tableMode===SON_OPEN && mode===VIEW_CURRENT_CARD" @click="editEnd">返回</div>
      <div class="button son-submit-button" v-show="tableMode===SON_OPEN && mode!==VIEW_CURRENT_CARD" @click="editEnd">编辑完成</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { mapGetters } from 'vuex';
import { vueCopy } from 'utils/helper';
import { addEmg, modEmg } from 'api/patient.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      FATHER_OPEN: 'fatherOpen',
      SON_OPEN: 'sonOpen',
      tableMode: '',
      displayModal: false,
      mode: '',
      lockSubmitButton: false,
      currentTable: '',
      F_WAV_STU_ITEM: 'fwavStuItem',
      INT_PAT_ANA_ITEM: 'intPatAnaItem',
      MOT_NER_COND_ITEM: 'motNerCondItem',
      MOT_UNI_ANA_ITEM: 'motUniAnaItem',
      NEED_EXAM_ITEM: 'needExamItem',
      SEN_NER_COND_ITEM: 'senNerCondItem',
      warningResults: {},
      copyInfo: {},
      targetEmg: {},
      emgTable: [],
      emgTableList: [
        {
          name: this.F_WAV_STU_ITEM,
          cnName: 'F波研究'
        },
        {
          name: this.INT_PAT_ANA_ITEM,
          cnName: '干扰项分析'
        },
        {
          name: this.MOT_NER_COND_ITEM,
          cnName: '运动神经传导项'
        },
        {
          name: this.MOT_UNI_ANA_ITEM,
          cnName: '运动单元分析'
        },
        {
          name: this.NEED_EXAM_ITEM,
          cnName: '针刺肌电图检查'
        },
        {
          name: this.SEN_NER_COND_ITEM,
          cnName: '感觉神经传导项'
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'emgTypeList',
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增肌电图';
      } else {
        return '肌电图';
      }
    },
    currentTableName() {
      if (this.currentTable === this.F_WAV_STU_ITEM) {
        return 'F波研究';
      } else if (this.currentTable === this.INT_PAT_ANA_ITEM) {
        return '干扰项分析';
      } else if (this.currentTable === this.MOT_NER_COND_ITEM) {
        return '运动神经传导项';
      } else if (this.currentTable === this.MOT_UNI_ANA_ITEM) {
        return '运动单元分析';
      } else if (this.currentTable === this.NEED_EXAM_ITEM) {
        return '针刺肌电图检查';
      } else if (this.currentTable === this.SEN_NER_COND_ITEM) {
        return '感觉神经传导项';
      } else {
        return '';
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
  methods: {
    showPanel(cardOperation, item) {
      this.displayModal = true;
      this.mode = cardOperation;
      console.log('item: ', item);

      if (this.mode === this.ADD_NEW_CARD) {
        // 如果是新增肌电图那么需要新造一个对象来提交
        this.$set(this.copyInfo, 'etgName', '');
        this.$set(this.copyInfo, 'elecTroGramId', '');
        this.$set(this.copyInfo, 'etgType', '');
        this.$set(this.copyInfo, 'patEleHint', '');
        this.$set(this.copyInfo, 'patEleResult', '');
        this.$set(this.copyInfo, 'pcaseId', this.$route.params.caseId);
        this.$set(this.copyInfo, 'pinfoId', this.$route.params.id);
        this.$set(this.copyInfo, 'patientMotNerCondResu', []);
        this.$set(this.copyInfo, 'patienFWaStuResu', []);
        this.$set(this.copyInfo, 'patientNeedExamItemResu', []);
        this.$set(this.copyInfo, 'patientMotUniAnaResu', []);
        this.$set(this.copyInfo, 'patientIntPatAnaItem', []);
        this.$set(this.copyInfo, 'patientSenNerCondResu', []);
      } else {
        // 刚进入模态框的时候父表格打开
        this.tableMode = this.FATHER_OPEN;
        // 修改生化指标那么直接拷贝它
        vueCopy(item, this.copyInfo);
      }
      this.selectEmg();
      this.updateScrollbar();
    },
    getTypes(name) {
      var typeInfo = Util.getElement('typegroupcode', name, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    selectEmg() {
      var emg = Util.getElement('id', this.copyInfo.elecTroGramId, this.emgTypeList);
      this.$set(this.copyInfo, 'etgName', emg.emgName);
      this.$set(this.copyInfo, 'etgType', emg.emgType);
      if (this.mode === this.ADD_NEW_CARD) {
        this.tableMode = this.FATHER_OPEN;
      }
      console.log('emgTypeList:', this.emgTypeList);
      vueCopy(emg, this.targetEmg);
      this.updateScrollbar();
    },
    selectTable(tableName) {
      // 点击 查看／编辑 按钮之后，通过 tableName 来生成一个肌电图的子表格
      this.emgTable = [];
      if (this.targetEmg[tableName]) {
        vueCopy(this.targetEmg[tableName], this.emgTable);
      }

      // 取到这个值之后就要关闭父表格，打开子表格
      this.tableMode = this.SON_OPEN;
      switch (tableName) {
        case this.SEN_NER_COND_ITEM:
          this.currentTable = this.SEN_NER_COND_ITEM;
          for (let i = 0; i < this.emgTable.length; i++) {
            let nervTypes = this.getTypes('nervTypes');
            for (let nerv of nervTypes) {
              if (parseInt(this.emgTable[i].nerveType, 10) === nerv.typeCode) {
                this.$set(this.emgTable[i], 'nervName', nerv.typeName);
              }
            }
          }
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.initEmgTableData(tableName);
          }
          break;
        case this.NEED_EXAM_ITEM:
          this.currentTable = this.NEED_EXAM_ITEM;
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.initEmgTableData(tableName);
          }
          break;
        case this.MOT_UNI_ANA_ITEM:
          this.currentTable = this.MOT_UNI_ANA_ITEM;
          for (let i = 0; i < this.emgTable.length; i++) {
            let muscleTypes = this.getTypes('muscleTypes');
            for (let muscle of muscleTypes) {
              if (parseInt(this.emgTable[i].muscleType, 10) === muscle.typeCode) {
                this.$set(this.emgTable[i], 'nervName', muscle.typeName);
              }
            }
          }
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.initEmgTableData(tableName);
          }
          break;
        case this.MOT_NER_COND_ITEM:
          this.currentTable = this.MOT_NER_COND_ITEM;
          // 获取到运动神经传导项的类型
          for (let i = 0; i < this.emgTable.length; i++) {
            let nervTypes = this.getTypes('nervTypes');
            for (let nerv of nervTypes) {
              if (parseInt(this.emgTable[i].nerveType, 10) === nerv.typeCode) {
                this.$set(this.emgTable[i], 'nervName', nerv.typeName);
              }
            }
          }
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.initEmgTableData(tableName);
          }
          break;
        case this.INT_PAT_ANA_ITEM:
          this.currentTable = this.INT_PAT_ANA_ITEM;
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.initEmgTableData(tableName);
          }
          break;
        case this.F_WAV_STU_ITEM:
          this.currentTable = this.F_WAV_STU_ITEM;
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.initEmgTableData(tableName);
          }
          break;
      }
      this.updateScrollbar();
      this.$refs.formWrapper.scrollTop = 0;
    },
    initEmgTableData(tableName) {
      switch (tableName) {
        case this.SEN_NER_COND_ITEM:
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientSenNerCondResu, i, {});
            this.$set(this.copyInfo.patientSenNerCondResu[i], 'amplitude', '');
            this.$set(this.copyInfo.patientSenNerCondResu[i], 'conductionVelocity', '');
            this.$set(this.copyInfo.patientSenNerCondResu[i], 'distance', '');
            this.$set(this.copyInfo.patientSenNerCondResu[i], 'latencyDifference', '');
            this.$set(this.copyInfo.patientSenNerCondResu[i], 'onsetLatency', '');
            this.$set(this.copyInfo.patientSenNerCondResu[i], 'peakLatency', '');
          }
          break;
        case this.NEED_EXAM_ITEM:
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientNeedExamItemResu, i, {});
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'needExamItemId', this.emgTable[i].id);
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'insertional', '');
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'spoActFasc', '');
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'spoActFib', '');
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'spoActWave', '');
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'volmuapamp', '');
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'volMuapdur', '');
            this.$set(this.copyInfo.patientNeedExamItemResu[i], 'volmuappoly', '');
          }
          break;
        case this.MOT_UNI_ANA_ITEM:
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientMotUniAnaResu, i, {});
            this.$set(this.copyInfo.patientMotUniAnaResu[i], 'amplitude', '');
            this.$set(this.copyInfo.patientMotUniAnaResu[i], 'conductionVelocity', '');
            this.$set(this.copyInfo.patientMotUniAnaResu[i], 'distance', '');
            this.$set(this.copyInfo.patientMotUniAnaResu[i], 'latency', '');
            this.$set(this.copyInfo.patientMotUniAnaResu[i], 'latencyDifference', '');
            this.$set(this.copyInfo.patientMotUniAnaResu[i], 'motNerItemId', '');
          }
          break;
        case this.MOT_NER_COND_ITEM:
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientMotNerCondResu, i, {});
            this.$set(this.copyInfo.patientMotNerCondResu[i], 'motNerItemId', this.emgTable[i].id);
            this.$set(this.copyInfo['patientMotNerCondResu'][i], 'amplitude', '');
            this.$set(this.copyInfo['patientMotNerCondResu'][i], 'duration', '');
            this.$set(this.copyInfo['patientMotNerCondResu'][i], 'phases', '');
            this.$set(this.copyInfo['patientMotNerCondResu'][i], 'spikeDuration', '');
          }
          break;
        case this.INT_PAT_ANA_ITEM:
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientIntPatAnaItem, i, {});
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'intPatAnaId', this.emgTable[i].id);
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'amplitude', '');
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'ratio', '');
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'turn', '');
          }
          break;
        case this.F_WAV_STU_ITEM:
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patienFWaStuResu, i, {});
            this.$set(this.copyInfo.patienFWaStuResu[i], 'fWavStuItemId', this.emgTable[i].id);
            this.$set(this.copyInfo.patienFWaStuResu[i], 'fLatency', '');
            this.$set(this.copyInfo.patienFWaStuResu[i], 'fProportion', '');
            this.$set(this.copyInfo.patienFWaStuResu[i], 'mLatency', '');
          }
          break;
      }
    },
    editEnd() {
      this.tableMode = this.FATHER_OPEN;
      this.updateScrollbar();
      this.$refs.formWrapper.scrollTop = 0;
    },
    cancel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
      this.copyInfo = {};
      this.tableMode = '';
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      let submitData = this.copyInfo;
      if (this.mode === this.ADD_NEW_CARD) {
        // 新增肌电图
        addEmg(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.cancel();
        }, this._handleError);
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        // 修改肌电图
        modEmg(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.cancel();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      this.displayModal = false;
    },
    clearWarning() {
      for (let property in this.warningResults) {
        this.warningResults[property] = null;
      }
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults.subModal = null;
      }
    },
    getFieldValue(code, fieldName) {
      if (code === '' || code === undefined) {
        return '';
      } else if (fieldName === 'emgName') {
        let info = Util.getElement('id', code, this.emgTypeList);
        return info.emgName;
      } else if (fieldName === 'emgType') {
        code = parseInt(code, 10);
        let info = Util.getElement('typeCode', code, this.getTypes('eleType'));
        return info.typeName;
      } else {
        return '';
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.formWrapper);
        Ps.initialize(this.$refs.formWrapper, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
        Ps.destroy(this.$refs.emgModal);
        Ps.initialize(this.$refs.emgModal, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    }
  },
  mounted() {
    this.updateScrollbar();
    Bus.$on(this.SHOW_EMG_MODAL, this.showPanel);
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);

    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  watch: {
    emgTypeList: function() {
      this.selectEmg();
    }
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_EMG_MODAL, this.showPanel);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@multi-line-field-height: 60px;
@field-name-width: 100px;
@long-field-name-width: 160px;

@col-id-width: 40px;
@col-name-width: 180px;
@col-english-width: 70px;
@col-result-width: 160px;
@col-danwei-width: 70px;
@col-cankao-width: 70px;
@col-beizhu-width: 180px;

.emg-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .emg-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 80%;
    min-width: 800px;
    max-width: 1000px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      font-size: 0;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        padding: 5px 0;
        text-align: left;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 4%;
          }
        }
        &.multi-line {
          height: @multi-line-field-height;
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
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .form-title {
        padding: 5px 0 0 0;
        line-height: 40px;
        font-size: @normal-font-size;
        color: @font-color;
        margin: 0;
        text-align: center;
      }
      .form-wrapper {
        position: relative;
        margin-top: 5px;
        max-height: 320px;
        height: auto;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid @inverse-font-color;
        &.father-open {
          border: none;
        }
        .form {
          position: relative;
          margin-bottom: 5px;
          width: 100%; // left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
          border-spacing: 0;
          font-size: 14px;
          &.small-font {
            font-size: @small-font-size !important;
          }
          .row {
            height: 40px;
            &.first-row {
              background-color: @screen-color;
              height: 30px;
              .col {
                padding: 0 3px;
              }
            }
            .col {
              text-align: center;
              padding: 0;
              margin: 0;
              span {
                margin: 0 5px;
                color: @theme-color;
                text-decoration: underline;
                cursor: pointer;
              }
              &.col-width-5 {
                width: 5%;
                min-width: 40px;
              }
              &.col-width-10 {
                width: 10%;
              }
              &.col-width-15 {
                width: 15%;
              }
              &.col-width-20 {
                width: 20%;
              }
              &.col-width-25 {
                width: 25%;
              }
              &.col-width-30 {
                width: 30%;
              }
              &.col-width18 {
                width: 18%;
              }
              &.col-width-7 {
                width: 7%;
              }
              .required-mark {
                color: red;
                font-size: 20px;
                vertical-align: middle;
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
      &.submit-button {
        background-color: @button-color;
      }
      &.son-submit-button {
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
