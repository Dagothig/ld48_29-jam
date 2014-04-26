var TileTypes = require('./tile-types');
var LayerTypes = require('./layer-types');

module.exports = Object.define(
	function Grid(width, height) {
		var self = this;
		this.width = width;
		this.height = height;
		this.tiles = new Array(Object.keys(LayerTypes).length);

		// Fill in ground end empty layer type arrays
		for (var n = 0; n < this.tiles.length; n++) {
			this.tiles[n] = new Array(this.width);
			for (var x = 0; x < this.width; x++) {
				this.tiles[n][x] = new Array(this.height);
				for (var y = 0; y < this.height; y++) {
					switch (n) {
						case LayerTypes.TILES:
							//if (Math.random() < 0.25)
							this.tiles[n][x][y] = TileTypes.ROCK.tileId;
							break;
						case LayerTypes.ACTORS:
							this.tiles[n][x][y] = [];
							if(Math.random() < 0.05)
								this.tiles[n][x][y].push(new (require('./treasure'))(x, y, [require('./items').broadsword]));
							break;
					}
				}
			}
		}

		// Generate dungeons
		var splitAmt = Math.floor(this.width/6);
		var walls = [];
		var sections = [{x1: 0, y1: 0, x2: this.width, y2: this.height}];
		var newSmallerSections = [];
		var splitOnX = true;
		for (var i = 0; i < splitAmt; i++) {
			sections.forEach(function(section) {
				var width = section.x2-section.x1;
				var width = section.y2-section.y1;
				var splitPos = Math.floor(Math.random() * (((splitOnX ? width : height)/2)+1));
				splitPos += Math.floor((splitOnX ? width : height)/2);
				newSmallerSections.push({
					x1: section.x1,
					y1: section.y1,
					x2: splitOnX ? splitPos : width,
					y2: splitOnX ? height : splitPos
				});
				newSmallerSections.push({
					x1: splitOnX ? splitPos : section.x1,
					y1: splitOnX ? section.y1 : splitPos,
					x2: section.x2,
					y2: section.y2
				});
			});
			sections = newSmallerSections;
			splitOnX = !splitOnX;
		};
		console.log(sections);
		var wut = true;
		sections.forEach(function(section) {
			if (wut) {
				for (var x = 0; x < section.x2-section.x1; x++) {
					for (var y = 0; y < section.y2-section.y1; y++) {
						self.tiles[LayerTypes.TILES][x][y] = TileTypes.ROCKY_GROUND.tileId;
					}
				}
			}
			wut = !wut;
		});

	}, {
		getTilesPosWithin: function(pX, pY, range) {
			var range2 = range * range;
			var tilesX = [];
			var tilesY = [];
			for (var x = -range; x <= range ; x++) {
				for (var y = -range; y <= range; y++) {
					var dist = x * x + y * y;
					if (dist + Object.SUCH_CONSTANT <= range2) {
						var tX = this.validX(pX + x);
						var tY = this.validY(pY + y);

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
		putActor: function(actor) {
			this.tiles[LayerTypes.ACTORS][this.validX(actor.position.x)][this.validY(actor.position.y)].push(actor);
		},
		removeActor: function(actor) {
			var arr = this.tiles[LayerTypes.ACTORS][this.validX(actor.position.x)][this.validY(actor.position.y)];
			var i = arr.indexOf(actor);
			if (i >= 0)
				arr.splice(i, 1);
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
			x = this.validX(x);
			y = this.validY(y);

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
					if (dist + Object.SUCH_CONSTANT <= range2) {
						var tX = this.validX(actor.position.x + x);
						var tY = this.validY(actor.position.y + y);

						var acts = this.tiles[LayerTypes.ACTORS][tX][tY];
						acts.forEach(function(act) {
							if (act !== actor)
								actors[act.id] = act;
						});
					}
				}
			}

			return actors;
		},

		validX: function(x) {
			x = x % this.width;
			while (x < 0)
				x += this.width;

			return x;
		},
		validY: function(y) {
			y = y % this.height;
			while (y < 0)
				y += this.height;

			return y;
		}
	}
);
