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
    let host = reply.host;
    let port = reply.port;
    let tpl =  `function FindProxyForURL(url, host) {
      return "PROXY ${host}:${port}; DIRECT";
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
  redisService.hmset(user,['host',host,'port',port]).then(function(reply){
    res.send('success');
  })
  .catch(function(err){
    console.log(err)
    res.send('fail')
  })
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
