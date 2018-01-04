/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

// 查询所属医生/治疗者/评估者
export function queryExperimentMember(subjectId, experimentGroupId, roleType) {
  var request = Object.assign({}, getCommonRequest());
  request.taskInfoId = subjectId;
  request.taskGroupId = experimentGroupId;
  request.taskRoleType = roleType;    // 0.所属医生 1.治疗者 2.评估者
  var url = '/pdms/queryTreaterAndAssessor';
  return encapsulatePromise(url, request);
};
