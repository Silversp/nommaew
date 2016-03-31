var mysql = require('mysql')
const crypto = require('crypto')
var Q = require('q')
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'resort'
})
module.exports = {
  getReserved: getReserved,
  getMember: getMember,
  getUserRent: getUserRent,
  login: login,
  getStaffRent: getStaffRent,
  reservRoom: reservRoom,
  register: register,
  changeStatus: changeStatus,
  getRoomRent: getRoomRent,
  accountSetting: accountSetting
}
function accountSetting (req, res) {
  var data = req.body
  var sql
  if (data.changePassword) {
    var hash = crypto.createHash('sha256')
    hash.update(data.passwordOld)
    var passOld = hash.digest('hex')
    if (passOld === data.token) {
      hash = crypto.createHash('sha256')
      hash.update(data.passwordNew)
      var passnew = hash.digest('hex')
      sql = 'UPDATE member set member.name = "' + data.name + '", member.Surname = "' + data.sName + '", member.username = "' + data.username + '", member.pass = "' + passnew + '" WHERE member.Userid = "' + data.id + '"'
    } else {
      res.status(405).send('password เดิมไม่ถูกต้อง')
      return
    }
  } else {
    sql = 'UPDATE member set member.name = "' + data.name + '", member.Surname = "' + data.sName + '", member.username = "' + data.username + '" WHERE member.Userid = "' + data.id + '"'
  }
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    } else {
      connection.query(sql, function (err, rows) {
        console.log(sql)
        if (err) {
          res.status(500).send(err)
          console.error(err)
          return
        } else {
          console.log(true)
          if (passnew) {
            res.send(passnew)
          } else {
            res.send(false)
          }
        }
        connection.release()
        return
      })
    }
  })
}
function changeStatus (req, res) {
  var data = req.body
  var user = req.get('user')
  var pass = req.get('token')
  console.log(data, user, pass)
  checkAuthen(user, pass).then(function () {
    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      } else {
        var sql = 'UPDATE rent set rent.Statusrent = "' + data.status + '" WHERE rent.Crent = "' + data.rentId + '"'
        connection.query(sql, function (err, rows) {
          console.log(sql)
          if (err) {
            res.status(500).send(err)
            console.error(err)
            return
          } else {
            console.log(true)
            res.send('true')
          }
          connection.release()
          return
        })
      }
    })
  }).catch(function (err) {
    res.status(500).send(err)
    console.error(err)
  })
}
function checkAuthen (user, pass) {
  var defer = Q.defer()
  var query = 'SELECT Usertype FROM member where username="' + user + '" and pass="' + pass + '"'
  pool.getConnection(function (err, connection) {
    if (err) {
      defer.reject(err)
    } else {
      connection.query(query, function (err, rows) {
        if (err) {
          defer.reject(err)
        } else {
          console.log(rows[0])
          if (parseInt(rows[0].Usertype, 10) >= 1) {
            defer.resolve(true)
          } else {
            defer.reject('Authen fail Plese Re-login')
          }
        }
        connection.release()
      })
    }

  })
  return defer.promise
}
function register (req, res) {
  const hash = crypto.createHash('sha256')
  var userData = req.body
  hash.update(userData.password)
  var pass = hash.digest('hex')
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    } else {
      var sql = "INSERT INTO `member`( `Name`, `Surname`, `Username`, `Pass`, `Usertype`) VALUES ('" + userData.name + "','" + userData.sName + "','" + userData.username + "','" + pass + "','" + 0 + "')"
      connection.query(sql, function (err, rows) {
        console.log(sql)
        if (err) {
          res.status(500).send(err)
          console.error(err)
          return
        } else {
          res.send('true')
        }
        connection.release()
        return
      })
    }
  })
}
function reservRoom (req, res) {
  var resrvData = req.body
  var rentId
  var qArray = []
  getMaxId().then(function (max) {
    rentId = parseInt(max || '0', 10)
    rentId++
    return insertRent(rentId, resrvData)
  }).then(function (result) {
    console.log(result)
    console.log(Object.keys(resrvData.roomId))
    Object.keys(resrvData.roomId).forEach(function (key) {
      console.log(key)
      qArray.push(insertDetail(rentId, resrvData.roomId[key], resrvData))
      console.log(key)
    })
    Q.all(qArray).then(function (result) {
      console.log(result)
      res.send(result)
    }).catch(function (err) {
      res.status(500).send(err)
      console.log(err)
    })
  })
}
function getMaxId () {
  var defer = Q.defer()
  pool.getConnection(function (err, connection) {
    if (err) {
      defer.reject(err)
    } else {
      var sql = 'select MAX(Crent) as num FROM rent'
      connection.query(sql, function (err, rows) {
        if (err) {
          defer.reject(err)
        } else {
          var maxId = rows[0].num
          defer.resolve(maxId)
        }
        connection.release()
      })
    }
  })
  return defer.promise
}
function insertRent (rentId, insertData) {
  var defer = Q.defer()
  pool.getConnection(function (err, connection) {
    if (err) {
      defer.reject(err)
    } else {
      var sql = "INSERT INTO rent (`Crent`,`Statusrent`,`Srent`,`Booking`,`rent_date`) VALUES ('" + rentId + "','" + insertData.status + "','" + insertData.srent + "','" + insertData.user + "','" + insertData.rentDate + "')"
      connection.query(sql, function (err, rows) {
        console.log(sql)
        if (err) {
          err.line = 66
          defer.reject(err)
        } else {
          defer.resolve(rows)
        }
        connection.release()
      })
    }
  })
  return defer.promise
}
function insertDetail (rentId, roomId, insertData) {
  var defer = Q.defer()
  pool.getConnection(function (err, connection) {
    if (err) {
      defer.reject(err)
    } else {
      var sql = "INSERT INTO `detail`(`room_detail_id`, `Crent`, `Datein`, `Dateout`) VALUES ('" + roomId + "','" + rentId + "','" + insertData.inDate + "','" + insertData.outDate + "')"
      connection.query(sql, function (err, rows) {
        if (err) {
          err.line = 87
          defer.reject(err)
        } else {
          defer.resolve(rows)
        }
        connection.release()
      })
    }
  })
  return defer.promise
}
function getReserved (req, res) {
  var inDate = req.query.inDate
  var outDate = req.query.outDate
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    var sql = "SELECT `room_detail_id` FROM `detail` NATURAL JOIN `rent` where ('" + inDate + "'BETWEEN detail.Datein AND detail.Dateout OR '" + outDate + "' BETWEEN detail.Datein AND detail.Dateout OR detail.Datein BETWEEN '" + inDate + "' AND '" + outDate + "'OR detail.Dateout BETWEEN '" + inDate + "' AND '" + outDate + "') AND rent.Statusrent < 3"
    console.log(sql)
    connection.query(sql, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.log(err)
        return
      }
      var rowsReserved = []
      rows.forEach(function (value) {
        console.log(value)
        rowsReserved.push(value['room_detail_id'])
      })
      getRoom(rowsReserved, res)
      connection.release()
    })
  })
}
function getRoom (param, res) {
  var respone = {}
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    if (param.length !== 0) {
      var sql = 'SELECT * FROM `room` NATURAL JOIN `room_detail` WHERE room_detail.room_detail_id NOT in(' + param + ')'
    } else {
      var sql = 'SELECT * FROM `room` NATURAL JOIN `room_detail`'
    }
    connection.query(sql, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      }
      rows.forEach(function (value) {
        if (!respone[value.Nroom]) {
          respone[value.Nroom] = {}
          respone[value.Nroom]['Type'] = value.Type
        }
        if (!respone[value.Nroom][value.room_rate]) {
          respone[value.Nroom][value.room_rate] = []
        }
        respone[value.Nroom][value.room_rate].push({
          'room_detail_id': value.room_detail_id,
          'room_color': value.room_color,
          'room_rate': value.room_rate,
          'price': value.price
        })
      })
      res.send(respone)
      connection.release()
    })
  })
}
function getMember (req, res) {
  var id = req.query.id
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    connection.query('SELECT Name,Surname,Username  FROM member where Userid=' + id, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })
}
function getUserRent (req, res) {
  var id = req.query.id
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    var sql = 'SELECT * FROM rent join detail NATURAL JOIN room_detail NATURAL JOIN room NATURAL JOIN member  where Booking=' + id + ' and rent.crent=detail.crent AND rent.Booking = member.Userid order by rent_date'
    var a = connection.query(sql, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      }
      res.send(rows)
      connection.release()
    })
    console.log(a.sql)
  })
}
function getStaffRent (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    var sql = 'SELECT * FROM rent join detail NATURAL JOIN room_detail NATURAL JOIN room NATURAL JOIN member  where rent.crent=detail.crent AND rent.Booking = member.Userid order by rent_date'
    connection.query(sql, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })
}
function getRoomRent (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    connection.query('SELECT *  FROM detail join room where room.nroom=detail.nroom', function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })
}
function login (req, res) {
  var param = req.body
  const hash = crypto.createHash('sha256')
  hash.update(param.pass)
  var pass = hash.digest('hex')
  console.log(pass)
  var query = 'SELECT * FROM member where username="' + param.user + '" and pass="' + pass + '"'
  console.log(query)
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      console.error(err)
      return
    }
    connection.query(query, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.error(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })
}
