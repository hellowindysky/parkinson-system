/* eslint-disable quotes */
import axios from 'axios';

export function getPatientInfo(callback) {
  var request = {
    "userId": 93242,
    "accountNumber": "15012670416",
    "userType": 1,
    "orgId": 34,
    "orgType": 2,
    "patientId": 112,
    "patientPersonVersion": 98
  };

  var url = 'http://apitest.gyenno.com/pdms/queryPatientPerson';
  // console.log(Promise);
  // var promise = new Promise(function(resolve, reject) {
  //   if (true) {
  //     resolve();
  //   } else {
  //     reject();
  //   }
  // });
  // console.log(promise);

  axios.post(url, request).then((response) => {
    console.dir(response);
    if (response.data.code === 0) {
      callback && callback(response.data.data);
    } else {
      console.log('参数错误');
      console.log(request.data.msg);
      return null;
    }

  }).catch(function(error) {
    console.log('请求失败');
    console.log(error);
  });

}
