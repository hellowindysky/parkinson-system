<template lang="html">
  <div class="dbs-modal-wrapper">
    <div class="dbs-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            设备品牌
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{getFieldValue(copyInfo.deviceId, 'deviceId')}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.deviceId}}</span>
            <el-select v-model="copyInfo.deviceId" @change="changeDevice" :class="{'warning': warningResults.deviceId}">
              <el-option v-for="option in getOptions('deviceId')" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">设备类型</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{getFieldValue(copyInfo.devicePowerType, 'devicePowerType')}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="copyInfo.devicePowerType">
              <el-option label="充电" :value="1"></el-option>
              <el-option label="不充电" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">患者编码</span>
          <span class="field-input">
            {{dbsPatientCode}}
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            程控时间
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.programDate}}
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.programDate}}</span>
            <el-date-picker
              v-model="copyInfo.programDate"
              @change="updateWarning('programDate')"
              placeholder="请选择程控时间"
              :picker-options="pickerOptions"
              :class="{'warning': warningResults.programDate}"></el-date-picker>
          </span>
        </div>
        <div class="field whole-line double-line">
          <span class="field-name">备注</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.remarks}}
          </span>
          <span class="field-input" v-else>
            <el-input type="textarea" v-model="copyInfo.remarks" :maxlength="300" placeholder="请输入备注"></el-input>
          </span>
        </div>
        <div class="seperate-line"></div>
        <div class="field">
          <span class="field-name">首次开机</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{modelType === 1 ? '是' : '否'}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="modelType" :disabled="mode !== ADD_NEW_CARD" @change="selectFirstOrFollow">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="modelType===0">
          <span class="field-name">上次程控时间</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{lastProgramDate}}
          </span>
          <span class="field-input" v-else>
            <el-date-picker
            v-model="lastProgramDate"
            :picker-options="pickerOptions"
            placeholder="请选择上次程控时间"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">服药情况</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{getFieldValue(copyInfo.isTakeMedication, 'isTakeMedication')}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="copyInfo.isTakeMedication" @change="updateField('isTakeMedication')">
              <el-option label="有" :value="1"></el-option>
              <el-option label="无" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <table class="medicine-table" v-if="copyInfo.isTakeMedication===1">
          <tr class="row title-row">
            <td class="col">
              <span v-if="mode!==VIEW_CURRENT_CARD && copyInfo.patientDbsMedicine.length < 15"
                class="iconfont icon-plus" @click="addMedicine"></span>
              序号
            </td>
            <td class="col">药物商品名</td>
            <td class="col">规格</td>
            <td class="col">日用量(片)</td>
            <td class="col">日总剂量(mg)</td>
            <td class="col">LEDD(mg)</td>
          </tr>
          <tr class="row" v-for="(medicine, index) in copyInfo.patientDbsMedicine">
            <td class="col">
              {{getLetterIndex(index)}}
              <span v-if="mode!==VIEW_CURRENT_CARD" class="iconfont icon-remove"
                @click="removeMedicine(index)"></span>
            </td>
            <td class="col">
              <el-select v-model="medicine.medicineId" :disabled="mode===VIEW_CURRENT_CARD"
                @change="selectMedicine(medicine)" :class="{'warning': !isMedicineValid(medicine)}" >
                <el-option v-for="(option, i) in getOptions('medicineName')" :label="option.name"
                  :value="option.code" :key="'medicineId'+i"></el-option>
              </el-select>
            </td>
            <td class="col">
              <el-select v-if="checkIfCommonMedicine(medicine.medicineId)"
                v-model="medicine.medicalSpecUsed" :disabled="mode===VIEW_CURRENT_CARD">
                <el-option v-for="option in getOptions('medicineSpec', medicine.medicineId)" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
              <el-input v-else v-model="medicine.medicalSpecUsed"
                :disabled="mode===VIEW_CURRENT_CARD"
                @blur="transformToNum(medicine, 'medicalSpecUsed')"></el-input>
            </td>
            <td class="col">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{medicine.takeDose}}
              </span>
              <el-input v-else v-model="medicine.takeDose"
                @blur="transformToNum(medicine, 'takeDose')"></el-input>
            </td>
            <td class="col" :class="{'computed-cell': checkIfCommonMedicine(medicine.medicineId)}">
              <span v-if="checkIfCommonMedicine(medicine.medicineId)">
                {{getDayTotalDose(medicine)}}
              </span>
              <span v-else-if="mode===VIEW_CURRENT_CARD">
                {{medicine.totalMeasure}}
              </span>
              <el-input v-else v-model="medicine.totalMeasure"
                @blur="transformToNum(medicine, 'totalMeasure')"></el-input>
            </td>
            <td class="col" :class="{'computed-cell': checkIfCommonMedicine(medicine.medicineId)}">
              <span v-if="checkIfCommonMedicine(medicine.medicineId)">
                {{getLEDD(medicine)}}
              </span>
              <span v-else-if="mode===VIEW_CURRENT_CARD">
                {{medicine.ledd}}
              </span>
              <el-input v-else v-model="medicine.ledd"
                @blur="transformToNum(medicine, 'ledd', 4)"></el-input>
            </td>
          </tr>
        </table>
        <!-- <div class="field" v-show="copyInfo.isTakeMedication===1">
          <span class="field-name">服用药物</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.medicationStatus}}
          </span>
          <span class="field-input" v-else>
            <el-input v-model="copyInfo.medicationStatus" placeholder="请输入服用药物"></el-input>
          </span>
        </div> -->
        <div class="field" v-show="modelType===1">
          <span class="field-name">微毁损效应</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{getFieldValue(copyInfo.damageEffectExist, 'damageEffectExist')}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="copyInfo.damageEffectExist" @change="updateField('damageEffectExist')">
              <el-option label="有" :value="1"></el-option>
              <el-option label="无" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="modelType===1 && copyInfo.damageEffectExist===1">
          <span class="field-name long-field-name">微毁损效应持续时间</span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.damageEffectDuration}}
          </span>
          <span class="field-input long-field-name" v-else>
            <el-input v-model="copyInfo.damageEffectDuration" placeholder="请输入微毁损效应持续时间"></el-input>
          </span>
        </div>
        <div class="field" v-show="modelType===1">
          <span class="field-name">术后不良事件</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{getFieldValue(copyInfo.adverseEventsExist, 'adverseEventsExist')}}
          </span>
          <span class="field-input" v-else>
            <el-select v-model="copyInfo.adverseEventsExist" @change="updateField('adverseEventsExist')">
              <el-option label="有" :value="1"></el-option>
              <el-option label="无" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line double-line" v-show="modelType===1 && copyInfo.adverseEventsExist===1">
          <span class="field-name">不良事件描述</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.adverseEventsRemark}}
          </span>
          <span class="field-input" v-else>
            <el-input type="textarea" v-model="copyInfo.adverseEventsRemark" :maxlength="300" placeholder="请输入不良事件描述"></el-input>
          </span>
        </div>
        <div class="field whole-line double-line" v-show="modelType===0">
          <span class="field-name">患者主诉</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.complaint}}
          </span>
          <span class="field-input" v-else>
            <el-input type="textarea" v-model="copyInfo.complaint" :maxlength="300" placeholder="请输入患者主诉"></el-input>
          </span>
        </div>
        <div class="field whole-line double-line" v-show="modelType===0">
          <span class="field-name">效果及副作用</span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            {{copyInfo.effectInfo}}
          </span>
          <span class="field-input" v-else>
            <el-input type="textarea" v-model="copyInfo.effectInfo" :maxlength="300" placeholder="请输入效果及副作用"></el-input>
          </span>
        </div>
      </div>

      <div class="form-tab-wrapper" v-show="modelType===1">
        <span class="form-tab left" :class="{'on':currentFormSide==='left'}"
          @click="chooseCurrentFormSide('left')">
          左侧肢体
          <span class="form-tab-bottom" :class="currentFormSide"></span>
        </span>
        <span class="form-tab right" :class="{'on':currentFormSide==='right'}"
          @click="chooseCurrentFormSide('right')">
          右侧肢体
        </span>
      </div>

      <div class="form-wrapper form0-wrapper" :class="formOffsetClass"
        ref="form0" v-show="modelType===1">
        <div class="form-left" v-show="currentFormSide==='left'">
          <table class="form form0">
            <tr class="row top-row">
              <td class="col sort-info" colspan="16">
                左侧肢体(右侧STN)触点疗效排序为:
                <span v-for="(contact, index) in getSideDeviceContact('left')">
                  <span v-show="index !== 0">&gt;</span>
                  <span class="contact narrow" v-if="mode===VIEW_CURRENT_CARD">
                    {{getFieldValue(leftContactSortArray[index], 'leftContact')}}
                  </span>
                  <el-select class="contact" v-else v-model="leftContactSortArray[index]"
                    @change="updateLeftContactOrder" :clearable="true">
                    <el-option v-for="option in getOptions('leftContact')" :label="option.name"
                      :value="option.code" :key="option.code"></el-option>
                  </el-select>
                </span>
              </td>
            </tr>
            <tr class="row title-row">
              <td class="col w1" rowspan="2">Case</td>
              <td class="col w1" rowspan="2">Contact</td>
              <td class="col w1" rowspan="2">
                电压(V)
              </td>
              <td class="col w4" colspan="4">肌张力</td>
              <td class="col w1" rowspan="2">震颤</td>
              <td class="col w1" rowspan="2">总和</td>
              <td class="col w1" rowspan="2">异动</td>
              <td class="col w4" rowspan="2" colspan="4">副作用</td>
              <td class="col w2" rowspan="2" colspan="2">副作用持续时间</td>
            </tr>
            <tr class="row title-row">
              <td class="col w1">肘</td>
              <td class="col w1">腕</td>
              <td class="col w1">膝</td>
              <td class="col w1">颈</td>
            </tr>
            <tr class="row" v-for="(group, index) in getDeviceGroups('left')">
              <td class="col w1" :rowspan="voltageCount" v-show="group.isFirstVoltage">C+</td>
              <td class="col w1" :rowspan="voltageCount" v-show="group.isFirstVoltage">{{group.contact}}</td>
              <td class="col w1">
                {{group.voltage}}
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].elbowTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].elbowTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].wristTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].wristTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].kneeTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].kneeTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].neckTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].neckTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].tremor}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].tremor"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                {{copyInfo.patientDbsFirstDetail[index].tensionTone}}
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].changeConstantly}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].changeConstantly"></el-input>
              </td>
              <td class="col w4" colspan="4">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[index].sideEffect}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[index].sideEffect"></el-input>
              </td>
              <td class="col w2" colspan="2">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{getFieldValue(copyInfo.patientDbsFirstDetail[index].sideEffectDuration, 'duration')}}
                </span>
                <el-select v-else v-model="copyInfo.patientDbsFirstDetail[index].sideEffectDuration">
                  <el-option v-for="option in getOptions('duration')" :label="option.name" :value="option.code" :key="option.code"></el-option>
                </el-select>
              </td>
            </tr>
          </table>
        </div>
        <div class="form-right" v-show="currentFormSide==='right'">
          <table class="form form0">
            <tr class="row top-row">
              <td class="col sort-info" colspan="16">
                右侧肢体(左侧STN)触点疗效排序为:
                <span v-for="(contact, index) in getSideDeviceContact('right')">
                  <span v-show="index !== 0">&gt;</span>
                  <span class="contact narrow" v-if="mode===VIEW_CURRENT_CARD">
                    {{getFieldValue(rightContactSortArray[index], 'rightContact')}}
                  </span>
                  <el-select class="contact" v-else v-model="rightContactSortArray[index]"
                    @change="updateRightContactOrder" :clearable="true">
                    <el-option v-for="option in getOptions('rightContact')"
                      :label="option.name" :value="option.code" :key="option.code"></el-option>
                  </el-select>
                </span>
              </td>
            </tr>
            <tr class="row title-row">
              <td class="col w1" rowspan="2">Case</td>
              <td class="col w1" rowspan="2">Contact</td>
              <td class="col w1" rowspan="2">
                电压(V)
              </td>
              <td class="col w4" colspan="4">肌张力</td>
              <td class="col w1" rowspan="2">震颤</td>
              <td class="col w1" rowspan="2">总和</td>
              <td class="col w1" rowspan="2">异动</td>
              <td class="col w4" rowspan="2" colspan="4">副作用</td>
              <td class="col w2" rowspan="2" colspan="2">副作用持续时间</td>
            </tr>
            <tr class="row title-row">
              <td class="col w1">肘</td>
              <td class="col w1">腕</td>
              <td class="col w1">膝</td>
              <td class="col w1">颈</td>
            </tr>
            <tr class="row" v-for="(group, index) in getDeviceGroups('right')">
              <td class="col w1" :rowspan="voltageCount" v-show="group.isFirstVoltage">C+</td>
              <td class="col w1" :rowspan="voltageCount" v-show="group.isFirstVoltage">{{group.contact}}</td>
              <td class="col w1">
                {{group.voltage}}
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].elbowTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].elbowTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].wristTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].wristTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].kneeTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].kneeTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].neckTone}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].neckTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].tremor}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].tremor"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].tensionTone}}
              </td>
              <td class="col w1">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].changeConstantly}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].changeConstantly"></el-input>
              </td>
              <td class="col w4" colspan="4">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].sideEffect}}
                </span>
                <el-input v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].sideEffect"></el-input>
              </td>
              <td class="col w2" colspan="2">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{getFieldValue(copyInfo.patientDbsFirstDetail[getRightIndex(index)].sideEffectDuration, 'duration')}}
                </span>
                <el-select v-else v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].sideEffectDuration">
                  <el-option v-for="option in getOptions('duration')" :label="option.name" :value="option.code" :key="option.code"></el-option>
                </el-select>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="form-wrapper" ref="form1" v-show="modelType===0">
        <table class="form form1">
          <tr class="row top-row">
            <td class="col" colspan="22">
              调整前参数
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">疗效满意度</td>
            <td class="col w2" colspan="2">左侧</td>
            <td class="col w8" colspan="8">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{getFieldValue(copyInfo.adjustBeforeLeftSatisfaction, 'satisfaction')}}
              </span>
              <el-select v-else v-model="copyInfo.adjustBeforeLeftSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{getFieldValue(copyInfo.adjustBeforeRightSatisfaction, 'satisfaction')}}
              </span>
              <el-select v-else v-model="copyInfo.adjustBeforeRightSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">方案</td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">
              刺激模式
              <span class="iconfont icon-question" @click="showMoreInfo"></span>
            </td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w4" colspan="4">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
            <td class="col w1" colspan="1">电量<br></br>(V)</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustBeforeParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              <el-select v-model="followDbsAdjustBeforeFirstSchemeOrder" @change="selectFollowDbsAdjustBeforeFirstSchemeOrder"
                :disabled="mode===VIEW_CURRENT_CARD">
                <el-option v-for="(p, i) in lastDbsParameter" v-show="i % 2 === 0"
                  :label="getFollowDbsAdjustBeforePlanName(p)" :value="p.schemeOrder" :key="p.schemeOrder">
                </el-option>
                <el-option label="自定义" :value="0">
                </el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod" :disabled="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustBeforeParamPole[index].positive" @change="updateParamPole('followDbsAdjustBefore', index)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)" :label="contact" :key="contact"
                  :disabled="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="followDbsAdjustBeforeParamPole[index].negative" @change="updateParamPole('followDbsAdjustBefore', index)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)" :label="contact" :key="contact"
                  :disabled="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0">{{param.frequency}}</span>
              <el-input v-else v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0">{{param.pulseWidth}}</span>
              <el-input v-else v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0">{{param.voltage}}</span>
              <el-input v-else v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0">{{param.resistance}}</span>
              <el-input v-else v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD || followDbsAdjustBeforeFirstSchemeOrder!==0">{{param.electric}}</span>
              <el-input v-else v-model="param.electric"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.electricity}}</span>
              <el-input v-else v-model="param.electricity"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form2" v-show="modelType===0">
        <table class="form form2">
          <tr class="row top-row">
            <td class="col" colspan="26">
              单纯调整电压（总增幅 ≤ 0.4V）
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">疗效满意度</td>
            <td class="col w2" colspan="2">左侧</td>
            <td class="col w8" colspan="10">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{getFieldValue(copyInfo.adjustVoltageLeftSatisfaction, 'satisfaction')}}
              </span>
              <el-select v-else v-model="copyInfo.adjustVoltageLeftSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="10">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{getFieldValue(copyInfo.adjustVoltageRightSatisfaction, 'satisfaction')}}
              </span>
              <el-select v-else v-model="copyInfo.adjustVoltageRightSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('followDbsAdjustVoltage')"
                v-show="copyInfo.followDbsParams.adjustVoltageParameter.length < 8 && mode!==VIEW_CURRENT_CARD">
              </span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">
              刺激模式
              <span class="iconfont icon-question" @click="showMoreInfo"></span>
            </td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w4" colspan="4">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w3" colspan="3">效果及副作用</td>
            <td class="col w3" colspan="4">备注</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustVoltageParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFollowDbsAdjustVoltagePlanName(param)}}
              <span class="iconfont icon-remove" v-show="mode!==VIEW_CURRENT_CARD"
                @click="removeParam(index, 'followDbsAdjustVoltage')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod" :disabled="mode===VIEW_CURRENT_CARD">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustVoltageParamPole[index].positive"
                @change="updateParamPole('followDbsAdjustVoltage', index)"
                :max="getMaxNumOfContact(param.exciteMod, true)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, true)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="followDbsAdjustVoltageParamPole[index].negative"
                @change="updateParamPole('followDbsAdjustVoltage', index)"
                :max="getMaxNumOfContact(param.exciteMod, false)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, false)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.frequency}}</span>
              <el-input v-else v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.pulseWidth}}</span>
              <el-input v-else v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.voltage}}</span>
              <el-input v-else v-model="param.voltage"></el-input>
            </td>
            <td class="col w3" colspan="3">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.effectInfo}}</span>
              <el-input v-else v-model="param.effectInfo"></el-input>
            </td>
            <td class="col w4 single-row" colspan="4">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.remarks}}</span>
              <el-input v-else v-model="param.remarks"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form3" v-show="modelType===0">
        <table class="form form3">
          <tr class="row top-row">
            <td class="col" colspan="26">
              调整多个参数
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">疗效满意度</td>
            <td class="col w2" colspan="2">左侧</td>
            <td class="col w8" colspan="10">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{getFieldValue(copyInfo.adjustMoreLeftSatisfactionRightSatisfaction, 'satisfaction')}}
              </span>
              <el-select v-else v-model="copyInfo.adjustMoreLeftSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="10">
              <span v-if="mode===VIEW_CURRENT_CARD">
                {{getFieldValue(copyInfo.adjustMoreRightSatisfaction, 'satisfaction')}}
              </span>
              <el-select v-else v-model="copyInfo.adjustMoreRightSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('followDbsAdjustMore')"
                v-show="copyInfo.followDbsParams.adjustMoreParameter.length < 8 && mode!==VIEW_CURRENT_CARD">
              </span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">
              刺激模式
              <span class="iconfont icon-question" @click="showMoreInfo"></span>
            </td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w4" colspan="5">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
            <td class="col w3" colspan="4">备注</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustMoreParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFollowDbsAdjustMorePlanName(param)}}
              <span class="iconfont icon-remove" v-show="mode!==VIEW_CURRENT_CARD"
                @click="removeParam(index, 'followDbsAdjustMore')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod" :disabled="mode===VIEW_CURRENT_CARD">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustMoreParamPole[index].positive"
                @change="updateParamPole('followDbsAdjustMore', index)"
                :max="getMaxNumOfContact(param.exciteMod, true)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, true)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustMoreParamPole[index].negative"
                @change="updateParamPole('followDbsAdjustMore', index)"
                :max="getMaxNumOfContact(param.exciteMod, false)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, false)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.frequency}}</span>
              <el-input v-else v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.pulseWidth}}</span>
              <el-input v-else v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.voltage}}</span>
              <el-input v-else v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.resistance}}</span>
              <el-input v-else v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.electric}}</span>
              <el-input v-else v-model="param.electric"></el-input>
            </td>
            <td class="col w4 single-row" colspan="4">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.remarks}}</span>
              <el-input v-else v-model="param.remarks"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form4" v-show="modelType===0">
        <table class="form form4">
          <tr class="row top-row">
            <td class="col" colspan="26">
              程控完成参数
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w1" colspan="1">最终<br>参数</td>
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('followDbsAdjustAfter')"
                v-show="copyInfo.followDbsParams.adjustAfterParameter.length < 8 && mode!==VIEW_CURRENT_CARD">
              </span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">
              刺激模式
              <span class="iconfont icon-question" @click="showMoreInfo"></span>
            </td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w5" colspan="5">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
            <td class="col w3" colspan="3">备注</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustAfterParameter">
            <td class="col w1" colspan="1" rowspan="2" v-show="index % 2 === 0">
              <el-checkbox v-model="followDbsAdjustAfterParameterChosenStatus[parseInt(index / 2, 10)]"
                @change="checkAfterParameterChosenStatus('followDbs', parseInt(index / 2, 10))">
              </el-checkbox>
            </td>
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFollowDbsAdjustAfterPlanName(param)}}
              <span class="iconfont icon-remove"
                v-show="mode!==VIEW_CURRENT_CARD && copyInfo.followDbsParams.adjustAfterParameter.length > 2"
                @click="removeParam(index, 'followDbsAdjustAfter')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod" :disabled="mode===VIEW_CURRENT_CARD">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustAfterParamPole[index].positive"
                @change="updateParamPole('followDbsAdjustAfter', index)"
                :max="getMaxNumOfContact(param.exciteMod, true)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, true)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustAfterParamPole[index].negative"
                @change="updateParamPole('followDbsAdjustAfter', index)"
                :max="getMaxNumOfContact(param.exciteMod, false)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, false)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.frequency}}</span>
              <el-input v-else v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.pulseWidth}}</span>
              <el-input v-else v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.voltage}}</span>
              <el-input v-else v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.resistance}}</span>
              <el-input v-else v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.electric}}</span>
              <el-input v-else v-model="param.electric"></el-input>
            </td>
            <td class="col w3 single-row" colspan="3">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.remarks}}</span>
              <el-input v-else v-model="param.remarks"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form5" v-show="modelType===1">
        <table class="form form5">
          <tr class="row top-row">
            <td class="col" colspan="26">
              开机完成参数
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w1" colspan="1">最终<br>参数</td>
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('firstDbsAdjustAfter')"
                v-show="copyInfo.firstDbsParams.adjustAfterParameter.length < 8 &&
                mode !== VIEW_CURRENT_CARD"></span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">
              刺激模式
              <span class="iconfont icon-question" @click="showMoreInfo"></span>
            </td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w5" colspan="5">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
            <td class="col w3" colspan="3">备注</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.firstDbsParams.adjustAfterParameter">
            <td class="col w1" colspan="1" rowspan="2" v-show="index % 2 === 0">
              <el-checkbox v-model="firstDbsAdjustAfterParameterChosenStatus[parseInt(index / 2, 10)]"
                @change="checkAfterParameterChosenStatus('firstDbs', parseInt(index / 2, 10))"
                :disabled="mode===VIEW_CURRENT_CARD">
              </el-checkbox>
            </td>
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFirstDbsAdjustAfterPlanName(param)}}
              <span class="iconfont icon-remove"
                v-show="mode !== VIEW_CURRENT_CARD && copyInfo.firstDbsParams.adjustAfterParameter.length > 2"
                @click="removeParam(index, 'firstDbsAdjustAfter')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod" :disabled="mode === VIEW_CURRENT_CARD">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="firstDbsAdjustAfterParamPole[index].positive"
                @change="updateParamPole('firstDbsAdjustAfter', index)"
                :max="getMaxNumOfContact(param.exciteMod, true)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, true)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="firstDbsAdjustAfterParamPole[index].negative"
                @change="updateParamPole('firstDbsAdjustAfter', index)"
                :max="getMaxNumOfContact(param.exciteMod, false)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)"
                  :label="contact" :key="contact"
                  :disabled="checkIfDisabledContact(param.exciteMod, contact, false)">
                </el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.frequency}}</span>
              <el-input v-else v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.pulseWidth}}</span>
              <el-input v-else v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.voltage}}</span>
              <el-input v-else v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.resistance}}</span>
              <el-input v-else v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.electric}}</span>
              <el-input v-else v-model="param.electric"></el-input>
            </td>
            <td class="col w3 single-row" colspan="3">
              <span v-if="mode===VIEW_CURRENT_CARD">{{param.remarks}}</span>
              <el-input v-else v-model="param.remarks"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit" v-if="mode!==VIEW_CURRENT_CARD">确定</div>
      <div class="button edit-button" @click="switchToEditingMode" v-else-if="mode===VIEW_CURRENT_CARD && showEdit">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { deepCopy, vueCopy, reviseDateFormat, pruneObj} from 'utils/helper';
import Util from 'utils/util.js';
import {
  getPatientSimpleInfo,
  getDbsFirstInfo,
  addDbsFirstInfo,
  modifyDbsFirstInfo,
  getDbsFollowInfo,
  addDbsFollowInfo,
  modifyDbsFollowInfo,
  getLastDbsInfo
} from 'api/patient.js';

var dbsFirstModel = {
  'deviceId': '',
  'devicePowerType': '',
  'programDate': '',
  'isTakeMedication': '',
  'medicationStatus': '',
  'patientDbsMedicine': [],
  'damageEffectExist': '',
  'damageEffectDuration': '',
  'adverseEventsExist': '',
  'adverseEventsRemark': '',
  'leftContactEffectOrder': '',
  'rightContactEffectOrder': '',
  'remarks': '',
  'firstDbsParams': {
    'adjustAfterParameterChoice': '',
    'adjustAfterParameter': []
  },
  'followDbsParams': {
    'adjustAfterParameterChoice': '',
    'adjustAfterParameter': [],
    'adjustBeforeParameter': [],
    'adjustVoltageParameter': [],
    'adjustMoreParameter': []
  }
};

var dbsFollowModel = {
  'deviceId': '',
  'devicePowerType': '',
  'programDate': '',
  'isTakeMedication': '',
  'medicationStatus': '',
  'patientDbsMedicine': [],
  'complaint': '',
  'effectInfo': '',
  'adjustBeforeLeftSatisfaction': '',
  'adjustBeforeRightSatisfaction': '',
  'adjustVoltageLeftSatisfaction': '',
  'adjustVoltageRightSatisfaction': '',
  'adjustMoreLeftSatisfaction': '',
  'adjustMoreRightSatisfaction': '',
  'remarks': '',
  'patientCaseId': '',
  'firstDbsParams': {
    'adjustAfterParameter': []
  },
  'followDbsParams': {
    'adjustAfterParameter': [],
    'adjustBeforeParameter': [],
    'adjustVoltageParameter': [],
    'adjustMoreParameter': []
  }
};

export default {
  data() {
    return {
      mode: '',
      dbsPatientCode: '',
      modelType: 1, // 这个用来控制是否为首次开机，1为首次，0为非首次
      copyInfo: {},
      completeInit: false,
      duringTogglingModelType: false,
      warningResults: {
        deviceId: '',
        programDate: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      currentFormSide: 'left',  // 用来控制显示是左侧表格还是右侧表格，默认显示左侧
      leftContactSortArray: [],
      rightContactSortArray: [],

      firstDbsAdjustAfterParamPole: [],
      followDbsAdjustAfterParamPole: [],
      followDbsAdjustBeforeParamPole: [],
      followDbsAdjustVoltageParamPole: [],
      followDbsAdjustMoreParamPole: [],

      firstDbsAdjustAfterParameterChosenStatus: [],
      followDbsAdjustAfterParameterChosenStatus: [],

      followDbsAdjustBeforeFirstSchemeOrder: '',
      lastProgramDate: '',
      lastDbsParameter: [],
      lockSubmitButton: false,
      showEdit: false
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'deviceInfo',
      'medicineInfo'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增程控记录';
      } else if (this.mode === this.EDIT_CURRENT_CARD || this.mode === this.VIEW_CURRENT_CARD) {
        return '程控记录';
      } else {
        return '';
      }
    },
    formOffsetClass() {
      if (this.currentFormSide === 'left') {
        return 'left-offset';
      } else if (this.currentFormSide === 'right') {
        return 'right-offset';
      } else {
        return '';  // 正常情况下不会运行到这行
      }
    },
    voltageCount() {
      return this.getOptions('dbsVoltage').length;
    },
    leftContactCount() {
      return this.getSideDeviceContact('left').length;
    },
    rightContactCount() {
      return this.getSideDeviceContact('right').length;
    }
  },
  methods: {
    showModal(cardOperation, info, showEdit) {
      this.mode = cardOperation;
      this.completeInit = false;
      this.showEdit = showEdit;
      if (this.mode === this.ADD_NEW_CARD) {
        this.modelType = 0;   // 新增程控记录的时候，“首次开机”默认选择“否”
        this.completeInit = true;
      } else if (info.patientDbsFirstId) {
        this.modelType = 1;
      } else if (info.patientDbsFollowId) {
        this.modelType = 0;
      }
      this.updateModelType();
      this.lastProgramDate = '';
      this.lastDbsParameter = [];

      // 获取患者的 DBS 编码
      getPatientSimpleInfo(this.$route.params.id).then((data) => {
        if (data && data.patientInfo && data.patientInfo.dbsPatientCode) {
          this.dbsPatientCode = data.patientInfo.dbsPatientCode;
        }
      }, (error) => {
        console.log(error);
      });

      // 如果是阅读或编辑已有的程控记录，就要查询其程控信息的详情
      if ((this.mode === this.EDIT_CURRENT_CARD || this.mode === this.VIEW_CURRENT_CARD) &&
        info.patientDbsFirstId) {
        this.modelType = 1;
        this.initByFirstModel();
        getDbsFirstInfo(info.patientDbsFirstId).then((data) => {
          vueCopy(data, this.copyInfo);

          // 不知道什么原因，在执行上面的 vueCopy 之后，会切掉一些空的字段，影响了【副作用持续时间】的数据绑定
          // 因此这里给没有值的【副作用持续时间】重新设为空字符串
          for (let record of this.copyInfo.patientDbsFirstDetail) {
            if (record.sideEffectDuration === undefined) {
              this.$set(record, 'sideEffectDuration', '');
            }
          }

          this.updateContactOrder();
          this.updateCheckBoxModel('firstDbsAdjustAfter');

          let firstDbsAdjustAfterParameterChosenIndex = this.copyInfo.patientDbsChoose;
          let length = parseInt(this.copyInfo.firstDbsParams.adjustAfterParameter.length / 2, 10);
          for (var i = 0; i < length; i++) {
            var status = firstDbsAdjustAfterParameterChosenIndex === i;
            this.firstDbsAdjustAfterParameterChosenStatus.push(status);
          }

          this.$nextTick(() => {
            this.completeInit = true; // 放在 nextTick 中，才不会触发 changeDevice()
          });
        });
      } else if ((this.mode === this.EDIT_CURRENT_CARD || this.mode === this.VIEW_CURRENT_CARD) &&
        info.patientDbsFollowId) {
        this.modelType = 0;
        this.initByFollowModel();
        var patientId = this.$route.params.id;
        getDbsFollowInfo(patientId, info.patientDbsFollowId).then((data) => {
          vueCopy(data, this.copyInfo);
          this.updateCheckBoxModel('followDbsAdjustAfter');
          this.updateCheckBoxModel('followDbsAdjustBefore');
          this.updateCheckBoxModel('followDbsAdjustVoltage');
          this.updateCheckBoxModel('followDbsAdjustMore');
          this.prepareLastDbsInfo(data);

          let followDbsAdjustAfterParameterChosenIndex = this.copyInfo.patientDbsChoose;
          let length = parseInt(this.copyInfo.followDbsParams.adjustAfterParameter.length / 2, 10);
          for (var i = 0; i < length; i++) {
            var status = followDbsAdjustAfterParameterChosenIndex === i;
            this.followDbsAdjustAfterParameterChosenStatus.push(status);
          }

          this.$nextTick(() => {
            this.completeInit = true;
          });
        });
      }
      this.clearWarning();
      this.updateScrollbar();
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      // 提交前检查一下必填字段是否都有填写，即警告信息是否都为空
      this.updateWarning('deviceId');
      this.updateWarning('programDate');
      for (var fieldName in this.warningResults) {
        if (this.warningResults.hasOwnProperty(fieldName) && this.warningResults[fieldName] !== '') {
          this.$message({
            message: '请完成必填项',
            type: 'warning',
            duration: 2000
          });
          this.lockSubmitButton = false;
          return;
        }
      };

      if (this.modelType === 0) {
        if (this.judgeProgramDate()) {
          this.lockSubmitButton = false;
          return;
        }
      };

      // 然后检查药物表格有没有不符合规定的
      for (let medicine of this.copyInfo.patientDbsMedicine) {
        if (!this.isMedicineValid(medicine)) {
          this.alertForCOMT();
          this.lockSubmitButton = false;
          return;
        }
      }

      // 如果直接操作 copyInfo，后面的 delete 操作可能会影响到数据绑定
      var submitData = deepCopy(this.copyInfo);

      submitData.patientCaseId = this.$route.params.caseId;
      reviseDateFormat(submitData);
      pruneObj(submitData);

      if (this.modelType === 1) {
        // 首次程控
        delete submitData.followDbsParams;
        for (let i = 0; i < this.firstDbsAdjustAfterParameterChosenStatus.length; i++) {
          if (this.firstDbsAdjustAfterParameterChosenStatus[i]) {
            // “开机完成参数”最终参数的选择，将数组中被选择的那一项的索引值传给后端
            submitData.patientDbsChoose = i;
          }
        }
        if (this.mode === this.ADD_NEW_CARD) {
          addDbsFirstInfo(submitData).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.mode === this.EDIT_CURRENT_CARD) {
          modifyDbsFirstInfo(submitData).then(() => {
            this.updateAndClose();
          }, this._handleError);
        }

      } else if (this.modelType === 0) {
        // 非首次程控
        delete submitData.firstDbsParams;
        for (let i = 0; i < this.followDbsAdjustAfterParameterChosenStatus.length; i++) {
          if (this.followDbsAdjustAfterParameterChosenStatus[i]) {
            // “程控完成参数”最终参数的选择，将数组中被选择的那一项的索引值传给后端
            submitData.patientDbsChoose = i;
          }
        }
        if (this.mode === this.ADD_NEW_CARD) {
          addDbsFollowInfo(submitData).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.mode === this.EDIT_CURRENT_CARD) {
          modifyDbsFollowInfo(submitData).then(() => {
            this.updateAndClose();
          }, this._handleError);
        }
      }

      // if (this.modelType === 1 && this.mode === this.ADD_NEW_CARD) {
      //   delete submitData.followDbsParams;
      //   addDbsFirstInfo(submitData).then(() => {
      //     this.updateAndClose();
      //   }, this._handleError);
      // } else if (this.modelType === 1 && this.mode === this.EDIT_CURRENT_CARD) {
      //   delete submitData.followDbsParams;
      //   modifyDbsFirstInfo(submitData).then(() => {
      //     this.updateAndClose();
      //   }, this._handleError);
      //
      // } else if (this.modelType === 0 && this.mode === this.ADD_NEW_CARD) {
      //   delete submitData.firstDbsParams;
      //   addDbsFollowInfo(submitData).then(() => {
      //     this.updateAndClose();
      //   }, this._handleError);
      // } else if (this.modelType === 0 && this.mode === this.EDIT_CURRENT_CARD) {
      //   delete submitData.firstDbsParams;
      //   modifyDbsFollowInfo(submitData).then(() => {
      //     this.updateAndClose();
      //   }, this._handleError);
      // }
    },
    judgeProgramDate() {
      var programDate = Util.simplifyDate(this.copyInfo.programDate);
      var lastProgramDate = Util.simplifyDate(this.lastProgramDate);
      programDate = programDate ? new Date(programDate).getTime() : undefined;
      lastProgramDate = lastProgramDate ? new Date(lastProgramDate).getDate() : undefined;

      if (lastProgramDate && programDate && lastProgramDate > programDate) {
        this.$message({
          message: '程控时间必须不能早于上次程控时间',
          type: 'warning',
          duration: 2000
        });
        return true;
      };
      return false;
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);

      // 因为前面的 delete 砍掉了 copyInfo的完整结构，会导致渲染出问题，所以传完数据后就重新补上
      this.initByModelType();
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        var scrollSettings = {
          wheelSpeed: 1,
          minScrollbarLength: 40
        };
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, scrollSettings);

        Ps.destroy(this.$refs.form1);
        Ps.initialize(this.$refs.form1, scrollSettings);
        Ps.destroy(this.$refs.form2);
        Ps.initialize(this.$refs.form2, scrollSettings);
        Ps.destroy(this.$refs.form3);
        Ps.initialize(this.$refs.form3, scrollSettings);
        Ps.destroy(this.$refs.form4);
        Ps.initialize(this.$refs.form4, scrollSettings);

        Ps.destroy(this.$refs.form0);
        Ps.initialize(this.$refs.form0, scrollSettings);
        Ps.destroy(this.$refs.form5);
        Ps.initialize(this.$refs.form5, scrollSettings);
      });
    },
    selectFirstOrFollow() {
      // 当用户选择了“是否为首次开机”这个下拉框的时候，执行此函数
      // 首先需要检查一下第一部分的字段是否有填写，如果有，则暂存下来，等重新构建数据格式之后，再填上去
      // 这些字段包括设备品牌、设备类型、程控时间和备注
      var deviceId = this.copyInfo.deviceId;
      var devicePowerType = this.copyInfo.devicePowerType;
      var programDate = this.copyInfo.programDate;
      var remarks = this.copyInfo.remarks;
      this.updateModelType(() => {
        if (deviceId) {
          this.copyInfo.deviceId = deviceId;
        }
        if (devicePowerType) {
          this.copyInfo.devicePowerType = devicePowerType;
        }
        if (programDate) {
          this.copyInfo.programDate = programDate;
        }
        if (remarks) {
          this.copyInfo.remarks = remarks;
        }
      });

      // 更换“是否首次开机”这个信息之后，需要对用药列表做相应的处理
      for (let medicine of this.copyInfo.patientDbsMedicine) {
        if (this.mode !== this.ADD_NEW_CARD && this.modelType === 0) {
          delete medicine.patientDbsFirstId;
          this.$set(medicine, 'patientDbsFollowId', this.copyInfo.patientDbsFollowId);
        } else if (this.mode !== this.ADD_NEW_CARD && this.modelType === 1) {
          delete medicine.patientDbsFollowId;
          this.$set(medicine, 'patientDbsFirstId', this.copyInfo.patientDbsFirstId);
        }
      }
    },
    updateModelType(cb) {
      this.duringTogglingModelType = true;
      this.initByModelType();

      // 如果是新增程控记录，就要去获取额外的上次程控信息
      if (this.mode === this.ADD_NEW_CARD) {
        getLastDbsInfo(this.$route.params.id, this.$route.params.caseId).then((data) => {
          // 首先绑定设备和设备类型
          this.copyInfo.deviceId = data.preopsDeviceId;
          this.copyInfo.devicePowerType = data.preopsDevicePowerType;
          if (this.modelType === 0) {
            // 如果是非首次程控，除了设备和设备类型之外，还要绑定上次程控时间和调整前参数
            this.prepareLastDbsInfo(data);
          }
          this.duringTogglingModelType = false;
          cb && cb();
        });
      } else {
        this.duringTogglingModelType = false;
        cb && cb();
      }
    },
    updateWarning(fieldName) {
      if (!this.completeInit || this.duringTogglingModelType) {
        return;
      }
      if (this.copyInfo[fieldName] === '' || this.copyInfo[fieldName] === undefined) {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    clearWarning() {
      this.$set(this.warningResults, 'deviceId', '');
      this.$set(this.warningResults, 'programDate', '');
    },
    initByModelType() {
      if (this.modelType === 1) {
        this.initByFirstModel();
      } else if (this.modelType === 0) {
        this.initByFollowModel();
      }
    },
    initByFirstModel() {
      this.copyInfo = {};
      vueCopy(dbsFirstModel, this.copyInfo);

      this.initContactForm();  // 生成表格所对应的数据模型
      this.updateContactOrder();
      this.updateCheckBoxModel('firstDbsAdjustAfter');
      this.clearWarning();
    },
    initByFollowModel() {
      this.copyInfo = {};
      vueCopy(dbsFollowModel, this.copyInfo);
      this.updateCheckBoxModel('followDbsAdjustAfter');
      this.updateCheckBoxModel('followDbsAdjustBefore');
      this.updateCheckBoxModel('followDbsAdjustVoltage');
      this.updateCheckBoxModel('followDbsAdjustMore');
      this.clearWarning();
    },
    clearDbsAdjustAfterParameterChosenStatus() {
      this.firstDbsAdjustAfterParameterChosenStatus = [];
      this.followDbsAdjustAfterParameterChosenStatus = [];
    },
    prepareLastDbsInfo(data) {
      // 绑定上次程控时间和调整前参数
      this.lastProgramDate = data.lastProgramDate;
      vueCopy(data.lastDbsParameter, this.lastDbsParameter);
      for (let param of this.lastDbsParameter) {
        delete param.id;
        param.paramType = 2;
      }
      if (this.lastDbsParameter.length > 0 && this.mode === this.ADD_NEW_CARD) {
        this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 0, {});
        this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 1, {});
        vueCopy(this.lastDbsParameter[0], this.copyInfo.followDbsParams.adjustBeforeParameter[0]);
        vueCopy(this.lastDbsParameter[1], this.copyInfo.followDbsParams.adjustBeforeParameter[1]);
        this.followDbsAdjustBeforeFirstSchemeOrder = this.lastDbsParameter[0].schemeOrder;
      } else if (this.copyInfo.followDbsParams.adjustBeforeParameter && this.copyInfo.followDbsParams.adjustBeforeParameter[0]) {
        this.followDbsAdjustBeforeFirstSchemeOrder = this.copyInfo.followDbsParams.adjustBeforeParameter[0].schemeOrder;
      }
      this.updateCheckBoxModel('followDbsAdjustBefore');
    },
    updateContactOrder() {
      var leftContactOrder = this.copyInfo.leftContactEffectOrder.split('>');
      var rightContactOrder = this.copyInfo.rightContactEffectOrder.split('>');
      for (let i = 0; i < leftContactOrder.length; i++) {
        this.$set(this.leftContactSortArray, i, leftContactOrder[i]);
      }
      for (let i = 0; i < rightContactOrder.length; i++) {
        this.$set(this.rightContactSortArray, i, rightContactOrder[i]);
      }
    },
    updateCheckBoxModel(formType) {
      var checkBoxModelList;
      var paramList = [];
      if (formType === 'firstDbsAdjustAfter') {
        paramList = this.copyInfo.firstDbsParams.adjustAfterParameter;
        checkBoxModelList = this.firstDbsAdjustAfterParamPole;
      } else if (formType === 'followDbsAdjustAfter') {
        paramList = this.copyInfo.followDbsParams.adjustAfterParameter;
        checkBoxModelList = this.followDbsAdjustAfterParamPole;
      } else if (formType === 'followDbsAdjustBefore') {
        paramList = this.copyInfo.followDbsParams.adjustBeforeParameter;
        checkBoxModelList = this.followDbsAdjustBeforeParamPole;
      } else if (formType === 'followDbsAdjustVoltage') {
        paramList = this.copyInfo.followDbsParams.adjustVoltageParameter;
        checkBoxModelList = this.followDbsAdjustVoltageParamPole;
      } else if (formType === 'followDbsAdjustMore') {
        paramList = this.copyInfo.followDbsParams.adjustMoreParameter;
        checkBoxModelList = this.followDbsAdjustMoreParamPole;
      }
      checkBoxModelList.splice(0, paramList.length);
      for (let i = 0; i < paramList.length; i++) {
        this.$set(checkBoxModelList, i, {});
        let positivePole = paramList[i].positivePole ? paramList[i].positivePole.split('#') : [];
        let negativePole = paramList[i].negativePole ? paramList[i].negativePole.split('#') : [];
        positivePole = positivePole.filter(pole => pole !== '');
        negativePole = negativePole.filter(pole => pole !== '');
        this.$set(checkBoxModelList[i], 'positive', positivePole);
        this.$set(checkBoxModelList[i], 'negative', negativePole);
      }
    },
    changeDevice() {
      // 改变了设备之后，会重新生成新的 Contact 表格。注意只有当数据初始化完成后才会执行，否则会干扰数据初始化
      if (this.completeInit) {
        this.initContactForm();
      }
      this.updateWarning('deviceId');
    },
    updateField(fieldName) {
      var influencedFieldName = '';
      if (fieldName === 'isTakeMedication') {
        influencedFieldName = 'medicationStatus';
      } else if (fieldName === 'damageEffectExist') {
        influencedFieldName = 'damageEffectDuration';
      } else if (fieldName === 'adverseEventsExist') {
        influencedFieldName = 'adverseEventsRemark';
      }
      if (this.copyInfo[fieldName] !== 1 && influencedFieldName !== '') {
        this.$set(this.copyInfo, influencedFieldName, '');
      }
    },
    initContactForm() {
      if (this.modelType === 1) {
        // 如果是首次开机，则选择设备后，会生成触点电压表格（左右两部分），这个函数为其做好数据准备工作
        this.$set(this.copyInfo, 'patientDbsFirstDetail', []);
        let leftContactList = this.getSideDeviceContact('left');
        let rightContactList = this.getSideDeviceContact('right');
        let totalContactList = [].concat(leftContactList, rightContactList);
        let voltageList = this.getOptions('dbsVoltage');

        let propertyList = [ 'elbowTone', 'wristTone', 'kneeTone', 'neckTone', 'tremor',
          'changeConstantly', 'sideEffect', 'sideEffectDuration', 'tensionTone'];
        var index;
        for (let i = 0; i < totalContactList.length; i++) {
          for (let j = 0; j < voltageList.length; j++) {
            index = i * voltageList.length + j;
            this.$set(this.copyInfo.patientDbsFirstDetail, index, {});
            this.$set(this.copyInfo.patientDbsFirstDetail[index], 'dbsCase', 'C+');
            this.$set(this.copyInfo.patientDbsFirstDetail[index], 'contact', totalContactList[i]);
            this.$set(this.copyInfo.patientDbsFirstDetail[index], 'dbsVoltage', voltageList[j].code);
            for (let property of propertyList) {
              this.$set(this.copyInfo.patientDbsFirstDetail[index], property, '');
            }
          }
        }
      } else if (this.modelType === 0) {

      }
    },
    updateLeftContactOrder() {
      var filteredArray = this.leftContactSortArray.filter(contact => contact !== '');
      this.copyInfo.leftContactEffectOrder = filteredArray.join('>');
    },
    updateRightContactOrder() {
      var filteredArray = this.rightContactSortArray.filter(contact => contact !== '');
      this.copyInfo.rightContactEffectOrder = filteredArray.join('>');
    },
    getFieldValue(code, fieldName) {
      var options = this.getOptions(fieldName);
      if (fieldName === 'devicePowerType') {
        options = [
          {code: 1, name: '充电'},
          {code: 0, name: '不充电'}
        ];
      } else if (fieldName === 'isTakeMedication' || fieldName === 'damageEffectExist' ||
        fieldName === 'adverseEventsExist') {
        options = [
          {code: 1, name: '有'},
          {code: 0, name: '无'}
        ];
      } else if (fieldName === 'satisfaction') {
        options = [
          {code: 0, name: '疗效满意'},
          {code: 1, name: '疗效一般'},
          {code: 2, name: '疗效欠佳'}
        ];
      }
      var value = Util.getElement('code', code, options).name;
      return value ? value : '';
    },
    getOptions(fieldName, param) {
      // 这里的第二个参数不是必须的，在查询药物规格时会用到
      var options = [];
      var typeGroupCodeMap = {
        'dbsVoltage': 'dbsVoltage',
        'duration': 'duration',
        'exciteMod': 'exciteMod'
      };
      if (typeGroupCodeMap[fieldName]) {
        // 在 typeGroup 中可以查到的
        var typesInfo = Util.getElement('typegroupcode', typeGroupCodeMap[fieldName], this.typeGroup);
        var types = typesInfo && typesInfo.types ? typesInfo.types : [];
        for (let type of types) {
          options.push({
            name: type.typeName,
            code: type.typeCode
          });
        }
      } else if (fieldName === 'leftContact') {
        let contactList = this.getSideDeviceContact('left');
        for (let contact of contactList) {
          options.push({
            name: contact,
            code: contact
          });
        }
      } else if (fieldName === 'rightContact') {
        let contactList = this.getSideDeviceContact('right');
        for (let contact of contactList) {
          options.push({
            name: contact,
            code: contact
          });
        }

      } else {
        // 在 typeGroup 中查不到要去 tableData 中去查的
        if (fieldName === 'deviceId') {
          for (let device of this.deviceInfo) {
            if (device.deviceType === 1) {
              options.push({
                name: device.deviceName,
                code: device.id
              });
            }
          }
        } else if (fieldName === 'medicineName') {
          for (let medicine of this.medicineInfo) {
            // 只有这个药物的药物规格中，存在某一个规格满足其 dbsCkUsed 属性为 1 的条件时，才把这个药加进来
            let specGroup = medicine.spec ? medicine.spec : [];
            for (let spec of specGroup) {
              if (spec.dbsCkUsed === 1) {
                options.push({
                  name: medicine.medicineName,
                  code: medicine.medicineId
                });
              }
            }
          }
        } else if (fieldName === 'medicineSpec') {
          // 药物规格要根据当前药物去找
          var targetMedicineId = param;
          var targetMedicine = Util.getElement('medicineId', targetMedicineId, this.medicineInfo);
          let specGroup = targetMedicine.spec ? targetMedicine.spec : [];
          for (let spec of specGroup) {
            if (spec.dbsUsed === 1) {
              options.push({
                name: spec.specOral,
                code: String(spec.medicalPec)  // 因为后端这里传的是字符串
              });
            }
          }

          // 如果是“其它”药物，则它的规格会作特殊处理
          let unknownSpec = '其它规格';
          if (!this.checkIfCommonMedicine(targetMedicineId)) {
            options = [
              {
                name: unknownSpec,
                code: 0
              }
            ];
          }
        }
      }
      return options;
    },
    getDeviceContact() {
      var targetDevice = {};
      for (let device of this.deviceInfo) {
        if (device.id === this.copyInfo.deviceId) {
          targetDevice = device;
        }
      }
      var extraInfo = targetDevice.extraInfo ? targetDevice.extraInfo : '';
      var extraInfoList = extraInfo.split('%');
      return extraInfoList;
    },
    getSideDeviceContact(side) {
      var contactList = this.getDeviceContact();
      if (contactList.length < 2) {
        return [];
      } else {
        var index = 0;
        if (side === 'left') {
          index = 0;
        } else if (side === 'right') {
          index = 1;
        }
        var targetContactList = contactList[index].split('#');
        if (targetContactList[0] === '' && targetContactList.length === 1) {
          return [];
        } else {
          return targetContactList;
        }
      }
    },
    chooseCurrentFormSide(side) {
      this.currentFormSide = side;
      this.updateScrollbar();
    },
    addMedicine() {
      var index = this.copyInfo.patientDbsMedicine.length;
      this.$set(this.copyInfo.patientDbsMedicine, index, {});
      let propertyList = ['medicineId', 'medicalSpecUsed', 'takeDose', 'totalMeasure', 'ledd'];
      for (let property of propertyList) {
        this.$set(this.copyInfo.patientDbsMedicine[index], property, '');
      }
      if (this.mode !== this.ADD_NEW_CARD && this.modelType === 1) {
        this.$set(this.copyInfo.patientDbsMedicine[index], 'patientDbsFirstId', this.copyInfo.patientDbsFirstId);
      } else if (this.mode !== this.ADD_NEW_CARD && this.modelType === 0) {
        this.$set(this.copyInfo.patientDbsMedicine[index], 'patientDbsFollowId', this.copyInfo.patientDbsFollowId);
      }
    },
    getLetterIndex(index) {
      return String.fromCharCode(index + 'A'.charCodeAt(0));
    },
    removeMedicine(index) {
      this.copyInfo.patientDbsMedicine.splice(index, 1);
    },
    selectMedicine(medicine) {
      // 因为可选的规格只有一个，会自动选上
      medicine.medicalSpecUsed = '';

      var medSpecificationOptions = this.getOptions('medicineSpec', medicine.medicineId);
      medicine.medicalSpecUsed = medSpecificationOptions[0] ? medSpecificationOptions[0].code : '';

      if (!this.checkIfCommonMedicine(medicine.medicineId)) {
        // 如果是 “其它” 药物，则特殊处理
        medicine.medicalSpecUsed = '';
        medicine.takeDose = '';
        medicine.totalMeasure = '';
        medicine.ledd = '';
      }

      if (!this.isMedicineValid(medicine)) {
        this.alertForCOMT();
      }
    },
    isMedicineValid(medicine) {
      // COMT 药物存在时，整个药物列表一定要有左旋多巴类制剂的药物存在，同时最多只能存在一个珂丹
      // 截止 2.2版本，DBS药物列表里面的 COMT 抑制剂只有珂丹一种，所以这里的逻辑就是判断是不是只有一个 COMT 抑制剂
      if (!this.checkIfCOMT(medicine.medicineId)) {
        // 如果不是 COMT 抑制剂类药物，则直接返回 true，
        return true;

      } else {
        // 如果是 COMT 抑制剂，则根据整个列表是否符合规则来返回 true 或 false
        var hasLevodopa = false;
        var amountOfCOMT = 0;
        for (let eachMedicine of this.copyInfo.patientDbsMedicine) {
          if (this.checkIfLevodopa(eachMedicine.medicineId)) {
            hasLevodopa = true;
          }
          if (this.checkIfCOMT(eachMedicine.medicineId)) {
            amountOfCOMT += 1;
          }
        }
        return hasLevodopa && amountOfCOMT < 2;
      }
    },
    getDayTotalDose(medicine) {
      // 计算药物列表中，具体某一行的日总剂量
      let spec = medicine.medicalSpecUsed;
      let amount = medicine.takeDose;
      medicine.totalMeasure = amount ? spec * amount : 0;
      return medicine.totalMeasure;
    },
    getLEDD(medicine) {
      let medicineId = medicine.medicineId;
      let spec = medicine.medicalSpecUsed;
      let amount = medicine.takeDose;

      // 先对参数进行校验，如果参数不合法，则返回 0
      if (medicineId === undefined || medicineId === '' || spec === undefined ||
        spec === '' || isNaN(spec) || amount === undefined || amount === '' || isNaN(amount)) {
        medicine.ledd = 0;
        return 0;
      }

      spec = Number(spec);
      amount = Number(amount);

      var extraText = '';

      var targetMedicine = Util.getElement('medicineId', medicineId, this.medicineInfo);
      if (this.checkIfCOMT(medicineId)) {
        medicine.ledd = 0;

      } else {
        // 计算其它所有药物中珂丹的总用量，
        // 如果是 0片则本药物的 LEDD 不变，
        // 如果是小于等于 0.5片，则增益 25%，
        // 如果大于 0.5 片，则增益 33%
        var totalCOMTDose = 0;
        for (let eachMedicine of this.copyInfo.patientDbsMedicine) {
          totalCOMTDose += this.checkIfCOMT(eachMedicine.medicineId) && eachMedicine.takeDose > 0
            ? eachMedicine.takeDose : 0;
        }

        var gainRatio;
        if (totalCOMTDose === 0) {
          gainRatio = 0;
        } else if (totalCOMTDose <= 0.5) {
          gainRatio = 0.25;
          extraText = ' (+25%)';
        } else {
          gainRatio = 0.33;
          extraText = ' (+33%)';
        }

        var specGroup = targetMedicine.spec ? targetMedicine.spec : [];
        var targetSpecInfo = Util.getElement('medicalPec', spec, specGroup);
        var levodopaFactor = targetSpecInfo.levodopaFactor;
        var ledd = levodopaFactor * amount * (1 + gainRatio);
        medicine.ledd = Number(ledd.toFixed(4));
      }
      return medicine.ledd + extraText;
    },
    checkIfCOMT(medicineId) {
      // 看是否为 COMT 抑制剂（如珂丹）
      var targetMedicine = Util.getElement('medicineId', medicineId, this.medicineInfo);
      return targetMedicine.medicalType === 3;
    },
    checkIfLevodopa(medicineId) {
      // 看是否为左旋多巴类药物（如森福罗）
      var targetMedicine = Util.getElement('medicineId', medicineId, this.medicineInfo);
      return targetMedicine.medicalType === 0;
    },
    checkIfCommonMedicine(medicineId) {
      // 检查是否为普通药物（即，非“其它”药物）
      var targetMedicine = Util.getElement('medicineId', medicineId, this.medicineInfo);
      return targetMedicine.medicalType !== 6;
    },
    transformToNum(obj, property, digit) {
      // 如果填写的不是一个数字，则转换成一个空字符串，如果是一个数字，则将这个数字字符串转化为真正的数字
      var value = obj[property];

      var reg = new RegExp(/^[0-9]+\.{0,1}[0-9]{0,2}$/);
      if (reg.test(value)) {
        obj[property] = Number(value);
      } else if (value !== '' && !isNaN(value)) {
        digit = digit ? digit : 2;    // 如果第三个参数不传，就默认为2位小数
        obj[property] = Number(Number(value).toFixed(digit));
      } else {
        obj[property] = '';
      }
    },
    alertForCOMT() {
      this.$message({
        message: 'COMT抑制剂类药物需要和多巴胺类制剂类药物联合使用，而且珂丹类药物至多只能出现一组，' +
          '请检查药物处方是否录入有误',
        type: 'warning',
        duration: 4000
      });
    },
    showMoreInfo() {
      // this.$alert('这是一段内容', '各刺激模式可选规则', {
      //   confirmButtonText: '确定',
      //   callback: () => {}
      // });
      const h = this.$createElement;
      this.$msgbox({
        title: '各刺激模式可选规则',
        message: h('div', null, [
          h('p', null, '1.单负：单负极刺激，脉冲发生器为正极（C+），选择电极的其中一个触点为负极进行电刺激。'),
          h('br', null, ''),
          h('p', null, '2.双极：双极刺激，不再选择脉冲发生器为正极，选择电极其中一个触点为正极，一个触点为负极。'),
          h('br', null, ''),
          h('p', null, '3.双负：双负极刺激，脉冲发生器为正极（C+），选择电极的其中2个触点均为负极进行电刺激。'),
          h('br', null, ''),
          h('p', null, '4.交叉电脉冲：交叉电脉冲刺激，每个电极选用两个触点进行交叉刺激，每个触点都可采用不同的刺激参数，如不同的电压或脉宽，但刺激频率相同（上限125Hz）'),
          h('br', null, ''),
          h('p', null, '5.复杂程控模式：采用多重复合模式进行刺激，如选用超过3个触点刺激（3负极，1正2负极等），或交叉电脉冲中设置了多触点刺激。')
        ]),
        showCancelButton: false,
        confirmButtonText: '确定'
      });
    },
    checkAfterParameterChosenStatus(dbsType, index) {
      // 这个函数要检查，【开机完成参数／程控完成参数】表格的最左侧一栏，最终参数，是否有且仅有一个被选中了。
      var targetAdjustAfterParameterChosenStatus = [];
      if (dbsType === 'firstDbs') {
        targetAdjustAfterParameterChosenStatus = this.firstDbsAdjustAfterParameterChosenStatus;
      } else if (dbsType === 'followDbs') {
        targetAdjustAfterParameterChosenStatus = this.followDbsAdjustAfterParameterChosenStatus;
      }
      var status = targetAdjustAfterParameterChosenStatus[index];
      if (status) {
        for (var i = 0; i < targetAdjustAfterParameterChosenStatus.length; i++) {
          if (index !== i) {
            targetAdjustAfterParameterChosenStatus[i] = false;
          }
        }
      } else {
        targetAdjustAfterParameterChosenStatus[index] = true;
      }
    },
    addParam(formType) {
      if (formType === 'firstDbsAdjustAfter') {
        let paramList = this.copyInfo.firstDbsParams.adjustAfterParameter;
        let count = paramList.length;

        // 对表格的最左侧一列，最终参数，所对应的数组添加元素
        if (count === 0) {
          this.$set(this.firstDbsAdjustAfterParameterChosenStatus, 0, true);
        } else {
          this.$set(this.firstDbsAdjustAfterParameterChosenStatus, count / 2, false);
        }

        let order = count / 2 + 1;
        let propertyList = ['exciteMod', 'negativePole', 'positivePole', 'frequency',
          'pulseWidth', 'voltage', 'resistance', 'electric', 'remarks'];
        for (let limbSideNum of [1, 2]) {
          let index = count - 1 + limbSideNum;
          this.$set(paramList, (index), {});
          this.$set(paramList[index], 'paramType', 1);
          this.$set(paramList[index], 'schemeOrder', order);
          this.$set(paramList[index], 'limbSide', limbSideNum);
          for (let property of propertyList) {
            let defaultValue = '';
            if (property === 'frequency') {
              defaultValue = 130;
            } else if (property === 'pulseWidth') {
              defaultValue = 60;
            }
            this.$set(paramList[index], property, defaultValue);
          }
          if (this.copyInfo.patientDbsFirstId) {
            this.$set(paramList[index], 'patientDbsFirstId', this.copyInfo.patientDbsFirstId);
          }
        }
      } else if (formType === 'followDbsAdjustVoltage') {
        let paramList = this.copyInfo.followDbsParams.adjustVoltageParameter;
        let count = paramList.length;
        let order = count / 2 + 1;
        let propertyList = ['exciteMod', 'negativePole', 'positivePole', 'frequency', 'pulseWidth', 'voltage', 'effectInfo'];
        for (let limbSideNum of [1, 2]) {
          let index = count - 1 + limbSideNum;
          this.$set(paramList, (index), {});
          this.$set(paramList[index], 'paramType', 3);
          this.$set(paramList[index], 'schemeOrder', order);
          this.$set(paramList[index], 'limbSide', limbSideNum);
          for (let property of propertyList) {
            this.$set(paramList[index], property, '');
          }
          if (this.copyInfo.patientDbsFollowId) {
            this.$set(paramList[index], 'patientDbsFollowId', this.copyInfo.patientDbsFollowId);
          }
        }
      } else if (formType === 'followDbsAdjustMore') {
        let paramList = this.copyInfo.followDbsParams.adjustMoreParameter;
        let count = paramList.length;
        let order = count / 2 + 1;
        let propertyList = ['exciteMod', 'negativePole', 'positivePole', 'frequency', 'pulseWidth', 'voltage', 'resistance', 'electric'];
        for (let limbSideNum of [1, 2]) {
          let index = count - 1 + limbSideNum;
          this.$set(paramList, (index), {});
          this.$set(paramList[index], 'paramType', 4);
          this.$set(paramList[index], 'schemeOrder', order);
          this.$set(paramList[index], 'limbSide', limbSideNum);
          for (let property of propertyList) {
            this.$set(paramList[index], property, '');
          }
          if (this.copyInfo.patientDbsFollowId) {
            this.$set(paramList[index], 'patientDbsFollowId', this.copyInfo.patientDbsFollowId);
          }
        }
      } else if (formType === 'followDbsAdjustAfter') {
        let paramList = this.copyInfo.followDbsParams.adjustAfterParameter;
        let count = paramList.length;

        // 对表格的最左侧一列，最终参数，所对应的数组添加元素
        if (count === 0) {
          this.$set(this.followDbsAdjustAfterParameterChosenStatus, 0, true);
        } else {
          this.$set(this.followDbsAdjustAfterParameterChosenStatus, count / 2, false);
        }

        let order = Math.floor(count / 2) + 1;
        let propertyList = ['exciteMod', 'negativePole', 'positivePole', 'frequency', 'pulseWidth', 'voltage', 'resistance', 'electric'];
        for (let limbSideNum of [1, 2]) {
          let index = count - 1 + limbSideNum;
          this.$set(paramList, (index), {});
          this.$set(paramList[index], 'paramType', 1);
          this.$set(paramList[index], 'schemeOrder', order);
          this.$set(paramList[index], 'limbSide', limbSideNum);
          for (let property of propertyList) {
            let defaultValue = '';
            if (property === 'frequency') {
              defaultValue = 130;
            } else if (property === 'pulseWidth') {
              defaultValue = 60;
            }
            this.$set(paramList[index], property, defaultValue);
          }
          if (this.copyInfo.patientDbsFollowId) {
            this.$set(paramList[index], 'patientDbsFollowId', this.copyInfo.patientDbsFollowId);
          }
        }
      }
      this.updateCheckBoxModel(formType);
    },
    removeParam(index, formType) {
      let paramList;
      if (formType === 'firstDbsAdjustAfter') {
        paramList = this.copyInfo.firstDbsParams.adjustAfterParameter;
      } else if (formType === 'followDbsAdjustBefore') {
        paramList = this.copyInfo.followDbsParams.adjustBeforeParameter;
      } else if (formType === 'followDbsAdjustAfter') {
        paramList = this.copyInfo.followDbsParams.adjustAfterParameter;
      } else if (formType === 'followDbsAdjustVoltage') {
        paramList = this.copyInfo.followDbsParams.adjustVoltageParameter;
      } else if (formType === 'followDbsAdjustMore') {
        paramList = this.copyInfo.followDbsParams.adjustMoreParameter;
      }
      paramList.splice(index, 2);
      for (var i = 0; i < paramList.length; i++) {
        paramList[i].schemeOrder = Math.floor(i / 2) + 1;
      }

      // 对表格的最左侧一列，最终参数，所对应的数组移除元素
      var targetIndex = Math.floor(i / 2);
      var deletedStatus = this.followDbsAdjustAfterParameterChosenStatus[targetIndex];
      this.followDbsAdjustAfterParameterChosenStatus.splice(targetIndex, 1);
      if (deletedStatus && this.followDbsAdjustAfterParameterChosenStatus.length > 0) {
        this.followDbsAdjustAfterParameterChosenStatus[0] = true;
      }

      this.updateCheckBoxModel(formType);
    },
    getFirstDbsAdjustAfterPlanName(param) {
      var order = param.schemeOrder;
      var orderArr = ['A', 'B', 'C', 'D'];
      return '程控参数' + orderArr[order - 1];
    },
    getFollowDbsAdjustBeforePlanName(param) {
      var order = param.schemeOrder;
      var orderArr = ['A', 'B', 'C', 'D'];
      return '程控参数' + orderArr[order - 1];
    },
    getFollowDbsAdjustMorePlanName(param) {
      var order = param.schemeOrder;
      return '调整' + order;
    },
    getFollowDbsAdjustVoltagePlanName(param) {
      var order = param.schemeOrder;
      return '调整' + order;
    },
    getFollowDbsAdjustAfterPlanName(param) {
      var order = param.schemeOrder;
      var orderArr = ['A', 'B', 'C', 'D'];
      return '程控参数' + orderArr[order - 1];
    },
    getLimbSide(sideNum) {
      if (sideNum === 1) {
        return '左侧肢体';
      } else if (sideNum === 2) {
        return '右侧肢体';
      }
    },
    getSideNegativeContact(sideNum) {
      // 根据设备，得到其相应一侧的负极列表
      // sideNum 为 1 时代表左侧，为 2 时代表右侧
      var side = sideNum === 1 ? 'left' : 'right';
      return this.getSideDeviceContact(side);
    },
    getSidePositiveContact(sideNum) {
      // 根据设备，得到其相应一侧的正极列表
      // 把负极列表每个值取相反，再加上一个 “C+” 即可
      var negativeContactList = this.getSideNegativeContact(sideNum);
      if (negativeContactList.length === 0) {
        return [];
      }
      var positiveContactList = ['C+'];
      for (let contact of negativeContactList) {
        contact = contact.slice(0, -1);
        contact += '+';
        positiveContactList.push(contact);
      }
      return positiveContactList;
    },
    checkIfDisabledContact(exciteMod, contact, isPositive) {
      // 该函数的返回值为 false 到时候代表该选项可以被选中，为 true 代表该选项禁用
      // isPositive 为 true 的时候代表是正极，为 false 代表负极
      if (this.mode === this.VIEW_CURRENT_CARD) {
        return true;
      }

      if (exciteMod === 1) {
        // 1.单负：正极仅可选 C+，负极为四个靶点单选。
        if (isPositive) {
          return contact !== 'C+';
        } else {
          return false;
        }
      } else if (exciteMod === 2) {
        // 2.双极：正负极均为单选
        return false;
      } else if (exciteMod === 3) {
        // 3.双负：正极仅可选 C+，负极必须选两个
        if (isPositive) {
          return contact !== 'C+';
        } else {
          return false;
        }
      } else if (exciteMod === 4) {
        // 4.交叉电脉冲：正极负极均最多可选择两个
        return false;
      } else if (exciteMod === 5) {
        // 5.复杂程控模式：与之前一致，选择靶点不作限制
        return false;
      }
      return true;
    },
    getMaxNumOfContact(exciteMod, isPositive) {
      // isPositive 为 true 的时候代表是正极，为 false 代表负极
      if (exciteMod === 1 || exciteMod === 2) {
        return 1;
      } else if (exciteMod === 3) {
        return isPositive ? 1 : 2;
      } else if (exciteMod === 4) {
        return 2;
      } else if (exciteMod === 5) {
        return 5;
      }
    },
    getDeviceGroups(type) {
      // 这个函数返回的数组用来生成触点电压表格（首次开机），供 v-for 使用
      var groups = [];
      var group = {};
      var voltageOptions = this.getOptions('dbsVoltage');
      for (let contact of this.getSideDeviceContact(type)) {
        for (var i = 0; i < voltageOptions.length; i++) {
          group = {};
          group.contact = contact;
          group.isFirstVoltage = (i === 0);
          group.voltage = voltageOptions[i].name;
          groups.push(group);
        }
      }
      this.updateScrollbar();

      // 在渲染表格前要先做好数据准备工作，所以在数据模型建立好之前返回空数组
      if (!this.copyInfo.patientDbsFirstDetail || this.copyInfo.patientDbsFirstDetail.length !== groups.length * 2) {
        return [];
      }
      return groups;
    },
    getRightIndex(index) {
      // 由右侧的行数，加上左侧的总行数，得到其在数据列表中的索引位置（因为左右列表所有行在一个数组里面）
      var leftTotalRows = this.getSideDeviceContact('left').length * this.voltageCount;
      return index + leftTotalRows;
    },
    updateTensionTone(index) {
      var record = this.copyInfo.patientDbsFirstDetail[index];
      var sum = 0;
      for (let property of ['elbowTone', 'wristTone', 'kneeTone', 'neckTone', 'tremor']) {
        if (record[property] === '' || isNaN(record[property])) {
          this.$set(record, property, '');
        } else {
          record[property] = Number(record[property]);
          sum += record[property];
        }
      }
      this.$set(record, 'tensionTone', sum);
    },
    updateParamPole(formType, index) {
      // 每次参数表格内的 checkBox 有变化时，就更新相应的数据对象
      if (formType === 'firstDbsAdjustAfter') {
        this.copyInfo.firstDbsParams.adjustAfterParameter[index].positivePole = this.firstDbsAdjustAfterParamPole[index].positive.join('#');
        this.copyInfo.firstDbsParams.adjustAfterParameter[index].negativePole = this.firstDbsAdjustAfterParamPole[index].negative.join('#');
      } else if (formType === 'followDbsAdjustBefore') {
        this.copyInfo.followDbsParams.adjustBeforeParameter[index].positivePole = this.followDbsAdjustBeforeParamPole[index].positive.join('#');
        this.copyInfo.followDbsParams.adjustBeforeParameter[index].negativePole = this.followDbsAdjustBeforeParamPole[index].negative.join('#');
      } else if (formType === 'followDbsAdjustVoltage') {
        this.copyInfo.followDbsParams.adjustVoltageParameter[index].positivePole = this.followDbsAdjustVoltageParamPole[index].positive.join('#');
        this.copyInfo.followDbsParams.adjustVoltageParameter[index].negativePole = this.followDbsAdjustVoltageParamPole[index].negative.join('#');
      } else if (formType === 'followDbsAdjustMore') {
        this.copyInfo.followDbsParams.adjustMoreParameter[index].positivePole = this.followDbsAdjustMoreParamPole[index].positive.join('#');
        this.copyInfo.followDbsParams.adjustMoreParameter[index].negativePole = this.followDbsAdjustMoreParamPole[index].negative.join('#');
      } else if (formType === 'followDbsAdjustAfter') {
        this.copyInfo.followDbsParams.adjustAfterParameter[index].positivePole = this.followDbsAdjustAfterParamPole[index].positive.join('#');
        this.copyInfo.followDbsParams.adjustAfterParameter[index].negativePole = this.followDbsAdjustAfterParamPole[index].negative.join('#');
      }
    },
    selectFollowDbsAdjustBeforeFirstSchemeOrder() {
      // 每次选择了调整前参数的方案，就更新 copyInfo.followDbsParams.adjustBeforeParameter
      var firstIndex = -1;
      for (var i = 0; i < this.lastDbsParameter.length; i++) {
        if (this.lastDbsParameter[i].schemeOrder === this.followDbsAdjustBeforeFirstSchemeOrder) {
          firstIndex = i;
          break;
        }
      }

      this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 0, {});
      this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 1, {});

      // 如果选择了自定义方案，则 this.followDbsAdjustBeforeFirstSchemeOrder 值为 0，
      // 与 this.lastDbsParameter 数组中的任意一项的 schemeOrder 都对应不上，那么 firstIndex 的值就还是 -1
      if (firstIndex === -1) {
        let emptyParam = {
          paramType: 2,
          schemeOrder: 0,
          exciteMod: '',
          limbSide: 1,
          positivePole: '',
          negativePole: '',
          frequency: '',
          pulseWidth: '',
          voltage: '',
          resistance: '',
          electric: '',
          electricity: ''
        };
        emptyParam.limbSide = 1;
        vueCopy(emptyParam, this.copyInfo.followDbsParams.adjustBeforeParameter[0]);
        emptyParam.limbSide = 2;
        vueCopy(emptyParam, this.copyInfo.followDbsParams.adjustBeforeParameter[1]);
      } else {
        vueCopy(this.lastDbsParameter[firstIndex], this.copyInfo.followDbsParams.adjustBeforeParameter[0]);
        vueCopy(this.lastDbsParameter[firstIndex + 1], this.copyInfo.followDbsParams.adjustBeforeParameter[1]);
      }
      this.updateCheckBoxModel('followDbsAdjustBefore');
    }
  },
  created() {
    this.initByModelType();
  },
  mounted() {
    this.updateScrollbar();
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_DBS_MODAL, this.showModal);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_DBS_MODAL, this.showModal);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  watch: {
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 100px;
@long-field-name-width: 150px;
@scroll-bar-height: 10px;
@unit-width: 55px;
@computed-cell-color: lighten(@font-color, 55%);

.dbs-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .dbs-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 80%;
    min-width: 660px;
    max-width: 1500px;
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
        text-align: left;
        font-size: @normal-font-size;
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        vertical-align: top;
        text-align: left;
        transform: translate3d(10px, 5px, 0);  // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width}");
          }
        }
        &.double-line {
          margin-bottom: 20px;
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
          position: relative;
          width: calc(~"92% - @{field-name-width}");
          left: @field-name-width;
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
            width: calc(~"92% - @{long-field-name-width}");
          }
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
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
      .medicine-table {
        margin: 10px 0 20px;
        width: 100%;
        border: 1px solid @light-gray-color;
        border-collapse: collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            .required-mark {
              position: absolute;
              right: 5px;
              top: 8px;
              color: red;
              font-size: 25px;
              vertical-align: middle;
            }
            &.title-col {
              background-color: @font-color;
              color: #fff;
            }
            &.computed-cell {
              background-color: @computed-cell-color;
              &.warning {
                background-color: @alert-color;
                color: #fff;
              }
              .warning-text {
                position: absolute;
                top: 35px;
                left: 0;
                color: @alert-color;
                font-size: @small-font-size;
              }
            }
            &.wide-col {
              width: 30%;
            }
            &.narrow-col {
              width: 5%;
            }
            .iconfont {
              position: absolute;
              left: 5px;
              top: 9px;
              cursor: pointer;
              z-index: 20;
              &.icon-remove {
                color: @alert-color;
              }
              &:hover {
                opacity: 0.6;
              }
              &:active {
                opacity: 0.8;
              }
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
    .form-tab-wrapper {
      position: relative;
      height: 35px;
      line-height: 35px;
      font-size: 0;
      transform: translateY(5px);
      .form-tab {
        display: inline-block;
        position: relative;
        width: 100px;
        font-weight: bold;
        font-size: @normal-font-size;
        color: @light-font-color;
        cursor: pointer;
        &.on {
          color: @font-color;
        }
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 0.9;
        }
      }
      .form-tab-bottom {
        display: inline-block;
        position: absolute;
        width: 80px;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: @font-color;
        transition: 0.2s;
        &.left {
          transform: translate3d(10px, 0, 0);
        }
        &.right {
          transform: translate3d(110px, 0, 0);
        }
      }
    }
    .form-wrapper {
      position: relative;
      margin-bottom: 30px;
      width: 100%;
      padding-bottom: 10px;
      overflow: hidden;
      &.form0-wrapper {
        transition: 0.2s;
        // text-align: left;
        &.left-offset {
          transform: translateX(-15px);
        }
        &.right-offset {
          transform: translateX(15px);
        }
      }
      .form-left, .form-right {
        display: inline-block;
      }
      .form-right {
        // position: absolute; // 这里利用两个表格高度相等，只定义一个为 absolute，从而避免容器坍塌
        // left: @unit-width * 17;
        // top: 0;
      }
      .form {
        margin: 10px auto 0;
        border-spacing: 0;
        table-layout: fixed;
        border: 1px solid @light-gray-color;
        border-collapse:collapse;
        text-align: center;
        &.form0 {
          width: @unit-width * 16;
        }
        &.form1 {
          width: @unit-width * 22;
        }
        &.form2 {
          width: @unit-width * 26;
        }
        &.form3 {
          width: @unit-width * 26;
        }
        &.form4 {
          width: @unit-width * 26;
        }
        &.form5 {
          width: @unit-width * 26;
        }
        .row {
          height: 35px;
          font-size: @normal-font-size;
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          &.top-row {
            background-color: @light-gray-color;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            .iconfont {
              position: absolute;
              right: 5px;
              cursor: pointer;
              &.icon-question {
                right: 10px;
              }
              &:hover {
                opacity: 0.6;
              }
              &:active {
                opacity: 0.8;
              }
            }
            &.single-row {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            &.w1 {
              width: @unit-width;
            }
            &.w2 {
              width: @unit-width * 2;
            }
            &.w3 {
              width: @unit-width * 3;
            }
            &.w4 {
              width: @unit-width * 4;
            }
            &.w5 {
              width: @unit-width * 5;
            }
            &.w6 {
              width: @unit-width * 6;
            }
            &.w8 {
              width: @unit-width * 8;
            }
            &.sort-info {
              padding-left: 20px;
              text-align: left;
              .contact {
                display: inline-block;
                margin: 0 15px;
                width: 65px;
                &.narrow {
                  width: 15px;
                }
                .el-input {
                  .el-input__icon {
                    width: 20px;
                  }
                  .el-input__inner {
                    padding-right: 20px;
                    height: 30px;
                    background-color: rgba(0,0,0,0);
                    border: none;
                    border-radius: 0;
                    border-bottom: 1px solid @font-color;
                  }
                }
              }
            }
            .el-checkbox-group {
              .el-checkbox + .el-checkbox {
                margin-left: 5px;
              }
              .is-disabled {
                .el-checkbox__inner {
                  background-color: @light-gray-color;
                  border-color: @gray-color;
                  &::after {
                    border-color: @theme-color;
                  }
                }
              }
              .el-checkbox {
                .el-checkbox__label {
                  color: @light-font-color;
                }
                .is-checked + .el-checkbox__label {
                  color: darken(@font-color, 20%);
                }
              }
            }
            .el-input {
              width: 100%;
              .el-input__inner {
                padding: 0;
                border: none;
                text-align: center;
              }
              .el-icon-date {
                display: none;
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
            .el-select {
              width: 100%;
            }
          }
        }
      }
      .ps__scrollbar-x-rail {
        position: absolute;
        height: @scroll-bar-height;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
        opacity: 0.3;
        transition: opacity 0.3s;
        .ps__scrollbar-x {
          position: relative;
          height: @scroll-bar-height;
          background-color: @gray-color;
          border-radius: 20px;
        }
      }
      &:hover {
        .ps__scrollbar-x-rail {
          opacity: 0.6;
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
      &.edit-button {
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
        background-color: @gray-color;
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
