/*
 // send to current request socket client
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.sockets.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.sockets.in('game').emit('message', 'cool game');

 // sending to individual socketid
 io.sockets.socket(socketid).emit('message', 'for your eyes only');

 */

function Comm() {

	this.connect = function() {
		g_game.socket = io.connect('http://localhost:3000');

		g_game.socket.on('my_id', function(data) {
			g_game.playerId = data.id;
			g_game.enemyId = data.enemyId;

			g_game.enemyShip = Crafty.e('AIShip').AIShip(500, 100, 'ship2', 3, g_game.planets[0]);
			g_game.player.shipId = g_game.playerId;
			g_game.enemyShip.shipId = g_game.enemyId;
		});

		g_game.socket.on('loc', function (data) {

			var ships = Crafty('shipId_' + data.id);
			if (ships.length == 0) {
				Crafty.e('Ship, shipId_' + data.id).Ship(data.x, data.y, 'ship3', 2).shipId = data.id;
			}
			else {
				Crafty(ships[0]).attr({ x: data.x, y: data.y }).setVelocity(data.direction, data.velocity);
			}
		});

		g_game.socket.on('bullet', function(data) {
			g_game.bullets[data.ownerId * 1000 + data.bulletId] = Crafty.e('Bullet').Bullet(data.x, data.y, data.direction, data.velocity, {sprite: 'plasma'});
		});

		g_game.socket.on('bullet_hit', function(data) {
			g_game.bullets[data.ownerId * 1000 + data.bulletId].destroy();
		});

		g_game.socket.on('change', function(data) {
			if (data.id == g_game.playerId) {
				g_game.player.changeAttrib(data);
			}
			else {
				g_game.enemyShip.changeAttrib(data);
			}
		});

		g_game.socket.on('die', function(data) {
			if (data.playerId == g_game.playerId) {
				g_game.player.destroy();
			}
			else if (data.playerId == g_game.enemyId) {
				g_game.enemyShip.destroy();
			}
			else {
				var ships = Crafty('shipId_' + data.playerId);
				Crafty(ships[0]).destroy();
			}
		});

	}
}