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
					if (n === LayerTypes.TILES)
						this.tiles[n][x][y] = TileTypes.GRASS.tileId;
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
					if (dist <= range2) {
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
		getTilesFor: function(tiles) {
			var actors = {};
			var tiles = [];

			for (var n = 0, l = Math.min(tiles.tilesX.length, tiles.tilesY.length); n < l; n++) {
				var actor = this.tiles[LayerTypes.ACTORS]
					[tiles.tilesX[n]]
					[tiles.tilesY[n]];
				if (actor)
					actors[n] = actor;

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
				tiles: this.tiles[LayerTypes.TILES][x][y]
			};
		}
	}
);