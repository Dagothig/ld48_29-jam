var types = {
	ROCK: {
		tileId: 0
	},
	GRASS: {
		tileId: 1,
		walkable: true
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
