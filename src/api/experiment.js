/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询实验流程
export function queryExperimentProgress(experimentInfo) {
  // 医院的类型决定了参数键值的区别
  var request = Object.assign({}, getCommonRequest());
  request.patientExperiment = experimentInfo;
  var url = '/pdms/queryPatientExperiment';
  return encapsulatePromise(url, request);
};

// 查询所属医生/治疗者/评估者
export function queryExperimentMember(subjectId) {
  var request = Object.assign({}, getCommonRequest());
  if (subjectId) {
    request.taskInfoId = subjectId;
  }
  // if (experimentGroupId) {
  //   request.taskGroupId = experimentGroupId;
  // }
  // if (roleType) {
  //   // 0.所属医生 1.治疗者 2.评估者  如果没有该参数则三个数组一起返回
  //   request.taskRoleType = roleType;
  // }
  var url = '/pdms/queryTreaterAndAssessor';
  return encapsulatePromise(url, request);
};

// 开始实验
export function startExperiment(experimentInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientExperiment = experimentInfo;
  var url = '/pdms/startPatientExperiment';
  return encapsulatePromise(url, request);
};

// 加入实验组
export function joinExperiment(experimentInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientExperiment = {
    patientExperimentModel: experimentInfo,
    type: 1     // 1 是入组
  };
  var url = '/pdms/addPatientExperiment';
  return encapsulatePromise(url, request);
};

// 退出实验组
export function leaveExperiment(experimentInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientExperiment = {
    patientExperimentModel: experimentInfo,
    type: 0     // 0 是排除出组
  };
  var url = '/pdms/addPatientExperiment';
  return encapsulatePromise(url, request);
};

// 筛选通过
export function agreeEnteringExperiment(experimentInfo, hospitalType) {
  var request = Object.assign({}, getCommonRequest());
  if (hospitalType !== undefined) {
    var key = 'patientExperiment_' + hospitalType;
    request[key] = experimentInfo;
  }
  var url = '/pdms/agreePatientExperiment';
  return encapsulatePromise(url, request);
};

// 拒绝加入实验组
// export function rejectEnteringExperiment(experimentInfo) {
//   var request = Object.assign({}, getCommonRequest());
//   request.shengRenYiPatientExperiment = experimentInfo;
//   var url = '/pdms/returnPatientExperiment';
//   return encapsulatePromise(url, request);
// };

// 结束治疗 以及 随访期流转
export function completeExperiment(experimentInfo, hospitalType) {
  var request = Object.assign({}, getCommonRequest());
  if (hospitalType !== undefined) {
    var key = 'patientExperiment_' + hospitalType;
    request[key] = experimentInfo;
  }
  var url = 'pdms/completePatientExperiment';
  return encapsulatePromise(url, request);
};

// 结束随访
export function completeFollowUp(experimentInfo, hospitalType) {
  var request = Object.assign({}, getCommonRequest());
  if (hospitalType !== undefined) {
    var key = 'patientExperiment_' + hospitalType;
    request[key] = experimentInfo;
  }
  var url = 'pdms/completeFollowUp';
  return encapsulatePromise(url, request);
};
