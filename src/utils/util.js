// 这里提供一些用来方便我们操作数据的函数

// 在数组中找到具有特定键值对 的 对象元素，并将其返回
function getElement(keyName, value, array) {
  var target = array.filter((element) => {
    return element[keyName] === value;
  })[0];
  // 如果不存在符合条件的对象，则返回空对象
  return target ? target : {};
}

export default {
  getElement
};
