// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';

// 下面放弃默认的element-theme，而改用自定义配置生成的css
// import 'element-ui/lib/theme-default/index.css';
import 'styles/element-theme/index.css';

// 加入自定义图标字体
import 'styles/iconfont/iconfont.css';

import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
