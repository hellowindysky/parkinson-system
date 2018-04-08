/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询数据概况统计
export function queryStatDataBrief(taskId) {
  var request = Object.assign({}, getCommonRequest());
  request.taskId = taskId;
  var url = '/pdms/queryStatDataBrief';
  return encapsulatePromise(url, request);
}
// 查询省份统计
export function queryStatPatientProvince(statCond, taskId) {
  var request = Object.assign({}, getCommonRequest());
  request.statCond = statCond;
  request.taskId = taskId;
  var url = '/pdms/queryStatPatientProvince';
  return encapsulatePromise(url, request);
}
// 查询年龄统计
export function queryStatPatientAge(statCond, taskId) {
  var request = Object.assign({}, getCommonRequest());
  request.statCond = statCond;
  request.taskId = taskId;
  var url = '/pdms/queryStatPatientAge';
  return encapsulatePromise(url, request);
}

// 查询职业统计
export function queryStatPatientCareer(statCond, taskId) {
  var request = Object.assign({}, getCommonRequest());
  request.statCond = statCond;
  request.taskId = taskId;
  var url = '/pdms/queryStatPatientCareer';
  return encapsulatePromise(url, request);
}
