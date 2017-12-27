/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询数据概况统计
export function queryStatDataBrief() {
  var request = Object.assign({}, getCommonRequest());
  var url = '/pdms/queryStatDataBrief';
  return encapsulatePromise(url, request);
}
// 查询省份统计
export function queryStatPatientProvince(statCond) {
  var request = Object.assign({}, getCommonRequest());
  request.statCond = statCond;
  var url = '/pdms/queryStatPatientProvince';
  return encapsulatePromise(url, request);
}
// 查询年龄统计
export function queryStatPatientAge(statCond) {
  var request = Object.assign({}, getCommonRequest());
  request.statCond = statCond;
  var url = '/pdms/queryStatPatientAge';
  return encapsulatePromise(url, request);
}

// 查询职业统计
export function queryStatPatientCareer(statCond) {
  var request = Object.assign({}, getCommonRequest());
  request.statCond = statCond;
  var url = '/pdms/queryStatPatientCareer';
  return encapsulatePromise(url, request);
}
