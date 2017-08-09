import {getDictionary} from 'api/user.js';
import * as types from '../mutation_types';

// initial state
const state = {
  all: {}
};

const getters = {
  basicInfoDictionaryGroups: (state) => {
    // 如果 state.all.tables 为 undefined，则返回一个包含三个空数组的数组
    if (!state.all.tables) {
      return [[], [], []];

    } else {
      var groups = state.all.tables.filter((table) => {
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
