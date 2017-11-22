import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/login/Login';

import Layout from 'components/layout/Layout';
// import Home from 'components/home/Home';   // 首页还没做
import ListFrame from 'components/views/listframe/ListFrame';
import Analytics from 'components/analytics/Analytics';
import Configuration from 'components/configuration/Configuration';

import PatientInfo from 'components/views/patient/patientinfo/PatientInfo';
import GroupInfo from 'components/groupinfo/GroupInfo';

import PersonalInfo from 'components/views/patient/personalinfo/PersonalInfo';
import DiagnosticInfo from 'components/views/patient/diagnosticinfo/DiagnosticInfo';

import BasicAnalytics from 'components/basicanalytics/BasicAnalytics';

import FeatureConfiguration from 'components/featureconfiguration/FeatureConfiguration';
import SecondBar from 'components/configurationbar/SecondBar';
import GroupConfiguration from 'components/groupconfiguration/GroupConfiguration';
import DepartmentConfiguration from 'components/departmentconfiguration/DepartmentConfiguration';
import AnalysisConfiguration from 'components/analysisconfiguration/AnalysisConfiguration';

import FeatureDiagnosticInfo from 'components/featureconfiguration/FeatureDiagnosticInfo';
import FreaturePersonInfo from 'components/featureconfiguration/FreaturePersonInfo';

import UserInfo from 'components/userinfo/UserInfo';
import RoleInfo from 'components/roleinfo/RoleInfo';

import DictionaryManagement from 'components/dictionarymanagement/DictionaryManagement';
import DictionSecondBar from 'components/dictionsecondbar/DictionSecondBar';

import DictionTreatmentPlan from 'components/dictiontreatmentplan/DictionTreatmentPlan';
import DictionMedicalScale from 'components/dictionmedicalscale/DictionMedicalScale';
import DictionInspection from 'components/dictioninspection/DictionInspection';
import DictionImageDatas from 'components/dictionimagedatas/DictionImageDatas';

import InformationSecondBar from 'components/informationsecondbar/InformationSecondBar';
import OtherMedicationHistory from 'components/othermedicationhistory/OtherMedicationHistory';
import PastHistory from 'components/pasthistory/PastHistory';
import FamilyHistory from 'components/familyhistory/FamilyHistory';
import PersonalHistory from 'components/personalhistory/PersonalHistory';
import ToxicExposure from 'components/toxicexposure/ToxicExposure';

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
