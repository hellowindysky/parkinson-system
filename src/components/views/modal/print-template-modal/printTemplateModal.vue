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
              <li class="item" v-for="(item,index) in daoChuMuBan" :key="index"
               :class="{'active':index===activeIndex}"
               @click="toggleTemp(index)">
                <div class="item-left">
                  <span class="item-title" v-if="item.mode===READING_MODE">
                    <span>{{item.templateName}}</span>
                  </span>
                  <span v-else>
                    <el-input v-model="item.templateName" placeholder="请输入模板名称"></el-input>
                  </span>
                </div>
                <div class="item-btns">
                  <el-button type="danger" size="small" v-if="item.mode===READING_MODE" @click.stop="removeTemplate(item.templateId)">删除</el-button>
                  <el-button type="primary" size="small" v-if="item.mode===EDITING_MODE" @click.stop="canel(index)">取消</el-button>
                  <el-button type="warning" size="small" v-if="item.mode===EDITING_MODE" @click.stop="saveTemplate(index)">保存</el-button>
                  <el-button type="warning" size="small" v-if="item.mode===READING_MODE" @click.stop="editTemplate(index)">编辑</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 中间部分 -->
        <div class="selected-area">
          <p class="selected-title">当前已选字段</p>
          <div class="selected-field">
            <el-tabs v-model="activeName_selected">

              <el-tab-pane
               v-for="(mainItem,mainIndex) in keXuanZiDuan" :key="mainIndex"
               :label="mainItem.title"
               :name="mainItem.code+''">
                <div class="collapse-box" :ref="'selected'+mainItem.code">
                  <el-collapse v-model="activeTitle_selected">
                    <el-collapse-item
                     v-for="(middleItem,middleIndex) in mainItem.category" :key="middleIndex"
                     :title="middleItem.title"
                     :name="middleItem.code+''">
                      <div class="tags-box">

                        <div class="tags-item" v-for="(subItem,subIndex) in middleItem.fieldDataP" :key="subIndex"
                         v-if="subItem.checked">
                          <el-tag
                           v-if="subItem.checked"
                           @close="tagClose(subItem,'parent')"
                           :closable="!isDisable(activeIndex)">
                            {{subItem.cnFieldName}}
                          </el-tag>
                          <div class="tagsbox-subItem">
                            <span class="turning" v-if="showTurning(subItem.fieldDataS)">∟</span>
                            <el-tag
                             v-for="(fourItem,fourIndex) in subItem.fieldDataS" :key="fourIndex"
                             v-if="fourItem.checked"
                             @close="tagClose(fourItem,'son',subItem)"
                             :closable="!isDisable(activeIndex)">
                              {{fourItem.cnFieldName}}
                            </el-tag>
                          </div>
                        </div>

                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-tab-pane>

            </el-tabs>
          </div>

          <div class="reset-btn">
            <el-button
             type="primary"
             size="large"
             @click="resetChoice"
             :disabled="isDisable(activeIndex)">重置
            </el-button>
          </div>

        </div>

        <!-- 右边部分 -->
        <div class="choice-area">
          <p class="choice-title">可选导出字段</p>
          <div class="choice-field">
            <el-tabs v-model="activeName_choice">

              <el-tab-pane
               v-for="(mainItem,mainIndex) in keXuanZiDuan" :key="mainIndex"
               :label="mainItem.title"
               :name="mainItem.code+''">
                <div class="collapse-box" :ref="'choice'+mainItem.code">
                  <el-collapse v-model="activeTitle_choice">
                    <el-collapse-item
                     v-for="(middleItem,middleIndex) in mainItem.category" :key="middleIndex"
                     :title="middleItem.title"
                     :name="middleItem.code+''">
                      <div class="checkbox-box">
                        <div class="checkbox-item" v-for="(subItem,subIndex) in middleItem.fieldDataP" :key="subIndex">
                          <el-checkbox
                           v-model="subItem.checked"
                           @change="checkboxChange(subItem, 'parent')"
                           :disabled="isDisable(activeIndex)">
                            {{subItem.cnFieldName}}
                          </el-checkbox>
                          <div class="checkbox-subItem">
                            <span class="turning" v-if="subItem.fieldDataS.length">∟</span>
                            <el-checkbox
                             v-for="(fourItem,fourIndex) in subItem.fieldDataS" :key="fourIndex"
                             v-model="fourItem.checked"
                             @change="checkboxChange(fourItem, 'son', subItem)"
                             :disabled="isDisable(activeIndex)">
                              {{fourItem.cnFieldName}}
                            </el-checkbox>
                          </div>
                        </div>
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
import Bus from 'utils/bus.js';
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import Ps from 'perfect-scrollbar';
import {deepCopy, vueCopy, pruneObj } from 'utils/helper';
// import { queryExportTemplate, operateExportTemplate, deleteExportTemplate } from 'api/patient.js';
import { queryExportTemplate, operateExportTemplate } from 'api/patient.js';
export default {
  data() {
    return {
      activeIndex: 0,
      activeName_selected: '1',
      activeName_choice: '1',
      activeTitle_selected: ['3'],
      activeTitle_choice: ['3'],
      tempNames: [],
      daoChuMuBan: [],
      keXuanZiDuan: []
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'totalExportFields'
    ]),
    exportList() {
      let types = Util.getElement('typegroupcode', 'exportTemplate', this.typeGroup).types;
      return types ? types : [];
    },
    isEditing() {
      for (let i = 0; i < this.daoChuMuBan.length; i++) {
        const element = this.daoChuMuBan[i];
        if (element.mode === this.EDITING_MODE) {
          return [true, i];
        }
      }
      return [false, ''];
    }
  },
  methods: {
    initChoiceField() {
      // 加载所有可导出字段
      // 导出字段所有类别名称（标题）的集合
      let exportList = deepCopy(this.exportList); // 分级标题
      let totalExportFields = deepCopy(this.totalExportFields);
      let exportFields_p = totalExportFields.filter((item) => { // 三级字段
        return !item.hasOwnProperty('pid');
      });
      let exportFields_s = totalExportFields.filter((item) => { // 四级字段
        return item.hasOwnProperty('pid');
      });
      let keXuanZiDuan = [];
      exportList.forEach((itemF, indexF) => {
        keXuanZiDuan[indexF] = {
          title: itemF.typeName,
          code: itemF.typeCode,
          category: []
        };
        if (itemF.childType) {
          itemF.childType.forEach((itemS, indexS) => {
            keXuanZiDuan[indexF].category[indexS] = {
              title: itemS.typeName,
              code: itemS.typeCode,
              fieldDataP: this.getWantedFields({gid: itemF.typeCode, fid: itemS.typeCode}, exportFields_p)
            };
            keXuanZiDuan[indexF].category[indexS].fieldDataP.forEach((itemT) => {
              itemT.fieldDataS = this.getWantedFields({gid: itemF.typeCode, fid: itemS.typeCode, pid: itemT.id}, exportFields_s);
            });
          });
        }
      });
      vueCopy(keXuanZiDuan, this.keXuanZiDuan);
    },
    getWantedFields(opts, arr) {
      // 从arr中得到符合opts条件的数据
      arr = Array.isArray(arr) ? arr : [];
      let fields = [];
      if (opts.hasOwnProperty('pid')) {
        fields = arr.filter((item) => {
          return item.gid === opts.gid && item.fid === opts.fid && item.pid === opts.pid;
        });
      } else {
        fields = arr.filter((item) => {
          return item.gid === opts.gid && item.fid === opts.fid;
        });
      };
      return fields;
    },
    queryTemplate() {
      // 查询所有导出模板
      queryExportTemplate().then((res) => {
        res.push(
          {
            templateId: 1,
            templateName: '张艺的模板',
            templateExportFields: [
              {
                id: 33,
                templateId: 1,
                templateName: '张艺的模板',
                exportGroupNo: 1,
                exportEnField: 'DIAGMODE',
                exportCnField: '初诊方式',
                exportTableName: 'tc_patient_info',
                exportFid: 3,
                exportGid: 1
              },
              {
                id: 34,
                templateId: 1,
                templateName: '张艺的模板',
                exportEnField: '',
                exportCnField: '初诊药物治疗',
                exportTableName: '',
                exportFid: 3,
                exportGid: 1
              },
              {
                id: 35,
                templateId: 1,
                templateName: '张艺的模板',
                exportGroupNo: 5,
                exportEnField: 'MEDICINE_NAME',
                exportCnField: '药品名',
                exportTableName: 'tc_patient_first_visit_treatment',
                exportFid: 3,
                exportGid: 1,
                exportPid: 34
              }
            ]
          }
        );
        res.forEach((item) => {
          item.mode = this.READING_MODE;
        });
        this.daoChuMuBan = res;
        this.tempNames = res.map((item) => {
          return {
            templateId: item.templateId,
            templateName: item.templateName
          };
        });
        // vueCopy(res, this.daoChuMuBan);
        this.initTemplate(this.activeIndex);
        // console.log(res, this.templateName);
      }, (error) => {
        console.error(error);
      });
    },
    initTemplate(index) {
      // 把当前模板显示出来
      if (this.daoChuMuBan.length === 0) {
        return;
      }
      let temp = this.daoChuMuBan[index].templateExportFields;
      this.keXuanZiDuan.forEach((itemF) => {
        itemF.category.forEach((itemS) => {
          itemS.fieldDataP.forEach((itemT) => {
            for (let item of temp) {
              if (item.id === itemT.id) {
                itemT.checked = true;
              }
            }
            itemT.fieldDataS.forEach((fourItem) => {
              for (let item of temp) {
                if (item.id === fourItem.id) {
                  fourItem.checked = true;
                }
              }
            });
          });
        });
      });
    },
    toggleTemp(index) {
      if (this.isEditing[0] && index !== this.isEditing[1]) {
        this.$message({
          message: '请先完成编辑中的模板',
          type: 'warning'
        });
        return;
      }
      if (this.daoChuMuBan[index].mode === this.EDITING_MODE) {
        return;
      }
      this.activeIndex = index;
      this.resetChoice();
      this.initTemplate(this.activeIndex);
    },
    isDisable(index) {
      if (this.daoChuMuBan.length === 0) {
        return true;
      }
      if (this.daoChuMuBan[index] && this.daoChuMuBan[index].mode === this.READING_MODE) {
        return true;
      }
      return false;
    },
    checkboxChange(obj, level, objP) {
      if (level === 'parent') {
        if (obj.checked === false) {
          obj.fieldDataS.forEach((item) => {
            if (item.checked) {
              item.checked = false;
            }
          });
        } else if (obj.checked === true) {
          obj.fieldDataS.forEach((item) => {
            if (item.checked === false) {
              item.checked = true;
            }
          });
        }
      } else if (level === 'son') {
        for (let item of objP.fieldDataS) {
          if (item.checked === true) {
            if (objP.checked === false) {
              objP.checked = true;
            }
            break;
          } else if (item.checked === false) {
            objP.checked = false;
            continue;
          }
        }
      }
    },
    tagClose(obj, level, objP) {
      obj.checked = false;
      if (level === 'parent') {
        if (obj.checked === false) {
          obj.fieldDataS.forEach((item) => {
            if (item.checked) {
              item.checked = false;
            }
          });
        }
      } else if (level === 'son') {
        for (let item of objP.fieldDataS) {
          if (item.checked === true) {
            if (objP.checked === false) {
              objP.checked = true;
            }
            break;
          } else if (item.checked === false) {
            objP.checked = false;
            continue;
          }
        }
      }
    },
    resetChoice() {
      this.keXuanZiDuan.forEach((itemF) => {
        itemF.category.forEach((itemS) => {
          itemS.fieldDataP.forEach((itemT) => {
            if (itemT.checked === true) {
              itemT.checked = false;
            }
            itemT.fieldDataS.forEach((fourItem) => {
              if (fourItem.checked === true) {
                fourItem.checked = false;
              }
            });
          });
        });
      });
    },
    removeTemplate(id) {
      let templateIds = [id];
      console.log(templateIds);
      this.$confirm('确定删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
      // deleteExportTemplate(templateIds).then(() => {
      //   //
      // }, (error) => {
      //   console.log(error);
      // });
    },
    saveTemplate(index) {
      let tempFields = [];
      this.keXuanZiDuan.forEach((itemF) => {
        itemF.category.forEach((itemS) => {
          itemS.fieldDataP.forEach((itemT) => {
            if (itemT.checked === true) {
              let fieldObj = {
                templateId: this.daoChuMuBan[index].templateId,
                templateName: this.daoChuMuBan[index].templateName,
                exportTableName: itemT.tableName,
                exportEnField: itemT.enFieldName,
                exportCnField: itemT.cnFieldName,
                exportFid: itemT.fid,
                exportGid: itemT.gid,
                exportGroupNo: itemT.groupNo
              };
              tempFields.push(fieldObj);
              console.log('itemT', itemT);
            }
            itemT.fieldDataS.forEach((fourItem) => {
              if (fourItem.checked === true) {
                let fieldObj = {
                  templateId: this.daoChuMuBan[index].templateId,
                  templateName: this.daoChuMuBan[index].templateName,
                  exportTableName: fourItem.tableName,
                  exportEnField: fourItem.enFieldName,
                  exportCnField: fourItem.cnFieldName,
                  exportPid: fourItem.pid,
                  exportFid: fourItem.fid,
                  exportGid: fourItem.gid,
                  exportGroupNo: fourItem.groupNo
                };
                tempFields.push(fieldObj);
                console.log('fourItem', fourItem);
              }
            });
          });
        });
      });

      if (!tempFields[0]) {
        this.$message({
          message: '请选择导出字段！！！',
          type: 'warning'
        });
        return;
      }
      if (!tempFields[0].templateName) {
        this.$message({
          message: '请填写模板名称！！！',
          type: 'warning'
        });
        return;
      }
      pruneObj(tempFields);
      // 准备提交数据
      let type = tempFields[0].templateId ? 1 : 0;
      let templateExport = {
        type: type,
        templateExportFields: tempFields
      };

      operateExportTemplate(templateExport).then(() => {
        this.queryTemplate();
      }, (error) => {
        console.error(error);
      });
    },
    editTemplate(index) {
      if (this.isEditing[0] && index !== this.isEditing[1]) {
        this.$message({
          message: '请先完成编辑中的模板',
          type: 'warning'
        });
        return;
      }
      this.activeIndex = index;
      this.resetChoice();
      this.initTemplate(index);
      this.$set(this.daoChuMuBan[index], 'mode', this.EDITING_MODE);
    },
    canel(index) {
      if (!this.daoChuMuBan[index].hasOwnProperty('templateId')) {
        this.daoChuMuBan.splice(index, 1);
        this.resetChoice();
        this.initTemplate(this.activeIndex);
        return;
      }
      this.resetChoice();
      this.initTemplate(index);
      this.$set(this.daoChuMuBan[index], 'mode', this.READING_MODE);

      // 点击取消时把模板名称恢复成原样
      this.daoChuMuBan.forEach((item, index) => {
        this.$set(item, 'templateName', this.tempNames[index].templateName);
      });
    },
    addTemp() {
      if (this.isEditing[0]) {
        this.$message({
          message: '请先完成编辑中的模板',
          type: 'warning'
        });
        return;
      }
      for (let item of this.daoChuMuBan) {
        if (!item.hasOwnProperty('templateId')) {
          this.$message({
            message: '已添加新模板',
            type: 'warning'
          });
          return;
        }
      }
      this.daoChuMuBan.unshift({
        mode: this.EDITING_MODE,
        templateName: '',
        templateExportFields: []
      });
      this.activeIndex = 0;
      this.resetChoice();
      // console.log(this.daoChuMuBan);
    },
    closeModal() {
      //
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    showTurning(fields) {
      let flag = false;
      for (let item of fields) {
        if (item.checked) {
          flag = true;
          break;
        }
      }
      return flag;
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
    this.initChoiceField();
    this.queryTemplate();
    setTimeout(() => {
      // console.log(this.keXuanZiDuan);
    }, 2000);
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
        width: 24%;
        background-color: #f6f7fb;
        height: 100%;
        float: left;
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
              cursor: pointer;
              &.active {
                background-color: #e4e4e4;
                transition-duration: 300ms;
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
              .tags-item {
                border-bottom: 1px solid #e6e6e6;
                padding: 10px 0;
                .tagsbox-subItem {
                  margin-left: 28px;
                  .el-tag {
                    margin-right: 4px;
                    margin-top: 4px;
                  }
                  .turning {
                    position: absolute;
                    font-size: 20px;
                    margin-left: -22px;
                    margin-top: -8px;
                    color: #a9aaaf;
                  }
                }
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
                border-bottom: 1px solid #e6e6e6;
                padding: 10px 0;
                .checkbox-subItem {
                  margin-left: 28px;
                  .el-checkbox {
                    margin-left: 0;
                    margin-right: 15px;
                  }
                  .turning {
                    position: absolute;
                    font-size: 20px;
                    margin-left: -22px;
                    margin-top: -8px;
                    color: #a9aaaf;
                  }
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
