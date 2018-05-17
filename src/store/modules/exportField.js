import { queryExportField } from 'api/patient.js';
import * as types from '../mutation_types';

const state = {
  exportFields: []
};

const getters = {
  totalExportFields(state) {
    return state.exportFields;
  }
};

const mutations = {
  [types.UPDATE_EXPORT_FIELDS](state, res) {
    state.exportFields = res;
  }
};

const actions = {
  getExportFields({ commit }) {
    queryExportField().then((res) => {
      commit(types.UPDATE_EXPORT_FIELDS, res);
    }, (error) => {
      console.error(error);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
