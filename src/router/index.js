import Vue from 'vue';
import Router from 'vue-router';

import Login from 'views/login/Login';

import DoctorSelection from 'views/doctor-selection/DoctorSelection';

import Layout from 'views/layout/Layout';
import ListFrame from 'views/list-frame/ListFrame';

const Analytics = () => import(/* webpackChunkName: 'analytics' */ 'views/analytics/Analytics');
const Statistics = () => import(/* webpackChunkName: 'statistics' */ 'views/statistics/Statistics');
const Configuration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/Configuration');

import PatientInfo from 'patient/patient-info/PatientInfo';
import GroupInfo from 'patient/group-info/GroupInfo';

import PersonalInfo from 'patient/personal-info/PersonalInfo';
import DiagnosticInfo from 'patient/diagnostic-info/DiagnosticInfo';
import ExperimentInfo from 'patient/experiment-info/ExperimentInfo';

const BasicAnalytics = () => import(/* webpackChunkName: 'analytics' */ 'views/analytics/basic-analytics/BasicAnalytics');

const DataEntryDetail = () => import(/* webpackChunkName: 'statistics' */ 'views/statistics/data-entry-detail/DataEntryDetail');

const FeatureConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/FeatureConfiguration');
const SecondBar = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/configuration-bar/SecondBar');
const GroupConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/group-configuration/GroupConfiguration');
const DepartmentConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/department-configuration/DepartmentConfiguration');
const AnalysisConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/analysis-configuration/AnalysisConfiguration');

const FeatureDiagnosticInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/FeatureDiagnosticInfo');
const FreaturePersonInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/FreaturePersonInfo');

const UserInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/usermanagement/user-info/UserInfo');
const RoleInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/rolemanagement/role-info/RoleInfo');

const DictionaryManagement = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/DictionaryManagement');
const DictionSecondBar = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/diction-second-bar/DictionSecondBar');

const DictionTreatmentPlan = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/diction-treatment-plan/DictionTreatmentPlan');
const DictionMedicalScale = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/diction-medical-scale/DictionMedicalScale');
const DictionInspection = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictioninspection/DictionInspection');
const DictionImageDatas = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictionimage-datas/DictionImageDatas');

const InformationSecondBar = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/information-second-bar/InformationSecondBar');
const OtherMedicationHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/other-medication-history/OtherMedicationHistory');
const PastHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/past-history/PastHistory');
const FamilyHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/family-history/FamilyHistory');
const PersonalHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/personal-history/PersonalHistory');
const ToxicExposure = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/toxic-exposure/ToxicExposure');

import SysConfigRoute from 'router/sys.config.route';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/doctorSelection',
      name: 'doctorSelection',
      component: DoctorSelection
    },
    // {
    //   path: '*',
    //   redirect: '/login'
    // },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        // {
        //   path: 'home',
        //   component: Home,
        //   name: 'home'
        // },
        {
          path: 'patients',
          component: ListFrame,
          name: 'patients',
          children: [
            {
              path: 'list',
              name: 'myPatients',
              meta: {
                myPatients: true
              }
            },
            {
              path: 'list/:id',
              components: {
                content: PatientInfo
              },
              name: 'patientInfo',
              meta: {
                myPatients: true
              },
              children: [
                {
                  path: 'personalInfo',
                  component: PersonalInfo,
                  name: 'personalInfo',
                  meta: {
                    personalInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'diagnosticInfo',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'diagnosticDetail',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'experimentInfo',
                  component: ExperimentInfo,
                  name: 'experimentInfo',
                  meta: {
                    experimentInfo: true
                  }
                }
              ]
            },
            {
              path: 'groups',
              name: 'groupsManagement'
            },
            {
              path: 'groups/:id',
              components: {
                content: GroupInfo
              },
              name: 'groupInfo'
            },
            {
              path: 'otherList',
              name: 'otherPatients',
              meta: {
                otherPatients: true
              }
            },
            {
              path: 'otherList/:id',
              components: {
                content: PatientInfo
              },
              name: 'otherPatientInfo',
              meta: {
                otherPatients: true
              },
              children: [
                {
                  path: 'personalInfo',
                  component: PersonalInfo,
                  name: 'otherPersonalInfo',
                  meta: {
                    personalInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'otherDiagnosticInfo',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'otherDiagnosticDetail',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'experimentInfo',
                  component: ExperimentInfo,
                  name: 'otherExperimentInfo',
                  meta: {
                    experimentInfo: true
                  }
                }
              ]
            },
            {
              path: 'subjectList',
              name: 'subjectPatients',
              meta: {
                subjectPatients: true
              }
            },
            {
              path: 'subjectList/:id',
              components: {
                content: PatientInfo
              },
              name: 'subjectPatientInfo',
              meta: {
                subjectPatients: true
              },
              children: [
                {
                  path: 'personalInfo',
                  component: PersonalInfo,
                  name: 'subjectPersonalInfo',
                  meta: {
                    personalInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'subjectDiagnosticInfo',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'subjectDiagnosticDetail',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'experimentInfo',
                  component: ExperimentInfo,
                  name: 'subjectExperimentInfo',
                  meta: {
                    experimentInfo: true
                  }
                }
              ]
            },
            {
              path: 'therapistsPatientList',
              name: 'therapistsPatients',
              meta: {
                therapistsPatients: true // 判断是否是治疗者
              },
              beforeEnter: (to, from, next) => {
                var subjectId = sessionStorage.getItem('subjectId');
                if (subjectId > 0) {
                  next();
                } else {
                  next(from.path);
                }
              }
            },
            {
              path: 'therapistsPatientList/:id',
              components: {
                content: PatientInfo
              },
              name: 'therapistsPatientInfo',
              meta: {
                therapistsPatients: true
              },
              beforeEnter: (to, from, next) => {
                var subjectId = sessionStorage.getItem('subjectId');
                if (subjectId > 0) {
                  next();
                } else {
                  next(from.path);
                }
              },
              children: [
                {
                  path: 'personalInfo',
                  component: PersonalInfo,
                  name: 'therapistsPatientsPersonalInfo',
                  meta: {
                    personalInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'therapistsPatientsDiagnosticInfo',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'therapistsPatientsDiagnosticDetail',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'experimentInfo',
                  component: ExperimentInfo,
                  name: 'therapistsPatientsExperimentInfo',
                  meta: {
                    experimentInfo: true
                  }
                }
              ]
            },
            {
              path: 'appraisersPatientList',
              name: 'appraisersPatients',
              meta: {
                appraisersPatients: true // 判断是否为评估者
              },
              beforeEnter: (to, from, next) => {
                var subjectId = sessionStorage.getItem('subjectId');
                if (subjectId > 0) {
                  next();
                } else {
                  next(from.path);
                }
              }
            },
            {
              path: 'appraisersPatientList/:id',
              components: {
                content: PatientInfo
              },
              name: 'appraisersPatientInfo',
              meta: {
                appraisersPatients: true
              },
              beforeEnter: (to, from, next) => {
                var subjectId = sessionStorage.getItem('subjectId');
                if (subjectId > 0) {
                  next();
                } else {
                  next(from.path);
                }
              },
              children: [
                {
                  path: 'personalInfo',
                  component: PersonalInfo,
                  name: 'appraisersPatientsPersonalInfo',
                  meta: {
                    personalInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'appraisersPatientsDiagnosticInfo',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'appraisersPatientsDiagnosticDetail',
                  meta: {
                    diagnosticInfo: true
                  }
                },
                {
                  path: 'experimentInfo',
                  component: ExperimentInfo,
                  name: 'appraisersPatientsExperimentInfo',
                  meta: {
                    experimentInfo: true
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'analytics',
          component: Analytics,
          name: 'analytics',
          children: [
            {
              path: 'basic',
              component: BasicAnalytics,
              name: 'basicAnalytics'
            }
          ]
        },
        {
          path: 'statistics',
          component: Statistics,
          name: 'statistics',
          meta: {
            statistics: true
          },
          children: [
            {
              path: 'dataEntryDetail',
              component: DataEntryDetail,
              name: 'dataEntryDetail',
              meta: {
                dataEntryDetail: true
              }
            },
            {
              path: 'history',
              component: DataEntryDetail,
              name: 'historyStatistics',
              meta: {
                historyStatistics: true
              }
            }
          ]
        },
        {
          path: 'configuration',
          component: Configuration,
          name: 'configuration',
          children: [
            {
              path: 'featureConfiguration',
              component: FeatureConfiguration,
              name: 'featureConfiguration',
              children: [
                {
                  path: 'minepait',
                  name: 'minepait',
                  component: SecondBar,
                  children: [
                    {
                      path: 'configpersonalinf',
                      name: 'configpersonalinf',
                      component: FreaturePersonInfo
                    },
                    {
                      path: 'configdiagnosticinfo',
                      name: 'configdiagnosticinfo',
                      component: FeatureDiagnosticInfo
                    }
                  ]
                },
                {
                  path: 'groupmana',
                  name: 'groupmana',
                  component: GroupConfiguration
                },
                {
                  path: 'department',
                  name: 'department',
                  component: DepartmentConfiguration
                },
                {
                  path: 'statisticalanalysis',
                  name: 'statisticalanalysis',
                  component: AnalysisConfiguration
                }
              ]
            },
            {
              path: 'userManagement',
              name: 'userManagement',
              component: ListFrame,
              children: [
                {
                  path: 'list/:id',
                  components: {
                    content: UserInfo
                  },
                  name: 'userInfo'
                }
              ]
            },
            {
              path: 'roleManagement',
              name: 'roleManagement',
              component: ListFrame,
              children: [
                {
                  path: 'list/:id',
                  components: {
                    content: RoleInfo
                  },
                  name: 'roleInfo'
                }
              ]
            },
            {
              path: 'dictionaryManagement',
              name: 'dictionaryManagement',
              component: DictionaryManagement,
              children: [
                {
                  path: 'diagnosisdata',
                  name: 'diagnosisdata',
                  component: DictionSecondBar,
                  children: [
                    {
                      path: 'diction-treatment-plan',
                      name: 'diction-treatment-plan',
                      component: DictionTreatmentPlan
                    },
                    {
                      path: 'diction-medical-scale',
                      name: 'diction-medical-scale',
                      component: DictionMedicalScale
                    },
                    {
                      path: 'dictioninspection',
                      name: 'dictioninspection',
                      component: DictionInspection
                    },
                    {
                      path: 'dictionimage-datas',
                      name: 'dictionimage-datas',
                      component: DictionImageDatas
                    }
                  ]
                },
                {
                  path: 'personalinformationdata',
                  name: 'personalinformationdata',
                  component: InformationSecondBar,
                  children: [
                    {
                      path: 'other-medication-history',
                      name: 'other-medication-history',
                      component: OtherMedicationHistory
                    },
                    {
                      path: 'past-history',
                      name: 'past-history',
                      component: PastHistory
                    },
                    {
                      path: 'family-history',
                      name: 'family-history',
                      component: FamilyHistory
                    },
                    {
                      path: 'personal-history',
                      name: 'personal-history',
                      component: PersonalHistory
                    },
                    {
                      path: 'toxic-exposure',
                      name: 'toxic-exposure',
                      component: ToxicExposure
                    }
                  ]
                },
                {
                  path: 'patientdatabase',
                  name: 'patientdatabase'
                }
              ]
            }
          ]
        },
        SysConfigRoute
      ]
    }
  ]
});
