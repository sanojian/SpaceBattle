function init_GUI() {
	var pos = $('#cr-stage').offset();

	//$('#divOverlay').css({ width: $('#cr-stage').width(), height: $('#cr-stage').height(), left: pos.left+2, top: pos.top+2 });
	$('#canvasMiniMap').css({
		width: 48 * 3,
		height: 48 * 3,
		left: $('#cr-stage').width() - 48 * 3 - 12,
		top: pos.top + 12
	});

	var drawingCanvas = document.getElementById('canvasMiniMap');
	var context = drawingCanvas.getContext('2d');
	context.scale(2, 1);

}

function showHealth(hp, maxHp) {
	var percent = Math.floor(100*hp/maxHp);
	$('#divHits').css({
		width: '' + percent + '%'
	});
}

function updateMiniMap() {
	var drawingCanvas = document.getElementById('canvasMiniMap');
	var context = drawingCanvas.getContext('2d');

	for (var y = 0; y <= 49; y++) {
		context.fillStyle = y % 2 ? '#394677' : '#4A5B99';
		for (var x = 0; x <= 49; x++) {
			context.fillRect(x * 3, y * 3, 3, 3);
		}
	}

	var shrink = 16;

	// view area
	var w = VIEW_WIDTH / (shrink);
	var h = VIEW_HEIGHT / (shrink);
	var edgeX = 24 * 3 - w/2;
	var edgeY = 24 * 3 - h/2;
	context.lineWidth = 3;
	context.strokeRect(edgeX, edgeY, w, h);

	function fillDot(dotX, dotY, dotW, dotH) {
		// in view area?
		var dx = dotX - g_game.player.x;
		var dy = dotY - g_game.player.y;
		if (Math.abs(dx) <= VIEW_WIDTH/2 && Math.abs(dy) <= VIEW_HEIGHT/2) {
			context.fillRect(24 * 3 + dx / shrink, 24 * 3 + dy / shrink, dotW, dotH);
		}
		else {
			var x = 24 * 3 + dx / shrink;
			var y = 24 * 3 + dy / shrink;
			if (Math.abs(dx) > VIEW_WIDTH/2 && dx < 0) {
				x = edgeX - (Math.abs(dx)/shrink - w/2)/10;
			}
			else if (Math.abs(dx) > VIEW_WIDTH/2 && dx > 0) {
				x = edgeX + w + (Math.abs(dx)/shrink - w/2)/10;
			}
			if (Math.abs(dy) > VIEW_HEIGHT/2 && dy < 0) {
				y = edgeY - (Math.abs(dy)/shrink - h/2)/10;
			}
			else if (Math.abs(dy) > VIEW_HEIGHT/2 && dy > 0) {
				y = edgeY + h + (Math.abs(dy)/shrink - h/2)/10;
			}
			context.fillRect(x, y, dotW, dotH);
		}
	};

	// ships
	context.fillStyle = '#0f0';
	var shipIDs = Crafty('faction1');
	for (var i = 0; i < shipIDs.length; i++) {
		var ship = Crafty(shipIDs[i]);
		fillDot(ship.x, ship.y, 3, 3);
	}

	context.fillStyle = '#f00';
	var shipIDs = Crafty('notFaction1');
	for (var i = 0; i < shipIDs.length; i++) {
		var ship = Crafty(shipIDs[i]);
		fillDot(ship.x, ship.y, 3, 3);
	}

	// player
	context.fillStyle = '#00f';
	context.fillRect(24 * 3, 24 * 3, 3, 3);

	// planets
	context.fillStyle = '#fff';
	var planetIDs = Crafty('Planet');
	for (var i = 0; i < planetIDs.length; i++) {
		var planet = Crafty(planetIDs[i]);
		fillDot(planet.x, planet.y, 6, 6);
	}

}
