'use strict';

var Actor = require('./../actor');

module.exports = Object.define(
	function BombExplosion(x, y, source, grid, actors, args) {
		Actor.call(this);
		this.position.x = x;
		this.position.y = y;
		this.tileW = 64;
		this.tileH = 64;
		this.decal = { x: (64 - 24) / 2, y: (64 - 24) / 2 };
		this.zOrder = 1;
		this.sprite = 'img-explosion';
		this.animated = {
			loop: false,
			fps: 16
		};

		this.ticksBeforeAction = 5;
		this.requestedAction = function(actor) {
			grid.removeActor(actor);
			delete actors[actor.id];
		};
	}
);