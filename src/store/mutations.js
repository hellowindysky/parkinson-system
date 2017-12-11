import * as types from './mutation_types';

const mutations = {
  [types.UPDATE_LAST_OPERATION_TIME](state) {
    state.lastOperationTime = (new Date()).getTime();
  },

  [types.UPDATE_SUBJECT_ID](state, subjectId) {
    state.subjectId = subjectId;
  },

  [types.PERMIT_DISPLAYING_SENSITIVE_INFO](state) {
    state.hasRightToDisplaySensitiveInfo = true;
  },

  [types.DISCARD_RIGHT_OF_DISPLAYING_SENSITIVE_INFO](state) {
    state.hasRightToDisplaySensitiveInfo = false;
  }
};

export default mutations;
