import axios from 'axios';

export var baseUrl = 'http://apitest.gyenno.com';

// axios.post 本身就是个 Promise 对象，这里我们再用 Promise 封装一次，在本文件内对响应数据进行处理，对外只暴露请求成功时的有效数据
export function encapsulatePromise(url, request) {

  var promise = new Promise(function(resolve, reject) {

    axios.post(url, request).then((response) => {
      if (response.data.code === 0) {
        resolve(response.data.data);
      } else if (response.data.code === 28) {
        alert('DBS患者编码已存在，请使用其它编码提交');
        reject(response.data.msg);
      } else {
        console.log('参数错误或服务器内部错误: ', response.data.msg);
        console.log('错误代码: ', response.data.code);
        console.log('请求地址: ', url);
        console.log('请求参数: ', request);
        reject(response.data.msg);
      }

    }).catch(function(error) {
      console.error('请求出错: ', error);
    });
  });

  return promise;
};

export function getCommonRequest() {
  return JSON.parse(sessionStorage.getItem('commonRequest'));
};
