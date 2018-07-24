<template lang="html">
  <div class="sleep-monitor-modal-warpper">
    <div class="sleep-monitor-modal">
      <h3 class="title">{{title}}</h3>
      <i class="el-alert__closebtn el-icon-close large-icon" @click="cancel"></i>
      <div class="modal-body">
      <div class="content">
        <div class="field half-line">
          <span class="field-name">
            设备型号:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>设备型号值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入设备型号"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name">
            设备编号:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>设备编号值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入设备编号"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name">
            检查编号:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>检查编号值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入检查编号"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name">
            数据来源:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>数据来源值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-select v-model="copyInfo.test1" placeholder="请选择数据来源">
              <el-option
                :label="'设备采集'"
                :value="0">
              </el-option>
            </el-select>
          </span>
        </div>

        <div class="field">
          <span class="field-name">
            备注:
            <!-- <span class="required-mark"></span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>备注</span>
          </span>
          <span class="field-input" v-else>
            <el-input
              v-model="copyInfo.test1"
              type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="请输入备注">
            </el-input>
          </span>
        </div>

        <div class="seperate-line"></div>

        <div class="field half-line">
          <span class="field-name">
            上床时间:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>上床时间值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-date-picker
              v-model="copyInfo.test1"
              type="datetime"
              placeholder="选择上床时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name">
            起床时间:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>起床时间值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-date-picker
              v-model="copyInfo.test1"
              type="datetime"
              placeholder="选择起床时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name">
            入睡时间:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>入睡时间值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-date-picker
              v-model="copyInfo.test1"
              type="datetime"
              placeholder="选择入睡时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name">
            觉醒时间:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>觉醒时间值</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-date-picker
              v-model="copyInfo.test1"
              type="datetime"
              placeholder="选择觉醒时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>

        <div class="seperate-line"></div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            睡眠时长:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>睡眠时长值</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入检查编号"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            睡眠效率（%）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>睡眠效率值</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入睡眠效率"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            入睡耗时（min）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>入睡耗时值</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入入睡耗时"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            起床尝试次数（次）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>起床尝试次数值</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入起床尝试次数"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            觉醒次数（次）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>觉醒次数值</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入觉醒次数"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            起床尝试耗时（min）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>起床尝试耗时</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入起床尝试耗时"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            觉醒时长（min）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>觉醒时长</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入觉醒时长"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            起床伴有震颤:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>起床伴有震颤</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-select v-model="copyInfo.test1" placeholder="请选择是否有震颤" clearable >
              <el-option
                :label="'yes'"
                :value="0">
              </el-option>
            </el-select>
          </span>
        </div>

        <div class="seperate-line"></div>

        <table class="table">
          <thead>
            <tr class="row title-row">
              <th class="col wide-col">睡眠分期</th>
              <th class="col">清醒（W）</th>
              <th class="col">思睡（N1）</th>
              <th class="col">浅睡（N2）</th>
              <th class="col">深睡（N3）</th>
              <th class="col">快动眼（REM）</th>
              <th class="col">总计</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row">
              <td class="col">潜伏期</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
            </tr>
            <tr class="row">
              <td class="col">持续时间</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
            </tr>
            <tr class="row">
              <td class="col">总睡眠时间占比（%）</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
            </tr>
            <tr class="row">
              <td class="col">睡眠期占比（%）</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
              <td class="col">88</td>
            </tr>
          </tbody>
        </table>

        <div class="seperate-line"></div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            呼吸率（%）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>呼吸率</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入呼吸率"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            平均心率（bpm）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>平均心率</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入平均心率"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            最高心率（bpm）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>最高心率</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入最高心率"></el-input>
          </span>
        </div>

        <div class="field half-line">
          <span class="field-name long-field-name">
            最低心率（bpm）:
            <!-- <span class="required-mark">*</span> -->
          </span>
          <span class="field-input long-field-name" v-if="mode===VIEW_CURRENT_CARD">
            <span>最低心率</span>
          </span>
          <span class="field-input long-field-name" v-else>
            <!-- <span class="warning-text"></span> -->
            <el-input v-model="copyInfo.test1" placeholder="请输入最低心率"></el-input>
          </span>
        </div>

        <div class="seperate-line"></div>

      </div>

      </div>
      <div class="modal-footer">
      <div class="button cancel-button">取消</div>
      <div class="button edit-button" v-if="mode===VIEW_CURRENT_CARD && showEdit">编辑</div>
      <div class="button submit-button" v-else-if="mode!==VIEW_CURRENT_CARD">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
export default {
  data() {
    return {
      mode: '',
      copyInfo: {
        test1: ''
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
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增睡眠监测';
      } else {
        return '睡眠监测';
      }
    }
  },
  methods: {
    showModal() {},
    updateScrollbar() {
      this.$nextTick(() => {
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
    this.updateScrollbar();
  }
};
</script>


<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 90px;
@long-field-name-width: 140px;

.sleep-monitor-modal-warpper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .sleep-monitor-modal {
    position: relative;
    margin: auto;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
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
      .field {
        display: inline-block;
        position: relative;
        width: 100%;
        min-height: 45px;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
        &.half-line {
          width: 50%;
          .field-input {
            width: calc(~"92% - @{field-name-width}");
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
          width: calc(~"96% - @{field-name-width}");
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
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .el-textarea {
            margin-bottom: 15px;
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
      .table {
        margin: 10px 0 20px;
        width: 100%;
        border: 1px solid @light-gray-color;
        border-collapse: collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          th {
            font-weight: normal;
          }
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            &.wide-col {
              width: 20%;
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

