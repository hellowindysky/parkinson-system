export function deepCopy(obj) {
  // 这个函数是个简化的深复制函数，复制的对象下面不能有函数
  // 它能正确处理的对象只有 Number, String, Boolean, Array 等扁平对象，即那些能够被 json 直接表示的数据结构
  // 如果需要完整功能的深复制，可以使用 lodash 的 clone 方法，它的效率相当高
  var str;
  var newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj);
    newobj = JSON.parse(str);
  } else {
    for (let i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i];
    }
  }
  return newobj;
};

export function isEmptyObject(obj) {
  // 检查一个对象是否为 {}
  for (var name in obj) {
    return false;
  }
  return true;
};
