var Game = require('./game');

module.exports = function(app) {
	// Game route
	app.get('/game', function(req, res) {
		res.sendfile(__dirname + '/../public/game.html');
	});

	var game = new Game(app);

	app.io.sockets.on('connection', function(socket) {
		game.connectPlayer(socket);

		socket.on('disconnect', function() {
			game.disconnectPlayer(socket);
		});
	});
}
