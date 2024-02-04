// 能够判断所有数据类型的方法
function getType(obj) {
  let type = typeof obj
  if (type !== 'object') {
    return type
  }
  return Object.prototype.toString.call(obj).slice(8, -1)
}

// reduce的作用，Obj转化成一个二维数组
function objToArr(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push([key, obj[key]])
    return arr
  }, [])
}

// vite与webpack的区别
// 1. webpack在开发环境中启动时会解析并转为浏览器识别的js,css,img等等文件,会建立源文件之间的依赖关系,最终将庞大的文件合并为少量文件并输出,vite则是用浏览器对esm的天然支持,启动时它并不会加载并解析所有文件,而是在浏览器请求时再去解析,转换,并输出,这样就避免了webpack的繁琐的构建过程,提高了开发效率   (一个是全部打包,一个是按需打包)
// 2. 因为vite是请求时再去加载并解析输出所以首屏和懒加载会慢很多,但是vite提供了预加载的功能,可以在首屏加载完成后预加载懒加载的文件,这样就可以解决懒加载的问题

// 数组扁平化
// 1. reduce
function flatten(arr) {
  return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flatten(cur)] : [...pre, cur]
  })
}
// 2. toString
function flatten(arr) {
  return arr
    .toString()
    .split(',')
    .map((item) => {
      return +item
    })
}
// 3. flat
function flatten(arr) {
  return arr.flat(Infinity)
}

// 数组去重
// 1. set
function unique(arr) {
  return [...new Set(arr)]
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
    return pre.includes(cur) ? pre : [...pre, cur]
  }, [])
}
// 4. map
function unique(arr) {
  let map = new Map()
  return arr.filter((item) => {
    return !map.has(item) && map.set(item, 1)
  })
}

// 递归的方法深拷贝,加上注释
function deepClone(obj) {
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj === null || typeof obj !== 'object') return obj

  const cloneObj = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 是否是自身属性
      cloneObj[key] = deepClone(obj[key])
    }
  }
  return cloneObj
}

// 柯里化函数
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func(...args)
    } else {
      return function (...newArgs) {
        return curried(...args, ...newArgs)
      }
    }
  }
}

// 使用方法
function sum(a, b, c) {
  return a + b + c
}

let curriedSum = curry(sum)

console.log(curriedSum(1)) // 输出 6

// 控制并发请求的函数
const JopList = (num = 2) => {
  const list = []
  const res = []
  const curObj = {
    cur: 0,
    get() {
      return this.cur
    },
    set(value) {
      this.cur = value
    }
  }
  const add = (jop) => {
    list.push(jop)
    if (curObj.cur < num) {
      run()
    }
  }

  const run = async () => {
    if (curObj.cur >= num) return
    const son = list.shift()
    if (son) {
      curObj.cur++
      const re = await son()
      res.push(re)
      curObj.cur--
      if (curObj.cur === 0 && son.length === 0) {
        console.log(res)
      }
      await run()
    }
  }

  return { add, res, curObj }
}

// 定义一个异步函数 `asyncFun`，它模拟异步操作并在延迟后解析
function asyncFun(value, delay) {
  return new Promise((resolve) => {
    console.log('value ' + value)
    setTimeout(() => {
      console.log('resolve ' + value)
      resolve(value)
    }, delay)
  })
}
// 定义一个异步函数 `asyncFun`，它模拟异步操作并在延迟后解析
function asyncFun(value, delay) {
  return new Promise((resolve) => {
    console.log('value ' + value)
    setTimeout(() => {
      console.log('resolve ' + value)
      resolve(value)
    }, delay)
  })
}

// // 使用
// const queue = JopList(2)
// for (let i = 0; i < 4; i++) {
//   queue.add(() => asyncFun(i, 3000))
// }

// 防抖
function debounce(fn, delay) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}
// 节流函数
function throttle(fn, delay) {
  let flag = true
  return function () {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this, arguments)
      flag = true
    }, delay)
  }
}

const flat = (arr) => {
  return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flat(cur)] : [...pre, cur]
  }, [])
}

for (var i = 0; i < 4; i++) {
  ;(function (i) {
    setTimeout(() => {
      console.log(i)
    }, 0)
  })(i)
}

const hei = (h, n) => {
  let cnt = 0
  for (let i = 0; i < n; i++) {
    cnt += 1.9 * h
    h = h * 0.9
  }
  console.log(cnt)
}
hei(100, 100)

function arrayToTree(items) {
  const result = [] // 存放结果集
  const itemMap = {} // 存放哈希表

  // 先转成哈希表
  for (let i = 0; i < items.length; i++) {
    itemMap[items[i].id] = { ...items[i], children: [] }
  }

  // 再利用哈希表构建树形结构
  for (let i = 0; i < items.length; i++) {
    const id = items[i].id
    const pid = items[i].pid
    const treeItem = itemMap[id]
    if (pid === 0) {
      result.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: []
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}

function convertToTree(items) {
  const tree = []
  const map = new Map()

  // Add all items to the map
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  // Iterate through items and add them to their parent's children array
  items.forEach((item) => {
    if (item.pid !== 0) {
      const parent = map.get(item.pid)
      if (parent) {
        parent.children.push(map.get(item.id))
      }
    } else {
      tree.push(map.get(item.id))
    }
  })

  return tree
}

const items = [
  { id: 1, pid: 0, name: 'Node1' },
  { id: 2, pid: 1, name: 'Node2' },
  { id: 3, pid: 1, name: 'Node3' },
  { id: 4, pid: 2, name: 'Node4' },
  { id: 5, pid: 2, name: 'Node5' },
  { id: 6, pid: 3, name: 'Node6' },
  { id: 7, pid: 3, name: 'Node7' },
  { id: 8, pid: 4, name: 'Node8' },
  { id: 9, pid: 5, name: 'Node9' },
  { id: 10, pid: 0, name: 'Node10' },
  { id: 11, pid: 10, name: 'Node11' },
  { id: 12, pid: 10, name: 'Node12' }
]

console.log(JSON.stringify(convertToTree(items), null, 2))

Object.prototype.toString.call([])
class MyClass {
  static c = '解决'
  constructor(name, sex) {
    this.name = name
    this.sex = sex
    // 构造函数
  }

  myMethod(name) {
    this.name = name
    console.log(this.name)
    // 实例方法
  }

  static myStaticMethod(instance) {
    console.log(MyClass.c)
  }
}

// 原型方法
MyClass.prototype.myPrototypeMethod = function () {
  console.log('原型')
  // ...
}
const myClass = new MyClass('张三', '男')
// myClass.myMethod('李四')
MyClass.myStaticMethod()
myClass.myPrototypeMethod()

// 洋葱模型
const m1 = async (req, res, next) => {
  console.log('m1 start')
  let result = await next()
  console.log('m1 end')
}

const m2 = async (req, res, next) => {
  console.log('m2 start')
  let result = await next()
  console.log('m2 end')
}

const m3 = async (req, res, next) => {
  console.log('m3 start')
  let result = await next()
  console.log('m3 end')
  return result
}

const middlewares = [m1, m2, m3]

function useApp(req, res) {
  const next = () => {
    const middleware = middlewares.shift()
    if (middleware) {
      return Promise.resolve(middleware(req, res, next))
    } else {
      return Promise.resolve('end')
    }
  }
  next()
}

// 启动中间件
useApp()
