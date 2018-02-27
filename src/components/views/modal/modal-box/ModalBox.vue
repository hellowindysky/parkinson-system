<template lang="html">
  <div class="modal-box-wrapper">
    <div class="modal-box" :class="{'high-box': modalType === DISEASE_HISTORY_MODAL}" ref="scrollArea">
      <h3 class="title">{{title}}</h3>

      <!-- 这个 field 是专门为个人史准备的，用来确定最终的 template 到底是哪个子类 -->
      <div class="field" v-show="modalType === PERSON_HISTORY_MODAL">
        <span class="field-name">
          个人史类型
          <span class="required-mark">*</span>
        </span>
        <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          {{getSubModalVal(subModalType)}}
        </span>
        <span class="field-input" v-else>
          <span class="warning-text">{{getWarningText('subModal')}}</span>
          <el-select v-model="subModalType" :class="{'warning': warningResults['subModal']}"
            placeholder="请输入个人史类型" @change="chooseSubModal" :disabled="disableChangingSubModal">
            <el-option label="饮酒史" :value="WINE_HISTORY_MODAL"></el-option>
            <el-option label="吸烟史" :value="SMOKE_HISTORY_MODAL"></el-option>
            <el-option label="喝茶史" :value="TEA_HISTORY_MODAL"></el-option>
            <el-option label="咖啡史" :value="COFFEE_HISTORY_MODAL"></el-option>
            <el-option label="锻炼史" :value="EXERCISE_HISTORY_MODAL"></el-option>
          </el-select>
        </span>
      </div>
      <div class="seperate-line" v-show="this.modalType === this.PERSON_HISTORY_MODAL && this.subModalType !== ''"></div>

      <div class="field" v-for="field in template" :class="{'field-unit': field.fieldName === 'unit'}">
        <span class="field-name">
          {{field.cnfieldName}}
          <span class="required-mark" v-show="field.must===1">*</span>
        </span>
        <span class="field-input" v-if="mode===VIEW_CURRENT_CARD">
          <span v-if="getUIType(field)===3">
            {{getFieldValue(field)}}
          </span>
          <span v-else-if="getUIType(field)===9">
            <div class="last-files">
              <div class="last-files-title">已上传的家系图</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in familyTreeView">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel"></i>
              </div>
            </div>
          </span>
          <span v-else>{{copyInfo[field.fieldName]}}</span>
        </span>
        <span class="field-input" v-else :class="{doseInfo: field.fieldName === 'doseInfo'&&subModalType!==SMOKE_HISTORY_MODAL}">
          <span class="warning-text">{{getWarningText(field.fieldName)}}</span>
          <span v-if="getUIType(field)===1">
            <el-input v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)" :maxlength="500"
              :type="getInputType(field.fieldName)"></el-input>
          </span>
          <span v-else-if="getUIType(field)===3">
            <el-select v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}"
              :placeholder="getMatchedField(field).cnFieldDesc" @change="updateWarning(field)">
              <el-option v-for="type in getTypes(field)" :label="type.typeName"
                :value="type.typeCode" :key="type.typeName"></el-option>
            </el-select>
          </span>
          <span v-else-if="getUIType(field)===6">
            <el-date-picker v-model="copyInfo[field.fieldName]" :class="{'warning': warningResults[field.fieldName]}" type="date"
              :placeholder="getMatchedField(field).cnFieldDesc" :picker-options="pickerOptions" format="yyyy-MM-dd" @change="updateWarning(field)"></el-date-picker>
          </span>
          <span v-else-if="getUIType(field)===9">
            <div class="last-files">
              <div class="last-files-title">已上传的家系图</div>
              <div class="file" :class="{'editing': mode!==VIEW_CURRENT_CARD}" v-for="file in familyTreeView">
                <i class="el-icon-document icon"></i>
                <span class="file-name" @click="downloadFile(file)">{{file.fileName}}</span>
                <i class="close-button iconfont icon-cancel" @click="removeFile(file, familyTreeView, copyInfo['patientFamilyTree'])"></i>
              </div>
            </div>
            <el-upload
              class="upload-area"
              :action="uploadUrl"
              ref="uploadTag"
              :disabled="mode===VIEW_CURRENT_CARD"
              :data="fileParam"
              :multiple="true"
              :auto-upload="true"
              :on-change="fileChange"
              :before-upload="beforeUpload"
              :on-success="uploadTreeSuccess"
              :on-error="uploadErr"
              :on-remove="handleTreeRemove"
              :file-list="fileList">
              <el-button slot="trigger" size="small" type="text" :disabled="mode===VIEW_CURRENT_CARD" v-show="mode!==VIEW_CURRENT_CARD">
                点击上传
              </el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </span>
        </span>
      </div>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div v-if="mode===EDIT_CURRENT_CARD || mode===ADD_NEW_CARD"
        class="button submit-button" @click="submit">确定</div>
      <div v-else-if="mode===VIEW_CURRENT_CARD && canEdit"
        class="button edit-button" @click="switchToEditingMode">编辑</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';
import Util from 'utils/util.js';
import { baseUrl, getCommonRequest } from 'api/common.js';

import { addPatientPresentHistory, modifyPatientPresentHistory,
         addPatientMedHistory, modifyPatientMedHistory,
         addPatientDisease, modifyPatientDisease,
         addPatientFamily, modifyPatientFamily,
         addPatientToxicExposure, modifyPatientToxicExposure,
         addPatientCoffee, modifyPatientCoffee,
         addPatientTea, modifyPatientTea,
         addPatientWine, modifyPatientWine,
         addPatientSmoke, modifyPatientSmoke,
         addPatientExercise, modifyPatientExercise
       } from 'api/patient.js';

export default {
  data() {
    return {
      mode: '',
      modalType: '',
      subModalType: '',
      disableChangingSubModal: false,
      title: '',
      copyInfo: {},
      familyTreeView: [],
      warningResults: {},
      lockSubmitButton: false,   // 这个变量用来锁住确定按钮，避免短时间内多次点击造成重复提交
      uploadingFilesNum: 0,
      uploadUrl: baseUrl + '/upload/uploadPatientFamilyTree',
      downloadUrl: baseUrl + '/download/',
      fileParam: getCommonRequest(),
      fileList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'presentHistoryTemplate',
      'medHistoryTemplate',
      'diseaseHistoryTemplate',
      'familyHistoryTemplate',
      'coffeeHistoryTemplate',
      'teaHistoryTemplate',
      'smokeHistoryTemplate',
      'wineHistoryTemplate',
      'exerciseHistoryTemplate',
      'toxicExposureHistoryTemplate',

      'presentHistoryDictionary',
      'medHistoryDictionary',
      'diseaseHistoryDictionary',
      'familyHistoryDictionary',
      'coffeeHistoryDictionary',
      'teaHistoryDictionary',
      'smokeHistoryDictionary',
      'wineHistoryDictionary',
      'exerciseHistoryDictionary',
      'toxicExposureHistoryDictionary',

      'typeGroup'
    ]),
    dictionary() {
      if (this.modalType === this.PRESENT_HISTORY_MODAL) {
        return this.presentHistoryDictionary;
      } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
        return this.medHistoryDictionary;
      } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
        return this.diseaseHistoryDictionary;
      } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
        return this.familyHistoryDictionary;
      } else if (this.modalType === this.PERSON_HISTORY_MODAL) {
        // 如果是个人史面板，则有几个子模版，需要在选择个人史子类型后，自动确定新的 dictionary
        if (this.subModalType === this.WINE_HISTORY_MODAL) {
          return this.wineHistoryDictionary;
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          return this.teaHistoryDictionary;
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          return this.coffeeHistoryDictionary;
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          return this.smokeHistoryDictionary;
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          return this.exerciseHistoryDictionary;
        } else {
          return [];
        }
      } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
        return this.toxicExposureHistoryDictionary;
      } else {
        return [];
      }
    },
    template() {
      if (this.modalType === this.PRESENT_HISTORY_MODAL) {
        return this.presentHistoryTemplate;
      } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
        if (this.copyInfo['medType'] === 6) {
          // 药物类型 选择 否认存在其他用药史 时，把不必要的提交字段,不要的验证删了
          for (let key in this.copyInfo) {
            if (key !== 'medType' && key !== 'remarks' && key !== 'patientMedHistoryId') {
              delete this.copyInfo[key];
            };
          }
          for (let key in this.warningResults) {
            if (key !== 'medType') {
              delete this.warningResults[key];
            };
          }
          return this.medHistoryTemplate.filter((obj) => {
            return obj.fieldName === 'medType' || obj.fieldName === 'remarks';
          });
        } else {
          return this.medHistoryTemplate;
        }
      } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
        if (this.copyInfo['diseaseRelationId'] === 10) { // 30 10
          // 疾病名称 选择 否认存在既往史 时，把不必要的提交字段,不要的验证删了，此处没有不要的验证
          for (let key in this.copyInfo) {
            if (key !== 'diseaseRelationId' && key !== 'remarks' && key !== 'patientDiseaseId') {
              delete this.copyInfo[key];
            };
          }
          return this.diseaseHistoryTemplate.filter((obj) => {
            return obj.fieldName === 'diseaseRelationId' || obj.fieldName === 'remarks';
          });
        } else {
          return this.diseaseHistoryTemplate;
        }

      } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
        if (this.copyInfo['similarRole'] === 6) {
          // 类似疾病家族成员 选择 否认存在家族史 时，把不必要的提交字段,不要的验证删了
          for (let key in this.copyInfo) {
            if (key !== 'similarRole' && key !== 'remarks' && key !== 'patientFamilyId') {
              delete this.copyInfo[key];
            };
          }
          for (let key in this.warningResults) {
            if (key !== 'similarRole') {
              delete this.warningResults[key];
            };
          }
          return this.familyHistoryTemplate.filter((obj) => {
            return obj.fieldName === 'similarRole' || obj.fieldName === 'remarks';
          });
        } else {
          return this.familyHistoryTemplate;
        }

      } else if (this.modalType === this.PERSON_HISTORY_MODAL) {
        // 如果是个人史面板，则有几个子模版，需要在选择个人史类型后，自动确定新的模版
        if (this.subModalType === this.WINE_HISTORY_MODAL) {
          if (this.copyInfo['patientHabitId'] === 13) { // 19
            // 饮酒类型 选择 否认存在饮酒史 时，把不必要的提交字段,不要的验证删了
            for (let key in this.copyInfo) {
              if (key !== 'patientHabitId' && key !== 'remarks' && key !== 'patientWineId') {
                delete this.copyInfo[key];
              };
            }
            for (let key in this.warningResults) {
              if (key !== 'patientHabitId') {
                delete this.warningResults[key];
              };
            }
            return this.wineHistoryTemplate.filter((obj) => {
              return obj.fieldName === 'patientHabitId' || obj.fieldName === 'remarks';
            });
          } else {
            return this.wineHistoryTemplate;
          }

        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          if (this.copyInfo['patientHabitId'] === 14) { // 21
            // 喝茶类型 选择 否认存在喝茶史 时，把不必要的提交字段,不要的验证删了
            for (let key in this.copyInfo) {
              if (key !== 'patientHabitId' && key !== 'remarks' && key !== 'patientTeaId') {
                delete this.copyInfo[key];
              };
            }
            for (let key in this.warningResults) {
              if (key !== 'patientHabitId') {
                delete this.warningResults[key];
              };
            }
            return this.teaHistoryTemplate.filter((obj) => {
              return obj.fieldName === 'patientHabitId' || obj.fieldName === 'remarks';
            });
          } else {
            return this.teaHistoryTemplate;
          }

        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          if (this.copyInfo['patientHabitId'] === 15) { // 20
            // 咖啡类型 选择 否认存在咖啡史 时，把不必要的提交字段,不要的验证删了
            for (let key in this.copyInfo) {
              if (key !== 'patientHabitId' && key !== 'remarks' && key !== 'patientCoffeeId') {
                delete this.copyInfo[key];
              };
            }
            for (let key in this.warningResults) {
              if (key !== 'patientHabitId') {
                delete this.warningResults[key];
              };
            }
            return this.coffeeHistoryTemplate.filter((obj) => {
              return obj.fieldName === 'patientHabitId' || obj.fieldName === 'remarks';
            });
          } else {
            return this.coffeeHistoryTemplate;
          }

        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          if (this.copyInfo['patientHabitId'] === 12) { // 18
            // 吸烟类型 选择 否认存在吸烟史 时，把不必要的提交字段,不要的验证删了
            for (let key in this.copyInfo) {
              if (key !== 'patientHabitId' && key !== 'remarks' && key !== 'patientSmokeId') {
                delete this.copyInfo[key];
              };
            }
            for (let key in this.warningResults) {
              if (key !== 'patientHabitId') {
                delete this.warningResults[key];
              };
            }
            return this.smokeHistoryTemplate.filter((obj) => {
              return obj.fieldName === 'patientHabitId' || obj.fieldName === 'remarks';
            });
          } else if (this.copyInfo['patientHabitId'] === 17) { // 16
            for (let key in this.warningResults) {
              if (key === 'doseInfo') {
                delete this.warningResults[key];
                delete this.copyInfo[key];
              };
            }
            return this.smokeHistoryTemplate.filter((obj) => {
              return obj.fieldName !== 'doseInfo';
            });
          } else {
            return this.smokeHistoryTemplate;
          }
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          return this.exerciseHistoryTemplate;
        } else {
          return [];
        }
      } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
        if (this.copyInfo['exposedType'] === 8) {
          // 毒物接触史 选择 否认存在毒物接触史 时，把不必要的提交字段,不要的验证删了
          for (let key in this.copyInfo) {
            if (key !== 'exposedType' && key !== 'remarks' && key !== 'patientCideexposedId') {
              delete this.copyInfo[key];
            };
          }
          for (let key in this.warningResults) {
            if (key !== 'exposedType') {
              delete this.warningResults[key];
            };
          }
          return this.toxicExposureHistoryTemplate.filter((obj) => {
            return obj.fieldName === 'exposedType' || obj.fieldName === 'remarks';
          });
        } else {
          return this.toxicExposureHistoryTemplate;
        }
      } else {
        return [];
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
    clearFieldOfCopyInfoAndWarning() {
      /* template计算属性里面的删除字段的操作可以写到这里面，
        然后在watch里面当template改变的时候去执行这个方法，
        template里面就不用重复那么多东西，
        还没试过，不知行不行 */
    },
    fileChange() {
      this.updateScrollbar();
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
    uploadTreeSuccess(response, file, fileList) {
      this.uploadSuccess(response, file, fileList, this.copyInfo['patientFamilyTree']);
    },
    uploadSuccess(response, file, fileList, treeList) {
      this.uploadingFilesNum -= 1;
      if (response.code === 0) {
        let id = response.data.patientFamilyTreeId;
        treeList.push({
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
    handleTreeRemove(file) {
      this.handleRemove(file, this.copyInfo['patientFamilyTree']);
    },
    handleRemove(file, treeList) {
      if (file.status === 'uploading') {
        this.uploadingFilesNum -= 1;
      }
      for (var i = 0; i < treeList.length; i++) {
        if (file.response.data.patientFamilyTreeId === treeList[i].id) {
          treeList.splice(i, 1);
          break;
        }
      }
      this.updateScrollbar();
    },
    downloadFile(file) {
      window.location.href = this.downloadUrl + file.realPath;
    },
    removeFile(file, showingList, transferringList) {
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
    uploadErr(err, file, fileList) {
      this.uploadingFilesNum -= 1;
      console.log('upload error: ', err);
      console.log('file: ', file);
      console.log('fileList', fileList);
    },
    showPanel(cardOperation, title, originalInfo, modalType) {
      // this.displayModal = true;
      // 由 cardOperation 来决定，到底是新增记录，浏览记录，还是修改记录
      // 这三个值分别为 this.ADD_NEW_CARD, this.VIEW_CURRENT_CARD, this.EDIT_CURRENT_CARD
      this.mode = cardOperation;
      // 如果传过来的 modalType 是个人史下的子类，则将其赋值为 this.subModalType，而 this.modalType 还是个人史
      // 同时，还要禁止个人史下子类的选择，因为此时子类不可更换
      const SUB_MODAL_LIST = [this.TEA_HISTORY_MODAL, this.COFFEE_HISTORY_MODAL, this.WINE_HISTORY_MODAL, this.SMOKE_HISTORY_MODAL, this.EXERCISE_HISTORY_MODAL];
      if (SUB_MODAL_LIST.indexOf(modalType) > -1) {
        this.subModalType = modalType;
        this.modalType = this.PERSON_HISTORY_MODAL;
        this.disableChangingSubModal = true;
      } else {
        this.subModalType = '';
        this.modalType = modalType;
        this.disableChangingSubModal = false;
      }

      this.title = title;
      this.copyInfo = Object.assign({}, originalInfo);
      this.familyTreeView = Object.assign([], originalInfo.patientFamilyTree);
      // 每次打开这个模态框，都会重新初始化 this.copyInfo
      this.initCopyInfo();

      // 清空警告信息
      // 改变 copyInfo 的时候会触发 warningResults 的跟踪变化（这里的自动触发是由 el-date-picker 的 v-model造成的）
      // 因此这一步要等到 copyInfo 变化结束之后再执行，我们将其放到下一个事件循环 tick 中
      this.$nextTick(() => {
        this.clearWarning();
      });

      for (var i = 0; i < this.template.length; i++) {
      }

      this.updateScrollbar();
    },
    switchToEditingMode() {
      this.mode = this.EDIT_CURRENT_CARD;
      this.updateScrollbar();
    },
    updateScrollbar() {
      // 如果不写在 $nextTick() 里面，第一次加载的时候也许会不能正确计算高度。估计是因为子组件还没有全部加载所造成的。
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    cancel() {
      this.lockSubmitButton = false;
      if (this.modalType === this.FAMILY_HISTORY_MODAL && this.mode !== this.VIEW_CURRENT_CARD) {
        this.$refs.uploadTag && this.$refs.uploadTag[0] && this.$refs.uploadTag[0].clearFiles();
      };
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
    },
    submit() {
      // 如果确定按钮被锁住了，则不执行下面的逻辑，防止重复点击
      if (this.lockSubmitButton) {
        return;
      }
      this.lockSubmitButton = true;

      // 对于特殊的个人史，检查 subModal 字段是否有被选择
      if (this.modalType === this.PERSON_HISTORY_MODAL && this.subModalType === '') {
        this.$set(this.warningResults, 'subModal', '请选择');
      }

      // 检查是否每个字段都合格，检查一遍之后，如果 warningResults 的所有属性值都为空，就证明表单符合要求
      for (let field of this.template) {
        this.updateWarning(field);
      }
      for (let fieldName in this.warningResults) {
        if (this.warningResults[fieldName]) {
          this.lockSubmitButton = false;
          return false;
        }
      };
      // 准备提交之前，需要将日期格式调整成符合服务器传输的字符串
      for (let field of this.template) {
        if (this.getUIType(field) === 6) {
          var dateStr = this.copyInfo[field.fieldName];
          this.copyInfo[field.fieldName] = Util.simplifyDate(dateStr);
        }
      };
      var startTime;
      var endTime;
      if (this.modalType === this.PERSON_HISTORY_MODAL) {
        startTime = this.copyInfo.startTime;
        endTime = this.copyInfo.endTime;
      };
      if (this.modalType === this.DISEASE_HISTORY_MODAL) {
        startTime = this.copyInfo.beginTime;
        endTime = this.copyInfo.endTime;
      };
      if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
        startTime = this.copyInfo.medStart;
        endTime = this.copyInfo.medEnd;
      };
      if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning',
          duration: 2000
        });
        this.lockSubmitButton = false;
        return;
      };
      this.copyInfo.patientId = parseInt(this.$route.params.id, 10);
      // 到这里，检验合格，准备提交数据了
      if (this.mode === this.ADD_NEW_CARD) {
        if (this.modalType === this.PRESENT_HISTORY_MODAL) {
          addPatientPresentHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
          addPatientMedHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
          addPatientDisease(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
          if (this.uploadingFilesNum > 0) {
            this.$message({
              message: '请等待文件上传后再提交',
              type: 'warning',
              duration: 2000
            });
            this.lockSubmitButton = false;
            return;
          }
          addPatientFamily(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
          addPatientToxicExposure(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          addPatientCoffee(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          addPatientTea(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.WINE_HISTORY_MODAL) {
          addPatientWine(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          addPatientSmoke(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          addPatientExercise(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        }

      } else if (this.mode === this.EDIT_CURRENT_CARD) {
        if (this.modalType === this.PRESENT_HISTORY_MODAL) {
          modifyPatientPresentHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.MEDICINE_HISTORY_MODAL) {
          modifyPatientMedHistory(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.DISEASE_HISTORY_MODAL) {
          modifyPatientDisease(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.FAMILY_HISTORY_MODAL) {
          modifyPatientFamily(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.modalType === this.TOXIC_HISTORY_MODAL) {
          modifyPatientToxicExposure(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.COFFEE_HISTORY_MODAL) {
          modifyPatientCoffee(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.TEA_HISTORY_MODAL) {
          modifyPatientTea(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.WINE_HISTORY_MODAL) {
          modifyPatientWine(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.SMOKE_HISTORY_MODAL) {
          modifyPatientSmoke(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        } else if (this.subModalType === this.EXERCISE_HISTORY_MODAL) {
          modifyPatientExercise(this.copyInfo).then(() => {
            this.updateAndClose();
          }, this._handleError);
        }
      }
    },
    updateAndClose() {
      if (this.modalType === this.FAMILY_HISTORY_MODAL && this.$refs.uploadTag) {
        this.$refs.uploadTag[0] && this.$refs.uploadTag[0].clearFiles();
      };
      Bus.$emit(this.UPDATE_PATIENT_INFO);
      // this.displayModal = false;
      Bus.$emit(this.MOUNT_DYNAMIC_COMPONENT, '');
      this.lockSubmitButton = false;  // 为按钮解锁
    },
    initCopyInfo() {
      // 遍历当前的 template，对其中的每个 field，检查 this.copyInfo 下有没有名字对应的属性值，没有的话，就初始化为空字符串
      // 注意初始化采用 this.$set 方法，使得当前 Vue 实例对象可以跟踪该属性值的变化

      for (let field of this.template) {
        let name = field.fieldName;
        if (this.copyInfo[name] === undefined) {
          if (this.modalType === this.FAMILY_HISTORY_MODAL && name === 'patientFamilyTree') {
            this.$set(this.copyInfo, name, []);
          } else {
            this.$set(this.copyInfo, name, '');
          }

        }
      }
    },
    getMatchedField(field) {
      // 这个函数根据实际数据，在字典项中查询到对应的字段，从而方便我们得到其 uiType 等信息
      return Util.getElement('fieldName', field.fieldName, this.dictionary);
    },
    getUIType(field) {
      // uiType类型 0/无 1/输入框 2/数字箭头 3/单选下拉框 4/单选按纽 5/多选复选框 6/日期 7/日期时间
      return this.getMatchedField(field).uiType;
    },
    getInputType(name) {
      const textAreaNameList = ['remarks', 'chiefComplaint', 'surgeryHistory', 'medication'];
      return textAreaNameList.indexOf(name) > -1 ? 'textarea' : 'text';
    },
    getTypes(field) {
      // 在 typegroup 里面查找到 field 所对应的 types（选项组）
      var dictionaryField = this.getMatchedField(field);
      var value = dictionaryField.fieldEnumId;
      var typeInfo = Util.getElement('typegroupcode', value, this.typeGroup);
      return typeInfo.types ? typeInfo.types : [];
    },
    getFieldValue(field) {
      var code = this.copyInfo[field.fieldName];
      if (code === undefined || code === '') {
        return '';
      }
      var types = this.getTypes(field);
      var targetType = Util.getElement('typeCode', code, types);
      return targetType.typeName ? targetType.typeName : '';
    },
    getSubModalVal(subModalType) {
      if (subModalType === this.COFFEE_HISTORY_MODAL) {
        return '咖啡史';
      } else if (subModalType === this.WINE_HISTORY_MODAL) {
        return '饮酒史';
      } else if (subModalType === this.SMOKE_HISTORY_MODAL) {
        return '吸烟史';
      } else if (subModalType === this.TEA_HISTORY_MODAL) {
        return '喝茶史';
      } else if (subModalType === this.EXERCISE_HISTORY_MODAL) {
        return '锻炼史';
      }
    },
    updateWarning(field) {
      var fieldName = field.fieldName;
      var fieldValue = this.copyInfo[fieldName];
      if (this.getUIType(field) === 6) {
        // 日期控件(el-date-picker)给的是一个表示完整日期对象的字符串，我们需要格式化之后再校验
        fieldValue = Util.simplifyDate(fieldValue);
      }
      if (field.must === 1) {
        // must 为 1 代表必填，为 2 代表选填
        var isEmptyValue = !fieldValue && fieldValue !== 0;
        var isEmptyArray = fieldValue instanceof Array && fieldValue.length === 0;
        if (isEmptyValue || isEmptyArray) {
          // 下面这个方法将响应属性添加到嵌套的对象上，这样 Vue 才能实时检测和渲染
          this.$set(this.warningResults, fieldName, '必填项');
          return;
        }
      }
      // -----
      if (fieldName === 'doseInfo' && !Util.checkIfNotMoreThanNDecimalNums(fieldValue, 2)) {
        this.$set(this.warningResults, fieldName, '请输入正数，最多保留两位小数');
        return;
      };
      // -----
      if (fieldValue && !Array.isArray(fieldValue) && fieldValue.toString().indexOf(' ') > -1) {
        this.$set(this.warningResults, fieldName, '不能包含空格');

      } else {
        // 初始化组件的时候，对应字段的警告文本为 undefined，判断之后，就为实际文本或 null
        // null 代表该字段项的填写没有毛病
        this.$set(this.warningResults, fieldName, null);
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
      this.updateScrollbar();
      this.$set(this.copyInfo, 'patientHabitId', '');
      this.$nextTick(() => {
        this.$set(this.warningResults, 'patientHabitId', '');
        this.$set(this.warningResults, 'doseInfo', '');
      });
    },
    _handleError(error) {
      // 当调用 api 发生错误时，执行此函数，注意在此时需要为“确定”按钮解锁
      console.log(error);
      this.lockSubmitButton = false;
    }
  },
  mounted() {
    // 先在本组件注册该事件，等待Layout组件接收动态组件挂载完毕的通知，再在本组件执行 showPanel 或 showModal
    Bus.$on(this.SHOW_MODAL_BOX, this.showPanel);

    // 动态组件挂载完毕，通知Layout组件，动态组件已挂载完毕
    Bus.$emit(this.DYNAMIC_COMPONENT_MOUNTED);
  },
  watch: {
    template: function() {
      // 只有在 template 更新后，才去初始化 this.copyInfo 的值
      this.initCopyInfo();
    },
    $route: function() {
      // 路由被手动变化之后，自动关闭模态框
      this.cancel();
    }
  },
  beforeDestroy() {
    // 依然要记得，销毁组件之前解除绑定在自己身上的事件监听器·
    Bus.$off(this.SHOW_MODAL_BOX, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@field-line-height: 25px;
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
    top: 5%;
    width: 600px;
    max-height: 90%;
    background-color: @background-color;
    overflow: hidden;
    &.high-box {
      top: 6%;
    }
    .title {
      padding: 30px 0 10px;
      font-size: @large-font-size;
    }
    .field {
      display: inline-block;
      position: relative;
      width: 100%;
      min-height: 45px;
      text-align: left;
      vertical-align: top;
      transform: translate3d(10px, 5px, 0);
      // overflow: hidden;
      &.field-unit{
        min-height: 0;
        display: block;
        .field-input{
            width: 120px;
            position: absolute;
            top:-45px;
            left: calc(~"96% - 120px");
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
        top: 0;
        left: @field-name-width;
        width: calc(~"96% - @{field-name-width}");
        line-height: @field-line-height;
        font-size: @normal-font-size;
        color: @light-font-color;
        &.doseInfo{
          width: calc(~"96% - @{field-name-width} - 130px");
        }
        // &.unit{
        //   width: 100px;
        //   position: absolute;
        //   top:-45px;
        //   left: calc(~"96% - 100px");
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
          margin-bottom: 15px;
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
        .warning .el-input__inner, .warning .el-textarea__inner {
          border: 1px solid red;
        }
        .upload-area {
          padding-bottom:10px;
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
