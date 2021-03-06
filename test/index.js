const rewire   = require('rewire');
const should   = require('should');
const path     = require('path');
const fs       = require('fs');
const httpmock = require('node-mocks-http');
const events   = require('events');

const sIndexPath = path.join(__dirname, '..', 'index.js');
var   session;

describe('swa-session 中间件测试', function(){

  describe('开发环境测试', function(){
    var req;
    var res;

    before(function(){
      delete process.env.NODE_ENV;
    }); 

    beforeEach(function(){
      req = httpmock.createRequest({url: '/'});
      res = httpmock.createResponse({
        eventEmitter: events.EventEmitter
      });
      delete require.cache[sIndexPath];
      delete process.env.NODE_SWA_ROOT;
    });

    it('没有指定根目录的情况下加载模块并对中间件进行一次调用', function(done){
      var session1, session2;
      should.doesNotThrow(function(){
        session1 = require('../index.js')();
        session2 = require('../index.js')();
        session  = session1;
        session(req, res, done);
        res.end();
      });

      session1.should.equal(session2);
    });

    it('指定根目录的情况下加载模块并对中间件进行一次调用', function(done){
      process.env.NODE_SWA_ROOTNODE_SWA_ROOT = path.join(__dirname, 'conf-1');
      should.doesNotThrow(function(){
        session = rewire('../index.js')();
        session(req, res, done);
        res.end();
      });
    });

    it('指定根目录的情况下加载模块并对中间件进行一次调用', function(done){
      process.env.NODE_SWA_ROOT = path.join(__dirname, 'conf-2');
      should.doesNotThrow(function(){
        session = rewire('../index.js')();
        session(req, res, function(){
          res.end();
          done();
        });
      });
    });

    it('存储错误提示', function(){
      session = rewire('../index.js');
      var fnLogErrors = session.__get__('fnLogErrors');
      should.doesNotThrow(function(){
        fnLogErrors('错误测试');
      });
    });

  });

  describe('非开发环境测试', function(){
    var req;
    var res;

    before(function(){
      process.env.NODE_ENV = 'production';
    });

    beforeEach(function(){
      req = httpmock.createRequest({url: '/'});
      res = httpmock.createResponse({
        eventEmitter: events.EventEmitter
      });
      delete require.cache[sIndexPath];
      delete process.env.NODE_SWA_ROOT;
    });

    it('加载模块并对中间件进行一次调用(未指定根目录)', function(done){
      should.doesNotThrow(function(){
        session = rewire('../index.js')();
        session(req, res, done);
        res.end();
      });
    });

    it('加载模块并对中间件进行一次调用(指定根目录)', function(done){
      process.env.NODE_SWA_ROOT = path.join(__dirname, 'conf-2');
      should.doesNotThrow(function(){
        session = rewire('../index.js')();
        session(req, res, function(){
          setTimeout(function(){
            res.end();
            done();
          }, 1500);
        });
      });
    });

    it('加载模块并对中间件进行一次调用(指定根目录)', function(){
      process.env.NODE_SWA_ROOT = path.join(__dirname, 'conf-3');
      should.throws(function(){
        session = rewire('../index.js')();
      });
    });

  });
});