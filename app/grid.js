var TileTypes = require('./tile-types');
var LayerTypes = require('./layer-types');
var Treasure = require('./treasure');
var Items = require('./items');
var Troll = require('./troll');

module.exports = Object.define(
	function Grid(width, height) {
		var self = this;
		this.width = width;
		this.height = height;
		this.tiles = new Array(Object.keys(LayerTypes).length);
		this.actors = [];

		// Fill in ground end empty layer type arrays
		for (var n = 0; n < this.tiles.length; n++) {
			this.tiles[n] = new Array(this.width);
			for (var x = 0; x < this.width; x++) {
				this.tiles[n][x] = new Array(this.height);
				for (var y = 0; y < this.height; y++) {
					switch (n) {
						case LayerTypes.TILES:
							if (Math.random() < 0.6)
								this.tiles[n][x][y] = TileTypes.ROCK.tileId;
							else if (Math.random() < 0.9)
								this.tiles[n][x][y] = TileTypes.DARK_ROCK.tileId;
							else
								this.tiles[n][x][y] = TileTypes.GRASSY_ROCK.tileId;
							break;
						case LayerTypes.ACTORS:
							this.tiles[n][x][y] = [];
							break;
					}
				}
			}
		}

		// Generate dungeons
		var center = {x: Math.round(this.width/2), y: Math.round(this.height/2)};
		var centerZone = {x1: center.x-10, y1: center.y-10, x2: center.x+10, y2: center.y+10};
		var walls = [];
		var getRandom = function(min, max) {
			return Math.floor(Math.random()*(max-min+1)+min);
		};
		var addWallsForRect = function(walls, rect) {
			walls.push({ x1: rect.x1, y1: rect.y1+1, x2: rect.x1, y2: rect.y2-1, dir: 'left' });
			walls.push({ x1: rect.x1+1, y1: rect.y1, x2: rect.x2-1, y2: rect.y1, dir: 'up' });
			walls.push({ x1: rect.x2, y1: rect.y1+1, x2: rect.x2, y2: rect.y2-1, dir: 'right' });
			walls.push({ x1: rect.x1+1, y1: rect.y2, x2: rect.x2-1, y2: rect.y2, dir: 'down' });
		};
		var rndPointFromWall = function(wall) {
			if (wall.x1 == wall.x2) { // horizontal wall (left - right)
				return { x: wall.x1, y: getRandom(wall.y1, wall.y2), dir: wall.dir };
			} else { // vertical wall (up - down)
				return { x: getRandom(wall.x1, wall.x2), y: wall.y1, dir: wall.dir };
			}
		};
		var forEachRect = function(rect, cb) {
			for (var x = rect.x1; x <= rect.x2; x++) {
				for (var y = rect.y1; y <= rect.y2; y++) {
					cb(x, y);
				}
			}
		};
		var forEachTiles = function(cb) {
			forEachRect({
				x1: 0, y1: 0,
				x2: self.width-1, y2: self.height-1
			}, cb);
		};
		var findRoomRectFromHallwayAndDimensions = function(hallway, roomSize) {
			if (hallway.dir == 'up') {
				return {
					x1: hallway.x - Math.round(roomSize.width/2),
					y1: hallway.y - roomSize.height,
					x2: hallway.x + Math.round(roomSize.width/2),
					y2: hallway.y
				};
			} else if (hallway.dir == 'down') {
				return {
					x1: hallway.x - Math.round(roomSize.width/2),
					y1: hallway.y,
					x2: hallway.x + Math.round(roomSize.width/2),
					y2: hallway.y + roomSize.height
				};
			} else if (hallway.dir == 'left') {
				return {
					x1: hallway.x - roomSize.width,
					y1: hallway.y - Math.round(roomSize.height/2),
					x2: hallway.x,
					y2: hallway.y + Math.round(roomSize.width/2)
				};
			} else if (hallway.dir == 'right') {
				return {
					x1: hallway.x,
					y1: hallway.y - Math.round(roomSize.height/2),
					x2: hallway.x + roomSize.width,
					y2: hallway.y + Math.round(roomSize.width/2)
				};
			}
		};

		var tryAddRoomForWall = function(wall) {
			var hallway = rndPointFromWall(wall);
			var hallwayLength = getRandom(5, 7);
			if (hallway.dir == 'up')    hallway.y -= hallwayLength; // Make some space for corridor
			if (hallway.dir == 'down')  hallway.y += hallwayLength;
			if (hallway.dir == 'left')  hallway.x -= hallwayLength;
			if (hallway.dir == 'right') hallway.x += hallwayLength;
			var desiredDimensions = {
				width: Math.random() < 0.75 ? getRandom(2, 4) : getRandom(4, 5),
				height: Math.random() < 0.75 ? getRandom(2, 4) : getRandom(4, 5)
			};
			var roomRect = findRoomRectFromHallwayAndDimensions(hallway, desiredDimensions);

			// Can we build?
			var isOK = true;
			forEachRect(roomRect, function(x, y) {
				grid = self.tiles[LayerTypes.TILES];
				try {
					if (!TileTypes.fromId(grid[x][y]).isWall) {
						isOK = false; // is not k! kay?
					}
				} catch (o_O) {
					isOK = false; // grid not big enough for room size
				}
			});
			if (isOK) { // Spawn the motherfucker! (actually its a room not a mtf)
				forEachRect(roomRect, function(x, y) {
					self.tiles[LayerTypes.TILES][x][y] = TileTypes.ROCKY_GROUND.tileId;
					if (Math.random() < 0.01) { // Treasure
						self.tiles[LayerTypes.ACTORS][x][y].push(new Treasure(x, y, [Items.broadsword]));
					} else if (Math.random() < 0.01) { // Treasure
						self.tiles[LayerTypes.ACTORS][x][y].push(new Treasure(x, y, [Items.firejet]));
					} else if (Math.random() < 0.005) { // Trolls
						var troll = new Troll(x, y);
						self.actors.push(troll);
						self.tiles[LayerTypes.ACTORS][x][y].push(troll);
					}
				});
				if (desiredDimensions.width >= 4 && desiredDimensions.height >= 4 && Math.random() < 0.2) { // Pound
					forEachRect(roomRect, function(x, y) {
						if (x > roomRect.x1 && x < roomRect.x2 &&
								y > roomRect.y1 && y < roomRect.y2) {
							self.tiles[LayerTypes.TILES][x][y] = TileTypes.WATER.tileId;
						}
					});
				}
				var grid = self.tiles[LayerTypes.TILES];
				for (var i = 1; i <= hallwayLength-1; i++) {
					if (hallway.dir == 'up') { // Ehh we want doors right?
							grid[hallway.x][hallway.y-i] = TileTypes.ROCKY_GROUND.tileId;
					} else if (hallway.dir == 'down') {
							grid[hallway.x][hallway.y+i] = TileTypes.ROCKY_GROUND.tileId;
					} else if (hallway.dir == 'left') {
							grid[hallway.x+i][hallway.y] = TileTypes.ROCKY_GROUND.tileId;
					} else if (hallway.dir == 'right') {
							grid[hallway.x-i][hallway.y] = TileTypes.ROCKY_GROUND.tileId;
					}
				}

				var nextWalls = [];
				addWallsForRect(nextWalls, roomRect);
				nextWalls.forEach(tryAddRoomForWall);
			}

		}

		forEachRect(centerZone, function(x, y) { // Fill grassy center zone
			self.tiles[LayerTypes.TILES][x][y] = TileTypes.GRASS.tileId;
		});
		addWallsForRect(walls, centerZone); // Add 4 first walls
		walls.forEach(tryAddRoomForWall); // start doom building

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
