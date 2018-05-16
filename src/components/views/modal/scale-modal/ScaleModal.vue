<template lang="html">
  <div class="diagnostic-update-wrapper" :class="{'slide-outside':!displayModal}">
    <div class="title-bar">
      <h2 class="title">
        {{title}}
        <span class="complete-status" v-if="totalNumOfQuestions > 0">
          【已完成 {{numOfCompletedQuestions}} / {{totalNumOfQuestions}} 题】
        </span>
      </h2>
      <div class="button back-button" @click="closePanel">返回</div>
      <div class="button edit-button" @click="edit" v-if="mode===VIEW_CURRENT_CARD && showEdit">编辑</div>
      <div class="button save-button" @click="submit" v-else-if="mode!==VIEW_CURRENT_CARD">保存</div>
    </div>

    <div class="scroll-area" ref="scrollArea">
      <div class="scale-selector" v-if="mode!==VIEW_CURRENT_CARD">
        <div class="field whole-line" v-if="mode===ADD_NEW_CARD">
          <span class="field-name">
            选择量表:
            <span class="required-mark">*</span>
          </span>
          <span class="field-value">
            <span class="warning-text">
              {{warningResults.scaleInfoId}}
            </span>
            <!-- <el-select placeholder="请选择量表" v-model="copyInfo.scaleInfoId" :class="{'warning': warningResults.scaleInfoId}"
              @change="selectScale" size="small">
              <el-option v-for="scale in allScale" :key="scale.scaleInfoId" :label="scale.gaugeName"
                :value="scale.scaleInfoId"></el-option>
            </el-select> -->
            <el-autocomplete
              class="inline-input"
              :class="{'warning': warningResults.scaleInfoId}"
              v-model="scaleName"
              :fetch-suggestions="queryScaleSearch"
              placeholder="请输入量表名称或直接在列表中选择"
              @select="handleScaleSelect"
            ></el-autocomplete>
          </span>
        </div>
        <div class="field">
          <span class="field-name">量表类型:</span>
          <span class="field-value">{{scaleType}}</span>
        </div>
        <div class="field">
          <span class="field-name">开关状态:</span>
          <span class="field-value">
            <el-select v-model="copyInfo.switchType" placeholder="请选择量表开关状态">
              <el-option v-for="option in getOptions('switchType')" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
            </el-select>
          </span>
        </div>
        <div class="field">
          <span class="field-name">量表填写时间:</span>
          <span class="field-value">
            <el-date-picker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              v-model="copyInfo.inspectTime"
              placeholder="请选择量表填写时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>
        <div class="field">
          <span class="field-name">末次服药时间:</span>
          <span class="field-value">
            <el-date-picker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              v-model="copyInfo.lastTakingTime"
              placeholder="请选择末次服药时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </span>
        </div>
        <div class="field whole-line">
          <span class="field-name">其它信息:</span>
          <span class="field-value">
            <el-input type="textarea" v-model="copyInfo.scaleExtraInfo" placeholder="请输入其它信息" :maxlength="500"></el-input>
          </span>
        </div>
      </div>

      <div class="scale-selector" v-if="mode===VIEW_CURRENT_CARD">
        <div class="field">
          <span class="field-name">量表类型:</span>
          <span class="field-value">{{scaleType}}</span>
        </div>
        <div class="field">
          <span class="field-name">开关状态:</span>
          <span class="field-value">{{getFieldValue(copyInfo.switchType, 'switchType')}}</span>
        </div>
        <div class="field">
          <span class="field-name">量表填写时间:</span>
          <span class="field-value">{{copyInfo.inspectTime}}</span>
        </div>
        <div class="field">
          <span class="field-name">末次服药时间:</span>
          <span class="field-value">{{copyInfo.lastTakingTime}}</span>
        </div>
        <div class="field whole-line">
          <span class="field-name">其它信息:</span>
          <span class="field-value">{{copyInfo.scaleExtraInfo}}</span>
        </div>
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
              点击上传附件
            </el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </span>
      </div>

      <!-- 关联症状 -->
      <folding-panel :title="'关联症状'" :folded-status="true" class="associated-symptom" :editable="showEdit">
        <div class="symptom-item" v-for="(symptom, index) in scaleSymptomList">
          <el-checkbox class="symptom-item-title" v-model="symptom.status" :disabled="mode===VIEW_CURRENT_CARD">
            {{symptom.sympName}}
          </el-checkbox>
          <div class="symptom-item-start">
            <span class="field-name">出现时间:</span>
            <el-date-picker
              format="yyyy-MM-dd"
              v-model="symptom.ariseTime"
              placeholder="请输入出现关联症状的时间"
              :disabled="mode===VIEW_CURRENT_CARD || !symptom.status"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="symptom-item-dose">
            <span class="field-name">服用药物:</span>
            <el-input v-model="symptom.scaleMedicine" placeholder="请输入服用药物"
              :disabled="mode===VIEW_CURRENT_CARD || !symptom.status" :maxlength="500"></el-input>
          </div>
        </div>
      </folding-panel>

      <!-- 快速答题 -->
      <div class="quickly-answer" v-if="quickAnswer === true">
        <div class="quickly-title">
          <div @click="changeAnswerMode" class="quickly-button">{{quicklyMode === true ? '常规答题' : '快速答题'}}</div>
        </div>
        <div class="answer-form" v-show="quicklyMode === true">
          <div class="form-cell" v-for="(item, index) in targetScale.questions" 
          :class="{'notice-empty': !copyInfo.patientOptions[index].scaleOptionId && mode === EDIT_CURRENT_CARD}">
            <div class="cell-title">
              {{item.scaleQuestionNumber}}
            </div>
            <div class="cell-input">
              <span class="field-value">
                <el-select v-model="copyInfo.patientOptions[index].scaleOptionId" filterable placeholder="请选择">
                  <el-option
                    v-for="option in item.options"
                    :key="option.scaleOptionId"
                    :label="String(option.grade)"
                    :value="option.scaleOptionId">
                    {{ option.grade }}
                  </el-option>
                </el-select>
              </span>
              <span class="cell-key">分</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 题目列表 -->
      <div v-for="(item, index) in targetScale.questions" class="scale-questions" v-show="(item.parentId ? checkQuestionListIsShow(item.parentId, index) : true) && quicklyMode === false"
        :id="'questions_' + index" :style="{'padding-left': item.questionLevel? item.questionLevel*20 + 30 + 'px':'30px'}">
        <p class="question-title" v-html="item.subjectName" 
        :class="{'notice-empty': !copyInfo.patientOptions[index].scaleOptionId && mode === EDIT_CURRENT_CARD}"></p>
        <el-checkbox-group v-if="(item.questionType===0 || item.questionType===1) && item.multipleChoose === 1"
          class="question-body" :key="index" v-model="copyInfo.patientOptions[index].scaleOptionId">
          <el-checkbox class="question-selection" v-for="(option, i) in item.options"
            :label="option.scaleOptionId" :key="i" :disabled="mode===VIEW_CURRENT_CARD">
              {{option.optionName}}
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="(item.questionType===0 || item.questionType===1)  && item.multipleChoose !== 1"
          class="question-body" :key="index" v-model="copyInfo.patientOptions[index].scaleOptionId">
          <el-radio class="question-selection" v-for="(option, i) in item.options"
            :label="option.scaleOptionId" :key="i" :disabled="mode===VIEW_CURRENT_CARD">
              {{option.optionName}}
            <el-input v-if="item.questionType===1 && option.scaleOptionId===copyInfo.patientOptions[index].scaleOptionId"
              v-model="copyInfo.patientOptions[index].remarks" :disabled="mode===VIEW_CURRENT_CARD" checked>
            </el-input>
          </el-radio>
        </el-radio-group>
        <el-input v-model="copyInfo.patientOptions[index].remarks" :disabled="mode===VIEW_CURRENT_CARD"
          class="question-body" v-if="item.questionType===2"></el-input>
        <div v-if="item.questionType===3">
          <el-input v-model="copyInfo.patientOptions[index].optionPoint"
            :disabled="mode===VIEW_CURRENT_CARD" class="question-body point-input"
            @blur="transformToNum(copyInfo.patientOptions[index], 'optionPoint', item.stepping, item.maxPoint)">
          </el-input>
          <span class="extra-info">
            <span v-if="item.maxPoint !== undefined">
              &nbsp;/ {{item.maxPoint}}
            </span>
            <span v-if="item.stepping !== undefined && false">
              （填写分数应为{{item.stepping}}的整数倍）
            </span>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { baseUrl, getCommonRequest } from 'api/common.js';
import { modifyScaleInfo, addScaleInfo } from 'api/patient';
import { vueCopy, deepCopy } from 'utils/helper';

import FoldingPanel from 'public/folding-panel/FoldingPanel';

export default {
  data() {
    return {
      displayModal: false,
      mode: '',
      showEdit: false,
      lockSubmitButton: false,
      scaleCategory: 0, // 量表类型 0: 临床量表, 1: 课题评定
      quickAnswer: false,  // 量表是否支持快速答题
      quicklyMode: false,  // 答题模式 false 常规答题 true 快速答题
      answerModeChanged: false,  // 判断是否切换过答题模式，用于在第一次由快速答题切换至常规答题时进行弹窗提示

      copyInfo: {},
      warningResults: {
        scaleInfoId: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      scaleTypeCode: '',
      scaleName: '',
      scaleList: [], // 根据scaleCategory量表类型筛选出的量表列表

      scaleSymptomList: [], // 关联症状列表，长度由 typeGroup 决定
      scaleAnswer: [],       // 放筛选出来的量表病人填写答案的数组

      other: [],
      newOther: [],
      fileList4: [],
      uploadingFilesNum: 0,
      uploadUrl: baseUrl + '/upload/uploadScaleFile',
      downloadUrl: baseUrl + '/download/',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      fileParam: getCommonRequest()
    };
  },
  computed: {
    ...mapGetters([
      'scaleTemplateGroups',
      'typeGroup',
      'allScale'
    ]),
    title() {
      if (this.mode === this.ADD_NEW_CARD) {
        return '新增量表';
      } else {
        return this.scaleTitle;
      }
    },
    targetScale() {
      let scale = Util.getElement('scaleInfoId', this.copyInfo.scaleInfoId, this.allScale);

      // console.log('targetScale', scale);
      // 问题嵌套 层级递归处理
      if (scale.questions && scale.questions.length > 0) {
        this.questionsListFormat(scale);
        // console.log('format', scale);
      }
      return scale ? scale : {};
    },
    scaleTitle() {
      return this.targetScale.gaugeName ? this.targetScale.gaugeName : '';
    },
    scaleType() {
      var options = this.getOptions('gaugeType');
      var option = Util.getElement('code', this.scaleTypeCode, options);
      return option.name ? option.name : '';
    },
    totalNumOfQuestions() {
      return this.targetScale.questions ? this.targetScale.questions.length : 0;
    },
    numOfCompletedQuestions() {
      var num = 0;
      if (this.targetScale.questions === undefined) {
        return num;
      }
      for (var i = 0; i < this.targetScale.questions.length; i++) {
        var question = this.targetScale.questions[i];
        var questionType = question.questionType;
        if (questionType === 0 || questionType === 1) {
          if (this.copyInfo.patientOptions[i].scaleOptionId instanceof Array) {
            if (this.copyInfo.patientOptions[i].scaleOptionId.length > 0) {
              num += 1;
            }
          } else if (this.copyInfo.patientOptions[i].scaleOptionId !== '') {
            num += 1;
          }
        } else if (questionType === 2) {
          if (this.copyInfo.patientOptions[i].remarks !== '') {
            num += 1;
          }
        } else if (questionType === 3) {
          if (this.copyInfo.patientOptions[i].optionPoint !== '') {
            num += 1;
          }
        }
      }
      return num;
    }
  },
  methods: {
    selectScale() {
      this.scaleTypeCode = this.getScaleTypeCode(this.copyInfo.scaleInfoId);
      this.updateWarning('scaleInfoId');
      this.updateScrollbar();
    },
    queryScaleSearch(queryString, cb) {
      let allScale = [];
      let subjectId = this.$store.state.subjectId;
      this.scaleList = [];

      // 根据量表分类判断可选择的量表数组
      if (this.scaleCategory === 1) {
        this.allScale.map((item) => {
          if (item.gaugeTaskType === subjectId) {
            this.scaleList.push(item);
            allScale.push({'value': item.gaugeName});
          }
        });
      } else {
        this.allScale.map((item) => {
          if (item.gaugeTaskType === 0) {
            this.scaleList.push(item);
            allScale.push({'value': item.gaugeName});
          }
        });
      }

      // console.log(this.scaleList);

      var results = queryString ? allScale.filter((item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      }) : allScale;

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleScaleSelect() {
      var targetScale = Util.getElement('gaugeName', this.scaleName, this.scaleList);
      this.copyInfo.scaleInfoId = targetScale.scaleInfoId;
      this.selectScale();
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
    getFieldValue(code, fieldName) {
      if (fieldName === 'switchType') {
        code = parseInt(code, 10);
        var options = this.getOptions(fieldName);
        var targetOption = Util.getElement('code', code, options);
        return targetOption.name ? targetOption.name : '';
      } else {
        return '';
      }
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
    },
    showModal(cardOperation, item, showEdit, scaleCategory) {
      this.mode = cardOperation;
      this.showEdit = showEdit;
      this.scaleCategory = scaleCategory;

      this.initPatientScale(item);
      this.scaleTypeCode = this.getScaleTypeCode(this.copyInfo.scaleInfoId);
      this.initSymptomList();

      this.fileList4 = [];
      this.newOther = [];

      this.other = item.scaleFiles ? item.scaleFiles : [];
      for (let fileItem of this.other) {
        this.newOther.push({
          id: fileItem.id
        });
      }

      // console.log('item', item);

      this.scaleAnswer = [];
      // 只有阅读和修改的状态下，item.patientOptions 才可能不为空
      if (item.patientOptions) {
        this.scaleAnswer = item.patientOptions;
      }

      this.getCorrectAnswer();

      this.displayModal = true;
      this.updateScrollbar();
      this.$nextTick(() => {
        this.$refs.scrollArea.scrollTop = 0;
      });

      this.$nextTick(() => {
        this.clearWarning();
      });
      // console.log('copyInfo: ', this.copyInfo);
    },
    edit() {
      this.mode = this.EDIT_CURRENT_CARD;
      if (this.quicklyMode === false) {
        this.scrollToQuestion();
      }
    },
    submit() {
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      this.updateWarning('scaleInfoId');
      for (var p in this.warningResults) {
        if (this.warningResults.hasOwnProperty(p) && this.warningResults[p]) {
          this.lockSubmitButton = false;
          return;
        }
      }

      let submitData = deepCopy(this.copyInfo);
      // console.log('submitData', submitData);

      // 去掉空答案
      var options = [];
      for (let i = 0; i < submitData.patientOptions.length; i++) {
        let item = submitData.patientOptions[i];
        // questionType 0单选题 1单选有备注 2填空题不计分 3填空题计分
        let questionType = this.targetScale.questions[i].questionType;
        if (questionType === 0 || questionType === 1) {

          // 多选处理
          if (item.scaleOptionId instanceof Array) {
            if (item.scaleOptionId.length > 0) {
              for (let j = 0; j < item.scaleOptionId.length; j++) {
                let newData = {
                  optionPoint: item.optionPoint,
                  remarks: item.remarks,
                  scaleOptionId: item.scaleOptionId[j]
                };
                options.push(newData);
              }
            }
          } else if (item.scaleOptionId !== '') {
            options.push(item);
          }
        } else if (questionType === 2) {
          if (item.remarks !== '') {
            item.scaleOptionId = this.targetScale.questions[i].options[0].scaleOptionId;
            options.push(item);
          }
        } else if (questionType === 3) {
          if (item.optionPoint !== '') {
            item.scaleOptionId = this.targetScale.questions[i].options[0].scaleOptionId;
            options.push(item);
          }
        }
      }
      submitData.patientOptions = options;

      submitData.inspectTime = Util.simplifyTime(submitData.inspectTime);
      submitData.lastTakingTime = Util.simplifyTime(submitData.lastTakingTime);

      var scaleSympInfoList = deepCopy(this.scaleSymptomList);
      submitData.scaleSympInfoList = [];
      for (let symptom of scaleSympInfoList) {
        if (symptom.status) {
          symptom.ariseTime = Util.simplifyTime(symptom.ariseTime);
          delete symptom.status;
          submitData.scaleSympInfoList.push(symptom);
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
      submitData.scaleFiles = this.newOther;

      this.lockSubmitButton = false;
      if (this.mode === this.ADD_NEW_CARD) {
        // console.log('add', submitData);
        addScaleInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.closePanel();
        }, this._handleError);

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        // console.log('modify', submitData);
        modifyScaleInfo(submitData).then(() => {
          Bus.$emit(this.UPDATE_CASE_INFO);
          this.closePanel();
        }, this._handleError);
      }
    },
    _handleError(error) {
      console.log(error);
      this.lockSubmitButton = false;
    },
    closePanel() {
      this.lockSubmitButton = false;
      this.displayModal = false;
      this.quicklyMode = false;  // 切换到常规答题模式
      this.answerModeChanged = false;  // 初始化模式修改状态
    },
    transformToNum(obj, propertyName, stepping, maxValue) {
      // 步进值 stepping 如果没有传值进来，则默认为 0.1
      // 最大值 maxValue 如果没有传值进来，则不设最大值
      if (obj[propertyName] !== '') {
        var value = parseFloat(obj[propertyName]);
        if (isNaN(value)) {
          obj[propertyName] = '';
        } else {
          stepping = stepping ? stepping : 0.1;
          // 下面这行是为了确定小数位数，要不然在待会做乘法的时候可能会出现 .000000001 这样的问题
          var decimalDigits = 2;
          // if (stepping.toString().split('.')[1] !== undefined) {
          //   decimalDigits = stepping.toString().split('.')[1].length;
          // }
          //
          // var count = Math.round(value / stepping);
          // var newValue = stepping * count;
          var newValue = Number(value.toFixed(decimalDigits));
          if (newValue < 0) {
            newValue = 0;
          } else if (maxValue !== undefined && newValue > maxValue) {
            newValue = maxValue;
          }
          obj[propertyName] = newValue;
        }
      }
    },
    getCorrectAnswer() {
      // 取出量表的选中答案以及对应的分数
      if (!this.targetScale.questions) {
        return;
      }

      if (this.targetScale.questions && this.copyInfo.patientOptions &&
        this.copyInfo.patientOptions.length !== this.targetScale.questions.length) {
        this.copyInfo.patientOptions = [];
        for (let i = 0; i < this.targetScale.questions.length; i++) {
          this.$set(this.copyInfo.patientOptions, i, {});

          // 判断单选/多选 multipleChoose: 1 多选
          if (this.targetScale.questions[i].multipleChoose === 1) {
            this.$set(this.copyInfo.patientOptions[i], 'scaleOptionId', []);
          } else {
            this.$set(this.copyInfo.patientOptions[i], 'scaleOptionId', '');
          }

          this.$set(this.copyInfo.patientOptions[i], 'remarks', '');
          this.$set(this.copyInfo.patientOptions[i], 'optionPoint', '');
        }
      }

      for (var i = 0; i < this.targetScale.questions.length; i++) {
        let options = this.targetScale.questions[i].options;
        let notExisted = true;
        let mutltiSelect = this.targetScale.questions[i].multipleChoose === 1;
        let targetOptionId = mutltiSelect ? [] : '';
        let remarks = '';
        let optionPoint = '';

        for (let option of options) {
          for (let answer of this.scaleAnswer) {
            if (option.scaleOptionId === answer.scaleOptionId) {
              notExisted = false;
              if (mutltiSelect) {
                targetOptionId.push(option.scaleOptionId);
              } else {
                targetOptionId = option.scaleOptionId;
              }
              remarks = answer.remarks ? answer.remarks : '';
              optionPoint = answer.optionPoint ? answer.optionPoint : '';
            }
          }
        }
        if (notExisted) {
          // 判断单选/多选 multipleChoose: 1 多选
          if (this.targetScale.questions[i].multipleChoose === 1) {
            this.$set(this.copyInfo.patientOptions[i], 'scaleOptionId', []);
          } else {
            this.$set(this.copyInfo.patientOptions[i], 'scaleOptionId', '');
          }
        } else {
          this.$set(this.copyInfo.patientOptions[i], 'scaleOptionId', targetOptionId);
          this.$set(this.copyInfo.patientOptions[i], 'remarks', remarks);
          this.$set(this.copyInfo.patientOptions[i], 'optionPoint', optionPoint);
        }
      }
    },
    getScaleTypeCode(scaleInfoId) {
      var scale = Util.getElement('scaleInfoId', scaleInfoId, this.allScale);
      return scale.gaugeType;
    },
    getOptions(fieldName) {
      var options = [];
      var typesInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typesInfo.types ? typesInfo.types : [];
      for (let type of types) {
        options.push({
          code: type.typeCode,
          name: type.typeName
        });
      }
      return options;
    },
    initPatientScale(item) {
      // 初始化copyInfo对象
      this.copyInfo = {};
      if (this.mode === this.ADD_NEW_CARD) {
        this.scaleName = '';
      }
      this.$set(this.copyInfo, 'scaleInfoId', '');
      this.$set(this.copyInfo, 'switchType', '');
      this.$set(this.copyInfo, 'inspectTime', '');
      this.$set(this.copyInfo, 'lastTakingTime', '');
      this.$set(this.copyInfo, 'scaleExtraInfo', '');
      this.$set(this.copyInfo, 'patientOptions', []);
      this.$set(this.copyInfo, 'scaleSympInfoList', []);
      this.$set(this.copyInfo, 'patientCaseId', this.$route.params.caseId);
      this.$set(this.copyInfo, 'patientId', this.$route.params.id);
      vueCopy(item, this.copyInfo);
      if (item.id !== undefined) {
        this.copyInfo.id = item.id;
      }
    },
    initSymptomList() {
      var typesInfo = Util.getElement('typegroupcode', 'scaleSymp', this.typeGroup);
      var types = typesInfo.types ? typesInfo.types : [];

      this.scaleSymptomList = [];
      for (let i = 0; i < types.length; i++) {
        this.$set(this.scaleSymptomList, i, {});
        this.$set(this.scaleSymptomList[i], 'status', false);
        this.$set(this.scaleSymptomList[i], 'ariseTime', '');
        this.$set(this.scaleSymptomList[i], 'scaleMedicine', '');
        this.$set(this.scaleSymptomList[i], 'sympName', types[i].typeName);
        this.$set(this.scaleSymptomList[i], 'sympCode', types[i].typeCode);

        if (this.copyInfo.scaleSympInfoList) {
          for (let patientScaleSymptom of this.copyInfo.scaleSympInfoList) {
            if (patientScaleSymptom.sympName === types[i].typeName) {
              this.$set(this.scaleSymptomList, i, patientScaleSymptom);
              this.$set(this.scaleSymptomList[i], 'status', true);
            }
          }
        }
      }
    },
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
      if (response.code === 0) {
        let id = response.data.scaleFileId;
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
    // 问题列表递归处理
    questionsListFormat(questionsList) {
      let list = questionsList.questions;
      for (let i = 0; i < list.length; i++) {
        if (list[i].questions && list[i].questions.length > 0) {
          // 获取父级触发展开子列表的答案ID
          let parentId = '';
          for (let j = 0; j < list[i].options.length; j++) {
            if (list[i].options[j].openFlag === 1) {
              parentId = list[i].options[j].scaleOptionId;
              break;
            }
          }
          // 多维列表转化为一维
          for (let k = 0; k < list[i].questions.length; k++) {
            list[i].questions[k].parentId = parentId;
            list.splice(i + k + 1, 0, list[i].questions[k]);
          }
          delete list[i].questions;
        }
      }
    },
    // 校验父级问题答案是否触发子列表显示
    checkQuestionListIsShow(parentId, index) {
      let optionsList = this.copyInfo.patientOptions;
      for (let i = 0; i < optionsList.length; i++) {
        if (optionsList[i].scaleOptionId === parentId) {
          return true;
        }
      }
      // 不显示时清空当前选择的值
      this.copyInfo.patientOptions[index].scaleOptionId = '';
      return false;
    },
    // 切换答题模式，第一次由快速答题切换至常规答题时序弹窗提示是否跳转到第一道未答题目
    changeAnswerMode() {
      this.quicklyMode = !this.quicklyMode;
      if (this.mode === this.EDIT_CURRENT_CARD) {
        if (this.answerModeChanged === false && this.quicklyMode === false) {
          this.scrollToQuestion();
        }
        this.answerModeChanged = true;
      }
    },
    // 编辑模式下 跳转至第一道未答题目
    scrollToQuestion() {
      this.$confirm('是否需要定位到未作答的题目?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        // 跳转到未答题目
        const container = this.$refs.scrollArea;
        let firstLevelSelect = [];  // 选中的父级题目集合，此处为包含嵌套题目的量表做特殊处理，目前只考虑存在二级题目的情况，由于题目嵌套格式V2.4.0有所修改，所以此处不再进一步完善
        for (let i = 0; i < this.copyInfo.patientOptions.length; i++) {
          if (!this.copyInfo.patientOptions[i].scaleOptionId || this.copyInfo.patientOptions[i].scaleOptionId.length === 0) {
            if (this.targetScale.questions[i].parentId && firstLevelSelect.indexOf(this.targetScale.questions[i].parentId) !== -1) {
              console.log(this.$el.querySelector('#questions_' + i).offsetTop, i, 'child');
              container.scrollTop = this.$el.querySelector('#questions_' + i).offsetTop;
              break;
            } else if (!this.targetScale.questions[i].questionLevel) {
              console.log(this.$el.querySelector('#questions_' + i).offsetTop, i, 'parent');
              container.scrollTop = this.$el.querySelector('#questions_' + i).offsetTop;
              break;
            }
          } else if (!this.targetScale.questions[i].questionLevel) {
            firstLevelSelect.push(this.targetScale.questions[i].scaleInfoId);
          }
        }
      });
    }
  },
  mounted() {
    // 初始化提交到服务器的对象
    Bus.$on(this.SHOW_SCALE_MODAL, this.showModal);
    Bus.$on(this.SCROLL_AREA_SIZE_CHANGE, this.updateScrollbar);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollbar);
  },
  beforeDestroy() {
    Bus.$off(this.SHOW_SCALE_MODAL, this.showModal);
    Bus.$off(this.SCROLL_AREA_SIZE_CHANGE);
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  },
  components: {
    FoldingPanel
  },
  watch: {
    '$route.path'() {
      if (this.displayModal) {
        this.closePanel();
      }
    },
    typeGroup: function() {
      this.initSymptomList();
    },
    targetScale: function() {
      this.quickAnswer = this.targetScale.quickAnswer === 1;
      if (this.mode === this.ADD_NEW_CARD) {
        // 只有在新增模式下，才允许更换量表，一旦这样做，就要清空答题信息
        this.$set(this.copyInfo, 'patientOptions', []);
      }
      this.getCorrectAnswer();
    },
    scaleName() {
      this.handleScaleSelect();
    }
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
@title-bar-height: 40px;
@title-bar-margin-bottom: 10px;
@margin-right: 15px;
@title-left-padding: 30px;
@title-bottom-padding: 10px;
@select-top-padding: 12px;

@symptom-item-title-padding: 30px;
@symptom-item-title-width: 130px;

@field-name-width: 95px;
@field-line-height: 25px;

.diagnostic-update-wrapper {
  width: 100%;
  background-color: @screen-color;
  transition: 0.5s ease-in-out;
  &.slide-outside {
    transform: translate3d(100%, 0, 0);
  }
  .title-bar {
    position: relative;
    height: @title-bar-height;
    margin-right: @margin-right;
    margin-bottom: 5px;
    background-color: @background-color;
    .title {
      margin: 0;
      position: absolute;
      display: inline-block;
      padding-left: 20px;
      left: 0;
      width: 100%;
      height: @title-bar-height;
      line-height: @title-bar-height;
      text-align: left;
      font-size: @large-font-size;
      cursor: pointer;
      color: @font-color;
      .complete-status {
        color: light-font-color;
      }
    }
    .button {
      position: absolute;
      top: 6px;
      width: @small-button-width;
      height: @small-button-height;
      line-height: @small-button-height;
      color: #fff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
      &.back-button {
        background-color: @secondary-button-color;
        right: 10px;
      }
      &.edit-button {
        background-color: @button-color;
        right: 100px;
      }
      &.save-button {
        background-color: @button-color;
        right: 100px;
      }
    }
  }
  .scroll-area {
    position: relative;
    width: 100%;
    height: calc(~"100% - @{title-bar-height} - @{title-bar-margin-bottom}");
    padding-right: @margin-right;
    box-sizing: border-box;
    overflow: hidden;
    .scale-questions {
      position: relative;
      margin-bottom: @vertical-spacing;
      padding: 0 @title-left-padding 10px;
      text-align: left;
      background: white;
      font-size: 14px;;
      box-sizing: border-box;
      .question-title {
        margin: 0;
        padding: 15px 0;
        line-height: 25px;
        font-weight: bold;
        color: @font-color;
        &>u {
          text-decoration: none;
          border-bottom: 2px solid @font-color;
        }
        &.notice-empty {
          color: #ff0000;
        }
      }
      .question-body {
        display: inline-block;
        margin: 0;
        padding: 0;
        color: @secondary-button-color;
        font-weight: normal;
        .question-selection {
          display: block;
          margin: 0;
          height: auto;
          line-height: 40px;
          .el-radio__label {
            display: inline-block;
            width: 80%;
            height: 40px;
            // white-space: pre-wrap;
            // word-wrap: break-word;
            // word-break: normal;
            .el-input {
              margin-left: 20px;
              width: 300px;
              .el-input__inner {
                height: 30px;
                border: 1px solid @inverse-font-color;
                background-color: @screen-color;
              }
              &.is-disabled {
                .el-input__inner {
                  background-color: #f6f7f8;
                  color: @gray-color;
                }
              }
            }
          }
          .is-disabled {
            .el-radio__inner {
              background-color: @inverse-font-color;
              border-color: @inverse-font-color;
            }
            &+.el-radio__label {
              color: @inverse-font-color;
            }
          }
        }
        &.el-input {
          width: 90%;
          &.point-input {
            width: 100px;
          }
          .el-input__inner {
            height: 30px;
            border: 1px solid @inverse-font-color;
            background-color: @screen-color;
          }
          &.is-disabled {
            .el-input__inner {
              background-color: #f6f7f8;
              color: @gray-color;
            }
          }
        }
      }
      .extra-info {
        white-space: nowrap;
      }
    }
    .scale-selector {
      text-align: left;
      width: 100%;
      background: white;
      font-size: 0px;
      margin-right: @margin-right;
      margin-bottom: @vertical-spacing;
      padding: @select-top-padding @title-left-padding;
      box-sizing: border-box; // overflow: hidden;
      .field {
        display: inline-block;
        position: relative;
        width: 50%;
        min-height: 45px;
        line-height: @field-line-height;
        vertical-align: top;
        text-align: left;
        &.whole-line {
          width: 100%;
          .field-value {
            width: calc(~"98% - @{field-name-width}");
          }
        }
        .field-name {
          display: inline-block;
          position: absolute;
          width: @field-name-width;
          font-size: @normal-font-size;
          line-height: @field-line-height;
          .required-mark {
            color: red;
            font-size: 20px;
            vertical-align: middle;
          }
        }
        .field-value {
          display: inline-block;
          position: relative;
          left: @field-name-width;
          width: calc(~"96% - @{field-name-width}");
          font-size: @normal-font-size;
          line-height: @field-line-height;
          .warning-text {
            position: absolute;
            top: 22px;
            left: 10px;
            height: 15px;
            color: red;
            font-size: @small-font-size;
          }
          .warning .el-input__inner, .warning .el-textarea__inner {
            border: 1px solid red;
          }
        }
        .el-input {
          transform: translateY(-3px);
          .el-input__inner {
            height: 30px;
            font-size: @normal-font-size;
            border: none;
            background-color: @screen-color;
          }
          &.is-disabled {
            .el-input__inner {
              background-color: #f6f7f8;
              color: @gray-color;
            }
          }
        }
        .el-textarea {
          transform: translateY(-3px);
          .el-textarea__inner {
            border: none;
            background-color: @screen-color;
          }
        }
        .el-select {
          width: 100%;
          .el-input__inner {
            height: 30px;
          }
        }
        .el-autocomplete {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
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
    .associated-symptom {
      margin-bottom: @vertical-spacing;
      width: 100%;
      text-align: left;
      .symptom-item {
        // 这是一个关联症状的外层盒子
        display: inline-block;
        position: relative;
        width: 100%;
        box-sizing: border-box;
        padding: 0 @symptom-item-title-padding;
        font-size: 0;
        line-height: 50px;
        height: 50px;
        .el-input {
          .el-input__inner {
            height: 30px;
            border: none;
            background-color: @screen-color;
          }
          &.is-disabled {
            .el-input__inner {
              background-color: #f6f7f8;
              color: @gray-color;
            }
          }
        }
        .symptom-item-title {
          display: inline-block;
          width: @symptom-item-title-width;
          .el-checkbox__input {
            position: relative;
            top: -5px;
            &.is-disabled {
              .el-checkbox__inner {
                background-color: @inverse-font-color;
                border-color: @inverse-font-color;
              }
              &+.el-checkbox__label {
                color: @inverse-font-color;
              }
            }
          }
        }
        .symptom-item-start, .symptom-item-dose {
          display: inline-block;
          position: relative;
          width: calc(~"50% - @{symptom-item-title-width}/2");
          font-size: 0;
          .field-name {
            display: inline-block;
            width: 90px;
            text-align: center;
            font-size: @normal-font-size;
            color: @light-font-color;
          }
          .el-input {
            position: absolute;
            left: 85px;
            right: 4%;
            width: auto;
          }
        }
      }
    }
    .quickly-answer{
      .quickly-title{
        height: 28px;
        margin-bottom: 10px;
      }
      .quickly-button{
        float: right;
        width: @small-button-width;
        height: @small-button-height;
        margin: 5px 10px 0 0;
        line-height: @small-button-height;
        color: #fff;
        cursor: pointer;
        background-color: @button-color;
      }
      .answer-form{
        width: 100%;
        text-align: left;
        background-color: #fff;
        border-width: 1px;
        border-style: solid;
        border-color: #ccc;
        border-collapse: collapse;
        .form-cell{
          display: inline-block;
          width: 20%;
          height: 100px;
          padding: 0 20px;
          line-height: 50px;
          text-align: center;
          border-style: solid;
          border-width: 0 1px 1px 0;
          border-color: #ccc;
          box-sizing: border-box;
          &.notice-empty {
            color: #ff0000;
            .el-input__inner {
              border: 1px solid #ff0000;
              &::-webkit-input-placeholder {
                color: #ff0000;
              }
              &:-moz-placeholder {
                color: #ff0000;
              }
              &::-moz-placeholder {
                color: #ff0000;
              }
              &:-ms-input-placeholder {
                color: #ff0000;
              }
            }
            .el-input__icon{
              color: #ff0000;
            }
          }
          .cell-title{
            height: 50px;
            border-bottom: 1px solid #dfdfdf;
          }
          .cell-input{
            position: relative;
            height: 50px;
            padding-right: 20px;
            .el-autocomplete{
              width: 100%;
            }
            .cell-key{
              position: absolute;
              top: 0;
              right: 10px;
            }
          }
        }
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: -2px;
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

.clearfix:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
}
</style>
