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
export function getGroupList(groupInfoCondition) {
  var request = Object.assign({}, getCommonRequest());
  if (groupInfoCondition === undefined) {
    request.groupInfoCond = {};
  } else {
    request.groupInfoCond = groupInfoCondition;
  }
  var url = baseUrl + '/pdms/queryGroupList';

  return encapsulatePromise(url, request);
};

// 修改组名
export function modifyGroupName(groupId, name) {
  var request = Object.assign({}, getCommonRequest());
  if (groupId !== undefined) {
    request.groupId = groupId;
  }
  if (name !== undefined) {
    request.groupeName = name;
  }
  var url = baseUrl + '/pdms/modGroupName';

  return encapsulatePromise(url, request);
};

// 查询分组说明
export function getGroupRemarks(groupId) {
  var request = Object.assign({}, getCommonRequest());
  if (groupId !== undefined) {
    request.groupId = groupId;
  }
  var url = baseUrl + '/pdms/groupRemarks';

  return encapsulatePromise(url, request);
};

// 编辑分组说明
export function modifyGroupRemarks(groupId, remarks) {
  var request = Object.assign({}, getCommonRequest());
  if (groupId !== undefined) {
    request.groupId = groupId;
  }
  if (remarks !== undefined) {
    request.remarks = remarks;
  }
  var url = baseUrl + '/pdms/editGroupRemarks';

  return encapsulatePromise(url, request);
};
