'use strict';

require.config({
	shim: {
		'pixi': {
			exports: 'PIXI'
		},
		'io': {
			exports: 'io'
		}
	},
	paths: {
		pixi: 'libs/pixi',
		io: '/socket.io/socket.io.js'
	}
});
var game;
define(
	['pixi', 'game'],
	function(pixi, Game) {
		var textures = {};
		pixi.getTexture = function(imageId) {
			if (textures[imageId])
				return textures[imageId];

			var img = document.getElementById(imageId);
			var text = new pixi.BaseTexture(img);
			textures[imageId] = text;
			return text;
		}
		pixi.scaleModes.DEFAULT = pixi.scaleModes.NEAREST;

		game = new Game(document.getElementById('game-container'));
	}
);