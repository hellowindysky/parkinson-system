// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';

import 'normalize.css';  // 引入normalize.css
// import 'element-ui/lib/theme-default/index.css';  // 放弃默认的element-theme
import 'styles/element-theme/index.css';  // 改用自定义配置生成的css
import 'styles/iconfont/iconfont.css';  // 加入自定义图标字体

import App from './App';
import router from './router';
import store from './store';

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
