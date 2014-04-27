'use strict';

var Actor = require('./../actor');
var TileTypes = require('./../map/tile-types');

var getRandom = function(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
};

module.exports = Object.define(
	Actor,
	function Bomb(x, y, source, grid, actors, args) {
		Actor.call(this);
		this.position.x = x;
		this.position.y = y;
		this.tileW = 24;
		this.tileH = 32;
		this.decal = { x: 0, y: 8 };
		this.zOrder = 0;

		switch(args.orientation) {
			case 'left':
				this.position.x--;
				if (source.socket) { source.socket.emit('update', { tileY: 1 }); }
				break;
			case 'right':
				this.position.x++;
				if (source.socket) { source.socket.emit('update', { tileY: 2 }); }
				break;
			case 'up':
				this.position.y--;
				if (source.socket) { source.socket.emit('update', { tileY: 3 }); }
				break;
			case 'down':
				this.position.y++;
				if (source.socket) { source.socket.emit('update', { tileY: 0 }); }
				break;
		}

		var pos = grid.getTileFor(this.position.x, this.position.y);
		if (TileTypes.fromId(pos.tile).isWall)
			return;

		grid.putActor(this);
		actors[this.id] = this;

		var self = this;
		this.sprite = 'img-bomb';
		this.ticksBeforeAction = 40;
		this.requestedAction = function(actor) {
			grid.removeActor(actor);
			new BombExplosion(
				actor.position.x, actor.position.y,
				source, grid, actors, args
			);
		}
	}, {

	}
);
