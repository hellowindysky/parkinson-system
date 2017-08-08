import {getDictionary} from 'api/user.js';
import * as types from '../mutation_types';

// initial state
const state = {
  all: {}
};

const getters = {
  patientInfoDictionaryGroups: (state) => {
    // 如果 state.all.tables 为空，则返回空数组
    if (!state.all.tables) {
      return [];

    } else {
      var groups = state.all.tables.filter((table) => {
        return table.tableName === 'tc_patient_info';
      })[0].groups;
      return groups;
    }
  }
};

const actions = {
  getWholeDictionary({ commit }) {
    getDictionary().then(data => {
      commit(types.UPDATE_DICTIONARY, data);
    });
  }
};

const mutations = {
  [types.UPDATE_DICTIONARY](state, data) {
    state.all = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
