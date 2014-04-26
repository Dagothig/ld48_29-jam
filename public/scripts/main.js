'use strict';

require.config({
	shim: {
		'pixi': {
			exports: 'PIXI'
		}
	},
	paths: {
		pixi: 'libs/pixi'
	}
});
var game, PIXI, act;
define(
	['game', 'pixi', 'game/actor', 'game/tiled-texture', 'game/animated-sprite'],
	function(Game, pixi, Actor, TiledTexture, AnimatedSprite) {
		PIXI = pixi;
		game = new Game(document.getElementById('game-container'));
	}
);