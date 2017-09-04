/* eslint-disable quotes */
import axios from 'axios';

function encapsulatePromise(url, request) {

  var promise = new Promise(function(resolve, reject) {

    axios.post(url, request).then((response) => {
      if (response.data.code === 0) {
        resolve(response.data.data);
      } else {
        console.log('参数错误或服务器内部错误: ', response.data.msg);
        reject();
      }

    }).catch(function(error) {
      console.error('请求出错: ', error);
      reject();
    });
  });

  return promise;
}

export function getPatientList() {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "pageNo": 1,
    "pageSize": 0
  };

  var url = 'http://apitest.gyenno.com/pdms/queryPatientList';
  return encapsulatePromise(url, request);
};

export function getPatientInfo(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
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
    "accountNumber": "15527231713",
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
    "accountNumber": "15527231713",
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
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientId": patientIdNum
  };
  var url = 'http://apitest.gyenno.com/pdms/queryPatientMedHistoryList';

  return encapsulatePromise(url, request);
};

// 新增用药史
export function addPatientMedHistory(medHistory) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientMedHistory": medHistory
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 修改用药史
export function modifyPatientMedHistory(medHistory) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientMedHistory": medHistory
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 删除用药史
export function deletePatientMedHistory(medHistory) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientMedHistory": medHistory
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientMedHistory';

  return encapsulatePromise(url, request);
}

// 新增既往史
export function addPatientDisease(patientDisease) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientDisease": patientDisease
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientDisease';

  return encapsulatePromise(url, request);
};

// 修改既往史
export function modifyPatientDisease(patientDisease) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientDisease": patientDisease
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientDisease';

  return encapsulatePromise(url, request);
};

// 删除既往史
export function deletePatientDisease(patientDisease) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientDisease": patientDisease
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientDisease';

  return encapsulatePromise(url, request);
};

// 新增家族史
export function addPatientFamily(patientFamily) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientFamily": patientFamily
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientFamily';

  return encapsulatePromise(url, request);
};

// 修改家族史
export function modifyPatientFamily(patientFamily) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientFamily": patientFamily
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientFamily';

  return encapsulatePromise(url, request);
};

// 删除家族史
export function deletePatientFamily(patientFamily) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientFamily": patientFamily
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientFamily';

  return encapsulatePromise(url, request);
};

// 新增锻炼史
export function addPatientExercise(patientExercise) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientExercise": patientExercise
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientExercise';

  return encapsulatePromise(url, request);
};

// 修改锻炼史
export function modifyPatientExercise(patientExercise) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientExercise": patientExercise
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientExercise';

  return encapsulatePromise(url, request);
};

// 删除锻炼史
export function deletePatientExercise(patientExercise) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientExercise": patientExercise
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientExercise';

  return encapsulatePromise(url, request);
};

// 新增吸烟史
export function addPatientSmoke(patientSmoke) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientSmoke": patientSmoke
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientSmoke';

  return encapsulatePromise(url, request);
};

// 修改吸烟史
export function modifyPatientSmoke(patientSmoke) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientSmoke": patientSmoke
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientSmoke';

  return encapsulatePromise(url, request);
};

// 删除吸烟史
export function deletePatientSmoke(patientSmoke) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientSmoke": patientSmoke
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientSmoke';

  return encapsulatePromise(url, request);
};

// 新增饮酒史
export function addPatientWine(patientWine) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientWine": patientWine
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientWine';

  return encapsulatePromise(url, request);
};

// 修改饮酒史
export function modifyPatientWine(patientWine) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientWine": patientWine
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientWine';

  return encapsulatePromise(url, request);
};

// 删除饮酒史
export function deletePatientWine(patientWine) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientWine": patientWine
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientWine';

  return encapsulatePromise(url, request);
};

// 新增喝茶史
export function addPatientTea(patientTea) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientTea": patientTea
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientTea';

  return encapsulatePromise(url, request);
};

// 修改喝茶史
export function modifyPatientTea(patientTea) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientTea": patientTea
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientTea';

  return encapsulatePromise(url, request);
};

// 删除喝茶史
export function deletePatientTea(patientTea) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientTea": patientTea
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientTea';

  return encapsulatePromise(url, request);
};

// 新增咖啡史
export function addPatientCoffee(patientCoffee) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientCoffee": patientCoffee
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientCoffee';

  return encapsulatePromise(url, request);
};

// 修改咖啡史
export function modifyPatientCoffee(patientCoffee) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientCoffee": patientCoffee
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientCoffee';

  return encapsulatePromise(url, request);
};

// 删除咖啡史
export function deletePatientCoffee(patientCoffee) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientCoffee": patientCoffee
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientCoffee';

  return encapsulatePromise(url, request);
};

// 新增毒物接触史
export function addPatientToxicExposure(toxicExposure) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientCideexposed": toxicExposure
  };
  var url = 'http://apitest.gyenno.com/pdms/addPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 修改毒物接触史
export function modifyPatientToxicExposure(toxicExposure) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientCideexposed": toxicExposure
  };
  var url = 'http://apitest.gyenno.com/pdms/modPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 删除毒物接触史
export function deletePatientToxicExposure(toxicExposure) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientCideexposed": toxicExposure
  };
  var url = 'http://apitest.gyenno.com/pdms/delPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 获取患者诊断列表
export function getPatientCaseList(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "patientId": patientIdNum,
    "pageSize": 0,
    "pageNo": 1
  };
  var url = 'http://apitest.gyenno.com/pdms/queryPatientCaseList';
  return encapsulatePromise(url, request);
};
