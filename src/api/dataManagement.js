import { encapsulatePromise, getCommonRequest } from 'api/common.js';

export function addOrUpdateScaleInfo(scaleInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.scaleInfo = scaleInfo;
  var url = '/pdms/addOrUpdateScaleInfo';

  return encapsulatePromise(url, request);
};

export function updateScaleQuickAnswer(scaleInfo) {
  var request = Object.assign({}, getCommonRequest(), scaleInfo);
  var url = '/pdms/updateScaleQuickAnswer';

  return encapsulatePromise(url, request);
};

export function queryScale(scaleInfo) {
  var request = Object.assign({}, getCommonRequest(), scaleInfo);
  var url = '/pdms/queryScale';

  return encapsulatePromise(url, request);
};
