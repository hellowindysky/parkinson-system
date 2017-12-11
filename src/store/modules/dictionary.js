import {getDictionary} from 'api/user.js';
import * as types from '../mutation_types';

import { deepCopy } from 'utils/helper.js';

var getGroups = function(state, tableName) {
  // 如果 state.all.tables 为 undefined，则返回一个空数组
  if (!state.all.tables) {
    return [];

  } else {
    var table = state.all.tables.filter((table) => {
      return table.tableName === tableName;
    })[0];

    if (!table || !table.groups) {
      return [];
    }
    var groups = table.groups;

    // 然后对这个数组进行加工，让它更扁平化，方便我们在组件中使用
    var processedGroups = [];
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i].fields ? groups[i].fields : [];
      processedGroups.push(group);
    }
    return processedGroups;
  }
};

var getFirstGroup = function(state, tableName) {
  // 对于那些 getGroups() 后只有 1 个元素的数组，我们直接取其第一个元素的 fields 属性值，这样就不用在使用的时候再去处理
  var groups = getGroups(state, tableName);
  return groups[0] ? groups[0] : [];
};

// initial state
const state = {
  all: {}
};

const getters = {
  basicInfoDictionaryGroups: (state) => {
    // 基础信息
    return getGroups(state, 'tc_patient_info');
  },
  diseaseInfoDictionaryGroups: (state) => {
    // 病症信息
    return getGroups(state, 'tc_patient_disease_info');
  },
  presentHistoryDictionary: (state) => {
    // 现病史只有一个 group
    return getFirstGroup(state, 'tc_patient_history');
  },
  medHistoryDictionary: (state) => {
    // 其它用药史只有一个 group
    return getFirstGroup(state, 'tc_patient_medhistory');
  },
  diseaseHistoryDictionary: (state) => {
    // 既往史只有一个 group
    return getFirstGroup(state, 'tc_patient_disease');
  },
  familyHistoryDictionary: (state) => {
    // 家族史只有一个 group
    return getFirstGroup(state, 'tc_family_history');
  },
  coffeeHistoryDictionary: (state) => {
    // 咖啡史只有一个 group
    return getFirstGroup(state, 'tc_patient_coffee');
  },
  teaHistoryDictionary: (state) => {
    // 喝茶史只有一个 group
    return getFirstGroup(state, 'tc_patient_tea');
  },
  smokeHistoryDictionary: (state) => {
    // 吸烟史只有一个 group
    return getFirstGroup(state, 'tc_patient_smoke');
  },
  wineHistoryDictionary: (state) => {
    // 饮酒史只有一个 group
    return getFirstGroup(state, 'tc_patient_wine');
  },
  exerciseHistoryDictionary: (state) => {
    // 锻炼史只有一个 group
    return getFirstGroup(state, 'tc_patient_exercise');
  },
  toxicExposureHistoryDictionary: (state) => {
    // 毒物史只有一个 group
    return getFirstGroup(state, 'tc_cideexposed_history');
  },
  patientCaseDictionary: (state) => {
    // 诊断信息只有一个 group
    return getFirstGroup(state, 'tc_patient_case');
  },
  diagnosticDiseaseDictionary: (state) => {
    // 诊断信息下的病症情况只有一个 group
    return getFirstGroup(state, 'tc_patient_case_disease');
  },
  diagnosticDiseaseMsDictionary: (state) => {
    // 诊断信息->病症情况->运动症状
    return getFirstGroup(state, 'tc_patient_case_disease_ms');
  },
  diagnosticDiseaseMcDictionary: (state) => {
    // 诊断信息->病症情况->运动并发症
    return getFirstGroup(state, 'tc_patient_case_disease_mc');
  },
  diagnosticDiseaseNmsDictionary: (state) => {
    // 诊断信息->病症情况->非运动症状
    return getFirstGroup(state, 'tc_patient_case_disease_nms');
  },
  medicineDictionary: (state) => {
    // 药物信息只有一个 group
    return getFirstGroup(state, 'tc_patient_medicine');
  },
  surgicalMethodDictionary: (state) => {
    // 手术方案只有一个 group
    return getFirstGroup(state, 'tc_patient_treatment');
  },
  operativeComplicationDictionary: (state) => {
    // 术后并发症只有一个 group
    return getFirstGroup(state, 'tc_patient_complication');
  },
  medicineInfo: (state) => {
    // medicineInfo 是药物所具有的特殊字典项，包含了各种不规则的详细信息
    if (!state.all.tableData || !state.all.tableData.medicineInfo) {
      return [];
    }
    return state.all.tableData.medicineInfo;
  },
  medicineStopReason: (state) => {
    // 停药原因
    if (!state.all.tableData || !state.all.tableData.medicineStopReason) {
      return [];
    }
    return state.all.tableData.medicineStopReason;
  },
  symptomType: (state) => {
    // 主诉的各种症状
    if (!state.all.tableData || !state.all.tableData.symptomType) {
      return [];
    }
    return state.all.tableData.symptomType;
  },
  noSportType: (state) => {
    // 主诉的各种症状 非运动症状类型 zq
    if (!state.all.tableData || !state.all.tableData.noSportType) {
      return [];
    }
    return state.all.tableData.noSportType;
  },
  deviceInfo: (state) => {
    // 主诉的各种症状
    if (!state.all.tableData || !state.all.tableData.deviceInfo) {
      return [];
    }
    return state.all.tableData.deviceInfo;
  },
  surgicalTypeList: (state) => {
    // 手术方案
    if (!state.all.tableData || !state.all.tableData.surgicalInfo) {
      return [];
    }
    return state.all.tableData.surgicalInfo;
  },
  complicationTypeList: (state) => {
    // 术后并发症
    if (!state.all.tableData || !state.all.tableData.patientComplicationType) {
      return [];
    }
    return state.all.tableData.patientComplicationType;
  },
  scaleList: (state) => {
    // 量表
    if (!state.all.tableData || !state.all.tableData.scaleInfo) {
      return [];
    }
    return state.all.tableData.scaleInfo;
  },
  neurologicCheckTypeList: (state) => {
    // 神经系统检查
    if (!state.all.tableData || !state.all.tableData.spephysicalInfo) {
      return [];
    }
    return state.all.tableData.spephysicalInfo;
  },
  bioexamTypeList: (state) => {
    // 生化指标检查
    if (!state.all.tableData || !state.all.tableData.bioexamInfo) {
      return [];
    }
    return state.all.tableData.bioexamInfo;
  },
  emgTypeList: (state) => {
    // 肌电图
    if (!state.all.tableData || !state.all.tableData.elecTroGramInfo) {
      return [];
    }
    return state.all.tableData.elecTroGramInfo;
  },
  rhythm: (state) => {
    // 生命体征
    if (!state.all.tableData || !state.all.tableData.rhythm) {
      return [];
    }
    return state.all.tableData.rhythm;
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
    // 在 localStorage 里面获取之前存取的 dictionary
    var lastDictionary = JSON.parse(localStorage.getItem('dictionary'));
    if (lastDictionary) {
      commit(types.UPDATE_DICTIONARY, lastDictionary);
    }

    // 然后将上次存的 dictionary 的 version 作为参数传给服务器，由服务器来判断 dictionary 是否有更新
    // 如果有新版本的 dictionary，则在这里自动更新，如果服务器返回的 code 为 6(即返回错误)，那么就不用更新
    var lastVersion = (lastDictionary && lastDictionary.version) ? lastDictionary.version : 0;
    getDictionary(lastVersion).then(data => {
      localStorage.setItem('dictionary', JSON.stringify(data));
      commit(types.UPDATE_DICTIONARY, data);
    }, error => {
      if (error.code === 6) {
        // console.log('dictionary 已是最新');
      } else {
        console.log(error);
      }
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
