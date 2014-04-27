'use strict';

var Actor = require('./../actor');
var TileTypes = require('./../map/tile-types');

module.exports = Object.define(
	Actor,
	function Bomb(x, y, source, grid, args) {
		Actor.call(this);
		this.position.x = x;
		this.position.y = y;
		this.zOrder = 1;

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
		//actors[this.id] = this;

		var self = this;
		this.sprite = 'img-bomb';
		this.ticksBeforeAction = 1;
		this.requestedAction = function(actor) {

		}
	}, {

	}
);
