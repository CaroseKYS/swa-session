# swa-session
应用于swa平台的、基于express框架的 `session` 管理中间件。

## 功能描述
该模块基于[express-session](https://www.npmjs.com/package/express-session)，实现 `session` 管理。当模块运行于开发模式时，使用文件存储 `session` 信息，当模块运行于生产模式时，使用第三方高速缓存 `redis` / `memcache` 等存储用户信息。该模块集成的模块还包括 [session-file-store](https://www.npmjs.com/package/session-file-store) / [connect-redis](https://www.npmjs.com/package/connect-redis) 等。

## 配置信息
    'swa-session': {
      //生产模式下用于存储 session 的方式，目前只支持 redis，之后会支持其他高速缓存
      storeType: 'redis', 
      //以下配置项是本模块采用的默认配置，配置的具体含义请参考express-session
      // genid: null,
      name   : 'swa.client.id',
      proxy  : undefined,
      resave : true,
      rolling: false,
      saveUninitialized: true,
      secret : '',
      // store : null
      unset  : 'destroy',
      timeout: 1800,
      cookie: {
        path    : '/', 
        httpOnly: true, 
        secure  : false, 
        maxAge  : null,
        // domain: false
      }
    }; 

    'redis': {
      // client: null,
      // host: '127.0.0.1',
      // port: 6379,
      // socket: null,
      // url: null,
      ttl: sessionDefaultOptions.timeout,
      // disableTTL: false,
      db: 0,
      // pass: false,
      prefix: 'swa-session-',
      // serializer: JSON.stringify,
      logErrors: fnLogErrors,
      // scanCount: 100,
    }

## 使用方式

    const app = express();
    const session = require('swa-session')();
    app.use(session);

## 运行测试

    npm install;
    npm test;

**注意：** 该模块的测试依赖于 `redis` 服务，运行测试代码之前请保证 `127.0.0.1:6379` 所对应的 `redis` 服务可用。
