function initCrafty_World() {

	Crafty.c('Planet', {

		Planet: function (x, y, type, map) {
			this.requires('2D, ' + RENDERING_MODE + ', Collision, ' + type)
				.attr({	x: x, y: y,	z: 60 })
				.collision([this.w/2-this.w/4, this.h/2-this.w/4], [this.w/2+this.w/4, this.h/2-this.w/4], [this.w/2+this.w/4, this.h/2+this.w/4], [this.w/2-this.w/4, this.h/2+this.w/4])

			this.planetMap = map;

			return this;
		}
	});

	Crafty.c('Debris', {

		Debris: function (x, y, vel) {
			this.requires('2D, ' + RENDERING_MODE + ', debris, Delay')
				.attr({	x: x, y: y,	z: 60 })
				.bind('EnterFrame', function() {
					this.attr({
						x: this.x + this.velocity.x,
						y: this.y + this.velocity.y
					});

				})

			var vel = vel || { x: 0, y: 0 };

			this.velocity = new Crafty.math.Vector2D(vel.x + 0.1  - 0.2*Math.random(), vel.y + 0.1 -0.2*Math.random());

			this.delay(function() {
				this.destroy();
			}, 1000 + 500*Math.random());

			return this;
		}
	});

	Crafty.c('Satellite', {

		Satellite: function (x, y) {
			this.requires('2D, ' + RENDERING_MODE + ', shield, Collision, solid')
				.attr({ x: x, y: y })
				.collision();

			return this;
		}
	});

	Crafty.c('MyBullet', {
		MyBullet: function (x, y, dir, vel, sourceId, ownerId, def) {
			this.requires('Bullet, Collision')
				.Bullet(x, y, dir, vel, def)
				.collision()
				.bind('EnterFrame', function (frameObj) {
					var hits = this.hit('solid');
					if (hits) {
						if (hits[0].obj[0] != sourceId) {
							//if (hits[0].obj.has('Ship')) {
							//	hits[0].obj.takeDamage(def.damage);
							//}
							//g_game.sounds[def.sound_hit].play();
							g_game.socket.emit('hit', { ownerId: ownerId, bulletId: this.bulletId, shipId: hits[0].obj.shipId });
							Crafty.e('Debris').Debris(this.x, this.y, hits[0].obj.velocity);
							this.destroy();
							return;
						}
					}
				});

			return this;
		}

	});

	Crafty.c('Bullet', {
		range: 1000,
		speed: 10,

		Bullet: function (x, y, dir, vel, def) {
			this.requires('2D, ' + RENDERING_MODE + ', ' + def.sprite)
				.attr({
					x: x,
					y: y,
					z: 100
				})
				.bind('EnterFrame', function (frameObj) {
					this.attr({
						x: this.x + this.velocity.x,
						y: this.y + this.velocity.y
					});
					this.travelled += Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
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