'use strict';

var Character = require('./../characters/character');
var Treasure = require('./../items/treasure');

module.exports = Object.define(
	Character,
	function Mob(x, y) {
		Character.call(this);

		this.position.x = x;
		this.position.y = y;
		this.knownActors = {};
		this.direction = 'none';
	}, {
		updateSeenActors: function(actors) {
			var now = Date.now();
			for (var key in actors) {
				var actor = actors[key];
				var data = actors[key] || {};
				if (!(key in this.knownActors)) {
					this.knownActors[key] = data;
				}
				data.lastKnownX = actor.position.x;
				data.lastKnownY = actor.position.y;
				data.timeStamp = now;
				data.ref = actor;
			}

			// Calculate the relevance of all known actors and discard
			// those that have a very low relevance
			this.mostRelevant = null;
			for (var key in this.knownActors) {
				var data = this.knownActors[key];
				data.relevance = 1000 / (now - data.timeStamp);
				// Note all currently seen actors have infinite relevance
				// actors that have been seen one second ago, 1
				// actors that have been seen 2 seconds ago, 0.5
				// actors that have been seen 4 seconds ago, 0.25, etc.
				// after 30 seconds, the objects are discarded as not relevant enough
				if (data.relevance < (1 / 30)) {
					delete this.knownActors[key];
					continue;
				} else {
					if (!this.mostRelevant || data.relevance > this.mostRelevant.relevance)
						this.mostRelevant = data;
					


					if (data.ref instanceof Treasure) {
						// treasure has reduced relevance due to its lower priority
						data.relevance *= 0.75;
					}
				}
			}
		},
		get requestedAction() {
			return this._requestedAction;
		},
		set requestedAction(val) {
			this._requestedAction = val;

			if (!val) {
			}
		}
	}
);
