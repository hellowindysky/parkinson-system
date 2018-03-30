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

// 查询当期录入有效分析
export function getHistoryStatistics(entryStatistics, techSupport) {
  var request = Object.assign({}, getCommonRequest());
  if (techSupport) {
    request.techSupport = techSupport;
  }
  request.entryStatistics = entryStatistics;
  var url = '/pdms/historyStatistics';
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

// 查询历史统计的有效月份
export function queryEntryMonth() {
  var request = Object.assign({}, getCommonRequest());
  var url = '/pdms/queryEntryMonth';
  return encapsulatePromise(url, request);
}
