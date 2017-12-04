import * as types from './mutation_types';

const mutations = {
  [types.UPDATE_LAST_OPERATION_TIME](state) {
    state.lastOperationTime = (new Date()).getTime();
  }
};

export default mutations;
