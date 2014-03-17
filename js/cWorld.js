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

}