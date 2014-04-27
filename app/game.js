'use strict';

var Player = require('./characters/player');
var Grid = require('./map/grid');
var actions = require('./actions');
var Looper = require('./looper');

module.exports = Object.define(
	function Game(app) {
		var self = this;

		this.app = app;
		this.grid = new Grid(100, 100);
		this.actors = this.grid.actors;

		// Game loop
		function gameLoop() {
			// Perform actions
			self.actors.forEach(function(actor) {
				if (!(--actor.ticksBeforeAction)) {
					if (actor.requestedAction) {
						if (actor.requestedAction instanceof Function) {
							actor.requestedAction.call(self, actor);
						} else {
							var action = actions[actor.requestedAction.action];

							// In case we send an invalid action we don't want lock out
							if (!action)
								return actor.requestedAction = null;
							action.call(self, actor, actor.requestedAction.args);
						}
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
							position: act.position,
							sprite: act.sprite,
							tileY: act.tileY,
							decal: act.decal,
							zOrder: act.zOrder,
							rotation: act.rotation,
							rotationCentered: act.rotationCentered
						}
					}
					actor.socket.emit('display', info);
				}
			});
		}
		Looper(gameLoop, 50);
	}, {
		connectPlayer: function(socket) {
			var player = new Player(socket);
			this.actors[player.id] = player;
			var pt = this.grid.randomWalkablePoint();
			player.position = pt;
			this.grid.putActor(player);
			socket.emit('update', {
				position: pt,
				health: player.health,
				lineOfSight: player.lineOfSight
			});
			socket.emit('map', this.grid.map);
		},
		disconnectPlayer: function(socket) {
			if (this.actors[socket.playerId]) {
				this.grid.removeActor(this.actors[socket.playerId]);
				delete this.actors[socket.playerId];
			}
		}
	}
);
