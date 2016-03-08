var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'resort'
});
 module.exports = {
 	getRoom:getRoom,
 	getMember:getMember,
 	getUserRent:getUserRent,
 	login:login,
 	getStaffRent:getStaffRent,
    getRoomRent:getRoomRent
 }
function getRoom (req,res){
	pool.getConnection(function(err, connection) {
		if (err)
		{
			res.status(500).send(err)
			return
		}
 		connection.query( 'SELECT * FROM room', function(err, rows) {
 			if (err)
		{
			res.status(500).send(err)
			return
		}
		res.send(rows)
     		connection.release();
 		});
	});
}
function getMember (req,res){
	var id=req.query.id
	pool.getConnection(function(err, connection) {
		if (err)
		{
			res.status(500).send(err)
			return
		}
 		connection.query( 'SELECT Name,Surname,Username  FROM member where Userid='+id, function(err, rows) {
 			if (err)
		{
			res.status(500).send(err)
			return
		}
		res.send(rows)
     		connection.release();
 		});
	});
}
function getUserRent (req,res){
	var id=req.query.id
	pool.getConnection(function(err, connection) {
		if (err)
		{
			res.status(500).send(err)
			return
		}
 		connection.query( 'SELECT *  FROM rent join detail  where Booking='+id+' and rent.crent=detail.crent', function(err, rows) {
 			if (err)
		{
			res.status(500).send(err)
			return
		}
		res.send(rows)
     		connection.release();
 		});
	});

}
function getStaffRent (req,res){
	
	pool.getConnection(function(err, connection) {
		if (err)
		{
			res.status(500).send(err)
			return
		}
 		connection.query( 'SELECT *  FROM rent join detail  where  rent.crent=detail.crent', function(err, rows) {
 			if (err)
		{
			res.status(500).send(err)
			return
		}
		res.send(rows)
     		connection.release();
 		});
	});
}
function getRoomRent (req,res){
	
	pool.getConnection(function(err, connection) {
		if (err)
		{
			res.status(500).send(err)
			return
		}
 		connection.query( 'SELECT *  FROM detail join room where room.nroom=detail.nroom', function(err, rows) {
 			if (err)
		{
			res.status(500).send(err)
			return
		}
		res.send(rows)
     		connection.release();
 		});
	});
}
 function login (req,res){
 	var param=req.body
 	var query = 'SELECT * FROM member where username="'+param.user+'" and pass="'+param.pass+'"'
 	console.log(query)
 	pool.getConnection(function(err, connection) {
		if (err)
		{
			res.status(500).send(err)
			return
		}
 		connection.query( query, function(err, rows) {
 			if (err)
		{
			res.status(500).send(err)
			return
		}
		res.send(rows)
     		connection.release();
 		});
	});
 }
