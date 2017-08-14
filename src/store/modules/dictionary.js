import {getDictionary} from 'api/user.js';
import * as types from '../mutation_types';

var getGroups = function(state, tableName) {
  // 如果 state.all.tables 为 undefined，则返回一个空数组
  if (!state.all.tables) {
    return [];

  } else {
    var groups = state.all.tables.filter((table) => {
      return table.tableName === tableName;
    })[0].groups;

    // 然后对这个数组进行加工，让它更扁平化，方便我们在组件中使用
    var processedGroups = [];
    for (var i = 0; i < groups.length; i++) {
      processedGroups.push(groups[i].fields);
    }
    return processedGroups;
  }
};

// initial state
const state = {
  all: {}
};

const getters = {
  basicInfoDictionaryGroups: (state) => {
    return getGroups(state, 'tc_patient_info');
  },
  diseaseInfoDictionaryGroups: (state) => {
    return getGroups(state, 'tc_patient_disease_info');
  },
  typeGroup: (state) => {
    // 如果 state.all.typegroup 为 undefined，则返回一个空数组
    if (!state.all.typegroup) {
      return [];
    } else {
      return state.all.typegroup;
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
