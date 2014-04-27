'use strict';

var types = {
	ROCK: {
		tileId: 0,
		isWall: true,
		breakable: true,
		brokenId: 2
	},
	GRASS: {
		tileId: 1,
		walkable: true
	},
	ROCKY_GROUND: {
		tileId: 2,
		walkable: true
	},
	WATER: {
		tileId: 3
	},
	DARK_ROCK: {
		tileId: 4,
		isWall: true
	},
	GRASSY_ROCK: {
		tileId: 5,
		isWall: true
	},
	GRAY_BRICK: {
		tileId: 6,
		isWall: true,
		breakable: true,
		brokenId: 7
	},
	GRAY_GROUND: {
		tileId: 7,
		walkable: true
	},
	DARK_EMPTY_SPACE: {
		tileId: 8,
		isWall: true
	}
};
var reverseTypes = {};

var out = {};
for (var key in types) {
	reverseTypes[types[key].tileId] = types[key];
	out[key] = types[key];
}
out.fromId = function(id) {
	return reverseTypes[id];
}

module.exports = out;
