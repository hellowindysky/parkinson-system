/* eslint-disable quotes */
import { baseUrl, encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询某个分组下的病患列表
export function getGroupPatients(groupId) {
  var request = Object.assign({}, getCommonRequest());
  request.groupId = groupId;
  var url = baseUrl + '/pdms/queryGroupInfo';

  return encapsulatePromise(url, request);
};

// 获取分组信息
export function getGroupList() {
  var request = Object.assign({}, getCommonRequest());
  var url = baseUrl + '/pdms/queryGroupList';

  return encapsulatePromise(url, request);
};
