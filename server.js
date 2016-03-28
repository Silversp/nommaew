var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var MysqlQ = require('./Model/MysqlQ')
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/reservDate', MysqlQ.getReserved)
app.get('/member', MysqlQ.getMember)
app.get('/userlist', MysqlQ.getUserRent)
app.get('/staflist', MysqlQ.getStaffRent)
app.post('/login', MysqlQ.login)
app.post('/reserv', MysqlQ.reservRoom)
app.post('/signup', MysqlQ.register)
app.put('/changeStatus', MysqlQ.changeStatus)
app.put('/accountSetting', MysqlQ.accountSetting)
app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
