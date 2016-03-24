var mysql = require('mysql')
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
  getRoomRent: getRoomRent
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
      return
    }
    var sql = "SELECT `room_detail_id` FROM `detail` NATURAL JOIN `rent` where '" + inDate + "'BETWEEN detail.Datein AND detail.Dateout OR '" + outDate + "' BETWEEN detail.Datein AND detail.Dateout OR detail.Datein BETWEEN '" + inDate + "' AND '" + outDate + "'OR detail.Dateout BETWEEN '" + inDate + "' AND '" + outDate + "'AND rent.Statusrent < 3"
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
      return
    }
    connection.query('SELECT Name,Surname,Username  FROM member where Userid=' + id, function (err, rows) {
      if (err) {
        res.status(500).send(err)
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
      return
    }
    connection.query('SELECT *  FROM rent join detail  where Booking=' + id + ' and rent.crent=detail.crent', function (err, rows) {
      if (err) {
        res.status(500).send(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })

}
function getStaffRent (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      return
    }
    connection.query('SELECT *  FROM rent join detail  where  rent.crent=detail.crent', function (err, rows) {
      if (err) {
        res.status(500).send(err)
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
      return
    }
    connection.query('SELECT *  FROM detail join room where room.nroom=detail.nroom', function (err, rows) {
      if (err) {
        res.status(500).send(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })
}
function login (req, res) {
  var param = req.body
  var query = 'SELECT `Userid`, `Username`, `Usertype` FROM member where username="' + param.user + '" and pass="' + param.pass + '"'
  console.log(query)
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      return
    }
    connection.query(query, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        return
      }
      res.send(rows)
      connection.release()
    })
  })
}
