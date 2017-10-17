/* eslint-disable quotes */
import { baseUrl, encapsulatePromise, getCommonRequest } from 'api/common.js';

export function getDictionary() {
  var request = Object.assign({}, getCommonRequest());
  request.version = 43;
  var url = baseUrl + '/pdms/queryDictionary';

  return encapsulatePromise(url, request);
};

export function getTemplate() {
  var request = Object.assign({}, getCommonRequest());
  request.activeType = 1;

  var url = baseUrl + '/pdms/queryTemplate';

  return encapsulatePromise(url, request);
};

// 获取分组信息
export function getGroupList() {
  var request = Object.assign({}, getCommonRequest());
  var url = baseUrl + '/pdms/queryGroupList';

  return encapsulatePromise(url, request);
};

export function getUserList() {
  var request = Object.assign({}, getCommonRequest());

  var url = baseUrl + '/usermgr/queryUserList';

  return encapsulatePromise(url, request);
};

export function getRoleList() {
  var request = Object.assign({}, getCommonRequest());
  request = Object.assign(request, {
    "pageNo": 1,
    "pageSize": 10,
    "roleIdList": [
      "402831815996c167015996ca6cdb0020",
      "402831815ad9e7e7015ad9ecfab90009",
      "402831815bccdd69015bccea151f0006"
    ],
    "roleName": "%",
    "roleType": 2,
    "org": {
      "id": "8a9e2d385ea7264f015ea8361036008b"
    }
  });

  var url = baseUrl + '/pdms/queryRoleList';

  return encapsulatePromise(url, request);
};
