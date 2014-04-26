var TILE_TYPES = require('./tile-types');

var actions = {
	/* { x, y } */
	move: function(actor, args) {

		if (args.x > 0)
			args.x = Math.min(args.x, actor.moveSpeed);
		else if (args.x < 0)
			args.x = Math.max(args.x, -actor.moveSpeed);

		if (args.y > 0)
			args.y = Math.min(args.y, actor.moveSpeed);
		else if (args.y < 0)
			args.y = Math.max(args.y, -actor.moveSpeed);

		if (args.x > 0) {
			actor.tileY = 2;
		} else if (args.x < 0) {
			actor.tileY = 1;
		} else if (args.y > 0) {
			actor.tileY = 0;
		} else if (args.y < 0) {
			actor.tileY = 3;
		}

		var posX = this.grid.validX(actor.position.x + args.x);
		var posY = this.grid.validY(actor.position.y + args.y);

		var pos = this.grid.getTileFor(posX, posY);
		actor.ticksBeforeAction = 1;
		if (TILE_TYPES.fromId(pos.tile).walkable) {
			this.grid.removeActor(actor);
			actor.position.x = posX;
			actor.position.y = posY;
			this.grid.putActor(actor);
			actor.ticksBeforeAction = 5;

			if (actor.socket) {
				actor.socket.emit('update', {
					position: {
						x: posX,
						y: posY
					},
					tileY: actor.tileY
				});
			}
		} else {
			if (actor.socket) {
				actor.socket.emit('update', {
					tileY: actor.tileY
				});
			}
		}
	},
	stopMove: function(actor, args) {
		actor.requestedAction = null;
		actor.ticksBeforeAction = 1;
	},
	/* { itemNo } */
	useItem: function(actor, args) {
	},
	/* { itemNo } */
	dropItem: function(actor, args) {
	},
};

module.exports = actions;
