import { queryExportField } from 'api/patient.js';
import * as types from '../mutation_types';

var transferField = function(arr) {
  let copyData = [];
  arr.forEach((item) => {
    for (let i = 0; i < copyData.length; i++) {
      if (item.gid === copyData[i].gid && item.fid === copyData[i].fid) {
        item.checked = false;
        copyData[i].fields.push(item);
        return;
      }
    };
    item.checked = false;
    copyData.push({
      gid: item.gid, // 个人信息或诊断信息
      fid: item.fid, // 基础情况现病史
      fields: [item]
    });
  });
  return copyData;
};

const state = {
  exportFields: []
};

const getters = {
  exportFields(state) {
    return transferField(state.exportFields);
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
