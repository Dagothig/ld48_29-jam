var TileTypes = require('./tile-types');
var LayerTypes = require('./layer-types');

module.exports = Object.define(
	function Grid(width, height) {
		this.width = width;
		this.height = height;
		this.tiles = new Array(Object.keys(LayerTypes).length);
		for (var n = 0; n < this.tiles.length; n++) {
			this.tiles[n] = new Array(this.width);
			for (var x = 0; x < this.width; x++) {
				this.tiles[n][x] = new Array(this.height);
				for (var y = 0; y < this.height; y++) {
					switch (n) {
						case LayerTypes.TILES: 
							this.tiles[n][x][y] = TileTypes.GRASS.tileId;
							break;
						case LayerTypes.ACTORS:
							this.tiles[n][x][y] = [];
							break;
					}
				}
			}
		}
	}, {
		getTilesPosWithin: function(pX, pY, range) {
			var range2 = range * range;
			var tilesX = [];
			var tilesY = [];
			for (var x = -range; x <= range ; x++) {
				for (var y = -range; y <= range; y++) {
					var dist = x * x + y * y;
					if (dist - 2 <= range2) {
						var tX = (x + pX) % this.width;
						var tY = (y + pY) % this.height;

						while (tX < 0)
							tX += this.width;
						while (tY < 0)
							tY += this.height;

						tilesX.push(tX);
						tilesY.push(tY);
					}
				}
			}
			return {
				tilesX: tilesX,
				tilesY: tilesY
			};
		},
		get map() {
			return this.tiles[LayerTypes.TILES];
		},
		randomWalkablePoint: function() {
			var pt, limit = 10000;
			while (!pt) {
				if (!limit--)
					return { x: 0, y: 0 };

				var x = Math.floor(Math.random() * this.width);
				var y = Math.floor(Math.random() * this.height);
				var pos = this.getTileFor(x, y);
				if (TileTypes.fromId(pos.tile).walkable && !Object.keys(pos.actors).length) {
					pt = {
						x: x, 
						y: y
					};
				}
			}
			return pt;
		},
		getTilesFor: function(tiles) {
			var actors = {};
			var tiles = [];

			for (var n = 0, l = Math.min(tiles.tilesX.length, tiles.tilesY.length); n < l; n++) {
				var acts = this.tiles[LayerTypes.ACTORS]
					[tiles.tilesX[n]]
					[tiles.tilesY[n]];
				for (var key in acts) {
					var act = acts[key];
					actors[act.id] = act;
				}

				tiles[n] = this.tiles[LayerTypes.TILES]
					[tiles.tilesX[n]]
					[tiles.tilesY[n]];
			}

			return {
				actors: actors,
				tiles: tiles
			};
		},
		getTileFor: function(x, y) {
			return {
				actors: this.tiles[LayerTypes.ACTORS][x][y],
				tile: this.tiles[LayerTypes.TILES][x][y]
			};
		},
		actorsWithinLOS: function(actor) {
			var actors = {};
			var range2 = actor.lineOfSight * actor.lineOfSight;

			for (var x = -actor.lineOfSight; x <= actor.lineOfSight ; x++) {
				for (var y = -actor.lineOfSight; y <= actor.lineOfSight; y++) {
					var dist = x * x + y * y;
					if (dist - 2 <= range2) {
						var tX = (x + actor.position.x) % this.width;
						var tY = (y + actor.position.y) % this.height;
						
						while (tX < 0)
							tX += this.width;
						while (tY < 0)
							tY += this.height;

						var acts = this.tiles[LayerTypes.ACTORS][tX][tY];
						acts.forEach(function(act) {
							if (act !== actor)
								actors[act.id] = act;
						});
					}
				}
			}

			return actors;
		}
	}
);
