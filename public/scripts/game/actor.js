'use strict';

define(
	function() {
		return Object.define(
			function Actor(sprite) {
				this.zOrder = 0;
				this.sprite = sprite;
			}, {
				update: function(delta) {
					if (this.sprite && this.sprite.update)
						this.sprite.update(delta);
				},

				remove: function() {
					this.shouldBeRemoved = true;
				},

				get zOrder() {
					return this._zOrder;
				},
				set zOrder(val) {
					this._zOrder = val;
					this.needsZUpdate = true;
				},

				get position() {
					return this.sprite.position;
				},
				set position(val) {
					this.sprite.position = val;
				}
			}
		);
	}
);
