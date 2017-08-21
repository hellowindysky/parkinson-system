import {getDictionary} from 'api/user.js';
import * as types from '../mutation_types';

import { deepCopy } from 'utils/helper.js';

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
  diseaseHistoryDictionary: (state) => {
    var groups = getGroups(state, 'tc_patient_disease');
    // 既往史只有一个 group
    return groups[0];
  },
  typeGroup: (state) => {
    // 如果 state.all.typegroup 为 undefined，则返回一个空数组
    if (!state.all.typegroup) {
      return [];
    } else {
      // 在 typegroup 里面，有几个键值对需要特殊处理一下，将其键由 1，2，3这样的数字改成其对应的值
      var specialList = ['homeProvince'];

      // 为例避免直接修改 state（否则 Vuex 会报错），这里对 state.all.typegroup先进行深复制
      var typegroup = deepCopy(state.all.typegroup);

      for (let group of typegroup) {
        let types = group.types;
        for (let type of types) {
          if (specialList.indexOf(group.typegroupcode) > -1) {
            type.typeCode = type.typeName;
          } else {
            // 对于其它普通的 typeCode，因为服务器给的是字符串，需要转化为 Number
            type.typeCode = parseInt(type.typeCode, 10);
          }
        }
      }
      return typegroup;
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
