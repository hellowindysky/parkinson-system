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
            <el-select v-model="modelType">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-show="modelType===0">
          <span class="field-name">上次程控时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
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
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].elbowTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].wristTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].kneeTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].neckTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].tremor"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[index].tensionTone"></el-input>
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
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].elbowTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].wristTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].kneeTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].neckTone"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].tremor"></el-input>
              </td>
              <td class="col w1">
                <el-input v-model="copyInfo.patientDbsFirstDetail[getRightIndex(index)].tensionTone"></el-input>
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
              <el-input></el-input>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <el-input></el-input>
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
          <tr class="row">
            <td class="col w2" colspan="2" rowspan="2">上次方案</td>
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
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
              <el-input></el-input>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus"></span>
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
          <tr class="row">
            <td class="col w2" colspan="2" rowspan="2">
              调整1
              <span class="iconfont icon-remove"></span>
            </td>
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w3" colspan="3">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="4">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w3" colspan="3">
              <el-input></el-input>
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
              <el-input></el-input>
            </td>
            <td class="col w2" colspan="2">右侧</td>
            <td class="col w8" colspan="8">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row title-row">
            <td class="col w2" colspan="2">
              方案
              <span class="iconfont icon-plus"></span>
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
          <tr class="row">
            <td class="col w2" colspan="2" rowspan="2">
              调整1
              <span class="iconfont icon-remove"></span>
            </td>
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="5">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="5">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
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
              <span class="iconfont icon-plus"></span>
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
          <tr class="row">
            <td class="col w2" colspan="2" rowspan="2">
              调整1
              <span class="iconfont icon-remove"></span>
            </td>
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="5">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col w2" colspan="2">左侧肢体</td>
            <td class="col w3" colspan="3">
              <el-select :value="1">
                <el-option label="a" :value="1"></el-option>
              </el-select>
            </td>
            <td class="col w5" colspan="5">
              <el-checkbox-group v-model="cl">
                <el-checkbox label="C+"></el-checkbox>
                <el-checkbox label="0+"></el-checkbox>
                <el-checkbox label="1+"></el-checkbox>
                <el-checkbox label="2+"></el-checkbox>
                <el-checkbox label="3+"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w4" colspan="5">
              <el-checkbox-group v-model="cl2">
                <el-checkbox label="0-"></el-checkbox>
                <el-checkbox label="1-"></el-checkbox>
                <el-checkbox label="2-"></el-checkbox>
                <el-checkbox label="3-"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
            </td>
            <td class="col w1" colspan="1">
              <el-input></el-input>
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
            <td class="col w4" colspan="5">负极</td>
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
            <td class="col w4" colspan="5">
              <el-checkbox-group v-model="firstDbsAdjustAfterParamPole[index].negative">
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
import {vueCopy} from 'utils/helper';
import Util from 'utils/util.js';
import { getPatientSimpleInfo } from 'api/patient.js';

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
    'adjustAfterParameter': [
      {
        'id': 9,
        'paramType': 1,
        'schemeOrder': 1,
        'limbSide': 1,
        'exciteMod': 2,
        'negativePole': '2-',
        'positivePole': 'C+#1+',
        'frequency': '135',
        'pulseWidth': '66',
        'voltage': '253',
        'resistance': 504,
        'electric': 0,
        'electricity': 0,
        'effectInfo': '哇哈哈！',
        'patientDbsFirstId': 9
      },
      {
        'id': 11,
        'paramType': 1,
        'schemeOrder': 1,
        'limbSide': 2,
        'exciteMod': 3,
        'negativePole': '8-#10-',
        'positivePole': 'C+#8+',
        'frequency': '133',
        'pulseWidth': '62',
        'voltage': '240',
        'resistance': 455,
        'electric': 0,
        'electricity': 0,
        'effectInfo': '副反应呵呵',
        'patientDbsFirstId': 9
      },
      {
        'id': 21,
        'paramType': 1,
        'schemeOrder': 2,
        'limbSide': 1,
        'exciteMod': 2,
        'negativePole': '2-#3-',
        'positivePole': 'C+#3+',
        'frequency': '135',
        'pulseWidth': '66',
        'voltage': '253',
        'resistance': 504,
        'electric': 0,
        'electricity': 0,
        'effectInfo': '哇哈哈！',
        'patientDbsFirstId': 9
      },
      {
        'id': 22,
        'paramType': 1,
        'schemeOrder': 2,
        'limbSide': 2,
        'exciteMod': 2,
        'negativePole': '11-',
        'positivePole': '8+#10+',
        'frequency': '137',
        'pulseWidth': '70',
        'voltage': '288',
        'resistance': 504,
        'electric': 0,
        'electricity': 0,
        'effectInfo': '哇哈哈！',
        'patientDbsFirstId': 9
      }
    ]
  }
};

var dbsFollowModel = {
  'deviceId': '8a9e2d385e27e424015e27e6b3740006',
  'devicePowerType': 1,
  'programDate': '2017-09-28',
  'isTakeMedication': 1,
  'medicationStatus': '美多巴',
  'complaint': '震颤',
  'effectInfo': '呵呵哒',
  'stnVoltage': 1.9,
  'adjustBeforeLeftSatisfaction': 1,
  'adjustBeforeRightSatisfaction': 0,
  'adjustVoltageLeftSatisfaction': 0,
  'adjustVoltageRightSatisfaction': 2,
  'adjustMoreLeftSatisfaction': 1,
  'adjustMoreRightSatisfaction': 1,
  'remarks': 'heheh呵呵哒！',
  'patientDbsFirstId': 7,
  'patientCaseId': '8a9e2d385ed3847d015f05c531b900a7',
  'patientDbsFollowId': 7,
  'followDbsParams':
  [
    {
      'id': 14,
      'paramType': 1,
      'schemeOrder': 1,
      'limbSide': 1,
      'exciteMod': 2,
      'negativePole': '2+',
      'positivePole': '2-',
      'frequency': '135',
      'pulseWidth': '66',
      'voltage': '250',
      'resistance': 500,
      'electric': 0,
      'electricity': 0,
      'patientDbsFollowId': 7
    },
    {
      'id': 15,
      'paramType': 2,
      'schemeOrder': 1,
      'limbSide': 1,
      'exciteMod': 2,
      'negativePole': '2+',
      'positivePole': '2-',
      'frequency': '135',
      'pulseWidth': '66',
      'voltage': '250',
      'resistance': 511,
      'electric': 0,
      'electricity': 0,
      'patientDbsFollowId': 7
    },
    {
      'id': 16,
      'paramType': 2,
      'schemeOrder': 2,
      'limbSide': 0,
      'exciteMod': 3,
      'negativePole': 'C+/8+',
      'positivePole': '8-/10-',
      'frequency': '133',
      'pulseWidth': '62',
      'voltage': '240',
      'resistance': 455,
      'electric': 0,
      'electricity': 0,
      'patientDbsFollowId': 7
    },
    {
      'id': 17,
      'paramType': 3,
      'schemeOrder': 1,
      'limbSide': 0,
      'exciteMod': 3,
      'negativePole': 'C+/7+',
      'positivePole': '8-/9-',
      'frequency': '133',
      'pulseWidth': '62',
      'voltage': '240',
      'resistance': 455,
      'electric': 0,
      'electricity': 0,
      'effectInfo': '副反应呵呵',
      'patientDbsFollowId': 7
    },
    {
      'id': 18,
      'paramType': 3,
      'schemeOrder': 2,
      'limbSide': 0,
      'exciteMod': 3,
      'negativePole': '7+',
      'positivePole': '8-/9-',
      'frequency': '133',
      'pulseWidth': '62',
      'voltage': '240',
      'resistance': 455,
      'electric': 0,
      'electricity': 0,
      'effectInfo': 'edwd滴滴答',
      'patientDbsFollowId': 7
    },
    {
      'id': 19,
      'paramType': 4,
      'schemeOrder': 1,
      'limbSide': 0,
      'exciteMod': 3,
      'negativePole': '9+',
      'positivePole': '8-/10-',
      'frequency': '125',
      'pulseWidth': '62',
      'voltage': '250',
      'resistance': 451,
      'electric': 98,
      'electricity': 0,
      'patientDbsFollowId': 7
    },
    {
      'id': 20,
      'paramType': 4,
      'schemeOrder': 2,
      'limbSide': 0,
      'exciteMod': 3,
      'negativePole': '11+',
      'positivePole': '9-',
      'frequency': '115',
      'pulseWidth': '67',
      'voltage': '250',
      'resistance': 411,
      'electric': 77,
      'electricity': 45,
      'patientDbsFollowId': 7
    }
  ]
};

export default {
  data() {
    return {
      displayModal: false,
      title: '',
      dbsPatientCode: '',
      modelType: 1, // 这个用来控制是否为首次开机，1为首次，0为非首次
      copyInfo: {},
      leftContactSortArray: [],
      rightContactSortArray: [],
      firstDbsAdjustAfterParamPole: [],
      cl: ['C+', '2+'],
      cl2: ['1-']
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'deviceInfo'
    ]),
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
      if (changeWay === this.ADD_DATA) {
        this.title = '新增程控记录';
      } else if (changeWay === this.EDIT_DATA) {
        this.title = '程控记录';
      }
      console.log(info);
      // 获取患者的 DBS 编码
      getPatientSimpleInfo(this.$route.params.id).then((data) => {
        if (data && data.patientInfo && data.patientInfo && data.patientInfo.dbsPatientCode) {
          this.dbsPatientCode = data.patientInfo.dbsPatientCode;
        }
      }, (error) => {
        console.log(error);
      });
      this.displayModal = true;
      this.updateScrollbar();
    },
    cancel() {
      this.displayModal = false;
    },
    submit() {
      this.displayModal = false;
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });

        Ps.destroy(this.$refs.form0);
        Ps.initialize(this.$refs.form0, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });

        Ps.destroy(this.$refs.form1);
        Ps.initialize(this.$refs.form1, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });

        Ps.destroy(this.$refs.form2);
        Ps.initialize(this.$refs.form2, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });

        Ps.destroy(this.$refs.form3);
        Ps.initialize(this.$refs.form3, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });

        Ps.destroy(this.$refs.form4);
        Ps.initialize(this.$refs.form4, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });

        Ps.destroy(this.$refs.form5);
        Ps.initialize(this.$refs.form5, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    initByFirstModel() {
      vueCopy(dbsFirstModel, this.copyInfo);
      this.changeDevice();  // 生成表格所对应的数据模型
      var leftContactOrder = this.copyInfo.leftContactEffectOrder.split('>');
      var rightContactOrder = this.copyInfo.rightContactEffectOrder.split('>');
      for (let i = 0; i < leftContactOrder.length; i++) {
        this.$set(this.leftContactSortArray, i, leftContactOrder[i]);
      }
      for (let i = 0; i < rightContactOrder.length; i++) {
        this.$set(this.rightContactSortArray, i, rightContactOrder[i]);
      }
      this.updateCheckBoxModel('firstDbsAdjustAfter');
    },
    updateCheckBoxModel(formType) {
      var checkBoxModelList;
      var paramList;
      if (formType === 'firstDbsAdjustAfter') {
        paramList = this.copyInfo.firstDbsParams.adjustAfterParameter;
        checkBoxModelList = this.firstDbsAdjustAfterParamPole;
      }
      checkBoxModelList.splice(0, paramList.length);
      for (let i = 0; i < paramList.length; i++) {
        this.$set(checkBoxModelList, i, {});
        let positivePole = paramList[i].positivePole.split('#');
        let negativePole = paramList[i].negativePole.split('#');
        this.$set(checkBoxModelList[i], 'positive', positivePole);
        this.$set(checkBoxModelList[i], 'negative', negativePole);
      }
    },
    changeDevice() {
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
            this.$set(this.copyInfo.patientDbsFirstDetail[index], 'contact', totalContactList[index]);
            this.$set(this.copyInfo.patientDbsFirstDetail[index], 'dbsVoltage', voltageList[j].name);
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
          var index = count - 1 + limbSideNum;
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
      }
      this.updateCheckBoxModel(formType);
    },
    removeParam(index, formType) {
      let paramList;
      if (formType === 'firstDbsAdjustAfter') {
        paramList = this.copyInfo.firstDbsParams.adjustAfterParameter;
        paramList.splice(index, 2);
        for (var i = 0; i < paramList.length; i++) {
          paramList[i].schemeOrder = Math.floor(i / 2) + 1;
        }
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
    updateParamPole(formType, index) {
      // 每次参数表格内的 checkBox 有变化时，就更新相应的数据对象
      if (formType === 'firstDbsAdjustAfter') {
        this.copyInfo.firstDbsParams.adjustAfterParameter[index].positivePole = this.firstDbsAdjustAfterParamPole[index].positive.join('/');
        this.copyInfo.firstDbsParams.adjustAfterParameter[index].negativePole = this.firstDbsAdjustAfterParamPole[index].negative.join('/');
      }
    }
  },
  created() {
    this.initByFirstModel();
    console.log(dbsFollowModel);
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
