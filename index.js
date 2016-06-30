var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use( urlencodedParser);
app.get('/self.pac', function (req, res) {
  var host = req.query.host || '127.0.0.1';
  var port = req.query.port || '8888';
  var tpl =  `function FindProxyForURL(url, host) {
      return "PROXY ${host}:{$port}";
  };`
  res.send(tpl);
});
app.get('/setpac', function (req, res) {

  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
