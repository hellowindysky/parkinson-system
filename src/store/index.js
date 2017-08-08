import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import dictionary from './modules/dictionary';
import template from './modules/template';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  modules: {
    dictionary,
    template
  },
  strict: debug
});
