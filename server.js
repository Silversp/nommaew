var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var MysqlQ = require('./Model/MysqlQ');
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/room', MysqlQ.getRoom );
app.get('/member', MysqlQ.getMember );
app.get('/rent', MysqlQ.getUserRent );
app.get('/staffrent', MysqlQ.getStaffRent );
app.get('/roomrent', MysqlQ.getStaffRent );
app.post('/login', MysqlQ.login );
app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});