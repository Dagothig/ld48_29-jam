'use strict';

define(['pixi', 'game/actor', 'game/tiled-texture', 'game/tiled-sprite'],
	function(pixi, Actor, TiledTexture, TiledSprite) {
		return Object.define(
			Actor,
			function Player() {
				// TiledTexture.fromFile('/res/player.png', 1, 1, function(texture) {

				// });
				// sprite = new TiledSprite(texture);
				// Actor.call(this, sprite);
			}, {

			}
		);
	}
);
