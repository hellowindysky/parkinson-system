<template lang="html">
  <div class="dbs-modal-wrapper" v-show="displayModal">
    <div class="dbs-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">设备品牌</span>
          <span class="field-input">
            <el-select v-model="copyInfo.deviceId" @change="changeDevice">
              <el-option v-for="option in getOptions('deviceId')" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">设备类型</span>
          <span class="field-input">
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
          <span class="field-name">程控时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.programDate"></el-date-picker>
          </span>
        </div>
        <div class="field whole-line double-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input type="textarea" v-model="copyInfo.remarks"></el-input>
          </span>
        </div>
        <div class="seperate-line"></div>
        <div class="field">
          <span class="field-name">首次开机</span>
          <span class="field-input">
            <el-select v-model="modelType" :disabled="mode === EDIT_DATA" @change="updateModelType">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="modelType===0">
          <span class="field-name">上次程控时间</span>
          <span class="field-input">
            <el-date-picker v-model="lastProgramDate"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">服药情况</span>
          <span class="field-input">
            <el-select v-model="copyInfo.isTakeMedication">
              <el-option label="有" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">服用药物</span>
          <span class="field-input">
            <el-input v-model="copyInfo.medicationStatus"></el-input>
          </span>
        </div>
        <div class="field" v-show="modelType===1">
          <span class="field-name">微毁损效应</span>
          <span class="field-input">
            <el-select v-model="copyInfo.damageEffectExist">
              <el-option label="有" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="modelType===1">
          <span class="field-name long-field-name">微毁损效应持续时间</span>
          <span class="field-input long-field-name">
            <el-input v-model="copyInfo.damageEffectDuration"></el-input>
          </span>
        </div>
        <div class="field" v-show="modelType===1">
          <span class="field-name">术后不良事件</span>
          <span class="field-input">
            <el-select v-model="copyInfo.adverseEventsExist">
              <el-option label="有" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line double-line" v-show="modelType===1">
          <span class="field-name">不良事件描述</span>
          <span class="field-input">
            <el-input type="textarea" v-model="copyInfo.adverseEventsRemark"></el-input>
          </span>
        </div>
        <div class="field whole-line double-line" v-show="modelType===0">
          <span class="field-name">患者主诉</span>
          <span class="field-input">
            <el-input type="textarea" v-model="copyInfo.complaint"></el-input>
          </span>
        </div>
        <div class="field whole-line double-line" v-show="modelType===0">
          <span class="field-name">效果及副作用</span>
          <span class="field-input">
            <el-input type="textarea" v-model="copyInfo.effectInfo"></el-input>
          </span>
        </div>
      </div>

      <div class="form-wrapper form0-wrapper" ref="form0" v-show="modelType===1">
        <div class="form-left">
          <table class="form form0">
            <tr class="row top-row">
              <td class="col sort-info" colspan="16">
                左侧肢体(右侧STN)触电疗效排序为:
                <span v-for="(contact, index) in getSideDeviceContact('left')">
                  <span v-show="index !== 0">&gt;</span>
                  <el-select class="contact" v-model="leftContactSortArray[index]" @change="updateLeftContactOrder" :clearable="true">
                    <el-option v-for="option in getOptions('leftContact')" :label="option.name" :value="option.code" :key="option.code"></el-option>
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
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].elbowTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].wristTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].kneeTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].neckTone"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].tremor"
                  @change="updateTensionTone(index)"></el-input>
              </td>
              <td class="col w1">
                {{copyInfo.patientDbsFirstDetail[index].tensionTone}}
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].changeConstantly"></el-input>
              </td>
              <td class="col w4" colspan="4">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].sideEffect"></el-input>
              </td>
              <td class="col w2" colspan="2">
                <el-select v-model="copyInfo.patientDbsFirstDetail[index].sideEffectDuration">
                  <el-option v-for="option in getOptions('duration')" :label="option.name" :value="option.code" :key="option.code"></el-option>
                </el-select>
              </td>
            </tr>
          </table>
        </div>
        <div class="form-right">
          <table class="form form0">
            <tr class="row top-row">
              <td class="col sort-info" colspan="16">
                右侧肢体(左侧STN)触电疗效排序为:
                <span v-for="(contact, index) in getSideDeviceContact('right')">
                  <span v-show="index !== 0">&gt;</span>
                  <el-select class="contact" v-model="rightContactSortArray[index]" @change="updateRightContactOrder" :clearable="true">
                    <el-option v-for="option in getOptions('rightContact')" :label="option.name" :value="option.code" :key="option.code"></el-option>
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
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].elbowTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].wristTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].kneeTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].neckTone"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].tremor"
                  @change="updateTensionTone(getRightIndex(index))"></el-input>
              </td>
              <td class="col w1">
                {{copyInfo.patientDbsFirstDetail[getRightIndex(index)].tensionTone}}
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].changeConstantly"></el-input>
              </td>
              <td class="col w4" colspan="4">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].sideEffect"></el-input>
              </td>
              <td class="col w2" colspan="2">
                <el-select v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].sideEffectDuration">
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
              <el-select v-model="copyInfo.adjustBeforeLeftSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <el-select v-model="copyInfo.adjustBeforeRightSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">方案</td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">刺激模式</td>
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
              <span v-if="mode===EDIT_DATA">{{getFollowDbsAdjustBeforePlanName(param)}}</span>
              <el-select v-else-if="mode===ADD_DATA" v-model="followDbsAdjustBeforeFirstSchemeOrder"
                @change="selectFollowDbsAdjustBeforeFirstSchemeOrder()">
                <el-option v-for="(param, index) in lastDbsParameter" v-show="index % 2 === 0"
                  :label="getFollowDbsAdjustBeforePlanName(param)" :value="param.schemeOrder" :key="param.schemeOrder"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustBeforeParamPole[index].positive" @change="updateParamPole('followDbsAdjustBefore', index)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="followDbsAdjustBeforeParamPole[index].negative" @change="updateParamPole('followDbsAdjustBefore', index)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.electric"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.electricity"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form2" v-show="modelType===0">
        <table class="form form2">
          <tr class="row top-row">
            <td class="col" colspan="22">
              单纯调整电压（总增幅 ≤ 0.4V）
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">疗效满意度</td>
            <td class="col w2" colspan="2">左侧</td>
            <td class="col w8" colspan="8">
              <el-select v-model="copyInfo.adjustVoltageLeftSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <el-select v-model="copyInfo.adjustVoltageRightSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('followDbsAdjustVoltage')"></span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">刺激模式</td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w4" colspan="4">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w3" colspan="3">效果及副作用</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustVoltageParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFollowDbsAdjustVoltagePlanName(param)}}
              <span class="iconfont icon-remove" @click="removeParam(index, 'followDbsAdjustVoltage')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustVoltageParamPole[index].positive" @change="updateParamPole('followDbsAdjustVoltage', index)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="followDbsAdjustVoltageParamPole[index].negative" @change="updateParamPole('followDbsAdjustVoltage', index)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.voltage"></el-input>
            </td>
            <td class="col w3" colspan="3">
              <el-input v-model="param.effectInfo"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form3" v-show="modelType===0">
        <table class="form form3">
          <tr class="row top-row">
            <td class="col" colspan="22">
              调整多个参数
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">疗效满意度</td>
            <td class="col w2" colspan="2">左侧</td>
            <td class="col w8" colspan="8">
              <el-select v-model="copyInfo.adjustMoreLeftSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <el-select v-model="copyInfo.adjustMoreRightSatisfaction">
                <el-option label="疗效满意" :value="0"></el-option>
                <el-option label="疗效一般" :value="1"></el-option>
                <el-option label="疗效欠佳" :value="2"></el-option>
              </el-select>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('followDbsAdjustMore')"></span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">刺激模式</td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w4" colspan="5">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustMoreParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFollowDbsAdjustMorePlanName(param)}}
              <span class="iconfont icon-remove" @click="removeParam(index, 'followDbsAdjustMore')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustMoreParamPole[index].positive" @change="updateParamPole('followDbsAdjustMore', index)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustMoreParamPole[index].negative" @change="updateParamPole('followDbsAdjustMore', index)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.electric"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form4" v-show="modelType===0">
        <table class="form form4">
          <tr class="row top-row">
            <td class="col" colspan="22">
              调整后参数
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('followDbsAdjustAfter')"></span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">刺激模式</td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w5" colspan="5">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.followDbsParams.adjustAfterParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFollowDbsAdjustAfterPlanName(param)}}
              <span class="iconfont icon-remove" @click="removeParam(index, 'followDbsAdjustAfter')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustAfterParamPole[index].positive" @change="updateParamPole('followDbsAdjustAfter', index)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="followDbsAdjustAfterParamPole[index].negative" @change="updateParamPole('followDbsAdjustAfter', index)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.electric"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <div class="form-wrapper" ref="form5" v-show="modelType===1">
        <table class="form form4">
          <tr class="row top-row">
            <td class="col" colspan="22">
              调整后参数
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus" @click="addParam('firstDbsAdjustAfter')"></span>
            </td>
            <td class="col w2" colspan="2">肢体侧</td>
            <td class="col w3" colspan="3">刺激模式</td>
            <td class="col w5" colspan="5">正极</td>
            <td class="col w5" colspan="5">负极</td>
            <td class="col w1" colspan="1">频率<br></br>(Hz)</td>
            <td class="col w1" colspan="1">脉宽<br></br>(μs)</td>
            <td class="col w1" colspan="1">电压<br></br>(V)</td>
            <td class="col w1" colspan="1">电阻<br></br>(Ω)</td>
            <td class="col w1" colspan="1">电流<br></br>(mA)</td>
          </tr>
          <tr class="row" v-for="(param, index) in copyInfo.firstDbsParams.adjustAfterParameter">
            <td class="col w2" colspan="2" rowspan="2" v-show="index % 2 === 0">
              {{getFirstDbsAdjustAfterPlanName(param)}}
              <span class="iconfont icon-remove" @click="removeParam(index, 'firstDbsAdjustAfter')"></span>
            </td>
            <td class="col w2" colspan="2">{{getLimbSide(param.limbSide)}}</td>
            <td class="col w3" colspan="3">
              <el-select v-model="param.exciteMod">
                <el-option v-for="option in getOptions('exciteMod')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="firstDbsAdjustAfterParamPole[index].positive" @change="updateParamPole('firstDbsAdjustAfter', index)">
                <el-checkbox v-for="contact in getSidePositiveContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="firstDbsAdjustAfterParamPole[index].negative" @change="updateParamPole('firstDbsAdjustAfter', index)">
                <el-checkbox v-for="contact in getSideNegativeContact(param.limbSide)" :label="contact" :key="contact"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.frequency"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.pulseWidth"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.voltage"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.resistance"></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input v-model="param.electric"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { vueCopy, reviseDateFormat, pruneObj} from 'utils/helper';
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
  'damageEffectExist': '',
  'damageEffectDuration': '',
  'adverseEventsExist': '',
  'adverseEventsRemark': '',
  'leftContactEffectOrder': '',
  'rightContactEffectOrder': '',
  'remarks': '',
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

var dbsFollowModel = {
  'deviceId': '',
  'devicePowerType': '',
  'programDate': '',
  'isTakeMedication': '',
  'medicationStatus': '',
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
      displayModal: false,
      mode: '',
      dbsPatientCode: '',
      modelType: 1, // 这个用来控制是否为首次开机，1为首次，0为非首次
      copyInfo: {},
      completeInit: false,
      leftContactSortArray: [],
      rightContactSortArray: [],
      firstDbsAdjustAfterParamPole: [],
      followDbsAdjustAfterParamPole: [],
      followDbsAdjustBeforeParamPole: [],
      followDbsAdjustVoltageParamPole: [],
      followDbsAdjustMoreParamPole: [],
      followDbsAdjustBeforeFirstSchemeOrder: '',
      lastProgramDate: '',
      lastDbsParameter: []
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'deviceInfo'
    ]),
    title() {
      if (this.mode === this.ADD_DATA) {
        return '新增程控记录';
      } else if (this.mode === this.EDIT_DATA) {
        return '程控记录';
      } else {
        return '';
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
    showModal(changeWay, info) {
      this.completeInit = false;
      this.mode = changeWay;
      if (this.mode === this.ADD_DATA) {
        this.modelType = 0;   // 新增程控记录的时候，“首次开机”默认选择“否”
        this.completeInit = true;
      } else if (this.mode === this.EDIT_DATA && info.patientDbsFirstId) {
        this.modelType = 1;
      } else if (this.mode === this.EDIT_DATA && info.patientDbsFollowId) {
        this.modelType = 0;
      }
      this.updateModelType();

      // 获取患者的 DBS 编码
      getPatientSimpleInfo(this.$route.params.id).then((data) => {
        if (data && data.patientInfo && data.patientInfo && data.patientInfo.dbsPatientCode) {
          this.dbsPatientCode = data.patientInfo.dbsPatientCode;
        }
      }, (error) => {
        console.log(error);
      });

      // 如果是编辑已有的程控记录，就要查询其程控信息的详情
      if (this.mode === this.EDIT_DATA && info.patientDbsFirstId) {
        this.modelType = 1;
        this.initByFirstModel();
        getDbsFirstInfo(info.patientDbsFirstId).then((data) => {
          vueCopy(data, this.copyInfo);
          this.updateContactOrder();
          this.updateCheckBoxModel('firstDbsAdjustAfter');
          this.$nextTick(() => {
            this.completeInit = true; // 放在 nextTick 中，才不会触发 changeDevice()
          });
        });
      } else if (this.mode === this.EDIT_DATA && info.patientDbsFollowId) {
        this.modelType = 0;
        this.initByFollowModel();
        var patientId = this.$route.params.id;
        getDbsFollowInfo(patientId, info.patientDbsFollowId).then((data) => {
          vueCopy(data, this.copyInfo);
          this.updateCheckBoxModel('followDbsAdjustAfter');
          this.updateCheckBoxModel('followDbsAdjustBefore');
          this.updateCheckBoxModel('followDbsAdjustVoltage');
          this.updateCheckBoxModel('followDbsAdjustMore');
          this.$nextTick(() => {
            this.completeInit = true;
          });
        });
      }
      this.displayModal = true;
      this.updateScrollbar();
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      this.copyInfo.patientCaseId = this.$route.params.caseId;
      reviseDateFormat(this.copyInfo);
      pruneObj(this.copyInfo);

      console.log(this.copyInfo);
      if (this.modelType === 1 && this.mode === this.ADD_DATA) {
        delete this.copyInfo.followDbsParams;
        addDbsFirstInfo(this.copyInfo).then(() => {
          this.updateAndClose();
        }, (error) => {
          console.log(error);
        });
      } else if (this.modelType === 1 && this.mode === this.EDIT_DATA) {
        delete this.copyInfo.followDbsParams;
        modifyDbsFirstInfo(this.copyInfo).then(() => {
          this.updateAndClose();
        }, (error) => {
          console.log(error);
        });

      } else if (this.modelType === 0 && this.mode === this.ADD_DATA) {
        delete this.copyInfo.firstDbsParams;
        addDbsFollowInfo(this.copyInfo).then(() => {
          this.updateAndClose();
        }, (error) => {
          console.log(error);
        });
      } else if (this.modelType === 0 && this.mode === this.EDIT_DATA) {
        delete this.copyInfo.firstDbsParams;
        modifyDbsFollowInfo(this.copyInfo).then(() => {
          this.updateAndClose();
        }, (error) => {
          console.log(error);
        });
      }
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.updateModelType(); // 因为前面的 delete 砍掉了 copyInfo的完整结构，会导致渲染出问题，所以传完数据后就重新补上
      this.displayModal = false;
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
    updateModelType() {
      if (this.modelType === 1) {
        this.initByFirstModel();
      } else if (this.modelType === 0) {
        this.initByFollowModel();
      }
      // 如果是新增程控记录，就要去获取额外的上次程控信息
      if (this.mode === this.ADD_DATA) {
        getLastDbsInfo(this.$route.params.id, this.$route.params.caseId).then((data) => {
          console.log(data);
          // 首先绑定设备和设备类型
          this.copyInfo.deviceId = data.preopsDeviceId;
          this.copyInfo.devicePowerType = data.preopsDevicePowerType;
          if (this.modelType === 0) {
            // 如果是非首次程控，除了设备和设备类型之外，还要绑定上次程控时间和调整前参数
            this.lastProgramDate = data.lastProgramDate;
            vueCopy(data.lastDbsParameter, this.lastDbsParameter);
            for (let param of this.lastDbsParameter) {
              delete param.id;
            }
            if (this.lastDbsParameter.length > 0) {
              this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 0, {});
              this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 1, {});
              vueCopy(this.lastDbsParameter[0], this.copyInfo.followDbsParams.adjustBeforeParameter[0]);
              vueCopy(this.lastDbsParameter[1], this.copyInfo.followDbsParams.adjustBeforeParameter[1]);
              this.followDbsAdjustBeforeFirstSchemeOrder = this.lastDbsParameter[0].schemeOrder;
              this.updateCheckBoxModel('followDbsAdjustBefore');
            }
          }
        });
      }
    },
    initByFirstModel() {
      this.copyInfo = {};
      vueCopy(dbsFirstModel, this.copyInfo);
      this.initContactForm();  // 生成表格所对应的数据模型
      this.updateContactOrder();
      this.updateCheckBoxModel('firstDbsAdjustAfter');
    },
    initByFollowModel() {
      vueCopy(dbsFollowModel, this.copyInfo);
      this.updateCheckBoxModel('followDbsAdjustAfter');
      this.updateCheckBoxModel('followDbsAdjustBefore');
      this.updateCheckBoxModel('followDbsAdjustVoltage');
      this.updateCheckBoxModel('followDbsAdjustMore');
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
    getOptions(fieldName) {
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
    addParam(formType) {
      if (formType === 'firstDbsAdjustAfter') {
        let paramList = this.copyInfo.firstDbsParams.adjustAfterParameter;
        let count = paramList.length;
        let order = count / 2 + 1;
        let propertyList = ['exciteMod', 'negativePole', 'positivePole', 'frequency', 'pulseWidth', 'voltage', 'resistance', 'electric'];
        for (let limbSideNum of [1, 2]) {
          let index = count - 1 + limbSideNum;
          this.$set(paramList, (index), {});
          this.$set(paramList[index], 'paramType', 1);
          this.$set(paramList[index], 'schemeOrder', order);
          this.$set(paramList[index], 'limbSide', limbSideNum);
          for (let property of propertyList) {
            this.$set(paramList[index], property, '');
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
        let order = count / 2 + 1;
        let propertyList = ['exciteMod', 'negativePole', 'positivePole', 'frequency', 'pulseWidth', 'voltage', 'resistance', 'electric'];
        for (let limbSideNum of [1, 2]) {
          let index = count - 1 + limbSideNum;
          this.$set(paramList, (index), {});
          this.$set(paramList[index], 'paramType', 1);
          this.$set(paramList[index], 'schemeOrder', order);
          this.$set(paramList[index], 'limbSide', limbSideNum);
          for (let property of propertyList) {
            this.$set(paramList[index], property, '');
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
      this.updateCheckBoxModel(formType);
    },
    getFirstDbsAdjustAfterPlanName(param) {
      var order = param.schemeOrder;
      if (order === 1) {
        return '开机参数';
      } else {
        return '备选参数' + (order - 1);
      }
    },
    getFollowDbsAdjustBeforePlanName(param) {
      var order = param.schemeOrder;
      if (order === 1) {
        return '上次方案';
      } else {
        return '备选参数' + (order - 1);
      }
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
      if (order === 1) {
        return '最后参数';
      } else {
        return '备选参数' + (order - 1);
      }
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
      if (this.copyInfo.patientDbsFirstDetail.length !== groups.length * 2) {
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
          record[property] = '';
        } else {
          record[property] = Number(record[property]);
          sum += record[property];
        }
      }
      record.tensionTone = sum;
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
      var firstIndex;
      for (var i = 0; i < this.lastDbsParameter.length; i++) {
        if (this.lastDbsParameter[i].schemeOrder === this.followDbsAdjustBeforeFirstSchemeOrder) {
          firstIndex = i;
          break;
        }
      }
      this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 0, {});
      this.$set(this.copyInfo.followDbsParams.adjustBeforeParameter, 1, {});
      vueCopy(this.lastDbsParameter[firstIndex], this.copyInfo.followDbsParams.adjustBeforeParameter[0]);
      vueCopy(this.lastDbsParameter[firstIndex + 1], this.copyInfo.followDbsParams.adjustBeforeParameter[1]);
      this.updateCheckBoxModel('followDbsAdjustBefore');
    }
  },
  created() {
    this.updateModelType();
  },
  mounted() {
    this.updateScrollbar();
    Bus.$on(this.SHOW_DBS_MODAL, this.showModal);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_DBS_MODAL, this.showModal);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 100px;
@long-field-name-width: 150px;
@scroll-bar-height: 10px;
@unit-width: 55px;

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
        padding: 5px 0;
        text-align: left;
        font-size: @normal-font-size;
        display: inline-block;
        position: relative;
        width: 50%;
        height: @field-height;
        text-align: left;
        transform: translateX(10px);  // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            right: 4%;
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
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
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
        text-align: left;
      }
      .form-left, .form-right {
        display: inline-block;
      }
      .form-right {
        position: absolute; // 这里利用两个表格高度相等，只定义一个为 absolute，从而避免容器坍塌
        left: @unit-width * 17;
        top: 0;
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
          width: @unit-width * 22;
        }
        &.form3 {
          width: @unit-width * 22;
        }
        &.form4 {
          width: @unit-width * 22;
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
              &:hover {
                opacity: 0.6;
              }
              &:active {
                opacity: 0.8;
              }
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
          background-color: #aaa;
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
