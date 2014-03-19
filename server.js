var express = require('express');
var path = require('path');
var http = require('http');
var socketio = require('socket.io');

var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/battle', function(req, res) {
	res.sendfile("client/battle.html");
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));

});

var io = socketio.listen(server, { log: false });

var players = [];

io.sockets.on('connection', function (socket) {
	var id = players.length;
	players.push({ id: id, x: 0, y: 0, hp: 3, socket: socket });

	socket.emit('my_id', { id: id });

	socket.on('updateLoc', function (data) {
		data.id = id;
		players[id].x = data.x;
		players[id].y = data.y;
		players[id].direction = data.direction;
		players[id].velocity = data.velocity;
		socket.broadcast.emit('loc', data);
	});

	socket.on('fire', function (data) {
		data.ownerId = id;
		socket.broadcast.emit('bullet', data);
	});

	socket.on('hit', function (data) {
		data.ownerId = id;
		socket.broadcast.emit('bullet_hit', data);
		players[data.shipId].hp -= 1;
		players[data.shipId].socket.emit('change', { hp: players[data.shipId].hp });
		if (players[data.shipId].hp <= 0) {
			io.sockets.emit('die', { playerId: data.shipId });
		}
	});

});

