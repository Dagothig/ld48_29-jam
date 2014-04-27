'use strict';

var Actor = require('./../actor');
var TileTypes = require('./../map/tile-types');

var Firejet = Object.define(
	Actor,
	function Firejet(x, y, source, grid, actors, args) {
		Actor.call(this);
		this.position.x = x;
		this.position.y = y;
		this.rotationCentered = true;
		this.zOrder = 1;
		switch(args.orientation) {
			case 'left':
				this.rotation = (3 * Math.PI) / 2;
				this.position.x--;
				if (source.socket) {
					source.socket.emit('update', { tileY: 1 });
				}
				break;
			case 'right':
				this.rotation = Math.PI / 2;
				this.position.x++;
				if (source.socket) {
					source.socket.emit('update', { tileY: 2 });
				}
				break;
			case 'up':
				this.rotation = 0;
				this.position.y--;
				if (source.socket) {
					source.socket.emit('update', { tileY: 3 });
				}
				break;
			case 'down':
				this.rotation = Math.PI;
				this.position.y++;
				if (source.socket) {
					source.socket.emit('update', { tileY: 0 });
				}
				break;
		}
		var pos = grid.getTileFor(this.position.x, this.position.y);
		if (TileTypes.fromId(pos.tile).isWall)
			return;

		grid.putActor(this);
		actors[this.id] = this;

		var self = this;
		this.sprite = 'img-fire';
		this.ticksBeforeAction = 1;
		this.requestedAction = function(actor) {
			actor.tileY = 1;

			grid.getTileFor(actor.position.x, actor.position.y).actors.forEach(function (act) {
				act.health--;
			});
			new Firejet(
				actor.position.x, actor.position.y,
				source, grid, actors, args
			);
			actor.ticksBeforeAction = 1;
			actor.requestedAction = function(actor) {
				actor.tileY = 0;
				actor.rotation += Math.PI;

				actor.ticksBeforeAction = 1;
				actor.requestedAction = {
					action: 'die',
					args: {}
				}
			};
		};
	}
);
module.exports = Firejet;
