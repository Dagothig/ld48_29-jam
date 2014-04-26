'use strict';

define(['pixi', 'game/actor', 'game/tiled-texture', 'game/tiled-sprite'],
	function(pixi, Actor, TiledTexture, TiledSprite) {
		return Object.define(
			Actor,
			function Player(map) {
				var self = this;
				this.lineOfSight = 6;
				this._map = map;
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
					}
				};

				var texture = new TiledTexture(pixi.getTexture('img-player'), 24, 24);
				var sprite = new TiledSprite(texture);
				Actor.call(self, sprite);
			}, {
				get position() {
					return this._position;
				},
				set position(val) {
					this._position.x = val.x;
					this._position.y = val.y;
				}
			}
		);
	}
);
