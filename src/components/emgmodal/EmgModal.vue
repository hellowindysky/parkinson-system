<template lang="html">
  <div class="emg-modal-wrapper" v-show="displayModal">
    <div class="medicine-modal" ref="emgModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            肌电图名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if='mode===VIEW_CURRENT_CARD'>{{getFieldValue(EmgTypeData.elecTroGramId, 'emgName')}}</span>
            <el-select v-else placeholder="请选择肌电图名称" v-model="EmgTypeData.elecTroGramId"
              :disabled="mode!==ADD_NEW_CARD" @change="selectFatherTempData">
              <el-option v-for="emgItem in EmgNameArr" :key="emgItem.id" :label="emgItem.emgName" :value="emgItem.id" ></el-option>
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
            <span v-if='mode===VIEW_CURRENT_CARD'>{{getFieldValue(EmgTypeData.etgType, 'emgType')}}</span>
            <el-select v-else v-model="EmgTypeData['etgType']"  disabled>
               <el-option v-for="item in EmgTypeNameArrs" :key="item.typeCode" :label="item.typeName" :value="item.typeCode" ></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查结果:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{EmgTypeData.patEleResult}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="EmgTypeData['patEleResult']" placeholder="请输入检查结果"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            提示内容:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{EmgTypeData.patEleHint}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="EmgTypeData['patEleHint']" placeholder="请输入提示信息"></el-input>
          </span>
        </div>
        <h3 class="form-title" v-if="tableMode===SON_OPEN">{{currentTableName}}</h3>
        <div class="form-wrapper" :class="{'father-open':tableMode==='' && mode===ADD_NEW_CARD}" ref="formWrapper">
          <table class="form" v-if="tableMode===FATHER_OPEN">
            <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width30">
                检查项
              </td>
              <td class="col col-width30">
                操作
              </td>
            </tr>
            <tr class="row" v-for="(item, key) in emgTableName">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width30">
                {{item.tableName}}
              </td>
              <td class="col col-width30">
                <span v-show="mode===VIEW_CURRENT_CARD" @click="viewSonTemp(item.arr)">查看</span>
                <span v-show="mode!==VIEW_CURRENT_CARD" @click="selectSonTemp(item.arr)">编辑</span>
                <span v-show="mode!==VIEW_CURRENT_CARD">重置</span>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'font-change':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===MOTNERCONDITEM">
             <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width10">
                神经类型
              </td>
              <td class="col col-width20">
                Nerve and Site
              </td>
              <td class="col col-width10">
                Latency(ms)
              </td>
              <td class="col col-width10">
                Amplitude(mV)
              </td>
              <td class="col col-width15">
                Segment
              </td>
              <td class="col col-width10">
                Latency Difference(ms)
              </td>
              <td class="col col-width10">
                Distance(mm)
              </td>
              <td class="col col-width10">
                Conduction Velocity(m/s)
              </td>
            </tr>

             <tr class="row" v-for="(item, key) in SonTempData">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width10">
                <el-input v-model="item['nervName']" disabled></el-input>
              </td>
              <td class="col col-width20">
                <el-input v-model="item['nerveAndSite']" disabled></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientMotNerCondResu'][key]['latency']"></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientMotNerCondResu'][key]['amplitude']"></el-input>
              </td>
              <td class="col col-width15">
                <el-input v-model="item['segment']"></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientMotNerCondResu'][key]['latencyDifference']"></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientMotNerCondResu'][key]['distance']"></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientMotNerCondResu'][key]['conductionVelocity']"></el-input>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'font-change':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===fWAVSTUITEM">
             <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width25">
                Nerve
              </td>
              <td class="col col-width25">
                M-Latency
              </td>
              <td class="col col-width25">
                F-Latency
              </td>
              <td class="col col-width20">
                F%
              </td>
            </tr>
            <tr class="row" v-for="(item, key) in SonTempData">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width25">
                <el-input v-model="item['nerve']" disabled></el-input>
              </td>
              <td class="col col-width25">
                <el-input v-model="EmgTypeData['patienFWaStuResu'][key]['mLatency']"></el-input>
              </td>
              <td class="col col-width25">
                <el-input v-model="EmgTypeData['patienFWaStuResu'][key]['fLatency']"></el-input>
              </td>
              <td class="col col-width20">
                <el-input v-model="EmgTypeData['patienFWaStuResu'][key]['fProportion']"></el-input>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'font-change':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===SENNERCONDITEM">
             <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width10">
                神经类型
              </td>
              <td class="col col-width15">
                Nerve and Site
              </td>
              <td class="col col-width10">
                Onset Latency(ms)
              </td>
              <td class="col col-width10">
                Peak Latency(ms)
              </td>
              <td class="col col-width10">
                Amplitude(μV)
              </td>
              <td class="col col-width18">
                Segment
              </td>
              <td class="col col-width10">
                Latency Difference(ms)
              </td>
              <td class="col col-width5">
                Distance(mm)
              </td>
              <td class="col col-width7">
                Conduction Velocity(m/s)
              </td>
            </tr>
             <tr class="row" v-for="(item, key) in SonTempData">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width10">
                 <el-input v-model="item.nervName" disabled></el-input>
              </td>
              <td class="col col-width15">
                 <el-input v-model="item.nerveAndSite" disabled></el-input>
              </td>
              <td class="col col-width10">
                 <el-input v-model="EmgTypeData['patientSenNerCondResu'][key]['onsetLatency']"></el-input>
              </td>
              <td class="col col-width10">
                 <el-input v-model="EmgTypeData['patientSenNerCondResu'][key]['peakLatency']"></el-input>
              </td>
              <td class="col col-width10">
                 <el-input v-model="EmgTypeData['patientSenNerCondResu'][key]['amplitude']"></el-input>
              </td>
              <td class="col col-width18">
                 <el-input v-model="item.segment" disabled></el-input>
              </td>
              <td class="col col-width10">
                 <el-input v-model="EmgTypeData['patientSenNerCondResu'][key]['latencyDifference']"></el-input>
              </td>
              <td class="col col-width5">
                 <el-input v-model="EmgTypeData['patientSenNerCondResu'][key]['distance']"></el-input>
              </td>
              <td class="col col-width7">
                 <el-input v-model="EmgTypeData['patientSenNerCondResu'][key]['conductionVelocity']"></el-input>
              </td>
            </tr>
          </table>
           <table class="form" :class="{'font-change':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===NEEDEXAMITEM">
             <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width25">
                Muscle
              </td>
              <td class="col col-width10">
                Insertional
              </td>
              <td class="col col-width7">
                Fibs(Spontaneous Activity)
              </td>
              <td class="col col-width7">
                +Wave(Spontaneous Activity)
              </td>
              <td class="col col-width7">
                Fasc(Spontaneous Activity)
              </td>
              <td class="col col-width7">
                Duration(Volitional MUAPs)
              </td>
              <td class="col col-width7">
                Amplitude(Volitional MUAPs)
              </td>
              <td class="col col-width7">
                Poly(Volitional MUAPs)
              </td>
            </tr>
            <tr class="row" v-for="(item, key) in SonTempData">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width25">
                <el-input v-model="item.muscle"></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['insertional']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['spoActFib']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['spoActWave']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['spoActFasc']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['volMuapdur']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['volmuapamp']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientNeedExamItemResu'][key]['volmuappoly']"></el-input>
              </td>
            </tr>
          </table>
           <table class="form" :class="{'font-change':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===MOTUNIANAITEM">
             <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width25">
                Muscle
              </td>
              <td class="col col-width30">
                检查项名称
              </td>
              <td class="col col-width7">
                Duration(ms)
              </td>
              <td class="col col-width7">
                Amplitude(μV)
              </td>
              <td class="col col-width7">
                Phases
              </td>
              <td class="col col-width7">
                Spike Duration(ms)
              </td>
              <td class="col col-width10">
                备注
              </td>
            </tr>
            <tr class="row" v-for="(item, key) in SonTempData">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width25">
                <el-input v-model="item['nervName']" disabled></el-input>
              </td>
              <td class="col col-width30">
                <el-input v-model="item['examItemName']" disabled></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientMotUniAnaResu'][key]['duration']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientMotUniAnaResu'][key]['amplitude']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientMotUniAnaResu'][key]['phases']"></el-input>
              </td>
              <td class="col col-width7">
                <el-input v-model="EmgTypeData['patientMotUniAnaResu'][key]['spikeDuration']"></el-input>
              </td>
              <td class="col col-width10">
                <el-input v-model="EmgTypeData['patientMotUniAnaResu'][key]['remarks']"></el-input>
              </td>
            </tr>
          </table>
          <table class="form" :class="{'font-change':tableMode===SON_OPEN}" v-if="tableMode===SON_OPEN && currentTable===INTPATANAITEM">
             <tr class="row first-row">
              <td class="col col-width5">
                序号
              </td>
              <td class="col col-width30">
                Muscle
              </td>
              <td class="col col-width25">
                Turn/Second(T)
              </td>
              <td class="col col-width20">
                Amplitude/Turn(M)(μV)
              </td>
              <td class="col col-width20">
                Ratio(M/T)(%)
              </td>
            </tr>
            <tr class="row" v-for="(item, key) in SonTempData">
              <td class="col col-width5">
                {{key+1}}
              </td>
              <td class="col col-width30">
                <el-input v-model="item['muscle']" disabled></el-input>
              </td>
              <td class="col col-width25">
                <el-input v-model="EmgTypeData['patientIntPatAnaItem'][key]['turn']"></el-input>
              </td>
              <td class="col col-width20">
                <el-input v-model="EmgTypeData['patientIntPatAnaItem'][key]['amplitude']" ></el-input>
              </td>
              <td class="col col-width20">
                <el-input v-model="EmgTypeData['patientIntPatAnaItem'][key]['ratio']"></el-input>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" v-show="tableMode!==SON_OPEN" @click="cancel">取消</div>
      <div class="button son-submit-button" v-show="tableMode===FATHER_OPEN && mode===VIEW_CURRENT_CARD && canEdit" @click="switchToEditingMode">编辑</div>
      <div class="button son-submit-button" v-show="tableMode===FATHER_OPEN && mode!==VIEW_CURRENT_CARD" @click="submit">确认</div>
      <div class="button son-submit-button" v-show="tableMode===SON_OPEN && mode===VIEW_CURRENT_CARD" @click="editEnd">返回</div>
      <div class="button son-submit-button" v-show="tableMode===SON_OPEN && mode!==VIEW_CURRENT_CARD" @click="editEnd">编辑完成</div>
      <!-- <div class="button cancel-button" v-if="tableMode===FATHER_OPEN && mode!==EDIT_CURRENT_CARD" @click="cancel">取消</div>
      <div class="button son-submit-button" v-if="tableMode===FATHER_OPEN && mode!==EDIT_CURRENT_CARD" @click="submit">确认</div>
      <div class="button son-submit-button" v-if="tableMode===SON_OPEN && mode!==EDIT_CURRENT_CARD" @click="editEnd">编辑完成</div>

      <div class="button cancel-button" v-if="mode===ADD_NEW_CARD && tableMode!==SON_OPEN" @click="cancel">取消</div>
      <div class="button son-submit-button" v-if="mode===ADD_NEW_CARD && tableMode!==SON_OPEN" @click="submit">确认</div>
      <div class="button son-submit-button" v-if="mode===ADD_NEW_CARD && tableMode===SON_OPEN" @click="editEnd">编辑完成</div> -->
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import { addEmg, modEmg } from 'api/patient.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      motNerCondType: [],
      FATHER_OPEN: 'fatheropen',
      SON_OPEN: 'sonopen',
      tableMode: '',
      displayModal: false,
      mode: '',
      currentTable: '',
      currentTableName: '',
      fWAVSTUITEM: 'fwavStuItem',
      INTPATANAITEM: 'intPatAnaItem',
      MOTNERCONDITEM: 'motNerCondItem',
      MOTUNIANAITEM: 'motUniAnaItem',
      NEEDEXAMITEM: 'needExamItem',
      SENNERCONDITEM: 'senNerCondItem',
      item: {},
      warningResults: {},
      dictionData: [],
      EmgTypeData: {},
      EmgNameArr: [],
      EmgTypeNameArrs: [],
      FatherTempData: {},
      SonTempData: [],
      lockSubmitButton: false,
      emgTableName: [
        {
          arr: 'fwavStuItem',
          tableName: 'F波研究'
        },
        {
          arr: 'intPatAnaItem',
          tableName: '干扰项分析'
        },
        {
          arr: 'motNerCondItem',
          tableName: '运动神经传导项'
        },
        {
          arr: 'motUniAnaItem',
          tableName: '运动单元分析'
        },
        {
          arr: 'needExamItem',
          tableName: '针刺肌电图检查'
        },
        {
          arr: 'senNerCondItem',
          tableName: '感觉神经传导项'
        }
      ],
      sonTableList: []
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
      // 拷贝dictionary的数据
      vueCopy(this.emgTypeList, this.dictionData);
      // 在dictionary中取出肌电图的名字和ID
      for (let i = 0; i < this.dictionData.length; i++) {
        this.$set(this.EmgNameArr, i, {});
        for (let key in this.dictionData[i]) {
          if (key === 'emgName') {
            this.$set(this.EmgNameArr[i], key, this.dictionData[i][key]);
          } else if (key === 'id') {
            this.$set(this.EmgNameArr[i], key, this.dictionData[i][key]);
          }
        }
      }
      // 在肌电图中取出肌电图的类型与类型名
      vueCopy(this.handleDictionary('eleType'), this.EmgTypeNameArrs);
      for (let key1 in this.EmgTypeNameArrs) {
        this.EmgTypeNameArrs[key1]['typeCode'] = this.EmgTypeNameArrs[key1]['typeCode'] + '';
      }
      // console.log(this.EmgTypeNameArrs);
      // 通过检查 item 参数是否为空对象 {}，来决定提交时是新增记录，还是修改记录
      if (this.mode === this.ADD_NEW_CARD) {
        // 如果是新增肌电图那么需要新造一个对象来提交
        this.$set(this.EmgTypeData, 'etgName', '');
        this.$set(this.EmgTypeData, 'elecTroGramId', '');
        this.$set(this.EmgTypeData, 'etgType', '0');
        this.$set(this.EmgTypeData, 'patEleHint', '');
        this.$set(this.EmgTypeData, 'patEleResult', '');
        this.$set(this.EmgTypeData, 'pcaseId', this.$route.params.caseId);
        this.$set(this.EmgTypeData, 'pinfoId', this.$route.params.id);
        this.$set(this.EmgTypeData, 'patientMotNerCondResu', []);
        this.$set(this.EmgTypeData, 'patienFWaStuResu', []);
        this.$set(this.EmgTypeData, 'patientNeedExamItemResu', []);
        this.$set(this.EmgTypeData, 'patientMotUniAnaResu', []);
        this.$set(this.EmgTypeData, 'patientIntPatAnaItem', []);
        this.$set(this.EmgTypeData, 'patientSenNerCondResu', []);
      } else {
        // 刚进入模态框的时候父表格打开
        this.tableMode = this.FATHER_OPEN;
        // 修改生化指标那么直接拷贝它
        vueCopy(item, this.EmgTypeData);
      }
      this.updateScrollbar();
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
    },
    selectFatherTempData() {
      for (let i = 0; i < this.dictionData.length; i++) {
        if (this.dictionData[i]['id'] === this.EmgTypeData['elecTroGramId']) {
          vueCopy(this.dictionData[i], this.FatherTempData);
          this.$set(this.EmgTypeData, 'etgName', this.FatherTempData['emgName']);
          if (this.mode === this.ADD_NEW_CARD) {
            this.tableMode = this.FATHER_OPEN;
          }
          this.updateScrollbar();
        }
      }
    },
    selectSonTemp(arrName) {
      // 点击编辑按钮之后就通过arr的名字来生成一个肌电图的子表格
      // 在dictionary中找到这个数组
      this.SonTempData = [];
      for (let key in this.FatherTempData) {
        if (key === arrName) {
          vueCopy(this.FatherTempData[key], this.SonTempData);
        }
      }
      console.log(this.SonTempData);
      // 取到这个值之后就要关闭父表格，打开子表格
      this.tableMode = this.SON_OPEN;
      switch (arrName) {
        case 'senNerCondItem':
          this.currentTable = this.SENNERCONDITEM;
          this.currentTableName = '感觉神经传导项';
          for (let i = 0; i < this.SonTempData.length; i++) {
            let sonData = this.SonTempData[i];
            for (let key in this.handleDictionary('nervType')) {
              if (parseInt(sonData['nerveType'], 10) === this.handleDictionary('nervType')[key]['typeCode']) {
                this.$set(this.SonTempData[i], 'nervName', this.handleDictionary('nervType')[key]['typeName']);
              }
            }
          }
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.addEmgSonData(arrName);
          }
          break;
        case 'needExamItem':
          this.currentTable = this.NEEDEXAMITEM;
          this.currentTableName = '针刺肌电图检查';
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.addEmgSonData(arrName);
          }
          break;
        case 'motUniAnaItem':
          this.currentTable = this.MOTUNIANAITEM;
          this.currentTableName = '运动单元分析';
          for (let i = 0; i < this.SonTempData.length; i++) {
            let sonData = this.SonTempData[i];
            for (let key in this.handleDictionary('muscleType')) {
              if (parseInt(sonData['muscle'], 10) === this.handleDictionary('muscleType')[key]['typeCode']) {
                this.$set(this.SonTempData[i], 'nervName', this.handleDictionary('muscleType')[key]['typeName']);
              }
            }
          }
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.addEmgSonData(arrName);
          }
          break;
        case 'motNerCondItem':
          this.currentTable = this.MOTNERCONDITEM;
          this.currentTableName = '运动神经传导项';
          // 获取到运动神经传导项的类型
          for (let i = 0; i < this.SonTempData.length; i++) {
            let sonData = this.SonTempData[i];
            for (let key in this.handleDictionary('nervType')) {
              if (parseInt(sonData['nerveType'], 10) === this.handleDictionary('nervType')[key]['typeCode']) {
                this.$set(this.SonTempData[i], 'nervName', this.handleDictionary('nervType')[key]['typeName']);
              }
            }
          }
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.addEmgSonData(arrName);
          }
          break;
        case 'intPatAnaItem':
          this.currentTable = this.INTPATANAITEM;
          this.currentTableName = '干扰项分析';
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.addEmgSonData(arrName);
          }
          break;
        case 'fwavStuItem':
          this.currentTable = this.fWAVSTUITEM;
          this.currentTableName = 'F波研究';
          // 在新增的状态下需要把肌电图的子表格造出来
          if (this.mode === this.ADD_NEW_CARD) {
            this.addEmgSonData(arrName);
          }
          break;
      }
    },
    viewSonTemp(arrName) {
      this.selectSonTemp(arrName);
    },
    addEmgSonData(Name) {
      switch (Name) {
        case 'senNerCondItem':
          for (let i = 0; i < this.SonTempData.length; i++) {
            this.$set(this.EmgTypeData['patientSenNerCondResu'], i, {});
            this.$set(this.EmgTypeData['patientSenNerCondResu'][i], 'amplitude', '');
            this.$set(this.EmgTypeData['patientSenNerCondResu'][i], 'conductionVelocity', '');
            this.$set(this.EmgTypeData['patientSenNerCondResu'][i], 'distance', '');
            this.$set(this.EmgTypeData['patientSenNerCondResu'][i], 'latencyDifference', '');
            this.$set(this.EmgTypeData['patientSenNerCondResu'][i], 'onsetLatency', '');
            this.$set(this.EmgTypeData['patientSenNerCondResu'][i], 'peakLatency', '');
          }
          break;
        case 'needExamItem':
          for (let i = 0; i < this.SonTempData.length; i++) {
            this.$set(this.EmgTypeData['patientNeedExamItemResu'], i, {});
            for (let key in this.SonTempData[i]) {
              if (key === 'id') {
                this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'needExamItemId', this.SonTempData[i][key]);
              }
            }
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'insertional', '');
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'spoActFasc', '');
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'spoActFib', '');
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'spoActWave', '');
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'volmuapamp', '');
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'volMuapdur', '');
            this.$set(this.EmgTypeData['patientNeedExamItemResu'][i], 'volmuappoly', '');
          }
          break;
        case 'motUniAnaItem':
          for (let i = 0; i < this.SonTempData.length; i++) {
            this.$set(this.EmgTypeData['patientMotUniAnaResu'], i, {});
            this.$set(this.EmgTypeData['patientMotUniAnaResu'][i], 'amplitude', '');
            this.$set(this.EmgTypeData['patientMotUniAnaResu'][i], 'conductionVelocity', '');
            this.$set(this.EmgTypeData['patientMotUniAnaResu'][i], 'distance', '');
            this.$set(this.EmgTypeData['patientMotUniAnaResu'][i], 'latency', '');
            this.$set(this.EmgTypeData['patientMotUniAnaResu'][i], 'latencyDifference', '');
            this.$set(this.EmgTypeData['patientMotUniAnaResu'][i], 'motNerItemId', '');
          }
          break;
        case 'motNerCondItem':
          for (let i = 0; i < this.SonTempData.length; i++) {
            this.$set(this.EmgTypeData['patientMotNerCondResu'], i, {});
            for (let key in this.SonTempData[i]) {
              if (key === 'id') {
                this.$set(this.EmgTypeData['patientMotNerCondResu'][i], 'motNerItemId', this.SonTempData[i][key]);
              }
            }
            this.$set(this.EmgTypeData['patientMotNerCondResu'][i], 'amplitude', '');
            this.$set(this.EmgTypeData['patientMotNerCondResu'][i], 'duration', '');
            this.$set(this.EmgTypeData['patientMotNerCondResu'][i], 'phases', '');
            this.$set(this.EmgTypeData['patientMotNerCondResu'][i], 'spikeDuration', '');
          }
          break;
        case 'intPatAnaItem':
          for (let i = 0; i < this.SonTempData.length; i++) {
            this.$set(this.EmgTypeData['patientIntPatAnaItem'], i, {});
            for (let key in this.SonTempData[i]) {
              if (key === 'id') {
                this.$set(this.EmgTypeData['patientIntPatAnaItem'][i], 'intPatAnaId', this.SonTempData[i][key]);
              }
            }
            this.$set(this.EmgTypeData['patientIntPatAnaItem'][i], 'amplitude', '');
            this.$set(this.EmgTypeData['patientIntPatAnaItem'][i], 'ratio', '');
            this.$set(this.EmgTypeData['patientIntPatAnaItem'][i], 'turn', '');
          }
          break;
        case 'fwavStuItem':
          for (let i = 0; i < this.SonTempData.length; i++) {
            this.$set(this.EmgTypeData['patienFWaStuResu'], i, {});
            for (let key in this.SonTempData[i]) {
              if (key === 'id') {
                this.$set(this.EmgTypeData['patienFWaStuResu'][i], 'fWavStuItemId', this.SonTempData[i][key]);
              }
            }
            this.$set(this.EmgTypeData['patienFWaStuResu'][i], 'fLatency', '');
            this.$set(this.EmgTypeData['patienFWaStuResu'][i], 'fProportion', '');
            this.$set(this.EmgTypeData['patienFWaStuResu'][i], 'mLatency', '');
          }
          break;
      }
    },
    editEnd() {
      this.tableMode = this.FATHER_OPEN;
    },
    cancel() {
      this.displayModal = false;
      this.EmgTypeData = {};
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
      let submitData = this.EmgTypeData;
      if (this.mode === this.ADD_NEW_CARD) {
        // 新增肌电图
        addEmg(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.cancel();
          this.lockSubmitButton = false;
        }, this._handleError);
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        // 修改肌电图
        modEmg(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.cancel();
          this.lockSubmitButton = false;
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.displayModal = false;
    },
    getWarningText(fieldName) {
      var warningResult = this.warningResults[fieldName];
      return warningResult ? warningResult : '';
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
    },
    getFieldValue(code, fieldName) {
      if (fieldName === 'emgName') {
        let info = Util.getElement('id', code, this.EmgNameArr);
        return info.emgName;
      } else if (fieldName === 'emgType') {
        let info = Util.getElement('typeCode', code, this.EmgTypeNameArrs);
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
    vueCopy(this.handleDictionary('eleType'), this.EmgTypeNameArrs);
  },
  watch: {
    dictionData: {
      handler: function(newVal) {
        if (newVal) {
          for (let i = 0; i < this.dictionData.length; i++) {
            if (this.dictionData[i]['id'] === this.EmgTypeData['elecTroGramId']) {
              vueCopy(this.dictionData[i], this.FatherTempData);
            }
          }
        }
      },
      deep: true
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

@field-height: 52px;
@field-name-width: 110px;
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
  .medicine-modal {
    position: relative;
    margin: auto;
    padding: 0 26px;
    top: 3%;
    width: 80%;
    max-width: 1090px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      .field {
        padding: 5px 0;
        text-align: left;
        display: inline-block;
        position: relative;
        width: 90%;
        height: @field-height;
        text-align: left;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 4%;
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
        padding: 0;
        line-height: 40px;
        font-size: @normal-font-size;
        color: @font-color;
        margin: 0;
        text-align: center;
        padding-top: 20px;
      }
      .form-wrapper {
        position: relative;
        max-height: 300px;
        height: auto;
        width: 99%;
        padding-right: 10px;
        overflow: hidden;
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
          &.font-change {
            font-size: 12px !important;
          }
          .row {
            height: 45px;
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
                color: @theme-color;
                text-decoration: underline;
                cursor: pointer;
                margin-right: 8px;
              }
              &.col-width5 {
                width: 5%;
                min-width: 40px;
              }
              &.col-width10 {
                width: 10%;
              }
              &.col-width15 {
                width: 15%;
              }
              &.col-width20 {
                width: 20%;
              }
              &.col-width25 {
                width: 25%;
              }
              &.col-width30 {
                width: 30%;
              }
              &.col-width18 {
                width: 18%;
              }
              &.col-width7 {
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
