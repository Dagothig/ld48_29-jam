var Player = require('./player');
var Grid = require('./grid');
var actions = require('./actions');

module.exports = Object.define(
	function Game(app) {
		var self = this;

		this.app = app;
		this.grid = new Grid(100, 100);
		this.actors = [];

		// Game loop
		function gameLoop() {
			self.actors.forEach(function(actor) {
				if (!(--actor.ticksBeforeAction)) {
					var action = actions[actor.requestedAction.action];
					if (action) {
						action.call(self, actor, actor.requestAction.args);
					} else {
						actor.ticksBeforeAction = 1;
					}
				}
			});
		}
		require('./looper')(gameLoop, 50);
	}, {

	}
);