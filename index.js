'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var redisService = require('./redis');
app.use( urlencodedParser);
app.get('/pac/:user', function (req, res) {
  let user = req.params.user.slice(0,-4) || 'default';
  console.log(user)
  redisService.hgetall(user).then(function(reply){
    console.log(reply)
    let unProxy = reply.unProxy;
    let host = reply.host;
    let port = reply.port;
    let rule = unProxy ==='1'? "DIRECT":`PROXY ${host}:${port}; DIRECT`;
    let tpl =  `function FindProxyForURL(url, host) {
      return "${rule}";
    };`
    res.send(tpl);
  })
  .catch(function(err){
    let tpl =  `function FindProxyForURL(url, host) {
      return "DIRECT";
    };`
    res.send(tpl);
  })

});
app.get('/setpac', function (req, res) {
  var user = req.query.user || 'default';
  var port = req.query.port || '8888';
  var host = req.query.host || '127.0.0.1';
  var port = req.query.port || '8888';
  var pass = req.query.pass;
  var unProxy = req.query.unProxy==='1'?'1':'0';
  redisService.hgetall(user).then(function(reply){
    if(!reply.pass ||reply.pass&&pass===reply.pass) {
      let args = ['host',host,'port',port,'unProxy',unProxy];
      if(pass){
        args.push('pass');
        args.push(pass);
      }
      return redisService.hmset(user,args)
    }
    else {
      throw new Error('密码错误')
    }
  })
  .then(function(reply){
    res.send('success');
  })
  .catch(function(err){
    console.log(err)
    res.status(400).send(err.message)
  })
});
app.get('/setpass', function (req, res) {
  var user = req.query.user || 'default';
  var pass = req.query.pass;
  var newPass = req.query.newpass;
  if(!newPass) {
    return res.status(400).send('请输入密码');
  }
  redisService.hgetall(user).then(function(reply){
    if(!reply.pass ||reply.pass&&pass===reply.pass) {
      let args = ['pass',newPass];
      return redisService.hmset(user,args)
    }
    else {
      throw new Error('密码错误')
    }
  })
  .then(function(reply){
    res.send('success');
  })
  .catch(function(err){
    console.log(err)
    res.status(400).send(err.message)
  })
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
