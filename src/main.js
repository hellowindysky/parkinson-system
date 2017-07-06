// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

// eslint-disable-next-line
import ElementUI from 'element-ui';

// eslint-disable-next-line
import 'element-ui/lib/theme-default/index.css';

import App from './App';
import router from './router';

// 加入我们的自定义图标字体
import 'styles/iconfont.less';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
