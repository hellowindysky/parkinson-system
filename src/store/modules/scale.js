import {getScaleInfo} from 'api/user.js';
import * as types from '../mutation_types';

// import { deepCopy } from 'utils/helper.js';

// initial state
const state = {
  all: {}
};

const getters = {
  allScale: (state) => {
    // 基础信息
    return state.scales ? state.scales : [];
  }
};

const actions = {
  getScaleList({ commit }) {
    getScaleInfo().then(data => {
      commit(types.UPDATE_SCALE_INFO, data);
    });
  }
};

const mutations = {
  [types.UPDATE_SCALE_INFO](state, data) {
    state.all = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
