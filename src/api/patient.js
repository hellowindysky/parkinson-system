/* eslint-disable quotes */
import axios from 'axios';

function encapsulatePromise(url, request) {

  var promise = new Promise(function(resolve) {

    axios.post(url, request).then((response) => {
      if (response.data.code === 0) {
        resolve(response.data.data);
      } else {
        console.log('参数错误: ', response.data.msg);
      }

    }).catch(function(error) {
      console.error('请求出错: ', error);
    });
  });

  return promise;
}

export function getPatientList() {
  var request = {
    "userId": 93242,
    "accountNumber": "13265852476",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "pageNo": 1,
    "pageSize": 10
  };

  var url = 'http://apitest.gyenno.com/pdms/queryPatientList';
  return encapsulatePromise(url, request);
};

export function getPatientInfo(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = {
    "userId": 93242,
    "accountNumber": "13265852476",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientId": patientIdNum,
    "patientPersonVersion": 98
  };
  var url = 'http://apitest.gyenno.com/pdms/queryPatientPerson';

  return encapsulatePromise(url, request);
};

export function modifyPatientInfo(patientInfo) {
  var request = {
    "userId": 93242,
    "accountNumber": "13265852476",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientInfo": patientInfo
  };

  var url = 'http://apitest.gyenno.com/pdms/modPatientInfo';

  return encapsulatePromise(url, request);
};

export function modifyPatientDiseaseInfo(patientDiseaseInfo) {
  var request = {
    "userId": 93242,
    "accountNumber": "13265852476",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientDiseaseInfo": patientDiseaseInfo
  };

  var url = 'http://apitest.gyenno.com/pdms/modPatientDiseaseInfo';

  return encapsulatePromise(url, request);
};

export function getPatientMedHistoryList(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = {
    "userId": 93242,
    "accountNumber": "13265852476",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientId": patientIdNum
  };
  var url = 'http://apitest.gyenno.com/pdms/queryPatientMedHistoryList';

  return encapsulatePromise(url, request);
};
