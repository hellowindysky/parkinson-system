<template lang="html">
  <div class="img-modal-wrapper" v-show="displayModal">
    <div class="img-modal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            记录名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下影像名称</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input placeholder="请输入本次影像记录的名称"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            影像类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下影像类型</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in getOptions('examType')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下检查时间</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查编号:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下检查编号</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input placeholder="请输入患者检查编号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查设备:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下设备编号</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input placeholder="请输入检查设备编号"></el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            检查结论:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下检查结论</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input placeholder="请输入检查结论"></el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备注:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>view状态下备注</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input placeholder="请输入备注信息"></el-input>
          </span>
        </div>
        <hr>
        <div class="field-file">
          <span class="field-name">
            T1文件:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="header"
              ref="upload"
              :disabled="mode == VIEW_CURRENT_CARD ? true : false"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="fileChange"
              :on-success="uploadSuccess"
              :on-error="uploadErr"
              :file-list="fileList1">
              <el-button slot="trigger" size="small" type="text" :class="{'btnDisabled': mode ==VIEW_CURRENT_CARD ? true : false}">点击上传T1压缩文件/源文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </span>
        </div>
        <div class="field-file">
          <span class="field-name">
            T2文件:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              ref="upload2"
              :disabled="mode == VIEW_CURRENT_CARD ? true : false"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList2">
              <el-button size="small" type="text" :class="{'btnDisabled': mode ==VIEW_CURRENT_CARD ? true : false}">点击上传T2压缩文件/源文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </span>
        </div>
        <div class="field-file">
          <span class="field-name">
            T2Flair文件:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span class="warning-text"></span>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              ref="upload3"
              :disabled="mode == VIEW_CURRENT_CARD ? true : false"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList3">
              <el-button size="small" type="text " :class="{'btnDisabled': mode ==VIEW_CURRENT_CARD ? true : false}">点击上传T2Flair压缩文件/源文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </span>
        </div>
      </div>
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-show="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-show="mode===VIEW_CURRENT_CARD && canEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
// import { baseUrl, encapsulatePromise, getCommonRequest } from 'api/common.js';
import { baseUrl, getCommonRequest } from 'api/common.js';

export default {
  data() {
    return {
      displayModal: false,
      title: '',
      mode: '',
      uploadUrl: baseUrl + '/fileUpload/uploadPatientAttachment',
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value: '',
      value1: '',
      fileList1: [],
      fileList2: [],
      fileList3: [],
      header: {
        'Content-Type': 'multipart/form-data'
      },
      fileParam: getCommonRequest(),
      ImgTypeData: {}
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'medicineTemplateGroups'
    ]),
    canEdit() {
      if (this.$route.matched.some(record => record.meta.myPatients)) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    getOptions(fieldName) {
      var options = [];
      var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
      types = types ? types : [];
      for (let type of types) {
        options.push({
          name: type.typeName,
          code: type.typeCode
        });
      };
      return options;
    },
    cancel() {
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    submit() {
      // let submitData = this.ImgTypeData;

    },
    submitUpload() {
      this.$refs.upload.submit();
      // encapsulatePromise(this.uploadUrl, this.fileParam).then(function(res) {
      //   console.log(res);
      // }, function(err) {
      //   console.log(err);
      // });
      // this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file);
      console.log(fileList);
      this.fileList1 = fileList;
      console.log(this.fileList1);
    },
    handlePreview(file) {
      console.log(file);
      console.log(this.fileList1);
    },
    showPanel(cardOperation, item) {
      this.displayModal = true;
      this.mode = cardOperation;
      console.log(item);
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
    },
    uploadErr(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
    },
    fileChange(file, fileList) {
      console.log(file);
      console.log(fileList);
      this.fileList1 = fileList;
      console.log(this.fileList1);
      console.log(this.$refs.upload);
    }
  },
  mounted() {
    Bus.$on(this.SHOW_IMG_MODAL, this.showPanel);
    // console.log(this.medicineTemplateGroups);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 110px;
@long-field-name-width: 160px;

@col-id-width: 100px;
@col-time-width: 200px;
@col-amount-width: 150px;
@col-unit-width: 150px;

.btnDisabled {
  background-color: lightgray !important;
  cursor: not-allowed;
}

.img-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .img-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 660px;
    max-height: 94%;
    background-color: @background-color;
    overflow: hidden;
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .content {
      text-align: left;
      hr {
        border-style: none;
        border-top:1px solid #e6e6e6;
      }
      .field {
        padding: 5px 0;
        text-align: left;
        display: inline-block;
        position: relative;
        width: 49%;
        height: @field-height;
        text-align: left;
        transform: translateX(10px); // 这一行是为了修补视觉上的偏移
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
          // &.long-field-name {
          //   width: @long-field-name-width;
          // }
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
          // &.long-field-name {
          //   left: @long-field-name-width;
          // }
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
          // .el-textarea {
          //   vertical-align: middle;
          //   transform: translateY(5px);
          //   .el-textarea__inner {
          //     border: none;
          //     background-color: @screen-color;
          //   }
          // }
          // .el-select {
          //   width: 100%;
          // }
          // .el-date-editor {
          //   width: 100%;
          // }
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
          .upload-demo {
            .el-upload {
              width: 100%;
              .el-button {
                width: 100%;
                &.el-button--text {
                  background-color:@font-color;
                  color:#fff;
                }
              }
            }
            .el-upload__tip {
              line-height: normal;
              margin-top:0;
            }
          }
        }
      }
      .field-file {
        display: flex;
        transform: translateX(10px);
        padding-right:24px;
        margin-bottom:10px;
        .field-name {
          flex:2;
        }
        .field-input {
          flex:10;
          .upload-demo {
            .el-upload {
              width: 100%;
              .el-button {
                width: 100%;
                &.el-button--text {
                  background-color:@font-color;
                  color:#fff;
                  &:disabled {
                    background-color:lightgray;
                    cursor:not-allowed;
                  }
                }
              }
            }
            .el-upload__tip {
              line-height: normal;
              margin-top:0;
            }
            .el-upload-list {
              max-height: 80px;
              overflow-y: scroll;
            }
          }
        }
      }
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
      &.btn-margin {
        margin-top: 30px;
      }
    }
  }

}

</style>
