<template lang="html">
  <div class="basic-analytics">
    <div class="analytics-card-wrapper">
      <div class="titleName">数据概况</div>
      <div class="card-list">
        <div class="my-patients card">
          <div class="title">我的患者</div>
          <div class="analy-value">{{dataBrief.myPatient.totalCount}}</div>
          <div class="compare">
            <div class="compare-left">
              <div>本周新增</div>
              <div class="value-class">{{dataBrief.myPatient.increaseWeek}}人</div></div>
            <div class="compare-right">
              <div>周环比</div>
              <div class="value-class"><i class="icon iconfont" :class="myPatientClass"/>{{(dataBrief.myPatient.increaseRate*100).toFixed(2)}}%</div>
            </div>
          </div>
        </div>
        <div class="my-groups card">
          <div class="title">我的分组</div>
          <div class="analy-value">{{dataBrief.myGroup.totalCount-1}}</div>
          <div class="compare">
            <div class="compare-left">
              <div>本周新增</div>
              <div class="value-class">{{dataBrief.myGroup.increaseWeek}}个</div>
            </div>
            <div class="compare-right">
              <div>周环比</div>
              <div class="value-class"><i class="icon iconfont" :class="myGroupClass"/>{{(dataBrief.myGroup.increaseRate*100).toFixed(2)}}%</div>
            </div>
          </div>
        </div>
        <div class="avg-arise-age card">
          <div class="title">平均起病年龄</div>
          <div class="analy-value">{{dataBrief.firAge.averFirAge.toFixed(2) }}</div>
          <div class="compare">
            <div class="compare-left">
                <div>上周值</div>
                <div class="value-class">{{dataBrief.firAge.averFirAgeLastWeek.toFixed(2)}}岁</div>
            </div>
            <div class="compare-right">
              <div>周环比</div>
              <div class="value-class"><i class="icon iconfont" :class="firAgeClass"/>{{(dataBrief.firAge.increateRase*100).toFixed(2)}}%</div></div>
          </div>
        </div>
        <div class="avg-sick-year card">
          <div class="title">平均患病年限</div>
          <div class="analy-value">{{dataBrief.diseaseAge.averDiseaseAge.toFixed(2)}}</div>
          <div class="compare">
            <div class="compare-left">
              <div>上周值</div>
              <div class="value-class">{{dataBrief.diseaseAge.averDiseaseAgeLastWeek.toFixed(2)}}年</div></div>
            <div class="compare-right">
              <div>周环比</div>
              <div class="value-class"><i class="icon iconfont" :class="diseaseClass"/>{{dataBrief.diseaseAge.increateRase*100}}%</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="analytics-chart-wrapper">
      <div class="area card">
        <div class="titleName">地区</div>
        <div class="para-area">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </div>
        <div class="chart">
          <div id="areaChart" class="mychart"></div>
        </div>
      </div>
      <div class="age card">
        <div class="titleName">年龄</div>
        <div class="para-area">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="chart">
          <div id="ageChart" class="mychart"></div>
        </div>
      </div>
      <div class="career card">
        <div class="titleName">职业</div>
        <div class="para-area">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="chart">
          <div id="careerChart" class="mychart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import {queryStatDataBrief} from 'api/analytics.js';
export default {
  data() {
    return {
      'dataBrief': {
        'myPatient':
        {
          'totalCount': 0,
          'increaseWeek': 0,
          'increaseRate': 0
        },
        'myGroup':
        {
          'totalCount': 0,
          'increaseWeek': 0,
          'increaseRate': 0
        },
        'firAge':
        {
          'averFirAge': 0,
          'averFirAgeLastWeek': 0,
          'increateRase': 0
        },
        'diseaseAge':
        {
          'averDiseaseAge': 0,
          'averDiseaseAgeLastWeek': 0,
          'increateRase': 0
        }
      },
      'patientProvince': [
        {
          'proviceName': '广东',
          'patientCount': 130
        },
        {
          'proviceName': '湖南',
          'patientCount': 13
        },
        {
          'proviceName': '广西',
          'patientCount': 13
        },
        {
          'proviceName': '广北',
          'patientCount': 13
        }
      ]
    };
  },
  methods: {
    drawAreaChart(id) {
      this.areaChart = echarts.init(document.getElementById(id));
      this.areaChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: ['北京', '天津', '重庆', '福建', '广东', '湖南', '湖北', '广西', '上海', '海南']
        },
        yAxis: {},
        series: [{
          name: '籍贯',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 55, 66, 77, 190]
        }]
      });
    },
    drawAgeChart(id) {
      this.areaChart = echarts.init(document.getElementById(id));
      this.areaChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }},
        xAxis: {
          data: ['25岁以下', '26-35岁', '36-45岁', '46-55岁', '56-65岁', '65岁以上']
        },
        yAxis: {},
        series: [{
          name: '年龄',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
    },
    drawCareerChart(id) {
      this.areaChart = echarts.init(document.getElementById(id));
      this.areaChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: ['工人', '农名', '教师', '科技人员', '医务人员', '服务人员', '军人', '文体人员', '家务', '不详']
        },
        yAxis: {},
        series: [{
          name: '职业',
          type: 'bar',
          data: [5, 10, 34, 10, 13, 20, 55, 66, 77, 190]
        }]
      });
    },
    queryBrief() {
      queryStatDataBrief().then((data) => {
        this.dataBrief = data;
      }, (error) => {
        console.log(error);
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.drawAreaChart('areaChart');
      this.drawAgeChart('ageChart');
      this.drawCareerChart('careerChart');
    });
    this.queryBrief();
  },
  computed: {
    diseaseClass() {
      if (this.dataBrief.diseaseAge.increateRase >= 0) {
        return 'icon-up';
      } else {
        return 'icon-down';
      }
    },
    firAgeClass() {
      if (this.dataBrief.firAge.increateRase >= 0) {
        return 'icon-up';
      } else {
        return 'icon-down';
      }
    },
    myGroupClass() {
      if (this.dataBrief.myGroup.increaseRate >= 0) {
        return 'icon-up';
      } else {
        return 'icon-down';
      }
    },
    myPatientClass() {
      if (this.dataBrief.myPatient.increaseRate >= 0) {
        return 'icon-up';
      } else {
        return 'icon-down';
      }
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.basic-analytics {
  position: relative;
  overflow: scroll;
  width: 100%;
  height: 100%;
  background-color: @screen-color;
  .analytics-card-wrapper{
    .titleName{
      text-align: left;
      font-size: 17px;
      font-weight: bold;
      padding-left: 120px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .card-list{
      .title {
        padding-top: 20px;
        padding-bottom: 20px ;
      }
      .analy-value {
        padding-bottom: 20px;
        font-size: 25px;;
      }
      .card {
        display: inline-block;
        position: relative;
        height: 160px;
        width: 20%;
        background-color: @background-color;
        margin-right: 20px;

        .compare-left {
          float: left;
          padding-right: 20px;
          margin-left: 30px;
        }
        .compare-right {
          float: right;
          margin-right: 20px;
        }
      }
    }

  }
  .analytics-chart-wrapper{
    .card {
      display: inline-block;
      position: relative;
      height: 600px;
      width: 84.5%;
      background-color: @background-color;
      cursor: pointer;
      margin-right: 20px;
      margin-top: 20px;
      .titleName{
        text-align: left;
        font-size: 16px;
        font-weight: bold;
        padding-left: 20px;
        margin-bottom: 10px;
        margin-top: 10px;
      }
      .para-area{
        float: left;
        margin-left: 20px;
      }
      .mychart{
        width: 1000px;
        height: 540px;
        margin: auto;
      }
    }
  }
}
.value-class{
  margin-top: 6px;
}
</style>
