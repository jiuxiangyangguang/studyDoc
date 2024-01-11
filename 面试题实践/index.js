// 能够判断所有数据类型的方法
function getType(obj) {
  let type = typeof obj;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString.call(obj).slice(8, -1);
}

// reduce的作用，Obj转化成一个二维数组
function objToArr(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push([key, obj[key]]);
    return arr;
  }, []);
}

// vite与webpack的区别
// 1. webpack在开发环境中启动时会解析并转为浏览器识别的js,css,img等等文件,会建立源文件之间的依赖关系,最终将庞大的文件合并为少量文件并输出,vite则是用浏览器对esm的天然支持,启动时它并不会加载并解析所有文件,而是在浏览器请求时再去解析,转换,并输出,这样就避免了webpack的繁琐的构建过程,提高了开发效率   (一个是全部打包,一个是按需打包)
// 2. 因为vite是请求时再去加载并解析输出所以首屏和懒加载会慢很多,但是vite提供了预加载的功能,可以在首屏加载完成后预加载懒加载的文件,这样就可以解决懒加载的问题

// 数组扁平化
// 1. reduce
function flatten(arr) {
  return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flatten(cur)] : [...pre, cur];
  })
}
// 2. toString
function flatten(arr) {
  return arr.toString().split(",").map((item) => {
    return +item;
  });
}
// 3. flat
function flatten(arr) {
  return arr.flat(Infinity);
}

// 数组去重
// 1. set
function unique(arr) {
  return [...new Set(arr)];
}
// 2.filter
function unique(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
}
// 3. reduce
function unique(arr) {
  return arr.reduce((pre, cur) => {
    return pre.includes(cur) ? pre : [...pre, cur];
  }, [])
}
// 4. map
function unique(arr) {
  let map = new Map();
  return arr.filter((item) => {
    return !map.has(item) && map.set(item, 1);
  })
}

// 递归的方法深拷贝,加上注释
function deepClone(obj) {
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj === null || typeof obj !== 'object') return obj;

  const cloneObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {  // 是否是自身属性
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj;
}

// 柯里化函数
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func(...args);
    } else {
      return function (...newArgs) {
        return curried(...args, ...newArgs);
      };
    }
  };
}

// 使用方法
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

console.log(curriedSum(1)); // 输出 6
