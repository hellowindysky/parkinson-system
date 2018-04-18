<template lang="html">
  <div class="neurologic-modal-wrapper">
    <div class="neurologic-modal" ref="neurologicModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            检查类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.checkType}}</span>
            <el-select v-if="mode===ADD_NEW_CARD" clearable placeholder="请选择检查类型" v-model="copyInfo.checkType"
              :class="{'warning': warningResults.checkType}" @change="updateWarning('checkType')">
              <el-option v-for="type in getOptions('neurologicExam')" :key="type.code"
                :label="type.name" :value="type.code"></el-option>
            </el-select>
            <span v-else>
              {{transform(copyInfo.checkType, 'neurologicExam')}}
            </span>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            检查时间:
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.ariseTime}}</span>
            <el-date-picker v-else
            v-model="copyInfo.ariseTime"
            placeholder="请输入检查时间"
            type="date"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            检查结果:
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.spephysicalResult}}</span>
            <el-input v-else type="textarea" placeholder="请输入检查结果" v-model="copyInfo.spephysicalResult" :maxlength="500"></el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remarks}}</span>
            <el-input v-else type="textarea" placeholder="请输入备注内容" v-model="copyInfo.remarks" :maxlength="500"></el-input>
          </span>
        </div>
        <div class="field" v-if="copyInfo.checkType===3">
          <span class="field-name">
            回拉试验:
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{transform(copyInfo.pullTest, 'positiveType')}}</span>
            <el-select v-else clearable v-model="copyInfo.pullTest">
              <el-option v-for="option in getOptions('positiveType')" :label="option.name" :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field" v-if="copyInfo.checkType===3">
          <span class="field-name">
            sitting en bloc现象:
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{transform(copyInfo.sittingBloc, 'positiveType')}}</span>
            <el-select v-else clearable v-model="copyInfo.sittingBloc">
              <el-option v-for="option in getOptions('positiveType')" :label="option.name" :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>

        <h3 class="form-title" v-if="tableMode===SON_OPEN && hasTableExisted">{{subTableTitle}}</h3>
        <div class="form-wrapper" v-if="hasTableExisted" ref="formWrapper">
          <table class="form" v-if="tableMode===FATHER_OPEN">
            <tr class="row first-row">
              <td class="col col-width-10">
                序号
              </td>
              <td class="col col-width-30">
                检查项
              </td>
              <td class="col col-width-15">
                操作
              </td>
            </tr>
            <tr class="row" v-for="(type, index) in tableTypes">
              <td class="col col-width-10">
                {{ index + 1 }}
              </td>
              <td class="col col-width-30">
                {{type.typeName}}
              </td>
              <td class="col col-width-15">
                <span class="text-button" v-if="mode===VIEW_CURRENT_CARD" @click.stop="selectSubTable(type.typeCode)">查看</span>
                <span class="text-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click.stop="selectSubTable(type.typeCode)">编辑</span>
              </td>
            </tr>
          </table>

          <table class="form" :class="{'small-font':tableMode===SON_OPEN}"
            v-if="tableMode===SON_OPEN" v-for="(group, groupIndex) in itemGroups">
            <tr class="row" v-if="group.colItems.length===0"
              v-for="row in rearrangeRows(group.rowItems)">
              <td class="col col-width-10">
                {{row[0].fieldName}}
              </td>
              <td class="col col-width-10">
                <span v-if="mode===VIEW_CURRENT_CARD && row[0].uiType===3">
                  {{transform(copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue, row[0].fieldEnumId)}}
                </span>
                <span v-else-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue}}
                </span>
                <el-input v-else-if="row[0].uiType===1" v-model="copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue"></el-input>
                <el-select v-else-if="row[0].uiType===3" v-model="copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue">
                  <el-option v-for="option in getOptions(row[0].fieldEnumId)" :label="option.name" :key="option.code" :value="option.code"></el-option>
                </el-select>
                <el-date-picker
                  v-else-if="row[0].uiType===6"
                  v-model="copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker
                  v-else-if="row[0].uiType===7"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  v-model="copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-time-select v-else-if="row[0].uiType===8" v-model="copyInfo.patientFieldCode[subTableCode][row[0].id][0].fieldValue"
                  :picker-options="{start:'00:00', end:'24:00'}"></el-time-select>
              </td>
              <td class="col col-width-10" v-if="row.length===2">
                {{row[1].fieldName}}
              </td>
              <td class="col col-width-10" v-if="row.length===2">
                <span v-if="mode===VIEW_CURRENT_CARD && row[1].uiType===3">
                  {{transform(copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue, row[1].fieldEnumId)}}
                </span>
                <span v-else-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue}}
                </span>
                <el-input v-else-if="row[1].uiType===1" v-model="copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue"></el-input>
                <el-select v-else-if="row[1].uiType===3" v-model="copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue">
                  <el-option v-for="option in getOptions(row[1].fieldEnumId)" :label="option.name" :key="option.code" :value="option.code"></el-option>
                </el-select>
                <el-date-picker
                  v-else-if="row[1].uiType===6"
                  v-model="copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker
                  v-else-if="row[1].uiType===7"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  v-model="copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-time-select v-else-if="row[1].uiType===8" v-model="copyInfo.patientFieldCode[subTableCode][row[1].id][0].fieldValue"
                  :picker-options="{start:'00:00', end:'24:00'}"></el-time-select>
              </td>
            </tr>

            <tr class="row first-row" v-if="group.anotherColItems.length>0">
              <td class="col col-width-10" :rowspan="group.anotherColItems.length>0 ? 2:1"></td>
              <td class="col col-width-10" v-for="col in group.anotherColItems" :rowspan="col.rowSpan" :colspan="col.colSpan">
                {{col.fieldName}}
              </td>
            </tr>
            <tr class="row first-row" v-if="group.colItems.length>0">
              <td class="col col-width-10" v-if="group.anotherColItems.length===0"></td>
              <td class="col col-width-10" v-if="col.rowSpan>0" v-for="col in group.colItems" :rowspan="col.rowSpan" :colspan="col.colSpan">
                {{col.fieldName}}
              </td>
            </tr>
            <tr class="row" v-for="row in group.rowItems" v-if="group.colItems.length>0">
              <td class="col col-width-10">
                {{row.fieldName}}
              </td>
              <td class="col col-width-10" v-for="col in group.colItems">
                <span v-if="mode===VIEW_CURRENT_CARD && col.uiType===3">
                  {{transform(copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue, col.fieldEnumId)}}
                </span>
                <span v-else-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue}}
                </span>
                <el-input v-else-if="col.uiType===1" v-model="copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue"></el-input>
                <el-select v-else-if="col.uiType===3" v-model="copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue"
                  placeholder="">
                  <el-option v-for="option in getOptions(col.fieldEnumId)" :label="option.name" :key="option.code" :value="option.code"></el-option>
                </el-select>
                <el-date-picker
                  v-else-if="col.uiType===6"
                  v-model="copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker
                  v-else-if="col.uiType===7"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  v-model="copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-time-select v-else-if="col.uiType===8" v-model="copyInfo.patientFieldCode[subTableCode][row.id][col.id].fieldValue"
                  :picker-options="{start:'00:00', end:'24:00'}"></el-time-select>
              </td>
            </tr>

          </table>
        </div>
      </div>
      <!-- <div class="seperate-line"></div> -->
      <span v-if="tableMode===FATHER_OPEN">
        <div class="button cancel-button" @click="cancel">取消</div>
        <div class="button edit-button" v-if="mode===VIEW_CURRENT_CARD && showEdit" @click="switchToEditingMode">编辑</div>
        <div class="button submit-button" v-else-if="mode!==VIEW_CURRENT_CARD" @click="submit">确认</div>
      </span>
      <span v-else-if="tableMode===SON_OPEN">
        <div class="button cancel-button" v-if="mode===VIEW_CURRENT_CARD" @click="closeSubTable">返回</div>
        <span v-else-if="mode!==VIEW_CURRENT_CARD && hasTableExisted">
          <div class="button reset-button" @click="initSubTableDataForTypeCode(subTableCode)">重置</div>
          <div class="button submit-button" @click="closeSubTable">完成</div>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy, deepCopy } from 'utils/helper';
import Util from 'utils/util.js';
import { addNeurologicCheck, modifyNeurologicCheck } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      lockSubmitButton: false,
      showEdit: false,

      FATHER_OPEN: 'fatherOpen',
      SON_OPEN: 'sonOpen',
      tableMode: '',

      copyInfo: {},
      copyItem: {},   //  用来缓存传递进来的数据
      subTableCode: '',
      warningResults: {
        checkType: ''
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
      'typeGroup',
      'typeField',
      'neurologicCheckTypeList'
    ]),
    hasTableExisted() {
      this.updateScrollbar();
      return this.copyInfo.checkType !== undefined &&
        this.copyInfo.checkType !== '' &&
        this.copyInfo.checkType !== 3;
    },
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增体格检查';
      } else {
        return '体格检查';
      }
    },
    subTableTitle() {
      if (this.tableMode === this.SON_OPEN) {
        let targetType = Util.getElement('typeCode', this.subTableCode, this.tableTypes);
        return targetType.typeName ? targetType.typeName : '';
      } else {
        return '';
      }
    },
    tableTypes() {
      if (!this.hasTableExisted) {
        return [];
      }
      var typeInfo = Util.getElement('typegroupcode', 'neurologicExam', this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var targetType = Util.getElement('typeCode', Number(this.copyInfo.checkType), types);
      return targetType.childType ? targetType.childType : [];
    },
    itemGroups() {
      var items = this.typeField.filter(item => {
        return Number(item.typeCode) === this.subTableCode &&
        item.typeGroupCode === 'neurologicExam';
      });
      var groups = this.filterItemsIntoGroups(items);
      var resultGroups = [];
      for (let i = 0; i < groups.length; i += 1) {
        resultGroups.push({});
        resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
        resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
        resultGroups[i].anotherColItems = groups[i].filter(item => item.fieldType === 2);
      }
      return resultGroups;
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.mode = cardOperation;
      this.showEdit = showEdit;

      this.tableMode = this.FATHER_OPEN;
      this.initCopyInfo();
      this.copyItem = item;
      if (this.copyItem.checkType) {
        this.copyItem.checkType = Number(this.copyItem.checkType);
      }
      vueCopy(this.copyItem, this.copyInfo);

      this.$nextTick(() => {
        this.clearWarning();
      });
      this.updateScrollbar();
    },
    initCopyInfo() {
      this.copyInfo = {};
      this.$set(this.copyInfo, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.copyInfo, 'patientId', this.$route.params.id);
      this.$set(this.copyInfo, 'checkType', '');
      this.$set(this.copyInfo, 'ariseTime', '');
      this.$set(this.copyInfo, 'spephysicalResult', '');
      this.$set(this.copyInfo, 'remarks', '');

      this.$set(this.copyInfo, 'pullTest', '');
      this.$set(this.copyInfo, 'sittingBloc', '');

      this.initSubTableData();
    },
    initSubTableData() {
      this.$set(this.copyInfo, 'patientFieldCode', {});

      for (let type of this.tableTypes) {
        let typeCode = type.typeCode;
        this.initSubTableDataForTypeCode(typeCode);
      }
    },
    initSubTableDataForTypeCode(typeCode) {
      this.$set(this.copyInfo.patientFieldCode, typeCode, {});

      let items = this.typeField.filter(item => {
        return Number(item.typeCode) === typeCode &&
        item.typeGroupCode === 'neurologicExam';
      });
      let groups = this.filterItemsIntoGroups(items);
      let resultGroups = [];
      for (let i = 0; i < groups.length; i += 1) {
        resultGroups.push({});
        resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
        resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
      }

      for (let group of resultGroups) {
        for (let rowItem of group.rowItems) {
          var rowItemCode = rowItem.id;
          this.$set(this.copyInfo.patientFieldCode[typeCode], rowItemCode, {});

          let colItems = group.colItems;
          if (colItems.length === 0) {
            // 特殊情况：如果没有列，则新建一个code为 0 的虚拟列
            colItems = [{id: 0}];
          }

          for (let colItem of colItems) {
            var colItemCode = colItem.id;
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode], colItemCode, {});

            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeGroupCode', 'elecExam');
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeCode', typeCode);
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'rowFieldId', rowItemCode);
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'columnFieldId', colItemCode);
            this.$set(this.copyInfo.patientFieldCode[typeCode][rowItemCode][colItemCode], 'fieldValue', '');
          }
        }
      }
    },
    selectSubTable(code) {
      this.subTableCode = code;
      this.tableMode = this.SON_OPEN;
      this.updateScrollbar();
      // console.log(this.itemGroups);
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.updateWarning('checkType');
      if (this.warningResults.checkType !== '') {
        this.lockSubmitButton = false;
        return;
      }

      let submitData = deepCopy(this.copyInfo);
      submitData.typeGroupCode = 'neurologicExam';
      submitData.ariseTime = Util.simplifyDate(submitData.ariseTime);

      submitData.patientFieldCode = {};
      for (let type of this.tableTypes) {
        submitData.patientFieldCode[type.typeCode] = deepCopy(this.copyInfo.patientFieldCode[type.typeCode]);
      }
      if (submitData.checkType !== 3) {
        delete submitData.pullTest;
        delete submitData.sittingBloc;
      } else {
        delete submitData.patientFieldCode;
      }

      if (this.mode === this.EDIT_CURRENT_CARD) {
        modifyNeurologicCheck(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);

      } else if (this.mode === this.ADD_NEW_CARD) {
        delete submitData.patientSpephysicalId;
        addNeurologicCheck(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    cancel() {
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    closeSubTable() {
      this.tableMode = this.FATHER_OPEN;
      this.updateScrollbar();
      this.$refs.neurologicModal.scrollTop = 0;
      // this.$refs.formWrapper.scrollTop = 0;
    },
    getOptions(fieldName) {
      var options = [];
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    rearrangeRows(items) {
      // 因为有的子表格没有明确的列信息，只有行信息，而且每一行只有字段名字和字段值
      // 因此需要重新排列此表格，一排有4列，分别为字段1的名字，字段1的值，字段2的名字，字段2的值
      var newArray = [];
      var subArray = [];
      var length = items.length;
      for (var i = 0; i < length; i++) {
        subArray.push(items[i]);
        if (i % 2 === 1 || i === length - 1) {
          newArray.push(subArray);
          subArray = [];
        }
      }
      return newArray;
    },
    filterItemsIntoGroups(items) {
      // 根据 item 的 groupNo 属性，装到不同的子数组里面，最后返回最外层的数组
      var groups = [];
      var hasSameGroupNumberBefore = false;

      for (let item of items) {
        hasSameGroupNumberBefore = false;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i][0].groupNo === item.groupNo) {
            hasSameGroupNumberBefore = true;
            groups[i].push(item);
          }
        }
        if (!hasSameGroupNumberBefore) {
          let newGroup = [];
          newGroup.push(item);
          groups.push(newGroup);
        }
      }
      return groups;
    },
    updateWarning(fieldName) {
      if (this.copyInfo[fieldName] === undefined || this.copyInfo[fieldName] === '') {
        this.$set(this.warningResults, fieldName, '必填项');
      } else {
        this.$set(this.warningResults, fieldName, '');
      }
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.formWrapper) {
          Ps.destroy(this.$refs.formWrapper);
          Ps.initialize(this.$refs.formWrapper, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs.neurologicModal) {
          Ps.destroy(this.$refs.neurologicModal);
          Ps.initialize(this.$refs.neurologicModal, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_NEUROLOGIC_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NEUROLOGIC_MODAL, this.showPanel);
  },
  watch: {
    tableTypes() {
      this.initSubTableData();
      vueCopy(this.copyItem, this.copyInfo);
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
@field-name-width: 125px;

.neurologic-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .neurologic-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 700px;
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
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        vertical-align: top;
        text-align: left;
        transform: translateX(20px);
        &.whole-line {
          width: 100%;
          .field-input {
            width: calc(~"96% - @{field-name-width}");
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
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-input {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: 25px;
          font-size: @normal-font-size;
          color: @light-font-color;
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
          .el-textarea {
            margin-bottom: 15px;
            transform: translateY(-3px);
            .el-textarea__inner {
              border: none;
              background-color: @screen-color;
            }
            &.warning {
              border: 1px solid red;
            }
          }
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .warning .el-input__inner {
            border: 1px solid red;
          }
        }
      }
      .form-title {
        margin: 0;
        padding: 0;
        line-height: 40px;
        font-size: @normal-font-size;
        color: @font-color;
        text-align: center;
      }
      .form-wrapper {
        position: relative;
        margin-top: 5px;
        max-height: 320px;
        height: auto;
        width: 100%;
        padding-bottom: 5px;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid @inverse-font-color;
        .form {
          position: relative;
          margin-bottom: 5px;
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          font-size: 14px;
          &.small-font {
            font-size: @small-font-size !important;
          }
          .row {
            height: 40px;
            &.first-row {
              background-color: @screen-color;
              height: 35px;
              .col {
                padding: 0 3px;
              }
            }
            .col {
              text-align: center;
              padding: 0;
              margin: 0;
              border: 1px solid @light-gray-color;
              .text-button {
                margin: 0 5px;
                color: @theme-color;
                line-height: 20px;
                border-bottom: 1px solid @theme-color;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
                }
              }
              &.col-width-5 {
                width: 5%;
                min-width: 40px;
              }
              &.col-width-10 {
                width: 10%;
                min-width: 60px;
              }
              &.col-width-15 {
                width: 15%;
              }
              &.col-width-20 {
                width: 20%;
              }
              &.col-width-25 {
                width: 25%;
              }
              &.col-width-30 {
                width: 30%;
              }
              &.col-width-18 {
                width: 18%;
              }
              &.col-width-7 {
                width: 7%;
              }
              .required-mark {
                color: red;
                font-size: 20px;
                vertical-align: middle;
              }
              .el-input {
                margin-left: 2%;
                width: 98%;
                .el-input__inner {
                  height: 30px;
                  border: none;
                  background-color: rgba(0, 0, 0, 0);
                  text-align: center;
                }
              }
              .warning .el-input__inner {
                border: 1px solid red;
              }
            }
          }
        }
        .ps__scrollbar-y-rail {
          position: absolute;
          padding: 0;
          top: 0;
          width: 10px;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s;
          .ps__scrollbar-y {
            position: relative;
            border-radius: 0;
            background-color: #aaa;
          }
        }
        .ps__scrollbar-x-rail {
          position: absolute;
          padding: 0;
          bottom: 0;
          height: 10px;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s;
          .ps__scrollbar-x {
            position: relative;
            height: 10px;
            border-radius: 0;
            background-color: #aaa;
          }
        }
        &:hover {
          .ps__scrollbar-y-rail, .ps__scrollbar-x-rail {
            opacity: 0.6;
          }
        }
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
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
      &.reset-button {
        background-color: @font-color;
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
