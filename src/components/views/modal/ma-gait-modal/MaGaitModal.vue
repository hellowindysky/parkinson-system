<template lang="html">
  <div class="ma-gait-modal-wrapper">
    <div class="ma-gait-modal">
      <h3 class="title">{{title}}</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">
        <div class="field">
          <span class="field-name">
            采集开始时间：
          </span>
          </span>
            <span class="field-input">
              <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.acquisitionStartTime}}</span>
                <el-date-picker v-else
                  v-model="copyInfo.acquisitionStartTime"
                  placeholder="请选择开始时间"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerOptions">
                </el-date-picker>
            </span>
        </div>
        <div class="field">
          <span class="field-name">
            采集结束时间：
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.acquisitionEndTime}}</span>
              <el-date-picker v-else
                v-model="copyInfo.acquisitionEndTime"
                placeholder="请选择结束时间"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions">
              </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            设备型号：
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(copyInfo.equipmentModel, 'ma10')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select
              clearable
              placeholder="请选择设备型号"
              v-model="copyInfo.equipmentModel">
              <el-option
                v-for="item in getOptions('ma10')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
                </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            设备编号：
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.equipmentNumber}}</span>
            <el-input v-else placeholder="请输入设备编号" v-model="copyInfo.equipmentNumber" :maxlength="50"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查编号：
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.checkNumber}}</span>
            <el-input v-else placeholder="请输入检查编号" v-model="copyInfo.checkNumber" :maxlength="50"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            数据来源：
          </span>
          <span class="field-input">{{'手动录入'}}</span>
          <!-- <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{transform(copyInfo.dataSources, 'dataSources')}}</span>
          </span>
          <span class="field-input" v-else>
            <el-select
              clearable
              placeholder="请选择数据来源"
              v-model="copyInfo.dataSources">
              <el-option
                v-for="item in getOptions('dataSources')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
                </el-option>
            </el-select>
          </span> -->
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remark}}</span>
            <el-input v-else type="textarea" placeholder="请输入备注" v-model="copyInfo.remark" :maxlength="500"></el-input>
          </span>
        </div>
      </div>
      <div class="seperate-line"></div>
      <div class="content" v-if="hasTableExisted" ref="formWrapper">
        <table class="table">
          <tr class="row title-row">
            <td class="col col-width-35 endways">时空参数</td>
            <td class="col col-width-25">右&nbsp;&nbsp;侧</td>
            <td class="col col-width-25">左&nbsp;&nbsp;侧</td>
            <td class="col col-width-25">正&nbsp;&nbsp;常&nbsp;&nbsp;值</td>
          </tr>
          <tr class="row" v-for="(item, index) in maGait">
            <td class="col col-width-35" >{{item.typeName}}</td>
            <td class="col col-width-25" v-show="index <10">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{item.leftNormal}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"
                  v-model="item.leftNormal"
                  @blur="transformToNumber(item, 'leftNormal')">
              </el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{item.leftError}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"
                  v-model="item.leftError"
                  @blur="transformToNumber(item, 'leftError')">
                </el-input>
              </span>
            </td>
            <td class="col col-width-25" v-show="index <10">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{item.rightNormal}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"
                  v-model="item.rightNormal"
                  @blur="transformToNumber(item, 'rightNormal')">
                </el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{item.rightError}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"
                  v-model="item.rightError"
                  @blur="transformToNumber(item, 'rightError')">
                </el-input>
              </span>
            </td>
            <td class="col col-width-25" colspan=2 v-show="index >= 10">
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="left">{{item.dataNormal}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="left"
                  v-model="item.dataNormal"
                  @blur="transformToNumber(item, 'dataNormal')">
                </el-input>
              </span>
              <span>±</span>
              <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
                <span class="right">{{item.dataError}}</span>
              </span>
              <span class="field-input" v-else>
                <el-input class="right"
                  v-model="item.dataError"
                  @blur="transformToNumber(item, 'dataError')">
                </el-input>
              </span>
            </td>
            <td class="col col-width-25">{{item.referenceValue}}</td>
          </tr>
        </table>
      </div>

      </div>
      <div class="modal-footer">
      <span>
        <div class="button cancel-button" v-show="mode===ADD_NEW_CARD && !hasTableExisted || mode===VIEW_CURRENT_CARD && showEdit" @click="cancel">取消</div>
        <div class="button edit-button" v-show="mode===VIEW_CURRENT_CARD && showEdit" @click="switchToEditingMode">编辑</div>
        <div class="button submit-button" v-show="mode===ADD_NEW_CARD &&!hasTableExisted" @click="submit">确定</div>
      </span>
        <!-- <div class="button cancel-button"  @click="closeSubTable">返回</div> -->
      <span v-show="mode!==VIEW_CURRENT_CARD && hasTableExisted">
        <div class="button reset-button" @click="resetForm">重置</div>
        <div class="button submit-button" @click="submit">完成</div>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy, deepCopy, reviseDateFormat, pruneObj } from 'utils/helper';
import Util from 'utils/util.js';
import {queryPatientGaitInfo, addPatientMaGait, modifyPatientMaGait } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      lockSubmitButton: false,
      showEdit: false,

      FATHER_OPEN: 'fatherOpen',
      SON_OPEN: 'sonOpen',
      tableMode: '',
      type: '',
      typeCode: '',
      typeName: '',
      id: '',
      patientGaitMa: '',

      copyInfo: {},
      copyItem: {},   //  用来缓存传递进来的数据
      // subTableCode: '',
      ma10: [],
      data: [],
      maGait: [
        {
          'type': '1',
          'typeCode': 'ma10Parameters',
          'typeName': '步长（右）（m）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '2',
          'typeCode': 'ma10Parameters',
          'typeName': '跨步长（m）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '3',
          'typeCode': 'ma10Parameters',
          'typeName': '平均速度（m/s）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '4',
          'typeCode': 'ma10Parameters',
          'typeName': '摆动相（%）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '5',
          'typeCode': 'ma10Parameters',
          'typeName': '站立相（%）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '6',
          'typeCode': 'ma10Parameters',
          'typeName': '转身中的步数(右脚)',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '7',
          'typeCode': 'ma10Parameters',
          'typeName': '跨步时长（s）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '8',
          'typeCode': 'ma10Parameters',
          'typeName': '步频（step/minutes）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '9',
          'typeCode': 'ma10Parameters',
          'typeName': '手臂摆动角度 （degree/step）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '10',
          'typeCode': 'ma10Parameters',
          'typeName': '手臂最快角速度（degree/s）',
          'leftNormal': '',
          'leftError': '',
          'rightNormal': '',
          'rightError': '',
          'referenceValue': ''
        },
        {
          'type': '11',
          'typeCode': 'ma10Parameters',
          'typeName': '手臂摆动角度 （degree/step）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '12',
          'typeCode': 'ma10Parameters',
          'typeName': '手臂最快角速度（左右手平均 degree/s）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '13',
          'typeCode': 'ma10Parameters',
          'typeName': '步频（step/minutes）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '14',
          'typeCode': 'ma10Parameters',
          'typeName': '躯干旋转角度（沿重力方向）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '15',
          'typeCode': 'ma10Parameters',
          'typeName': '躯干旋转最快角速度（沿重力方向）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '16',
          'typeCode': 'ma10Parameters',
          'typeName': '双腿支撑相（%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '17',
          'typeCode': 'ma10Parameters',
          'typeName': '步速对称相 （%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '18',
          'typeCode': 'ma10Parameters',
          'typeName': '步长对称相 （%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '19',
          'typeCode': 'ma10Parameters',
          'typeName': '摆动对称相 （%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '20',
          'typeCode': 'ma10Parameters',
          'typeName': '站立对称相 （%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '21',
          'typeCode': 'ma10Parameters',
          'typeName': '大腿角速度对称相 （%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '22',
          'typeCode': 'ma10Parameters',
          'typeName': '大腿最大角速度对称相 （%）',
          'dataNormal': '',
          'dataError': ''
        },
        {
          'type': '23',
          'typeCode': 'ma10Parameters',
          'typeName': '手臂摆动时间对称相（%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '24',
          'typeCode': 'ma10Parameters',
          'typeName': '大腿活动对称（SSI）（%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '25',
          'typeCode': 'ma10Parameters',
          'typeName': '协调相位差 （%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '26',
          'typeCode': 'ma10Parameters',
          'typeName': '协调相指数（%）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '27',
          'typeCode': 'ma10Parameters',
          'typeName': '坐到站时间 （s）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '28',
          'typeCode': 'ma10Parameters',
          'typeName': '由坐到站过程中最快角速度（degree/s）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '29',
          'typeCode': 'ma10Parameters',
          'typeName': '由坐到站过程中侧面变化的角度（degree）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '30',
          'typeCode': 'ma10Parameters',
          'typeName': '站到坐所花时间（s）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '31',
          'typeCode': 'ma10Parameters',
          'typeName': '由站到坐过程中最快角速度（degree/s）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '32',
          'typeCode': 'ma10Parameters',
          'typeName': '整个实验过程中的身体躯干变化的角度（由侧面观察）（degree）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '33',
          'typeCode': 'ma10Parameters',
          'typeName': '每一步身体躯干变化的角度（由侧面观察）（degree）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        },
        {
          'type': '34',
          'typeCode': 'ma10Parameters',
          'typeName': '整个实验过程中最快角速度（由侧面观察）（degree/s）',
          'dataNormal': '',
          'dataError': '',
          'referenceValue': ''
        }
      ],
      warningResults: {
        equipmentModel: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    hasTableExisted() {
      this.updateScrollbar();
      return this.copyInfo.equipmentModel === 1;
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增MA10';
      } else {
        return 'MA10';
      }
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.id = item.id;

      this.tableMode = this.FATHER_OPEN;
      this.initCopyInfo();
      this.copyItem = item;
      if (this.copyItem.equipmentModel) {
        this.copyItem.equipmentModel = Number(this.copyItem.equipmentModel);
      }
      if (this.copyItem.dataSources) {
        this.copyItem.dataSources = Number(this.copyItem.dataSources);
      }
      vueCopy(this.copyItem, this.copyInfo);
      vueCopy(item.maGait, this.maGait);

      this.$nextTick(() => {
        this.clearWarning();
      });
      this.updateScrollbar();
    },
    initCopyInfo() {
      this.copyInfo = {};
      this.$set(this.copyInfo, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.copyInfo, 'patientId', this.$route.params.id);
      this.$set(this.copyInfo, 'acquisitionStartTime', '');
      this.$set(this.copyInfo, 'acquisitionEndTime', '');
      this.$set(this.copyInfo, 'equipmentModel', '');
      this.$set(this.copyInfo, 'dataSources', '');
      this.$set(this.copyInfo, 'equipmentNumber', '');
      this.$set(this.copyInfo, 'checkNumber', '');
      this.$set(this.copyInfo, 'remark', '');

      // this.initSubTableData();
      this.updateScrollbar();
    },
    resetForm() {
      for (let item of this.maGait) {
        item.leftNormal = '';
        item.leftError = '';
        item.rightNormal = '';
        item.rightError = '';
        item.dataNormal = '';
        item.dataError = '';
      };
    },
    updataPatientGaitMaInfo(type, typeCode, typeName) {
      let id = this.id;
      queryPatientGaitInfo(type, typeCode, id).then((patientGaitMa) =>{
        // this.subTableCode = typeCode;
        this.tableMode = this.SON_OPEN;
        this.maGait = patientGaitMa.maGait;
        this.type = type;
        this.typeName = typeName;
        // console.log(type, typeCode, typeName);
        this.updateScrollbar();
      });
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.updateWarning('equipmentModel');
      if (this.warningResults.equipmentModel !== '') {
        this.lockSubmitButton = false;
        return;
      }

      let submitData = deepCopy(this.copyInfo);
      submitData.patientCaseId = this.$route.params.caseId;
      submitData.patientGaitMa = this.patientGaitMa;
      submitData.equipmentModel = submitData.equipmentModel;
      submitData.dataSources = submitData.dataSources;
      submitData.equipmentNumber = submitData.equipmentNumber;
      submitData.checkNumber = submitData.checkNumber;
      submitData.remark = submitData.remark;
      submitData.acquisitionStartTime = Util.simplifyTime(submitData.acquisitionStartTime, false);
      submitData.acquisitionEndTime = Util.simplifyTime(submitData.acquisitionEndTime, false);

      submitData.maGait = deepCopy(this.maGait);

      reviseDateFormat(submitData);
      pruneObj(submitData);
      if (this.mode === this.ADD_NEW_CARD) {
        addPatientMaGait(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        // delete submitData.patientSpephysicalId;
        submitData.id = submitData.id;
        modifyPatientMaGait(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    closeSubTable() {
      this.tableMode = this.FATHER_OPEN;
      this.updateScrollbar();
      // this.$refs.gaitPostureModal.scrollTop = 0;
      // this.$refs.formWrapper.scrollTop = 0;
    },
    getOptions(fieldName) {
      var options = [];
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    transformToNumber(obj, property, decimalDigits) {
      var value = parseFloat(obj[property]);
      if (obj[property] !== '' && obj[property] !== value) {
        obj[property] = isNaN(value) ? '' : value;
      }
      if (decimalDigits !== undefined && obj[property] !== '') {
        obj[property] = Number(obj[property].toFixed(decimalDigits));
      }
    },
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    updateWarning(fieldName) {
      if (this.copyInfo[fieldName] === undefined || this.copyInfo[fieldName] === '') {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.formWrapper) {
          Ps.destroy(this.$refs.formWrapper);
          Ps.initialize(this.$refs.formWrapper, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs.scrollArea) {
          Ps.destroy(this.$refs.scrollArea);
          Ps.initialize(this.$refs.scrollArea, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_MA_GAIT_MODAL, this.showPanel);
    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_MA_GAIT_MODAL);
  },
  watch: {
    tableTypes() {
      this.initSubTableData();
      vueCopy(this.copyItem, this.copyInfo);
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.ma-gait-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .ma-gait-modal {
    position: relative;
    margin: auto;
    top: 5%;
    width: 600px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .moveLeft {
      text-align: left;
      margin-top: 10px;
    }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .large-icon {
      font-size: @large-font-size;
    }
    .modal-body {
      position: relative;
      max-height: 80%;
      overflow-y: auto;
      padding: 0 30px;
      overflow-x: hidden;
    }

    .modal-footer {
      position: relative;
      bottom: 0px;
    }
    .content {
      text-align: left;
      font-size: 0;
      position: relative;
      margin-top: 5px;
      max-height: 600px;
      height: auto;
      width: 100%;
      padding-bottom: 5px;
      overflow: hidden;
      box-sizing: border-box;
      // border: 1px solid @inverse-font-color;
    .field {
      display: inline-block;
      position: relative;
      width: 50%;
      min-height: 45px;
      line-height: @field-line-height;
      box-sizing: border-box;
      text-align: left;
      vertical-align: top;
      transform: translate3d(10px, 5px, 0);
      // overflow: hidden;
      &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width}");
          }
        }
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: @field-name-width;
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @font-color;
      }
      .field-input {
        display: inline-block;
        position: relative;
        left: @field-name-width;
        width: calc(~"96% - @{field-name-width}");
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        &.zero-font-size {
          font-size: 0;
        }
        .warning-text {
          position: absolute;
          top: 22px;
          left: 10px;
          height: 15px;
          color: red;
          font-size: @small-font-size;
          &.right {
            left: calc(~"60% + 10px");
          }
        }
        .el-input {
          transform: translateY(-3px);
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
        }
        .el-textarea {
          margin-bottom: 15px;
          vertical-align: middle;
          transform: translateY(-3px);
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
        .warning .el-input__inner, .warning .el-textarea__inner {
          border: 1px solid red;
        }
      }
    }
    .form-title {
      margin: 0;
      padding: 0;
      line-height: 40px;
      font-size: @normal-font-size;
      color: @font-color;
      text-align: center;
    }
    .table {
      // margin: 10px 0 20px;
      width: 100%;
      border: 1px solid @light-gray-color;
      border-collapse: collapse;
      text-align: center;
      &.small-font {
        font-size: @small-font-size !important;
      }
      .row {
        height: 40px;
        font-size: @normal-font-size;
        &.title-row {
          background-color: @font-color;
          color: #fff;
          vertical-align: middle;
        }
        .col {
          position: relative;
          width: 10%;
          border: 1px solid @light-gray-color;
           .text-button {
              margin: 0 5px;
              color: @theme-color;
              line-height: 20px;
              border-bottom: 1px solid @theme-color;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }

          &.col-width-5 {
              width: 5%;
            }
          &.col-width-1 {
              width: 1%;
              min-width: 30px;
              letter-spacing: 2px;
              &.endways {
                background-color: @font-color;
                color: #fff;
              }
            }
          &.col-width-20 {
              width: 20%;
            }
          &.col-width-35 {
              width: 35%;
            }
          &.col-width-25 {
              width: 25%;
            }
          &.col-width-30 {
              width: 30%;
            }
          &.title-col {
            background-color: @font-color;
            color: #fff;
          }
          .el-input {
            width: 100%;
            &.warning {
              margin: -1px;
              border: 1px solid red;
            }
            .el-input__inner {
              padding: 0;
              border: none;
              text-align: center;
            }
            .el-input__icon {
              &.el-icon-date {
                width: 12px;
                height: 12px;
                padding: 0 0 18px 10px;
                opacity: 0.3;
              }
              &.el-icon-close {
                width: 12px;
                height: 12px;
                padding: 0 0 18px 10px;
                color: @alert-color;
              }
            }
            &.is-disabled {
              .el-input__inner {
                background-color: rgba(0,0,0,0);
                color: @font-color;
              }
              .el-input__icon {
                display: none;
              }
            }
          }
          .left {
              display: inline-block;
              position: absolute;
              width: 45%;
              height: 100%;
              left: 0;
              top: 0;
              line-height: 43px;
            }
            .right {
              display: inline-block;
              position: absolute;
              width: 45%;
              height: 100%;
              right: 0;
              top: 0;
              line-height: 43px;
            }
          .el-select {
            &.warning {
              .el-input {
                margin: -1px;
                border: 1px solid red;
              }
            }
          }
        }
      }
    }
  }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
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
      &.submit-button, &.edit-button {
        background-color: @button-color;
      }
      &.reset-button {
        background-color: @font-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.btn-margin {
        margin-top: 10px;
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0px;
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
