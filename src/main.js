// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios';

import 'normalize.css';  // 引入normalize.css
// import 'element-ui/lib/theme-default/index.css';  // 放弃默认的element-theme
import 'styles/element-theme/index.css';  // 改用自定义配置生成的css
import 'styles/iconfont/iconfont.css';  // 加入自定义图标字体（引入线上 iconfont 之后，就不需要这一行了）

import 'es6-promise/auto'; // 为了兼容 IE 11，引入对 promise 的支持，否则 Vuex 会报错

import App from './App';
import router from './router';
import store from './store';

import globalVariables from 'utils/constant.js'; // 引入常量

// 将这些常量注入到每一个组件里面，就成了全局常量，这样在子组件里面就能用形如 this.READING_MODE 的方式读取常量了
for (let name in globalVariables) {
  Vue.prototype[name] = globalVariables[name];
}

// 添加全局的路由守卫，如果请求头里没有 token 信息，则返回登录界面
router.afterEach(() => {
  if (axios.defaults.headers.common['Authorization'] === undefined) {
    router.push({name: 'login'});
  }
});

Vue.config.productionTip = false;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
