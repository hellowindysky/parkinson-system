import Vue from 'vue';

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

export function vueCopy(origin, copy) {
  // 这个函数用来深复制一个可以由 Vue 跟踪的数据对象（或数组），
  // 要求原始对象（或数组）内部不能有函数，只能由 {} 和 [] 组成
  // 由于 Vue 不允许动态添加根级响应式属性，我们只能对组件已注册的 data 进行操作，
  // 所以第二个传入的参数是对象一个已注册的对象（或数组）
  if (typeof origin !== 'object') {
    return;   // 如果不是对象和数组，则直接返回，结束本次复制
  }

  var isOriginArray = origin instanceof Array;
  var isCopyArray = copy instanceof Array;
  if (isOriginArray !== isCopyArray) {
    return;   // 传入的两个对象，一个是数组，另一个不是，则直接返回，结束本次复制
  }

  if (isOriginArray) {
    // 要复制的是一个数组
    for (var i = 0; i < origin.length; i++) {
      if (typeof origin[i] !== 'object') {
        return;   // 数组内包裹的也只能是对象，如果包裹了其它东西，则直接返回，结束本次复制
      } else if (origin[i] instanceof Array) {
        Vue.set(copy, i, []);
        vueCopy(origin[i], copy[i]);
      } else if (!(origin[i] instanceof Array)) {
        Vue.set(copy, i, {});
        vueCopy(origin[i], copy[i]);
      }
    }

  } else {
    // 要复制的不是数组
    for (var p in origin) {
      if (origin.hasOwnProperty(p) && typeof origin[p] !== 'object') {
        Vue.set(copy, p, origin[p]);    // 这里是唯一结束递归的地方
      } else if (origin.hasOwnProperty(p) && (origin[p] instanceof Array)) {
        Vue.set(copy, p, []);
        vueCopy(origin[p], copy[p]);
      } else if (origin.hasOwnProperty(p) && !(origin[p] instanceof Array)) {
        Vue.set(copy, p, {});
        vueCopy(origin[p], copy[p]);
      }
    }
  }
}

export function pruneObj(obj) {
  // 精简一个对象，将其下对应值为空的属性删除，这样利于传递给后端
  if (typeof obj !== 'object') {
    return;   // 如果参数不是对象和数组，则直接返回，结束本次精简操作
  }

  for (var p in obj) {
    if (obj.hasOwnProperty(p) && typeof obj[p] !== 'object') {
      if (obj[p] === undefined || obj[p] === null || obj[p] === '') {
        delete obj[p];  // 删除值为空的属性，这是该函数唯一结束递归的地方
      }
    } else if (obj.hasOwnProperty(p) && (obj[p] instanceof Array)) {
      for (let item of obj[p]) {
        pruneObj(item);
      }
    } else if (obj.hasOwnProperty(p) && !(obj[p] instanceof Array)) {
      pruneObj(obj[p]);
    }
  }
};
