/* eslint-disable quotes */
import axios from 'axios';

function encapsulatePromise(url, request) {

  var promise = new Promise(function(resolve, reject) {

    axios.post(url, request).then((response) => {
      if (response.data.code === 0) {
        resolve(response.data.data);
      } else {
        console.log('参数错误或服务器内部错误: ', response.data.msg);
        reject();
      }

    }).catch(function(error) {
      console.error('请求出错: ', error);
      reject();
    });
  });

  return promise;
}

var commonRequest = {
  "userId": 93242,
  "accountNumber": "15527231713",
  "userType": 2,
  "orgId": 34,
  "orgType": 2
};

export function getPatientList(condition) {
  // condition 对象包含了查询参数，必须包含 type 属性
  var request = Object.assign({}, commonRequest);
  request.pageNo = 1;
  request.pageSize = 0;
  if ((condition instanceof Object) && condition.type) {
    request.patientCond = condition;
  }
  var url = 'http://apitest.gyenno.com/pdms/queryPatientList';
  return encapsulatePromise(url, request);
};

export function getPatientInfo(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientId = patientIdNum;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientPerson';

  return encapsulatePromise(url, request);
};

export function modifyPatientInfo(patientInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientInfo = patientInfo;
  var url = 'http://apitest.gyenno.com/pdms/modPatientInfo';

  return encapsulatePromise(url, request);
};

// 新增患者
export function addPatientInfo(patientInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientInfo = patientInfo;
  var url = 'http://apitest.gyenno.com/pdms/addPatientInfo';

  return encapsulatePromise(url, request);
};

// 获取一个简单的病患对象，仅包含该患者的几个基本信息
export function getPatientSimpleInfo(patientId) {
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientId = patientIdNum;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientInfo';

  return encapsulatePromise(url, request);
};

export function modifyPatientDiseaseInfo(patientDiseaseInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientDiseaseInfo = patientDiseaseInfo;
  var url = 'http://apitest.gyenno.com/pdms/modPatientDiseaseInfo';

  return encapsulatePromise(url, request);
};

export function getPatientMedHistoryList(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientId = patientIdNum;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientMedHistoryList';

  return encapsulatePromise(url, request);
};

// 新增用药史
export function addPatientMedHistory(medHistory) {
  var request = Object.assign({}, commonRequest);
  request.patientMedHistory = medHistory;
  var url = 'http://apitest.gyenno.com/pdms/addPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 修改用药史
export function modifyPatientMedHistory(medHistory) {
  var request = Object.assign({}, commonRequest);
  request.patientMedHistory = medHistory;
  var url = 'http://apitest.gyenno.com/pdms/modPatientMedHistory';

  return encapsulatePromise(url, request);
};

// 删除用药史
export function deletePatientMedHistory(medHistory) {
  var request = Object.assign({}, commonRequest);
  request.patientMedHistory = medHistory;
  var url = 'http://apitest.gyenno.com/pdms/delPatientMedHistory';

  return encapsulatePromise(url, request);
}

// 新增既往史
export function addPatientDisease(patientDisease) {
  var request = Object.assign({}, commonRequest);
  request.patientDisease = patientDisease;
  var url = 'http://apitest.gyenno.com/pdms/addPatientDisease';

  return encapsulatePromise(url, request);
};

// 修改既往史
export function modifyPatientDisease(patientDisease) {
  var request = Object.assign({}, commonRequest);
  request.patientDisease = patientDisease;
  var url = 'http://apitest.gyenno.com/pdms/modPatientDisease';

  return encapsulatePromise(url, request);
};

// 删除既往史
export function deletePatientDisease(patientDisease) {
  var request = Object.assign({}, commonRequest);
  request.patientDisease = patientDisease;
  var url = 'http://apitest.gyenno.com/pdms/delPatientDisease';

  return encapsulatePromise(url, request);
};

// 新增家族史
export function addPatientFamily(patientFamily) {
  var request = Object.assign({}, commonRequest);
  request.patientFamily = patientFamily;
  var url = 'http://apitest.gyenno.com/pdms/addPatientFamily';

  return encapsulatePromise(url, request);
};

// 修改家族史
export function modifyPatientFamily(patientFamily) {
  var request = Object.assign({}, commonRequest);
  request.patientFamily = patientFamily;
  var url = 'http://apitest.gyenno.com/pdms/modPatientFamily';

  return encapsulatePromise(url, request);
};

// 删除家族史
export function deletePatientFamily(patientFamily) {
  var request = Object.assign({}, commonRequest);
  request.patientFamily = patientFamily;
  var url = 'http://apitest.gyenno.com/pdms/delPatientFamily';

  return encapsulatePromise(url, request);
};

// 新增锻炼史
export function addPatientExercise(patientExercise) {
  var request = Object.assign({}, commonRequest);
  request.patientExercise = patientExercise;
  var url = 'http://apitest.gyenno.com/pdms/addPatientExercise';

  return encapsulatePromise(url, request);
};

// 修改锻炼史
export function modifyPatientExercise(patientExercise) {
  var request = Object.assign({}, commonRequest);
  request.patientExercise = patientExercise;
  var url = 'http://apitest.gyenno.com/pdms/modPatientExercise';

  return encapsulatePromise(url, request);
};

// 删除锻炼史
export function deletePatientExercise(patientExercise) {
  var request = Object.assign({}, commonRequest);
  request.patientExercise = patientExercise;
  var url = 'http://apitest.gyenno.com/pdms/delPatientExercise';

  return encapsulatePromise(url, request);
};

// 新增吸烟史
export function addPatientSmoke(patientSmoke) {
  var request = Object.assign({}, commonRequest);
  request.patientSmoke = patientSmoke;
  var url = 'http://apitest.gyenno.com/pdms/addPatientSmoke';

  return encapsulatePromise(url, request);
};

// 修改吸烟史
export function modifyPatientSmoke(patientSmoke) {
  var request = Object.assign({}, commonRequest);
  request.patientSmoke = patientSmoke;
  var url = 'http://apitest.gyenno.com/pdms/modPatientSmoke';

  return encapsulatePromise(url, request);
};

// 删除吸烟史
export function deletePatientSmoke(patientSmoke) {
  var request = Object.assign({}, commonRequest);
  request.patientSmoke = patientSmoke;
  var url = 'http://apitest.gyenno.com/pdms/delPatientSmoke';

  return encapsulatePromise(url, request);
};

// 新增饮酒史
export function addPatientWine(patientWine) {
  var request = Object.assign({}, commonRequest);
  request.patientWine = patientWine;
  var url = 'http://apitest.gyenno.com/pdms/addPatientWine';

  return encapsulatePromise(url, request);
};

// 修改饮酒史
export function modifyPatientWine(patientWine) {
  var request = Object.assign({}, commonRequest);
  request.patientWine = patientWine;
  var url = 'http://apitest.gyenno.com/pdms/modPatientWine';

  return encapsulatePromise(url, request);
};

// 删除饮酒史
export function deletePatientWine(patientWine) {
  var request = Object.assign({}, commonRequest);
  request.patientWine = patientWine;
  var url = 'http://apitest.gyenno.com/pdms/delPatientWine';

  return encapsulatePromise(url, request);
};

// 新增喝茶史
export function addPatientTea(patientTea) {
  var request = Object.assign({}, commonRequest);
  request.patientTea = patientTea;
  var url = 'http://apitest.gyenno.com/pdms/addPatientTea';

  return encapsulatePromise(url, request);
};

// 修改喝茶史
export function modifyPatientTea(patientTea) {
  var request = Object.assign({}, commonRequest);
  request.patientTea = patientTea;
  var url = 'http://apitest.gyenno.com/pdms/modPatientTea';

  return encapsulatePromise(url, request);
};

// 删除喝茶史
export function deletePatientTea(patientTea) {
  var request = Object.assign({}, commonRequest);
  request.patientTea = patientTea;
  var url = 'http://apitest.gyenno.com/pdms/delPatientTea';

  return encapsulatePromise(url, request);
};

// 新增咖啡史
export function addPatientCoffee(patientCoffee) {
  var request = Object.assign({}, commonRequest);
  request.patientCoffee = patientCoffee;
  var url = 'http://apitest.gyenno.com/pdms/addPatientCoffee';

  return encapsulatePromise(url, request);
};

// 修改咖啡史
export function modifyPatientCoffee(patientCoffee) {
  var request = Object.assign({}, commonRequest);
  request.patientCoffee = patientCoffee;
  var url = 'http://apitest.gyenno.com/pdms/modPatientCoffee';

  return encapsulatePromise(url, request);
};

// 删除咖啡史
export function deletePatientCoffee(patientCoffee) {
  var request = Object.assign({}, commonRequest);
  request.patientCoffee = patientCoffee;
  var url = 'http://apitest.gyenno.com/pdms/delPatientCoffee';

  return encapsulatePromise(url, request);
};

// 新增毒物接触史
export function addPatientToxicExposure(toxicExposure) {
  var request = Object.assign({}, commonRequest);
  request.patientCideexposed = toxicExposure;
  var url = 'http://apitest.gyenno.com/pdms/addPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 修改毒物接触史
export function modifyPatientToxicExposure(toxicExposure) {
  var request = Object.assign({}, commonRequest);
  request.patientCideexposed = toxicExposure;
  var url = 'http://apitest.gyenno.com/pdms/modPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 删除毒物接触史
export function deletePatientToxicExposure(toxicExposure) {
  var request = Object.assign({}, commonRequest);
  request.patientCideexposed = toxicExposure;
  var url = 'http://apitest.gyenno.com/pdms/delPatientCideexposed';

  return encapsulatePromise(url, request);
};

// 新增诊断信息-基本情况
export function addDiagnosticBasic(diagnosticBasic) {
  var request = Object.assign({}, commonRequest);
  request.patientCase = diagnosticBasic;
  var url = 'http://apitest.gyenno.com/pdms/addPatientCase';

  return encapsulatePromise(url, request);
};

// 修改诊断信息-基本情况
export function modifyDiagnosticBasic(diagnosticBasic) {
  var request = Object.assign({}, commonRequest);
  request.patientCase = diagnosticBasic;
  var url = 'http://apitest.gyenno.com/pdms/modPatientCase';

  return encapsulatePromise(url, request);
};

// 删除诊断信息
export function deleteDiagnosticInfo(diagnosticInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientCase = diagnosticInfo;
  var url = 'http://apitest.gyenno.com/pdms/delPatientCase';
  return encapsulatePromise(url, request);
};

// 修改诊断信息-病症情况（新增也用这个接口）
export function modifyDiagnosticDisease(diagnosticDisease) {
  var request = Object.assign({}, commonRequest);
  request.patientDisease = diagnosticDisease;
  var url = 'http://apitest.gyenno.com/pdms/modPatientSymptom';

  return encapsulatePromise(url, request);
};

// 获取患者诊断列表
export function getPatientCaseList(patientId) {
  // 传进来的 patientId 可能是字符串，这里需要转化为数字
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientId = patientIdNum;
  request.pageSize = 0;
  request.pageNo = 1;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientCaseList';
  return encapsulatePromise(url, request);
};

// 获取患者诊断详情
export function getPatientCase(patientId, patientCaseId) {
  var patientIdNum = parseInt(patientId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientId = patientIdNum;
  request.patientCaseId = patientCaseId;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientCase';

  return encapsulatePromise(url, request);
};

// 新增药物方案
export function addPatientMedicine(patientMedicine) {
  var request = Object.assign({}, commonRequest);
  request.patientMedicine = patientMedicine;
  var url = 'http://apitest.gyenno.com/pdms/addPatientMedicine';

  return encapsulatePromise(url, request);
};

// 修改药物方案
export function modifyPatientMedicine(patientMedicine) {
  var request = Object.assign({}, commonRequest);
  request.patientMedicine = patientMedicine;
  var url = 'http://apitest.gyenno.com/pdms/modPatientMedicine';

  return encapsulatePromise(url, request);
};

// 删除药物方案
export function deletePatientMedicine(patientMedicine) {
  var request = Object.assign({}, commonRequest);
  request.patientMedicine = patientMedicine;
  var url = 'http://apitest.gyenno.com/pdms/delPatientMedicine';

  return encapsulatePromise(url, request);
};

// 查看某次术前评估详情
export function getPreEvaluation(preEvaluationId) {
  preEvaluationId = parseInt(preEvaluationId, 10);
  var request = Object.assign({}, commonRequest);
  request.preopsInfoId = preEvaluationId;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientPreopsDetail';

  return encapsulatePromise(url, request);
};

// 新增术前评估
export function addPreEvaluation(preEvaluation) {
  var request = Object.assign({}, commonRequest);
  request.patientPreops = preEvaluation;
  var url = 'http://apitest.gyenno.com/pdms/addPatientPreops';

  return encapsulatePromise(url, request);
};

// 修改术前评估
export function modifyPreEvaluation(preEvaluation) {
  var request = Object.assign({}, commonRequest);
  request.patientPreops = preEvaluation;
  var url = 'http://apitest.gyenno.com/pdms/modPatientPreops';

  return encapsulatePromise(url, request);
};

// 删除术前评估
export function deletePreEvaluation(preEvaluation) {
  var request = Object.assign({}, commonRequest);
  request.patientPreops = preEvaluation;
  var url = 'http://apitest.gyenno.com/pdms/delPatientPreops';

  return encapsulatePromise(url, request);
};

// 新增手术方案
export function addSurgicalMethod(surgicalMethod) {
  var request = Object.assign({}, commonRequest);
  request.patientTreatment = surgicalMethod;
  var url = 'http://apitest.gyenno.com/pdms/addPatientTreatment';

  return encapsulatePromise(url, request);
};

// 修改手术方案
export function modifySurgicalMethod(surgicalMethod) {
  var request = Object.assign({}, commonRequest);
  request.patientTreatment = surgicalMethod;
  var url = 'http://apitest.gyenno.com/pdms/modPatientTreatment';

  return encapsulatePromise(url, request);
};

// 删除手术方案
export function deleteSurgicalMethod(surgicalMethod) {
  var request = Object.assign({}, commonRequest);
  request.patientTreatment = surgicalMethod;
  var url = 'http://apitest.gyenno.com/pdms/delPatientTreatment';

  return encapsulatePromise(url, request);
};

// 新增术后并发症
export function addOperativeCompliation(operativeComplication) {
  var request = Object.assign({}, commonRequest);
  request.patientComplication = operativeComplication;
  var url = 'http://apitest.gyenno.com/pdms/addPatientComplication';

  return encapsulatePromise(url, request);
};

// 修改术后并发症
export function modifyOperativeCompliation(operativeComplication) {
  var request = Object.assign({}, commonRequest);
  request.patientComplication = operativeComplication;
  var url = 'http://apitest.gyenno.com/pdms/modPatientComplication';

  return encapsulatePromise(url, request);
};

// 删除术后并发症
export function deleteOperativeCompliation(operativeComplication) {
  var request = Object.assign({}, commonRequest);
  request.patientComplication = operativeComplication;
  var url = 'http://apitest.gyenno.com/pdms/delPatientComplication';

  return encapsulatePromise(url, request);
};

// 查看某次程控记录详情
export function getDbsFirstInfo(dbsFirstId) {
  dbsFirstId = parseInt(dbsFirstId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientDbsFirstId = dbsFirstId;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientDbsFirstDetail';

  return encapsulatePromise(url, request);
};

// 新增首次程控记录详情
export function addDbsFirstInfo(dbsFirstInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientDbsFirst = dbsFirstInfo;
  var url = 'http://apitest.gyenno.com/pdms/addPatientDbsFirst';

  return encapsulatePromise(url, request);
};

// 修改首次程控记录详情
export function modifyDbsFirstInfo(dbsFirstInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientDbsFirst = dbsFirstInfo;
  var url = 'http://apitest.gyenno.com/pdms/modPatientDbsFirst';

  return encapsulatePromise(url, request);
};

// 删除首次程控记录详情
export function deleteDbsFirstInfo(dbsFirstInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientDbsFirst = dbsFirstInfo;
  var url = 'http://apitest.gyenno.com/pdms/delPatientDbsFirst';

  return encapsulatePromise(url, request);
};

// 查看非某次程控记录详情
export function getDbsFollowInfo(patientId, dbsFollowId) {
  dbsFollowId = parseInt(dbsFollowId, 10);
  var request = Object.assign({}, commonRequest);
  request.patientId = patientId;
  request.patientDbsFollowId = dbsFollowId;
  var url = 'http://apitest.gyenno.com/pdms/queryPatientDbsFollowDetail';

  return encapsulatePromise(url, request);
};

// 新增非首次程控记录详情
export function addDbsFollowInfo(dbsFollowInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientDbsFollow = dbsFollowInfo;
  var url = 'http://apitest.gyenno.com/pdms/addPatientDbsFollow';

  return encapsulatePromise(url, request);
};

// 修改非首次程控记录详情
export function modifyDbsFollowInfo(dbsFollowInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientDbsFollow = dbsFollowInfo;
  var url = 'http://apitest.gyenno.com/pdms/modPatientDbsFollow';

  return encapsulatePromise(url, request);
};

// 删除非首次程控记录详情
export function deleteDbsFollowInfo(dbsFollowInfo) {
  var request = Object.assign({}, commonRequest);
  request.patientFollowInfo = dbsFollowInfo;
  var url = 'http://apitest.gyenno.com/pdms/delPatientDbsFollow';

  return encapsulatePromise(url, request);
};

// 查询医学量表
export function getScaleInfo() {
  var request = Object.assign({}, commonRequest);
  var url = 'http://apitest.gyenno.com/pdms/queryScaleInfo';

  return encapsulatePromise(url, request);
};

// 新增医学量表
export function addScaleInfo(patientScale) {
  var request = Object.assign({}, commonRequest);
  request.patientScale = patientScale;
  var url = 'http://apitest.gyenno.com/pdms/addPatientScaleInfo';

  return encapsulatePromise(url, request);
};

// 修改医学量表
export function modifyScaleInfo(patientScale) {
  var request = Object.assign({}, commonRequest);
  request.patientScale = patientScale;
  var url = 'http://apitest.gyenno.com/pdms/modPatientScaleInfo';

  return encapsulatePromise(url, request);
};
// 删除医学量表
export function delScaleInfo(patientScale) {
  var request = Object.assign({}, commonRequest);
  request.patientScale = patientScale;
  var url = 'http://apitest.gyenno.com/pdms/delPatientScaleInfo';

  return encapsulatePromise(url, request);
};

// 修改神经系统检查
export function modifyNervouSystem(patientSpephysical) {
  var request = Object.assign({}, commonRequest);
  request.patientSpephysical = patientSpephysical;
  var url = 'http://apitest.gyenno.com/pdms/modPatientSpephysical';

  return encapsulatePromise(url, request);
};

// 新增神经系统检查
export function addNervouSystem(patientSpephysical) {
  var request = Object.assign({}, commonRequest);
  request.patientSpephysical = patientSpephysical;
  var url = 'http://apitest.gyenno.com/pdms/addPatientSpephysical';

  return encapsulatePromise(url, request);
};

// 删除神经系统检查
export function delNervouSystem(patientSpephysical) {
  var request = Object.assign({}, commonRequest);
  request.patientSpephysical = patientSpephysical;
  var url = 'http://apitest.gyenno.com/pdms/delPatientSpephysical';

  return encapsulatePromise(url, request);
};

// 新增生化指标
export function addBiochemical(patientBioexam) {
  var request = Object.assign({}, commonRequest);
  request.patientBioexam = patientBioexam;
  var url = 'http://apitest.gyenno.com/pdms/addBioexam';

  return encapsulatePromise(url, request);
};

// 修改生化指标
export function modBiochemical(patientBioexam) {
  var request = Object.assign({}, commonRequest);
  request.patientBioexam = patientBioexam;
  var url = 'http://apitest.gyenno.com/pdms/modBioexam';

  return encapsulatePromise(url, request);
};

// 删除生化指标
export function delBiochemical(patientBioexam) {
  var request = Object.assign({}, commonRequest);
  request.patientBioexam = patientBioexam;
  var url = 'http://apitest.gyenno.com/pdms/delBioexam';

  return encapsulatePromise(url, request);
};

// 新增肌电图
export function addEmg(patientElecTroGram) {
  var request = Object.assign({}, commonRequest);
  request.patientElecTroGram = patientElecTroGram;
  var url = 'http://apitest.gyenno.com/pdms/addPatElecTroGram';

  return encapsulatePromise(url, request);
};

// 修改肌电图
export function modEmg(patientElecTroGram) {
  var request = Object.assign({}, commonRequest);
  request.patientElecTroGram = patientElecTroGram;
  var url = 'http://apitest.gyenno.com/pdms/modPatElecTroGram';

  return encapsulatePromise(url, request);
};

// 删除肌电图
export function delEmg(patientElecTroGram) {
  var request = Object.assign({}, commonRequest);
  request.patientElecTroGram = patientElecTroGram;
  var url = 'http://apitest.gyenno.com/pdms/delPatElecTroGram';

  return encapsulatePromise(url, request);
};

// 修改生命体征
export function modVitalSigns(patientCase) {
  var request = Object.assign({}, commonRequest);
  request.patientCase = patientCase;
  var url = 'http://apitest.gyenno.com/pdms/modPatientCase';

  return encapsulatePromise(url, request);
};
