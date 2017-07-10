import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/login/Login';
import Layout from 'components/layout/Layout';
import Home from 'components/home/Home';

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
        }
      ]
    }
  ]
});
