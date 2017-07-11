import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/login/Login';
import Layout from 'components/layout/Layout';
import Home from 'components/home/Home';
import Patients from 'components/patients/Patients';
import Analytics from 'components/analytics/Analytics';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          component: Home,
          name: '首页'
        },
        {
          path: 'patients',
          component: Patients,
          name: '我的患者'
        },
        {
          path: 'analytics',
          component: Analytics,
          name: '统计分析'
        }
      ]
    }
  ]
});
