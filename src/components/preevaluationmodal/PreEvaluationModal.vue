<template lang="html">
  <div class="pre-evaluation-modal-wrapper" v-show="displayModal">
    <div class="pre-evaluation-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">DBS患者编码</span>
          <span class="field-input">
            <el-input v-model="copyInfo.dbsPatientCode" placeholder="请输入DBS患者编码"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            评估时间
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsTime" :editable="false" @change="checkWarning(['preopsTime'], 'preopsTime')"
              :class="{'warning': warningResults['preopsTime']}" placeholder="请输入术前评估时间"></el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">术前评估备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsRemark" placeholder="请输入该类评估的备注内容"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>

      <div class="sub-title-bar">剂末现象评估</div>
      <div class="content">
        <div class="field">
          <span class="field-name long-field-name">剂末现象评估时间</span>
          <span class="field-input long-field-name">
            <el-date-picker v-model="copyInfo.preopsTerminalDTO.terminalTime" :default-value="copyInfo.preopsTime"
              :editable="false" placeholder="请输入剂末现象评估时间"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name long-field-name">剂末现象评估量表</span>
          <span class="field-input long-field-name">
            {{getRealName(copyInfo.preopsTerminalDTO.terminalScale, 'eodScale')}}
          </span>
        </div>
        <div class="field">
          <span class="field-name long-field-name">
            是否存在剂末现象
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name">
            <el-select v-model="copyInfo.preopsTerminalDTO.terminalExist" @change="updateField('terminalExist')"
              :class="{'warning': warningResults['terminalExist']}">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="copyInfo.preopsTerminalDTO.terminalExist===1">
          <span class="field-name long-field-name">
            是否首次出现
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name">
            <el-select v-model="copyInfo.preopsTerminalDTO.terminalIsfirst" @change="updateField('terminalIsfirst')"
              :class="{'warning': warningResults['terminalIsfirst']}">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="copyInfo.preopsTerminalDTO.terminalIsfirst===0">
          <span class="field-name">初次出现时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsTerminalDTO.terminalFirstTime" placeholder="请输入初次出现剂末现象时间"
              @change="updateField('terminalFirstTime')" :editable="false"></el-date-picker>
          </span>
        </div>
        <div class="field" v-show="copyInfo.preopsTerminalDTO.terminalIsfirst===0">
          <span class="field-name long-field-name">
            已出现剂末现象
            <span class="required-mark">*</span>
          </span>
          <span class="field-input short-input long-field-name">
            <el-input v-model="copyInfo.preopsTerminalDTO.terminalDuration"
              @change="checkWarning(['preopsTerminalDTO', 'terminalDuration'], 'terminalDuration')"
              :class="{'warning': warningResults['terminalDuration']}"></el-input>
          </span>
          <span class="end-words">年 {{terminalDurationNote}}</span>
        </div>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsTerminalDTO.terminalRemark" placeholder="请输入剂末现象评估相关备注内容"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>

      <div class="sub-title-bar">患者日记</div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            <td class="col" rowspan="2">状态</td>
            <td class="col">
              第一天
              <span class="required-mark">*</span>
            </td>
            <td class="col">第二天</td>
            <td class="col">第三天</td>
            <td class="col">第四天</td>
            <td class="col">第五天</td>
            <td class="col">第六天</td>
            <td class="col" rowspan="2">总天数</td>
            <td class="col" rowspan="2">平均值</td>
          </tr>
          <tr class="row">
            <td class="col" v-for="(dayTimeName, listIndex) in dayTimeNameList">
              <el-date-picker v-model="copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][dayTimeName]"
                @change="updateDiaryDayTime()" :editable="false" :disabled="!isTimeEditable(listIndex)"
                :class="{'warning': listIndex === 0 && warningResults['firstDayTime']}"
                :placeholder="isTimeEditable(listIndex) ? '请选择日期' : ''"></el-date-picker>
            </td>
          </tr>
          <tr class="row" v-for="(rowName, index) in diaryRowNameList">
            <td class="col title-col">{{rowName}}</td>
            <td class="col" v-for="(hourName, listIndex) in hourNameList">
              <el-input v-model="copyInfo.preopsDiaryDTO.patientPreopsDiaryList[index][hourName]"
                @blur="updateDiaryHour()" :disabled="!hasDayTime(listIndex)"></el-input>
            </td>
            <td class="col computed-cell">
              {{ copyInfo.preopsDiaryDTO.patientPreopsDiaryList[index].dayCount }}
            </td>
            <td class="col computed-cell">
              {{ copyInfo.preopsDiaryDTO.patientPreopsDiaryList[index].hourAverage }}
            </td>
          </tr>
          <tr class="row">
            <td class="col title-col">总和</td>
            <td class="col computed-cell"
              :class="{'warning': copyInfo.preopsDiaryDTO.patientPreopsDiaryList[5][hourName] !== 24 &&
              copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][hourName] !== ''}"
              v-for="hourName in hourNameList">
              {{copyInfo.preopsDiaryDTO.patientPreopsDiaryList[5][hourName]}}
              <span class="warning-text"
                v-show="copyInfo.preopsDiaryDTO.patientPreopsDiaryList[5][hourName] !== 24 &&
                copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][hourName] !== ''">
                总和必须为24
              </span>
            </td>
            <td class="col computed-cell"></td>
            <td class="col computed-cell"></td>
          </tr>
        </table>
        <table class="table">
          <tr class="row title-row">
            <td class="col">觉醒时间</td>
            <td class="col">异动时间</td>
            <td class="col">关期总时间</td>
            <td class="col">开期总时间</td>
            <td class="col">好的开期时间</td>
          </tr>
          <tr class="row">
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.wakeTime}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.dyskinesiaTime}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.closeTime}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.totalOpenTime}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.openTime}}</td>
          </tr>
        </table>
        <table class="table">
          <tr class="row title-row">
            <td class="col">UDysRS-1</td>
            <td class="col">UPDRS-4.1</td>
            <td class="col">UPDRS-4.3</td>
            <td class="col">好的开期%</td>
            <td class="col">重异动开%</td>
            <td class="col">异动开%</td>
            <td class="col">关期%</td>
          </tr>
          <tr class="row">
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.udysbsOneRatio}}%</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.updrsFourOneRatio}}%</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.updrsFourThreeRatio}}%</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.openRatio}}%</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.depDyskinesiaOpenRatio}}%</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.norDyskinesiaOpenRatio}}%</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.closeRatio}}%</td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">日记备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsDiaryDTO.diaryRemark" placeholder="请输入患者日记相关备注内容"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">统一异动症评估</div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            <td class="col wide-col">量表</td>
            <td class="col">
              状态
              <span class="required-mark">*</span>
            </td>
            <td class="col">
              分数
              <span class="required-mark">*</span>
            </td>
            <td class="col">量表完成日期</td>
          </tr>
          <tr class="row" v-for="(scale, index) in copyInfo.preopsDyskinesiaDTO.patientPreopsScaleList">
            <td class="col wide-col">
              {{getRealName(scale.scaleInfo, 'unifyScale')}}
            </td>
            <td class="col">
              <el-select v-model="scale.bodyStatus"
                @change="checkWarning(['preopsDyskinesiaDTO', 'patientPreopsScaleList', index, 'bodyStatus'], 'dyskinesiaDTOScaleStatus')"
                :class="{'warning': warningResults['dyskinesiaDTOScaleStatus']}">
                <el-option label="开期" :value="1"></el-option>
                <el-option label="关期" :value="0"></el-option>
              </el-select>
            </td>
            <td class="col">
              <el-input v-model="scale.scaleScore" @blur="transformToNum(scale, 'scaleScore', index, 'dyskinesiaDTOScaleScore')"
                :class="{'warning': warningResults['dyskinesiaDTOScaleScore']}"></el-input>
            </td>
            <td class="col">
              <el-date-picker v-model="scale.ariseTime" :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsDyskinesiaDTO.dyskinesiaRemark" placeholder="请输入统一异动症评估相关备注内容"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">非运动症状评估</div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            <td class="col narrow-col">序号</td>
            <td class="col wide-col">量表</td>
            <td class="col narrow-col">分数</td>
            <td class="col">量表完成时间</td>
            <td class="col">备注</td>
          </tr>
          <tr class="row" v-for="(scale, index) in copyInfo.preopsNonMotorDTO.patientPreopsScaleList">
            <td class="col narrow-col">{{index + 1}}</td>
            <td class="col wide-col">
              {{getRealName(scale.scaleInfo, 'nmScale')}}
            </td>
            <td class="col narrow-col">
              <el-input v-model="scale.scaleScore" @blur="transformToNum(scale, 'scaleScore')"></el-input>
            </td>
            <td class="col">
              <el-date-picker v-model="scale.ariseTime" :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
            </td>
            <td class="col">
              <el-input v-model="scale.remarks"></el-input>
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsNonMotorDTO.nonmotorRemark" placeholder="请输入非运动症状评估相关备注内容"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">运动症状评估(急性左旋多巴冲击试验)</div>
      <div class="content">
        <div class="field">
          <span class="field-name">试验日期时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsMotorDTO.motorTestTime" placeholder="请输入冲击试验日期"
              :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">总冲击量</span>
          <span class="field-input">
            {{ getTotalLoadingDose() }}
          </span>
        </div>
        <div class="field">
          <span class="field-name long-field-name">等效美多芭量(片)</span>
          <span class="field-input long-field-name">
            {{ getEqualMadoparCount() }}
          </span>
        </div>
        <div class="field">
          <span class="field-name">LED</span>
          <span class="field-input">
            {{ getTotalLevodopaLoadingDose() }}
          </span>
        </div>
        <table class="table">
          <tr class="row title-row">
            <td class="col">
              <span class="iconfont icon-plus" @click="addMedicine"></span>
              晨用药物
            </td>
            <td class="col">
              规格
            </td>
            <td class="col">
              使用量(片)
            </td>
            <td class="col">晨剂量(等效美多芭量)</td>
            <td class="col">冲击剂量</td>
            <td class="col">等效左旋多巴冲击剂量</td>
          </tr>
          <tr class="row" v-for="(medicine, index) in copyInfo.preopsMotorDTO.patientPreopsMedicineList">
            <td class="col">
              <span class="iconfont icon-remove" @click="removeMedicine(index)"></span>
              <el-select v-model="medicine.medicineInfo" @change="selectMedicine(medicine)"
                :class="{'warning': !isMedicineValid(medicine)}">
                <el-option v-for="option in getOptions('medicineName')" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col">
              <el-select v-model="medicine.medSpecification">
                <el-option v-for="option in getOptions('medicineSpec', medicine.medicineInfo)" :label="option.name"
                  :value="option.code" :key="option.code"></el-option>
              </el-select>
            </td>
            <td class="col">
              <el-input v-model="medicine.medUsage" @blur="updateMedicineUsage(medicine)"></el-input>
            </td>
            <td class="col computed-cell">
              {{ getMorningDose(medicine) }}
            </td>
            <td class="col computed-cell">
              {{ getLoadingDose(medicine) }}
            </td>
            <td class="col computed-cell">
              {{ getLevodopaLoadingDose(medicine) }}
            </td>
          </tr>
        </table>
        <table class="table">
          <tr class="row title-row">
            <td class="col wide-col">量表</td>
            <td class="col">
              服药前得分
              <span class="required-mark">*</span>
            </td>
            <td class="col">
              服药后最低分
              <span class="required-mark">*</span>
            </td>
            <td class="col">改善率%</td>
          </tr>
          <tr class="row" v-for="(scale, index) in copyInfo.preopsMotorDTO.preopsMotorScaleList">
            <td class="col wide-col">
              {{getRealName(scale.scaleInfo, 'mScale')}}
            </td>
            <td class="col">
              <el-input v-model="scale.scaleScoreBefore" @blur="transformToNum(scale, 'scaleScoreBefore', index, 'motorDTOScaleScoreBefore')"
                :class="{'warning': warningResults['motorDTOScaleScoreBefore']}"></el-input>
            </td>
            <td class="col">
              <el-input v-model="scale.scaleScoreAfter" @blur="transformToNum(scale, 'scaleScoreAfter', index, 'motorDTOScaleScoreAfter')"
                :class="{'warning': warningResults['motorDTOScaleScoreAfter']}"></el-input>
            </td>
            <td class="col computed-cell">
              {{ scale.medImproveRatio }}
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsMotorDTO.motorRemark" placeholder="请输入运动症状评估相关备注内容"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">患者手术意愿</div>
      <div class="content">
        <div class="field">
          <span class="field-name">表态时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsIntensionDTO.intensionAriseTime" placeholder="请输入意愿表达时间"
              :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            手术意愿
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <el-select v-model="copyInfo.preopsIntensionDTO.operationIntension"
              @change="checkWarning(['preopsIntensionDTO', 'operationIntension'], 'operationIntension')"
              :class="{'warning': warningResults['operationIntension']}">
              <el-option label="同意" :value="1"></el-option>
              <el-option label="不同意" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">设备品牌</span>
          <span class="field-input">
            <el-select v-model="copyInfo.preopsIntensionDTO.deviceId">
              <el-option v-for="option in getOptions('deviceId')" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">设备类型</span>
          <span class="field-input">
            <el-select v-model="copyInfo.preopsIntensionDTO.devicePowerType">
              <el-option label="充电" :value="1"></el-option>
              <el-option label="不充电" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsIntensionDTO.intensionRemark" placeholder="请输入患者手术意愿相关内容"></el-input>
          </span>
        </div>
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
import Util from 'utils/util.js';
import { vueCopy, pruneObj, reviseDateFormat } from 'utils/helper.js';

import {
  getPatientSimpleInfo,
  getPreEvaluation,
  addPreEvaluation,
  modifyPreEvaluation
} from 'api/patient.js';

const COMT_ALERT_MESSAGE = 'COMT抑制剂类药物需要和多巴胺类制剂类药物联合使用，请检查药物处方是否录入有误';

// 本组件没有采用 template 动态生成模版，而是根据一个固定模版来绑定数据
let dataModel = {
  'dbsPatientCode': '',
  'preopsTime': '',
  'preopsRemark': '',
  'preopsTerminalDTO': {
    'terminalTime': '',
    'terminalScale': '',
    'terminalExist': 0,
    'terminalIsfirst': '',
    'terminalFirstTime': '',
    'terminalDuration': '',
    'terminalRemark': ''
  },
  'preopsDiaryDTO': {
    'patientPreopsDiaryList': [
      {
        'oneDayDiaryHour': '',
        'oneDayDiaryType': 1,
        'oneDayTime': '',
        'twoDayDiaryHour': '',
        'twoDayDiaryType': 1,
        'twoDayTime': '',
        'threeDayDiaryHour': '',
        'threeDayDiaryType': 1,
        'threeDayTime': '',
        'fourDayDiaryHour': '',
        'fourDayDiaryType': 1,
        'fourDayTime': '',
        'fiveDayDiaryHour': '',
        'fiveDayDiaryType': 1,
        'fiveDayTime': '',
        'sixDayDiaryHour': '',
        'sixDayDiaryType': 1,
        'sixDayTime': '',
        'dayCount': '',
        'hourAverage': ''
      },
      {
        'oneDayDiaryHour': '',
        'oneDayDiaryType': 2,
        'oneDayTime': '',
        'twoDayDiaryHour': '',
        'twoDayDiaryType': 2,
        'twoDayTime': '',
        'threeDayDiaryHour': '',
        'threeDayDiaryType': 2,
        'threeDayTime': '',
        'fourDayDiaryHour': '',
        'fourDayDiaryType': 2,
        'fourDayTime': '',
        'fiveDayDiaryHour': '',
        'fiveDayDiaryType': 2,
        'fiveDayTime': '',
        'sixDayDiaryHour': '',
        'sixDayDiaryType': 2,
        'sixDayTime': '',
        'dayCount': '',
        'hourAverage': ''
      },
      {
        'oneDayDiaryHour': '',
        'oneDayDiaryType': 3,
        'oneDayTime': '',
        'twoDayDiaryHour': '',
        'twoDayDiaryType': 3,
        'twoDayTime': '',
        'threeDayDiaryHour': '',
        'threeDayDiaryType': 3,
        'threeDayTime': '',
        'fourDayDiaryHour': '',
        'fourDayDiaryType': 3,
        'fourDayTime': '',
        'fiveDayDiaryHour': '',
        'fiveDayDiaryType': 3,
        'fiveDayTime': '',
        'sixDayDiaryHour': '',
        'sixDayDiaryType': 3,
        'sixDayTime': '',
        'dayCount': '',
        'hourAverage': ''
      },
      {
        'oneDayDiaryHour': '',
        'oneDayDiaryType': 4,
        'oneDayTime': '',
        'twoDayDiaryHour': '',
        'twoDayDiaryType': 4,
        'twoDayTime': '',
        'threeDayDiaryHour': '',
        'threeDayDiaryType': 4,
        'threeDayTime': '',
        'fourDayDiaryHour': '',
        'fourDayDiaryType': 4,
        'fourDayTime': '',
        'fiveDayDiaryHour': '',
        'fiveDayDiaryType': 4,
        'fiveDayTime': '',
        'sixDayDiaryHour': '',
        'sixDayDiaryType': 4,
        'sixDayTime': '',
        'dayCount': '',
        'hourAverage': ''
      },
      {
        'oneDayDiaryHour': '',
        'oneDayDiaryType': 5,
        'oneDayTime': '',
        'twoDayDiaryHour': '',
        'twoDayDiaryType': 5,
        'twoDayTime': '',
        'threeDayDiaryHour': '',
        'threeDayDiaryType': 5,
        'threeDayTime': '',
        'fourDayDiaryHour': '',
        'fourDayDiaryType': 5,
        'fourDayTime': '',
        'fiveDayDiaryHour': '',
        'fiveDayDiaryType': 5,
        'fiveDayTime': '',
        'sixDayDiaryHour': '',
        'sixDayDiaryType': 5,
        'sixDayTime': '',
        'dayCount': '',
        'hourAverage': ''
      },
      {
        'oneDayDiaryHour': '',
        'oneDayDiaryType': 0,
        'oneDayTime': '',
        'twoDayDiaryHour': '',
        'twoDayDiaryType': 0,
        'twoDayTime': '',
        'threeDayDiaryHour': '',
        'threeDayDiaryType': 0,
        'threeDayTime': '',
        'fourDayDiaryHour': '',
        'fourDayDiaryType': 0,
        'fourDayTime': '',
        'fiveDayDiaryHour': '',
        'fiveDayDiaryType': 0,
        'fiveDayTime': '',
        'sixDayDiaryHour': '',
        'sixDayDiaryType': 0,
        'sixDayTime': '',
        'dayCount': '',
        'hourAverage': ''
      }
    ],
    'wakeTime': '',
    'dyskinesiaTime': '',
    'closeTime': '',
    'totalOpenTime': '',
    'openTime': '',
    'udysbsOneRatio': '',
    'updrsFourOneRatio': '',
    'updrsFourThreeRatio': '',
    'openRatio': '',
    'depDyskinesiaOpenRatio': '',
    'norDyskinesiaOpenRatio': '',
    'closeRatio': '',
    'diaryRemark': ''
  },
  'preopsDyskinesiaDTO': {
    'patientPreopsScaleList': [
      {
        'ariseTime': '',
        'bodyStatus': '',
        'scaleInfo': 1,
        'scaleScore': '',
        'scaleType': 2
      }
    ],
    'dyskinesiaRemark': ''
  },
  'preopsNonMotorDTO': {
    'patientPreopsScaleList': [
      {
        'ariseTime': '',
        'scaleInfo': 1,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 2,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 3,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 4,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 5,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 6,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 7,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 8,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 9,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 10,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 11,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 12,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      },
      {
        'ariseTime': '',
        'scaleInfo': 13,
        'scaleScore': '',
        'scaleType': 3,
        'remarks': ''
      }
    ],
    'nonmotorRemark': ''
  },
  'preopsMotorDTO': {
    'motorTestTime': '',
    'loadingDoseCount': '',
    'patientPreopsMedicineList': [],
    'preopsMotorScaleList': [
      {
        'scaleInfo': 1,
        'scaleType': 4,
        'scaleScoreBefore': '',
        'scaleScoreAfter': '',
        'medImproveRatio': ''
      }
    ],
    'motorRemark': ''
  },
  'preopsIntensionDTO': {
    'intensionAriseTime': '',
    'operationIntension': '',
    'deviceId': '',
    'devicePowerType': '',
    'intensionRemark': ''
  }
};

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      diaryRowNameList: ['睡眠', '关期', '重异动开', '轻异动开', '无异动开'],
      dayTimeNameList: ['oneDayTime', 'twoDayTime', 'threeDayTime', 'fourDayTime', 'fiveDayTime', 'sixDayTime'],
      hourNameList: ['oneDayDiaryHour', 'twoDayDiaryHour', 'threeDayDiaryHour', 'fourDayDiaryHour', 'fiveDayDiaryHour', 'sixDayDiaryHour'],
      completeInit: false,
      copyInfo: {},
      allTotalHourOk: true,
      warningResults: {
        'preopsTime': null,
        'terminalExist': null,
        'terminalIsfirst': null,
        'terminalDuration': null,
        'firstDayTime': null,
        'dyskinesiaDTOScaleStatus': null,
        'dyskinesiaDTOScaleScore': null,
        'motorDTOScaleScoreBefore': null,
        'motorDTOScaleScoreAfter': null,
        'operationIntension': null
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'medicineInfo',
      'deviceInfo'
    ]),
    title() {
      if (this.mode === this.ADD_DATA) {
        return '新增术前评估';
      } else if (this.mode === this.EDIT_DATA) {
        return '术前评估';
      }
    },
    terminalDurationNote() {
      var terminalDuration = this.copyInfo.preopsTerminalDTO.terminalDuration;
      if (terminalDuration === undefined || terminalDuration === null || terminalDuration === '') {
        return '';
      } else if (!isNaN(terminalDuration) && Number(terminalDuration) > 3) {
        return '(运动并发症晚期＞3年)';
      } else if (!isNaN(terminalDuration) && Number(terminalDuration) <= 3) {
        return '(运动并发症早期≤3年)';
      } else {
        return '';
      }
    }
  },
  methods: {
    showModal(changeWay, info) {
      this.mode = changeWay;

      this.completeInit = false;
      this.initCopyInfo();
      this.updateDiaryDayTime();
      this.updateDiaryHour();

      // 获取患者的 DBS 编码
      getPatientSimpleInfo(this.$route.params.id).then((data) => {
        if (data && data.patientInfo && data.patientInfo && data.patientInfo.dbsPatientCode) {
          this.$set(this.copyInfo, 'dbsPatientCode', data.patientInfo.dbsPatientCode);
        } else {
          this.$set(this.copyInfo, 'dbsPatientCode', '');
        }
      }, (error) => {
        console.log(error);
      });

      // 获取术前评估详情
      if (this.mode === this.EDIT_DATA) {
        var preEvaluationId = info.preopsInfoId ? info.preopsInfoId : -1;
        getPreEvaluation(preEvaluationId).then((data) => {
          vueCopy(data, this.copyInfo);
          this.updateDiaryDayTime();
          this.updateDiaryHour();
          if (this.copyInfo.preopsMotorDTO.patientPreopsMedicineList.length === 0) {
            this.addMedicine();
          }
          this.$nextTick(() => {
            this.completeInit = true;
          });
        }, (error) => {
          console.log(error);
        });
      } else if (this.mode === this.ADD_DATA) {
        this.addMedicine();
        this.$nextTick(() => {
          this.completeInit = true;
        });
      }

      this.displayModal = true;
      this.updateScrollbar();
    },
    initCopyInfo() {
      this.copyInfo = {};
      vueCopy(dataModel, this.copyInfo);
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      // 先检查药物方案列表是否符合规则（出现COMT抑制剂就必须要有多巴胺类制剂）
      for (let medicine of this.copyInfo.preopsMotorDTO.patientPreopsMedicineList) {
        if (!this.isMedicineValid(medicine)) {
          alert(COMT_ALERT_MESSAGE);
          return;
        }
      }

      // 再检查，患者日记里面，是否每天的时间只和都是 24 小时，如果有一列不符合，都不允许通过
      if (!this.allTotalHourOk) {
        return;
      }

      // 然后检查各种必填字段
      this.checkWarning(['preopsTime'], 'preopsTime');
      this.checkWarning(['preopsTerminalDTO', 'terminalExist'], 'terminalExist');
      this.checkWarning(['preopsTerminalDTO', 'terminalIsfirst'], 'terminalIsfirst');
      this.checkWarning(['preopsTerminalDTO', 'terminalDuration'], 'terminalDuration');
      this.checkWarning(['preopsDiaryDTO', 'patientPreopsDiaryList', 0, this.dayTimeNameList[0]], 'firstDayTime');
      this.checkWarning(['preopsDyskinesiaDTO', 'patientPreopsScaleList', 0, 'bodyStatus'], 'dyskinesiaDTOScaleStatus');
      this.checkWarning(['preopsDyskinesiaDTO', 'patientPreopsScaleList', 0, 'scaleScore'], 'dyskinesiaDTOScaleScore');
      this.checkWarning(['preopsMotorDTO', 'preopsMotorScaleList', 0, 'scaleScoreBefore'], 'motorDTOScaleScoreBefore');
      this.checkWarning(['preopsMotorDTO', 'preopsMotorScaleList', 0, 'scaleScoreAfter'], 'motorDTOScaleScoreAfter');
      this.checkWarning(['preopsIntensionDTO', 'operationIntension'], 'operationIntension');
      for (var property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          alert('请完成必填字段(带红色星号部分)');
          return;   // 说明有警告信息没有处理完毕
        }
      }

      pruneObj(this.copyInfo);  // 调用此函数将值为空的属性去除掉
      reviseDateFormat(this.copyInfo);  // 将日期格式调整成符合传输要求的字符串

      this.copyInfo.patientId = this.$route.params.id;
      this.copyInfo.patientCaseId = this.$route.params.caseId;
      if (this.mode === this.ADD_DATA) {
        addPreEvaluation(this.copyInfo).then(() => {
          this.updateAndClose();
        }, (error) => {
          if (error.code === 28) {
            this.alertForDuplicatedDbsCode();
          }
        });
      } else if (this.mode === this.EDIT_DATA) {
        modifyPreEvaluation(this.copyInfo).then(() => {
          this.updateAndClose();
        }, (error) => {
          if (error.code === 28) {
            this.alertForDuplicatedDbsCode();
          }
        });
      }
    },
    updateAndClose() {
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.displayModal = false;
    },
    alertForDuplicatedDbsCode() {
      this.$message({
        message: 'DBS患者编码已存在，请修改编码后再提交',
        type: 'error',
        duration: 2000
      });
    },
    getRealName(code, typeGroupCode) {
      var typesInfo = Util.getElement('typegroupcode', typeGroupCode, this.typeGroup);
      var types = typesInfo && typesInfo.types ? typesInfo.types : [];
      var type = Util.getElement('typeCode', code, types);
      return type.typeName ? type.typeName : '';
    },
    getOptions(fieldName, param) {
      // 这里的第二个参数不是必须的，在查询药物规格时会用到
      var options = [];
      var typeGroupCodeMap = {
        'terminalScale': 'eodScale'
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
      } else {
        // 在 typeGroup 中查不到要去 tableData 中去查的
        if (fieldName === 'medicineName') {
          for (let medicine of this.medicineInfo) {
            // 只有这个药物的药物规格中，存在某一个规格满足其 dbsUsed 属性为 1 的条件时，才把这个药加进来
            let specGroup = medicine.spec ? medicine.spec : [];
            for (let spec of specGroup) {
              if (spec.dbsUsed === 1) {
                options.push({
                  name: medicine.medicineName,
                  code: medicine.medicineId
                });
                break;
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
                code: spec.medicalPec
              });
            }
          }
        } else if (fieldName === 'deviceId') {
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
    selectMedicine(medicine) {
      // 重新选择药物后，会将使用量清空，同时因为可选的规格只有一个，所以会自动选上
      medicine.medUsage = '';
      var medSpecificationOptions = this.getOptions('medicineSpec', medicine.medicineInfo);
      medicine.medSpecification = medSpecificationOptions[0].code;

      // 因为 COMT抑制剂类药物（如珂丹）需要配合多巴胺类药物使用，所以每次有药物名字更新，
      // 就要检查是否出现了只有 COMT 抑制剂而没有 多巴胺类药物的情况
      if (!this.isMedicineValid(medicine)) {
        alert(COMT_ALERT_MESSAGE);
      }
    },
    getMedicalType(medicine) {
      var targetMedicine = Util.getElement('medicineId', medicine.medicineInfo, this.medicineInfo);
      return targetMedicine.medicalType;
    },
    isMedicineValid(medicine) {
      // COMT 药物存在时，整个药物列表一定要有左旋多巴类制剂的药物存在
      // 如果不是 COMT 抑制剂类药物，则直接返回 true，
      // 如果是 COMT 抑制剂，则根据整个列表是否符合规则来返回 true 或 false
      if (this.getMedicalType(medicine) !== 3) {
        return true;
      } else {
        var hasLevodopa = false;
        for (let eachMedicine of this.copyInfo.preopsMotorDTO.patientPreopsMedicineList) {
          if (this.getMedicalType(eachMedicine) === 0) {
            hasLevodopa = true;
          }
        }
        return hasLevodopa;
      }
    },
    updateMedicineUsage(medicine) {
      // 重新填写使用量之后，要手动将其由字符串改成数字
      var usage = medicine.medUsage;
      if (usage === undefined || usage === '' || isNaN(usage)) {
        medicine.medUsage = '';
      } else {
        medicine.medUsage = Number(usage);
      }
    },
    getLevodopaDose(medicine) {
      // 根据药物，规格，使用量这三个参数计算出左旋多巴等效剂量。
      // 即根据当前规格的药物，找到其对应的左旋多巴等效量，再乘以使用量
      // 这个结果是计算晨剂量（等效美多芭量），冲击剂量，等效左旋多巴冲击剂量的基础
      var medicineId = medicine.medicineInfo;
      var spec = medicine.medSpecification;
      var usage = medicine.medUsage;

      // 先对参数进行校验，如果参数不合法，则返回 0
      if (medicineId === undefined || medicineId === '' || spec === undefined ||
        spec === '' || isNaN(spec) || usage === 'undefined' || usage === '' || isNaN(usage)) {
        return 0;
      }
      spec = Number(spec);
      usage = Number(usage);

      // 如果是 COMT 抑制剂类药物（medicalType 为 3），则单独走一套计算规则，
      // 计算列表中所有 L-Dopa 药物的左旋多巴等效剂量只和，然后再乘以 25%，作为 COMT 抑制剂类药物的左旋多巴等效剂量
      if (this.getMedicalType(medicine) === 3) {
        var totalLevodopaDose = 0;
        var levodopaMedicineList = this.copyInfo.preopsMotorDTO.patientPreopsMedicineList.filter((eachMedicine) => {
          return this.getMedicalType(eachMedicine) === 0;
        });
        for (let levodopaMedicine of levodopaMedicineList) {
          // 注意，因为 getLevodopaDose 函数的定义问题，它的返回值只能是数字（有问题的时候一律返回 0），
          // 而且下面这行是不会出现无限递归的问题的
          totalLevodopaDose += this.getLevodopaDose(levodopaMedicine);
        }
        return totalLevodopaDose * 0.25;
      }

      // 如果不是 COMT 抑制剂，那么需要在 tableData 中查询详细信息，再找到当前规格的左旋多巴系数
      var targetMedicine = Util.getElement('medicineId', medicineId, this.medicineInfo);
      var specGroup = targetMedicine.spec ? targetMedicine.spec : [];
      var targetSpecInfo = Util.getElement('medicalPec', spec, specGroup);
      var levodopaFactor = targetSpecInfo.levodopaFactor;
      if (levodopaFactor === undefined || isNaN(levodopaFactor)) {
        return 0;  // 如果没找到对应的左旋多巴系数，则返回 0
      }

      return Number((levodopaFactor * usage).toFixed(4));
    },
    getMorningDose(medicine) {
      // 晨剂量，即等效美多芭量。根据当前药物和美多芭各自的等效左旋多巴量，找到两者的等效换算公式
      // 250 mg的美多芭，等效左旋多巴 200 mg，因此求出了当前药物的等效左旋多巴剂量之后，再乘以(250 / 200)就好了
      var levodopaDose = this.getLevodopaDose(medicine);
      var morningDose = levodopaDose * (250.0 / 200.0);
      medicine.morningDose = morningDose > 0 ? morningDose : '';
      if (medicine.morningDose === '') {
        return '';
      } else {
        return Number(medicine.morningDose.toFixed(4));
      }
    },
    getLoadingDose(medicine) {
      // 冲击剂量，由晨剂量乘以 1.5 得到
      var morningDose = medicine.morningDose;
      medicine.loadingDose = morningDose !== '' ? morningDose * 1.5 : '';
      if (medicine.loadingDose === '') {
        return '';
      } else {
        return Number(medicine.loadingDose.toFixed(4));
      }
    },
    getLevodopaLoadingDose(medicine) {
      // 等效左旋多巴冲击剂量，由等效左旋多巴剂量，乘以 1.5 得到
      var levodopaDose = this.getLevodopaDose(medicine);
      var levodopaLoadingDose = levodopaDose * 1.5;
      return levodopaLoadingDose > 0 ? Number(levodopaLoadingDose.toFixed(4)) : '';
    },
    addMedicine() {
      var medicineList = this.copyInfo.preopsMotorDTO.patientPreopsMedicineList;
      var index = medicineList.length;
      this.$set(medicineList, index, {});
      let propertyList = ['medicineInfo', 'medSpecification', 'medUsage', 'morningDose', 'loadingDose'];
      for (let property of propertyList) {
        this.$set(medicineList[index], property, '');
      }
    },
    removeMedicine(index) {
      // 由于我们对每一行的药物名字进行了监控，一旦其发生变化，就自动清空改行的规格和使用量，
      // 因此一旦我们删除了某一行药物，后续每一行在依次往前挪一排的过程中，会监控到这些行的药物名字发生了变化，
      // 从而导致后面所有行的药物规格和使用量都被清除掉了（这不是我们希望看到的）
      // 所以，这里将整个列表的有效数据先进行缓存，待删除了改行，并等待监控逻辑完毕之后，再把缓存数据填回去
      var medicineList = this.copyInfo.preopsMotorDTO.patientPreopsMedicineList;
      var oldList = [];
      for (let medicine of medicineList) {
        oldList.push({
          medSpecification: medicine.medSpecification,
          medUsage: medicine.medUsage
        });
      }
      medicineList.splice(index, 1);
      oldList.splice(index, 1);

      // 因为要等待监控逻辑完成之后，所以下面的代码要放在 nextTick() 中执行
      this.$nextTick(() => {
        for (var i = 0; i < medicineList.length; i++) {
          medicineList[i].medSpecification = oldList[i].medSpecification;
          medicineList[i].medUsage = oldList[i].medUsage;
        }
      });
    },
    getTotalLoadingDose() {
      var totalLoadingDose = 0;
      var loadingDose = 0;
      for (let medicine of this.copyInfo.preopsMotorDTO.patientPreopsMedicineList) {
        loadingDose = this.getLoadingDose(medicine);
        if (loadingDose !== '') {
          totalLoadingDose += loadingDose;
        }
      }
      this.copyInfo.preopsMotorDTO.loadingDoseCount = totalLoadingDose !== 0 ? totalLoadingDose : '';
      return this.copyInfo.preopsMotorDTO.loadingDoseCount;
    },
    getEqualMadoparCount() {
      var totalMorningDose = 0;
      var morningDose = 0;
      for (let medicine of this.copyInfo.preopsMotorDTO.patientPreopsMedicineList) {
        morningDose = this.getMorningDose(medicine);
        if (morningDose !== '') {
          totalMorningDose += morningDose;
        }
      }
      return totalMorningDose !== 0 ? totalMorningDose / 250.0 : '';
    },
    getTotalLevodopaLoadingDose() {
      var totalLevodopaLoadingDose = 0;
      var levodopaLoadingDose = 0;
      for (let medicine of this.copyInfo.preopsMotorDTO.patientPreopsMedicineList) {
        levodopaLoadingDose = this.getLevodopaLoadingDose(medicine);
        if (levodopaLoadingDose !== '') {
          totalLevodopaLoadingDose += levodopaLoadingDose;
        }
      }
      return totalLevodopaLoadingDose !== 0 ? totalLevodopaLoadingDose : '';
    },
    transformToNum(obj, property, index, fieldName) {
      // 如果填写的不是一个数字，则转换成一个空字符串，如果是一个数字，则将这个数字字符串转化为真正的数字
      var value = obj[property];
      var reg = new RegExp(/^[0-9]+\.{0,1}[0-9]{0,2}$/);
      if (reg.test(value)) {
        obj[property] = Number(value);
      } else {
        obj[property] = '';
      }
      // 在这里加一些逻辑，如果是运动症状量表的得分（服药前得分 or 服药后最低分）改变了，则重新计算改善率
      if (property === 'scaleScoreBefore' || property === 'scaleScoreAfter') {
        this.updateMotorScaleMedImproveRatio();
      }

      if (fieldName === 'dyskinesiaDTOScaleScore') {
        this.checkWarning(['preopsDyskinesiaDTO', 'patientPreopsScaleList', index, 'scaleScore'], 'dyskinesiaDTOScaleScore');
      } else if (fieldName === 'motorDTOScaleScoreBefore') {
        this.checkWarning(['preopsMotorDTO', 'preopsMotorScaleList', index, 'scaleScoreBefore'], 'motorDTOScaleScoreBefore');
      } else if (fieldName === 'motorDTOScaleScoreAfter') {
        this.checkWarning(['preopsMotorDTO', 'preopsMotorScaleList', index, 'scaleScoreAfter'], 'motorDTOScaleScoreAfter');
      }
    },
    updateMotorScaleMedImproveRatio() {
      for (let scale of this.copyInfo.preopsMotorDTO.preopsMotorScaleList) {
        var scoreBefore = scale.scaleScoreBefore;
        var scoreAfter = scale.scaleScoreAfter;
        if (scoreBefore === undefined || scoreBefore === '' || scoreBefore === 0 || isNaN(scoreBefore) ||
        scoreAfter === undefined || scoreAfter === '' || isNaN(scoreAfter)) {
          return;
        } else {
          var medImproveRatio = (Number(scoreBefore) - Number(scoreAfter) * 1.0) / Number(scoreBefore);
          scale.medImproveRatio = Number((medImproveRatio * 100.0).toFixed(2));
        }
      }
    },
    updateField(fieldName) {
      if (fieldName === 'terminalExist') {
        if (this.copyInfo.preopsTerminalDTO.terminalExist === 0 || this.copyInfo.preopsTerminalDTO.terminalExist === '') {
          // 如果“是否存在剂末现象”选择了“否”或者清空，则将“是否首次出现”字段值置为空
          this.copyInfo.preopsTerminalDTO.terminalIsfirst = '';
        }
        this.checkWarning(['preopsTerminalDTO', 'terminalExist'], 'terminalExist');
        return;

      } else if (fieldName === 'terminalIsfirst') {
        if (this.copyInfo.preopsTerminalDTO.terminalIsfirst === 1 || this.copyInfo.preopsTerminalDTO.terminalIsfirst === '') {
          // 如果“是否首次出现（剂末现象）”选择了“是”或者清空，则将“首次出现时间”和“已出现剂末现象”两个字段值置为空
          this.copyInfo.preopsTerminalDTO.terminalFirstTime = '';
          this.copyInfo.preopsTerminalDTO.terminalDuration = '';
        }
        this.checkWarning(['preopsTerminalDTO', 'terminalIsfirst'], 'terminalIsfirst');
        return;

      } else if (fieldName === 'terminalFirstTime') {
        // 选择了首次出现剂末现象的时间，就要相应地更新 “已出现__年” 这个字段
        let inputTime = this.copyInfo.preopsTerminalDTO.terminalFirstTime;
        if (!inputTime) {
          return;
        } else {
          inputTime = new Date(inputTime);
        }
        let currentTime = new Date();

        let differenceYear = 0;
        let inputYear = inputTime.getFullYear();
        let inputMonth = inputTime.getMonth();
        let inputDate = inputTime.getDate();
        let currentYear = currentTime.getFullYear();
        let currentMonth = currentTime.getMonth();
        let currentDate = currentTime.getDate();
        if (currentMonth > inputMonth || (currentMonth === inputMonth && currentDate >= inputDate)) {
          differenceYear = currentYear - inputYear;
        } else {
          differenceYear = currentYear - inputYear - 1;
        }
        this.copyInfo.preopsTerminalDTO.terminalDuration = differenceYear >= 0 ? differenceYear : 0;

      }
    },
    updateDiaryDayTime() {
      // 患者日记是一个数组(preopsDiaryDTO.patientPreopsDiaryList)，
      // 一共 6 行（睡眠，关期，重异动开，轻异动开，无异动开，总和），每一行是数组下的一个对象
      // 而这些对象，每一个都包含有日期信息（即列信息），所以每一个日期都在该数组中重复出现了 6 次！
      // 我们为 组件绑定日期 时，只选取该数组的第一个元素下的日期值，那么一旦日期发生更改，就要将更改应用到每一行中

      // 在做上述操作之前，我们还要做一步校验，如果前一列的日期为空，则后面的日期也必须为空，
      // 因为实际的表格是填完了一列，才能填写下一列
      let hasToBeEmpty = false;
      let dayCount = 0;
      this.dayTimeNameList.forEach((dayTimeName) => {
        if (hasToBeEmpty) {
          this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][dayTimeName] = '';

        } else {
          let dayTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][dayTimeName];

          if (!dayTime) {
            hasToBeEmpty = true;
          } else {
            dayCount += 1;
          }
          for (let diaryItem of this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList) {
            diaryItem[dayTimeName] = dayTime;
            diaryItem.dayCount = dayCount;
          }

        }
      });

      // 检查第一列的日期是否已经填写（必填项）
      var firstDayTimeName = this.dayTimeNameList[0];
      this.checkWarning(['preopsDiaryDTO', 'patientPreopsDiaryList', 0, firstDayTimeName], 'firstDayTime');

      // 更新了日期行后，自动更新后面几排的小时数
      this.updateDiaryHour();
      return;
    },
    updateDiaryHour() {
      // 每次更新患者日记中的小时数，都会重新计算每一行的 “总天数” 和 “平均值”，以及最后一行的 “总和”
      // 用一个对象 colTotalHour 将每一列的格子里的小时数 存下来
      let colTotalHour = {};
      for (let i = 0; i < 5; i++) {
        let rowTotalHour = 0;

        for (let listIndex = 0; listIndex < this.hourNameList.length; listIndex++) {
          let hourName = this.hourNameList[listIndex];
          colTotalHour[hourName] = colTotalHour[hourName] ? colTotalHour[hourName] : 0;

          // 取到格子中的小时数之后，要先做校验，如果该列顶端的时间没有值，那么将该格子中的值强制改成空字符串
          let hour = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[i][hourName];

          let dayTimeName = this.dayTimeNameList[listIndex];
          if (!this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][dayTimeName]) {
            this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[i][hourName] = '';

          } else if (hour !== '' && !isNaN(hour) && hour > 0) {
            // toFixed() 返回的是一个字符串，所以需要用 Number() 将其还原为数字
            // 另外 Number(2.000) 返回的值是 2，正好符合我们的需要
            hour = Number(parseFloat(hour).toFixed(1));
            rowTotalHour += hour;
            this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[i][hourName] = hour;

            colTotalHour[hourName] += hour;

          } else {
            this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[i][hourName] = 0;
          }
        }
        let dayCount = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[i].dayCount;
        let hourAverage = dayCount > 0 ? Number((rowTotalHour * 1.0 / dayCount).toFixed(2)) : 0;
        this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[i].hourAverage = hourAverage;
      }

      var allTotalHourOk = true;
      for (let hourName of this.hourNameList) {
        // 最后一排，即“总和”这一排，填上我们保存的每列各自的数据之和
        colTotalHour[hourName] = Number(colTotalHour[hourName].toFixed(1));
        this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[5][hourName] = colTotalHour[hourName];
        if (colTotalHour[hourName] !== 24 && this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][hourName] !== '') {
          allTotalHourOk = false;
        }
      }
      this.allTotalHourOk = allTotalHourOk;

      // 再根据该表格的数据，更新其它表格的对应数据
      let sleepTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0].hourAverage;
      let closeTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[1].hourAverage;
      let seriousOpenTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[2].hourAverage;
      let mildOpenTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[3].hourAverage;
      let noneOpenTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[4].hourAverage;

      let totalOpenTime = seriousOpenTime + mildOpenTime + noneOpenTime;
      let wakeTime = 24 - sleepTime;
      let dyskinesiaTime = seriousOpenTime + mildOpenTime;
      let goodOpenTime = mildOpenTime + noneOpenTime;

      this.copyInfo.preopsDiaryDTO.wakeTime = wakeTime !== 24 ? Number(wakeTime.toFixed(2)) : 0; // 如果为 24，说明还没有进行有效填写
      this.copyInfo.preopsDiaryDTO.dyskinesiaTime = Number(dyskinesiaTime.toFixed(2));
      this.copyInfo.preopsDiaryDTO.closeTime = Number(closeTime.toFixed(2));
      this.copyInfo.preopsDiaryDTO.totalOpenTime = Number(totalOpenTime.toFixed(2));
      this.copyInfo.preopsDiaryDTO.openTime = Number(goodOpenTime.toFixed(2));
      this.copyInfo.preopsDiaryDTO.udysbsOneRatio = totalOpenTime !== 0 ? Number((dyskinesiaTime / totalOpenTime * 100.0).toFixed(2)) : 0;
      this.copyInfo.preopsDiaryDTO.updrsFourOneRatio = wakeTime !== 0 ? Number((dyskinesiaTime / wakeTime * 100.0).toFixed(2)) : 0;
      this.copyInfo.preopsDiaryDTO.updrsFourThreeRatio = wakeTime !== 0 ? Number((closeTime / wakeTime * 100.0).toFixed(2)) : 0;
      this.copyInfo.preopsDiaryDTO.openRatio = wakeTime !== 0 ? Number((goodOpenTime / wakeTime * 100.0).toFixed(2)) : 0;
      this.copyInfo.preopsDiaryDTO.depDyskinesiaOpenRatio = wakeTime !== 0 ? Number((seriousOpenTime / wakeTime * 100.0).toFixed(2)) : 0;
      this.copyInfo.preopsDiaryDTO.norDyskinesiaOpenRatio = wakeTime !== 0 ? Number((dyskinesiaTime / wakeTime * 100.0).toFixed(2)) : 0;
      this.copyInfo.preopsDiaryDTO.closeRatio = wakeTime !== 0 ? Number((closeTime / wakeTime * 100.0).toFixed(2)) : 0;

      return;
    },
    getStageScore(percent) {
      // UDysRS-1，UPDRS-4.1，UPDRS-4.3 显示的是其实际百分比所对应的得分（0-4分）
      if (!percent || isNaN(percent)) {
        return 0;
      } else if (percent > 0 && percent <= 25) {
        return 1;
      } else if (percent <= 50) {
        return 2;
      } else if (percent <= 75) {
        return 3;
      } else if (percent <= 100) {
        return 4;
      } else {
        return '?';
      }
    },
    isTimeEditable(listIndex) {
      if (listIndex === 0) {
        return true;
      } else {
        var dayTimeName = this.dayTimeNameList[listIndex - 1];
        var dayTime = this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][dayTimeName];
        if (!dayTime) {
          return false;
        } else {
          return true;
        }
      }
    },
    hasDayTime(listIndex) {
      var dayTimeName = this.dayTimeNameList[listIndex];
      return Boolean(this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[0][dayTimeName]);
    },
    checkWarning(propList, warningFieldName) {
      // 前面是特殊逻辑
      if (warningFieldName === 'terminalIsfirst') {
        if (this.copyInfo.preopsTerminalDTO.terminalExist === 0 || this.copyInfo.preopsTerminalDTO.terminalExist === '') {
          this.warningResults[warningFieldName] = null;
          return;
        }
      } else if (warningFieldName === 'terminalDuration') {
        if (this.copyInfo.preopsTerminalDTO.terminalExist === 0 || this.copyInfo.preopsTerminalDTO.terminalExist === '' ||
          this.copyInfo.preopsTerminalDTO.terminalIsfirst === 1 || this.copyInfo.preopsTerminalDTO.terminalIsfirst === '') {
          this.warningResults[warningFieldName] = null;
          return;
        }
      }

      // 下面是通用逻辑
      if (this.completeInit) {
        var value = this.copyInfo;
        for (let prop of propList) {
          if (typeof value === 'object') {
            value = value[prop];
          }
        }
        if (value === '' || value === undefined) {
          this.warningResults[warningFieldName] = '必填项';
          return;
        }
      }
      this.warningResults[warningFieldName] = null;
    }
  },
  created() {
    this.initCopyInfo();
  },
  mounted() {
    this.updateScrollbar();
    Bus.$on(this.SHOW_PRE_EVALUATION_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_PRE_EVALUATION_MODAL, this.showModal);
  }
};
</script>

<style lang='less'>
@import '~styles/variables.less';

@field-height: 40px;
@field-name-width: 100px;
@long-field-name-width: 140px;
@end-words-width: 180px;

@computed-cell-color: lighten(@font-color, 55%);

.pre-evaluation-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .pre-evaluation-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 800px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .sub-title-bar {
      padding: 15px 10px;
      text-align: left;
      font-weight: bold;
    }
    .content {
      text-align: left;
      font-size: 0;
      .field {
        padding: 5px 0;
        text-align: left;
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
        .end-words {
          display: inline-block;
          position: absolute;
          padding-left: 10px;
          box-sizing: border-box;
          top: 0;
          right: 8%;
          width: @end-words-width;
          text-align: left;
          line-height: @field-height;
          font-size: @normal-font-size;
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
          &.short-input {
            right: calc(~'8% + @{end-words-width}');
          }
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
      .table {
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
      margin: 15px auto 10px;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 10px 20px 20px;
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
