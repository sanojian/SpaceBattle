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
	players.push({ id: id, x: 0, y: 0 });
	socket.on('updateLoc', function (data) {
		players[id].x = data.x;
		players[id].y = data.y;
		players[id].direction = data.direction;
		players[id].velocity = data.velocity;
		socket.broadcast.emit('loc', players[id]);
	});
});

