/* eslint-disable quotes */
import { encapsulatePromise, getCommonRequest } from 'api/common.js';

export function getPatientList(condition) {
  // condition 对象包含了查询参数，必须包含 type 属性
  var request = Object.assign({}, getCommonRequest());
  request.pageNo = 1;
  request.pageSize = 0;
  if ((condition instanceof Object) && condition.type) {
    request.patientCond = condition;
  }
  var url = '/pdms/queryPatientList';
  return encapsulatePromise(url, request);
};

export function getPatientInfo(patientId, subjectNum, type) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  // subjectId 为 0 代表医院入口，其它值代表课题编号
  // type: 1我的患者, 2科室患者, 3项目中我的患者, 4项目中项目患者, 5实验研究中治疗者, 6实验研究中评估者
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientIdNum;
  request.groupModule = subjectNum !== undefined ? subjectNum : 0;
  request.type = type;
  var url = '/pdms/queryPatientPerson';

  return encapsulatePromise(url, request);
};

export function modifyPatientInfo(patientInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientInfo = patientInfo;
  var url = '/pdms/modPatientInfo';

  return encapsulatePromise(url, request);
};

// 新增患者
export function addPatientInfo(patientInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientInfo = patientInfo;
  var url = '/pdms/addPatientInfo';

  return encapsulatePromise(url, request);
};

// 获取一个简单的病患对象，仅包含该患者的几个基本信息
export function getPatientSimpleInfo(patientId) {
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientIdNum;
  var url = '/pdms/queryPatientInfo';

  return encapsulatePromise(url, request);
};

// 获取特定患者的所属分组信息
export function getPatientGroupInfo(condition) {
  var request = Object.assign({}, getCommonRequest());
  request.groupCond = condition;
  var url = '/pdms/queryPatientGroup';

  return encapsulatePromise(url, request);
};

// 获取特定患者的所属课题信息
export function getPatientSubjectInfo(patientId) {
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientId;
  var url = '/pdms/queryPatientTask';

  return encapsulatePromise(url, request);
};

export function modifyPatientDiseaseInfo(patientDiseaseInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDiseaseInfo = patientDiseaseInfo;
  var url = '/pdms/modPatientDiseaseInfo';

  return encapsulatePromise(url, request);
};

export function getPatientMedHistoryList(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientIdNum;
  var url = '/pdms/queryPatientMedHistoryList';

  return encapsulatePromise(url, request);
};

// 新增现病史
export function addPatientPresentHistory(presentHistory) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = presentHistory;
  var url = '/pdms/addPatientHistory';

  return encapsulatePromise(url, request);
};

// 修改现病史
export function modifyPatientPresentHistory(presentHistory) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = presentHistory;
  var url = '/pdms/modPatientHistory';

  return encapsulatePromise(url, request);
};

// 删除现病史
export function deletePatientPresentHistory(presentHistory) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = presentHistory;
  var url = '/pdms/delPatientHistory';

  return encapsulatePromise(url, request);
};

// v2.1 现病史 ↓↓↓
// 查询首发症状
export function queryPatientFirstSymbol(firstSymbol) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstSymbolModel = firstSymbol;
  var url = '/pdms/queryPatientFirstSymbol';

  return encapsulatePromise(url, request);
};

// 新增首发症状
export function addPatientFirstSymbol(firstSymbol) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstSymbolModel = firstSymbol;
  var url = '/pdms/addPatientFirstSymbol';

  return encapsulatePromise(url, request);
};

// 修改首发症状
export function modPatientFirstSymbol(firstSymbol) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstSymbolModel = firstSymbol;
  var url = '/pdms/modPatientFirstSymbol';

  return encapsulatePromise(url, request);
};

// 删除首发症状
export function deletePatientFirstSymbol(firstSymbol) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstSymbolModel = firstSymbol;
  var url = '/pdms/delPatientFirstSymbol';

  return encapsulatePromise(url, request);
};

// 查询初诊治疗
export function queryPatientFirstVisitTreatment(firstVisit) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstVisitTreatmentModel = firstVisit;
  var url = '/pdms/queryPatientFirstVisitTreatment';

  return encapsulatePromise(url, request);
};

// 新增初诊治疗
export function addPatientFirstVisitTreatment(firstVisit) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstVisitTreatmentModel = firstVisit;
  var url = '/pdms/addPatientFirstVisitTreatment';

  return encapsulatePromise(url, request);
};

// 修改初诊治疗
export function modPatientFirstVisitTreatment(firstVisit) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstVisitTreatmentModel = firstVisit;
  var url = '/pdms/modPatientFirstVisitTreatment';

  return encapsulatePromise(url, request);
};

// 删除初诊治疗
export function delPatientFirstVisitTreatment(firstVisit) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFirstVisitTreatmentModel = firstVisit;
  var url = '/pdms/delPatientFirstVisitTreatment';

  return encapsulatePromise(url, request);
};

// 查询就诊记录
export function queryVisitDignosticRecord(dignosticRecord) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = dignosticRecord;
  var url = '/pdms/queryPatientHistoryList';

  return encapsulatePromise(url, request);
};

// 新增就诊记录
export function addVisitDignosticRecord(dignosticRecord) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = dignosticRecord;
  var url = '/pdms/addPatientHistory';

  return encapsulatePromise(url, request);
};

// 修改就诊记录
export function modVisitDignosticRecord(dignosticRecord) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = dignosticRecord;
  var url = '/pdms/modPatientHistory';

  return encapsulatePromise(url, request);
};

// 删除就诊记录
export function delVisitDignosticRecord(dignosticRecord) {
  var request = Object.assign({}, getCommonRequest());
  request.patientHistory = dignosticRecord;
  var url = '/pdms/delPatientHistory';

  return encapsulatePromise(url, request);
};

// 修改现病史
export function modDiseaseHistory(diseaseHistoryInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDiseaseInfo = diseaseHistoryInfo;
  var url = '/pdms/modPatientDiseaseInfo';

  return encapsulatePromise(url, request);
};
// v2.1 现病史 ↑↑↑

// 新增用药史
export function addPatientMedHistory(medHistory) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedHistory = medHistory;
  var url = '/pdms/addPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 修改用药史
export function modifyPatientMedHistory(medHistory) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedHistory = medHistory;
  var url = '/pdms/modPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 删除用药史
export function deletePatientMedHistory(medHistory) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedHistory = medHistory;
  var url = '/pdms/delPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 新增既往史
export function addPatientDisease(patientDisease) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDisease = patientDisease;
  var url = '/pdms/addPatientDisease';

  return encapsulatePromise(url, request);
};

// 修改既往史
export function modifyPatientDisease(patientDisease) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDisease = patientDisease;
  var url = '/pdms/modPatientDisease';

  return encapsulatePromise(url, request);
};

// 删除既往史
export function deletePatientDisease(patientDisease) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDisease = patientDisease;
  var url = '/pdms/delPatientDisease';

  return encapsulatePromise(url, request);
};

// 新增家族史
export function addPatientFamily(patientFamily) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFamily = patientFamily;
  var url = '/pdms/addPatientFamily';

  return encapsulatePromise(url, request);
};

// 修改家族史
export function modifyPatientFamily(patientFamily) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFamily = patientFamily;
  var url = '/pdms/modPatientFamily';

  return encapsulatePromise(url, request);
};

// 删除家族史
export function deletePatientFamily(patientFamily) {
  var request = Object.assign({}, getCommonRequest());
  request.patientFamily = patientFamily;
  var url = '/pdms/delPatientFamily';

  return encapsulatePromise(url, request);
};

// 新增锻炼史
export function addPatientExercise(patientExercise) {
  var request = Object.assign({}, getCommonRequest());
  request.patientExercise = patientExercise;
  var url = '/pdms/addPatientExercise';

  return encapsulatePromise(url, request);
};

// 修改锻炼史
export function modifyPatientExercise(patientExercise) {
  var request = Object.assign({}, getCommonRequest());
  request.patientExercise = patientExercise;
  var url = '/pdms/modPatientExercise';

  return encapsulatePromise(url, request);
};

// 删除锻炼史
export function deletePatientExercise(patientExercise) {
  var request = Object.assign({}, getCommonRequest());
  request.patientExercise = patientExercise;
  var url = '/pdms/delPatientExercise';

  return encapsulatePromise(url, request);
};

// 新增吸烟史
export function addPatientSmoke(patientSmoke) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSmoke = patientSmoke;
  var url = '/pdms/addPatientSmoke';

  return encapsulatePromise(url, request);
};

// 修改吸烟史
export function modifyPatientSmoke(patientSmoke) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSmoke = patientSmoke;
  var url = '/pdms/modPatientSmoke';

  return encapsulatePromise(url, request);
};

// 删除吸烟史
export function deletePatientSmoke(patientSmoke) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSmoke = patientSmoke;
  var url = '/pdms/delPatientSmoke';

  return encapsulatePromise(url, request);
};

// 新增饮酒史
export function addPatientWine(patientWine) {
  var request = Object.assign({}, getCommonRequest());
  request.patientWine = patientWine;
  var url = '/pdms/addPatientWine';

  return encapsulatePromise(url, request);
};

// 修改饮酒史
export function modifyPatientWine(patientWine) {
  var request = Object.assign({}, getCommonRequest());
  request.patientWine = patientWine;
  var url = '/pdms/modPatientWine';

  return encapsulatePromise(url, request);
};

// 删除饮酒史
export function deletePatientWine(patientWine) {
  var request = Object.assign({}, getCommonRequest());
  request.patientWine = patientWine;
  var url = '/pdms/delPatientWine';

  return encapsulatePromise(url, request);
};

// 新增喝茶史
export function addPatientTea(patientTea) {
  var request = Object.assign({}, getCommonRequest());
  request.patientTea = patientTea;
  var url = '/pdms/addPatientTea';

  return encapsulatePromise(url, request);
};

// 修改喝茶史
export function modifyPatientTea(patientTea) {
  var request = Object.assign({}, getCommonRequest());
  request.patientTea = patientTea;
  var url = '/pdms/modPatientTea';

  return encapsulatePromise(url, request);
};

// 删除喝茶史
export function deletePatientTea(patientTea) {
  var request = Object.assign({}, getCommonRequest());
  request.patientTea = patientTea;
  var url = '/pdms/delPatientTea';

  return encapsulatePromise(url, request);
};

// 新增咖啡史
export function addPatientCoffee(patientCoffee) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCoffee = patientCoffee;
  var url = '/pdms/addPatientCoffee';

  return encapsulatePromise(url, request);
};

// 修改咖啡史
export function modifyPatientCoffee(patientCoffee) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCoffee = patientCoffee;
  var url = '/pdms/modPatientCoffee';

  return encapsulatePromise(url, request);
};

// 删除咖啡史
export function deletePatientCoffee(patientCoffee) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCoffee = patientCoffee;
  var url = '/pdms/delPatientCoffee';

  return encapsulatePromise(url, request);
};

// 新增毒物接触史
export function addPatientToxicExposure(toxicExposure) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCideexposed = toxicExposure;
  var url = '/pdms/addPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 修改毒物接触史
export function modifyPatientToxicExposure(toxicExposure) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCideexposed = toxicExposure;
  var url = '/pdms/modPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 删除毒物接触史
export function deletePatientToxicExposure(toxicExposure) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCideexposed = toxicExposure;
  var url = '/pdms/delPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 新增诊断信息-基本情况
export function addDiagnosticBasic(diagnosticBasic) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCase = diagnosticBasic;
  var url = '/pdms/addPatientCase';

  return encapsulatePromise(url, request);
};

// 修改诊断信息-基本情况
export function modifyDiagnosticBasic(diagnosticBasic) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCase = diagnosticBasic;
  var url = '/pdms/modPatientCaseBaseInfo';

  return encapsulatePromise(url, request);
};

// 删除诊断信息
export function deleteDiagnosticInfo(diagnosticInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCase = diagnosticInfo;
  var url = '/pdms/delPatientCase';
  return encapsulatePromise(url, request);
};

// 修改诊断信息-病症情况（新增也用这个接口）
export function modifyDiagnosticDisease(diagnosticDisease) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDisease = diagnosticDisease;
  var url = '/pdms/modPatientSymptom';

  return encapsulatePromise(url, request);
};

// 诊断记录 主诉症状 ↓↓↓↓↓↓↓↓↓↓
// 查询主诉症状
export function queryPatientSymptom(complaintsInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSymptomModel = complaintsInfo;
  var url = '/pdms/queryPatientSymptom';

  return encapsulatePromise(url, request);
};

// 新增主诉症状
export function addPatientSymptom(complaintsInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSymptomModel = complaintsInfo;
  var url = '/pdms/addPatientSymptom';

  return encapsulatePromise(url, request);
};

// 修改主诉症状
export function modPatientSymptom(complaintsInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSymptomModel = complaintsInfo;
  var url = '/pdms/modPatientSymptom';

  return encapsulatePromise(url, request);
};

// 删除主诉症状
export function delPatientSymptom(complaintsInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSymptomModel = complaintsInfo;
  var url = '/pdms/delPatientSymptom';

  return encapsulatePromise(url, request);
};

// 修改主诉症状 上的病症情况
export function modDiseaseSituation(diseaseSituation) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCase = diseaseSituation;
  var url = '/pdms/modPatientCaseDiseaseInfo';

  return encapsulatePromise(url, request);
};
// 诊断记录 主诉症状 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// 获取患者诊断列表
export function getPatientCaseList(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientIdNum;
  request.pageSize = 0;
  request.pageNo = 1;
  var url = '/pdms/queryPatientCaseList';
  return encapsulatePromise(url, request);
};

// 获取患者诊断详情
export function getPatientCase(patientId, patientCaseId) {
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientIdNum;
  request.patientCaseId = patientCaseId;
  var url = '/pdms/queryPatientCase';

  return encapsulatePromise(url, request);
};

// 将诊断信息进行归档
export function archivePatientCase(patientCaseId) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCaseId = patientCaseId;
  var url = '/pdms/archivePatientCase';

  return encapsulatePromise(url, request);
};

// 新增药物方案
export function addPatientMedicine(patientMedicine) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedicine = patientMedicine;
  var url = '/pdms/addPatientMedicine';

  return encapsulatePromise(url, request);
};

// 修改药物方案
export function modifyPatientMedicine(patientMedicine) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedicine = patientMedicine;
  var url = '/pdms/modPatientMedicine';

  return encapsulatePromise(url, request);
};

// 删除药物方案
export function deletePatientMedicine(patientMedicine) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedicine = patientMedicine;
  var url = '/pdms/delPatientMedicine';

  return encapsulatePromise(url, request);
};

// 查看某次术前评估详情
export function getPreEvaluation(preEvaluationId) {
  preEvaluationId = parseInt(preEvaluationId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.preopsInfoId = preEvaluationId;
  var url = '/pdms/queryPatientPreopsDetail';

  return encapsulatePromise(url, request);
};

// 新增术前评估
export function addPreEvaluation(preEvaluation) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPreops = preEvaluation;
  var url = '/pdms/addPatientPreops';

  return encapsulatePromise(url, request);
};

// 修改术前评估
export function modifyPreEvaluation(preEvaluation) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPreops = preEvaluation;
  var url = '/pdms/modPatientPreops';

  return encapsulatePromise(url, request);
};

// 删除术前评估
export function deletePreEvaluation(preEvaluation) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPreops = preEvaluation;
  var url = '/pdms/delPatientPreops';

  return encapsulatePromise(url, request);
};

// 术前评估 根据评估时间查询非运动症状量表分数量表分数
export function getEvaluationPreopsScale(preEvaluation) {
  /**
   * preEvaluation $obj 入参
   * preEvaluation.patientId
   * preEvaluation.patientCaseId
   * preEvaluation.checkTime 评估时间
   */
  var request = Object.assign({}, getCommonRequest(), preEvaluation);
  var url = 'pdms/queryPatientPreopsScale';

  return encapsulatePromise(url, request);
};

// 术前评估 根据评估时间查询运动症状量表分数
export function getEvaluationMdsScale(preEvaluation) {
  /**
   * preEvaluation $obj 入参
   * preEvaluation.patientId
   * preEvaluation.patientCaseId
   * preEvaluation.checkTime 评估时间
   */
  var request = Object.assign({}, getCommonRequest(), preEvaluation);
  var url = 'pdms/queryMdsScale';

  return encapsulatePromise(url, request);
};

// 新增手术方案
export function addSurgicalMethod(surgicalMethod) {
  var request = Object.assign({}, getCommonRequest());
  request.patientTreatment = surgicalMethod;
  var url = '/pdms/addPatientTreatment';

  return encapsulatePromise(url, request);
};

// 修改手术方案
export function modifySurgicalMethod(surgicalMethod) {
  var request = Object.assign({}, getCommonRequest());
  request.patientTreatment = surgicalMethod;
  var url = '/pdms/modPatientTreatment';

  return encapsulatePromise(url, request);
};

// 删除手术方案
export function deleteSurgicalMethod(surgicalMethod) {
  var request = Object.assign({}, getCommonRequest());
  request.patientTreatment = surgicalMethod;
  var url = '/pdms/delPatientTreatment';

  return encapsulatePromise(url, request);
};

// 新增术后并发症
export function addOperativeCompliation(operativeComplication) {
  var request = Object.assign({}, getCommonRequest());
  request.patientComplication = operativeComplication;
  var url = '/pdms/addPatientComplication';

  return encapsulatePromise(url, request);
};

// 修改术后并发症
export function modifyOperativeCompliation(operativeComplication) {
  var request = Object.assign({}, getCommonRequest());
  request.patientComplication = operativeComplication;
  var url = '/pdms/modPatientComplication';

  return encapsulatePromise(url, request);
};

// 删除术后并发症
export function deleteOperativeCompliation(operativeComplication) {
  var request = Object.assign({}, getCommonRequest());
  request.patientComplication = operativeComplication;
  var url = '/pdms/delPatientComplication';

  return encapsulatePromise(url, request);
};

// 查看首次程控记录详情
export function getDbsFirstInfo(dbsFirstId) {
  dbsFirstId = parseInt(dbsFirstId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFirstId = dbsFirstId;
  var url = '/pdms/queryPatientDbsFirstDetail';

  return encapsulatePromise(url, request);
};

// 新增首次程控记录详情
export function addDbsFirstInfo(dbsFirstInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFirst = dbsFirstInfo;
  var url = '/pdms/addPatientDbsFirst';

  return encapsulatePromise(url, request);
};

// 修改首次程控记录详情
export function modifyDbsFirstInfo(dbsFirstInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFirst = dbsFirstInfo;
  var url = '/pdms/modPatientDbsFirst';

  return encapsulatePromise(url, request);
};

// 删除首次程控记录详情
export function deleteDbsFirstInfo(dbsFirstInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFirst = dbsFirstInfo;
  var url = '/pdms/delPatientDbsFirst';

  return encapsulatePromise(url, request);
};

// 查看非某次程控记录详情
export function getDbsFollowInfo(patientId, dbsFollowId) {
  patientId = parseInt(patientId, 10);
  dbsFollowId = parseInt(dbsFollowId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientId;
  request.patientDbsFollowId = dbsFollowId;
  var url = '/pdms/queryPatientDbsFollowDetail';

  return encapsulatePromise(url, request);
};

// 新增非首次程控记录详情
export function addDbsFollowInfo(dbsFollowInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFollow = dbsFollowInfo;
  var url = '/pdms/addPatientDbsFollow';

  return encapsulatePromise(url, request);
};

// 修改非首次程控记录详情
export function modifyDbsFollowInfo(dbsFollowInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFollow = dbsFollowInfo;
  var url = '/pdms/modPatientDbsFollow';

  return encapsulatePromise(url, request);
};

// 删除非首次程控记录详情
export function deleteDbsFollowInfo(dbsFollowInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientDbsFollow = dbsFollowInfo;
  var url = '/pdms/delPatientDbsFollow';

  return encapsulatePromise(url, request);
};

// 查看上次程控信息（包括记录时间 和 调整后参数）
export function getLastDbsInfo(patientId, patientCaseId) {
  patientId = parseInt(patientId, 10);
  var request = Object.assign({}, getCommonRequest());
  request.patientId = patientId;
  request.patientCaseId = patientCaseId;
  var url = '/pdms/queryLastPatientDbsParms';

  return encapsulatePromise(url, request);
};

// 新增医学量表
export function addScaleInfo(patientScale) {
  var request = Object.assign({}, getCommonRequest());
  request.patientScale = patientScale;
  var url = '/pdms/addPatientScaleInfo';

  return encapsulatePromise(url, request);
};

// 修改医学量表
export function modifyScaleInfo(patientScale) {
  var request = Object.assign({}, getCommonRequest());
  request.patientScale = patientScale;
  var url = '/pdms/modPatientScaleInfo';

  return encapsulatePromise(url, request);
};
// 删除医学量表
export function deleteScaleInfo(patientScale) {
  var request = Object.assign({}, getCommonRequest());
  request.patientScale = patientScale;
  var url = '/pdms/delPatientScaleInfo';

  return encapsulatePromise(url, request);
};

// 修改神经系统检查
export function modifyNeurologicCheck(patientSpephysical) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSpephysical = patientSpephysical;
  var url = '/pdms/modPatientSpephysical';

  return encapsulatePromise(url, request);
};

// 新增神经系统检查
export function addNeurologicCheck(patientSpephysical) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSpephysical = patientSpephysical;
  var url = '/pdms/addPatientSpephysical';

  return encapsulatePromise(url, request);
};

// 删除神经系统检查
export function deleteNeurologicCheck(patientSpephysical) {
  var request = Object.assign({}, getCommonRequest());
  request.patientSpephysical = patientSpephysical;
  var url = '/pdms/delPatientSpephysical';

  return encapsulatePromise(url, request);
};
// 新增部位检查
export function addPatientBodypart(patientBodypart) {
  var request = Object.assign({}, getCommonRequest());
  request.patientBodypart = patientBodypart;
  var url = '/pdms/addPatientBodypart';

  return encapsulatePromise(url, request);
};

// 修改部位检查
export function modifyPatientBodypart(patientBodypart) {
  var request = Object.assign({}, getCommonRequest());
  request.patientBodypart = patientBodypart;
  var url = '/pdms/modPatientBodypart';

  return encapsulatePromise(url, request);
};

// 删除部位检查
export function deletePatientBodypart(patientBodypart) {
  var request = Object.assign({}, getCommonRequest());
  request.patientBodypart = patientBodypart;
  var url = '/pdms/delPatientBodypart';

  return encapsulatePromise(url, request);
};
// 修改基因检查
export function modifyGeneCheck(patientGene) {
  var request = Object.assign({}, getCommonRequest());
  request.patientGene = patientGene;
  var url = '/pdms/modPatientGene';

  return encapsulatePromise(url, request);
};

// 新增基因检查
export function addGeneCheck(patientGene) {
  var request = Object.assign({}, getCommonRequest());
  request.patientGene = patientGene;
  var url = '/pdms/addPatientGene';

  return encapsulatePromise(url, request);
};
// 删除基因检查
export function deleteGeneCheck(patientGene) {
  var request = Object.assign({}, getCommonRequest());
  request.patientGene = patientGene;
  var url = '/pdms/delPatientGene';

  return encapsulatePromise(url, request);
};

// 新增生化指标
export function addBiochemical(patientBioexam) {
  var request = Object.assign({}, getCommonRequest());
  request.patientBioexam = patientBioexam;
  var url = '/pdms/addBioexam';

  return encapsulatePromise(url, request);
};

// 修改生化指标
export function modifyBiochemical(patientBioexam) {
  var request = Object.assign({}, getCommonRequest());
  request.patientBioexam = patientBioexam;
  var url = '/pdms/modBioexam';

  return encapsulatePromise(url, request);
};

// 删除生化指标
export function deleteBiochemical(patientBioexam) {
  var request = Object.assign({}, getCommonRequest());
  request.patientBioexam = patientBioexam;
  var url = '/pdms/delBioexam';

  return encapsulatePromise(url, request);
};

// 新增肌电图
export function addEmg(patientElecTroGram) {
  var request = Object.assign({}, getCommonRequest());
  request.patientElecTroGram = patientElecTroGram;
  var url = '/pdms/addPatElecTroGram';

  return encapsulatePromise(url, request);
};

// 修改肌电图
export function modEmg(patientElecTroGram) {
  var request = Object.assign({}, getCommonRequest());
  request.patientElecTroGram = patientElecTroGram;
  var url = '/pdms/modPatElecTroGram';

  return encapsulatePromise(url, request);
};

// 删除肌电图
export function deleteEmg(patientElecTroGram) {
  var request = Object.assign({}, getCommonRequest());
  request.patientElecTroGram = patientElecTroGram;
  var url = '/pdms/delPatElecTroGram';

  return encapsulatePromise(url, request);
};

// 新增睡眠监测
export function addSleepMonitoring(sleepMonitoringInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientNerveSleep = sleepMonitoringInfo;
  var url = '/pdms/addPatientNerveSleep';

  return encapsulatePromise(url, request);
};

// 修改睡眠监测
export function modSleepMonitoring(sleepMonitoringInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientNerveSleep = sleepMonitoringInfo;
  var url = '/pdms/modPatientNerveSleep';

  return encapsulatePromise(url, request);
};

// 删除睡眠监测
export function deleteSleepMonitoring(sleepMonitoringInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientNerveSleep = sleepMonitoringInfo;
  var url = '/pdms/delPatientNerveSleep';

  return encapsulatePromise(url, request);
};

// 新增医学影像
export function addImage(imageInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientImageReq = imageInfo;
  var url = '/pdms/addPatientImage';

  return encapsulatePromise(url, request);
};

// 修改医学影像
export function modifyImage(imageInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientImageReq = imageInfo;
  var url = '/pdms/modPatientImage';

  return encapsulatePromise(url, request);
};

// 删除医学影像
export function deleteImage(imageInfo) {
  var request = Object.assign({}, getCommonRequest());
  request.patientImageReq = imageInfo;
  var url = '/pdms/delPatientImage';

  return encapsulatePromise(url, request);
};

// 修改生命体征
export function modVitalSigns(patientCase) {
  var request = Object.assign({}, getCommonRequest());
  request.patientCase = patientCase;
  var url = '/pdms/modPatientCase';

  return encapsulatePromise(url, request);
};

// 综合查询
export function queryPatientsByCondition(condition) {
  var request = Object.assign({}, getCommonRequest());
  var url = '/pdms/integratedQuery';
  if (condition) {
    request.integratedQueryCond = condition;
  }
  return encapsulatePromise(url, request);
};

// 查询可导出字段
export function queryExportField() {
  var request = Object.assign({}, getCommonRequest());
  var url = '/pdms/queryExportField';
  return encapsulatePromise(url, request);
};

// 查询导出模板
export function queryExportTemplate() {
  var request = Object.assign({}, getCommonRequest());
  var url = '/pdms/queryTemplateExport';
  return encapsulatePromise(url, request);
};

// 新增或修改导出模板
export function operateExportTemplate(exportTemp) {
  var request = Object.assign({}, getCommonRequest());
  request.templateExport = exportTemp;
  var url = '/pdms/operateTemplateExport';
  return encapsulatePromise(url, request);
};

// 删除导出模板
export function deleteExportTemplate(TempIds) {
  var request = Object.assign({}, getCommonRequest());
  request.templateIds = TempIds;
  var url = '/pdms/deleteTemplateExport';
  return encapsulatePromise(url, request);
};

// 新增物理治疗
export function addPhysiontherapy(patientPhytheTms) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPhytheTms = patientPhytheTms;
  var url = '/pdms/addPatientPhytheTms';

  return encapsulatePromise(url, request);
};

// 修改物理治疗
export function modifyPhysiontherapy(patientPhytheTms) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPhytheTms = patientPhytheTms;
  var url = '/pdms/modPatientPhytheTms';

  return encapsulatePromise(url, request);
};

// 删除物理治疗
export function deletePhysiontherapy(patientPhytheTms) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPhytheTms = patientPhytheTms;
  var url = '/pdms/delPatientPhytheTms';

  return encapsulatePromise(url, request);
};
// 新增治疗评估
export function addTreatmentEvaluation(patientPhytheAssess) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPhytheAssess = patientPhytheAssess;
  var url = '/pdms/addPatientPhytheAssess';

  return encapsulatePromise(url, request);
};

// 修改治疗评估
export function modifyTreatmentEvaluation(patientPhytheAssess) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPhytheAssess = patientPhytheAssess;
  var url = '/pdms/modPatientPhytheAssess';

  return encapsulatePromise(url, request);
};

// 删除治疗评估
export function deleteTreatmentEvaluation(patientPhytheAssess) {
  var request = Object.assign({}, getCommonRequest());
  request.patientPhytheAssess = patientPhytheAssess;
  var url = '/pdms/delPatientPhytheAssess';

  return encapsulatePromise(url, request);
};
// 新增不良事件
export function addAdverseEvent(patientAdverse) {
  var request = Object.assign({}, getCommonRequest());
  request.patientAdverse = patientAdverse;
  var url = '/pdms/addPatientAdverse';

  return encapsulatePromise(url, request);
};

// 修改不良事件
export function modifyAdverseEvent(patientAdverse) {
  var request = Object.assign({}, getCommonRequest());
  request.patientAdverse = patientAdverse;
  var url = '/pdms/modPatientAdverse';

  return encapsulatePromise(url, request);
};

// 删除不良事件
export function deleteAdverseEvent(patientAdverse) {
  var request = Object.assign({}, getCommonRequest());
  request.patientAdverse = patientAdverse;
  var url = '/pdms/delPatientAdverse';

  return encapsulatePromise(url, request);
};
// 新增严重不良事件
export function addSeriousAdverseEvent(patientAdverseSerious) {
  var request = Object.assign({}, getCommonRequest());
  request.patientAdverseSerious = patientAdverseSerious;
  var url = '/pdms/addPatientAdverseSerious';

  return encapsulatePromise(url, request);
};

// 修改严重不良事件
export function modifySeriousAdverseEvent(patientAdverseSerious) {
  var request = Object.assign({}, getCommonRequest());
  request.patientAdverseSerious = patientAdverseSerious;
  var url = '/pdms/modPatientAdverseSerious';

  return encapsulatePromise(url, request);
};

// 删除严重不良事件
export function deleteSeriousAdverseEvent(patientAdverseSerious) {
  var request = Object.assign({}, getCommonRequest());
  request.patientAdverseSerious = patientAdverseSerious;
  var url = '/pdms/delPatientAdverseSerious';

  return encapsulatePromise(url, request);
};
// 新增药物不良事件
export function addMedicineAdverseEvent(patientMedicineAdverse) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedicineAdverse = patientMedicineAdverse;
  var url = '/pdms/addPatientMedicineAdverse';

  return encapsulatePromise(url, request);
};

// 修改药物不良事件
export function modifyMedicineAdverseEvent(patientMedicineAdverse) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedicineAdverse = patientMedicineAdverse;
  var url = '/pdms/modPatientMedicineAdverse';

  return encapsulatePromise(url, request);
};

// 删除药物不良事件
export function deleteMedicineAdverseEvent(patientMedicineAdverse) {
  var request = Object.assign({}, getCommonRequest());
  request.patientMedicineAdverse = patientMedicineAdverse;
  var url = '/pdms/delPatientMedicineAdverse';

  return encapsulatePromise(url, request);
};
// 新增生命体征
export function addVitalSigns(patientVitalSign) {
  var request = Object.assign({}, getCommonRequest());
  request.patientVitalSign = patientVitalSign;
  var url = '/pdms/addPatientVitalSign';

  return encapsulatePromise(url, request);
};

// 修改生命体征
export function modifyVitalSigns(patientVitalSign) {
  var request = Object.assign({}, getCommonRequest());
  request.patientVitalSign = patientVitalSign;
  var url = '/pdms/modPatientVitalSign';

  return encapsulatePromise(url, request);
};

// 删除生命体征
export function deleteVitalSigns(patientVitalSign) {
  var request = Object.assign({}, getCommonRequest());
  request.patientVitalSign = patientVitalSign;
  var url = '/pdms/delPatientVitalSign';

  return encapsulatePromise(url, request);
};
