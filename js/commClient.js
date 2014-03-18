function Comm() {

	this.connect = function() {
		g_game.socket = io.connect('http://localhost:3000');

		g_game.socket.on('loc', function (data) {

			var ships = Crafty('shipId_' + data.id);
			if (ships.length == 0) {
				Crafty.e('Ship, shipId_' + data.id).Ship(data.x, data.y, 'ship2', 'faction2')
			}
			else {
				Crafty(ships[0]).attr({ x: data.x, y: data.y }).setVelocity(data.direction, data.velocity);
			}
		});
	}
}