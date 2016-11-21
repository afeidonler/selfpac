var redis = require("redis"),
    client = redis.createClient({password:"afeizhang"});
var isConnect = false;

client.on("error", function (err) {
    console.log("Error " + err);
});
client.on("ready", function () {
  isConnect = true;
});
var RedisService ={};
RedisService.hset = function(key,name,value) {
  return new Promise(function(reslove,reject){
    if (!isConnect) {
      reject(new Error('redis连接失败'));
    }
    client.hset(key,name,value,function(err,reply){
      if(err){
        reject(err);
      }
      else {
        reslove(reply);
      }
    })
  })
}
RedisService.hmset = function(key,args) {
  return new Promise(function(reslove,reject){
    if (!isConnect) {
      reject(new Error('redis连接失败'));
    }
    args.unshift(key);
    client.hmset(args,function(err,reply){
      if(err){
        reject(err);
      }
      else {
        reslove(reply);
      }
    })
  })
}
RedisService.hget = function(key,name) {
  return new Promise(function(reslove,reject){
    if (!isConnect) {
      reject(new Error('redis连接失败'));
    }
    client.hset(key,name,function(err,reply){
      if(err){
        reject(err);
      }
      else {
        reslove(reply);
      }
    })
  })
}
RedisService.hgetall = function(key) {
  return new Promise(function(reslove,reject){
    if (!isConnect) {
      reject(new Error('redis连接失败'));
    }
    client.hgetall(key,function(err,reply){
      if(err){
        reject(err);
      }
      else {
        reslove(reply);
      }
    })
  })
}
module.exports = RedisService;