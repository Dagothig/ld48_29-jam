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
	['game'],
	function(Game) {
		game = new Game(document.getElementById('game-container'));
	}
);