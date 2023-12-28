# React18 + Vite + TS + Recoil + RouterV6 |管理端项目实践 🐱‍🏍🐱‍🏍🐱‍🏍

### 前言

这是一个基于React18并使用Vite4.0构建的管理端项目。它实现了动态路由，标准的RBAC权限模型和多角色多岗位权限模型，包括登录鉴权，菜单管理等功能。

项目末尾附有源码地址和项目预览图（本项目仅供学习React相关知识使用）。

### 一、项目介绍

1. 项目使用最新的`Vite`进行构建。经过以往项目的实践，我们发现`Vite`的打包和项目启动速度远高于`Webpack`（具体实践过程将在后续文章中讲述）。因此，本项目也是对`Vite`的一次学习。
2. 项目使用`React18`。目前，hooks已经成为了React的主流，本项目完全拥抱函数化组件，不再使用`Class`来实现组件。
3. 项目使用`Recoil`，这是下一代的`React`官方状态管理工具（后续考虑使用`hox`）。我们放弃了使用臃肿庞大的`redux`，转而使用原子化的状态管理工具。
4. 项目使用`react-router-dom V6`。V6版本的路由相比之前有较大升级，包括路由的跳转，路由表配置，路由鉴权等等。
5. 项目使用`TS`。在多人协作的项目中，`TS`能避免很多语法和类型判断上的错误（例如数据处理与展示时的空字符串与0与null的问题），因此，本项目也是对`TS`的一次实践。
6. 项目中也配置了`ESlint`和`husky`。由于每个人都有自己的编码风格，在项目迭代过程中更换开发人员可能会导致项目越来越臃肿。使用这两个工具能在一定程度上改善这种情况。

### 二、搭建基础项目

1. 直接使用`Vite`创建一个基础模板项目   `Vite`链接☞ [开始 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/)

  ```bash
  pnpm create vite react-admin --template react-ts
  ```

2. 进入项目在项目根目录安装依赖并启动项目(推荐使用pnpm)

  ```bash
  pnpm i
  pnpm dev
  ```

3. 控制台输出如下则证明启动成功

    ```bash
      VITE v4.5.0  ready in 332 ms
    
      ➜  Local:   http://127.0.0.1:5173/
      ➜  Network: use --host to expose
      ➜  press h to show help
    ```

4. 手动打开链接即可看到效果,到此一个基础的React项目就创建完成

    ![](https://gitee.com/jiuxiangyangguang/myimg/raw/master/img/202311201646889.png)

5. 简单配置`vite.config.ts`

    ```ts
    import react from '@vitejs/plugin-react'
    import path, { resolve } from 'path'  // 需要安装@types/node@18.14.2才能识别node模块
    import { defineConfig } from 'vite'
    export default defineConfig({
      base: '',
      plugins: [
        react()
      ],
      // 配置css加载器  需要下载less@4.1.3  less-loader@11.1.0
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true
          }
        },
      },
      resolve: {
        //设置路径别名
        alias: {
          '@': resolve(__dirname, 'src/'),
          'views/*': resolve(__dirname, 'src/views'),
          '@icons': resolve(__dirname, 'src/assets/svg/'),
          'components/*': resolve(__dirname, 'src/components'),
          '*': resolve('')
        }
      },
      server: {
        port: 1102, // 自定义端口
        host: '0.0.0.0',
        open: true, // 自动打开浏览器
        proxy: { // 设置代理
          '/api': {
            target: 'http://127.0.0.1:1103/', // easymock
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
      build: { // 打包设置
        manifest: true,
        rollupOptions: {
          output: {
            sourcemap: false
          }
        }
      }
    })
    ```

    

### 三、使用RouterV6实现动态路由及鉴权

1. 安装`react-router-dom@^6.3.0`  V6版本官网 ☞ [Docs Home v6.3.0 | React Router](https://reactrouter.com/en/v6.3.0)

   ```
   pnpm i react-router-dom@^6.3.0
   ```

2. 新建`404,login,home`页面以及router配置,命名规则组件文件夹名称大写组件以index.tsx形式存在方便后面路由匹配

   ```
   ├── src
       ├── router
       |    └── index.tsx
       ├── views
            ├── 404
            |    └── index.tsx
            ├── Home
            |    └── index.tsx
            └── Login
                 └── index.tsx
   ```

   ```tsx
   // 组件内容如下
   function Login() {
     return (
       <>
         <h1>Login</h1>
       </>
     )
   }
   export default Login
   
   ```

3. 编辑`router`下面的`index.tsx`配置路由表信息下面是我们最常用的引入方式(这样会引入所有的路由无论是否用到)

   ```tsx
   import Error from '@/view/404';
   import Home from '@/view/Home';
   import Login from '@/view/Login';
   import { Navigate, useRoutes } from 'react-router-dom';
   
   // 定义默认的路由表
   export const defRouter: Array<Router> = [
     // 需要在路由最前面添加 优先匹配 重定向
     {
       path: '/',
       name: '',
       isShow: false,
       element: <Navigate to={'/home'} />
     },
     {
       path: '/login',
       name: '登录',
       isShow: false,
       element: <Login></Login>
     },
     {
       path: '*',
       name: '404',
       isShow: false,
       element: <Error></Error>
     },
     // 这里是后面的异步路由,通过异步导入就是这样
     // {
     //   path: '/home',
     //   name: '主页',
     //   isShow: true,
     //   element: lazyLoad("Home")
     // }
   ]
   ```

4. 我们可以使用懒加载来引入组件。`lazy`是`react`提供的组件懒加载工具，我们可以使用`vite`来动态导入所有的组件，并创建一个方法，传入菜单名称自动懒加载对应组件。需要注意的是，`lazy`需要配合`Suspense`组件一起使用。由于组件是通过懒加载加载进来的，所以渲染页面的时候可能会有延迟，但使用了`Suspense`之后，可以优化交互。我们可以继续编辑`index.tsx`，懒加载`Home`等可配置的菜单组件。

   ```tsx
   import { lazy, useState } from 'react';
   
   const Mod: any = import.meta.glob('../views/**/*.tsx') // 在vite中必须这样动态引入所有组件地址
   
   // 快速导入工具函数
   const lazyLoad = (moduleName: string) => {
     const Module = lazy(Mod[`../views/${moduleName}/index.tsx`])
     return (
       <Suspense fallback={<div>Loading...</div>}>
         <Module></Module>
       </Suspense>
     )
   }
   ```

5. 工具后台返回菜单实现动态懒加载路由 (这里模拟后台返回的菜单),并将异步路由和默认的路由结合生成最终的路由表,继续编辑`index.tsx`如下

   ```tsx
   // 假设后台给我们返回了一个菜单
   const menu = [
       {
           "id": 8,
           "name": "主页",
           "icon": "icon-aliens-fill",
           "path": "/home",
           "component": "Home", // 上面说到了组件文件夹名大写并在子文件index.tsx中实现
           "sort_num": 1,
           "redirectTo": "",
           "parent_id": null,
           "isShow": true,
           "create_time": "2023-03-17T08:06:21.283Z"
       }
   ]
   
   // 根据菜单筛选路由
   const filterAsyncRouter = (menus: Array<Router> = []) => {
     const addRouter: Array<Router> = []
     menus.forEach((item: Router) => {
       const route: Router = {
         name: item.name,
         path: item.path,
         isShow: item.isShow,
         element: ''
       }
   
       route.element = lazyLoad(item.component)  // 懒加载路由
   
       if (item.children) {
         route.children = filterAsyncRouter(item.children) // 如有有嵌套路由则递归加载
       }
   
       addRouter.push(route)
     })
     return addRouter  // 返回动态路由表
   }
   
   // 合并路由
   const marRouter = (arr) => {
     return [
       ...defRouter,  // 上面我们配置了默认路由
       ...arr// 将异步路由合并到
     ]
   }
   
   ```

6. **最后实现路由组件**

   ```tsx
   const RouterCom = () => {
     const [routerList, setrouterList] = useState<Router[]>([])
   
     useEffect(() => {
       const asyncArr = filterAsyncRouter(menu)
       setrouterList(marRouter(asyncArr)) // 合并异步路由
     }, [menu])
   
     const routes = useRoutes(routerList) // 生成路由表结构
     return routes
   }
   
   export default RouterCom // 返回给APP.tsx使用
   ```

7. 返回`App.tsx`使用路由

   ```tsx
   import Router from '@/router'
   function App() {
     console.log('APP 渲染')
     return <Router></Router>
   }
   
   export default App
   ```

8. 在`main.tsx`中使用`HashRouter`包裹组件

   ```tsx
   import ReactDOM from 'react-dom/client'
   import { HashRouter } from 'react-router-dom'
   import App from './App'
   import './index.css'
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <HashRouter>
       <App />
     </HashRouter>,
   )
   ```

9. 路由鉴权,在src目录下新建`Auth`文件夹,添加子文件`index.tsx`如下,通过判断`tokenRec`不存在重定向到`login`页

   ```tsx
   import { Navigate, useLocation } from 'react-router-dom'
   
   const Auth = (props: any) => {
     const { children } = props
     const { pathname } = useLocation()
     const tokenRec = ''
     return <>{tokenRec || pathname === '/login' ? children : <Navigate to="/login" replace />}</>
   }
   
   export default Auth
   ```

10. 在`App.tsx`中使用,以上就实现了简单动态路由及路由鉴权,后续更新使用`recoil`将路由保存在本地并生成菜单实现点击跳转

    ```tsx
    import Auth from '@/Auth'
    import Router from '@/router'
    function App() {
      console.log('APP 渲染')
      return (
        <Auth>
          <Router></Router>
        </Auth>
      )
    }
    
    export default App
    ```

### 四、配置烦人的Eslint和husky(根据个人或团队可跳过)

1. 使用`pnpm`在`dev`依赖中安装对应包

   ```json
   "eslint": "^8.45.0",
   "eslint-config-prettier": "^8.6.0",
   "eslint-config-react-app": "^7.0.1",
   "eslint-plugin-prettier": "^4.2.1",
   "eslint-plugin-react-hooks": "^4.6.0",
   "eslint-plugin-react-refresh": "^0.4.3",
   "prettier": "2.8.4",
   ```
   
2. 并在`package.json`中配置格式化脚本

   ```js
   // 脚本如下
   "format": "prettier --write .",
   "lint": "eslint src --ext .ts,.tsx,.js,.jsx --fix --report-unused-disable-directives --max-warnings 0"
   
   // "--fix"：这个选项会让 ESLint 自动修复可以被自动修复的问题。
   // "--report-unused-disable-directives"：这个选项会让 ESLint 报告所有没有用到的 eslint-disable 注释。这可以帮助你发现并清理掉代码中不必要的 eslint-disable 注释。
   // "--max-warnings 0"：这个选项会让 ESLint 在发现任何警告时返回一个非零的退出码，这将导致 npm 或 yarn 命令失败。这可以帮助确保所有的 ESLint 警告都被当作错误处理。
   ```

3. 在项目根目录添加`.eslintrc.cjs`和`.prettierrc`文件,内容如下

   ```js
   /**
    * eslint: eslint的核心代码。
    * @typescript-eslint/parser: eslint的解析器，用于解析typescript，从而检查和规范Typescript代码。
    * @typescript-eslint/eslint-plugin: 这是一个eslint插件，包含了各类定义好的检测Typescript代码的规范。
    */
   module.exports = {
     parser: '@typescript-eslint/parser', // 定义eslint的解析器，在ts项目中必须指定解析器为@typescript-eslint/parser，才能正确的检测和规范TS代码。
     extends: [
       'eslint:recommended',
       'plugin:@typescript-eslint/recommended',
       'plugin:react-hooks/recommended',
       'plugin:prettier/recommended'
     ],
     plugins: ['react-refresh'],
     parserOptions: {
       ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
       sourceType: 'module', // Allows for the use of imports
       ecmaFeatures: {
         jsx: true // Allows for the parsing of JSX
       }
     },
     settings: {
       react: {
         version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
       }
     },
     env: {
       es2021: true,
       // 指定代码的运行环境
       browser: true, // env环境变量配置，形如console属性只有在browser环境下才会存在，如果没有设置支持browser，那么可能报console is undefined的错误。
       node: true
     },
     rules: {
       quotes: ['error', 'single'],
       '@typescript-eslint/explicit-module-boundary-types': 'off',
       '@typescript-eslint/no-explicit-any': 'off',
       '@typescript-eslint/no-empty-function': 'off',
       '@typescript-eslint/no-this-alias': 'off',
       '@typescript-eslint/no-unused-vars': 'off',
       'react-hooks/exhaustive-deps': 'off',
       'react/prop-types': 'off',
       'react/display-name': 'off',
       'react/react-in-jsx-scope': 'off',
       'react/jsx-uses-react': 'off',
       '@typescript-eslint/no-var-requires': 'off'
     }
   }
   ```

   ```js
   // .prettierrc 配置
   {
     "useTabs": false,
     "tabWidth": 2,
     "printWidth": 100,
     "singleQuote": true,
     "trailingComma": "none",
     "bracketSpacing": true,
     "jsxBracketSameLine": true,
     "semi": false
   }
   ```

4. 以上的规则可自行添加或者删除,如遇到保存格式化代码时代码被格式化两次是因为`Eslint`与`prettierrc`有冲突,上面我们已经配置了冲突时使用`prettierrc`规则来格式化代码,可以重启`vscode`让配置生效

5. 配置`husky`提交代码时安装对应包`"husky": "^8.0.0","lint-staged": "^15.0.2"`

   ```js
   "husky": "^8.0.0",
   "lint-staged": "^15.0.2",
   ```
   
6. 安装完成后运行以下命令,

   ```bash
   pnpm dlx husky-init
   ```

7. 执行如上命令后，项目里生成`.husky`文件夹，文件夹下有个`pre-commit`文件,最后一行的命令`pnpm lint`即为在`commit`之前插入执行的命令,`lint`命令我们已经配置了他会检查所有文件

   ```sh
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/_/husky.sh"
   
   pnpm lint
   ```

8. 一般我们会使用`lint-staged`对`git add`到暂存区的文件进行lint检查,而不是直接对所有文件检查,配置如下

   ```json
   {
     "scripts": {
       "prepare": "husky install",
       "lint-staged": "lint-staged"
     },
     "lint-staged": {
       "*.{js,ts,jsx,tsx}": [
         "prettier --write",
         "eslint --cache --fix",
         "git add"
       ]
     }
   }
   ```

   ```sh
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/_/husky.sh"
   
   pnpm lint-staged
   ```


### 五、根据路由配置菜单(Recoil的使用)

1. 上班期间时间实在有限😳,这个在下一篇`Recoil`的实践中讲到 文章末尾附源码(包含完整项目)



### 六、最新项目截图

![](https://gitee.com/jiuxiangyangguang/myimg/raw/master/img/202311201648824.png)

![](https://gitee.com/jiuxiangyangguang/myimg/raw/master/img/202311201647108.png)

![](https://gitee.com/jiuxiangyangguang/myimg/raw/master/img/202311201647725.png)

![](https://gitee.com/jiuxiangyangguang/myimg/raw/master/img/202311201645097.png)

### 最后

- 具体实现和项目代码Github  ☞ [jiuxiangyangguang/react-admin: react-后台管理项目 (github.com)](https://github.com/jiuxiangyangguang/react-admin)
- 后台管理项目的后端实现  ☞ [jiuxiangyangguang/nestJs (github.com)](https://github.com/jiuxiangyangguang/nestJs)
- 如果这篇文章能为你提供帮助，那么请轻轻移动你的鼠标点亮`赞赏之星`，`关注`我的更新，并在`评论`区留下你的足迹😊
