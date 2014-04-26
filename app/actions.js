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

		var posX = actor.position.x + args.x;
		var posY = actor.position.y + args.y;

		var pos = this.grid.getTileFor(posX, posY);
		if (pos.tile.walkable) {
			this.grid.removeActor(actor);
			actor.position.x = posX;
			actor.position.y = posY;
			this.grid.putActor(actor);
			actor.ticksBeforeAction = 5;
			actor.requestedAction = null;

			if (actor.socket) {
				actor.socket.emit('update', {
					position: {
						x: visibleTiles.tilesX,
						y: visibleTiles.tilesY
					}
				});
			}
		}
	},
	/* { itemNo } */
	useItem: function(actor, args) {
	},
	/* { itemNo } */
	dropItem: function(actor, args) {
	},
};

module.exports = actions;
