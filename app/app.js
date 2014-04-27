var TileTypes = require('./map/tile-types');
var LayerTypes = require('./map/layer-types');
var Actor = require('./actor');
var Looper = require('./looper');

var Character = require('./characters/character')(Actor);
var Player = require('./characters/player')(Character);
var Firejet = require('./characters/firejet')(Actor, TileTypes);
var ItemTypes = require('./items/items')(Actor, Firejet);

var Mob = require('./characters/mob')(Character);
var Troll = require('./characters/troll')(Mob);

var Treasure = require('./items/treasure')(Actor, ItemTypes);
var Grid = require('./map/grid')(TileTypes, LayerTypes, Treasure, ItemTypes, Troll);
var Actions = require('./actions')(TileTypes, Treasure, ItemTypes);
var Game = require('./game')(Player, Grid, Actions, Looper);

module.exports = function(app) {

	var game = new Game(app);

	app.io.sockets.on('connection', function(socket) {
		game.connectPlayer(socket);

		socket.on('disconnect', function() {
			game.disconnectPlayer(socket);
		});
	});
}
