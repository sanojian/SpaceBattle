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

			this.velocity = new Crafty.math.Vector2D(vel.x + 0.5  - 1*Math.random(), vel.y + 0.5 - 1*Math.random());

			this.delay(function() {
				this.destroy();
			}, 1000 + 500*Math.random());

			return this;
		}
	});

}