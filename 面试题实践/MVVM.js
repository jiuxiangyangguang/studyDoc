function defineReactive(data, key, val) {
  if (val && typeof val === 'object') {
    observer(val)
  }
  const dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 需要被监听响应的数据
      Dep.target && dep.depend()
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”')
      dep.notify() // 如果数据变化，通知所有订阅者
    }
  })
}

// 监听
function observer(value) {
  Object.keys(value).forEach((key) => defineReactive(value, key, value[key]))
}

// 订阅
function Dep() {
  this.subscribers = []
}

Dep.prototype.depend = function () {
  if (Dep.target) {
    this.subscribers.push(Dep.target)
  }
}

Dep.prototype.notify = function () {
  this.subscribers.forEach((sub) => sub.update())
}

var library = {
  book1: {
    name: {
      a: '第一次',
      b: ''
    }
  },
  book2: '',
  book3: []
}
function Watcher(obj, key, cb) {
  this.obj = obj
  this.key = key
  this.cb = cb
  this.value = this.get() // 获取当前值,将自己加入dep
}

Watcher.prototype = {
  update() {
    let value = this.obj
    const keys = this.key.split('.')
    keys.forEach((key) => {
      value = value[key]
    })
    var oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.obj, value, oldVal) // 触发回调(value)
    }
  },
  get() {
    Dep.target = this // 缓存自己
    // 强制执行监听器里的get函数,将观察者加入到dep
    let value = this.obj
    const keys = this.key.split('.')
    keys.forEach((key) => {
      value = value[key]
    })
    Dep.target = null // 释放自己
    return value
  }
}

observer(library)
new Watcher(library, 'book1.name.a', function (newVal, oldVal) {
  console.log(newVal, oldVal)
})
library.book1.name.a = 'vue权威指南' // 属性name已经被监听了，现在值为：“vue权威指南”
library.book2 = '没有此书籍' // 属性book2已经被监听了，现在值为：“没有此书籍”
library.book3 = [] // 属性book2已经被监听了，现在值为：“没有此书籍”
