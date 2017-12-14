/* eslint-disable quotes */
import { baseUrl, encapsulatePromise, getCommonRequest } from 'api/common.js';

export function resetPassword(oldPassword, newPassword, verificationCode) {
  var request = Object.assign({}, getCommonRequest());
  request.oldPassword = oldPassword;
  request.newPassword = newPassword;
  request.verifyCode = verificationCode;
  var url = baseUrl + '/usermgr/modPassword';

  return encapsulatePromise(url, request);
};

// 向手机发送短信验证码
export function sendVerificationCode(verificationInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.verify = verificationInfo;
  var url = baseUrl + '/pdms/queryCode';

  return encapsulatePromise(url, request);
};

// 验证短信验证码
export function verifyMessageCode(verificationInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.verify = verificationInfo;
  var url = baseUrl + '/pdms/verifyCode';

  return encapsulatePromise(url, request);
};

// 医生查询已授权的技术支持列表
export function getAuthenticationList() {
  var request = Object.assign({}, getCommonRequest());
  var url = baseUrl + '/usermgr/queryAuthTechSupport';

  return encapsulatePromise(url, request);
};

// 医生新增授权的技术支持，参数为一个数组
export function addAuthentication(technicalSupportAccountList, verificationCode) {
  var request = Object.assign({}, getCommonRequest());
  request.techSupport = technicalSupportAccountList;
  request.verifyCode = verificationCode;
  var url = baseUrl + '/usermgr/addAuthTechSupport';

  return encapsulatePromise(url, request);
};

// 医生解除已授权的技术支持
export function removeAuthentication(technicalSupportAccountList) {
  var request = Object.assign({}, getCommonRequest());
  request.techSupport = technicalSupportAccountList;
  var url = baseUrl + '/usermgr/delAuthTechSupport';

  return encapsulatePromise(url, request);
};

// 医生查询所有符合关键词的技术支持专员
export function getTechnicalSupport(keyword) {
  var request = Object.assign({}, getCommonRequest());
  request.keyword = keyword;
  var url = baseUrl + '/usermgr/querySupportList';

  return encapsulatePromise(url, request);
};

// 技术支持专员查询支持通知
export function getSupportMessage() {
  var request = Object.assign({}, getCommonRequest());
  var url = baseUrl + '/usermgr/querySupportMsg';

  return encapsulatePromise(url, request);
};

// 技术支持专员查询自己支持的医生列表
export function getSupportedDoctorList(condition) {
  var request = Object.assign({}, getCommonRequest());
  if (condition) {
    request.doctorCond = condition;
  }
  var url = baseUrl + '/usermgr/querySupportedDoctor';

  return encapsulatePromise(url, request);
};

export function getDictionary(version) {
  var request = Object.assign({}, getCommonRequest());
  request.version = version;
  var url = baseUrl + '/pdms/queryDictionary';

  return encapsulatePromise(url, request);
};

export function getTemplate() {
  var request = Object.assign({}, getCommonRequest());
  request.activeType = 1;

  var url = baseUrl + '/pdms/queryTemplate';

  return encapsulatePromise(url, request);
};

// 获得所有量表信息
export function getScaleInfo() {
  var request = Object.assign({}, getCommonRequest());
  var url = baseUrl + '/pdms/queryScaleInfo';

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

// 瑞金医院要的导出功能
export function exportPatients(patientIdList) {
  var request = Object.assign({}, getCommonRequest());
  request.patientIds = patientIdList;
  var url = baseUrl + '/pdms/ruiJinPatientExport';

  return encapsulatePromise(url, request);
};
