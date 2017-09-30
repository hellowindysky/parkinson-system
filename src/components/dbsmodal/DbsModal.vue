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
      <!-- <div class="seperate-line"></div> -->
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
// import Util from 'utils/util.js';

export default {
  data() {
    return {
      displayModal: false,
      title: '',
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
  mounted() {
    this.updateScrollbar();
    Bus.$on(this.SHOW_DBS_MODAL, this.showModal);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_DBS_MODAL, this.showModal);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 100px;
@long-field-name-width: 150px;
@scroll-bar-height: 10px;
@unit-width: 50px;

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
    max-width: 1200px;
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
      .form {
        margin: 10px auto 0;
        border-spacing: 0;
        table-layout: fixed;
        border: 1px solid @light-gray-color;
        border-collapse:collapse;
        text-align: center;
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
