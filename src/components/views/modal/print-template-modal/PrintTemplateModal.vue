<template lang="html">
  <div class="print-template-modal-wrapper">
    <div class="print-template-modal">
      <h3 class="title">设置打印模板 <i class="icon el-icon-circle-close"></i></h3>
      <div class="content">

        <!-- 左边部分 -->
        <div class="export-temp-area">
          <p class="export-title">导出模板<i class="icon iconfont icon-plus" @click="addTemp"></i></p>
          <div class="export-box" ref="scrollArea">
            <ul class="temp-middle">
              <li class="item" v-for="(item,index) in daoChuMuBan" :key="index">
                <div class="item-left">
                  <span class="item-title" v-if="item.mode===READING_MODE">
                    <span>{{item.title}}</span>
                  </span>
                  <span v-else>
                    <el-input v-model="item.title" placeholder="请输入模板名称"></el-input>
                  </span>
                </div>
                <div class="item-btns">
                  <el-button type="danger" size="small" v-if="item.mode===READING_MODE" @click="canel(index)">删除</el-button>
                  <el-button type="primary" size="small" v-if="item.mode===EDITING_MODE" @click="canel(index)">取消</el-button>
                  <el-button type="warning" size="small" v-if="item.mode===EDITING_MODE">保存</el-button>
                  <el-button type="warning" size="small" v-if="item.mode===READING_MODE" @click="editTemplate(index)">编辑</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 中间部分 -->
        <div class="selected-area">
          <p class="selected-title">当前已选字段</p>
          <div class="selected-field">
            <el-tabs v-model="activeName">
              <el-tab-pane label="个人信息" name="first">
                <div class="collapse-box" ref="scrollArea2">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本情况" name="1">
                      <div class="tags-box">
                        <el-tag v-for="(item,index) in yiXuanZiDuanGeRen"
                         :key="index"
                         :closable="true">
                          {{item.name}}
                        </el-tag>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item title="现病史" name="2">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>
              <el-tab-pane label="诊断信息" name="second">

              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="reset-btn">
            <el-button type="primary" size="large">重置</el-button>
          </div>

        </div>

        <!-- 右边部分 -->
        <div class="choice-area">
          <p class="choice-title">可选导出字段</p>
          <div class="choice-field">
            <el-tabs v-model="activeName">
              <!-- <el-tab-pane label="个人信息" name="first">
                <div class="collapse-box" ref="scrollArea3">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本情况" name="1">
                      <div class="checkbox-box">
                      </div>
                    </el-collapse-item>
                    <el-collapse-item title="现病史" name="2">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                    <el-collapse-item title="其他信息" name="3">

                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane> -->
              <el-tab-pane
               v-for="(mainItem,mainIndex) in keXuanZiDuan" :key="mainIndex"
               :label="mainItem.label"
               :name="mainItem.name">
                <div class="collapse-box" ref="scrollArea3">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item
                     v-for="(middleItem,middleIndex) in mainItem.category" :key="middleIndex"
                     :title="middleItem.title"
                     :name="middleItem.name">
                      <div class="checkbox-box">
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

        </div>
      </div>

      <div class="footer"></div>

    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
export default {
  data() {
    return {
      activeName: 'first',
      activeNames: ['1', '2'],
      daoChuMuBan: [
        {
          mode: this.READING_MODE,
          title: '模板发发发'
        }
      ],
      yiXuanZiDuanGeRen: [
        { name: '姓名'},
        { name: '性别'},
        { name: '年龄'},
        { name: '身份证号'}
      ],
      resData: []
    };
  },
  computed: {
    keXuanZiDuan() {
      let gerenjibenqingkuang = this.resData.filter((item) => {
        return item.fid === 1 && item.pid === 1;
      });
      let gerenxianbingshi = this.resData.filter((item) => {
        return item.fid === 1 && item.pid === 2;
      });
      let zhenduanjibenqingkuang = this.resData.filter((item) => {
        return item.fid === 2 && item.pid === 1;
      });
      let zhenduanbingcheng = this.resData.filter((item) => {
        return item.fid === 2 && item.pid === 2;
      });
      return [
        {
          label: '个人信息',
          name: 'first',
          category: [
            {
              title: '基本情况',
              name: '1',
              fieldData: gerenjibenqingkuang
            },
            {
              title: '现病史',
              name: '2',
              fieldData: gerenxianbingshi
            }
          ]
        },
        {
          label: '诊断信息',
          name: 'second',
          category: [
            {
              title: '基本情况',
              name: '1',
              fieldData: zhenduanjibenqingkuang
            },
            {
              title: '病程情况',
              name: '2',
              fieldData: zhenduanbingcheng
            }
          ]
        }
      ];
    }
  },
  methods: {
    editTemplate(index) {
      this.$set(this.daoChuMuBan[index], 'mode', this.EDITING_MODE);
    },
    canel(index) {
      this.$set(this.daoChuMuBan[index], 'mode', this.READING_MODE);
    },
    addTemp() {
      this.daoChuMuBan.unshift({
        mode: this.EDITING_MODE,
        title: ''
      });
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.scrollArea) {
          Ps.destroy(this.$refs.scrollArea);
          Ps.initialize(this.$refs.scrollArea, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs.scrollArea2) {
          Ps.destroy(this.$refs.scrollArea2);
          Ps.initialize(this.$refs.scrollArea2, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs.scrollArea3) {
          Ps.destroy(this.$refs.scrollArea3);
          Ps.initialize(this.$refs.scrollArea3, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  mounted() {
    this.updateScrollbar();
    console.log(this.$refs.scrollArea);
    console.log(this.$refs);
    console.log(Ps);
    this.resData = [
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'PTNAME',
        cnFieldName: '姓名',
        pid: 1, // 基本情况
        groupNo: 1,
        fid: 1 // 个人信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'CODE',
        cnFieldName: '身份证号',
        pid: 1, // 基本情况
        groupNo: 1,
        fid: 1 // 个人信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'DISEASETYPE',
        cnFieldName: '起病类型',
        pid: 2, // 现病史
        groupNo: 1,
        fid: 1 // 个人信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'ARITIME',
        cnFieldName: '起病时间',
        pid: 2, // 现病史
        groupNo: 1,
        fid: 1 // 个人信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'patientCode',
        cnFieldName: '医院患者编号',
        pid: 1, // 基本情况
        groupNo: 1,
        fid: 2 // 诊断信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'OUT_PATIENT_MEDICAL_RECORDS',
        cnFieldName: '门诊病历号',
        pid: 1, // 基本情况
        groupNo: 1,
        fid: 2 // 诊断信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'patientCode',
        cnFieldName: '医院患者编号',
        pid: 1, // 病程情况
        groupNo: 1,
        fid: 2 // 诊断信息
      },
      {
        checked: false,
        id: 1,
        tableName: 'tc_patient_info',
        enFieldName: 'OUT_PATIENT_MEDICAL_RECORDS',
        cnFieldName: '门诊病历号',
        pid: 1, // 病程情况
        groupNo: 1,
        fid: 2 // 诊断信息
      }
    ];
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.print-template-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .print-template-modal {
    position: relative;
    margin: auto;
    top: 3%;
    width: 96%;
    min-width: 1270px;
    height: 96%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 10px 0;
      margin: 0;
      background-color:#f1f1f1;
      font-size: @large-font-size;
      height: 38px;
      box-sizing: border-box;
      .icon {
        float: right;
        margin-right:10px;
        font-size: 20px;
      }
    }
    .content {
      text-align: left;
      font-size: 0;
      height: calc(~"100% - 48px");
      background-color: #f6f7fb;
      .export-temp-area {
        font-size: @normal-font-size;
        width: 22%;
        background-color: #f6f7fb;
        height: 100%;
        float: left;
        margin-left: 1%;
        ul {
          margin: 0;
          list-style: none;
          padding:0;
        }
        .export-title {
          margin: 0;
          margin-bottom: 5px;
          background-color: #fff;
          padding: 20px 10px;
          font-size: 18px;
          height: 60px;
          box-sizing: border-box;
          .icon {
            float: right;
            margin-right:10px;
            font-size: 24px;
          }
        }
        .export-box {
          // position: relative;
          height: calc(~"100% - 65px");
          overflow: hidden;
          ul.temp-middle {
            .el-radio__label {
              font-size: 0;
            }
            li.item {
              min-height: 60px;
              background-color: #fff;
              margin-bottom: 2px;
              box-sizing: border-box;
              position: relative;
              &:hover {
                background-color: #ebebeb;
              }
              .item-left {
                display: inline-block;
                width: 50%;
                padding: 22px 10px;
                .item-title {
                  display: inline-block;
                  height: 30px;
                  padding-left: 10px;
                  transform: translateY(8px);
                }
                .el-input {
                  .el-input__inner {
                    height: 30px;
                    border: none;
                    background-color: @screen-color;
                  }
                }
              }
              .item-btns {
                width: calc(~"50% - 10px");
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                .el-button {
                  float: right;
                }
                .el-button + .el-button {
                    margin-left: 0px;
                    margin-right: 10px;
                }
              }
            }
          }

        }

      }

      .selected-area {
        font-size: @normal-font-size;
        width: 30%;
        background-color: #f6f7fb;
        height: 100%;
        float: left;
        margin-left: 1%;
        .selected-title {
          margin: 0;
          margin-bottom: 5px;
          text-align: center;
          background-color: #fff;
          padding: 10px 10px;
          font-size: 18px;
          height: 40px;
          box-sizing: border-box;
        }
        .selected-field {
          background-color: #fff;
          height: calc(~"100% - 95px");
          .el-tabs {
            height: 100%;
            .el-tabs__nav {
              width: 100%;
              .el-tabs__active-bar {
                background-color: #ff9c00;
              }
              .el-tabs__item {
                width: 50%;
                text-align: center;
                &.is-active {
                  color: #ff9c00;
                }
              }
            }
            .el-tabs__content {
              height: calc(~"100% - 57px");
              .el-tab-pane {
                height: 100%;
              }
            }
          }
          .collapse-box {
            position: relative;
            height: 100%;
            overflow: hidden;
            .tags-box {
              .el-tag {
                margin-right: 4px;
                margin-bottom: 4px;
              }
            }
          }
        }
        .reset-btn {
          margin-top: 10px;
          .el-button {
            width: 100%;
          }
        }
      }

      .choice-area {
        font-size: @normal-font-size;
        width: 44%;
        background-color: #f6f7fb;
        height: 100%;
        float: left;
        margin-left: 1%;
        .choice-title {
          margin: 0;
          margin-bottom: 5px;
          text-align: center;
          background-color: #fff;
          padding: 10px 10px;
          font-size: 18px;
          height: 40px;
          box-sizing: border-box;
        }
        .choice-field {
          background-color: #fff;
          height: calc(~"100% - 45px");
          .el-tabs {
            height: 100%;
            .el-tabs__nav {
              width: 100%;
              .el-tabs__active-bar {
                background-color: #ff9c00;
              }
              .el-tabs__item {
                width: 50%;
                text-align: center;
                &.is-active {
                  color: #ff9c00;
                }
              }
            }
            .el-tabs__content {
              height: calc(~"100% - 57px");
              .el-tab-pane {
                height: 100%;
              }
            }
          }
          .collapse-box {
            position: relative;
            height: 100%;
            overflow: hidden;
            .checkbox-box {

            }
          }
        }
      }

    }
    .footer {
      width: 100%;
      height: 10px;
      background-color: #f1f1f1;
    }
    .export-box,.collapse-box {
      position: relative;
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
}
</style>
