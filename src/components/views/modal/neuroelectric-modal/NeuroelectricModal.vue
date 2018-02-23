<template lang="html">
  <div class="neuroelectric-modal-wrapper">
    <div class="neuroelectric-modal" ref="neuroelectricModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name long-field-name">
            电检查类型
            <span class="required-mark">*</span>
          </span>
          <span class="field-input long-field-name">
            <span class="warning-text">{{warningResults.elecExamType}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{getFieldValue(copyInfo.elecExamType, 'elecExam')}}</span>
            <el-select v-else placeholder="请选择电生理检查类型" v-model="copyInfo.elecExamType" @change="chooseElecExamType"
              :class="{'warning': warningResults.elecExamType}" :disabled="mode!==ADD_NEW_CARD" size="small">
              <el-option v-for="option in getOptions('elecExam')" :key="option.code" :label="option.name" :value="option.code" ></el-option>
            </el-select>
          </span>
        </div>
        <div class="seperate-line"></div>
        <!-- <div class="field" v-if="copyInfo.elecExamType===1">
          <span class="field-name">
            肌电图名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.elecTroGramId}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{getFieldValue(copyInfo.elecTroGramId, 'emgName')}}</span>
            <el-select v-else placeholder="请选择肌电图名称" v-model="copyInfo.elecTroGramId" :class="{'warning': warningResults.elecTroGramId}"
              :disabled="mode!==ADD_NEW_CARD" @change="selectEmg" size="small">
              <el-option v-for="emg in emgTypeList" :key="emg.id" :label="emg.emgName" :value="emg.id" ></el-option>
            </el-select>
          </span>
        </div> -->
        <div class="field" v-if="copyInfo.elecExamType===1">
          <span class="field-name">
            肌电图类型
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span>{{getFieldValue(copyInfo.etgType, 'emgType')}}</span>
          </span>
        </div>
        <div class="field whole-line" v-if="copyInfo.elecExamType===1">
          <span class="field-name">
            检查结果
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patEleResule}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="copyInfo.patEleResule" placeholder="请输入检查结果"></el-input>
          </span>
        </div>
        <div class="field whole-line" v-if="copyInfo.elecExamType===1">
          <span class="field-name">
            提示内容
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patEleHint}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="copyInfo.patEleHint" placeholder="请输入提示信息"></el-input>
          </span>
        </div>

        <div class="field" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            记录开始
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.recordStart}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.recordStart}}</span>
            <el-date-picker v-else
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              :class="{'warning': warningResults.recordStart}"
              v-model="copyInfo.recordStart"
              placeholder="请输入记录开始时间"
              :picker-options="pickerOptions"
              @change="updateWarning('recordStart')"></el-date-picker>
          </span>
        </div>
        <div class="field" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            身高 (cm)
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.height}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.height}}</span>
            <el-input v-else v-model="copyInfo.height" placeholder="请输入身高" :class="{'warning': warningResults.height}"
              @change="updateWarning('height')"></el-input>
          </span>
        </div>
        <div class="field" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            记录结束
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.recordEnd}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.recordEnd}}</span>
            <el-date-picker v-else
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              :class="{'warning': warningResults.recordEnd}"
              v-model="copyInfo.recordEnd"
              placeholder="请输入记录结束时间"
              :picker-options="pickerOptions"
              @change="updateWarning('recordEnd')"></el-date-picker>
          </span>
        </div>
        <div class="field" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            体重 (kg)
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.weight}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.weight}}</span>
            <el-input v-else v-model="copyInfo.weight" placeholder="请输入体重" :class="{'warning': warningResults.weight}"
              @change="updateWarning('weight')"></el-input>
          </span>
        </div>
        <div class="field" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            总记录时间
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span>{{totalRecordTime}}</span>
          </span>
        </div>
        <div class="field" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            肥胖指数 (BMI)
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span>{{BMIIndex}}</span>
          </span>
        </div>
        <div class="field whole-line" v-if="copyInfo.elecExamType===2">
          <span class="field-name">
            检查结果
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.examResult}}</span>
            <el-input v-else type="textarea" :rows="2" v-model="copyInfo.examResult" placeholder="请输入检查结果"></el-input>
          </span>
        </div>

        <h3 class="form-title" v-if="tableMode===SON_OPEN && (copyInfo.elecExamType===1 || copyInfo.elecExamType===2)">
          {{currentTableName}}
        </h3>
        <div class="form-wrapper" v-if="copyInfo.elecExamType===1 || copyInfo.elecExamType===2" ref="formWrapper">
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
            <tr class="row" v-for="(table, index) in emgTableList" v-if="copyInfo.elecExamType===1">
              <td class="col col-width-10">
                {{index+1}}
              </td>
              <td class="col col-width-30">
                {{table.cnName}}
              </td>
              <td class="col col-width-15">
                <span class="text-button" v-if="mode===VIEW_CURRENT_CARD" @click="selectTable(table.name)">查看</span>
                <span class="text-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="selectTable(table.name)">编辑</span>
              </td>
            </tr>
            <tr class="row" v-for="(type, index) in sleepMonitoringTypes" v-if="copyInfo.elecExamType===2">
              <td class="col col-width-10">
                {{index+1}}
              </td>
              <td class="col col-width-30">
                {{type.typeName}}
              </td>
              <td class="col col-width-15">
                <span class="text-button" v-if="mode===VIEW_CURRENT_CARD" @click="selectSleepMonitoringSubTable(type.typeCode)">查看</span>
                <span class="text-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="selectSleepMonitoringSubTable(type.typeCode)">编辑</span>
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
                {{index + 1}}
              </td>
              <td class="col col-width-10">
                {{getFieldValue(item.nerveType, 'nerveType')}}
              </td>
              <td class="col col-width-20">
                {{item.nerveAndSite}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotNerCondResu[index].latency}}</span>
                <el-input v-else v-model="copyInfo.patientMotNerCondResu[index].latency"></el-input>
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotNerCondResu[index].amplitude}}</span>
                <el-input v-else v-model="copyInfo.patientMotNerCondResu[index].amplitude"></el-input>
              </td>
              <td class="col col-width-15">
                {{item.segment}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotNerCondResu[index].latencyDifference}}</span>
                <el-input v-else v-model="copyInfo.patientMotNerCondResu[index].latencyDifference"></el-input>
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotNerCondResu[index].distance}}</span>
                <el-input v-else v-model="copyInfo.patientMotNerCondResu[index].distance"></el-input>
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotNerCondResu[index].conductionVelocity}}</span>
                <el-input v-else v-model="copyInfo.patientMotNerCondResu[index].conductionVelocity"></el-input>
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
                {{item.nerve}}
              </td>
              <td class="col col-width-25">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patienFWaStuResu[index].mLatency}}</span>
                <el-input v-else v-model="copyInfo.patienFWaStuResu[index].mLatency"></el-input>
              </td>
              <td class="col col-width-25">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patienFWaStuResu[index].fLatency}}</span>
                <el-input v-else v-model="copyInfo.patienFWaStuResu[index].fLatency"></el-input>
              </td>
              <td class="col col-width-20">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patienFWaStuResu[index].fProportion}}</span>
                <el-input v-else v-model="copyInfo.patienFWaStuResu[index].fProportion"></el-input>
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
              <td class="col col-width-18">
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
                {{getFieldValue(item.nerveType, 'nerveType')}}
              </td>
              <td class="col col-width-15">
                {{item.nerveAndSite}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientSenNerCondResu[index].onsetLatency}}</span>
                <el-input v-else v-model="copyInfo.patientSenNerCondResu[index].onsetLatency"></el-input>
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientSenNerCondResu[index].peakLatency}}</span>
                <el-input v-else v-model="copyInfo.patientSenNerCondResu[index].peakLatency"></el-input>
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientSenNerCondResu[index].amplitude}}</span>
                <el-input v-else v-model="copyInfo.patientSenNerCondResu[index].amplitude"></el-input>
              </td>
              <td class="col col-width-18">
                {{item.segment}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientSenNerCondResu[index].latencyDifference}}</span>
                <el-input v-else v-model="copyInfo.patientSenNerCondResu[index].latencyDifference"></el-input>
              </td>
              <td class="col col-width-5">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientSenNerCondResu[index].distance}}</span>
                <el-input v-else v-model="copyInfo.patientSenNerCondResu[index].distance"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientSenNerCondResu[index].conductionVelocity}}</span>
                <el-input v-else v-model="copyInfo.patientSenNerCondResu[index].conductionVelocity"></el-input>
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
                {{item.muscle}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].insertional}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].insertional"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].spoActFib}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].spoActFib"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].spoActWave}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].spoActWave"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].spoActFasc}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].spoActFasc"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].volMuapdur}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].volMuapdur"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].volmuapamp}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].volmuapamp"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientNeedExamItemResu[index].volmuappoly}}</span>
                <el-input v-else v-model="copyInfo.patientNeedExamItemResu[index].volmuappoly"></el-input>
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
                {{getFieldValue(item.muscle, 'muscle')}}
              </td>
              <td class="col col-width-30">
                {{item.examItemName}}
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotUniAnaResu[index].duration}}</span>
                <el-input v-else v-model="copyInfo.patientMotUniAnaResu[index].duration"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotUniAnaResu[index].amplitude}}</span>
                <el-input v-else v-model="copyInfo.patientMotUniAnaResu[index].amplitude"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotUniAnaResu[index].phases}}</span>
                <el-input v-else v-model="copyInfo.patientMotUniAnaResu[index].phases"></el-input>
              </td>
              <td class="col col-width-7">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotUniAnaResu[index].spikeDuration}}</span>
                <el-input v-else v-model="copyInfo.patientMotUniAnaResu[index].spikeDuration"></el-input>
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientMotUniAnaResu[index].remarks}}</span>
                <el-input v-else v-model="copyInfo.patientMotUniAnaResu[index].remarks"></el-input>
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
                <span v-if="mode===VIEW_CURRENT_CARD">{{item.muscle}}</span>
                <el-input v-else v-model="item.muscle" disabled></el-input>
              </td>
              <td class="col col-width-25">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientIntPatAnaItem[index].turn}}</span>
                <el-input v-else v-model="copyInfo.patientIntPatAnaItem[index].turn"></el-input>
              </td>
              <td class="col col-width-20">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientIntPatAnaItem[index].amplitude}}</span>
                <el-input v-else v-model="copyInfo.patientIntPatAnaItem[index].amplitude" ></el-input>
              </td>
              <td class="col col-width-20">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.patientIntPatAnaItem[index].ratio}}</span>
                <el-input v-else v-model="copyInfo.patientIntPatAnaItem[index].ratio"></el-input>
              </td>
            </tr>
          </table>

          <table class="form"
            v-if="tableMode===SON_OPEN && currentTable===SLEEP_MONITORING_ITEM"
            v-for="(group, groupIndex) in sleepMonitoringItemGroups">
            <tr class="row" v-if="group.colItems.length===0"
              v-for="row in rearrangeRows(group.rowItems)">
              <td class="col col-width-10">
                {{row[0].fieldName}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  <span v-if="row[0].uiType===8">
                    {{simplifyTimeWithoutDate(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue)}}
                  </span>
                  <span v-else>
                    {{copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue}}
                  </span>
                </span>
                <span v-else-if="row[0].fieldCode==='sleepEfficiency'">
                  {{calcSleepEfficiency(copyInfo.patientFieldCode[sleepMonitoringSubTableCode], row[0].id, 0, group.rowItems)}}
                </span>
                <el-input v-else-if="row[0].uiType===1"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue"
                  :placeholder="row[0].fieldDesc">
                </el-input>
                <el-input v-else-if="row[0].uiType===2"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue"
                  @blur="transformToNumber(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0])"
                  :placeholder="row[0].fieldDesc">
                </el-input>
                <el-select v-else-if="row[0].uiType===3"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue"
                  :placeholder="row[0].fieldDesc">
                </el-select>
                <el-date-picker v-else-if="row[0].uiType===6"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row[0].id,0], 6)"
                  :picker-options="pickerOptions" :placeholder="row[0].fieldDesc">
                </el-date-picker>
                <el-date-picker v-else-if="row[0].uiType===7" format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row[0].id,0], 7)"
                  :picker-options="pickerOptions" :placeholder="row[0].fieldDesc">
                </el-date-picker>
                <el-time-picker v-else-if="row[0].uiType===8" format="HH:mm:ss"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[0].id][0].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row[0].id,0], 8)"
                  :picker-options="pickerOptions" :placeholder="row[0].fieldDesc">
                </el-time-picker>
              </td>
              <td class="col col-width-10" v-if="row.length===2">
                {{row[1].fieldName}}
              </td>
              <td class="col col-width-10" v-if="row.length===2">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  <span v-if="row[1].uiType===8">
                    {{simplifyTimeWithoutDate(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue)}}
                  </span>
                  <span v-else>
                    {{copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue}}
                  </span>
                </span>
                <span v-else-if="row[1].fieldCode==='sleepEfficiency'">
                  {{calcSleepEfficiency(copyInfo.patientFieldCode[sleepMonitoringSubTableCode], row[1].id, 0, group.rowItems)}}
                </span>
                <el-input v-else-if="row[1].uiType===1"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue"
                  :placeholder="row[1].fieldDesc">
                </el-input>
                <el-input v-else-if="row[1].uiType===2"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue"
                  @blur="transformToNumber(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0])"
                  :placeholder="row[1].fieldDesc">
                </el-input>
                <el-select v-else-if="row[1].uiType===3"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue"
                  :placeholder="row[1].fieldDesc">
                </el-select>
                <el-date-picker v-else-if="row[1].uiType===6"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row[1].id,0], 6)"
                  :picker-options="pickerOptions" :placeholder="row[1].cnFieldDesc">
                </el-date-picker>
                <el-date-picker v-else-if="row[1].uiType===7" format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row[1].id,0], 7)"
                  :picker-options="pickerOptions" :placeholder="row[1].fieldDesc">
                </el-date-picker>
                <el-time-picker v-else-if="row[1].uiType===8" format="HH:mm:ss"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row[1].id][0].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row[1].id,0], 8)"
                  :picker-options="pickerOptions" :placeholder="row[1].fieldDesc">
                </el-time-picker>
              </td>
            </tr>

            <tr class="row first-row" v-if="group.colItems.length>0">
              <td class="col col-width-10"></td>
              <td class="col col-width-10" v-for="col in group.colItems">
                {{col.fieldName}}
              </td>
            </tr>
            <tr class="row" v-for="row in group.rowItems" v-if="group.colItems.length>0">
              <td class="col col-width-10">
                {{row.fieldName}}
              </td>
              <td class="col col-width-10" v-for="col in group.colItems">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  <span v-if="col.uiType===8 || (col.uiType===undefined && row.uiType===8)">
                    {{simplifyTimeWithoutDate(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue)}}
                  </span>
                  <span v-else>
                    {{copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue}}
                  </span>
                </span>
                <span v-else-if="col.fieldCode==='total'">
                  {{calcTotalOfRow(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id], col.id, group.colItems, row.uiType, row.fieldCode)}}
                </span>
                <el-input v-else-if="col.uiType===1 || (col.uiType===undefined && row.uiType===1)"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue"
                  :placeholder="getPlaceHolder(col.fieldDesc, row.fieldDesc, '请输入')">
                </el-input>
                <el-input v-else-if="col.uiType===2 || (col.uiType===undefined && row.uiType===2)"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue"
                  @blur="transformToNumber(copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id])"
                  :placeholder="getPlaceHolder(col.fieldDesc, row.fieldDesc, '请输入')">
                </el-input>
                <el-select v-else-if="col.uiType===3 || (col.uiType===undefined && row.uiType===3)"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue"
                  :placeholder="getPlaceHolder(col.fieldDesc, row.fieldDesc, '请选择')">
                </el-select>
                <el-date-picker v-else-if="col.uiType===6 || (col.uiType===undefined && row.uiType===6)"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row.id,col.id], 6)"
                  :picker-options="pickerOptions" :placeholder="getPlaceHolder(col.fieldDesc, row.fieldDesc, '请输入')">
                </el-date-picker>
                <el-date-picker v-else-if="col.uiType===7 || (col.uiType===undefined && row.uiType===7)"
                  format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row.id,col.id], 7)"
                  :picker-options="pickerOptions" :placeholder="getPlaceHolder(col.fieldDesc, row.fieldDesc, '请输入')">
                </el-date-picker>
                <el-time-picker v-else-if="col.uiType===8 || (col.uiType===undefined && row.uiType===8)" format="HH:mm:ss"
                  v-model="copyInfo.patientFieldCode[sleepMonitoringSubTableCode][row.id][col.id].fieldValue"
                  @change="recordValuePath(['patientFieldCode',sleepMonitoringSubTableCode,row.id,col.id], 8)"
                  :picker-options="pickerOptions" :placeholder="getPlaceHolder(col.fieldDesc, row.fieldDesc, '请输入')">
                </el-time-picker>
              </td>
            </tr>
          </table>
        </div>

        <div v-if="copyInfo.elecExamType===EEG_CODE || copyInfo.elecExamType===ECG_CODE">
          <div class="field">
            <span class="field-name">
              检查时间:
              <span class="required-mark">*</span>
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.checkDate}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text">{{warningResults.checkDate}}</span>
              <el-date-picker
                v-model="copyInfo.checkDate"
                :class="{'warning': warningResults.checkDate}"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                @change="updateWarning('checkDate')">
              </el-date-picker>
            </span>
          </div>
          <div class="field">
            <span class="field-name">
              检查编号:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span>{{copyInfo.checkNum}}</span>
            </span>
            <span class="field-input" v-else>
              <span class="warning-text"></span>
              <el-input v-model="copyInfo.checkNum" placeholder="请输入患者检查编号"></el-input>
            </span>
          </div>
          <div class="field">
            <span class="field-name">
              检查设备:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span class="warning-text"></span>
              <span>{{copyInfo.checkDevice}}</span>
            </span>
            <span class="field-input" v-else>
              <el-input v-model="copyInfo.checkDevice" placeholder="请输入检查设备编号"></el-input>
            </span>
          </div>
          <div class="field whole-line">
            <span class="field-name">
              检查结论:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span class="warning-text"></span>
              <span>{{copyInfo.checkConclusion}}</span>
            </span>
            <span class="field-input" v-else>
              <el-input v-model="copyInfo.checkConclusion" placeholder="请输入检查结论" type="textarea" :maxlength="500"></el-input>
            </span>
          </div>
          <div class="field whole-line">
            <span class="field-name">
              备注:
            </span>
            <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
              <span class="warning-text"></span>
              <span>{{copyInfo.remarks}}</span>
            </span>
            <span class="field-input" v-else>
              <el-input v-model="copyInfo.remarks" placeholder="请输入备注信息" type="textarea" :maxlength="500"></el-input>
            </span>
          </div>
          <div class="seperate-line"></div>
          <div class="field-file">
            <span class="field-name">
              其它文件:
            </span>
            <span class="field-input">
              <div class="last-files">
                <div class="last-files-title">已上传的其它文件</div>
                <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in other">
                  <i class="el-icon-document icon"></i>
                  <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                  <i class="close-button iconfont icon-cancel" @click="removeFile(file, other, newOther)"></i>
                </div>
              </div>
              <el-upload
                class="upload-area"
                :action="uploadUrl"
                ref="upload4"
                :disabled="mode===VIEW_CURRENT_CARD"
                :data="fileParam"
                :multiple="true"
                :auto-upload="true"
                :on-change="fileChange"
                :on-preview="handlePreview"
                :on-remove="handleOtherRemove"
                :on-success="uploadOtherSuccess"
                :on-error="uploadErr"
                :before-upload="beforeUpload"
                :file-list="fileList4">
                <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                  点击上传其它文件
                </el-button>
                <div slot="tip" class="el-upload__tip"></div>
              </el-upload>
            </span>
          </div>
          <div class="seperate-line"></div>
        </div>

      </div>

      <span v-if="tableMode===FATHER_OPEN">
        <div class="button cancel-button" @click="cancel">取消</div>
        <div class="button edit-button" v-if="mode===VIEW_CURRENT_CARD && showEdit" @click="switchToEditingMode">编辑</div>
        <div class="button submit-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="submit">确认</div>
      </span>
      <span v-else-if="tableMode===SON_OPEN">
        <div class="button cancel-button" v-if="mode===VIEW_CURRENT_CARD" @click="closeSubTable">返回</div>
        <span v-else-if="mode!==VIEW_CURRENT_CARD">
          <div class="button reset-button" @click="resetSubTable">重置</div>
          <div class="button submit-button" @click="closeSubTable">完成</div>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { mapGetters } from 'vuex';
import { vueCopy, deepCopy, pruneObj } from 'utils/helper';
import { baseUrl, getCommonRequest } from 'api/common.js';
import { addEmg, modEmg, addSleepMonitoring, modSleepMonitoring, addImage, modifyImage } from 'api/patient.js';
import Util from 'utils/util.js';

export default {
  data() {
    return {
      FATHER_OPEN: 'fatherOpen',
      SON_OPEN: 'sonOpen',
      tableMode: '',
      mode: '',
      lockSubmitButton: false,

      F_WAV_STU_ITEM: 'fwavStuItem',
      INT_PAT_ANA_ITEM: 'intPatAnaItem',
      MOT_NER_COND_ITEM: 'motNerCondItem',
      MOT_UNI_ANA_ITEM: 'motUniAnaItem',
      NEED_EXAM_ITEM: 'needExamItem',
      SEN_NER_COND_ITEM: 'senNerCondItem',

      SLEEP_MONITORING_ITEM: 'sleepMonitoringItem',

      EEG_CODE: 100,  // 脑电图的检查类型 id
      ECG_CODE: 101,  // 心电图的检查类型 id

      warningResults: {
        elecExamType: '',
        checkDate: ''
      },

      copyInfo: {},
      targetEmg: {},
      currentTable: '',
      emgTable: [],
      emgTableList: [
        {
          name: 'fwavStuItem',
          cnName: 'F波研究'
        },
        {
          name: 'intPatAnaItem',
          cnName: '干扰项分析'
        },
        {
          name: 'motNerCondItem',
          cnName: '运动神经传导项'
        },
        {
          name: 'motUniAnaItem',
          cnName: '运动单元分析'
        },
        {
          name: 'needExamItem',
          cnName: '针刺肌电图检查'
        },
        {
          name: 'senNerCondItem',
          cnName: '感觉神经传导项'
        }
      ],

      sleepMonitoringSubTableCode: '',
      sleepMonitoringTables: [],

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },

      valuePathList: [],

      other: [],
      newOther: [],
      fileList4: [],
      uploadingFilesNum: 0,
      uploadUrl: baseUrl + '/upload/uploadAttachment',
      downloadUrl: baseUrl + '/download/',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      fileParam: getCommonRequest(),

      showEdit: false
    };
  },
  computed: {
    ...mapGetters([
      'emgTypeList',
      'typeGroup',
      'typeField'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增电生理检查';
      } else {
        return '电生理检查';
      }
    },
    currentTableName() {
      if (this.copyInfo.elecExamType === 1) {
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
      } else if (this.copyInfo.elecExamType === 2) {
        var subType = Util.getElement('typeCode', this.sleepMonitoringSubTableCode, this.sleepMonitoringTypes);
        return subType.typeName ? subType.typeName : '';
      } else {
        return '';
      }

    },
    sleepMonitoringTypes() {
      var types = Util.getElement('typegroupcode', 'elecExam', this.typeGroup).types;
      types = types ? types : [];
      var targetType = Util.getElement('typeCode', 2, types);
      return targetType && targetType.childType ? targetType.childType : [];
    },
    totalRecordTime() {
      var fromTime = new Date(this.copyInfo.recordStart);
      var toTime = new Date(this.copyInfo.recordEnd);
      var interval = toTime - fromTime;
      if (interval >= 0) {
        interval = parseInt(interval / 1000, 10);
        var hour = parseInt(interval / 3600, 10);
        var minute = parseInt((interval % 3600) / 60, 10);
        minute = minute >= 10 ? minute : '0' + minute;
        var second = parseInt((interval % 60), 10);
        second = second >= 10 ? second : '0' + second;
        this.recordTotal = hour + ':' + minute + ':' + second;
      } else {
        this.recordTotal = '0:00:00';
      }
      return this.recordTotal;
    },
    BMIIndex() {
      let height = this.copyInfo.height;
      let weight = this.copyInfo.weight;
      if (weight !== undefined && height !== undefined && Number(height) > 0 && Number(weight) > 0) {
        var result = Number(weight) / Math.pow(Number(height) / 100, 2);
        var evaluation = '';
        if (result < 18.5) {
          evaluation = '过轻';
        } else if (result < 24) {
          evaluation = '正常';
        } else if (result < 28) {
          evaluation = '过重';
        } else if (result < 32) {
          evaluation = '肥胖';
        } else {
          evaluation = '非常肥胖';
        }
        return result.toFixed(1) + ' (' + evaluation + ')';
      } else {
        return '';
      }
    },
    sleepMonitoringItemGroups() {
      var items = this.typeField.filter(item => {
        return Number(item.typeCode) === this.sleepMonitoringSubTableCode &&
        item.typeGroupCode === 'elecExam';
      });
      var groups = this.filterItemsIntoGroups(items);
      var resultGroups = [];
      for (let i = 0; i < groups.length; i += 1) {
        resultGroups.push({});
        resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
        resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
      }
      return resultGroups;
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit, heightAndWeight) {
      // this.displayModal = true;
      this.mode = cardOperation;
      this.tableMode = this.FATHER_OPEN;
      this.showEdit = showEdit;
      // console.log('item: ', item);

      this.initCopyInfo();

      var height = heightAndWeight.height === '' ? '' : heightAndWeight.height / 10;
      var weight = heightAndWeight.weight === '' ? '' : heightAndWeight.weight / 10;
      this.$set(this.copyInfo, 'height', height);
      this.$set(this.copyInfo, 'weight', weight);

      vueCopy(item, this.copyInfo);
      this.copyInfo.elecExamType = this.copyInfo.elecExamType ? Number(this.copyInfo.elecExamType) : '';
      if (item.imageType !== undefined) {
        this.copyInfo.elecExamType = item.imageType;
      }

      this.newOther = [];

      this.other = item.other ? item.other : [];
      for (let fileItem of this.other) {
        this.newOther.push({
          id: fileItem.id
        });
      }

      this.valuePathList = [];
      this.selectEmg();
      this.clearWarning();
      this.updateScrollbar();
    },
    initCopyInfo() {
      this.$set(this.copyInfo, 'elecExamType', '');

      this.$set(this.copyInfo, 'etgName', '');
      this.$set(this.copyInfo, 'elecTroGramId', '');
      this.$set(this.copyInfo, 'etgType', '');
      this.$set(this.copyInfo, 'patEleHint', '');
      this.$set(this.copyInfo, 'patEleResule', '');
      this.$set(this.copyInfo, 'patientMotNerCondResu', []);
      this.$set(this.copyInfo, 'patienFWaStuResu', []);
      this.$set(this.copyInfo, 'patientNeedExamItemResu', []);
      this.$set(this.copyInfo, 'patientMotUniAnaResu', []);
      this.$set(this.copyInfo, 'patientIntPatAnaItem', []);
      this.$set(this.copyInfo, 'patientSenNerCondResu', []);

      this.$set(this.copyInfo, 'recordStart', '');
      this.$set(this.copyInfo, 'recordEnd', '');
      this.$set(this.copyInfo, 'recordTotal', '');
      this.$set(this.copyInfo, 'height', '');
      this.$set(this.copyInfo, 'weight', '');
      this.$set(this.copyInfo, 'examResult', '');
      this.$set(this.copyInfo, 'typeGroupCode', 'elecExam');

      this.$set(this.copyInfo, 'checkDate', '');
      this.$set(this.copyInfo, 'checkNum', '');
      this.$set(this.copyInfo, 'checkDevice', '');
      this.$set(this.copyInfo, 'checkConclusion', '');
      this.$set(this.copyInfo, 'remarks', '');

      this.$set(this.copyInfo, 'patientFieldCode', {});
      for (let type of this.sleepMonitoringTypes) {
        let typeCode = type.typeCode;
        this.$set(this.copyInfo.patientFieldCode, typeCode, {});

        let items = this.typeField.filter(item => {
          return Number(item.typeCode) === typeCode &&
          item.typeGroupCode === 'elecExam';
        });
        let groups = this.filterItemsIntoGroups(items);
        let resultGroups = [];
        for (let i = 0; i < groups.length; i += 1) {
          resultGroups.push({});
          resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
          resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
        }

        for (let group of resultGroups) {
          for (let rowItem of group.rowItems) {
            var rowItemCode = rowItem.id;
            this.$set(this.copyInfo.patientFieldCode[typeCode], rowItemCode, {});

            let colItems = group.colItems;
            if (colItems.length === 0) {
              // 特殊情况：如果没有列，则新建一个code为 0 的虚拟列
              colItems = [{id: 0}];
            }

            for (let colItem of colItems) {
              var colItemCode = colItem.id;
              this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode], colItemCode, {});

              this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeGroupCode', 'elecExam');
              this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeCode', typeCode);
              this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'rowFieldId', rowItemCode);
              this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'columnFieldId', colItemCode);
              this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'fieldValue', '');
            }
          }
        }
      }
    },
    filterItemsIntoGroups(items) {
      // 根据 item 的 groupNo 属性，装到不同的子数组里面，最后返回最外层的数组
      var groups = [];
      var hasSameGroupNumberBefore = false;

      for (let item of items) {
        hasSameGroupNumberBefore = false;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i][0].groupNo === item.groupNo) {
            hasSameGroupNumberBefore = true;
            groups[i].push(item);
          }
        }
        if (!hasSameGroupNumberBefore) {
          let newGroup = [];
          newGroup.push(item);
          groups.push(newGroup);
        }
      }
      return groups;
    },
    chooseElecExamType() {
      if (this.copyInfo.elecExamType && Number(this.copyInfo.elecExamType) === 1) {
        // 肌电图本来也是个列表，只是目前这里面只有“肌电图”这一个选项，所以这里就默认直接选上了
        // 而且这个下拉框在 2.1 版本的更新中被去掉了，现在选择了电检查下的肌电图，就默认选中 emgTypeList 的第一项
        this.copyInfo.elecTroGramId = this.emgTypeList[0].id;
        this.selectEmg();
      }
      this.updateWarning('elecExamType');
    },
    updateWarning(fieldName) {
      var copyFieldValue = this.copyInfo[fieldName];
      if (copyFieldValue === undefined || copyFieldValue === '') {
        this.$set(this.warningResults, fieldName, '必填项');
        return;

      } else if (['height', 'weight'].indexOf(fieldName) >= 0) {
        if (copyFieldValue === 0 || copyFieldValue === '0') {
          this.$set(this.warningResults, fieldName, '身高和体重必须大于0');
          return;
        } else if (!Util.checkIfNotMoreThanNDecimalNums(copyFieldValue, 1)) {
          this.$set(this.warningResults, fieldName, '必须为数字，且不超过1位小数');
          return;
        }
      }
      this.$set(this.warningResults, fieldName, '');
    },
    clearWarning() {
      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });
    },
    selectEmg() {
      var emg = Util.getElement('id', this.copyInfo.elecTroGramId, this.emgTypeList);
      this.$set(this.copyInfo, 'etgName', emg.emgName);
      this.$set(this.copyInfo, 'etgType', emg.emgType);
      if (this.mode === this.ADD_NEW_CARD) {
        this.tableMode = this.FATHER_OPEN;
      }

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
          this.initEmgTableData(tableName);
          break;
        case this.NEED_EXAM_ITEM:
          this.currentTable = this.NEED_EXAM_ITEM;
          this.initEmgTableData(tableName);
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
          this.initEmgTableData(tableName);
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
          this.initEmgTableData(tableName);
          break;
        case this.INT_PAT_ANA_ITEM:
          this.currentTable = this.INT_PAT_ANA_ITEM;
          this.initEmgTableData(tableName);
          break;
        case this.F_WAV_STU_ITEM:
          this.currentTable = this.F_WAV_STU_ITEM;
          this.initEmgTableData(tableName);
          break;
      }
      this.updateScrollbar();
      this.$refs.formWrapper.scrollTop = 0;
    },
    selectSleepMonitoringSubTable(typeCode) {
      this.sleepMonitoringSubTableCode = typeCode;
      this.currentTable = this.SLEEP_MONITORING_ITEM;

      // 取到这个值之后就要关闭父表格，打开子表格
      this.tableMode = this.SON_OPEN;
      this.updateScrollbar();
      this.$refs.formWrapper.scrollTop = 0;
    },
    rearrangeRows(items) {
      // 因为有的睡眠监测子表格没有明确的列信息，只有行信息，而且每一行只有字段名字和字段值
      // 因此需要重新排列此表格，一排有4列，分别为字段1的名字，字段1的值，字段2的名字，字段2的值
      var newArray = [];
      var subArray = [];
      var length = items.length;
      for (var i = 0; i < length; i++) {
        subArray.push(items[i]);
        if (i % 2 === 1 || i === length - 1) {
          newArray.push(subArray);
          subArray = [];
        }
      }
      return newArray;
    },
    resetEmgTableData() {
      switch (this.currentTable) {
        case this.SEN_NER_COND_ITEM:
          this.copyInfo.patientSenNerCondResu = [];
          break;
        case this.NEED_EXAM_ITEM:
          this.copyInfo.patientNeedExamItemResu = [];
          break;
        case this.MOT_UNI_ANA_ITEM:
          this.copyInfo.patientMotUniAnaResu = [];
          break;
        case this.MOT_NER_COND_ITEM:
          this.copyInfo.patientMotNerCondResu = [];
          break;
        case this.INT_PAT_ANA_ITEM:
          this.copyInfo.patientIntPatAnaItem = [];
          break;
        case this.F_WAV_STU_ITEM:
          this.copyInfo.patienFWaStuResu = [];
          break;
        default:
          break;
      }
      this.initEmgTableData(this.currentTable);
    },
    initEmgTableData(tableName) {
      switch (tableName) {
        case this.SEN_NER_COND_ITEM:
          if (this.copyInfo.patientSenNerCondResu.length !== 0) {
            // 如果当前子表格数据已经存在，则不去初始化，否则会将原来的数据覆盖
            return;
          }
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
          if (this.copyInfo.patientNeedExamItemResu.length !== 0) {
            return;
          }
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
          if (this.copyInfo.patientMotUniAnaResu.length !== 0) {
            return;
          }
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
          if (this.copyInfo.patientMotNerCondResu.length !== 0) {
            return;
          }
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientMotNerCondResu, i, {});
            this.$set(this.copyInfo.patientMotNerCondResu[i], 'motNerItemId', this.emgTable[i].id);
            this.$set(this.copyInfo.patientMotNerCondResu[i], 'amplitude', '');
            this.$set(this.copyInfo.patientMotNerCondResu[i], 'duration', '');
            this.$set(this.copyInfo.patientMotNerCondResu[i], 'phases', '');
            this.$set(this.copyInfo.patientMotNerCondResu[i], 'spikeDuration', '');
          }
          break;
        case this.INT_PAT_ANA_ITEM:
          if (this.copyInfo.patientIntPatAnaItem.length !== 0) {
            return;
          }
          for (let i = 0; i < this.emgTable.length; i++) {
            this.$set(this.copyInfo.patientIntPatAnaItem, i, {});
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'intPatAnaId', this.emgTable[i].id);
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'amplitude', '');
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'ratio', '');
            this.$set(this.copyInfo.patientIntPatAnaItem[i], 'turn', '');
          }
          break;
        case this.F_WAV_STU_ITEM:
          if (this.copyInfo.patienFWaStuResu.length !== 0) {
            return;
          }
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
    resetSleepMonitoringSubTable() {
      let typeCode = this.sleepMonitoringSubTableCode;
      for (var rowFieldId in this.copyInfo.patientFieldCode[typeCode]) {
        for (var columnFieldId in this.copyInfo.patientFieldCode[typeCode][rowFieldId]) {
          this.copyInfo.patientFieldCode[typeCode][rowFieldId][columnFieldId].fieldValue = '';
        }
      }
    },
    resetSubTable() {
      if (this.copyInfo.elecExamType === 1) {
        this.resetEmgTableData();
      } else if (this.copyInfo.elecExamType === 2) {
        this.resetSleepMonitoringSubTable();
      }
    },
    closeSubTable() {
      this.tableMode = this.FATHER_OPEN;
      this.updateScrollbar();
      this.$refs.neuroelectricModal.scrollTop = 0;
    },
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    simplifyTimeWithoutDate(time) {
      return Util.simplifyTimeWithoutDate(time);
    },
    transformToNumber(obj) {
      var value = parseFloat(obj.fieldValue);
      if (obj.fieldValue !== '' && obj.fieldValue !== value) {
        obj.fieldValue = isNaN(value) ? '' : value;
      }
    },
    calcSleepEfficiency(obj, rowId, colId, rows) {
      var bedTime = '';
      var totalSleepTime = '';
      for (let row of rows) {
        if (row.fieldCode === 'bedTime') {
          bedTime = obj[row.id][colId].fieldValue;
        } else if (row.fieldCode === 'totalSleepTime') {
          totalSleepTime = obj[row.id][colId].fieldValue;
        }
      }
      if (bedTime === undefined || bedTime === '' || totalSleepTime === undefined || totalSleepTime === '') {
        obj[rowId][colId].fieldValue = '';
        return obj[rowId][colId].fieldValue;
      }

      bedTime = this.addTime('00:00:00', bedTime);
      totalSleepTime = this.addTime('00:00:00', totalSleepTime);
      var bedTimeNumList = bedTime.split(':');
      var totalSleepTimeNumList = totalSleepTime.split(':');
      var bedTimeSeconds = Number(bedTimeNumList[0]) * 3600 + Number(bedTimeNumList[1]) * 60 + Number(bedTimeNumList[2]);
      var totalSleepSeconds = Number(totalSleepTimeNumList[0]) * 3600 + Number(totalSleepTimeNumList[1]) * 60 + Number(totalSleepTimeNumList[2]);

      var ratio = totalSleepSeconds / bedTimeSeconds;
      obj[rowId][colId].fieldValue = (ratio * 100).toFixed(2);
      return obj[rowId][colId].fieldValue;
    },
    calcTotalOfRow(obj, colId, cols, uiType, rowFieldCode) {
      if (rowFieldCode === 'inapplicable') {
        obj[colId].fieldValue = '不适用';
      } else {
        var total = 0;
        for (let col of cols) {
          if (col.fieldCode !== 'total') {
            if (uiType === 2) {
              var num = parseFloat(obj[col.id].fieldValue);
              num = isNaN(num) ? 0 : num;
              total += num;
            } else if (uiType === 8) {
              var value = obj[col.id].fieldValue;
              if (total === 0) {
                total = '00:00:00';
              }
              if (value !== undefined && value !== '') {
                total = this.addTime(total, value);
              }
            }
          }
        }
        obj[colId].fieldValue = total;
      }
      return obj[colId].fieldValue;
    },
    addTime(total, time) {
      // 用来计算增加的时长，第一个参数代表当前的总时间，为“HH:mm:ss”格式的字符串
      // 第二个参数为传入的参数，为 Date 对象或者“HH:mm:ss”格式的字符串
      // 如果第二个参数为 Date 对象，则只取其时分秒，而忽略其年月日
      // 返回值是“HH:mm:ss”格式的字符串
      var totalTimeStringList = total.split(':');
      var totalHours = totalTimeStringList[0] ? totalTimeStringList[0] : 0;
      var totalMinutes = totalTimeStringList[1] ? totalTimeStringList[1] : 0;
      var totalSeconds = totalTimeStringList[2] ? totalTimeStringList[2] : 0;
      totalHours = Number(totalHours);
      totalMinutes = Number(totalMinutes);
      totalSeconds = Number(totalSeconds);

      var addHours = 0;
      var addMinutes = 0;
      var addSeconds = 0;
      if (time instanceof Date) {
        addHours = time.getHours();
        addMinutes = time.getMinutes();
        addSeconds = time.getSeconds();
      } else if (time instanceof String) {
        var timeStringList = time.split(':');
        addHours = timeStringList[0] ? timeStringList[0] : 0;
        addMinutes = timeStringList[1] ? timeStringList[1] : 0;
        addSeconds = timeStringList[2] ? timeStringList[2] : 0;
        addHours = Number(addHours);
        addMinutes = Number(addMinutes);
        addSeconds = Number(addSeconds);
      }
      totalHours += addHours;
      totalMinutes += addMinutes;
      totalSeconds += addSeconds;
      if (totalSeconds >= 60) {
        totalSeconds -= 60;
        totalMinutes += 1;
      }
      if (totalMinutes >= 60) {
        totalMinutes -= 60;
        totalHours += 1;
      }
      if (totalSeconds < 10) {
        totalSeconds = '0' + totalSeconds;
      }
      if (totalMinutes < 10) {
        totalMinutes = '0' + totalMinutes;
      }
      return totalHours + ':' + totalMinutes + ':' + totalSeconds;
    },
    getPlaceHolder(val1, val2, val3) {
      if (val1) {
        return val1;
      } else if (val2) {
        return val2;
      } else if (val3) {
        return val3;
      } else {
        return '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
      this.copyInfo = {};
      this.tableMode = '';
      if (this.$refs.upload4) {
        this.$refs.upload4.clearFiles();
      }
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    recordValuePath(path, uiType) {
      var obj = this.copyInfo;
      for (let propertyName of path) {
        obj = obj[propertyName];
      }
      if (obj.fieldValue instanceof Date) {
        var pathString = path.toString();
        var existed = false;
        for (let pathInfo of this.valuePathList) {
          if (pathString === pathInfo.path.toString()) {
            existed = true;
          }
        }
        if (!existed) {
          this.valuePathList.push({
            path: path,
            uiType: uiType
          });
        }
      }
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.updateWarning('elecExamType');
      if (this.copyInfo.elecExamType === 2) {
        this.updateWarning('height');
        this.updateWarning('weight');
        this.updateWarning('recordStart');
        this.updateWarning('recordEnd');
      } else if (this.copyInfo.elecExamType === this.EEG_CODE ||
          this.copyInfo.elecExamType === this.ECG_CODE) {
        this.updateWarning('checkDate');
      }
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p) && this.warningResults[p] !== '') {
          this.lockSubmitButton = false;
          return;
        }
      }

      let submitData = deepCopy(this.copyInfo);

      if (submitData.elecExamType === 1) {
        submitData.pinfoId = this.$route.params.id;
        submitData.pcaseId = this.$route.params.caseId;
        submitData.checkDate = Util.simplifyDate(submitData.checkDate);
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

      } else if (submitData.elecExamType === 2) {
        submitData.patientId = this.$route.params.id;
        submitData.patientCaseId = this.$route.params.caseId;
        submitData.recordStart = Util.simplifyTime(submitData.recordStart, true);
        submitData.recordEnd = Util.simplifyTime(submitData.recordEnd, true);

        for (let pathInfo of this.valuePathList) {
          let path = pathInfo.path;
          let uiType = pathInfo.uiType;

          var obj = submitData;
          for (let propertyName of path) {
            obj = obj[propertyName];
          }
          if (uiType === 6) {
            obj.fieldValue = Util.simplifyDate(obj.fieldValue);
          } else if (uiType === 7 || uiType === 8) {
            obj.fieldValue = Util.simplifyTime(obj.fieldValue, true);
          }
        }

        if (this.mode === this.ADD_NEW_CARD) {
          // 新增睡眠监测
          addSleepMonitoring(submitData).then(() => {
            Bus.$emit(this.UPDATE_CASE_INFO);
            this.cancel();
          }, this._handleError);
        } else if (this.mode === this.EDIT_CURRENT_CARD) {
          // 修改睡眠监测
          modSleepMonitoring(submitData).then(() => {
            Bus.$emit(this.UPDATE_CASE_INFO);
            this.cancel();
          }, this._handleError);
        }
      } else if (submitData.elecExamType === this.EEG_CODE ||
          submitData.elecExamType === this.ECG_CODE) {
        if (this.uploadingFilesNum > 0) {
          this.$message({
            message: '请等待文件上传后再提交',
            type: 'warning',
            duration: 2000
          });
          this.lockSubmitButton = false;
          return;
        }

        submitData.patientId = this.$route.params.id;
        submitData.patientCaseId = this.$route.params.caseId;
        submitData.imageType = submitData.elecExamType;
        submitData.other = this.newOther;
        // delete submitData.newOther;
        pruneObj(submitData);

        if (this.mode === this.ADD_NEW_CARD) {
          addImage(submitData).then(this.updateAndClose, this._handleError);
        } else if (this.mode === this.EDIT_CURRENT_CARD) {
          modifyImage(submitData).then(this.updateAndClose, this._handleError);
        }
      }

    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      if (this.$refs.upload4) {
        this.$refs.upload4.clearFiles();
      }
      Bus.$emit(this.UPDATE_CASE_INFO);
      this.lockSubmitButton = false;
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults.subModal = null;
      }
    },
    getFieldValue(code, fieldName) {
      let mapObj = {
        'elecExam': 'elecExam',
        'emgType': 'eleType',
        'nerveType': 'nervType',
        'muscle': 'muscleType'
      };
      if (code === '' || code === undefined) {
        return '';
      } else if (fieldName === 'emgName') {
        let info = Util.getElement('id', code, this.emgTypeList);
        return info.emgName;
      } else if (mapObj[fieldName] !== undefined) {
        code = parseInt(code, 10);
        let types = this.getTypes(mapObj[fieldName]);
        let info = Util.getElement('typeCode', code, types);
        return info.typeName;
      } else {
        return '';
      }
    },
    getTypes(name) {
      var typeInfo = Util.getElement('typegroupcode', name, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    downloadFile(file) {
      window.location.href = this.downloadUrl + file.realPath;
    },
    removeFile(file, showingList, transferringList) {
      // console.log(file);
      for (let i = 0; i < showingList.length; i++) {
        if (file.id === showingList[i].id) {
          showingList.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < transferringList.length; i++) {
        if (file.id === transferringList[i].id) {
          transferringList.splice(i, 1);
          break;
        }
      }
      this.updateScrollbar();
    },
    uploadOtherSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newOther);
    },
    uploadSuccess(response, file, fileList, list) {
      this.uploadingFilesNum -= 1;
      if (response.code === 0) {
        let id = response.data.patientAttachmentId;
        list.push({
          'id': id
        });
      } else {
        this.$message({
          message: '文件上传出错',
          type: 'warning',
          duration: 2000
        });
        console.log('response: ', response);
        console.log('file: ', file);
        console.log('fileList', fileList);
      }
    },
    uploadErr(err, file, fileList) {
      this.uploadingFilesNum -= 1;
      console.log('upload error: ', err);
      console.log('file: ', file);
      console.log('fileList', fileList);
    },
    beforeUpload(file) {
      const isUnderLimit = file.size / 1024 / 1024 < 300;
      if (!isUnderLimit) {
        this.$message({
          message: '上传文件大小不能超过 300MB',
          type: 'error',
          duration: 2000
        });
      } else {
        this.uploadingFilesNum += 1;
      }
      return isUnderLimit;
    },
    fileChange() {
      this.updateScrollbar();
    },
    handleOtherRemove(file) {
      this.handleRemove(file, this.newOther);
    },
    handleRemove(file, list) {
      console.log(file);
      if (file.status === 'uploading') {
        this.uploadingFilesNum -= 1;
      }
      for (var i = 0; i < list.length; i++) {
        if (file.response.data.attachmentId === list[i].id) {
          list.splice(i, 1);
          break;
        }
      }
      this.updateScrollbar();
    },
    handlePreview(file) {
      console.log(file);
      // window.location.href = file.url;
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs && this.$refs.formWrapper) {
          Ps.destroy(this.$refs.formWrapper);
          Ps.initialize(this.$refs.formWrapper, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs && this.$refs.neuroelectricModal) {
          Ps.destroy(this.$refs.neuroelectricModal);
          Ps.initialize(this.$refs.neuroelectricModal, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  mounted() {
    this.initCopyInfo();

    this.updateScrollbar();
    Bus.$on(this.SHOW_NEUROELECTRIC_MODAL, this.showPanel);
    // 监听折叠面板，如果发生状态的改变，就需要重新计算滚动区域的高度
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);

    // 如果屏幕高度发生改变，也需要重新计算滚动区域高度
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  watch: {
    emgTypeList: function() {
      this.selectEmg();
    },
    '$route.path'() {
      // if (this.displayModal) {
      //   this.cancel();
      // }
      this.cancel();
    }
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NEUROELECTRIC_MODAL, this.showPanel);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 45px;
@field-line-height: 25px;
@field-name-width: 100px;
@long-field-name-width: 130px;

.neuroelectric-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .neuroelectric-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 80%;
    min-width: 760px;
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
        min-height: @field-height;
        vertical-align: top;
        text-align: left;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width}");
            &.long-field-name {
              width: calc(~"96% - @{long-field-name-width}");
            }
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
          top: 0;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
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
            margin-bottom: 10px;
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
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .field-file {
        margin-bottom: 10px;
        transform: translateX(10px);
        .field-name {
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          width: @field-name-width;
          line-height: 20px;
          font-size: @normal-font-size;
          color: @font-color;
        }
        .field-input {
          display: block;
          position: relative;
          left: @field-name-width;
          width: 96%;
          padding-right: @field-name-width;
          box-sizing: border-box;
          font-size: @normal-font-size;
          .last-files {
            margin-bottom: 10px;
            width: 100%;
            .last-files-title {
              transform: translateY(-5px);
              margin-bottom: 5px;
              height: 30px;
              line-height: 30px;
              background-color: @font-color;
              color: #fff;
              text-align: center;
              cursor: default;
            }
            .file {
              position: relative;
              padding-left: 5px;
              height: 30px;
              line-height: 30px;
              transition: 0.2s;
              cursor: default;
              .icon {
                display: inline-block;
                width: 20px;
              }
              .file-name {
                display: inline-block;
                padding: 0 3px;
                line-height: 20px;
                transform: translateX(-3px);
                cursor: pointer;
                &:hover {
                  border-bottom: 1px solid @font-color;
                }
              }
              .close-button {
                display: none;
                position: absolute;
                right: 0;
                width: 22px;
                text-align: center;
                color: @light-font-color;
                font-size: 13px;
              }
              &.editing {
                cursor: pointer;
                &:hover {
                  background-color: @screen-color;
                  .close-button {
                    display: inline-block;
                    &:hover {
                      color: @font-color;
                    }
                  }
                }
              }
            }
          }
          .upload-area {
            .el-upload {
              width: 100%;
              text-align: left;
              .el-button {
                width: 100%;
                height: 30px;
                border-radius: 10px;
                &:hover {
                  opacity: 0.7;
                }
                &:active {
                  opacity: 0.85;
                }
                &.el-button--text {
                  background-color: @light-font-color;
                  color: #fff;
                  font-size: @normal-font-size;
                  &:disabled {
                    background-color: @gray-color;
                    cursor: not-allowed;
                  }
                }
              }
            }
            .el-upload__tip {
              line-height: normal;
              margin-top:0;
            }
            .el-upload-list {
              // max-height: 80px;
              // overflow-y: scroll;
            }
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
      .form-wrapper {
        position: relative;
        margin-top: 5px;
        max-height: 320px;
        height: auto;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid @inverse-font-color;
        .form {
          position: relative;
          margin-bottom: 5px;
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          font-size: 14px;
          &.small-font {
            font-size: @small-font-size !important;
          }
          .row {
            height: 40px;
            &.first-row {
              background-color: @screen-color;
              height: 35px;
              .col {
                padding: 0 3px;
              }
            }
            .col {
              text-align: center;
              padding: 0;
              margin: 0;
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
              &.col-width-18 {
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
                width: 98%;
                .el-input__inner {
                  height: 30px;
                  border: none;
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
      margin: 5px auto 15px;
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
