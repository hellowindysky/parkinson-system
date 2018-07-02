<template lang="html">
  <div class="img-modal-wrapper">
    <div class="img-modal" ref="scrollArea">
      <h3 class="title">{{title}}</h3>
      <div class="content">
        <div class="field whole-line">
          <span class="field-name">
            记录名称:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{name}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.name}}</span>
            <el-input v-model="name" placeholder="请输入本次影像记录的名称" @change="updateWarning('name')"
              :class="{'warning': warningResults.name}" :maxlength="50"></el-input>
          </span>
        </div>
        <div class="field">
          <span class="field-name">
            影像类型:
            <span class="required-mark">*</span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{getImagetype(imageType)}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.imageType}}</span>
            <el-select v-model="imageType" placeholder="请选择" @change="updateWarning('imageType')"
              :class="{'warning': warningResults.imageType}" clearable>
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
            <span>{{checkDate}}</span>
          </span>
          <span class="field-input" v-else>
            <span class="warning-text">{{warningResults.checkDate}}</span>
            <el-date-picker
              v-model="checkDate"
              :class="{'warning': warningResults.checkDate}"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              @change="updateWarning('checkDate')">
            </el-date-picker>
          </span>
        </div>

        <div class="field whole-line" v-show="imageType===2">
          <span class="field-name">
            磁场强度:
            <span class="required-mark"></span>
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span>{{getMagneticIntensity(magneticIntensity)}}</span>
          </span>
          <span class="field-input" v-else>
            <!-- <span class="warning-text">磁场强度验证信息</span> -->
            <el-select v-model="magneticIntensity" placeholder="请选择磁场强度" clearable >
              <el-option
                v-for="item in getOptions('magneticIntensity')"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
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

        <div class="field field-brain" v-show="imageType===9">
          <span class="field-name">
            第三脑室宽:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{checkDevice}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="diaceleWidth" placeholder="请输入第三脑室宽"></el-input>
            <span class="unit">cm</span>
          </span>
        </div>

        <table class="table" v-show="itemGroups.length > 0" v-for="(group, groupIndex) in itemGroups">
          <thead>
            <tr class="row title-row">
              <td class="col"></td>
              <td class="col" v-if="col.rowSpan>0" v-for="col in group.colItems" :rowspan="col.rowSpan" :colspan="col.colSpan">
                {{col.fieldName}}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr class="row" v-for="row in group.rowItems" v-if="group.colItems.length>0">
              <td class="col">
                {{row.fieldName}}
              </td>
              <td class="col" v-for="col in group.colItems">
                <span v-if="mode===VIEW_CURRENT_CARD && row.uiType===3">
                  <span v-if="row.fieldEnumId">
                    {{transform(patientFieldCode[imageType][row.id][col.id].fieldValue, row.fieldEnumId)}}
                  </span>
                  <span v-else>
                    {{transform(patientFieldCode[imageType][row.id][col.id].fieldValue, col.fieldEnumId)}}
                  </span>
                </span>
                <span v-else-if="mode===VIEW_CURRENT_CARD">
                  {{patientFieldCode[imageType][row.id][col.id].fieldValue}}
                </span>
                <el-input v-else-if="row.uiType===1" v-model="patientFieldCode[imageType][row.id][col.id].fieldValue"></el-input>
                <el-select v-else-if="row.uiType===3 && row.fieldEnumId" v-model="patientFieldCode[imageType][row.id][col.id].fieldValue"
                  placeholder="">
                  <el-option
                    v-for="(option, index) in getOptions(row.fieldEnumId)"
                    :label="option.name"
                    :key="'row.fieldEnumId'+ index"
                    :value="String(option.code)">
                  </el-option>
                </el-select>
                <el-select v-else-if="row.uiType===3" v-model="patientFieldCode[imageType][row.id][col.id].fieldValue"
                  placeholder="">
                  <el-option
                    v-for="(option, index) in getOptions(col.fieldEnumId)"
                    :label="option.name"
                    :key="'col.fieldEnumId'+ index"
                    :value="option.code">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-else-if="row.uiType===6"
                  v-model="patientFieldCode[imageType][row.id][col.id].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker
                  v-else-if="row.uiType===7"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  v-model="patientFieldCode[imageType][row.id][col.id].fieldValue"
                  :picker-options="pickerOptions">
                </el-date-picker>
                <el-time-select v-else-if="row.uiType===8" v-model="patientFieldCode[imageType][row.id][col.id].fieldValue"
                  :picker-options="{start:'00:00', end:'24:00'}"></el-time-select>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="field whole-line">
          <span class="field-name">
            检查结论:
          </span>
          <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
            <span class="warning-text"></span>
            <span>{{checkConclusion}}</span>
          </span>
          <span class="field-input" v-else>
            <el-input v-model="checkConclusion" placeholder="请输入检查结论" type="textarea" :maxlength="500"></el-input>
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
            <el-input v-model="remarks" placeholder="请输入备注信息" type="textarea" :maxlength="500"></el-input>
          </span>
        </div>

        <!-- 以下是 MRI 才有的序列 ↓↓↓↓↓↓↓↓ -->
        <div v-show="imageType===2">

        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            T1 文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的 T1 文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in t1">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, t1, newT1)"></i>
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
              :on-remove="handleT1Remove"
              :on-success="uploadT1Success"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList1">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
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
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in t2">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, t2, newT2)"></i>
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
              :on-remove="handleT2Remove"
              :on-success="uploadT2Success"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList2">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
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
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in t2Flair">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, t2Flair, newT2Flair)"></i>
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
              :on-remove="handleT2FlairRemove"
              :on-success="uploadT2FlairSuccess"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList3">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传 T2 Flair 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>

        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            VBM文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的VBM文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in vbm">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, vbm, newVbm)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload5"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleVbmRemove"
              :on-success="uploadVbmSuccess"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList5">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传 VBM 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>

        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            DTI文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的DTI文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in dti">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, dti, newDti)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload6"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleDtiRemove"
              :on-success="uploadDtiSuccess"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList6">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传 DTI 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>

        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            FMR文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的FMR文件</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in fmr">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, fmr, newFmr)"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="upload7"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleFmrRemove"
              :on-success="uploadFmrSuccess"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList7">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传 FMR 压缩文件/源文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>
        </div>
        <!-- 以上是 MRI 才有的序列 ↑↑↑↑↑↑↑↑↑↑↑↑ -->

        <hr class="seperate-line">
        <div class="field-file">
          <span class="field-name">
            其它文件:
          </span>
          <span class="field-input">
            <div class="last-files">
              <div class="last-files-title">已上传的其它文件</div>
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
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :on-remove="handleOtherRemove"
              :on-success="uploadOtherSuccess"
              :on-error="uploadErr"
              :before-upload="beforeUpload"
              :file-list="fileList4">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传其它文件
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </div>
      </div>
      <div class="button cancel-button btn-margin" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD" class="button submit-button btn-margin" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && showEdit" class="button submit-button btn-margin" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { vueCopy, reviseDateFormat, pruneObj } from 'utils/helper.js';
import { baseUrl, getCommonRequest } from 'api/common.js';
import { addImage, modifyImage } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      completeInit: false,
      hasTable: false,
      copyItem: {},

      id: '',
      name: '',
      patientAttachmentId: '',
      imageType: '',
      checkDate: '',
      magneticIntensity: '',
      checkNum: '',
      checkDevice: '',
      diaceleWidth: '',
      checkConclusion: '',
      remarks: '',

      warningResults: {
        name: '',
        imageType: '',
        checkDate: ''
      },

      typeGroupCode: 'examType',  // 此字段无特殊用途，后端接口需要
      patientFieldCode: {},

      t1: [],
      t2: [],
      t2Flair: [],

      vbm: [],
      dti: [],
      fmr: [],

      other: [],

      newT1: [],
      newT2: [],
      newT2Flair: [],

      newVbm: [],
      newDti: [],
      newFmr: [],

      newOther: [],

      uploadingFilesNum: 0,
      uploadUrl: baseUrl + '/upload/uploadAttachment',
      downloadUrl: baseUrl + '/download/',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      fileList1: [], // T1
      fileList2: [], // T2
      fileList3: [], // T2 Flair
      fileList4: [], // other
      fileList5: [], // VBM
      fileList6: [], // DTI
      fileList7: [], // FMR
      header: {
        'Content-Type': 'multipart/form-data'
      },
      fileParam: getCommonRequest(),
      lockSubmitButton: false,
      showEdit: false
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'typeField'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增医学影像';
      } else {
        return '医学影像';
      }
    },
    itemGroups() {
      var items = this.typeField.filter(item => {
        return Number(item.typeCode) === this.imageType &&
        item.typeGroupCode === 'examType';
      });
      if (items.length === 0) {
        this.hasTable = false;
        return [];
      } else {
        this.hasTable = true;
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
    }
  },
  methods: {
    showPanel(cardOperation, item, showEdit) {
      this.copyItem = item;
      this.completeInit = false;
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.newT1 = [];
      this.newT2 = [];
      this.newT2Flair = [];
      this.newVbm = [];
      this.newDti = [];
      this.newFmr = [];
      this.newOther = [];

      // console.log('item: ', item);
      this.id = item.id ? item.id : '';
      this.name = item.title ? item.title : '';
      this.checkDate = item.checkDate ? item.checkDate : '';
      this.imageType = item.imageType ? item.imageType : '';
      this.magneticIntensity = item.magneticIntensity ? item.magneticIntensity : '';
      this.checkNum = item.checkNum ? item.checkNum : '';
      this.checkDevice = item.checkDevice ? item.checkDevice : '';
      this.checkConclusion = item.checkConclusion ? item.checkConclusion : '';
      this.remarks = item.remarks ? item.remarks : '';
      this.t1 = item.t1 ? item.t1 : [];
      this.t2 = item.t2 ? item.t2 : [];
      this.t2Flair = item.t2Flair ? item.t2Flair : [];
      this.vbm = item.vbm ? item.vbm : [];
      this.dti = item.dti ? item.dti : [];
      this.fmr = item.fmr ? item.fmr : [];
      this.other = item.other ? item.other : [];

      for (let fileItem of this.t1) {
        this.newT1.push({
          id: fileItem.id
        });
      }
      for (let fileItem of this.t2) {
        this.newT2.push({
          id: fileItem.id
        });
      }
      for (let fileItem of this.t2Flair) {
        this.newT2Flair.push({
          id: fileItem.id
        });
      }
      for (let fileItem of this.vbm) {
        this.newVbm.push({
          id: fileItem.id
        });
      }
      for (let fileItem of this.dti) {
        this.newDti.push({
          id: fileItem.id
        });
      }
      for (let fileItem of this.fmr) {
        this.newFmr.push({
          id: fileItem.id
        });
      }
      for (let fileItem of this.other) {
        this.newOther.push({
          id: fileItem.id
        });
      }

      this.$nextTick(() => {
        for (var property in this.warningResults) {
          if (this.warningResults.hasOwnProperty(property)) {
            this.warningResults[property] = '';
          }
        }
      });

      this.completeInit = true;
      this.updateScrollbar();
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
    getImagetype(imageType) {
      var options = this.getOptions('examType');
      var targetOption = Util.getElement('code', imageType, options);
      return targetOption.name;
    },
    getMagneticIntensity(magneticIntensity) {
      var options = this.getOptions('magneticIntensity');
      var targetOption = Util.getElement('code', magneticIntensity, options);
      return targetOption.name;
    },
    updateWarning(fieldName) {
      if (this.completeInit && !this[fieldName]) {
        this.warningResults[fieldName] = '必填项';
      } else {
        this.warningResults[fieldName] = '';
      }
    },
    cancel() {
      this.lockSubmitButton = false;
      this.$refs.upload1.clearFiles();
      this.$refs.upload2.clearFiles();
      this.$refs.upload3.clearFiles();
      this.$refs.upload4.clearFiles();
      this.$refs.upload5.clearFiles();
      this.$refs.upload6.clearFiles();
      this.$refs.upload7.clearFiles();
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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

      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property)) {
          this.updateWarning(property);
        }
      }
      for (let property in this.warningResults) {
        if (this.warningResults.hasOwnProperty(property) && this.warningResults[property]) {
          this.lockSubmitButton = false;
          return;
        }
      }

      if (this.uploadingFilesNum > 0) {
        this.$message({
          message: '请等待文件上传后再提交',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      }

      var imageInfo = {};
      imageInfo.patientCaseId = this.$route.params.caseId;
      imageInfo.title = this.name;
      imageInfo.imageType = this.imageType;
      imageInfo.checkDate = this.checkDate;
      imageInfo.magneticIntensity = this.magneticIntensity;
      imageInfo.checkNum = this.checkNum;
      imageInfo.checkDevice = this.checkDevice;
      imageInfo.checkConclusion = this.checkConclusion;
      imageInfo.remarks = this.remarks;
      reviseDateFormat(imageInfo);
      pruneObj(imageInfo);

      if (this.imageType === 9 && this.diaceleWidth) {
        imageInfo.diaceleWidth = this.diaceleWidth;
      }

      if (this.hasTable) {
        imageInfo.patientFieldCode = this.patientFieldCode;
        imageInfo.typeGroupCode = this.typeGroupCode;
      }

      imageInfo.t1 = this.newT1;
      imageInfo.t2 = this.newT2;
      imageInfo.t2Flair = this.newT2Flair;
      imageInfo.vbm = this.newVbm;
      imageInfo.dti = this.newDti;
      imageInfo.fmr = this.newFmr;
      imageInfo.other = this.newOther;
      // console.log(imageInfo);
      if (this.mode === this.ADD_NEW_CARD) {
        addImage(imageInfo).then(() => {
          this.updateAndClose();
          this.lockSubmitButton = false;
        }, this._handleError);
      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        imageInfo.id = this.id;
        modifyImage(imageInfo).then(() => {
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
      this.$refs.upload1.clearFiles();
      this.$refs.upload2.clearFiles();
      this.$refs.upload3.clearFiles();
      this.$refs.upload4.clearFiles();
      Bus.$emit(this.UPDATE_CASE_INFO);
      Bus.$emit(this.UNLOAD_DYNAMIC_COMPONENT);
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
    downloadFile(file) {
      window.location.href = this.downloadUrl + file.realPath;
    },
    handleT1Remove(file) {
      this.handleRemove(file, this.newT1);
    },
    handleT2Remove(file) {
      this.handleRemove(file, this.newT2);
    },
    handleT2FlairRemove(file) {
      this.handleRemove(file, this.newT2Flair);
    },
    handleVbmRemove(file) {
      this.handleRemove(file, this.newVbm);
    },
    handleDtiRemove(file) {
      this.handleRemove(file, this.newDti);
    },
    handleFmrRemove(file) {
      this.handleRemove(file, this.newFmr);
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
    },
    uploadT1Success(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newT1);
    },
    uploadT2Success(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newT2);
    },
    uploadT2FlairSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newT2Flair);
    },
    uploadVbmSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newVbm);
    },
    uploadDtiSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newDti);
    },
    uploadFmrSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newFmr);
    },
    uploadOtherSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.newOther);
    },
    uploadSuccess(response, file, fileList, list) {
      this.uploadingFilesNum -= 1;
      if (response.code === 0) {
        let id = response.data.patientAttachmentId;
        list.push({
          'id': id
        });
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
      console.log('upload error: ', err);
      console.log('file: ', file);
      console.log('fileList', fileList);
    },
    beforeUpload(file) {
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
    updateScrollbar() {
      this.$nextTick(() => {
        if (this.$refs.scrollArea) {
          Ps.destroy(this.$refs.scrollArea);
          Ps.initialize(this.$refs.scrollArea, {
            wheelSpeed: 1,
            minScrollbarLength: 40,
            suppressScrollX: true
          });
        }
      });
    },
    // TCD 动态表格处理
    transform(typeId, fieldName) {
      var typeInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typeInfo.types ? typeInfo.types : [];
      var name = Util.getElement('typeCode', parseInt(typeId, 10), types).typeName;
      return name;
    },
    initSubTableData() {
      this.patientFieldCode = {};
      // this.$set(this.patientFieldCode, 'patientFieldCode', {});

      for (let type of this.getOptions('examType')) {
        let typeCode = type.code;
        let items = this.typeField.filter(item => {
          return Number(item.typeCode) === typeCode &&
          item.typeGroupCode === 'examType';
        });
        if (items.length > 0) {
          let groups = this.filterItemsIntoGroups(items);
          this.initSubTableDataForTypeCode(typeCode, groups);
        }
      }
    },
    initSubTableDataForTypeCode(typeCode, groups) {
      this.$set(this.patientFieldCode, typeCode, {});

      // let items = this.typeField.filter(item => {
      //   return Number(item.typeCode) === typeCode &&
      //   item.typeGroupCode === 'examType';
      // });
      // let groups = this.filterItemsIntoGroups(items);
      let resultGroups = [];
      for (let i = 0; i < groups.length; i += 1) {
        resultGroups.push({});
        resultGroups[i].rowItems = groups[i].filter(item => item.fieldType === 0);
        resultGroups[i].colItems = groups[i].filter(item => item.fieldType === 1);
      }

      for (let group of resultGroups) {
        for (let rowItem of group.rowItems) {
          var rowItemCode = rowItem.id;
          this.$set(this.patientFieldCode[typeCode], rowItemCode, {});

          let colItems = group.colItems;
          if (colItems.length === 0) {
            // 特殊情况：如果没有列，则新建一个code为 0 的虚拟列
            colItems = [{id: 0}];
          }

          for (let colItem of colItems) {
            var colItemCode = colItem.id;
            this.$set(this.patientFieldCode[typeCode][rowItemCode], colItemCode, {});

            this.$set(this.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeGroupCode', 'examType');
            this.$set(this.patientFieldCode[typeCode][rowItemCode][colItemCode], 'typeCode', typeCode);
            this.$set(this.patientFieldCode[typeCode][rowItemCode][colItemCode], 'rowFieldId', rowItemCode);
            this.$set(this.patientFieldCode[typeCode][rowItemCode][colItemCode], 'columnFieldId', colItemCode);
            this.$set(this.patientFieldCode[typeCode][rowItemCode][colItemCode], 'fieldValue', '');
          }
        }
      }
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
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_IMG_MODAL, this.showPanel);
    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
    this.updateScrollbar();
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_IMG_MODAL);
  },
  watch: {
    imageType() {
      this.initSubTableData();
      this.diaceleWidth = '';
      vueCopy(this.copyItem.patientFieldCode, this.patientFieldCode);
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
        margin-top: 5px;
        margin-bottom: 15px;
      }
      .table {
        margin: 10px 0 20px;
        width: 96%;
        margin-left: 10px;
        border: 1px solid @light-gray-color;
        border-collapse: collapse;
        text-align: center;
        .row {
          height: 35px;
          font-size: @normal-font-size;
          th {
            font-weight: normal;
          }
          &.title-row {
            background-color: @font-color;
            color: #fff;
          }
          .col {
            position: relative;
            width: 10%;
            border: 1px solid @light-gray-color;
            .el-select {
              width: 100%;
            }
            .el-input {
              width: 100%;
              .el-input__inner {
                height: 30px;
                border: none;
                text-align: center;
                background-color: #ffffff;
              }
            }
            // &.wide-col {
            //   width: 80%;
            //   text-align: center !important;
            // }
            // &:first-child {
            //   text-align: left;
            //   padding-left:10px;
            // }
          }
        }
      }
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        box-sizing: border-box;
        text-align: left;
        vertical-align: top;
        transform: translate3d(10px, 5px, 0); // 这一行是为了修补视觉上的偏移
        &.field-brain {
          .field-input {
            .el-input {
              width: calc(~"100% - 34px");
            }
            .unit {
              position: absolute;
              right: 10px;
              top: calc(~"50% - 3px");
              transform: translateY(-50%);
              font-size: 14px;
            }
          }
        }
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
          position: relative;
          left: @field-name-width;
          width: calc(~"92% - @{field-name-width}");
          line-height: @field-line-height;
          font-size: @normal-font-size;
          color: @light-font-color;
          // &.long-field-name {
          //   left: @long-field-name-width;
          // }
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
            margin-bottom: 10px;
            vertical-align: middle;
            transform: translateY(-3px);
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
          .warning .el-input__inner,
          .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
      }
      .field-file {
        margin-bottom: 10px;
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
            // .el-upload-list {
            // }
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
