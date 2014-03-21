function initCrafty_Ships() {

	Crafty.c('Ship', {
		maxSpeed: 4,
		readyToFire: true,

		Ship: function (x, y, type, faction) {
			this.requires('2D, ' + RENDERING_MODE + ', Collision, Delay, solid, faction' + faction + ', ' + type)
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

			for (var i=1;i<=3;i++) {
				if (i != faction) {
					this.addComponent('notFaction' + i);
				}
			}

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
		}
	});

	Crafty.c('PlayerShip', {
		hp: 3,
		maxHealth: 3,

		PlayerShip: function (x, y) {
			this.requires('Keyboard, Ship')
				.Ship(x, y, 'ship', 1)
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

					if (frameObj.frame % 10 == 0) {
						g_game.socket.emit('updateLoc', { id: g_game.playerId, x: g_game.player.x, y: g_game.player.y, direction: g_game.player.direction, velocity: { x: g_game.player.velocity.x, y : g_game.player.velocity.y }});
					};

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
		},
		changeAttrib: function(data) {
			this.hp = data.hp;
			showHealth(this.hp, this.maxHealth);
		},
		fireCannon: function() {
			if (this.readyToFire) {
				this.readyToFire = false;
				var bulletId = g_game.getNextBulletId();
				Crafty.e('MyBullet').MyBullet(this.x, this.y, this.direction, this.velocity, this[0], g_game.playerId, {sprite: 'plasma'}).bulletId = bulletId;
				g_game.socket.emit('fire', {
					ownerId: g_game.playerId,
					x: this.x,
					y: this.y,
					bulletId: bulletId,
					direction: this.direction,
					velocity: { x: this.velocity.x, y : this.velocity.y }
				});
				var self = this;
				this.delay(function() {
					this.readyToFire = true;
				}, 250);
			}
		}
	});

	Crafty.c('AIShip', {
		maxSpeed: 3,

		AIShip: function (x, y, type, faction, home) {
			this.requires('Ship')
				.Ship(x, y, type, faction)
				.bind('EnterFrame', function (frameObj) {
					var enemies = Crafty('notFaction' + faction);
					var bEnemyFound = false;
					for (var i=0;!bEnemyFound && i<enemies.length;i++) {

						var target = Crafty(enemies[0]);
						// turn towards enemy
						var dx = target.x - this.x;
						var dy = target.y - this.y;
						var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
						if (dist < 1200) {
							bEnemyFound = true;
							this.chaseTarget(target, frameObj);
							var angleToTarget = Math.atan2(dy, dx);
							var rotationRads = this.rotation * Math.PI / 180;
							var angleDiff = rotationRads - angleToTarget;
							angleDiff = (angleDiff + Math.PI) % (Math.PI * 2) - Math.PI;
							// fire?
							if (Math.abs(angleDiff) < Math.PI / 4 && this.readyToFire) {
								this.fireCannon();
							}
						}
					}
					if (!bEnemyFound) {
						// go home
						this.chaseTarget(home, frameObj);
					}

					if (frameObj.frame % 11 == 0) {
						g_game.socket.emit('updateLoc', { id: g_game.enemyId, x: this.x, y: this.y, direction: this.direction, velocity: { x: this.velocity.x, y : this.velocity.y }});
					};

				})

			return this;
		},
		chaseTarget: function(target, frameObj) {
			// turn towards enemy
			var dx = target.x - this.x;
			var dy = target.y - this.y;
			var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			var angleToTarget = Math.atan2(dy, dx);
			var rotationRads = this.rotation * Math.PI / 180;
			var angleDiff = rotationRads - angleToTarget;
			angleDiff = (angleDiff + Math.PI) % (Math.PI * 2) - Math.PI;
			if (angleDiff < 0) {
				this.turn(1);
			} else if (angleDiff > 0) {
				this.turn(-1);
			}
			// chase?
			if (Math.abs(angleDiff) < Math.PI / 4 && dist > 200) {
				this.velocity.add(new Crafty.math.Vector2D(this.direction.x * 0.02, this.direction.y * 0.02));
				if (frameObj.frame % 10 == 0) {
					g_game.exhaustEffects.getNextEffect().show(this.x + this.w / 2, this.y + this.h / 2);
				}
			}

		},
		changeAttrib: function(data) {
			this.hp = data.hp;
		},
		fireCannon: function() {
			if (this.readyToFire) {
				this.readyToFire = false;
				var bulletId = g_game.getNextBulletId();
				Crafty.e('MyBullet').MyBullet(this.x, this.y, this.direction, new Crafty.math.Vector2D(0, 0), this[0], g_game.enemyId, {sprite: 'plasma'}).bulletId = bulletId;
				g_game.socket.emit('fire', {
					ownerId: g_game.enemyId,
					x: this.x,
					y: this.y,
					bulletId: bulletId,
					direction: this.direction,
					velocity: { x: this.velocity.x, y : this.velocity.y }
				});
				var self = this;
				this.delay(function() {
					this.readyToFire = true;
				}, 500);
			}
		}
	});


}