<template lang="html">
  <div class="print-template-modal-wrapper">
    <div class="print-template-modal">
      <h3 class="title">设置打印模板 <i class="icon el-icon-circle-close" @click="closeModal"></i></h3>
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

              <el-tab-pane
               v-for="(mainItem,mainIndex) in keXuanZiDuan" :key="mainIndex"
               :label="mainItem.label"
               :name="mainItem.name+''">
                <div class="collapse-box" :ref="'selected'+mainItem.name">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item
                     v-for="(middleItem,middleIndex) in mainItem.category" :key="middleIndex"
                     :title="middleItem.title"
                     :name="middleItem.name+''">
                      <div class="tags-box">

                        <el-tag
                         v-for="(subItem,subIndex) in middleItem.types" :key="subIndex"
                         v-if="subItem.checked"
                         @close="tagClose(subItem)"
                         :closable="true">
                          {{subItem.cnFieldName}}
                        </el-tag>

                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane label="个人信息" :name="1+''">
                <div class="collapse-box" ref="scrollArea2">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本情况" :name="3+''">
                      <div class="tags-box">
                        <el-tag v-for="(item,index) in yiXuanZiDuanGeRen"
                         :key="index"
                         :closable="true">
                          {{item.name}}
                        </el-tag>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item title="现病史" :name="4+''">

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

              </el-tab-pane> -->
            </el-tabs>
          </div>

          <div class="reset-btn">
            <el-button type="primary" size="large" @click="reset">重置</el-button>
          </div>

        </div>

        <!-- 右边部分 -->
        <div class="choice-area">
          <p class="choice-title">可选导出字段</p>
          <div class="choice-field">
            <el-tabs v-model="activeName">

              <el-tab-pane
               v-for="(mainItem,mainIndex) in exportList" :key="mainIndex"
               :label="mainItem.typeName"
               :name="mainItem.typeCode+''">
                <div class="collapse-box" :ref="'choice'+mainItem.typeCode">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item
                     v-for="(middleItem,middleIndex) in mainItem.childType?mainItem.childType:[]" :key="middleIndex"
                     :title="middleItem.typeName"
                     :name="middleItem.typeCode+''">
                      <div class="checkbox-box">
                        <div class="checkbox-item" v-for="(subItem,subIndex) in getFieldsGroup(mainItem.typeCode,middleItem.typeCode)" :key="subIndex">
                          <el-checkbox
                           v-model="subItem.checked">
                            {{subItem.cnFieldName}}
                          </el-checkbox>
                          <div class="checkbox-subItem">
                            <el-checkbox
                             v-for="(fourItem,fourIndex) in getFieldsGroup(mainItem.typeCode,middleItem.typeCode,true,subItem.id)" :key="fourIndex"
                             v-model="fourItem.checked">
                              {{fourItem.cnFieldName}}
                            </el-checkbox>
                          </div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>

              <!-- <el-tab-pane
               v-for="(mainItem,mainIndex) in keXuanZiDuan" :key="mainIndex"
               :label="mainItem.label"
               :name="mainItem.name+''">
                <div class="collapse-box" :ref="'choice'+mainItem.name">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item
                     v-for="(middleItem,middleIndex) in mainItem.category" :key="middleIndex"
                     :title="middleItem.title"
                     :name="middleItem.name+''">
                      <div class="checkbox-box">
                        <el-checkbox
                         v-for="(subItem,subIndex) in middleItem.types" :key="subIndex"
                         v-model="subItem.checked">
                          {{subItem.cnFieldName}}
                        </el-checkbox>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane> -->

            </el-tabs>
          </div>

        </div>
      </div>

      <div class="footer"></div>

    </div>
  </div>
</template>

<script>
import Bus from 'utils/bus.js';
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Ps from 'perfect-scrollbar';
import { vueCopy } from 'utils/helper';
export default {
  data() {
    return {
      activeName: '1',
      activeNames: ['3', '4'],
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
      keXuanZiDuan: [],
      keXuan3: [],
      keXuan4: []
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'exportFields'
    ]),
    exportList() {
      let types = Util.getElement('typegroupcode', 'exportTemplate', this.typeGroup).types;
      return types ? types : [];
    }
  },
  methods: {
    initChoiceField2() {
      // console.log(new Date().getTime());
      // 导出字段所有类别名称（标题）的集合
      let exportList = this.exportList ? this.exportList : [];

      var handleTypes = (arr, code) => {
        arr = Array.isArray(arr) ? arr : [];
        return arr.map((item) => {
          return {
            title: item.typeName,
            name: item.typeCode,
            types: this.exportFields.filter((resItem) => {
              return code === resItem.gid && item.typeCode === resItem.fid;
            }).length > 0 ? this.exportFields.filter((resItem) => {
              return code === resItem.gid && item.typeCode === resItem.fid;
            })[0].types : []
          };
        });
      };

      let keXuanZiDuan = exportList.map((item) => {
        return {
          label: item.typeName,
          name: item.typeCode,
          category: handleTypes(item.childType, item.typeCode)
        };
      });

      vueCopy(keXuanZiDuan, this.keXuanZiDuan);
      console.log(this.keXuanZiDuan);
      // console.log(new Date().getTime());
    },
    // initChoiceField() {
    //   this.keXuanZiDuan = [
    //     {
    //       label: '个人信息',
    //       name: 'first',
    //       category: [
    //         {
    //           title: '基本情况',
    //           name: '1',
    //           fieldData: gerenjibenqingkuang
    //         },
    //         {
    //           title: '现病史',
    //           name: '2',
    //           fieldData: gerenxianbingshi
    //         }
    //       ]
    //     },
    //     {
    //       label: '诊断信息',
    //       name: 'second',
    //       category: [
    //         {
    //           title: '基本情况',
    //           name: '1',
    //           fieldData: zhenduanjibenqingkuang
    //         },
    //         {
    //           title: '病程情况',
    //           name: '2',
    //           fieldData: zhenduanbingcheng
    //         }
    //       ]
    //     }
    //   ];
    // },
    getFieldsGroup(gid, fid, hasPid, pid) {
      let fieldsItem = this.exportFields.filter((item) => {
        return item.gid === gid && item.fid === fid;
      });
      let fields = fieldsItem[0] ? fieldsItem[0].fields : [];

      console.log(fields);

      if (hasPid) {
        fields = fields.filter((item) => {
          return item.pid === pid;
        });
      } else {
        fields = fields.filter((item) => {
          return !item.hasOwnProperty('pid');
        });
        // this.keXuan3 = fields;
        vueCopy(fields, this.keXuan3);
      };
      return fields;
    },
    tagClose(item) {
      item.checked = false;
      // console.log(this.keXuanZiDuan);
    },
    reset() {
      this.keXuanZiDuan.forEach((item) => {
        if (item.category) {
          item.category.forEach((middItem) => {
            if (middItem.types) {
              middItem.types.forEach((subItem) => {
                if (subItem.checked) {
                  subItem.checked = false;
                }
              });
            }
          });
        }
      });
    },
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
    closeModal() {
      //
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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

        let scrollbox = Object.keys(this.$refs);
        scrollbox.forEach((item) => {
          if (item !== 'scrollArea') {
            Ps.destroy(this.$refs[item][0]);
            Ps.initialize(this.$refs[item][0], {
              wheelSpeed: 1,
              minScrollbarLength: 40
            });
          }
        });

      });
    }
  },
  mounted() {
    this.updateScrollbar();
    console.log(this.exportList);
    console.log(this.exportFields);
    // this.initChoiceField();
    // this.initChoiceField2();
    console.log(this.keXuan3);
    // setTimeout(() => {
    //   console.log(this.keXuan3);
    // }, 2000);
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
    min-width: 1030px;
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
        &:hover {
          color: lighten(@font-color, 20%);
          cursor: pointer;
        }
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
            &:hover {
              color: lighten(@font-color, 20%);
              cursor: pointer;
            }
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
                box-sizing: border-box;
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
              .checkbox-item {
                .checkbox-subItem {
                  margin-left: 28px;
                }
              }
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
