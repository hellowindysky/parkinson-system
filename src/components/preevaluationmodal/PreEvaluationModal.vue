<template lang="html">
  <div class="pre-evaluation-modal-wrapper" v-show="displayModal">
    <div class="pre-evaluation-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">DBS患者编码</span>
          <span class="field-input">
            <el-input v-model="copyInfo.dbsPatientCode"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">评估时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsTime" :picker-options="dateOptions"
              :editable="false"></el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">术前评估备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preobsRemark"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>

      <div class="sub-title-bar">剂末现象评估</div>
      <div class="content">
        <div class="field">
          <span class="field-name">剂末现象评估时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsTerminalDTO.terminalTime" :default-value="copyInfo.preopsTime"
              :picker-options="dateOptions" :editable="false"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">剂末现象评估量表</span>
          <span class="field-input">
            <el-select v-model="copyInfo.preopsTerminalDTO.terminalScale">
              <el-option v-for="option in getOptions('terminalScale')"
                :label="option.name" :value="option.code" :key="option.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">是否存在剂末现象</span>
          <span class="field-input">
            <el-select v-model="copyInfo.preopsTerminalDTO.terminalExist" @change="updateField('terminalExist')">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="copyInfo.preopsTerminalDTO.terminalExist===1">
          <span class="field-name">是否首次出现</span>
          <span class="field-input">
            <el-select v-model="copyInfo.preopsTerminalDTO.terminalIsfirst" @change="updateField('terminalIsfirst')">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="copyInfo.preopsTerminalDTO.terminalIsfirst===0">
          <span class="field-name">初次出现时间</span>
          <span class="field-input">
            <el-date-picker v-model="copyInfo.preopsTerminalDTO.terminalFirstTime" :picker-options="dateOptions"
              @change="updateField('terminalFirstTime')" :editable="false"></el-date-picker>
          </span>
        </div>
        <div class="field" v-show="copyInfo.preopsTerminalDTO.terminalIsfirst===0">
          <span class="field-name">已出现剂末现象</span>
          <span class="field-input short-input">
            <el-input v-model="copyInfo.preopsTerminalDTO.terminalDuration"></el-input>
          </span>
          <span class="end-words">年 {{terminalDurationNote}}</span>
        </div>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsTerminalDTO.terminalRemark"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>

      <div class="sub-title-bar">患者日记</div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            <td class="col" rowspan="2">状态</td>
            <td class="col">第一天</td>
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
                :picker-options="dateOptions"></el-date-picker>
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
            <td class="col computed-cell" v-for="hourName in hourNameList">
              {{copyInfo.preopsDiaryDTO.patientPreopsDiaryList[5][hourName]}}
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
            <td class="col computed-cell">{{getStageScore(copyInfo.preopsDiaryDTO.udysbsOneRatio)}}</td>
            <td class="col computed-cell">{{getStageScore(copyInfo.preopsDiaryDTO.updrsFourOneRatio)}}</td>
            <td class="col computed-cell">{{getStageScore(copyInfo.preopsDiaryDTO.updrsFourThreeRatio)}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.openRatio}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.depDyskinesiaOpenRatio}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.norDyskinesiaOpenRatio}}</td>
            <td class="col computed-cell">{{copyInfo.preopsDiaryDTO.closeRatio}}</td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">日记备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsDiaryDTO.diaryRemark"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">统一异动症评估</div>
      <div class="content">
        <table class="table">
          <tr class="row title-row">
            <td class="col wide-col">量表</td>
            <td class="col">状态</td>
            <td class="col">分数</td>
            <td class="col">量表完成日期</td>
          </tr>
          <tr class="row" v-for="scale in copyInfo.preopsDyskinesiaDTO.patientPreopsScaleList">
            <td class="col wide-col">
              {{getRealName(scale.scaleInfo, 'unifyScale')}}
            </td>
            <td class="col">
              <el-select v-model="scale.bodyStatus">
                <el-option label="开期" :value="1"></el-option>
                <el-option label="关期" :value="0"></el-option>
              </el-select>
            </td>
            <td class="col">
              <el-input v-model="scale.scaleScore" @blur="transformToNum(scale, 'scaleScore')"
                :class="{'warning': isNaN(scale.scaleScore)}"></el-input>
            </td>
            <td class="col">
              <el-date-picker v-model="scale.ariseTime" :picker-options="dateOptions"
                :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsDyskinesiaDTO.dyskinesiaRemark"></el-input>
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
              <el-input v-model="scale.scaleScore" @blur="transformToNum(scale, 'scaleScore')"
                :class="{'warning': isNaN(scale.scaleScore)}"></el-input>
            </td>
            <td class="col">
              <el-date-picker v-model="scale.ariseTime" :picker-options="dateOptions"
               :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
            </td>
            <td class="col">
              <el-input v-model="scale.remarks"></el-input>
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input v-model="copyInfo.preopsNonMotorDTO.nonmotorRemark"></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">运动症状评估(急性左旋多巴冲击试验)</div>
      <div class="content">
        <div class="field">
          <span class="field-name">试验日期时间</span>
          <span class="field-input">
            <el-date-picker :picker-options="dateOptions"
              :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">总冲击量</span>
          <span class="field-input"></span>
        </div>
        <div class="field">
          <span class="field-name">等效美多芭量(片)</span>
          <span class="field-input"></span>
        </div>
        <div class="field">
          <span class="field-name">LED</span>
          <span class="field-input"></span>
        </div>
        <table class="table">
          <tr class="row">
            <td class="col">晨用药物</td>
            <td class="col">规格</td>
            <td class="col">使用量(片)</td>
            <td class="col">晨剂量(等效美多芭量)</td>
            <td class="col">冲击剂量</td>
            <td class="col">等效左旋多巴冲击剂量</td>
          </tr>
          <tr class="row">
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
        </table>
        <table class="table">
          <tr class="row">
            <td class="col wide-col">量表</td>
            <td class="col">服药前得分</td>
            <td class="col">服药后最低分</td>
            <td class="col">改善率</td>
          </tr>
          <tr class="row">
            <td class="col wide-col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
        </table>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>
      <div class="sub-title-bar">患者手术意愿</div>
      <div class="content">
        <div class="field">
          <span class="field-name">表态时间</span>
          <span class="field-input">
            <el-date-picker :picker-options="dateOptions"
              :editable="false" :default-value="copyInfo.preopsTime"></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">手术意愿</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="a" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">设备品牌</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="a" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">设备类型</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="a" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input></el-input>
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
// import { vueCopy } from 'utils/helper.js';

import {
  getPatientSimpleInfo,
  getPreEvaluation
} from 'api/patient.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      diaryRowNameList: ['睡眠', '关期', '重异动开', '轻异动开', '无异动开'],
      dayTimeNameList: ['oneDayTime', 'twoDayTime', 'threeDayTime', 'fourDayTime', 'fiveDayTime', 'sixDayTime'],
      hourNameList: ['oneDayDiaryHour', 'twoDayDiaryHour', 'threeDayDiaryHour', 'fourDayDiaryHour', 'fiveDayDiaryHour', 'sixDayDiaryHour'],
      dateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      copyInfo: {
        'preopsTime': '',
        'preopsRemark': '',
        'preopsTerminalDTO': {
          'terminalTime': '',
          'terminalScale': '',
          'terminalExist': '',
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
          'motorTestTime': '2017-10-01',
          'loadingDoseCount': 378,
          'patientPreopsMedicineList': [
            {
              'loadingDose': 375,
              'medSpecification': 250,
              'medUsage': 1,
              'medicineInfo': 1,
              'morningDose': 250,
              'patientPreopsInfoId': 15
            },
            {
              'loadingDose': 3,
              'medSpecification': 1,
              'medUsage': 2,
              'medicineInfo': 3,
              'morningDose': 2,
              'patientPreopsInfoId': 15
            }
          ],
          'patientPreopsScaleList': [
            {
              'drugFlag': 0,
              'scaleInfo': 1,
              'scaleScore': 99,
              'scaleType': 4,
              'patientPreopsInfoId': 15,
              'scaleName': 'MDS-UPDRS III'
            },
            {
              'drugFlag': 1,
              'medImproveRatio': 11.11,
              'scaleInfo': 1,
              'scaleScore': 88,
              'scaleType': 4,
              'patientPreopsInfoId': 15,
              'scaleName': 'MDS-UPDRS III'
            }
          ],
          'motorRemark': 'ADFA'
        },
        'preopsIntensionDTO': {
          'intensionAriseTime': '2017-10-29',
          'operationIntension': 1,
          'deviceId': '8a8d9f635dc9f57f015dcba7d615002a',
          'devicePowerType': 0,
          'intensionRemark': 'R232Q4RSD'
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
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
      console.log(info);

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
      });

      // 获取术前评估详情
      if (changeWay === this.EDIT_DATA) {
        var preEvaluationId = info.preopsInfoId ? info.preopsInfoId : -1;
        getPreEvaluation(preEvaluationId).then((data) => {
          console.log('获取的详细数据', data);
        });
      }

      this.displayModal = true;
      this.updateScrollbar();
    },
    initCopyInfo() {
      // this.copyInfo = {};
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
      // pruneObj(this.copyInfo);  // 调用此函数将值为空的属性去除掉
      console.log(this.copyInfo);
      // this.displayModal = false;
    },
    getRealName(code, typeGroupCode) {
      var typesInfo = Util.getElement('typegroupcode', typeGroupCode, this.typeGroup);
      var types = typesInfo && typesInfo.types ? typesInfo.types : [];
      var type = Util.getElement('typeCode', code, types);
      return type.typeName ? type.typeName : '';
    },
    getOptions(fieldName) {
      var options = [];
      var typeGroupCodeMap = {
        'terminalScale': 'eodScale'
      };
      if (typeGroupCodeMap[fieldName]) {
        var typesInfo = Util.getElement('typegroupcode', 'eodScale', this.typeGroup);
        var types = typesInfo && typesInfo.types ? typesInfo.types : [];
        for (let type of types) {
          options.push({
            name: type.typeName,
            code: type.typeCode
          });
        }
      }
      return options;
    },
    transformToNum(obj, property) {
      // 如果填写的不是一个数字，则转换成一个空字符串，如果是一个数字，则将这个数字字符串转化为真正的数字
      var value = obj[property];
      var reg = new RegExp(/^[0-9]+\.{0,1}[0-9]{0,2}$/);
      if (reg.test(value)) {
        obj[property] = Number(value);
      } else {
        obj[property] = '';
      }
    },
    updateField(fieldName) {
      if (fieldName === 'terminalExist') {
        if (this.copyInfo.preopsTerminalDTO.terminalExist === 0) {
          // 如果“是否存在剂末现象”选择了“否”，则将“是否首次出现”字段值置为空
          this.copyInfo.preopsTerminalDTO.terminalIsfirst = '';
        }
        return;

      } else if (fieldName === 'terminalIsfirst') {
        if (this.copyInfo.preopsTerminalDTO.terminalExist === 1) {
          // 如果“是否首次出现（剂末现象）”选择了“是”，则将“首次出现时间”和“已出现剂末现象”两个字段值置为空
          this.copyInfo.preopsTerminalDTO.terminalFirstTime = '';
          this.copyInfo.preopsTerminalDTO.terminalDuration = '';
        }
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

      for (let hourName of this.hourNameList) {
        // 最后一排，即“总和”这一排，填上我们保存的每列各自的数据之和
        colTotalHour[hourName] = Number(colTotalHour[hourName].toFixed(1));
        this.copyInfo.preopsDiaryDTO.patientPreopsDiaryList[5][hourName] = colTotalHour[hourName];
      }

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
    }
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
@field-name-width: 120px;
@long-field-name-width: 160px;
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
        transform: translateX(10px);
        // 这一行是为了修补视觉上的偏移
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
            &.title-col {
              background-color: @font-color;
              color: #fff;
            }
            &.computed-cell {
              background-color: @computed-cell-color;
            }
            &.wide-col {
              width: 30%;
            }
            &.narrow-col {
              width: 5%;
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
