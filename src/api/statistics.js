/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询运营数据
export function getStatisticsData(entryStatistics, techSupport) {
  var request = Object.assign({}, getCommonRequest());
  if (techSupport) {
    request.techSupport = techSupport;
  }
  request.entryStatistics = entryStatistics;
  var url = '/pdms/entryStatistics';
  return encapsulatePromise(url, request);
};

// 查询当期录入明细
export function getStatisticsDetail(entryStatistics, techSupport) {
  var request = Object.assign({}, getCommonRequest());
  if (techSupport) {
    request.techSupport = techSupport;
  }
  request.entryStatistics = entryStatistics;
  var url = '/pdms/currentEntryDetail';
  return encapsulatePromise(url, request);
};

// 查询当期量表明细
export function getScaleDetail(entryStatistics, techSupport) {
  var request = Object.assign({}, getCommonRequest());
  if (techSupport) {
    request.techSupport = techSupport;
  }
  request.entryStatistics = entryStatistics;
  var url = '/pdms/currentScaleDetail';
  return encapsulatePromise(url, request);
};
