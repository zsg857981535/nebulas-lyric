var express = require('express');
var compression = require('compression');
var proxy = require('http-proxy-middleware');
var app = express();

app.use(compression());
app.use(express.static('dist'))
app.use('/api', proxy({
  target: 'http://localhost:3000', 
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
}));
app.get('/', function (req, res) {
});

app.listen(3001, function () {
  console.log('Static app listening on port 3001!');
});