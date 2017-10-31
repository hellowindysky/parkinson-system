<template lang="html">
  <div class="basic-analytics" ref="scrollArea">
    <div class="analytics-card-wrapper">
      <div class="titleName">Data Profiling</div>
      <div class="card-list">
        <div class="my-patients card">
          <div class="title">My Patients</div>
          <div class="analy-value">{{dataBrief.myPatient.totalCount}}</div>
          <div class="compare">
            <div class="compare-left">
              <div>New Additions This Week</div>
              <div class="value-class">{{dataBrief.myPatient.increaseWeek}}People</div></div>
            <div class="compare-right">
              <div>Week-On-Week</div>
              <div class="value-class"><i class="icon iconfont" :class="myPatientClass"/>{{(dataBrief.myPatient.increaseRate) >= 1000000 ?'—':(dataBrief.myPatient.increaseRate*100).toFixed(2)}}%</div>
            </div>
          </div>
        </div>
        <div class="my-groups card">
          <div class="title">My Group</div>
          <div class="analy-value">{{dataBrief.myGroup.totalCount-1}}</div>
          <div class="compare">
            <div class="compare-left">
              <div>New Additions This Week</div>
              <div class="value-class">{{dataBrief.myGroup.increaseWeek}}个</div>
            </div>
            <div class="compare-right">
              <div>Week-On-Week</div>
              <div class="value-class"><i class="icon iconfont" :class="myGroupClass"/>{{(dataBrief.myGroup.increaseRate) >= 1000000 ?'—':(dataBrief.myGroup.increaseRate*100).toFixed(2)}}%</div>
            </div>
          </div>
        </div>
        <div class="avg-arise-age card">
          <div class="title">Average Age of Onset</div>
          <div class="analy-value">{{dataBrief.firAge.averFirAge == null?'—':dataBrief.firAge.averFirAge.toFixed(2) }}</div>
          <div class="compare">
            <div class="compare-left">
                <div>Last Week</div>
                <div class="value-class">{{dataBrief.firAge.averFirAgeLastWeek == null?'—':dataBrief.firAge.averFirAgeLastWeek.toFixed(2)}}year-old</div>
            </div>
            <div class="compare-right">
              <div>Week-On-Week</div>
              <div class="value-class"><i class="icon iconfont" :class="firAgeClass"/>{{(dataBrief.firAge.increateRase) >= 1000000 ?'—':(dataBrief.firAge.increateRase*100).toFixed(2)}}%</div></div>
          </div>
        </div>
        <div class="avg-sick-year card">
          <div class="title">Mean time of illness</div>
          <div class="analy-value">{{dataBrief.diseaseAge.averDiseaseAge == null?'—':dataBrief.diseaseAge.averDiseaseAge.toFixed(2)}}</div>
          <div class="compare">
            <div class="compare-left">
              <div>Last Week</div>
              <div class="value-class">{{dataBrief.diseaseAge.averDiseaseAgeLastWeek == null?'—':dataBrief.diseaseAge.averDiseaseAgeLastWeek.toFixed(2)}}year</div></div>
            <div class="compare-right">
              <div>Week-On-Week</div>
              <div class="value-class"><i class="icon iconfont" :class="diseaseClass"/>{{(dataBrief.diseaseAge.increateRase*100) >= 100000?'—':(dataBrief.diseaseAge.increateRase*100).toFixed(2)}}%</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="analytics-chart-wrapper">
      <div class="area card">
        <div class="titleName">Area</div>
        <div class="para-area">
          <el-select v-model="statPatientProvince.para.topValue" placeholder="Top" @change="getProvinceChartData">
            <el-option
              v-for="item in statPatientProvince.para.top"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientProvince.para.timeSpanValue" clearable placeholder="Total Time" @change="getProvinceChartData">
            <el-option
              v-for="item in statPatientProvince.para.timeSpan"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientProvince.para.groupValue" clearable placeholder="Grouping" @change="getProvinceChartData">
            <el-option
              v-for="item in statPatientProvince.para.group"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientProvince.para.sourceDeviceTypeValue" clearable placeholder="Sources" @change="getProvinceChartData">
            <el-option
              v-for="item in statPatientProvince.para.sourceDeviceType"
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
        <div class="titleName">Age</div>
        <div class="para-area">
          <el-select v-model="statPatientAge.para.timeSpanValue" clearable placeholder="Total Time" @change="getAgeChartData">
            <el-option
              v-for="item in statPatientAge.para.timeSpan"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientAge.para.groupValue" clearable placeholder="Grouping" @change="getAgeChartData">
            <el-option
              v-for="item in statPatientAge.para.group"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientAge.para.sourceDeviceTypeValue" clearable placeholder="Sources" @change="getAgeChartData">
            <el-option
              v-for="item in statPatientAge.para.sourceDeviceType"
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
        <div class="titleName">Profession</div>
        <div class="para-area">
          <el-select v-model="statPatientCareer.para.timeSpanValue" clearable placeholder="Total Time" @change="getCareerChartData">
            <el-option
              v-for="item in statPatientCareer.para.timeSpan"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientCareer.para.groupValue" clearable placeholder="Grouping"  @change="getCareerChartData">
            <el-option
              v-for="item in statPatientCareer.para.group"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="statPatientCareer.para.sourceDeviceTypeValue" clearable placeholder="Sources"  @change="getCareerChartData">
            <el-option
              v-for="item in statPatientCareer.para.sourceDeviceType"
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
import {queryStatDataBrief, queryStatPatientProvince, queryStatPatientAge, queryStatPatientCareer} from 'api/analytics.js';
import {getGroupList} from 'api/group.js';
import {pruneObj} from 'utils/helper.js';
import Ps from 'perfect-scrollbar';
export default {
  data() {
    return {
      dataBrief: {
        'myPatient':
        {
          'totalCount': 0,
          'increaseWeek': 0,
          'increaseRate': 0
        },
        'myGroup':
        {
          'totalCount': 1,
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
      statPatientProvince: {
        para: {
          top: [
            {
              value: '10',
              label: 'Top10'
            },
            {
              value: '15',
              label: 'Top15'
            },
            {
              value: '20',
              label: 'Top20'
            }
          ],
          topValue: '10',
          timeSpan: [
            {
              value: '0',
              label: 'This Week'
            },
            {
              value: '1',
              label: 'This Month'
            },
            {
              value: '2',
              label: '3 Months'
            },
            {
              value: '3',
              label: 'Half-Year'
            },
            {
              value: '4',
              label: 'One-Year'
            }
          ],
          timeSpanValue: '',
          group: [
            {
              value: '402890825f3ce41b015f3ce41bb70000',
              label: '暴走'
            },
            {
              value: '402890825f3ce41b015f3d33a52e0002',
              label: '产品经理讨论组'
            }
          ],
          groupValue: '',
          sourceDeviceType: [
            {
              value: '0',
              label: 'PC'
            },
            {
              value: '1',
              label: 'PAD'
            }
          ],
          sourceDeviceTypeValue: ''
        }
      },
      statPatientAge: {
        para: {
          timeSpan: [
            {
              value: '0',
              label: 'This Week'
            },
            {
              value: '1',
              label: 'This Month'
            },
            {
              value: '2',
              label: '3 Months'
            },
            {
              value: '3',
              label: 'Half-Year'
            },
            {
              value: '4',
              label: 'One-Year'
            }
          ],
          timeSpanValue: '',
          group: [
            {
              value: '402890825f3ce41b015f3ce41bb70000',
              label: '暴走'
            },
            {
              value: '402890825f3ce41b015f3d33a52e0002',
              label: '产品经理讨论组'
            }
          ],
          groupValue: '',
          sourceDeviceType: [
            {
              value: '0',
              label: 'PC'
            },
            {
              value: '1',
              label: 'PAD'
            }
          ],
          sourceDeviceTypeValue: ''
        }
      },
      statPatientCareer: {
        para: {
          timeSpan: [
            {
              value: '0',
              label: 'This Week'
            },
            {
              value: '1',
              label: 'This Month'
            },
            {
              value: '2',
              label: '3 Months'
            },
            {
              value: '3',
              label: 'Half-Year'
            },
            {
              value: '4',
              label: 'One-Year'
            }
          ],
          timeSpanValue: '',
          group: [
            {
              value: '402890825f3ce41b015f3ce41bb70000',
              label: '暴走'
            },
            {
              value: '402890825f3ce41b015f3d33a52e0002',
              label: '产品经理讨论组'
            }
          ],
          groupValue: '',
          sourceDeviceType: [
            {
              value: '0',
              label: 'PC'
            },
            {
              value: '1',
              label: 'PAD'
            }
          ],
          sourceDeviceTypeValue: ''
        }
      }
    };
  },
  methods: {
    drawAreaChart(id, dataValue) {
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
          data: dataValue.proviceData
        },
        yAxis: {},
        series: [{
          name: 'BirthPlace',
          type: 'bar',
          data: dataValue.countData
        }]
      });
    },
    drawAgeChart(id, dataValue) {
      this.areaChart = echarts.init(document.getElementById(id));
      this.areaChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }},
        xAxis: {
          data: ['Below 25 years old', '26-35 years old', '36-45 years old', '46-55 years old', '56-65 years old', 'More Than 65 years old']
        },
        yAxis: {},
        series: [{
          name: 'Age',
          type: 'bar',
          data: dataValue
        }]
      });
    },
    drawCareerChart(id, dataValue) {
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
          data: dataValue.career
        },
        yAxis: {},
        series: [{
          name: 'Profession',
          type: 'bar',
          data: dataValue.countData
        }]
      });
    },
    getProvinceChartData() {
      var para = {};
      para.topN = this.statPatientProvince.para.topValue;
      para.timeSpan = this.statPatientProvince.para.timeSpanValue;
      para.groupId = this.statPatientProvince.para.groupValue;
      para.sourceDeviceType = this.statPatientProvince.para.sourceDeviceTypeValue;
      pruneObj(para);
      queryStatPatientProvince(para).then((data) => {
        var proviceData = [];
        var countData = [];
        for (var i = 0;i < data.length; i++) {
          proviceData[i] = data[i].proviceName;
          countData[i] = data[i].patientCount;
        }
        var obj = {};
        obj.proviceData = proviceData;
        obj.countData = countData;
        this.drawAreaChart('areaChart', obj);
      }, (error) => {
        console.log(error);
      });
    },
    getAgeChartData() {
      var para = {};
      para.timeSpan = this.statPatientAge.para.timeSpanValue;
      para.groupId = this.statPatientAge.para.groupValue;
      para.sourceDeviceTypeValue = this.statPatientAge.para.sourceDeviceTypeValue;
      pruneObj(para);
      queryStatPatientAge(para).then((data) => {
        var dataValue = [];
        for (var i = 0;i < data.length; i++) {
          dataValue[i] = data[i].patientCount;
        }
        console.log(dataValue);
        this.drawAgeChart('ageChart', dataValue);
      }, (error) => {
        console.log(error);
      });
    },
    getCareerChartData() {
      var para = {};
      para.timeSpan = this.statPatientCareer.para.timeSpanValue;
      para.groupId = this.statPatientCareer.para.groupValue;
      para.sourceDeviceTypeValue = this.statPatientCareer.para.sourceDeviceTypeValue;
      pruneObj(para);
      queryStatPatientCareer(para).then((data) =>{
        var career = [];
        var countData = [];
        for (var i = 0;i < data.length; i++) {
          career[i] = data[i].displayName;
          countData[i] = data[i].patientCount;
        }
        var obj = {};
        obj.career = career;
        obj.countData = countData;
        this.drawCareerChart('careerChart', obj);
      }, (error) => {
        console.log(error);
      });
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        // 之所以弃用 update 方法，是因为它在某些情况下会出现问题，导致滚动条不能有效刷新
        // Ps.update(this.$refs.scrollArea);

        // 如果之前有绑定滚动条的话，先进行解除
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getProvinceChartData();
      this.getAgeChartData();
      this.getCareerChartData();
      this.updateScrollbar();
    });

    queryStatDataBrief().then((data) => {
      this.dataBrief = data;
    }, (error) => {
      console.log(error);
    });
    getGroupList().then((data) => {
      var groups = [];
      for (let group of data) {
        var obj = {
          value: '',
          label: ''
        };
        obj.value = group.groupId;
        obj.label = group.groupName;
        groups.push(obj);
      }
      this.statPatientProvince.para.group = groups;
      this.statPatientAge.para.group = groups;
      this.statPatientCareer.para.group = groups;
    }, (error) => {
      console.log(error);
    });

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
  overflow: hidden;
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
      width: 84.2%;
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
</style>
