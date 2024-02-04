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
