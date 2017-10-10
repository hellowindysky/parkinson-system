/* eslint-disable quotes */
import axios from 'axios';

// axios.post 本身就是个 Promise 对象，这里我们再用 Promise 封装一次，在本文件内对响应数据进行处理，对外只暴露请求成功时的有效数据
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

// 查询某个分组下的病患列表
export function getGroupPatients(groupId) {
  var request = {
    "userId": 93242,
    "accountNumber": "15527231713",
    "userType": 2,
    "orgId": 34,
    "orgType": 2,
    "groupId": groupId
  };
  var url = 'http://apitest.gyenno.com/pdms/queryGroupInfo';

  return encapsulatePromise(url, request);
};
