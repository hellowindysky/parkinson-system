/* eslint-disable quotes */
import { baseUrl, encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询数据概况统计
export function queryStatDataBrief() {
  var request = Object.assign({}, getCommonRequest());
  var url = baseUrl + '/pdms/queryStatDataBrief';
  return encapsulatePromise(url, request);
}
