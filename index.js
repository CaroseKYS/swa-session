require('babel-polyfill');

const logger     = require('swa-logger');
const session    = require('express-session');
const RedisStore = require('connect-redis')(session);
const utils      = require('swa-utils');
const path       = require('path');

/*应用根路径*/
const rootDir    = process.env.NODE_SWA_ROOT || __dirname;
/*配置文件*/
const configFile = process.env.NODE_SWA_CONF || path.join(rootDir, "swa-conf.js");
/*默认配置*/
const sessionDefaultOptions = {
  storeType: 'redis',
  // genid: null,
  name   : 'swa.client.id',
  proxy  : undefined,
  resave : true,
  rolling: false,
  saveUninitialized: true,
  secret : ',Q%k0[zixEo[Q4q$rcEZ0qY(xcoC%jO(',
  // store : null
  unset  : 'destroy',
  timeout: 1800
};

const cookieDefaultOptions = {
  path    : '/', 
  httpOnly: true, 
  secure  : false, 
  maxAge  : null,
  // domain: false
};

const storeDefaultOptions = {
  redis: {
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
};

let middleware = null;

/**
 * 生成 session 管理中间件的工厂方法
 * @author 康永胜
 * @date   2017-10-10
 * @return {Function}                 [session管理中间件]
 */
module.exports = function(){
  
  if (middleware) {
    return middleware;
  }

  var sessionConf   = utils.getJsonProp(configFile, 'swa-session') || {};

  var cookieOptions  = Object.assign({}, cookieDefaultOptions,  sessionConf.cookie);
  var sessionOptions = Object.assign({}, sessionDefaultOptions, sessionConf, {cookie: cookieOptions});

  var storeConf      = utils.getJsonProp(configFile, sessionOptions.storeType);
  var storeOptions   = Object.assign({}, storeDefaultOptions[sessionOptions.storeType], storeConf);


  /*设置session存储*/
  if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
    sessionOptions.store = new (require('session-file-store')(session))({
      path: sessionConf['store-path'] || path.join(__dirname, 'sessions'),
      ttl: sessionOptions.timeout
    });
  }else if(sessionOptions.storeType === 'redis'){
    console.log(`swa-session is using third-party storage|host: ${storeOptions.host}|port: ${storeOptions.port}`);      
    sessionOptions.store = new RedisStore(storeOptions);
  }else{
    throw new Error(`swa-session|暂不支持[${sessionOptions.storeType}]作为session信息的第三方存储媒介`);
  }

  middleware = session(sessionOptions);

  return middleware;
};

function fnLogErrors(err){
  logger.error('swa-session|connect-redis error|', err);
}