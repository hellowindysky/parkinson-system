/* eslint-disable quotes */
import { encapsulatePromise } from 'api/common.js';

export function getLoginInfo(accountNumber, pwd, identifyingCode) {
  var request = {
    'accountNumber': accountNumber,
    'pwd': pwd,
    'identifyingCode': identifyingCode
  };
  var url = '/usermgr/userSignIn';
  return encapsulatePromise(url, request);
};

export function getLoginInfoByNewPwd(accountNumber, pwd, identifyingCode) {
  var request = {
    'accountNumber': accountNumber,
    'pwd': pwd,
    'identifyingCode': identifyingCode
  };
  var url = '/usermgr/forgetPasswordCheck';
  return encapsulatePromise(url, request);
};
