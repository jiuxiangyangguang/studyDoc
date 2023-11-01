# NestJS搭建直播服务器 🐱‍🏍🐱‍🏍🐱‍🏍

### 介绍

后端使用`node-media-server`搭建直播推流服务器,使用`obs`推流,前端可使用B站开源的`flv.js`来播放直播,React可使用`react-player`播放。

### 一、实现原理

- 通过 [`node-media-server`搭建后台服务器](#nodeServe)会生成推流地址和管理端地址
- 使用[`obs`开启直播](#obs)将直播流推送到后台服务器
- 后台服务器对流进行加密、缓存、增加多个清晰度等等
- 前端通过 [`flv.js`播放](#node-media-server)直播

### 二、node-media-server<a id="nodeServe"></a> 搭建直播流服务器

   `node-media-server`是基于`node.Js`开发的一个推流服务器。GitHub地址 ☞ [node-media-server](https://github.com/illuspas/Node-Media-Server)

- 下载`node-media-server` 和`@ffmpeg-installer/ffmpeg`(对流进行处理需要用到这个工具)推荐使用`pnpm`

  ```bash
  pnpm i node-media-server @ffmpeg-installer/ffmpeg
  ```

- 新建一个`live.js`文件

  ```js
  import NodeMediaServer from 'node-media-server'
  const createStream = () => {
     // 流最基础的配置文件
     const config = {
        rtmp: {
          port: 1935, // 推流端口
          chunk_size: 60000,
          gop_cache: true,
          ping: 30,
          ping_timeout: 60,
        },
        http: {
          port: 8887, // 获取流的地址
          allow_origin: '*',
        }
      }
      const avv = new NodeMediaServer(config)
      avv.run()
  }
  
  createStream()
  ```

- 执行该文件 `node live.js` 控制台会打印如下则证明服务器启动成功

  ```bash
  Node Media Server v2.6.2
  Node Media Rtmp Server started on port: 1935
  Node Media Http Server started on port: 8887
  Node Media WebSocket Server started on port: 8887
  ```

- 在浏览器中访问`127.0.0.1:8887/admin` 可访问服务器管理端地址。[这里可查看

- [更多api](https://github.com/illuspas/Node-Media-Server/blob/master/README_CN.md#服务器信息统计)

  ![image-20231101181748853](mdimg/image-20231101181748853.png)


### 三、使用obs软件进行直播推流

- 下载`obs` 这里以[windows](https://obsproject.com/zh-cn/)版作为演示

- 下载完成后依此点击 设置 => 直播  设置推流地址为 `rtmp://127.0.0.1:1935/live` live为app名称可自行替换,推流码也可自行替换

  ![image-20231101182620312](mdimg/image-20231101182620312.png)

- 上面我们设置了app名称为`live`,推流码为`mylive2`,然后开启直播并打开`127.0.0.1:8887/admin` 管理端地址(记得刷新页面~),可以看到直播参数,可以点击`mylive2`来预览直播

  ![image-20231101182948165](mdimg/image-20231101182948165.png)

  



### 四、后续待优化

- 🎉 完善权限管理功能
- 🎉 增加多语言切换功能
- 🎉 增加全局主题,可一件配置页面动画,颜色,按钮大小等等 并增加配置保存与分享功能
- 🙇‍🙇‍🙇‍ 有 Bug 或好玩的新功能欢迎在 issues 提出,看到了会第一时间回复 😊

### 四、安装使用步骤

- 克隆项目到本地

```bash
git https://github.com/jiuxiangyangguang/react-admin.git
```

- **切换 dev 分支 由于服务器到期部分后台服务未部署请切换至 dev 分支浏览账号密码随便填**

```bash
git checkout dev
```

- 安装依赖 (推荐使用 pnpm或者yarn)

```bash
pnpm i 
```

- 运行项目(使用main 分支时需要先启动[后台项目](https://github.com/jiuxiangyangguang/nestJs)不然无法登录,后台服务依赖于Redis,MySQL,建议使用Dockery拉取镜像以体验完整功能)

```bash
yarn dev
```

- 打包使用

```bash
yarn build
```

- 部署使用 docker 详情可见 package.json 文件 支持 gulpfile 一键部署到服务器

- <a id="docker"></a>**Docker部署  可体验完整功能**

- 所需镜像列表

  - `traveldocker1/node`  后台服务
  - `traveldocker1/admin:latest`  前端服务
  - `traveldocker1/mysql`  数据库服务  [初始化数据库sql](./test.sql)
  - `traveldocker1/redis`  缓存服务   [redis配置](./redis.conf)
  - 新建`docker-compose.yml`文件   

  ```yaml
  version: '3'
  services:
    node:
      build: .
      image: traveldocker1/node
      ports:
      ports:
        - '1152:1103'
        - '8887:8887'
        - '1935:1935'
      depends_on:
        - mysql
        - redis
    admin:
      image: traveldocker1/admin:latest
      ports:
        - '1102:1102'
    mysql:
      image: traveldocker1/mysql
      ports:
        - '3308:3306'
      environment:
        MYSQL_ROOT_PASSWORD: root
      volumes:
        - db_data:/var/lib/mysql
        - ./test.sql:/docker-entrypoint-initdb.d/test.sql
    redis:
      image: traveldocker1/redis
      ports:
        - '6378:6379'
      command: redis-server /usr/local/etc/redis/redis.conf
      volumes:
        - ./redis.conf:/usr/local/etc/redis/redis.conf
  
  volumes:
    db_data:
  
  ```
  
  - 运行容器

  ```bash
  docker-compose up
  ```
  
  

### 五、项目截图

