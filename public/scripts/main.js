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
		
		var text = pixi.Texture.fromImage("bomb.png");
		text.baseTexture.addEventListener('loaded', function() {
			var tt = new TiledTexture(text, 12, 16);
			var bomb = new AnimatedSprite(tt, 10, true);

			act = new Actor(bomb);
			game.currentState.map.addActor(act);
		});
	}
);