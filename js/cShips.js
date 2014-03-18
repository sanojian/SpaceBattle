function initCrafty_Ships() {

	Crafty.c('Ship', {
		maxSpeed: 6,
		readyToFire: true,

		Ship: function (x, y, type, faction) {
			this.requires('2D, ' + RENDERING_MODE + ', Collision, Delay, solid, ' + type + ',' + faction)
				.attr({
					x: x,
					y: y,
					z: 100
				})
				.collision()
				.bind('EnterFrame', function (frameObj) {
					var speed = this.velocity.magnitude();
					if (speed > this.maxSpeed) {
						this.velocity = this.velocity.scale(this.maxSpeed / speed);
					}
					var from = { x: this.x, y: this.y };
					this.attr({
						x: this.x + this.velocity.x,
						y: this.y + this.velocity.y
					});
					this.trigger('Moved', from);
					if (this.shield && frameObj.frame % 10 == 0) {
						this.shield.alpha = 1 * this.shieldPart.power / 100;
					}
				})
				.origin('center')


			this.velocity = new Crafty.math.Vector2D(0, 0);
			this.direction = new Crafty.math.Vector2D(0, 0);
			this.turn(0);
			this.hitPoints = 3;
			this.maxHitPoints = 3;

			return this;
		},
		addShield: function (part) {
			this.shield = Crafty.e('2D, ' + RENDERING_MODE + ', shield')
				.attr({
					x: this.x + this.w / 2 - 16 * 3 / 2,
					y: this.y + this.h / 2 - 16 * 3 / 2,
					z: 100,
					alpha: 0.5
				});
			this.attach(this.shield);
			this.shieldPart = part;
		},
		removeShield: function () {
			this.detach(this.shield);
			this.shield.destroy();
			this.shieldPart = undefined;
			this.shield = undefined;
		},
		turn: function (amt) {
			this.rotation = (this.rotation + amt) % 360;
			var vY = 1 * Math.sin(this.rotation * Math.PI / 180);
			var vX = 1 * Math.cos(this.rotation * Math.PI / 180);
			this.direction.setValues(vX, vY);
		},
		setVelocity: function(dir, vel) {
			this.direction = dir;
			this.velocity = new Crafty.math.Vector2D(vel.x, vel.y);
			var rads = Math.atan2(dir.y, dir.x);
			this.rotation = (rads * 180/Math.PI) % 360;
		},
		takeDamage: function (amt) {
			if (this.shield && this.shieldPart.power > 20) {
				this.shieldPart.changePower(-amt * 20);
			} else {
				this.hitPoints = Math.max(0, this.hitPoints - amt);
				for (var i = 0; i < 2; i++) {
					g_game.collideEffects.getNextEffect().show(this.x, this.y);
				}
				if (this.hitPoints <= 0) {
					for (var i = 0; i < 3; i++) {
						g_game.collideEffects.getNextEffect().show(this.x, this.y);
					}
					Crafty.e('SpaceLoot').SpaceLoot(this.x, this.y, this.velocity);
					this.destroy();
				}
			}
		},
		fireCannon: function() {
			if (this.readyToFire) {
				this.readyToFire = false;
				Crafty.e('Bullet').Bullet(this.x, this.y, this.direction, this.velocity, this[0], {sprite: 'plasma'})
				var self = this;
				this.delay(function() {
					this.readyToFire = true;
				}, 250);
			}
		}
	});

	Crafty.c('PlayerShip', {

		PlayerShip: function (x, y) {
			this.requires('Keyboard, Ship')
				.Ship(x, y, 'ship', 'faction1')
				.bind('EnterFrame', function (frameObj) {
					if (this.isDown(Crafty.keys.UP_ARROW) || this.isDown(Crafty.keys.W)) {
						this.velocity.add(new Crafty.math.Vector2D(this.direction.x * 0.05, this.direction.y * 0.05));
						if (frameObj.frame % 10 == 0) {
							g_game.exhaustEffects.getNextEffect().show(this.x + this.w / 2, this.y + this.h / 2);
						}
						//if (g_game.sounds.engine.isPaused()) {
						//	g_game.sounds.engine.play();
						//}
					}
					//else if (!g_game.sounds.engine.isPaused()) {
					//	g_game.sounds.engine.pause();
					//}
					if (this.isDown(Crafty.keys.LEFT_ARROW) || this.isDown(Crafty.keys.A)) {
						this.turn(-4);
					}
					if (this.isDown(Crafty.keys.RIGHT_ARROW) || this.isDown(Crafty.keys.D)) {
						this.turn(4);
					}
					if (this.isDown(Crafty.keys.SPACE)) {
						/*for (var i=0;i<this.shipConfiguration.weapon.length;i++) {
							if (this.shipConfiguration.weapon[i].readyToUse && this.shipConfiguration.weapon[i].power >= 20) {
								this.shipConfiguration.weapon[i].fire(this.x, this.y, this.direction, this[0], 2);
							}
						}*/
						this.fireCannon();
					}


					//if (frameObj.frame % 10 == 0) {
					//	for (var i = 0; i < g_game.shipSlots.length; i++) {
					//		g_game.shipSlots[i].tick();
					//	}
					//}

					g_game.$stage.css('background-position', '' + Math.floor(-this.x / 4) + 'px ' + Math.floor(-this.y / 4) + 'px');
					updateMiniMap();
				})
				.bind('Moved', function(from) {
					//if (g_game.cDialogBox.currentlyWriting) {
					//	positionDialogBox();
					//}
				})

			/*g_game.$stage.bind('mousedown', function(evt) {
				var pos = $(this).offset();
				var craftyX = evt.offsetX || evt.pageX - pos.left;
				var craftyY = evt.offsetY || evt.pageY - pos.top;

				var dx = craftyX - g_game.player.x - Crafty.viewport.x;
				var dy = craftyY - g_game.player.y - Crafty.viewport.y;
				var direction = new Crafty.math.Vector2D(dx, dy).scaleToMagnitude(1);
				//g_game.sounds.shoot.play();
				Crafty.e('Bullet').Bullet(g_game.player.x, g_game.player.y, direction, g_game.player[0], {sprite: 'pellet'});
			});*/

			return this;
		},
		reconfigureShip: function() {
			this.shipConfiguration = {
				weapon: [],
				shield: [],
				battery: []
			}
			for (var i = 0; i < g_game.shipSlots.length; i++) {
				if (g_game.shipSlots[i].part) {
					this.shipConfiguration[g_game.shipSlots[i].part.type].push(g_game.shipSlots[i].part);
				}
			}
		}
	});

	Crafty.c('Bullet', {
		range: 1000,
		speed: 10,

		Bullet: function (x, y, dir, vel, sourceId, def) {
			this.requires('2D, ' + RENDERING_MODE + ', Collision, ' + def.sprite)
				.attr({
					x: x,
					y: y,
					z: 100
				})
				.collision()
				.bind('EnterFrame', function (frameObj) {
					this.attr({
						x: this.x + this.velocity.x,
						y: this.y + this.velocity.y
					});
					this.travelled += Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
					var hits = this.hit('solid');
					if (hits) {
						if (hits[0].obj[0] != sourceId) {
							if (hits[0].obj.has('Ship')) {
								hits[0].obj.takeDamage(def.damage);
							}
							else if (hits[0].obj.has('Mob')) {
								hits[0].obj.takeDamage(def.damage);
							}
							g_game.sounds[def.sound_hit].play();
							this.destroy();
							return;
						}
					}
					if (this.travelled > this.range) {
						this.destroy();
					}
				})

			this.velocity = new Crafty.math.Vector2D(vel.x + dir.x * this.speed, vel.y + dir.y * this.speed);
			this.travelled = 0;

			//g_game.sounds[def.sound_shoot].play();
			return this;
		}
	});


}