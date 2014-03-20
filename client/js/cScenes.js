function initCrafty_Scenes() {


	Crafty.scene('space', function () {
		Crafty.background('url(./images/background.png)');

		g_game.$stage = $('#cr-stage');

		for (var i = 0; i < 20; i++) {
			g_game.exhaustEffects.objArray.push(Crafty.e('Exhaust').Exhaust());
		}

		g_game.planets = [];
		g_game.planets.push(Crafty.e('Planet, planet' + g_game.planets.length).Planet(600, 600, 'planetBig5', 'homePlanet' ));
		g_game.planets.push(Crafty.e('Planet, planet' + g_game.planets.length).Planet(700, 500, 'planetMoon1', 'moon' ));
		//g_game.planets.push(Crafty.e('Planet').Planet(startX - 400, startY + 900, 'planet2' ));
		g_game.planets.push(Crafty.e('Planet, planet' + g_game.planets.length).Planet(1700, 200, 'planetBig6', 'alienPlanet' ));


		g_game.player = Crafty.e('PlayerShip').PlayerShip(100, 100);
		//g_game.player = Crafty.e('Ship').Ship(100, 100, 'ship', 'myFaction');
		Crafty.viewport.clampToEntities = false;
		Crafty.viewport.follow(g_game.player, g_game.player.w / 2, g_game.player.h / 2);

	});

	Crafty.scene("loading", function () {
		Crafty.background("#000");

		Crafty.e('2D, ' + RENDERING_MODE + ', Text').attr({
			w: 800,
			h: 20,
			x: VIEW_WIDTH / 2 - 400,
			y: VIEW_HEIGHT / 2 - 160,
			z: 1000
		})
			.text("Loading...")
			.textColor('#fff', 1)
			.textFont({
				size: "16pt",
				weight: 'bold',
				family: GAME_FONT
			});


		Crafty.load([	'./images/lofi_scifi_v2_x' + ZOOM + '.png'], function() {

			Crafty.sprite(TILE_SIZE, './images/lofi_scifi_v2_x' + ZOOM + '.png', {
				ship: [2 , 34],
				ship2: [10, 34],
				ship3: [14, 34],
				debris: [28, 79]
			});

			Crafty.sprite(1, './images/lofi_scifi_v2_x' + ZOOM + '.png', {
				exhaust: [163 * ZOOM, 612 * ZOOM, 1 * ZOOM, 1 * ZOOM],
				pellet: [7 * TILE_SIZE, 78 * TILE_SIZE, TILE_SIZE, TILE_SIZE],
				plasma: [8 * TILE_SIZE, 78 * TILE_SIZE, TILE_SIZE, TILE_SIZE],

				planetMoon1: [1 * TILE_SIZE, 83 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE],
				planetMoon2: [4 * TILE_SIZE, 83 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE],
				planetMoon3: [7 * TILE_SIZE, 83 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE],
				planetMoon4: [10 * TILE_SIZE, 83 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE],
				planetMoon5: [13 * TILE_SIZE, 83 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE],
				planetMoon6: [16 * TILE_SIZE, 83 * TILE_SIZE, 3 * TILE_SIZE, 3 * TILE_SIZE],
				planetBig1: [0, 86 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE],
				planetBig2: [5 * TILE_SIZE, 86 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE],
				planetBig3: [10 * TILE_SIZE, 86 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE],
				planetBig4: [15 * TILE_SIZE, 86 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE],
				planetBig5: [20 * TILE_SIZE, 86 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE],
				planetBig6: [25 * TILE_SIZE, 86 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE]

			});




				Crafty.scene('space');
		});

	});
}