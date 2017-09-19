import {getTemplate} from 'api/user.js';
import * as types from '../mutation_types';

var getGroups = function(state, tableName) {
  // 如果 state.all 为空，则返回一个空数组
  if (state.all.length === 0) {
    return [];

  } else {
    var table = state.all.filter((table) => {
      return table.tableName === tableName;
    })[0];
    var groups = table && table.groups ? table.groups : [];

    // 然后对这个数组进行加工，让它更扁平化，方便我们在组件中使用
    var processedGroups = [];
    for (var i = 0; i < groups.length; i++) {
      processedGroups.push(groups[i].fields);
    }
    return processedGroups;
  }
};

var getFirstGroup = function(state, tableName) {
  // 对于那些 getGroups() 后只有 1 个元素的数组，我们直接取其第一个元素的 fields 属性值，这样就不用在使用的时候再去处理
  var groups = getGroups(state, tableName);
  if (groups[0]) {
    return groups[0];
  } else {
    return [];
  }
};

// initial state
const state = {
  all: []
};

const getters = {
  basicInfoTemplateGroups: (state) => {
    // 基本信息
    return getGroups(state, 'tc_patient_info');
  },
  diseaseInfoTemplateGroups: (state) => {
    // 病症信息
    return getGroups(state, 'tc_patient_disease_info');
  },
  medHistoryTemplate: (state) => {
    // 其它用药史
    return getFirstGroup(state, 'tc_patient_medhistory');
  },
  diseaseHistoryTemplate: (state) => {
    // 既往史
    return getFirstGroup(state, 'tc_patient_disease');
  },
  familyHistoryTemplate: (state) => {
    // 家族史
    return getFirstGroup(state, 'tc_family_history');
  },
  toxicExposureHistoryTemplate: (state) => {
    // 毒物接触史
    return getFirstGroup(state, 'tc_cideexposed_history');
  },
  coffeeHistoryTemplate: (state) => {
    // 咖啡史
    return getFirstGroup(state, 'tc_patient_coffee');
  },
  teaHistoryTemplate: (state) => {
    // 喝茶史
    return getFirstGroup(state, 'tc_patient_tea');
  },
  smokeHistoryTemplate: (state) => {
    // 吸烟史
    return getFirstGroup(state, 'tc_patient_smoke');
  },
  wineHistoryTemplate: (state) => {
    // 饮酒史
    return getFirstGroup(state, 'tc_patient_wine');
  },
  exerciseHistoryTemplate: (state) => {
    // 锻炼史
    return getFirstGroup(state, 'tc_patient_exercise');
  },
  patientCaseTemplateGroups: (state) => {
    // 诊断信息，分成两部分，分别在‘基本情况’和‘检验检查’中，所以这个 Template 分成两个 group
    return getGroups(state, 'tc_patient_case');
  },
  patientCaseDiseaseTemplate: (state) => {
    // 诊断信息下的病症情况
    return getFirstGroup(state, 'tc_patient_case_disease');
  },
  medicineTemplateGroups: (state) => {
    return getGroups(state, 'tc_patient_medicine');
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
