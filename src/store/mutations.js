import * as types from './mutation_types';

const mutations = {
  [types.UPDATE_LAST_OPERATION_TIME](state) {
    state.lastOperationTime = (new Date()).getTime();
    sessionStorage.setItem('lastOperationTime', state.lastOperationTime);
  },

  [types.UPDATE_SUBJECT_ID](state, subjectId) {
    state.subjectId = subjectId;
  },

  [types.PERMIT_DISPLAYING_SENSITIVE_INFO](state) {
    state.hasRightToDisplaySensitiveInfo = true;
  },

  [types.DISCARD_RIGHT_OF_DISPLAYING_SENSITIVE_INFO](state) {
    state.hasRightToDisplaySensitiveInfo = false;
  },

  [types.SHOW_SENSITIVE_INFO](state) {
    state.showSensitiveInfo = true;
  },

  [types.HIDE_SENSITIVE_INFO](state) {
    state.showSensitiveInfo = false;
  },

  [types.UPDATE_LIST_TYPE](state, type) {
    state.listType = type;
  }
};

export default mutations;
