/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询所有课题
export function getSubjectList() {
  var request = Object.assign({}, getCommonRequest());
  var url = '/pdms/queryTaskInfo';
  return encapsulatePromise(url, request);
};

// 添加患者到课题
export function addPatientToSubject(patientSubjectList) {
  var request = Object.assign({}, getCommonRequest());
  request.taskPatient = patientSubjectList;
  var url = '/pdms/addTaskMember';

  return encapsulatePromise(url, request);
};

// 从课题移除患者
export function removePatientFromSubject(patientSubjectList) {
  var request = Object.assign({}, getCommonRequest());
  request.taskPatient = patientSubjectList;
  var url = '/pdms/delTaskMember';

  return encapsulatePromise(url, request);
};
