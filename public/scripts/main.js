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
var game, PIXI, act;
define(
	['io', 'game', 'pixi', 'game/actor', 'game/tiled-texture', 'game/animated-sprite'],
	function(io, Game, pixi, Actor, TiledTexture, AnimatedSprite) {
		var socket = io.connect('/');
		socket.on('map', function(data) {
			//console.log(data);
		});

		socket.on('display', function(data) {
			//console.log(data);
		});

		socket.on('update', function(data) {
			//console.log(data);
		});

		PIXI = pixi;
		game = new Game(document.getElementById('game-container'));
	}
);