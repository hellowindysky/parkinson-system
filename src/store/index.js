import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';
import dictionary from './modules/dictionary';
import template from './modules/template';
import scale from './modules/scale';
import exportField from './modules/exportField';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    dictionary,
    template,
    scale,
    exportField
  },
  strict: debug
});
