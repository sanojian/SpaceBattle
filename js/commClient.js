function Comm() {

	this.connect = function() {
		g_game.socket = io.connect('http://localhost:3000');

		g_game.socket.on('my_id', function(data) {
			g_game.playerId = data.id;
		})

		g_game.socket.on('loc', function (data) {

			var ships = Crafty('shipId_' + data.id);
			if (ships.length == 0) {
				Crafty.e('Ship, shipId_' + data.id).Ship(data.x, data.y, 'ship2', 'faction2').shipId = data.id;
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
			g_game.player.changeAttrib(data);
		});

		g_game.socket.on('die', function(data) {
			if (data.playerId == g_game.playerId) {
				g_game.player.destroy();
			}
			else {
				var ships = Crafty('shipId_' + data.playerId);
				Crafty(ships[0]).destroy();
			}
		});

	}
}