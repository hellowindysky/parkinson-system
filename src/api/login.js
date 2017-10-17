/* eslint-disable quotes */
import { baseUrl, encapsulatePromise } from 'api/common.js';

export function getLoginInfo(accountNumber, pwd) {
  var request = {
    'accountNumber': accountNumber,
    'pwd': pwd
  };
  var url = baseUrl + '/usermgr/userSignIn';
  return encapsulatePromise(url, request);
};
