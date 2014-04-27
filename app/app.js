'use strict';

var Game = require('./game');

module.exports = function(app) {

	var game = new Game(app);

	app.io.sockets.on('connection', function(socket) {
		game.connectPlayer(socket);

		socket.on('disconnect', function() {
			game.disconnectPlayer(socket);
		});
	});
}
