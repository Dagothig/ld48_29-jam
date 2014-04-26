var actions = {
	move: function(actor, args) {
		/*
		{ x, y }
		*/
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

		var tile = this.grid.getTileFor(posX, posY);
		if (tile.walkable) {
			actor.position.x = posX;
			actor.position.y = posY;
			var visibleTiles = this.grid.getTilesPosWithin(
				posX, posY, actor.lineOfSight
			);
			var tiles = this.grid.getTilesFor(visibleTiles);

			if (actor.socket) {
				actor.socket.emit('update', {
					'display': {
						actors: tiles.actors,
						tiles: tiles.tiles,
						posX: visibleTiles.tilesX,
						posY: visibleTiles.tilesY
					},
					'hide': {
						posX: 'all',
						posY: 'all'
					}
				});
			}
			for (var key in tiles.actors) {
				var act = tiles.actors[key];
				if (act.socket) {
					actor.socket.emit('update', {
						'display': {

						}
					});
				}
			}
		}
	},
	useItem: function(actor, args) {
		/*
		{ itemNo }
		*/
	},
	dropItem: function(actor, args) {
		/*
		{ itemNo }
		*/
	},
};

module.exports = actions;