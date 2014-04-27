'use strict';

define(['pixi', 'game/actor', 'game/tiled-texture', 'game/tiled-sprite'],
	function(pixi, Actor, TiledTexture, TiledSprite) {
		return Object.define(
			Actor,
			function Player(map, filename) {
				var self = this;
				this.items = [];

				var texture = new TiledTexture(pixi.getTexture(filename || 'img-player'), 24, 24);
				var sprite = new TiledSprite(texture);
				Actor.call(self, sprite, map);
			}, {
			}
		);
	}
);
