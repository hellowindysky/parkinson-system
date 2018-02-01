import Vue from 'vue';
import Router from 'vue-router';

import Login from 'views/login/Login';

import DoctorSelection from 'views/doctorselection/DoctorSelection';

import Layout from 'public/layout/Layout';
// import Home from 'viewshome/Home';   // 首页还没做
import ListFrame from 'views/listframe/ListFrame';
import Analytics from 'views/analytics/Analytics';
const Configuration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/Configuration');

import PatientInfo from 'patient/patientinfo/PatientInfo';
import GroupInfo from 'patient/groupinfo/GroupInfo';

import PersonalInfo from 'patient/personalinfo/PersonalInfo';
import DiagnosticInfo from 'patient/diagnosticinfo/DiagnosticInfo';
import ExperimentInfo from 'patient/experimentinfo/ExperimentInfo';

import BasicAnalytics from 'views/analytics/basicanalytics/BasicAnalytics';

const FeatureConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/FeatureConfiguration');
const SecondBar = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/configurationbar/SecondBar');
const GroupConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/groupconfiguration/GroupConfiguration');
const DepartmentConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/departmentconfiguration/DepartmentConfiguration');
const AnalysisConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/analysisconfiguration/AnalysisConfiguration');

const FeatureDiagnosticInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/FeatureDiagnosticInfo');
const FreaturePersonInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/featureconfiguration/FreaturePersonInfo');

const UserInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/usermanagement/userinfo/UserInfo');
const RoleInfo = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/rolemanagement/roleinfo/RoleInfo');

const DictionaryManagement = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/DictionaryManagement');
const DictionSecondBar = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictionsecondbar/DictionSecondBar');

const DictionTreatmentPlan = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictiontreatmentplan/DictionTreatmentPlan');
const DictionMedicalScale = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictionmedicalscale/DictionMedicalScale');
const DictionInspection = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictioninspection/DictionInspection');
const DictionImageDatas = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/dictionimagedatas/DictionImageDatas');

const InformationSecondBar = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/informationsecondbar/InformationSecondBar');
const OtherMedicationHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/othermedicationhistory/OtherMedicationHistory');
const PastHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/pasthistory/PastHistory');
const FamilyHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/familyhistory/FamilyHistory');
const PersonalHistory = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/personalhistory/PersonalHistory');
const ToxicExposure = () => import(/* webpackChunkName: 'configuration' */ 'views/configuration/dictionarymanagement/toxicexposure/ToxicExposure');

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
                therapistsPatients: true
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
                appraisersPatients: true
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
                      path: 'dictiontreatmentplan',
                      name: 'dictiontreatmentplan',
                      component: DictionTreatmentPlan
                    },
                    {
                      path: 'dictionmedicalscale',
                      name: 'dictionmedicalscale',
                      component: DictionMedicalScale
                    },
                    {
                      path: 'dictioninspection',
                      name: 'dictioninspection',
                      component: DictionInspection
                    },
                    {
                      path: 'dictionimagedatas',
                      name: 'dictionimagedatas',
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
                      path: 'othermedicationhistory',
                      name: 'othermedicationhistory',
                      component: OtherMedicationHistory
                    },
                    {
                      path: 'pasthistory',
                      name: 'pasthistory',
                      component: PastHistory
                    },
                    {
                      path: 'familyhistory',
                      name: 'familyhistory',
                      component: FamilyHistory
                    },
                    {
                      path: 'personalhistory',
                      name: 'personalhistory',
                      component: PersonalHistory
                    },
                    {
                      path: 'toxicexposure',
                      name: 'toxicexposure',
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
        }
      ]
    }
  ]
});
