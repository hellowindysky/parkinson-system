import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/views/login/Login';

import Layout from 'components/public/layout/Layout';
// import Home from 'components/views/home/Home';   // 首页还没做
import ListFrame from 'components/views/listframe/ListFrame';
import Analytics from 'components/views/analytics/Analytics';
import Configuration from 'components/views/configuration/Configuration';

import PatientInfo from 'components/views/patient/patientinfo/PatientInfo';
import GroupInfo from 'components/views/patient/groupinfo/GroupInfo';

import PersonalInfo from 'components/views/patient/personalinfo/PersonalInfo';
import DiagnosticInfo from 'components/views/patient/diagnosticinfo/DiagnosticInfo';

import BasicAnalytics from 'components/views/analytics/basicanalytics/BasicAnalytics';

import FeatureConfiguration from 'components/views/configuration/featureconfiguration/FeatureConfiguration';
import SecondBar from 'components/views/configuration/featureconfiguration/configurationbar/SecondBar';
import GroupConfiguration from 'components/views/configuration/featureconfiguration/groupconfiguration/GroupConfiguration';
import DepartmentConfiguration from 'components/views/configuration/featureconfiguration/departmentconfiguration/DepartmentConfiguration';
import AnalysisConfiguration from 'components/views/analytics/analysisconfiguration/AnalysisConfiguration';

import FeatureDiagnosticInfo from 'components/views/configuration/featureconfiguration/FeatureDiagnosticInfo';
import FreaturePersonInfo from 'components/views/configuration/featureconfiguration/FreaturePersonInfo';

import UserInfo from 'components/views/configuration/usermanagement/userinfo/UserInfo';
import RoleInfo from 'components/views/configuration/rolemanagement/roleinfo/RoleInfo';

import DictionaryManagement from 'components/views/configuration/dictionarymanagement/DictionaryManagement';
import DictionSecondBar from 'components/views/configuration/dictionarymanagement/dictionsecondbar/DictionSecondBar';

import DictionTreatmentPlan from 'components/views/configuration/dictionarymanagement/dictiontreatmentplan/DictionTreatmentPlan';
import DictionMedicalScale from 'components/views/configuration/dictionarymanagement/dictionmedicalscale/DictionMedicalScale';
import DictionInspection from 'components/views/configuration/dictionarymanagement/dictioninspection/DictionInspection';
import DictionImageDatas from 'components/views/configuration/dictionarymanagement/dictionimagedatas/DictionImageDatas';

import InformationSecondBar from 'components/views/configuration/dictionarymanagement/informationsecondbar/InformationSecondBar';
import OtherMedicationHistory from 'components/views/configuration/dictionarymanagement/othermedicationhistory/OtherMedicationHistory';
import PastHistory from 'components/views/configuration/dictionarymanagement/pasthistory/PastHistory';
import FamilyHistory from 'components/views/configuration/dictionarymanagement/familyhistory/FamilyHistory';
import PersonalHistory from 'components/views/configuration/dictionarymanagement/personalhistory/PersonalHistory';
import ToxicExposure from 'components/views/configuration/dictionarymanagement/toxicexposure/ToxicExposure';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
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
                  name: 'personalInfo'
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'diagnosticInfo'
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'diagnosticDetail'
                }
                // {
                //   path: 'diagnosticInfo/updatescale',
                //   component: DiagnosticInfo,
                //   name: 'diagnosticupdatescale'
                // },
                // {
                //   path: 'diagnosticInfo/addscale',
                //   component: DiagnosticInfo,
                //   name: 'diagnosticaddscale'
                // }
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
                  name: 'otherPersonalInfo'
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo,
                  name: 'otherDiagnosticInfo'
                },
                {
                  path: 'diagnosticInfo/:caseId',
                  component: DiagnosticInfo,
                  name: 'otherDiagnosticDetail'
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
