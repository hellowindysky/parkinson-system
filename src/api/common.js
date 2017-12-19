import axios from 'axios';
import { Message } from 'element-ui';

export var baseUrl = process.env.BASE_API;

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // console.log(config);
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log('请求错误: ', error);
  }
);

// 给请求头设置 token
export function setRequestToken(token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

// 清除请求头里的 token
export function clearRequestToken() {
  delete axios.defaults.headers.common['Authorization'];
};

// axios.post 本身就是个 Promise 对象，这里我们再用 Promise 封装一次，在本文件内对响应数据进行处理，对外只暴露请求成功时的有效数据
export function encapsulatePromise(url, request) {

  var promise = new Promise(function(resolve, reject) {

    axios.post(url, request).then((response) => {
      if (response.data.code === 0) {
        resolve(response.data.data);
      } else {
        if (response.data.code !== 6) {
          // code 为 6 代表没有修改，因为前端对某些数据做了缓存，每次刷新如果数据没变都会遇到这个 code
          // 这个并不是真正的请求出错，因此没有必要打印出来
          console.log('参数错误或服务器内部错误: ', response.data.msg);
          console.log('错误代码: ', response.data.code);
          console.log('请求地址: ', url);
          console.log('请求参数: ', request);
          let error = {
            code: response.data.code,
            message: response.data.msg
          };
          reject && reject(error);
        }
      }

    }).catch(function(error) {
      reject && reject(error);
      console.error('请求出错: ', error);
      Message({
        message: '请求失败，请稍后再试',
        type: 'error',
        duration: 2000
      });
    });
  });

  return promise;
};

export function getCommonRequest() {
  return JSON.parse(sessionStorage.getItem('commonRequest'));
};
