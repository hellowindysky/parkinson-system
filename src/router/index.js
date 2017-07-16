import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/login/Login';

import Layout from 'components/layout/Layout';
// import Home from 'components/home/Home';   // 首页还没做
import Patients from 'components/patients/Patients';
import Analytics from 'components/analytics/Analytics';
import Configuration from 'components/configuration/Configuration';

import PatientList from 'components/patientlist/PatientList';
import PatientInfo from 'components/patientinfo/PatientInfo';
import GroupList from 'components/grouplist/GroupList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    // {
    //   path: '*',
    //   redirect: '/login'
    // },
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/login',
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
              path: 'list/:id',
              components: {
                list: PatientList,
                content: PatientInfo
              },
              name: 'patientList'
            },
            {
              path: 'groups',
              components: {
                list: GroupList,
                content: PatientInfo
              },
              name: 'patientGroups'
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
          name: 'configuration'
        }
      ]
    }
  ]
});
