'use strict';

define(['pixi', 'game/actor', 'game/tiled-texture', 'game/tiled-sprite'],
	function(pixi, Actor, TiledTexture, TiledSprite) {
		return Object.define(
			Actor,
			function Player(map, filename, tileW, tileH) {
				var self = this;
				this.items = [];

				var texture = new TiledTexture(pixi.getTexture(filename || 'img-player'), tileW || 24, tileH || 24);
				var sprite = new TiledSprite(texture);
				Actor.call(self, sprite, map);
			}, {
			}
		);
	}
);
