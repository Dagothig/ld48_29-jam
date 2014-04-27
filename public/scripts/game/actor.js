'use strict';

define(['pixi', 'game/tiled-texture', 'game/animated-sprite'],
	function(pixi, TiledTexture, AnimatedSprite) {
		var Actor = Object.define(
			function Actor(sprite, map) {
				var self = this;
				this.zOrder = 0;
				this.sprite = sprite;
				this._position = {
					get x() {
						return self.sprite.position.x / (map.tileSize)
					},
					set x(val) {
						self.sprite.position.x = val * (map.tileSize);
					},
					get y() {
						return self.sprite.position.y / (map.tileSize)
					},
					set y(val) {
						self.sprite.position.y = val * (map.tileSize);
					},
				};
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
					return this._position;
				},
				set position(val) {
					this._position.x = val.x;
					this._position.y = val.y;
				}
			}
		);
		Actor.fromAnimated = function(fileName, animatedProps, map) {
			var texture = new TiledTexture(pixi.getTexture(fileName), 24, 24);
			var sprite = new AnimatedSprite(texture, animatedProps.fps, animatedProps.loop);
			return new Actor(sprite, map);
		};

		return Actor;
	}
);
