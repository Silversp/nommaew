var mysql = require('mysql')
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'resort'
})
module.exports = {
	getReserved:getReserved,
  getMember: getMember,
  getUserRent: getUserRent,
  login: login,
  getStaffRent: getStaffRent,
  getRoomRent: getRoomRent
}
function getReserved(req, res){
	var respone = {}
	var date = req.query.date
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      return
    }
    connection.query('SELECT `room_detail_id` FROM `detail` where \''+date+'\' BETWEEN detail.Datein AND detail.Dateout', function (err, rows) {
      if (err) {
        res.status(500).send(err)
        console.log(err)
        return
      }
      var rowsReserved = []
      rows.forEach(function(value){
      	console.log(value)
      	rowsReserved.push(value['room_detail_id'])
      })
      getRoom(rowsReserved,res)
      connection.release()
    })
  })
}
function getRoom (param,res) {
	var respone = {}
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send(err)
      return
    }
    if(param.length !== 0){
    	var sql='SELECT * FROM `room` NATURAL JOIN `room_detail` WHERE room_detail.room_detail_id NOT in('+param+')'
    }
    else{
    	var sql='SELECT * FROM `room` NATURAL JOIN `room_detail`'
    }
    connection.query(sql, function (err, rows) {
      if (err) {
        res.status(500).send(err)
        return
      }
      rows.forEach(function(value){
      	if(!respone[value.Nroom]){
      		respone[value.Nroom] = {}
      		respone[value.Nroom]['Type'] = value.Type
      	}
      	if(!respone[value.Nroom][value.room_rate]){
    			respone[value.Nroom][value.room_rate] = []
    		}
      	respone[value.Nroom][value.room_rate].push({
      		'room_detail_id' : value.room_detail_id,
      		'room_color' : value.room_color,
      		'room_rate' : value.room_rate,
      		'price' : value.price
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
  var query = 'SELECT username FROM member where username="' + param.user + '" and pass="' + param.pass + '"'
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
