function initCrafty_Fx() {
	Crafty.c('Exhaust', {
		Exhaust: function () {
			this.requires('2D, ' + RENDERING_MODE + ', exhaust, Delay')
				.attr({
					z: 80
				})

			this.visible = false;
			return this;
		},
		show: function (x, y) {
			this.attr({
				x: x,
				y: y
			})
			this.visible = true;
			var self = this;
			this.delay(function () {
				self.visible = false;
			}, 1000);
		}
	});
}