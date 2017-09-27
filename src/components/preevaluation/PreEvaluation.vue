<template lang="html">
  <div class="pre-evaluation-modal-wrapper" v-show="displayModal">
    <div class="pre-evaluation-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">DBS患者编码</span>
          <span class="field-input">
            <el-input></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">评估时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">术前评估备注</span>
          <span class="field-input">
            <el-input></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>

      <div class="sub-title-bar">剂末现象评估</div>
      <div class="content">
        <div class="field">
          <span class="field-name">剂末现象评估时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">剂末现象评估量表</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="a" :value="1"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">是否存在剂末现象</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">是否首次出现</span>
          <span class="field-input">
            <el-select :value="1">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">初次出现时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">已出现剂末现象</span>
          <span class="field-input short-input">
            <el-input></el-input>
          </span>
          <span class="end-words">年 (运动并发症早期&lt;=3年)</span>
        </div>
        <div class="field whole-line">
          <span class="field-name">备注</span>
          <span class="field-input">
            <el-input></el-input>
          </span>
        </div>
      </div>

      <div class="seperate-line"></div>

      <div class="sub-title-bar">剂末现象评估</div>
      <div class="content">
        <table class="table">
          <tr class="row">
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
            <td class="col">
              <el-date-picker></el-date-picker>
            </td>
            <td class="col">
              <el-date-picker></el-date-picker>
            </td>
            <td class="col">
              <el-date-picker></el-date-picker>
            </td>
            <td class="col">
              <el-date-picker></el-date-picker>
            </td>
            <td class="col">
              <el-date-picker></el-date-picker>
            </td>
            <td class="col">
              <el-date-picker></el-date-picker>
            </td>
          </tr>
          <tr class="row">
            <td class="col">睡眠</td>
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
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col">关期</td>
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
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col">重异动开</td>
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
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col">轻异动开</td>
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
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col">无异动开</td>
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
            <td class="col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-input></el-input>
            </td>
          </tr>
          <tr class="row">
            <td class="col">总和</td>
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
            <td class="col">觉醒时间</td>
            <td class="col">异动时间</td>
            <td class="col">关期总时间</td>
            <td class="col">开期总时间</td>
            <td class="col">好的开期时间</td>
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
          </tr>
        </table>
        <table class="table">
          <tr class="row">
            <td class="col">UDysRS-1</td>
            <td class="col">UPDRS-4.1</td>
            <td class="col">UPDRS-4.3</td>
            <td class="col">好的开期%</td>
            <td class="col">重异动开%</td>
            <td class="col">异动开%</td>
            <td class="col">关期%</td>
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
      <div class="sub-title-bar">统一异动症评估</div>
      <div class="content">
        <table class="table">
          <tr class="row">
            <td class="col wide-col">量表</td>
            <td class="col">状态</td>
            <td class="col">分数</td>
            <td class="col">量表完成日期</td>
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
              <el-date-picker></el-date-picker>
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
      <div class="sub-title-bar">非运动症状评估</div>
      <div class="content">
        <table class="table">
          <tr class="row">
            <td class="col narrow-col">序号</td>
            <td class="col wide-col">量表</td>
            <td class="col narrow-col">分数</td>
            <td class="col">量表完成时间</td>
            <td class="col">备注</td>
          </tr>
          <tr class="row">
            <td class="col narrow-col">
              <el-input></el-input>
            </td>
            <td class="col wide-col">
              <el-input></el-input>
            </td>
            <td class="col narrow-col">
              <el-input></el-input>
            </td>
            <td class="col">
              <el-date-picker></el-date-picker>
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
      <div class="sub-title-bar">运动症状评估(急性左旋多巴冲击试验)</div>
      <div class="content">
        <div class="field">
          <span class="field-name">试验日期时间</span>
          <span class="field-input">
            <el-date-picker></el-date-picker>
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
            <el-date-picker></el-date-picker>
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
// import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
// import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: false,
      title: ''
    };
  },
  computed: {

  },
  methods: {
    showModal(changeWay, info) {
      if (changeWay === this.ADD_DATA) {
        this.title = '新增术前评估';
      } else if (changeWay === this.EDIT_DATA) {
        this.title = '术前评估';
      }
      console.log(info);
      this.displayModal = true;
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
      this.displayModal = false;
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

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 120px;
@long-field-name-width: 160px;
@end-words-width: 180px;

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
    width: 760px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .sub-title-bar {
      padding: 15px 10px 15px;
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
            right: calc(~"8% + @{end-words-width}");
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
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .table {
        margin: 10px 0 20px;
        width: 100%;
        border: 1px solid @light-gray-color;
        border-collapse:collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            &.wide-col {
              width: 30%;
            }
            &.narrow-col {
              width: 5%;
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
