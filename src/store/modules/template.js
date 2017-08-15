import {getTemplate} from 'api/user.js';
import * as types from '../mutation_types';

var getGroups = function(state, tableName) {
  // 如果 state.all 为空，则返回一个空数组
  if (state.all.length === 0) {
    return [];

  } else {
    var groups = state.all.filter((table) => {
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
  all: []
};

const getters = {
  basicInfoTemplateGroups: (state) => {
    return getGroups(state, 'tc_patient_info');
  },
  DiseaseInfoTemplateGroups: (state) => {
    return getGroups(state, 'tc_patient_disease_info');
  }
};

const actions = {
  getWholeTemplate({ commit }) {
    getTemplate().then(data => {
      commit(types.UPDATE_TEMPLATE, data);
    });
  }
};

const mutations = {
  [types.UPDATE_TEMPLATE](state, data) {
    state.all = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
