'use strict';

var Actor = require('./../actor');
var TileTypes = require('./../map/tile-types');
var BombExplosion = require('./bomb-explosion');

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

		grid.putActor(this);
		actors[this.id] = this;

		var self = this;
		this.sprite = 'img-bomb';
		this.ticksBeforeAction = 40;
		this.requestedAction = function(actor) {
			for (var rX = -1; rX <= 1; rX++) {
				for (var rY = -1; rY <= 1; rY++) {
					var pos = grid.getTileFor(actor.position.x + rX, actor.position.y + rY);
					pos.actors.forEach(function(act) {
						act.health -= 3;
					});
				}
			}
			grid.destroyTilesAt(
				actor.position.x - 1,
				actor.position.y - 1,
				actor.position.x + 1,
				actor.position.y + 1
			);

			grid.removeActor(actor);
			delete actors[actor.id]
			var be = new BombExplosion(
				actor.position.x, actor.position.y,
				source, grid, actors, args
			);
			grid.putActor(be);
			actors[be.id] = be;
		}
	}, {

	}
);
