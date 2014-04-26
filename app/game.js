var Player = require('./player');
var Grid = require('./grid');
var actions = require('./actions');

module.exports = Object.define(
	function Game(app) {
		var self = this;

		this.app = app;
		this.grid = new Grid(10, 10);
		this.actors = [];

		// Game loop
		function gameLoop() {
			// Perform actions
			self.actors.forEach(function(actor) {
				if (!(--actor.ticksBeforeAction)) {
					if (actor.requestedAction) {
						var action = actions[actor.requestedAction.action];

						// In case we send an invalid action we don't want lock out
						if (!action)
							return actor.requestedAction = null;
						action.call(self, actor, actor.requestedAction.args);
					} else {
						actor.ticksBeforeAction = 1;
					}
				}
			});

			// Display loop
			self.actors.forEach(function(actor) {
				var actors = {};
				if (actor.lineOfSight)
					actors = self.grid.actorsWithinLOS(actor);
				if (actor.socket) {
					var info = {};
					for (var key in actors) {
						var act = actors[key];
						info[key] = {
							position: act.position 
						}
					}
					actor.socket.emit('display', info);
				}
			});
		}
		require('./looper')(gameLoop, 50);
	}, {
		connectPlayer: function(socket) {
			var player = new Player(socket);
			this.actors[player.id] = player;
			var pt = this.grid.randomWalkablePoint();
			player.position = pt;
			this.grid.putActor(player);
			socket.emit('update', {
				position: pt
			});
			socket.emit('map', this.grid.map);
		},
		disconnectPlayer: function(socket) {
			this.grid.removeActor(this.actors[socket.playerId]);
			delete this.actors[socket.playerId];
		}
	}
);
