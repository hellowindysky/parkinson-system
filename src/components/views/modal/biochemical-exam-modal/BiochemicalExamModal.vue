<template lang="html">
  <div class="biochemical-modal-wrapper">
    <div class="biochemical-modal" ref="biochemicalModal">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field">
          <span class="field-name">
            检查名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.bioexamId}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{getFieldValue(copyInfo.bioexamId, 'bioexamName')}}</span>
            <el-select v-else :class="{'warning': warningResults.bioexamId}" placeholder="请选择检查名称" v-model="copyInfo.bioexamId"
              @change="changeBioexam" :disabled="mode===EDIT_CURRENT_CARD">
              <el-option v-for="bioexItem in bioexamTypeList" :key="bioexItem.bioexamId"
                :label="bioexItem.examName" :value="bioexItem.id" ></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            检查时间:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span class="warning-text">{{warningResults.checkDate}}</span>
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.checkDate}}</span>
            <el-date-picker v-else type="datetime" format="yyyy-MM-dd HH:mm"
            :class="{'warning': warningResults.checkDate}"
            @change="updateWarning('checkDate')"
            placeholder="请输入检查时间"
            v-model="copyInfo.checkDate"
            :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            标本编号:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <!-- <span class="warning-text">{{warningResults.bloodCode}}</span> -->
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.bloodCode}}</span>
            <el-input v-else placeholder="请输入血液标本编号" v-model="copyInfo.bloodCode"></el-input>
          </span>
        </div>
        <div class="field" v-if="copyInfo.bioexamId === 27">
          <span class="field-name">
            基因突变:
            <span class="required-mark"></span>
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{isHaveGeneMutation ? '有' : '无'}}</span>
            <el-select v-else placeholder="请选择是否有基因突变" v-model="isHaveGeneMutation" @change="geneMutationCheckedList = []">
              <el-option :label="'有'" :value="true"></el-option>
              <el-option :label="'无'" :value="false"></el-option>
            </el-select>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            实验结果:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.projectResults}}</span>
            <el-input v-else
             placeholder="请输入实验结果"
             v-model="copyInfo.projectResults"
             :rows="2"
             :maxlength="500"
             :class="{'warning': warningResults.projectResults}"
             @change="updateWarning('projectResults')"
             type="textarea">
            </el-input>
            <span class="warning-text textarea-warning-text">{{warningResults.projectResults}}</span>
          </span>
        </div>

        <div class="field-file whole-line">
          <span class="field-name">
            附件上传:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的附件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in other">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, other, newOther)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload4"
              name="attachment"
              :disabled="mode===VIEW_CURRENT_CARD"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleOtherRemove"
              :on-success="uploadOtherSuccess"
              :on-error="uploadErr"
              :before-upload="beforeUpload">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传附件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>

        <div class="field whole-line">
          <span class="field-name">
            备注:
          </span>
          <span class="field-input">
            <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.remarks}}</span>
            <el-input v-else
             placeholder="请输入备注"
             v-model="copyInfo.remarks"
             :rows="2"
             :maxlength="500"
             type="textarea">
            </el-input>
          </span>
        </div>

        <div class="form-wrapper" ref="formWrapper" v-if="copyInfo.bioexamId !== 27">
          <table class="form">
            <tr class="row first-row">
              <td class="col col-id">
                序号
              </td>
              <td class="col col-name">
                项目名称
              </td>
              <td class="col col-english">
                英文缩写
              </td>
              <td class="col col-result">
                检查结果
              </td>
              <td class="col col-unit">
                单位名称
              </td>
              <td class="col col-range">
                参考范围
              </td>
              <td class="col col-clinical">
                判断意义
              </td>
              <td class="col col-remarks">
                备注
              </td>
            </tr>
            <tr v-for="(item, index) in targetBioexam" class="row">
              <td class="col col-id">{{index + 1}}</td>
              <td class="col col-name">
                {{item.projectName}}
                <span class="required-mark" v-show="copyInfo.bioexamId===12&&checkRequired(item.id)">*</span>
              </td>
              <td class="col col-english">
                {{item.englishAbbreviation}}
              </td>
              <td class="col col-result">
                <span class="warning-text" v-if="warningResults.bioexamResult[index].result">
                  {{warningResults.bioexamResult[index].result}}
                </span>
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{copyInfo.bioexamResult[index].result}}
                </span>
                <span v-if="mode===VIEW_CURRENT_CARD" class="iconfont" :class="getComparisonIcon(copyInfo.bioexamResult[index].result, item.referenceRanges)"></span>
                <el-input v-else v-model="copyInfo.bioexamResult[index].result"
                 :class="{'warning': warningResults.bioexamResult[index].result}"
                 @change="updateWarning('bioexamResult', index, item.id, item.regularExpression, item.message)"
                 placeholder="请输入检查结果" :maxlength="500"></el-input>
              </td>
              <td class="col col-unit">
                {{item.projectUnit}}
              </td>
              <td class="col col-range">
                {{item.referenceRanges}}
              </td>
              <td class="col col-clinical">
                <span v-if="mode===VIEW_CURRENT_CARD">
                  {{transform(copyInfo.bioexamResult[index].isReference, 'clinicSignificance')}}
                </span>
                <el-select v-else placeholder="请选择" v-model="copyInfo.bioexamResult[index].isReference">
                  <el-option v-for="item in getOptions('clinicSignificance')" :key="item.code"
                   :label="item.name"
                   :value="item.code">
                  </el-option>
                </el-select>
              </td>
              <td class="col col-remarks">
                <span v-if="mode===VIEW_CURRENT_CARD">{{copyInfo.bioexamResult[index].remarks}}</span>
                <el-input v-else v-model="copyInfo.bioexamResult[index].remarks"
                  placeholder="请输入备注" :maxlength="500"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <el-checkbox-group v-model="geneMutationCheckedList">
          <div class="form-wrapper" ref="formWrapper" v-if="copyInfo.bioexamId === 27 && isHaveGeneMutation">
            <table class="form">
              <tr class="row first-row">
                <td class="col">
                </td>
                <td class="col">
                  基因
                </td>
                <td class="col">
                  位点
                </td>
              </tr>
              <tr v-for="(item, index) in geneMutationList" class="row">
                <td class="col">
                  <el-checkbox :label="item.id" :disabled="mode===VIEW_CURRENT_CARD"><span></span></el-checkbox>
                </td>
                <td class="col">{{item.gene}}</td>
                <td class="col">{{item.site}}</td>
              </tr>
            </table>
          </div>
        </el-checkbox-group>
      </div>
      
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button edit-button" @click="switchToEditingMode" v-if="mode===VIEW_CURRENT_CARD && showEdit">编辑</div>
      <div class="button submit-button" @click="submit" v-else-if="mode!==VIEW_CURRENT_CARD">确定</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { deepCopy, vueCopy } from 'utils/helper';
import { baseUrl } from 'api/common.js';
import { addBiochemical, modifyBiochemical } from 'api/patient.js';
export default {
  data() {
    return {
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      warningResults: {
        bioexamId: '',
        checkDate: '',
        projectResults: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      copyInfo: {},
      targetBioexam: [],
      isHaveGeneMutation: false,
      geneMutationCheckedList: [],
      lockSubmitButton: false,
      showEdit: false,

      // 附件上传相关参数
      other: [],
      newOther: [],
      fileList: [],
      uploadingFilesNum: 0,
      // uploadUrl: baseUrl + '/upload/uploadPatientFamilyTree',
      uploadUrl: baseUrl + '/pdms/synFile',
      downloadUrl: baseUrl + '/download/',
      header: {
        'Content-Type': 'multipart/form-data'
      }
    };
  },
  computed: {
    ...mapGetters([
      'bioexamTypeList',
      'geneMutationList',
      'typeGroup'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增实验室检查';
      } else {
        return '实验室检查';
      }
    },
    patientId() {
      return this.$route.params.id;
    },
    patientCaseId() {
      return this.$route.params.caseId;
    }
    // fileParam() {
    //   let param = {
    //     'data': JSON.stringify(this.fileList)
    //   };
    //   return param;
    // }
  },
  methods: {
    checkRequired(id) {
      if (id === 55 || id === 68 || id === 69 || id === 70 || id === 75 || id === 63 || id === 62) {
        return true;
      };
      return false;
    },
    showPanel(cardOperation, item, showEdit) {
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.copyInfo = {};

      this.$set(this.copyInfo, 'bioexamId', '');
      this.$set(this.copyInfo, 'checkDate', '');
      this.$set(this.copyInfo, 'bloodCode', '');
      this.$set(this.copyInfo, 'projectResults', '');
      this.$set(this.copyInfo, 'remarks', '');
      this.$set(this.copyInfo, 'bioexamResult', []);

      if (this.mode === this.ADD_NEW_CARD) {
        this.$set(this.copyInfo, 'patientCaseId', this.patientCaseId);
        this.$set(this.copyInfo, 'patientId', this.patientId);
      } else {
        vueCopy(item, this.copyInfo);
        this.copyInfo.bioexamResult.forEach((item, i) => {
          if (item.isReference === undefined) {
            this.$set(this.copyInfo.bioexamResult[i], 'isReference', '');
          }
        });

        this.other = item.patientAttachmentModelList;
        for (let fileItem of this.other) {
          this.newOther.push(fileItem.id);
        }

        if (this.copyInfo.bioexamId === 27) {
          this.geneMutationCheckedList = [];
          if (item.patientGenMutationInfoModel.length > 0) {
            this.isHaveGeneMutation = true;
            item.patientGenMutationInfoModel.forEach((item) => {
              this.geneMutationCheckedList.push(Number(item.id));
            });
          }
        }

        this.$set(this.warningResults, 'bioexamResult', []);
        vueCopy(item.bioexamResult.map((elem) => {return {bioexamProjectId: elem.bioexamProjectId, result: elem.result};}), this.warningResults.bioexamResult);
      }

      this.updateTemplate();

      this.$nextTick(() => {
        this.clearWarning();
      });
    },
    updateTemplate() {
      this.targetBioexam = [];
      for (let bioexam of this.bioexamTypeList) {
        if (bioexam.id === this.copyInfo.bioexamId) {
          vueCopy(bioexam.projects, this.targetBioexam);
        }
      }
      this.updateScrollbar();
    },
    getComparisonIcon(value, rangeText) {
      var range = rangeText.split('--');
      var min = Number(range[0]);
      var max = Number(range[1]);
      if (value !== '' && value < min) {
        return 'icon-long-arrow-down';
      } else if (value !== '' && value > max) {
        return 'icon-long-arrow-up';
      }
    },
    changeBioexam() {
      this.updateWarning('bioexamId');
      this.updateTemplate();
      // 接下来要根据新的 targetBioexam 重置 this.copyInfo.bioexamResult
      this.$set(this.copyInfo, 'bioexamResult', []);
      for (let i = 0; i < this.targetBioexam.length; i++) {
        this.$set(this.copyInfo.bioexamResult, i, {});
        this.$set(this.copyInfo.bioexamResult[i], 'bioexamProjectId', this.targetBioexam[i].id);

        if (this.mode === this.ADD_NEW_CARD) {
          this.$set(this.copyInfo.bioexamResult[i], 'patientCaseId', this.patientCaseId);
          this.$set(this.copyInfo.bioexamResult[i], 'patientId', this.patientId);
        }
        this.$set(this.copyInfo.bioexamResult[i], 'remarks', '');
        this.$set(this.copyInfo.bioexamResult[i], 'result', '');
        this.$set(this.copyInfo.bioexamResult[i], 'isReference', '');
      }

      // 判断是否为基因检查 然后添加/删除基因检查表单属性
      this.isHaveGeneMutation = false;
      if (this.copyInfo.bioexamId === 27) {
        this.$set(this.copyInfo, 'patientGenMutationInfoModel', []);
        this.geneMutationCheckedList = [];
      } else {
        this.$delete(this.copyInfo, 'patientGenMutationInfoModel');
      }

      // if (this.copyInfo.bioexamId === 12) {
        // 12 为全血
      this.$set(this.warningResults, 'bioexamResult', []);
      this.targetBioexam.forEach((item, i) => {
        this.$set(this.warningResults.bioexamResult, i, {});
        this.$set(this.warningResults.bioexamResult[i], 'bioexamProjectId', this.targetBioexam[i].id);
        this.$set(this.warningResults.bioexamResult[i], 'result', '');
      });
      // } else {
        // this.$delete(this.warningResults, 'bioexamResult');
      // };
    },
    transform(id, fieldName) {
      id = parseInt(id, 10);
      let typesArr = this.getOptions(fieldName);
      let item = Util.getElement('code', id, typesArr);
      return item.name ? item.name : '';
    },
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
      this.lockSubmitButton = false;
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
      this.targetBioexam = [];
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      for (var fieldName in this.warningResults) {
        if (this.warningResults.hasOwnProperty(fieldName)) {
          if (Array.isArray(this.warningResults[fieldName])) {
            this.warningResults[fieldName].forEach((item, i) => {
              if (this.copyInfo.bioexamId === 12 && this.checkRequired(item.bioexamProjectId)) {
                this.updateWarning(fieldName, i, item.bioexamProjectId);
              }
            });
          } else {
            this.updateWarning(fieldName);
          };
        }
      }

      for (let fieldName in this.warningResults) {
        if (Array.isArray(this.warningResults[fieldName])) {
          for (let i = 0; i < this.warningResults[fieldName].length; i++) {
            const element = this.warningResults[fieldName][i];
            if (element.result !== '') {
              this.lockSubmitButton = false;
              return;
            }
          }
        } else {
          if (this.warningResults[fieldName] !== '') {
            this.lockSubmitButton = false;
            return;
          }
        }
      }

      let submitData = deepCopy(this.copyInfo);
      submitData.checkDate = Util.simplifyTime(submitData.checkDate, true);

      // 基因检查附件
      if (this.uploadingFilesNum > 0) {
        this.$message({
          message: '请等待文件上传后再提交',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      }
      submitData.file = this.newOther.join(',');

      if (this.mode === this.EDIT_CURRENT_CARD) {
        modifyBiochemical(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      } else if (this.mode === this.ADD_NEW_CARD) {
        addBiochemical(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    updateAndClose() {
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
    },
    updateWarning(fieldName, index, id, reg, txt) {
      let fieldVal = this.copyInfo[fieldName];
      let regObj = new RegExp(reg);
      if (Array.isArray(this.copyInfo[fieldName])) {
        if (fieldVal[index].result && regObj.test(fieldVal[index].result)) {
          this.$set(this.warningResults[fieldName][index], 'result', '');
        } else {
          if (this.copyInfo.bioexamId === 12 && this.checkRequired(id) && !fieldVal[index].result) {
            this.$set(this.warningResults[fieldName][index], 'result', '必填项');
          } else if ((fieldVal[index].result !== '') && !regObj.test(fieldVal[index].result)) {
            this.$set(this.warningResults[fieldName][index], 'result', txt);
          } else {
            this.$set(this.warningResults[fieldName][index], 'result', '');
          };
        };
      } else {
        if (this.copyInfo[fieldName]) {
          this.$set(this.warningResults, fieldName, '');
        } else {
          this.$set(this.warningResults, fieldName, '必填项');
        }
      }
    },
    clearWarning() {
      for (let key in this.warningResults) {
        if (Array.isArray(this.warningResults[key])) {
          this.warningResults[key].forEach((item) => {
            item.result = '';
          });
        } else {
          this.warningResults[key] = '';
        }
      }
    },
    chooseSubModal() {
      if (this.subModalType !== '') {
        this.warningResults['subModal'] = null;
      }
    },
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.biochemicalModal) {
          Ps.destroy(this.$refs.biochemicalModal);
          Ps.initialize(this.$refs.biochemicalModal, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
        if (this.$refs.formWrapper) {
          Ps.destroy(this.$refs.formWrapper);
          Ps.initialize(this.$refs.formWrapper, {
            wheelSpeed: 1,
            minScrollbarLength: 40
          });
        }
      });
    },
    getFieldValue(code, fieldName) {
      if (fieldName === 'bioexamName') {
        let info = Util.getElement('id', code, this.bioexamTypeList);
        return info.examName;
      } else {
        return '';
      }
    },
    // 基因检查 附件上传相关方法
    downloadFile(file) {
      window.location.href = this.downloadUrl + file.realPath;
    },
    removeFile(file, showingList, transferringList) {
      // console.log(file);
      for (let i = 0; i < showingList.length; i++) {
        if (file.id === showingList[i].id) {
          showingList.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < transferringList.length; i++) {
        if (file.id === transferringList[i].id) {
          transferringList.splice(i, 1);
          break;
        }
      }
      this.updateScrollbar();
    },
    uploadOtherSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newOther);
    },
    uploadSuccess(response, file, fileList, list) {
      this.uploadingFilesNum -= 1;
      // this.fileList = [];
      if (response.code === 0) {
        let id = response.data.attachment[0].id;
        list.push(id);
      } else {
        this.$message({
          message: '文件上传出错',
          type: 'warning',
          duration: 2000
        });
        console.log('response: ', response);
        console.log('file: ', file);
        console.log('fileList', fileList);
      }
    },
    uploadErr(err, file, fileList) {
      this.uploadingFilesNum -= 1;
      // this.fileList = [];
      console.log('upload error: ', err);
      console.log('file: ', file);
      console.log('fileList', fileList);
    },
    beforeUpload(file) {
      console.log(this.fileList, this.fileParam);
      const isUnderLimit = file.size / 1024 / 1024 < 300;
      if (!isUnderLimit) {
        this.$message({
          message: '上传文件大小不能超过 300MB',
          type: 'error',
          duration: 2000
        });
      } else {
        this.uploadingFilesNum += 1;
      }
      return isUnderLimit;
    },
    fileChange() {
      this.updateScrollbar();
    },
    handleOtherRemove(file) {
      this.handleRemove(file, this.newOther);
    },
    handleRemove(file, list) {
      console.log(file);
      if (file.status === 'uploading') {
        this.uploadingFilesNum -= 1;
      }
      for (var i = 0; i < list.length; i++) {
        if (file.response.data.attachmentId === list[i].id) {
          list.splice(i, 1);
          break;
        }
      }
      this.updateScrollbar();
    },
    handlePreview(file) {
      console.log(file);
      // window.location.href = file.url;
    }
  },
  mounted() {
    // console.log(this.bioexamTypeList);
    // console.log(JSON.stringify(this.typeGroup));
    this.updateScrollbar();
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_BIOCHEMICAL_EXAM_MODAL, this.showPanel);
    Bus.$off(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  watch: {
    isHaveGeneMutation() {
      this.updateScrollbar();
    },
    geneMutationCheckedList() {
      this.copyInfo.patientGenMutationInfoModel = [];
      this.geneMutationCheckedList.forEach((item) => {
        this.copyInfo.patientGenMutationInfoModel.push({
          'gid': item
        });
      });
    },
    '$route.path'() {
      this.cancel();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-height: 40px;
@field-name-width: 110px;
@long-field-name-width: 160px;

@col-id-width: 40px;
@col-name-width: 180px;
@col-english-width: 70px;
@col-result-width: 160px;
@col-unit-width: 70px;
@col-range-width: 100px;
@col-clinical-width:200px;
@col-remarks-width: 180px;

@title-left-padding: 30px;
@select-top-padding: 12px;

.biochemical-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .biochemical-modal {
    position: relative;
    margin: auto;
    padding: 0 40px;
    top: 3%;
    width: 900px;
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
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: @field-height;
        font-size: @normal-font-size;
        text-align: left;
        transform: translateX(10px);  // 这一行是为了修补视觉上的偏移
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
          width: calc(~"92% - @{field-name-width}");
          position: relative;
          left: @field-name-width;
          // line-height: @field-height;
          line-height: 30px;
          font-size: @normal-font-size;
          color: @light-font-color;
          &.long-field-name {
            left: @long-field-name-width;
          }
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
            &.textarea-warning-text {
              margin-top:-15px;
              position: static;
              display: block;
              line-height:1;
            }
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
            margin-bottom: 15px;
            transform: translateY(-3px);
            .el-textarea__inner {
              border: none;
              background-color: @screen-color;
            }
          }
          .el-select {
            width: 100%;
            .el-input {
              .el-input__inner {
                height: 30px !important;
              }
            }
          }
          .el-date-editor {
            width: 100%;
          }
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .field-file {
        position: relative;
        padding: @select-top-padding @title-left-padding;
        background-color: @background-color;
        margin-bottom: 10px;
        .field-name {
          display: inline-block;
          position: absolute;
          left: 13px;
          top: 13px;
          width: @field-name-width;
          line-height: 20px;
          font-size: @normal-font-size;
          color: @font-color;
        }
        .field-input {
          display: block;
          position: relative;
          left: @field-name-width;
          width: 98%;
          padding-right: @field-name-width;
          box-sizing: border-box;
          font-size: @normal-font-size;
          .last-files {
            margin-bottom: 10px;
            width: 100%;
            .last-files-title {
              transform: translateY(-5px);
              margin-bottom: 5px;
              height: 30px;
              line-height: 30px;
              background-color: @font-color;
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
                padding: 0 3px;
                line-height: 20px;
                transform: translateX(-3px);
                cursor: pointer;
                &:hover {
                  border-bottom: 1px solid @font-color;
                }
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
              text-align: left;
              .el-button {
                width: 100%;
                height: 30px;
                border-radius: 10px;
                &:hover {
                  opacity: 0.7;
                }
                &:active {
                  opacity: 0.85;
                }
                &.el-button--text {
                  background-color: @light-font-color;
                  color: #fff;
                  font-size: @normal-font-size;
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
      .form-wrapper {
        position: relative;
        max-height: 250px;
        height: auto;
        width: 100%;
        margin-top:14px;
        // padding-right: 10px;
        border: 1px solid @inverse-font-color;
        overflow: hidden;
        .form {
          position: relative;
          width: 100%;
          // left: calc(~"50% - (@{col-id-width} + @{col-time-width} + @{col-amount-width} + @{col-unit-width}) / 2");
          border-spacing: 0;
          .row {
            height: 45px;
            &.first-row {
              background-color: @screen-color;
              height: 30px;
            }
            .col {
              font-size: @normal-font-size;
              text-align: center;
              &.col-id {
                width: @col-id-width;
              }
              &.col-name {
                width: @col-name-width;
              }
              &.col-english {
                width: @col-english-width;
              }
              &.col-result {
                width: @col-result-width;
                position: relative;
                .warning-text {
                  position: absolute;
                  top: 38px;
                  left: 10px;
                  height: 15px;
                  color: red;
                  font-size: @small-font-size;
                }
                .warning .el-input__inner {
                  border: 1px solid red;
                }
              }
              &.col-unit {
                width: @col-unit-width;
              }
              &.col-range {
                width: @col-range-width;
              }
              &.col-clinical {
                width: @col-clinical-width;
              }
              &.col-remarks {
                padding-right: 5px;
                width: @col-remarks-width;
              }
              .required-mark {
                color: red;
                font-size: 20px;
                vertical-align: middle;
              }
              .iconfont {
                display: inline-block;
                position: absolute;
                transform: translateY(-1px);
                &.icon-long-arrow-up {
                  color: @green-color;
                }
                &.icon-long-arrow-down {
                  color: @alert-color;
                }
              }
              .el-input {
                margin-left: 2%;
                width: 90%;
                .el-input__inner {
                  height: 30px;
                  border: none;
                  background-color: @screen-color;
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
          width: 10px !important;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s;
          .ps__scrollbar-y {
            position: relative;
            border-radius: 0 !important;
            background-color: #aaa;
          }
        }
        &:hover {
          .ps__scrollbar-y-rail {
            opacity: 0.6;
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
