var path = require('path');
module.exports = {
  /*配置redis服务信息，该服务主要是swa-session模块在用，业务代码也可使用该服务*/
  'redis': {
    //主机域名，默认为127.0.0.1
    'host': '127.0.0.1',

    //端口，默认为6379
    'port': 6379,

    //密码，默认无密码
    // 'pass': '',

    //数据库的索引号，默认为0
    'db': 0,

    'secret': '123',

    'store-path': path.join(__dirname, '..', '..', 'sessions2')
  },
  /*配置session*/
  'swa-session': {
    //session超时时间，默认为900s，即15min
    'timeout': 900,

    //浏览器中存储cookie的名称，默认为'swa.client.id'
    'name': 'swa.client.id',

    //cookie信息
    'cookie': {
      //cookie对应的domain属性值，false表示不带domain属性
      'domain': '.intermen.cn',

      //cookie对应的path属性值，默认为根目录'/'
      'path': '/', 

      //httpOnly属性，默认为true
      'httpOnly': false,

      //httpOnly属性，默认为true
      'expires': 3000,

      //httpOnly属性，默认为true
      'maxAge': 3000,

      //httpOnly属性，默认为true
      'sameSite': true,

      //httpOnly属性，默认为true
      'secure': true
    }
  }
}