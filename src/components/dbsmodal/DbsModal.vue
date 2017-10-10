<template lang="html">
  <div class="dbs-modal-wrapper" v-show="displayModal">
    <div class="dbs-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
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
        <div class="field">
          <span class="field-name">患者编码</span>
          <span class="field-input">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">程控时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
          </span>
        </div>
        <div class="field whole-line double-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input type="textarea"></el-input>
          </span>
        </div>
        <div class="seperate-line"></div>
        <div class="field">
          <span class="field-name">首次开机</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">上次程控时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">服药情况</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="有" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">服用药物</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="美多芭" :value="1"></el-option>
              <el-option label="别的" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">微毁损效应</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="有" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name long-field-name">微毁损效应持续时间</span>
          <span class="field-input long-field-name">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">术后不良事件</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="有" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field whole-line double-line">
          <span class="field-name">不良事件描述</span>
          <span class="field-input">
            <el-input type="textarea"></el-input>
          </span>
        </div>
        <div class="field whole-line double-line">
          <span class="field-name">患者主诉</span>
          <span class="field-input">
            <el-input type="textarea"></el-input>
          </span>
        </div>
        <div class="field whole-line double-line">
          <span class="field-name">效果及副作用</span>
          <span class="field-input">
            <el-input type="textarea"></el-input>
          </span>
        </div>
      </div>

      <div class="form-wrapper form0-wrapper" ref="form0">
        <div class="form-left">
          <table class="form form0">
            <tr class="row top-row">
              <td class="col" colspan="16">
                左侧肢体(右侧STN)触电疗效排序为:
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
            <tr class="row">
              <td class="col w1" rowspan="6">C+</td>
              <td class="col w1" rowspan="6">0-</td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w4" colspan="4">
                <el-select :value="1">
                  <el-option label="a" :value="1"></el-option>
                </el-select>
              </td>
              <td class="col w2" colspan="2">
                <el-input></el-input>
              </td>
            </tr>
            <tr class="row">
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w4" colspan="4">
                <el-select :value="1">
                  <el-option label="a" :value="1"></el-option>
                </el-select>
              </td>
              <td class="col w2" colspan="2">
                <el-input></el-input>
              </td>
            </tr>
          </table>
        </div>
        <div class="form-right">
          <table class="form form0">
            <tr class="row top-row">
              <td class="col" colspan="16">
                右侧肢体(左侧STN)触电疗效排序为:
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
            <tr class="row">
              <td class="col w1" rowspan="6">C+</td>
              <td class="col w1" rowspan="6">8-</td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w4" colspan="4">
                <el-select :value="1">
                  <el-option label="a" :value="1"></el-option>
                </el-select>
              </td>
              <td class="col w2" colspan="2">
                <el-input></el-input>
              </td>
            </tr>
            <tr class="row">
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w1">
                <el-input></el-input>
              </td>
              <td class="col w4" colspan="4">
                <el-select :value="1">
                  <el-option label="a" :value="1"></el-option>
                </el-select>
              </td>
              <td class="col w2" colspan="2">
                <el-input></el-input>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="form-wrapper" ref="form1">
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

      <div class="form-wrapper" ref="form2">
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

      <div class="form-wrapper" ref="form3">
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

      <div class="form-wrapper" ref="form4">
        <table class="form form4">
          <tr class="row top-row">
            <td class="col" colspan="22">
              调整后参数
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
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import {vueCopy} from 'utils/helper';
// import Util from 'utils/util.js';

var dbsFirstModel = {
  'deviceId': '8a9e2d385e27e424015e27e6b3740006',
  'devicePowerType': 1,
  'programDate': '2017-10-05',
  'isTakeMedication': 1,
  'medicationStatus': '美多芭（5片）',
  'damageEffectExist': 1,
  'damageEffectDuration': '2',
  'adverseEventsExist': 1,
  'adverseEventsRemark': '不良症状了。。。',
  'leftContactEffectOrder': '0->2->1->3-',
  'rightContactEffectOrder': '8->10->9->11-',
  'remarks': 'huhu呵呵',
  'patientCaseId': '8a9e2d385ed3847d015f05c531b900a7',
  'departId': '8a102a575c200623015c2f9bc2a8008b',
  'patientDbsFirstId': 9,
  'patientDbsFirstDetail':
  [
    {
      'id': 396,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 1,
      'elbowTone': 0,
      'wristTone': 0,
      'kneeTone': 0,
      'neckTone': 0,
      'tremor': 0,
      'changeConstantly': 0,
      'sideEffect': '2',
      'sideEffectDuration': 2,
      'tensionTone': 8,
      'patientDbsFirstId': 9
    },
    {
      'id': 397,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 2,
      'elbowTone': 1,
      'wristTone': 1,
      'kneeTone': 1,
      'neckTone': 1,
      'tremor': 1,
      'changeConstantly': 1,
      'sideEffect': '2',
      'sideEffectDuration': 1,
      'patientDbsFirstId': 9
    },
    {
      'id': 398,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 3,
      'elbowTone': 1,
      'wristTone': 1,
      'kneeTone': 1,
      'neckTone': 1,
      'tremor': 1,
      'changeConstantly': 1,
      'sideEffect': '1',
      'sideEffectDuration': 2,
      'tensionTone': 8,
      'patientDbsFirstId': 9
    },
    {
      'id': 399,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 4,
      'elbowTone': 2,
      'wristTone': 2,
      'kneeTone': 2,
      'neckTone': 2,
      'tremor': 2,
      'changeConstantly': 2,
      'sideEffect': '0',
      'sideEffectDuration': 2,
      'tensionTone': 8,
      'patientDbsFirstId': 9
    },
    {
      'id': 400,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 5,
      'elbowTone': 2,
      'wristTone': 2,
      'kneeTone': 2,
      'neckTone': 2,
      'tremor': 2,
      'changeConstantly': 2,
      'sideEffect': '2',
      'sideEffectDuration': 1,
      'tensionTone': 8,
      'patientDbsFirstId': 9
    },
    {
      'id': 401,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 6,
      'elbowTone': 2,
      'wristTone': 2,
      'kneeTone': 2,
      'neckTone': 2,
      'tremor': 2,
      'changeConstantly': 2,
      'sideEffect': '4',
      'sideEffectDuration': 2,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 402,
      'dbsCase': 'C+',
      'contact': '0-',
      'dbsVoltage': 7,
      'elbowTone': 2,
      'wristTone': 2,
      'kneeTone': 2,
      'neckTone': 2,
      'tremor': 2,
      'changeConstantly': 2,
      'sideEffect': '5',
      'sideEffectDuration': 1,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 403,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 1,
      'elbowTone': 3,
      'wristTone': 3,
      'kneeTone': 3,
      'neckTone': 3,
      'tremor': 3,
      'changeConstantly': 3,
      'sideEffect': '7',
      'sideEffectDuration': 2,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 404,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 2,
      'elbowTone': 3,
      'wristTone': 3,
      'kneeTone': 3,
      'neckTone': 3,
      'tremor': 3,
      'changeConstantly': 3,
      'sideEffect': '11',
      'sideEffectDuration': 2,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 405,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 3,
      'elbowTone': 3,
      'wristTone': 3,
      'kneeTone': 3,
      'neckTone': 3,
      'tremor': 3,
      'changeConstantly': 3,
      'sideEffect': '9',
      'sideEffectDuration': 1,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 406,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 4,
      'elbowTone': 3,
      'wristTone': 3,
      'kneeTone': 3,
      'neckTone': 3,
      'tremor': 3,
      'changeConstantly': 3,
      'sideEffect': '8',
      'sideEffectDuration': 2,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 407,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 5,
      'elbowTone': 4,
      'wristTone': 4,
      'kneeTone': 4,
      'neckTone': 4,
      'tremor': 4,
      'changeConstantly': 4,
      'sideEffect': '6',
      'sideEffectDuration': 1,
      'tensionTone': 9,
      'patientDbsFirstId': 9
    },
    {
      'id': 408,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 6,
      'elbowTone': 4,
      'wristTone': 4,
      'kneeTone': 4,
      'neckTone': 4,
      'tremor': 4,
      'changeConstantly': 4,
      'sideEffect': '7',
      'sideEffectDuration': 2,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 409,
      'dbsCase': 'C+',
      'contact': '1-',
      'dbsVoltage': 7,
      'elbowTone': 4,
      'wristTone': 4,
      'kneeTone': 4,
      'neckTone': 4,
      'tremor': 4,
      'changeConstantly': 4,
      'sideEffect': '7',
      'sideEffectDuration': 1,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 410,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 1,
      'elbowTone': 4,
      'wristTone': 4,
      'kneeTone': 4,
      'neckTone': 4,
      'tremor': 4,
      'changeConstantly': 4,
      'sideEffect': '6',
      'sideEffectDuration': 2,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 411,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 2,
      'elbowTone': 5,
      'wristTone': 5,
      'kneeTone': 5,
      'neckTone': 5,
      'tremor': 5,
      'changeConstantly': 5,
      'sideEffectDuration': 1,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 412,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 3,
      'elbowTone': 5,
      'wristTone': 5,
      'kneeTone': 5,
      'neckTone': 5,
      'tremor': 5,
      'changeConstantly': 5,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 413,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 4,
      'elbowTone': 5,
      'wristTone': 5,
      'kneeTone': 5,
      'neckTone': 5,
      'tremor': 5,
      'changeConstantly': 5,
      'sideEffectDuration': 1,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 414,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 5,
      'elbowTone': 5,
      'wristTone': 5,
      'kneeTone': 5,
      'neckTone': 5,
      'tremor': 5,
      'changeConstantly': 5,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    },
    {
      'id': 415,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 6,
      'elbowTone': 5,
      'wristTone': 5,
      'kneeTone': 5,
      'neckTone': 5,
      'tremor': 5,
      'changeConstantly': 5,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 416,
      'dbsCase': 'C+',
      'contact': '2-',
      'dbsVoltage': 7,
      'elbowTone': 6,
      'wristTone': 6,
      'kneeTone': 6,
      'neckTone': 6,
      'tremor': 6,
      'changeConstantly': 6,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 417,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 1,
      'elbowTone': 6,
      'wristTone': 6,
      'kneeTone': 6,
      'neckTone': 6,
      'tremor': 6,
      'changeConstantly': 6,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 418,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 2,
      'elbowTone': 6,
      'wristTone': 6,
      'kneeTone': 6,
      'neckTone': 6,
      'tremor': 6,
      'changeConstantly': 6,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 419,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 3,
      'elbowTone': 6,
      'wristTone': 6,
      'kneeTone': 6,
      'neckTone': 6,
      'tremor': 6,
      'changeConstantly': 6,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 420,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 4,
      'elbowTone': 6,
      'wristTone': 6,
      'kneeTone': 6,
      'neckTone': 6,
      'tremor': 6,
      'changeConstantly': 6,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 421,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 5,
      'elbowTone': 6,
      'wristTone': 6,
      'kneeTone': 6,
      'neckTone': 6,
      'tremor': 6,
      'changeConstantly': 6,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 422,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 6,
      'elbowTone': 7,
      'wristTone': 7,
      'kneeTone': 7,
      'neckTone': 7,
      'tremor': 7,
      'changeConstantly': 7,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 423,
      'dbsCase': 'C+',
      'contact': '3-',
      'dbsVoltage': 7,
      'elbowTone': 7,
      'wristTone': 7,
      'kneeTone': 7,
      'neckTone': 7,
      'tremor': 7,
      'changeConstantly': 7,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 424,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 1,
      'elbowTone': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 425,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 2,
      'wristTone': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 426,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 3,
      'kneeTone': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 427,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 4,
      'neckTone': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 428,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 5,
      'tremor': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 429,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 6,
      'changeConstantly': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 430,
      'dbsCase': 'C+',
      'contact': '8-',
      'dbsVoltage': 7,
      'changeConstantly': 2,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 431,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 1,
      'tremor': 2,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 432,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 2,
      'neckTone': 2,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 433,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 3,
      'kneeTone': 2,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 434,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 4,
      'wristTone': 2,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 435,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 5,
      'elbowTone': 2,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 436,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 6,
      'elbowTone': 3,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 437,
      'dbsCase': 'C+',
      'contact': '9-',
      'dbsVoltage': 7,
      'wristTone': 3,
      'sideEffectDuration': 1,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 438,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 1,
      'kneeTone': 3,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 439,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 2,
      'neckTone': 3,
      'sideEffect': '2',
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 440,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 3,
      'tremor': 3,
      'tensionTone': 6,
      'patientDbsFirstId': 9
    },
    {
      'id': 441,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 4,
      'changeConstantly': 3,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 442,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 5,
      'changeConstantly': 4,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 443,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 6,
      'tremor': 4,
      'sideEffect': '4',
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 444,
      'dbsCase': 'C+',
      'contact': '10-',
      'dbsVoltage': 7,
      'neckTone': 4,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 445,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 1,
      'kneeTone': 4,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 446,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 2,
      'wristTone': 4,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 447,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 3,
      'elbowTone': 4,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 448,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 4,
      'elbowTone': 5,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 449,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 5,
      'wristTone': 5,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 450,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 6,
      'kneeTone': 5,
      'tensionTone': 5,
      'patientDbsFirstId': 9
    },
    {
      'id': 451,
      'dbsCase': 'C+',
      'contact': '11-',
      'dbsVoltage': 7,
      'neckTone': 5,
      'tremor': 5,
      'changeConstantly': 5,
      'tensionTone': 7,
      'patientDbsFirstId': 9
    }
  ],
  'firstDbsParams': [
    {
      'id': 11,
      'paramType': 1,
      'schemeOrder': 1,
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
      'effectInfo': '副反应呵呵',
      'patientDbsFirstId': 9
    },
    {
      'id': 9,
      'paramType': 1,
      'schemeOrder': 2,
      'limbSide': 1,
      'exciteMod': 2,
      'negativePole': 'C+/1+',
      'positivePole': '2-',
      'frequency': '135',
      'pulseWidth': '66',
      'voltage': '253',
      'resistance': 504,
      'electric': 0,
      'electricity': 0,
      'effectInfo': '哇哈哈！',
      'patientDbsFirstId': 9
    }
  ]
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
      copyInfo: {},
      cl: ['C+', '2+'],
      cl2: ['1-']
    };
  },
  methods: {
    showModal(changeWay, info) {
      if (changeWay === this.ADD_DATA) {
        this.title = '新增程控记录';
      } else if (changeWay === this.EDIT_DATA) {
        this.title = '程控记录';
      }
      console.log(info);
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
      });
    }
  },
  created() {
    vueCopy(dbsFirstModel, this.copyInfo);
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
              right: 10px;
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
