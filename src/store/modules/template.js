import {getTemplate} from 'api/user.js';
import * as types from '../mutation_types';

// initial state
const state = {
  all: []
};

const getters = {
  patientInfoTemplateGroups: (state) => {
    // 如果 state.all 为空，则返回一个包含三个空数组的数组
    if (state.all.length === 0) {
      return [[], [], []];

    } else {
      var groups = state.all.filter((table) => {
        return table.tableName === 'tc_patient_info';
      })[0].groups;

      // 然后对这个数组进行加工，让它更扁平化，方便我们在组件中使用
      var processedGroups = [];
      for (var i = 0; i < groups.length; i++) {
        processedGroups.push(groups[i].fields);
      }
      return processedGroups;
    }
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
