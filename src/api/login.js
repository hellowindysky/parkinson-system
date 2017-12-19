/* eslint-disable quotes */
import { encapsulatePromise } from 'api/common.js';

export function getLoginInfo(accountNumber, pwd) {
  var request = {
    'accountNumber': accountNumber,
    'pwd': pwd
  };
  var url = '/usermgr/userSignIn';
  return encapsulatePromise(url, request);
};
