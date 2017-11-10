<template lang="html">
  <div class="img-modal-wrapper" v-show="displayModal">
    <div class="img-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            记录名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{name}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input v-model="name" placeholder="请输入本次影像记录的名称"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            影像类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{getImagetype(imageType)}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-select v-model="imageType" placeholder="请选择">
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
            <span>{{checkDate}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-date-picker
              v-model="checkDate"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查编号:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{checkNum}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text"></span>
            <el-input v-model="checkNum" placeholder="请输入患者检查编号"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查设备:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{checkDevice}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="checkDevice" placeholder="请输入检查设备编号"></el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            检查结论:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{checkConclusion}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="checkConclusion" placeholder="请输入检查结论"></el-input>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">
            备注:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{remarks}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="remarks" placeholder="请输入备注信息"></el-input>
          </span>
        </div>
        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            T1 文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的 T1 文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in t1"
                @click="downloadFile(file)">
                <i class="el-icon-document icon"></i>
                <span class="file-name">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload1"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :on-error="uploadErr"
              :file-list="fileList1">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD">
                点击上传 T1 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>
        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            T2 文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的 T2 文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in t2"
                @click="downloadFile(file)">
                <i class="el-icon-document icon"></i>
                <span class="file-name">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload2"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :on-error="uploadErr"
              :file-list="fileList2">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD">
                点击上传 T2 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>
        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            T2 Flair 文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的 T2 Flair 文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in t2Flair"
                @click="downloadFile(file)">
                <i class="el-icon-document icon"></i>
                <span class="file-name">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload3"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :on-error="uploadErr"
              :file-list="fileList3">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD">
                点击上传 T2 Flair 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
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
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { baseUrl, getCommonRequest } from 'api/common.js';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      name: '',
      patientAttachmentId: '',
      imageType: '',
      checkDate: '',
      checkNum: '',
      checkDevice: '',
      checkConclusion: '',
      remarks: '',
      t1: [],
      t2: [],
      t2Flair: [],
      uploadUrl: baseUrl + '/upload/uploadAttachment',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      fileList1: [
        {
          name: 'resumable.zip',
          url: 'https://github.com/23/resumable.js/archive/master.zip'
        }
      ],
      fileList2: [],
      fileList3: [],
      header: {
        'Content-Type': 'multipart/form-data'
      },
      fileParam: getCommonRequest()
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增医学影像';
      } else {
        return '医学影像';
      }
    },
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
    getImagetype(imageType) {
      var options = this.getOptions('examType');
      var targetOption = Util.getElement('code', imageType, options);
      return targetOption.name;
    },
    cancel() {
      this.displayModal = false;
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
    },
    submit() {
      this.$refs.upload1.submit();
      this.$refs.upload2.submit();
      this.$refs.upload3.submit();
      this.displayModal = false;
    },
    removeFile(file) {
      console.log(file);
      this.updateScrollbar();
    },
    downloadFile(file) {
      console.log(file.realPath);
      // window.location.href = file.realPath;
    },
    handleRemove(file, fileList) {
      console.log(file);
      console.log(fileList);
      this.updateScrollbar();
    },
    handlePreview(file) {
      console.log(file);
      window.location.href = file.url;
    },
    showPanel(cardOperation, item) {
      this.displayModal = true;
      this.mode = cardOperation;
      console.log(item);
      if (this.mode !== this.ADD_NEW_CARD) {
        this.name = item.title ? item.title : '';
        this.patientAttachmentId = item.patientAttachmentId ? item.patientAttachmentId : '';
        this.checkDate = item.checkDate ? item.checkDate : '';
        this.imageType = item.imageType ? item.imageType : '';
        this.checkNum = item.checkNum ? item.checkNum : '';
        this.checkDevice = item.checkDevice ? item.checkDevice : '';
        this.checkConclusion = item.checkConclusion ? item.checkConclusion : '';
        this.remarks = item.remarks ? item.remarks : '';
        this.t1 = item.t1 ? item.t1 : [];
        this.t2 = item.t2 ? item.t2 : [];
        this.t2Flair = item.t2Flair ? item.t2Flair : [];
      }
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      if (response.code === 0) {
        console.log(fileList);
      } else {
        alert('文件上传出错');
      }
      // this.$refs.upload2.clearFiles();
    },
    uploadErr(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
    },
    fileChange(file, fileList) {
      console.log(file);
      console.log(fileList);
      this.updateScrollbar();
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    }
  },
  mounted() {
    Bus.$on(this.SHOW_IMG_MODAL, this.showPanel);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_IMG_MODAL);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 45px;
@field-name-width: 110px;
@long-field-name-width: 160px;

@col-id-width: 100px;
@col-time-width: 200px;
@col-amount-width: 150px;
@col-unit-width: 150px;

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
      font-size: 0;
      .seperate-line {
        border-style: none;
        border-top: 1px solid @light-gray-color;
        margin-bottom: 15px;
      }
      .field {
        display: inline-block;
        position: relative;
        padding: 5px 0;
        width: 50%;
        height: @field-height;
        box-sizing: border-box;
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
        }
      }
      .field-file {
        margin-bottom: 20px;
        transform: translateX(10px);
        .field-name {
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          width: @field-name-width;
          line-height: 20px;
          font-size: @normal-font-size;
          color: @font-color;
        }
        .field-input {
          display: block;
          position: relative;
          left: @field-name-width;
          width: 96%;
          padding-right: @field-name-width;
          box-sizing: border-box;
          font-size: @normal-font-size;
          .last-files {
            margin-bottom: 10px;
            width: 100%;
            .last-files-title {
              margin-bottom: 5px;
              height: 30px;
              line-height: 30px;
              border-radius: 5px;
              background-color: @light-font-color;
              color: #fff;
              text-align: center;
              cursor: default;
            }
            .file {
              position: relative;
              padding-left: 5px;
              height: 30px;
              line-height: 30px;
              transition: 0.2s;
              cursor: default;
              .icon {
                display: inline-block;
                width: 20px;
              }
              .file-name {
                display: inline-block;
              }
              .close-button {
                display: none;
                position: absolute;
                right: 0;
                width: 22px;
                text-align: center;
                color: @light-font-color;
                font-size: 13px;
              }
              &.editing {
                cursor: pointer;
                &:hover {
                  background-color: @screen-color;
                  .close-button {
                    display: inline-block;
                    &:hover {
                      color: @font-color;
                    }
                  }
                }
              }
            }
          }
          .upload-area {
            .el-upload {
              width: 100%;
              .el-button {
                width: 100%;
                &.el-button--text {
                  background-color: @font-color;
                  color: #fff;
                  &:disabled {
                    background-color: @gray-color;
                    cursor: not-allowed;
                  }
                }
              }
            }
            .el-upload__tip {
              line-height: normal;
              margin-top:0;
            }
            .el-upload-list {
              // max-height: 80px;
              // overflow-y: scroll;
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
