import { queryExportField } from 'api/patient.js';
import * as types from '../mutation_types';

var transfer = function(res) {
  res = Array.isArray(res) ? res : [];
  res.forEach((item) => {
    item.checked = false;
  });
  return res;
};

const state = {
  exportFields: [],

  // 是否拥有导出权限 涉及到 导出模版设置/筛选页面批量导出/诊断导出
  hasRightToExport: false
};

const getters = {
  totalExportFields(state) {
    return transfer(state.exportFields);
  },

  isHasRightToExport(state) {
    return state.hasRightToExport;
  }
};

const mutations = {
  [types.UPDATE_EXPORT_FIELDS](state, res) {
    state.exportFields = res;
  },

  [types.CHANGE_EXPORT_RIGHT](state, hasRight) {
    state.hasRightToExport = hasRight;
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
