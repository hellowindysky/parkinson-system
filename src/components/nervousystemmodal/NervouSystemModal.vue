<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>

      <div class="field">
        <span class="field-name">
          检查类型&nbsp;:
        </span>
        <span class="field-input">
          <el-select v-if="mode===ADD_MODE" placeholder="请选择检查类型" v-model="item['spephysicalInfo']">
               <el-option v-for="spephyItem in spephysicalType" :key="spephyItem.spephysicalInfo" :label="spephyItem.spephysicalName" :value="spephyItem.spephysicalInfo"></el-option>
          </el-select>
          <span v-if="mode===MODIFY_MODE">{{getSpephyName(item['spephysicalInfo'])}}</span>
        </span>
      </div>

      <div class="field">
        <span class="field-name">
          检查时间&nbsp;:
        </span>
        <span class="field-input">
          <el-date-picker v-model="item['ariseTime']" type="date" format="yyyy-MM-dd"></el-date-picker>
        </span>
      </div>
      <div class="field" v-if="showItem['spephysicalResult'] || mode===ADD_MODE">
        <span class="field-name">
          检查结果&nbsp;:
        </span>
        <span class="field-input">
          <el-input v-model="item['spephysicalResult']"></el-input>
        </span>
      </div>
      <div class="field" v-if="showItem['remarks'] || mode===ADD_MODE">
        <span class="field-name">
          备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注&nbsp;:
        </span>
        <span class="field-input">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="item['remarks']"></el-input>
        </span>
      </div>

      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import { vueCopy } from 'utils/helper';
import { deepCopy } from 'utils/helper';
import Util from 'utils/util.js';
import { modifyNervouSystem, addNervouSystem } from 'api/patient.js';

import { isEmptyObject } from 'utils/helper.js';

export default {
  data() {
    return {
      displayModal: false,
      ADD_MODE: 'add',
      MODIFY_MODE: 'modify',
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      title: '',
      item: {},
      showItem: {},
      warningResults: {},
      spephysicalType: []
    };
  },
  computed: {
    ...mapGetters([
      'neurologicCheckTypeList'
    ])
  },
  methods: {
    getSpephyName(code) {
      for (let key in this.spephysicalType) {
        let sonData = this.spephysicalType[key];
        for (let sonkey in sonData) {
          if (sonkey === 'spephysicalInfo') {
            if (code === sonData[sonkey]) {
              return sonData['spephysicalName'];
            }
          }
        }
      }
    },
    showPanel(title, item) {
      this.displayModal = true;
      // console.log(item);
      // 通过检查 item 参数是否为空对象 {}，来决定提交时是新增记录，还是修改记录
      if (isEmptyObject(item)) {
        this.mode = this.ADD_MODE;
        // 如果是新增卡片那么需要造一个对象
        this.$set(this.item, 'ariseTime', '');
        this.$set(this.item, 'patientCaseId', this.$route.params.caseId);
        this.$set(this.item, 'patientId', this.$route.params.id);
        this.$set(this.item, 'remarks', '');
        this.$set(this.item, 'spephysicalInfo', '');
        this.$set(this.item, 'spephysicalResult', '');
      } else {
        this.mode = this.MODIFY_MODE;
        // 如果是修改卡片内容，那么直接渲染传进来的数据
        vueCopy(item, this.item);
        vueCopy(item, this.showItem);
      }
      this.title = title;
      // this.$nextTick(() => {
      //   this.clearWarning();
      // });
      // 处理一下检查类型
      let typeDiction = deepCopy(this.neurologicCheckTypeList);
      for (let j = 0; j < typeDiction.length; j++) {
        this.$set(this.spephysicalType, j, {});
        for (let key in typeDiction[j]) {
          if (key === 'id') {
            this.$set(this.spephysicalType[j], 'spephysicalInfo', typeDiction[j][key]);
          } else if (key === 'spephysicalName') {
            this.$set(this.spephysicalType[j], 'spephysicalName', typeDiction[j][key]);
          }
        }
      }
    },
    submit() {
      let submitData = deepCopy(this.item);
      submitData.ariseTime = Util.simplifyDate(submitData.ariseTime);
      if (this.mode === this.MODIFY_MODE) {
        // 修改的状态
        modifyNervouSystem(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        });
      } else if (this.mode === this.ADD_MODE) {
        // 新增的状态
        delete submitData.patientSpephysicalId;
        addNervouSystem(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
        });
      }
    },
    updateAndClose() {
      this.displayModal = false;
    },
    cancel() {
      this.displayModal = false;
    },
    initItem() {
      // 遍历当前的 template，对其中的每个 field，检查 this.item 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化
      for (let field of this.template) {
        let name = field.fieldName;
        if (this.item[name] === undefined) {
          this.$set(this.item, name, '');
        }
      }
    },
    getWarningText(fieldName) {
      var warningResult = this.warningResults[fieldName];
      return warningResult ? warningResult : '';
    },
    clearWarning() {
      for (let key in this.warningResults) {
        this.warningResults[key] = null;
      }
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
    }
  },
  mounted() {
    Bus.$on(this.SHOW_NERVOU_SYSTEM_MODAL, this.showPanel);
  },
  watch: {
    item: {
      handler: function(newVal) {
        if (newVal) {
          // console.log(newVal);
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_NERVOU_SYSTEM_MODAL, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 125px;

.modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 10%;
    width: 600px;
    background-color: @background-color;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      padding: 10px 0;
      text-align: left;
      display: inline-block;
      position: relative;
      width: 100%;
      height: @field-height;
      text-align: left;
      .field-name {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: @field-name-width;
        line-height: @field-height;
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
        position: absolute;
        top: 0;
        left: @field-name-width;
        right: 2%;
        line-height: @field-height;
        font-size: @normal-font-size;
        color: @light-font-color;
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
  }
}
</style>
