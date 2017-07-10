import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/login/Login';
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
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
});
