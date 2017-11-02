<template lang="html">
  <div class="filter-panel" :class="{'hide': !showFilterPanel}">
    <div class="condition-area">
      <div class="tabs-wrapper">
        <span class="tab first-tab" :class="{'current-tab': currentTab === PERSONAL_INFO}"
          @click="choosePersonalInfo">个人信息</span>
        <span class="tab second-tab" :class="{'current-tab': currentTab === DIAGNOSTIC_INFO}"
          @click="chooseDiagnosticInfo">诊断信息</span>
        <div class="tab-bottom-bar" :class="currentTabBottomBar"></div>
      </div>
      <div class="scroll-area" ref="scrollList">
        <div class="folding-box" v-show="currentTab===PERSONAL_INFO">
          <div class="title" @click="toggleBasicInfoDisplay">
            基本情况
            <span class="iconfont" :class="{'icon-up': displayBasicInfoCondition, 'icon-down': !displayBasicInfoCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayBasicInfoCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.ageFrom"></el-checkbox>
              <span class="item-name">患者年龄</span>
              <span class="item-value">
                <el-input class="left-input" v-model="basicInfoCondition.ageFrom" placeholder="最小年龄"
                  :disabled="!basicInfoSelectedStatus.ageFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="basicInfoCondition.ageTo" placeholder="最大年龄"
                  :disabled="!basicInfoSelectedStatus.ageFrom"></el-input>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.birthDateFrom"></el-checkbox>
              <span class="item-name">出生日期</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="basicInfoCondition.birthDateFrom" placeholder="最早日期"
                  :disabled="!basicInfoSelectedStatus.birthDateFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="basicInfoCondition.birthDateTo" placeholder="最晚日期"
                  :disabled="!basicInfoSelectedStatus.birthDateFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.nation"></el-checkbox>
              <span class="item-name">民族</span>
              <span class="item-value">
                <el-input class="normal-input" v-model="basicInfoCondition.nation" placeholder="请输入民族"
                  :disabled="!basicInfoSelectedStatus.nation"></el-input>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.sex"></el-checkbox>
              <span class="item-name">性别</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.sex" placeholder="请输入性别"
                  :disabled="!basicInfoSelectedStatus.sex">
                  <el-option v-for="option in getOptions('sex')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.marryType"></el-checkbox>
              <span class="item-name">婚姻状况</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.marryType"
                  :disabled="!basicInfoSelectedStatus.marryType">
                  <el-option v-for="option in getOptions('maryType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.qualification"></el-checkbox>
              <span class="item-name">学历</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.qualification"
                  :disabled="!basicInfoSelectedStatus.qualification">
                  <el-option v-for="option in getOptions('qualifica')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.career"></el-checkbox>
              <span class="item-name">职业</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.career"
                  :disabled="!basicInfoSelectedStatus.career">
                  <el-option v-for="option in getOptions('career')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.bloodType"></el-checkbox>
              <span class="item-name">血型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.bloodType"
                  :disabled="!basicInfoSelectedStatus.bloodType">
                  <el-option v-for="option in getOptions('bloodType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.econType"></el-checkbox>
              <span class="item-name">经济现状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.econType"
                  :disabled="!basicInfoSelectedStatus.econType">
                  <el-option v-for="option in getOptions('econeType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.liveType"></el-checkbox>
              <span class="item-name">居住现状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.liveType"
                  :disabled="!basicInfoSelectedStatus.liveType">
                  <el-option v-for="option in getOptions('liveType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="basicInfoSelectedStatus.homeProvince"></el-checkbox>
              <span class="item-name">籍贯</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="basicInfoCondition.homeProvince"
                  :disabled="!basicInfoSelectedStatus.homeProvince">
                  <el-option v-for="option in getOptions('homeProvince')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===PERSONAL_INFO">
          <div class="title" @click="toggleDiseaseInfoDisplay">
            病症信息
            <span class="iconfont" :class="{'icon-up': displayDiseaseInfoCondition, 'icon-down': !displayDiseaseInfoCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiseaseInfoCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.diseaseType"></el-checkbox>
              <span class="item-name">病症类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.diseaseType"
                  :disabled="!diseaseInfoSelectedStatus.diseaseType">
                  <el-option v-for="option in getOptions('diseType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.ariAgeFrom"></el-checkbox>
              <span class="item-name">起病年龄</span>
              <span class="item-value">
                <el-input class="left-input" v-model="diseaseInfoCondition.ariAgeFrom" placeholder="最小年龄"
                  :disabled="!diseaseInfoSelectedStatus.ariAgeFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="diseaseInfoCondition.ariAgeTo" placeholder="最大年龄"
                  :disabled="!diseaseInfoSelectedStatus.ariAgeFrom"></el-input>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firSym"></el-checkbox>
              <span class="item-name">首发症状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.firSym" multiple
                  :disabled="!diseaseInfoSelectedStatus.firSym">
                  <el-option v-for="option in getOptions('firSym')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firBody"></el-checkbox>
              <span class="item-name">首发部位</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.firBody" multiple
                  :disabled="!diseaseInfoSelectedStatus.firBody">
                  <el-option v-for="option in getOptions('firBody')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firTimeFrom"></el-checkbox>
              <span class="item-name">初诊时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diseaseInfoCondition.firTimeFrom" placeholder="最早日期"
                  :disabled="!diseaseInfoSelectedStatus.firTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diseaseInfoCondition.firTimeTo" placeholder="最晚日期"
                  :disabled="!diseaseInfoSelectedStatus.firTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.surTimeFrom"></el-checkbox>
              <span class="item-name">确诊时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diseaseInfoCondition.surTimeFrom" placeholder="最早日期"
                  :disabled="!diseaseInfoSelectedStatus.surTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diseaseInfoCondition.surTimeTo" placeholder="最晚日期"
                  :disabled="!diseaseInfoSelectedStatus.surTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.diagMode"></el-checkbox>
              <span class="item-name">诊断方式</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.diagMode" multiple
                  :disabled="!diseaseInfoSelectedStatus.diagMode">
                  <el-option v-for="option in getOptions('diagMode')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.treatPro"></el-checkbox>
              <span class="item-name">诊断项目</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.treatPro" multiple
                  :disabled="!diseaseInfoSelectedStatus.treatPro">
                  <el-option v-for="option in getOptions('treatPro')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.firMed"></el-checkbox>
              <span class="item-name">初次用药</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.firMed" multiple
                  :disabled="!diseaseInfoSelectedStatus.firMed">
                  <el-option v-for="option in getOptions('firMed')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.getDisFac"></el-checkbox>
              <span class="item-name long-name">初获信息途径</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.getDisFac" multiple
                  :disabled="!diseaseInfoSelectedStatus.getDisFac">
                  <el-option v-for="option in getOptions('getDisFac')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diseaseInfoSelectedStatus.getDisFac0"></el-checkbox>
              <span class="item-name long-name">不断获取途径</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diseaseInfoCondition.getDisFac0" multiple
                  :disabled="!diseaseInfoSelectedStatus.getDisFac0">
                  <el-option v-for="option in getOptions('getDisFac')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===PERSONAL_INFO">
          <div class="title" @click="toggleOtherInfoDisplay">
            其它信息
            <span class="iconfont" :class="{'icon-up': displayOtherInfoCondition, 'icon-down': !displayOtherInfoCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayOtherInfoCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.medType"></el-checkbox>
              <span class="item-name">其它用药史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.medType"
                  :disabled="!otherInfoSelectedStatus.medType">
                  <el-option v-for="option in getOptions('medType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.diseaseRelationId"></el-checkbox>
              <span class="item-name">既往病史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.diseaseRelationId"
                  :disabled="!otherInfoSelectedStatus.diseaseRelationId">
                  <el-option v-for="option in getOptions('diseaseRelationId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.similarRole"></el-checkbox>
              <span class="item-name">家族病史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.similarRole"
                  :disabled="!otherInfoSelectedStatus.similarRole">
                  <el-option v-for="option in getOptions('sameRole')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.patientSmokeId"></el-checkbox>
              <span class="item-name">吸烟史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.patientSmokeId"
                  :disabled="!otherInfoSelectedStatus.patientSmokeId">
                  <el-option v-for="option in getOptions('habitSmoke')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.patientWineId"></el-checkbox>
              <span class="item-name">饮酒史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.patientWineId"
                  :disabled="!otherInfoSelectedStatus.patientWineId">
                  <el-option v-for="option in getOptions('habitWine')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.patientTeaId"></el-checkbox>
              <span class="item-name">喝茶史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.patientTeaId"
                  :disabled="!otherInfoSelectedStatus.patientTeaId">
                  <el-option v-for="option in getOptions('habitTea')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.patientCoffeeId"></el-checkbox>
              <span class="item-name">咖啡史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.patientCoffeeId"
                  :disabled="!otherInfoSelectedStatus.patientCoffeeId">
                  <el-option v-for="option in getOptions('habitCoffee')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.grade"></el-checkbox>
              <span class="item-name">锻炼史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.grade"
                  :disabled="!otherInfoSelectedStatus.grade">
                  <el-option v-for="option in getOptions('exeGrade')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="otherInfoSelectedStatus.exposedType"></el-checkbox>
              <span class="item-name">毒物接触史</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="otherInfoCondition.exposedType"
                  :disabled="!otherInfoSelectedStatus.exposedType">
                  <el-option v-for="option in getOptions('expType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===DIAGNOSTIC_INFO">
          <div class="title" @click="toggleDiagnosticBasicDisplay">
            基本情况
            <span class="iconfont" :class="{'icon-up': displayDiagnosticBasicCondition, 'icon-down': !displayDiagnosticBasicCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiagnosticBasicCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticBasicSelectedStatus.caseType"></el-checkbox>
              <span class="item-name">诊断类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticBasicCondition.caseType"
                  :disabled="!diagnosticBasicSelectedStatus.caseType">
                  <el-option label="看诊" :value="1"></el-option>
                  <el-option label="随诊" :value="2"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticBasicSelectedStatus.diagTimeFrom"></el-checkbox>
              <span class="item-name">诊断时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticBasicCondition.diagTimeFrom" placeholder="最早时间"
                  :disabled="!diagnosticBasicSelectedStatus.diagTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticBasicCondition.diagTimeTo" placeholder="最晚时间"
                  :disabled="!diagnosticBasicSelectedStatus.diagTimeFrom"></el-date-picker>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===DIAGNOSTIC_INFO">
          <div class="title" @click="toggleDiagnosticDiseaseDisplay">
            病症情况
            <span class="iconfont" :class="{'icon-up': displayDiagnosticDiseaseCondition, 'icon-down': !displayDiagnosticDiseaseCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiagnosticDiseaseCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticDiseaseSelectedStatus.diseaseType"></el-checkbox>
              <span class="item-name">病症类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticDiseaseCondition.diseaseType"
                  :disabled="!diagnosticDiseaseSelectedStatus.diseaseType">
                  <el-option v-for="option in getOptions('diseType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diagnosticDiseaseSelectedStatus.motorSymptomTypeId"></el-checkbox>
              <span class="item-name">运动症状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticDiseaseCondition.motorSymptomTypeId" multiple
                  :disabled="!diagnosticDiseaseSelectedStatus.motorSymptomTypeId">
                  <el-option v-for="option in getOptions('symptomTypeId', 'ms')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diagnosticDiseaseSelectedStatus.motorComplicationsSymptomTypeId"></el-checkbox>
              <span class="item-name">运动并发症</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticDiseaseCondition.motorComplicationsSymptomTypeId" multiple
                  :disabled="!diagnosticDiseaseSelectedStatus.motorComplicationsSymptomTypeId">
                  <el-option v-for="option in getOptions('symptomTypeId', 'mc')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item auto-resize">
              <el-checkbox class="item-checkbox" v-model="diagnosticDiseaseSelectedStatus.nonMotorSymptomTypeId"></el-checkbox>
              <span class="item-name">非运动症状</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticDiseaseCondition.nonMotorSymptomTypeId" multiple
                  :disabled="!diagnosticDiseaseSelectedStatus.nonMotorSymptomTypeId">
                  <el-option v-for="option in getOptions('symptomTypeId', 'nms')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===DIAGNOSTIC_INFO">
          <div class="title" @click="toggleDiagnosticMedicineDisplay">
            药物方案
            <span class="iconfont" :class="{'icon-up': displayDiagnosticMedicineCondition, 'icon-down': !displayDiagnosticMedicineCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiagnosticMedicineCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticMedicineSelectedStatus.medicineType"></el-checkbox>
              <span class="item-name">药物类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticMedicineCondition.medicineType"
                  :disabled="!diagnosticMedicineSelectedStatus.medicineType">
                  <el-option v-for="option in getOptions('durgType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticMedicineSelectedStatus.medicineId"></el-checkbox>
              <span class="item-name">使用药物</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticMedicineCondition.medicineId"
                  :disabled="!diagnosticMedicineSelectedStatus.medicineId">
                  <el-option v-for="option in getOptions('medicineId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticMedicineSelectedStatus.medicineSpecId"></el-checkbox>
              <span class="item-name">药物规格</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticMedicineCondition.medicineSpecId"
                  :disabled="!diagnosticMedicineSelectedStatus.medicineSpecId">
                  <el-option v-for="option in getOptions('medicineSpecId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticMedicineSelectedStatus.levodopaSingleIntakeFrom"></el-checkbox>
              <span class="item-name long-name double-line">左旋多巴单次摄入量</span>
              <span class="item-value">
                <el-input class="left-input" v-model="diagnosticMedicineCondition.levodopaSingleIntakeFrom" placeholder="最小值"
                  :disabled="!diagnosticMedicineSelectedStatus.levodopaSingleIntakeFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="diagnosticMedicineCondition.levodopaSingleIntakeTo" placeholder="最大值"
                  :disabled="!diagnosticMedicineSelectedStatus.levodopaSingleIntakeFrom"></el-input>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticMedicineSelectedStatus.levodopaTotalIntakeFrom"></el-checkbox>
              <span class="item-name long-name double-line">左旋多巴累计摄入量</span>
              <span class="item-value">
                <el-input class="left-input" v-model="diagnosticMedicineCondition.levodopaTotalIntakeFrom" placeholder="最小值"
                  :disabled="!diagnosticMedicineSelectedStatus.levodopaTotalIntakeFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="diagnosticMedicineCondition.levodopaTotalIntakeTo" placeholder="最大值"
                  :disabled="!diagnosticMedicineSelectedStatus.levodopaTotalIntakeFrom"></el-input>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===DIAGNOSTIC_INFO">
          <div class="title" @click="toggleDiagnosticSurgeryDisplay">
            外科手术
            <span class="iconfont" :class="{'icon-up': displayDiagnosticSurgeryCondition, 'icon-down': !displayDiagnosticSurgeryCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiagnosticSurgeryCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.preopsTimeFrom"></el-checkbox>
              <span class="item-name">评估时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticSurgeryCondition.preopsTimeFrom" placeholder="开始时间"
                  :disabled="!diagnosticSurgerySelectedStatus.preopsTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticSurgeryCondition.preopsTimeTo" placeholder="结束时间"
                  :disabled="!diagnosticSurgerySelectedStatus.preopsTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.deviceId"></el-checkbox>
              <span class="item-name">设备品牌</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.deviceId"
                  :disabled="!diagnosticSurgerySelectedStatus.deviceId">
                  <el-option v-for="option in getOptions('deviceId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.devicePowerType"></el-checkbox>
              <span class="item-name">设备类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.devicePowerType"
                  :disabled="!diagnosticSurgerySelectedStatus.devicePowerType">
                  <el-option label="充电" :value="0"></el-option>
                  <el-option label="不充电" :value="1"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.operationIntension"></el-checkbox>
              <span class="item-name">患者意愿</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.operationIntension"
                  :disabled="!diagnosticSurgerySelectedStatus.operationIntension">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.intensionTimeFrom"></el-checkbox>
              <span class="item-name">同意时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticSurgeryCondition.intensionTimeFrom" placeholder="开始时间"
                  :disabled="!diagnosticSurgerySelectedStatus.intensionTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticSurgeryCondition.intensionTimeTo" placeholder="结束时间"
                  :disabled="!diagnosticSurgerySelectedStatus.intensionTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.surgicalInfoId"></el-checkbox>
              <span class="item-name">手术方案</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.surgicalInfoId"
                  :disabled="!diagnosticSurgerySelectedStatus.surgicalInfoId">
                  <el-option v-for="option in getOptions('surgicalInfoId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.surgicalDateFrom"></el-checkbox>
              <span class="item-name">手术时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticSurgeryCondition.surgicalDateFrom" placeholder="开始时间"
                  :disabled="!diagnosticSurgerySelectedStatus.surgicalDateFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticSurgeryCondition.surgicalDateTo" placeholder="结束时间"
                  :disabled="!diagnosticSurgerySelectedStatus.surgicalDateFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.dbsDateFrom"></el-checkbox>
              <span class="item-name">程控时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticSurgeryCondition.dbsDateFrom" placeholder="开始时间"
                  :disabled="!diagnosticSurgerySelectedStatus.dbsDateFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticSurgeryCondition.dbsDateTo" placeholder="结束时间"
                  :disabled="!diagnosticSurgerySelectedStatus.dbsDateFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.occurenceTimeFrom"></el-checkbox>
              <span class="item-name">并发症时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticSurgeryCondition.occurenceTimeFrom" placeholder="开始时间"
                  :disabled="!diagnosticSurgerySelectedStatus.occurenceTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticSurgeryCondition.occurenceTimeTo" placeholder="结束时间"
                  :disabled="!diagnosticSurgerySelectedStatus.occurenceTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.majorComplicationType"></el-checkbox>
              <span class="item-name">并发症大类</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.majorComplicationType"
                  :disabled="!diagnosticSurgerySelectedStatus.majorComplicationType">
                  <el-option v-for="option in getOptions('majorType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.minorComplicationType"></el-checkbox>
              <span class="item-name">并发症小类</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.minorComplicationType"
                  :disabled="!diagnosticSurgerySelectedStatus.minorComplicationType">
                  <el-option v-for="option in getOptions('minorComplicationType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.treatment"></el-checkbox>
              <span class="item-name">处理方案</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.treatment"
                  :disabled="!diagnosticSurgerySelectedStatus.treatment">
                  <el-option v-for="option in getOptions('treatment')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticSurgerySelectedStatus.result"></el-checkbox>
              <span class="item-name">处理结果</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticSurgeryCondition.result"
                  :disabled="!diagnosticSurgerySelectedStatus.result">
                  <el-option v-for="option in getOptions('result')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===DIAGNOSTIC_INFO">
          <div class="title" @click="toggleDiagnosticScaleDisplay">
            医学量表
            <span class="iconfont" :class="{'icon-up': displayDiagnosticScaleCondition, 'icon-down': !displayDiagnosticScaleCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiagnosticScaleCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticScaleSelectedStatus.inspectTimeFrom"></el-checkbox>
              <span class="item-name">录入时间</span>
              <span class="item-value">
                <el-date-picker class="left-input" v-model="diagnosticScaleCondition.inspectTimeFrom" placeholder="开始时间"
                  :disabled="!diagnosticScaleSelectedStatus.inspectTimeFrom"></el-date-picker>
                <span class="middle-text">~</span>
                <el-date-picker class="right-input" v-model="diagnosticScaleCondition.inspectTimeTo" placeholder="结束时间"
                  :disabled="!diagnosticScaleSelectedStatus.inspectTimeFrom"></el-date-picker>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticScaleSelectedStatus.scaleType"></el-checkbox>
              <span class="item-name">量表类型</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticScaleCondition.scaleType"
                  :disabled="!diagnosticScaleSelectedStatus.scaleType">
                  <el-option v-for="option in getOptions('gaugeType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticScaleSelectedStatus.scaleName"></el-checkbox>
              <span class="item-name">量表名称</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticScaleCondition.scaleName"
                  :disabled="!diagnosticScaleSelectedStatus.scaleName">
                  <el-option v-for="option in getOptions('scaleName')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
              </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticScaleSelectedStatus.scalePointFrom"></el-checkbox>
              <span class="item-name">量表得分</span>
              <span class="item-value">
                <el-input class="left-input" v-model="diagnosticScaleCondition.scalePointFrom" placeholder="最低得分"
                  :disabled="!diagnosticScaleSelectedStatus.scalePointFrom"></el-input>
                <span class="middle-text">~</span>
                <el-input class="right-input" v-model="diagnosticScaleCondition.scalePointTo" placeholder="最高得分"
                  :disabled="!diagnosticScaleSelectedStatus.scalePointFrom"></el-input>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticScaleSelectedStatus.switchType"></el-checkbox>
              <span class="item-name">填写状态</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticScaleCondition.switchType"
                  :disabled="!diagnosticScaleSelectedStatus.switchType">
                  <el-option v-for="option in getOptions('switchType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="folding-box" v-show="currentTab===DIAGNOSTIC_INFO">
          <div class="title" @click="toggleDiagnosticExaminationDisplay">
            检验检查
            <span class="iconfont" :class="{'icon-up': displayDiagnosticExaminationCondition, 'icon-down': !displayDiagnosticExaminationCondition}"></span>
          </div>
          <div class="content" :class="{'folded': !displayDiagnosticExaminationCondition}">
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticExaminationSelectedStatus.spephysicalInfoId"></el-checkbox>
              <span class="item-name long-name">神经系统检查</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticExaminationCondition.spephysicalInfoId"
                  :disabled="!diagnosticExaminationSelectedStatus.spephysicalInfoId">
                  <el-option v-for="option in getOptions('spephysicalInfoId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticExaminationSelectedStatus.bioexamId"></el-checkbox>
              <span class="item-name long-name">生化指标检查</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticExaminationCondition.bioexamId"
                  :disabled="!diagnosticExaminationSelectedStatus.bioexamId">
                  <el-option v-for="option in getOptions('bioexamId')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticExaminationSelectedStatus.emgType"></el-checkbox>
              <span class="item-name">肌电图</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticExaminationCondition.emgType"
                  :disabled="!diagnosticExaminationSelectedStatus.emgType">
                  <el-option v-for="option in getOptions('eleType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item">
              <el-checkbox class="item-checkbox" v-model="diagnosticExaminationSelectedStatus.examType"></el-checkbox>
              <span class="item-name">医学影像</span>
              <span class="item-value">
                <el-select class="normal-input" v-model="diagnosticExaminationCondition.examType"
                  :disabled="!diagnosticExaminationSelectedStatus.examType">
                  <el-option v-for="option in getOptions('examType')" :label="option.name" :value="option.code"
                    :key="option.code"></el-option>
                </el-select>
              </span>
            </div>
          </div>
        </div>

        <div class="blank-area"></div>
      </div>
      <div class="function-area">
        <div class="function-button left" @click="resetCondition">
          重置条件
        </div>
        <div class="function-button right" @click="applyCondition">
          应用条件
        </div>
      </div>
    </div>
    <div class="toggle-condition-button" :class="{'hide-condition-status': !displayCondition}" @click="toggleConditonDisplay">
      <div class="iconfont" :class="toggleIconClass"></div>
    </div>
    <div class="content-area" :class="{'hide-condition-status': !displayCondition}">
      <div class="content-scroll-area" ref="scrollContent">
        <div class="form-head">
          <table class="form form-head">
            <tr class="row top-row">
              <td class="col col-num">序号</td>
              <td class="col col-id">患者ID</td>
              <td class="col col-gender">性别</td>
              <td class="col col-age">年龄(岁)</td>
              <td class="col col-disease">病症类型</td>
              <td class="col col-symptom">首发症状</td>
              <td class="col col-operation">操作</td>
            </tr>
          </table>
        </div>
        <div class="form-body" ref="formBody">
          <table class="form">
            <tr class="row" v-for="(patient, i) in patientList">
              <td class="col col-num">{{i}}</td>
              <td class="col col-id">{{patient.patientId}}</td>
              <td class="col col-gender">{{getNameByCode(patient.sex, 'sex')}}</td>
              <td class="col col-age">{{patient.age}}</td>
              <td class="col col-disease">{{getNameByCode(patient.diseaseType, 'diseType')}}</td>
              <td class="col col-symptom">{{getNameByCodeListString(patient.firSym, 'firSym')}}</td>
              <td class="col col-operation">
                <span class="text-button" @click="seePatientDetail(patient.patientId)">查看</span>
                <span class="text-button" @click="manageGroup(patient.patientId)">分组</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <group-panel class="group-panel" :class="{'hide': !displayGroupPanel}" :belongGroups="belongGroups"
        :display="displayGroupPanel" :patientId="Number(patientId)" @hideGroupPanel="hideGroupPanel"></group-panel>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';
import { queryPatientsByCondition, getPatientGroupInfo } from 'api/patient.js';
import { vueCopy, pruneObj, reviseDateFormat } from 'utils/helper.js';
import Util from 'utils/util.js';

import GroupPanel from 'components/grouppanel/GroupPanel';

const PERSONAL_INFO = 'personalInfo';
const DIAGNOSTIC_INFO = 'diagnosticInfo';

let basicInfoFieldNames = ['ageFrom', 'ageTo', 'birthDateFrom', 'birthDateTo',
  'nation', 'sex', 'marryType', 'qualification', 'career', 'bloodType', 'econType',
  'liveType', 'homeProvince'];
let basicInfoSelectedFieldNames = ['ageFrom', 'ageFrom', 'birthDateFrom', 'birthDateFrom',
  'nation', 'sex', 'marryType', 'qualification', 'career', 'bloodType', 'econType',
  'liveType', 'homeProvince'];

let diseaseInfoFieldNames = ['diseaseType', 'ariAgeFrom', 'ariAgeTo', 'firSym',
  'firBody', 'firTimeFrom', 'firTimeTo', 'surTimeFrom', 'surTimeTo',
  'diagMode', 'treatPro', 'firMed', 'getDisFac', 'getDisFac0'];
let diseaseInfoSelectedFieldNames = ['diseaseType', 'ariAgeFrom', 'ariAgeFrom', 'firSym',
  'firBody', 'firTimeFrom', 'firTimeFrom', 'surTimeFrom', 'surTimeFrom',
  'diagMode', 'treatPro', 'firMed', 'getDisFac', 'getDisFac0'];

let otherInfoFieldNames = ['medType', 'diseaseRelationId', 'similarRole', 'patientSmokeId',
  'patientWineId', 'patientTeaId', 'patientCoffeeId', 'grade', 'exposedType'];
let otherInfoSelectedFieldNames = ['medType', 'diseaseRelationId', 'similarRole', 'patientSmokeId',
  'patientWineId', 'patientTeaId', 'patientCoffeeId', 'grade', 'exposedType'];

let diagnosticBasicFieldNames = ['caseType', 'diagTimeFrom', 'diagTimeTo'];
let diagnosticBasicSelectedFieldNames = ['caseType', 'diagTimeFrom', 'diagTimeFrom'];

let diagnosticDiseaseFieldNames = ['diseaseType', 'motorSymptomTypeId',
  'motorComplicationsSymptomTypeId', 'nonMotorSymptomTypeId'];
let diagnosticDiseaseSelectedFieldNames = ['diseaseType', 'motorSymptomTypeId',
  'motorComplicationsSymptomTypeId', 'nonMotorSymptomTypeId'];

let diagnosticMedicineFieldNames = ['medicineType', 'medicineId', 'medicineSpecId',
  'levodopaSingleIntakeFrom', 'levodopaSingleIntakeTo', 'levodopaTotalIntakeFrom', 'levodopaTotalIntakeTo'];
let diagnosticMedicineSelectedFieldNames = ['medicineType', 'medicineId', 'medicineSpecId',
  'levodopaSingleIntakeFrom', 'levodopaSingleIntakeFrom', 'levodopaTotalIntakeFrom', 'levodopaTotalIntakeFrom'];

let diagnosticSurgeryFieldNames = ['preopsTimeFrom', 'preopsTimeTo', 'deviceId', 'devicePowerType',
  'operationIntension', 'intensionTimeFrom', 'intensionTimeTo', 'surgicalInfoId', 'surgicalDateFrom',
  'surgicalDateTo', 'dbsDateFrom', 'dbsDateTo', 'occurrenceTimeFrom', 'occurrenceTimeTo', 'majorComplicationType',
  'minorComplicationType', 'treatment', 'result'];
let diagnosticSurgerySelectedFieldNames = ['preopsTimeFrom', 'preopsTimeFrom', 'deviceId', 'devicePowerType',
  'operationIntension', 'intensionTimeFrom', 'intensionTimeFrom', 'surgicalInfoId', 'surgicalDateFrom',
  'surgicalDateFrom', 'dbsDateFrom', 'dbsDateFrom', 'occurrenceTimeFrom', 'occurrenceTimeFrom', 'majorComplicationType',
  'minorComplicationType', 'treatment', 'result'];

let diagnosticScaleFieldNames = ['inspectTimeFrom', 'inspectTimeTo', 'scaleType', 'scaleName',
  'scaleQuestionFrom', 'scaleQuestionTo', 'scalePointFrom', 'scalePointTo', 'switchType'];
let diagnosticScaleSelectedFieldNames = ['inspectTimeFrom', 'inspectTimeFrom', 'scaleType', 'scaleName',
  'scaleQuestionFrom', 'scaleQuestionFrom', 'scalePointFrom', 'scalePointFrom', 'switchType'];

let diagnosticExaminationFieldNames = ['spephysicalInfoId', 'bioexamId', 'emgType', 'examType'];
let diagnosticExaminationSelectedFieldNames = ['spephysicalInfoId', 'bioexamId', 'emgType', 'examType'];

let multiSelectFieldList = ['firSym', 'firBody', 'diagMode', 'treatPro', 'firMed', 'getDisFac', 'getDisFac0',
  'motorSymptomTypeId', 'motorComplicationsSymptomTypeId', 'nonMotorSymptomTypeId'];

export default {
  props: {
    showFilterPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTab: PERSONAL_INFO,
      PERSONAL_INFO: PERSONAL_INFO,
      DIAGNOSTIC_INFO: DIAGNOSTIC_INFO,
      displayCondition: true,

      displayBasicInfoCondition: true,
      basicInfoCondition: {},
      basicInfoSelectedStatus: {},

      displayDiseaseInfoCondition: true,
      diseaseInfoCondition: {},
      diseaseInfoSelectedStatus: {},

      displayOtherInfoCondition: true,
      otherInfoCondition: {},
      otherInfoSelectedStatus: {},

      displayDiagnosticBasicCondition: true,
      diagnosticBasicCondition: {},
      diagnosticBasicSelectedStatus: {},

      displayDiagnosticDiseaseCondition: true,
      diagnosticDiseaseCondition: {},
      diagnosticDiseaseSelectedStatus: {},

      displayDiagnosticMedicineCondition: true,
      diagnosticMedicineCondition: {},
      diagnosticMedicineSelectedStatus: {},

      displayDiagnosticSurgeryCondition: true,
      diagnosticSurgeryCondition: {},
      diagnosticSurgerySelectedStatus: {},

      displayDiagnosticScaleCondition: true,
      diagnosticScaleCondition: {},
      diagnosticScaleSelectedStatus: {},

      displayDiagnosticExaminationCondition: true,
      diagnosticExaminationCondition: {},
      diagnosticExaminationSelectedStatus: {},

      patientList: [],
      displayGroupPanel: false,
      belongGroups: [],
      patientId: ''
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'symptomType',
      'medicineInfo',
      'deviceInfo',
      'surgicalTypeList',
      'complicationTypeList',
      'scaleList',
      'neurologicCheckTypeList',
      'bioexamTypeList'
    ]),
    currentTabBottomBar() {
      if (this.currentTab === PERSONAL_INFO) {
        return 'first-tab';
      } else if (this.currentTab === DIAGNOSTIC_INFO) {
        return 'second-tab';
      } else {
        return '';
      }
    },
    toggleIconClass() {
      return this.displayCondition ? 'icon-arrow-left' : 'icon-arrow-right';
    },
    medicineInfoObj() {
      // 根据最新的 diagnosticMedicineCondition.medicineId，
      // 去 this.medicineInfo 里面获取相应的对象，从而获得该类型药物的详细参考信息
      let medicineId = this.diagnosticMedicineCondition.medicineId;
      // 注意，如果 medicineId 发生改变，那么也需要清空 medicineSpecId
      this.diagnosticMedicineCondition.medicineSpecId = '';
      return Util.getElement('medicineId', medicineId, this.medicineInfo);
    },
    majorComplicationType() {
      // 这个计算属性存在的主要意义在于，当切换了术后并发症的大类时，要及时清空并发症小类
      let majorComplicationType = this.diagnosticSurgeryCondition.majorComplicationType;
      this.diagnosticSurgeryCondition.minorComplicationType = '';
      return majorComplicationType;
    }
  },
  methods: {
    choosePersonalInfo() {
      this.currentTab = PERSONAL_INFO;
      this.updateScrollList();
      this.$refs.scrollList.scrollTop = 0;
    },
    chooseDiagnosticInfo() {
      this.currentTab = DIAGNOSTIC_INFO;
      this.updateScrollList();
      this.$refs.scrollList.scrollTop = 0;
    },
    toggleConditonDisplay() {
      this.displayCondition = !this.displayCondition;
      this.updateScrollList();
      this.updateScrollContent();
    },
    updateScrollList() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollList);
        Ps.initialize(this.$refs.scrollList, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    updateScrollContent() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollContent);
        Ps.initialize(this.$refs.scrollContent, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
        Ps.destroy(this.$refs.formBody);
        Ps.initialize(this.$refs.formBody, {
          wheelSpeed: 1,
          minScrollbarLength: 40
        });
      });
    },
    toggleBasicInfoDisplay() {
      this.displayBasicInfoCondition = !this.displayBasicInfoCondition;
      setTimeout(() => {
        this.updateScrollList();  // 等动画结束后再刷新列表滚动条
      }, 300);
    },
    toggleDiseaseInfoDisplay() {
      this.displayDiseaseInfoCondition = !this.displayDiseaseInfoCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleOtherInfoDisplay() {
      this.displayOtherInfoCondition = !this.displayOtherInfoCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleDiagnosticBasicDisplay() {
      this.displayDiagnosticBasicCondition = !this.displayDiagnosticBasicCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleDiagnosticDiseaseDisplay() {
      this.displayDiagnosticDiseaseCondition = !this.displayDiagnosticDiseaseCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleDiagnosticMedicineDisplay() {
      this.displayDiagnosticMedicineCondition = !this.displayDiagnosticMedicineCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleDiagnosticSurgeryDisplay() {
      this.displayDiagnosticSurgeryCondition = !this.displayDiagnosticSurgeryCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleDiagnosticScaleDisplay() {
      this.displayDiagnosticScaleCondition = !this.displayDiagnosticScaleCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    toggleDiagnosticExaminationDisplay() {
      this.displayDiagnosticExaminationCondition = !this.displayDiagnosticExaminationCondition;
      setTimeout(() => {
        this.updateScrollList();
      }, 300);
    },
    initCondition() {
      basicInfoFieldNames.forEach((fieldName) => {
        this.$set(this.basicInfoCondition, fieldName, '');
      });
      basicInfoSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.basicInfoSelectedStatus, fieldName, false);
      });
      diseaseInfoFieldNames.forEach((fieldName) => {
        if (multiSelectFieldList.indexOf(fieldName) >= 0) {
          this.$set(this.diseaseInfoCondition, fieldName, []);
        } else {
          this.$set(this.diseaseInfoCondition, fieldName, '');
        }
      });
      diseaseInfoSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diseaseInfoSelectedStatus, fieldName, false);
      });
      otherInfoFieldNames.forEach((fieldName) => {
        this.$set(this.otherInfoCondition, fieldName, '');
      });
      otherInfoSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.otherInfoSelectedStatus, fieldName, false);
      });
      diagnosticBasicFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticBasicCondition, fieldName, '');
      });
      diagnosticBasicSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticBasicSelectedStatus, fieldName, false);
      });
      diagnosticDiseaseFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticDiseaseCondition, fieldName, '');
        if (multiSelectFieldList.indexOf(fieldName) >= 0) {
          this.$set(this.diagnosticDiseaseCondition, fieldName, []);
        } else {
          this.$set(this.diagnosticDiseaseCondition, fieldName, '');
        }
      });
      diagnosticDiseaseSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticDiseaseSelectedStatus, fieldName, false);
      });
      diagnosticMedicineFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticMedicineCondition, fieldName, '');
      });
      diagnosticMedicineSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticMedicineSelectedStatus, fieldName, false);
      });
      diagnosticSurgeryFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticSurgeryCondition, fieldName, '');
      });
      diagnosticSurgerySelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticSurgerySelectedStatus, fieldName, false);
      });
      diagnosticScaleFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticScaleCondition, fieldName, '');
      });
      diagnosticScaleSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticScaleSelectedStatus, fieldName, false);
      });
      diagnosticExaminationFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticExaminationCondition, fieldName, '');
      });
      diagnosticExaminationSelectedFieldNames.forEach((fieldName) => {
        this.$set(this.diagnosticExaminationSelectedStatus, fieldName, false);
      });
    },
    getOptions(fieldName, type) {
      // 第二个参数代表主诉的类型（'ms', 'mc', 'nms' 分别代表运动症状，运动并发症，非运动症状）
      // 第二个参数只有在 诊断信息 -> 病症情况 内才需要使用
      var options = [];
      let fieldNameListInTypeGroup = ['sex', 'maryType', 'qualifica', 'career', 'bloodType',
        'econeType', 'liveType', 'homeProvince', 'diseType', 'firSym', 'firBody', 'diagMode',
        'treatPro', 'firMed', 'getDisFac', 'getDisFac0', 'medType', 'diseaseRelationId',
        'sameRole', 'habitSmoke', 'habitWine', 'habitTea', 'habitCoffee', 'exeGrade', 'expType',
        'diseType', 'durgType', 'majorType', 'treatment', 'result', 'gaugeType', 'switchType',
        'eleType', 'examType'];
      if (fieldNameListInTypeGroup.indexOf(fieldName) >= 0) {
        var types = Util.getElement('typegroupcode', fieldName, this.typeGroup).types;
        types = types ? types : [];
        for (let type of types) {
          options.push({
            name: type.typeName,
            code: type.typeCode
          });
        }
      } else if (fieldName === 'symptomTypeId') {
        const typeDict = {
          'ms': 0,
          'mc': 1,
          'nms': 2
        };
        for (let symptomTypeItem of this.symptomType) {
          if (symptomTypeItem.symptomtype === typeDict[type]) {
            options.push({
              name: symptomTypeItem.sympName,
              code: symptomTypeItem.id
            });
          }
        }
      } else if (fieldName === 'medicineId') {
        for (let medicineItem of this.medicineInfo) {
          options.push({
            name: medicineItem.medicineName,
            code: medicineItem.medicineId
          });
        }
      } else if (fieldName === 'medicineSpecId') {
        let specGroups = this.medicineInfoObj.spec ? this.medicineInfoObj.spec : [];
        for (let spec of specGroups) {
          options.push({
            name: spec.specOral,
            code: spec.specOral
          });
        }
      } else if (fieldName === 'deviceId') {
        for (let device of this.deviceInfo) {
          if (device.deviceType === 1) {
            options.push({
              name: device.deviceName,
              code: device.id
            });
          }
        }
      } else if (fieldName === 'surgicalInfoId') {
        for (let surgicalMethod of this.surgicalTypeList) {
          options.push({
            code: surgicalMethod.id,
            name: surgicalMethod.surgicaName  // 数据库拼写错误，掉了一个 l
          });
        }
      } else if (fieldName === 'minorComplicationType') {
        for (let type of this.complicationTypeList) {
          if (this.majorComplicationType === type.majorComplicationType) {
            options.push({
              name: type.minorComplicationName,
              code: type.id
            });
          }
        }
      } else if (fieldName === 'scaleName') {
        for (let scale of this.scaleList) {
          options.push({
            code: scale.id,
            name: scale.gaugeName
          });
        }
      } else if (fieldName === 'spephysicalInfoId') {
        for (let neurologicCheck of this.neurologicCheckTypeList) {
          options.push({
            code: neurologicCheck.id,
            name: neurologicCheck.spephysicalName
          });
        }
      } else if (fieldName === 'bioexamId') {
        for (let bioexam of this.bioexamTypeList) {
          options.push({
            code: bioexam.id,
            name: bioexam.examName
          });
        }
      }
      return options;
    },
    resetCondition() {
      this.initCondition();
      this.queryPatients({});
    },
    applyCondition() {
      // 根据表单数据生成一个 condition 对象
      var condition = {};

      // 只有当项目前面当确认框被选中，且该栏目的字段不为空的时候，才把所填的值加到 condition 的对应位置
      condition.patientInfo = {};
      for (let i = 0; i < basicInfoSelectedFieldNames.length; i++) {
        let selectedFieldName = basicInfoSelectedFieldNames[i];
        let fieldName = basicInfoFieldNames[i];
        if (this.basicInfoSelectedStatus[selectedFieldName] && fieldName &&
          this.basicInfoCondition[fieldName] !== undefined &&
          this.basicInfoCondition[fieldName] !== '') {
          let value = this.basicInfoCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.patientInfo[fieldName] = value;
        }
      }

      condition.patientDiseaseInfo = {};
      for (let i = 0; i < diseaseInfoSelectedFieldNames.length; i++) {
        let selectedFieldName = diseaseInfoSelectedFieldNames[i];
        let fieldName = diseaseInfoFieldNames[i];
        if (this.diseaseInfoSelectedStatus[selectedFieldName] && fieldName &&
          this.diseaseInfoCondition[fieldName] !== undefined &&
          this.diseaseInfoCondition[fieldName] !== '') {
          let value = this.diseaseInfoCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.patientDiseaseInfo[fieldName] = value;
        }
      }

      condition.otherPatientInfo = {};
      for (let i = 0; i < otherInfoSelectedFieldNames.length; i++) {
        let selectedFieldName = otherInfoSelectedFieldNames[i];
        let fieldName = otherInfoFieldNames[i];
        if (this.otherInfoSelectedStatus[selectedFieldName] && fieldName &&
          this.otherInfoCondition[fieldName] !== undefined &&
          this.otherInfoCondition[fieldName] !== '') {
          let value = this.otherInfoCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.otherPatientInfo[fieldName] = value;
        }
      }

      condition.otherPatientInfo = {};
      for (let i = 0; i < otherInfoSelectedFieldNames.length; i++) {
        let selectedFieldName = otherInfoSelectedFieldNames[i];
        let fieldName = otherInfoFieldNames[i];
        if (this.otherInfoSelectedStatus[selectedFieldName] && fieldName &&
          this.otherInfoCondition[fieldName] !== undefined &&
          this.otherInfoCondition[fieldName] !== '') {
          let value = this.otherInfoCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.otherPatientInfo[fieldName] = value;
        }
      }

      condition.caseInfo = {};
      for (let i = 0; i < diagnosticBasicSelectedFieldNames.length; i++) {
        let selectedFieldName = diagnosticBasicSelectedFieldNames[i];
        let fieldName = diagnosticBasicFieldNames[i];
        if (this.diagnosticBasicSelectedStatus[selectedFieldName] && fieldName &&
          this.diagnosticBasicCondition[fieldName] !== undefined &&
          this.diagnosticBasicCondition[fieldName] !== '') {
          let value = this.diagnosticBasicCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.caseInfo[fieldName] = value;
        }
      }

      condition.caseSymptom = {};
      for (let i = 0; i < diagnosticDiseaseSelectedFieldNames.length; i++) {
        let selectedFieldName = diagnosticDiseaseSelectedFieldNames[i];
        let fieldName = diagnosticDiseaseFieldNames[i];
        if (this.diagnosticDiseaseSelectedStatus[selectedFieldName] && fieldName &&
          this.diagnosticDiseaseCondition[fieldName] !== undefined &&
          this.diagnosticDiseaseCondition[fieldName] !== '') {
          let value = this.diagnosticDiseaseCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.caseSymptom[fieldName] = value;
        }
      }

      condition.caseMedicine = {};
      for (let i = 0; i < diagnosticMedicineSelectedFieldNames.length; i++) {
        let selectedFieldName = diagnosticMedicineSelectedFieldNames[i];
        let fieldName = diagnosticMedicineFieldNames[i];
        if (this.diagnosticMedicineSelectedStatus[selectedFieldName] && fieldName &&
          this.diagnosticMedicineCondition[fieldName] !== undefined &&
          this.diagnosticMedicineCondition[fieldName] !== '') {
          let value = this.diagnosticMedicineCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.caseMedicine[fieldName] = value;
        }
      }

      condition.caseSurgical = {};
      for (let i = 0; i < diagnosticSurgerySelectedFieldNames.length; i++) {
        let selectedFieldName = diagnosticSurgerySelectedFieldNames[i];
        let fieldName = diagnosticSurgeryFieldNames[i];
        if (this.diagnosticSurgerySelectedStatus[selectedFieldName] && fieldName &&
          this.diagnosticSurgeryCondition[fieldName] !== undefined &&
          this.diagnosticSurgeryCondition[fieldName] !== '') {
          let value = this.diagnosticSurgeryCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.caseSurgical[fieldName] = value;
        }
      }

      condition.caseScale = {};
      for (let i = 0; i < diagnosticScaleSelectedFieldNames.length; i++) {
        let selectedFieldName = diagnosticScaleSelectedFieldNames[i];
        let fieldName = diagnosticScaleFieldNames[i];
        if (this.diagnosticScaleSelectedStatus[selectedFieldName] && fieldName &&
          this.diagnosticScaleCondition[fieldName] !== undefined &&
          this.diagnosticScaleCondition[fieldName] !== '') {
          let value = this.diagnosticScaleCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.caseScale[fieldName] = value;
        }
      }

      condition.caseInspect = {};
      for (let i = 0; i < diagnosticExaminationSelectedFieldNames.length; i++) {
        let selectedFieldName = diagnosticExaminationSelectedFieldNames[i];
        let fieldName = diagnosticExaminationFieldNames[i];
        if (this.diagnosticExaminationSelectedStatus[selectedFieldName] && fieldName &&
          this.diagnosticExaminationCondition[fieldName] !== undefined &&
          this.diagnosticExaminationCondition[fieldName] !== '') {
          let value = this.diagnosticExaminationCondition[fieldName];
          if (value instanceof Array) {
            value = value.join(',');
          }
          condition.caseInspect[fieldName] = value;
        }
      }

      reviseDateFormat(condition);
      pruneObj(condition);

      // console.log(condition);
      this.queryPatients(condition);
    },
    queryPatients(condition) {
      if (!condition) {
        condition = {};
      }
      this.patientList = [];
      queryPatientsByCondition(condition).then((data) => {
        vueCopy(data, this.patientList);
        this.updateScrollContent();
      }, (error) => {
        console.log(error);
      });
    },
    getNameByCode(code, typeGroupCode) {
      var types = Util.getElement('typegroupcode', typeGroupCode, this.typeGroup).types;
      types = types ? types : [];
      var matchedType = Util.getElement('typeCode', code, types);
      return matchedType.typeName ? matchedType.typeName : '';
    },
    getNameByCodeListString(codeListString, typeGroupCode) {
      // 传过来的参数是一个字符串
      if (typeof codeListString === 'string') {
        var codeList = codeListString.split(',');
        var result = '';
        for (let code of codeList) {
          code = parseInt(code, 10);
          result += this.getNameByCode(code, typeGroupCode) + '  ';
        }
        return result;
      } else {
        return '';
      }
    },
    seePatientDetail(patientId) {
      patientId = parseInt(patientId, 10);
      this.$router.push({
        name: 'patientInfo',
        params: {
          id: patientId
        }
      });
    },
    manageGroup(patientId) {
      patientId = parseInt(patientId, 10);
      // 如果分组面板已是打开状态，那么会给出提示，需要先关闭分组面板
      if (this.displayGroupPanel) {
        if (this.patientId !== patientId) {
          this.$message({
            message: '请先关闭其他患者的分组面板',
            type: 'warning',
            duration: 2000
          });
        }
        return;
      }

      this.patientId = patientId;
      let patientInfo = {
        'patientId': this.patientId
      };
      this.belongGroups = [];
      getPatientGroupInfo(patientInfo).then((data) => {
        this.belongGroups = data;
        this.$nextTick(() => {
          this.displayGroupPanel = true;
        });
      }, (error) => {
        this.$message({
          message: '获取该患者分组信息失败，请稍后再点击',
          type: 'warning',
          duration: 2000
        });
        console.log(error);
      });
    },
    hideGroupPanel() {
      this.displayGroupPanel = false;
    }
  },
  components: {
    GroupPanel
  },
  created() {
    this.initCondition();
  },
  mounted() {
    this.updateScrollList();
    this.updateScrollContent();
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollList);
    Bus.$on(this.SCREEN_SIZE_CHANGE, this.updateScrollContent);
    this.queryPatients();
  },
  watch: {
    $route() {
      if (this.showFilterPanel) {
        // 在面板打开的情况下，一旦路由发生变化，则自动收起面板
        Bus.$emit(this.TOGGLE_FILTER_PANEL_DISPLAY);
      }
    }
  },
  beforeDestroy() {
    Bus.$off(this.SCREEN_SIZE_CHANGE);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

@condition-area-width: 350px;
@tabs-wrapper-height: 35px;
@tabs-wrapper-margin-bottom: 5px;
@function-area-height: 45px;
@scroll-bar-thickness: 10px;
@top-row-height: 40px;

@col-num-width: 50px;
@col-id-width: 80px;
@col-gender-width: 60px;
@col-age-width: 60px;
@col-disease-width: 120px;
@col-symptom-width: 400px;
@col-operation-width: 100px;
@table-width: @col-num-width + @col-id-width + @col-gender-width + @col-age-width +
  @col-disease-width + @col-symptom-width + @col-operation-width;

.filter-panel {
  position: absolute;
  top: @header-height + @header-margin-bottom;
  left: 0;
  width: 100%;
  height: calc(~"100% - @{header-height} - @{header-margin-bottom}");
  background-color: @background-color;
  transition: 0.5s;
  overflow: hidden;
  z-index: 300;
  &.hide {
    transform: translateY(-150%);
  }
  .condition-area {
    position: absolute;
    left: 0;
    top: 0;
    width: @condition-area-width;
    height: 100%;
    background-color: @screen-color;
    .tabs-wrapper  {
      position: relative;
      width: 100%;
      height: @tabs-wrapper-height;
      margin-bottom: @tabs-wrapper-margin-bottom;
      font-size: 0;
      background-color: @background-color;
      .tab {
        display: inline-block;
        width: 50%;
        height: 100%;
        line-height: @tabs-wrapper-height;
        font-size: @normal-font-size;
        font-weight: bold;
        color: @light-font-color;
        cursor: pointer;
        &.current-tab {
          color: @button-color;
        }
      }
      .tab-bottom-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 70px;
        height: 2px;
        background-color: @button-color;
        transition: 0.2s;
        &.first-tab {
          transform: translateX(52px);
        }
        &.second-tab {
          transform: translateX(52px + @condition-area-width * 0.5);
        }
      }
    }
    .scroll-area {
      position: relative;
      width: 100%;
      height: calc(~"100% - @{tabs-wrapper-height} - @{tabs-wrapper-margin-bottom} - @{vertical-spacing} - @{function-area-height}");
      box-sizing: border-box;
      background-color: @background-color;
      overflow: hidden;
      .folding-box {
        width: 100%;
        margin-bottom: 10px;
        .blank-area {
          width: 100%;
          height: 250px;
        }
        .title {
          padding-left: 15px;
          width: 100%;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          text-align: left;
          font-size: @normal-font-size;
          font-weight: bold;
          background-color: @light-font-color;
          color: #fff;
          cursor: pointer;
          .iconfont {
            padding-left: 5px;
            font-size: @small-font-size;
            color: #fff;
          }
          &:hover {
            opacity: 0.8;
          }
          &:active {
            opacity: 0.9;
          }
        }
        .content {
          position: relative;
          padding: 5px 0;
          box-sizing: border-box;
          height: auto;
          font-size: @normal-font-size;
          transition: 0.3s;
          overflow: hidden;
          &.folded {
            padding: 0;
            height: 0;
            opacity: 0.3;
          }
          .item {
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: left;
            &.auto-resize {
              height: auto;
              .item-value {
                position: relative;
                width: 225px;
                left: 110px;
                padding-bottom: 3px;
              }
            }
            .item-checkbox {
              position: absolute;
              left: 10px;
            }
            .item-name {
              display: inline-block;
              position: absolute;
              left: 35px;
              &.long-name {
                left: 35px;
                font-size: @small-font-size;
                &.double-line {
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  width: 75px;
                  padding-top: 5px;
                  line-height: @normal-font-size;
                }
              }
            }
            .item-value {
              display: inline-block;
              position: absolute;
              left: 110px;
              right: 15px;
              .left-input, .right-input {
                display: inline-block;
                position: absolute;
                width: 100px;
                .el-input__icon {
                  display: none;
                }
                .el-input__inner {
                  padding: 3px 10px;
                }
              }
              .left-input {
                left: 0;
              }
              .right-input {
                right: 0;
              }
              .middle-text {
                position: absolute;
                left: 110px;
              }
              .normal-input {
                display: inline-block;
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
            }
          }
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
  .function-area {
    position: relative;
    bottom: 0;
    margin-top: @vertical-spacing;
    width: 100%;
    height: @function-area-height;
    background-color: @light-font-color;
    color: #fff;
    box-sizing: border-box;
    font-size: @normal-font-size;
    vertical-align: middle;
    .function-button {
      float: left;
      margin-top: @function-area-height * 0.15;
      margin-bottom: @function-area-height * 0.15;
      width: 50%;
      height: 70%;
      box-sizing: border-box;
      line-height: @function-area-height * 0.7;
      transition: color 0.3s;
      cursor: pointer;
      &.left {
        border-right: 1px solid @light-gray-color;
      }
      &.whole-line {
        width: 100%;
      }
      &:hover {
        opacity: 0.7;
      }
      &:active {
        opacity: 0.85;
      }
    }
  }
  .toggle-condition-button {
    position: absolute;
    left: @condition-area-width;
    width: @bar-width;
    height: 100%;
    background-color: @screen-color;
    cursor: pointer;
    transition: 0.3s;
    z-index: 200;
    &.hide-condition-status {
      left: 0;
    }
    .iconfont {
      position: absolute;
      left: -1px;
      font-size: 18px;
      top: 45%;
      width: 100%;
      transform: translateY(-50%);
      color: #ced1db;
    }
  }
  .content-area {
    position: absolute;
    height: 100%;
    left: @condition-area-width + @bar-width;
    right: 0;
    background-color: @background-color;
    transition: 0.3s;
    z-index: 10;
    &.hide-condition-status {
      left: @bar-width;
    }
    .content-scroll-area {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .form {
        width: 100%;
        min-width: @table-width;
        border-spacing: 0;
        table-layout: fixed;
        border: 1px solid @light-gray-color;
        border-collapse:collapse;
        text-align: center;
        .row {
          height: 30px;
          line-height: 30px;
          &.top-row {
            height: @top-row-height;
            line-height: @top-row-height;
            background-color: @light-font-color;
            color: #fff;
          }
          .col {
            position: relative;
            border: 1px solid @light-gray-color;
            box-sizing: border-box;
            white-space: pre-wrap;
            &.col-num {
              width: @col-num-width;
            }
            &.col-id {
              width: @col-id-width;
            }
            &.col-gender {
              width: @col-gender-width;
            }
            &.col-age {
              width: @col-age-width;
            }
            &.col-disease {
              width: @col-disease-width;
            }
            &.col-symptom {
              width: @col-symptom-width;
            }
            &.col-operation {
              width: @col-operation-width;
            }
            .text-button {
              padding: 0 5px;
              cursor: pointer;
              &:hover {
                color: @light-font-color;
                border-bottom: 1px solid @light-font-color;
              }
              &:active {
                color: @theme-color;
                border-bottom: 1px solid @theme-color;
              }
            }
          }
        }
      }
      .ps__scrollbar-x-rail {
        position: absolute;
        height: @scroll-bar-thickness;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
        opacity: 0.3;
        transition: opacity 0.3s;
        .ps__scrollbar-x {
          position: relative;
          height: @scroll-bar-thickness;
          background-color: @gray-color;
          border-radius: 20px;
        }
      }
      .ps__scrollbar-y-rail {
        display: none;
      }
      &:hover {
        .ps__scrollbar-x-rail {
          opacity: 0.6;
        }
      }
      .form-body {
        position: relative;
        overflow-y: hidden;
        overflow-x: hidden;
        width: 100%;
        min-width: @table-width;
        height: calc(~"100% - @{top-row-height}");
        .ps__scrollbar-y-rail {
          display: block;
          position: absolute;
          width: @scroll-bar-thickness;
          height: 100%;
          right: 0;
          box-sizing: border-box;
          opacity: 0.3;
          transition: opacity 0.3s;
          .ps__scrollbar-y {
            position: relative;
            height: 100%;
            background-color: @gray-color;
            border-radius: 20px;
          }
          &:hover {
            .ps__scrollbar-y-rail {
              opacity: 0.6;
            }
          }
        }
        .ps__scrollbar-x-rail {
          display: none;
        }
      }
    }
    .group-panel {
      position: absolute;
      right: 0;
      top: 0;
      transition: 0.3s;
      z-index: 200;
      &.hide {
        right: -@group-panel-width;
      }
    }
  }
}
</style>
