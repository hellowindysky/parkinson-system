// 这里提供一些用来方便我们操作业务数据的函数

// 在数组中找到具有特定键值对 的 对象元素，并将其返回
function getElement(keyName, value, array) {
  if (!array || !(array instanceof Array)) {
    return {};
  }
  var target = array.filter((element) => {
    return element[keyName] === value;
  })[0];
  // 如果不存在符合条件的对象，则返回空对象
  return target ? target : {};
}

// 将完整的时间字符串（包含时分秒，时区等信息）简化为适合 element-ui 控件的 yyyy-MM-dd 的形式
function simplifyDate(dateStr) {
  // 如果参数本身就为空，那么直接返回 undefined
  if (!dateStr) {
    return undefined;
  }
  var dateObj = new Date(dateStr);
  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  var date = dateObj.getDate();
  return year + '-' + month + '-' + date;
}

export default {
  getElement,
  simplifyDate
};
