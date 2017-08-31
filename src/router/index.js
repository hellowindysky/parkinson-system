import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/login/Login';

import Layout from 'components/layout/Layout';
// import Home from 'components/home/Home';   // 首页还没做
import Patients from 'components/patients/Patients';
import Analytics from 'components/analytics/Analytics';
import Configuration from 'components/configuration/Configuration';

import PatientInfo from 'components/patientinfo/PatientInfo';
import GroupInfo from 'components/groupinfo/GroupInfo';

import PersonalInfo from 'components/personalinfo/PersonalInfo';
import DiagnosticInfo from 'components/diagnosticinfo/DiagnosticInfo';

import FeatureConfiguration from 'components/featureConfiguration/FeatureConfiguration';
import secondbar from 'components/configurationBar/secondbar';
import groupConfiguration from 'components/groupConfiguration/groupConfiguration';
import departmentConfiguration from 'components/departmentConfiguration/departmentConfiguration';
import analysisConfiguration from 'components/analysisConfiguration/analysisConfiguration';

import featureDiagnosticInfo from 'components/featureConfiguration/featureDiagnosticInfo';
import freaturePersonInfo from 'components/featureConfiguration/freaturePersonInfo';

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
          component: Patients,
          name: 'patients',
          children: [
            {
              path: 'list',
              name: 'myPatients'
            },
            {
              path: 'list/:id',
              components: {
                content: PatientInfo
              },
              name: 'patientInfo',
              children: [
                {
                  path: 'personalInfo',
                  component: PersonalInfo,
                  name: 'personalInfo'
                },
                {
                  path: 'diagnosticInfo',
                  component: DiagnosticInfo
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
              name: 'otherPatients'
            },
            {
              path: 'otherList/:id',
              components: {
                content: PatientInfo
              },
              name: 'otherPatientInfo'
            }
          ]
        },
        {
          path: 'analytics',
          component: Analytics,
          name: 'analytics'
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
                  component: secondbar,
                  children: [
                    {
                      path: 'configpersonalinf',
                      name: 'configpersonalinf',
                      component: freaturePersonInfo
                    },
                    {
                      path: 'configdiagnosticinfo',
                      name: 'configdiagnosticinfo',
                      component: featureDiagnosticInfo
                    }
                  ]
                },
                {
                  path: 'groupmana',
                  name: 'groupmana',
                  component: groupConfiguration
                },
                {
                  path: 'department',
                  name: 'department',
                  component: departmentConfiguration
                },
                {
                  path: 'statisticalanalysis',
                  name: 'statisticalanalysis',
                  component: analysisConfiguration
                }
              ]
            },
            {
              path: 'userManagement',
              name: 'userManagement'
            },
            {
              path: 'roleManagement',
              name: 'roleManagement'
            },
            {
              path: 'dictionaryManagement',
              name: 'dictionaryManagement'
            }
          ]
        }
      ]
    }
  ]
});
