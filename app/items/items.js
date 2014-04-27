'use strict';

var Actor = require('./../actor');
var Firejet = require('./../characters/firejet');
var BloodSpurt = require('./../characters/blood-spurt');
var Bomb = require('./bomb');

module.exports = {
	broadsword: {
		name: 'broadsword',
		activate: function(actor, args) {
			actor.requestedAction = null;
			actor.ticksBeforeAction = 5;

			var sword = new Actor();
			sword.position.x = actor.position.x;
			sword.position.y = actor.position.y;
			switch(args.orientation) {
				case 'left':
					sword.position.x--;
					sword.tileY = 1;
					sword.decal = {
						x: -8,
						y: 0
					};
					sword.zOrder = 1;
					break;
				case 'right':
					sword.position.x++;
					sword.tileY = 2;
					sword.decal = {
						x: 8,
						y: 0
					};
					sword.zOrder = 1;
					break;
				case 'up':
					sword.position.y--;
					sword.tileY = 3;
					sword.decal = {
						x: -2,
						y: -10
					};
					break;
				case 'down':
					sword.position.y++;
					sword.tileY = 0;
					sword.decal = {
						x: 0,
						y: 8
					};
					sword.zOrder = 1;
					break;
			}
			this.grid.putActor(sword);
			this.actors[sword.id] = sword;

			if (actor.socket) {
				actor.socket.emit('update', {
					tileY: sword.tileY
				});
			}

			var self = this;
			this.grid.getTileFor(sword.position.x, sword.position.y).actors.forEach(function(act) {
				if (act.health) {
					act.health--;
					new BloodSpurt(act.position.x, act.position.y, self.grid, self.actors);
				}
			});

			sword.sprite = 'img-sword';
			sword.ticksBeforeAction = 5;
			sword.requestedAction = {
				action: 'die',
				args: {}
			}
		}
	},
	bomb: {
		name: 'bomb',
		activate: function(actor, args) {
			actor.requestedAction = null;
			actor.ticksBeforeAction = 5;

			new Bomb(
					actor.position.x,
					actor.position.y,
					actor,
					this.grid,
					this.actors,
					args
				);
		}
	},
	firejet: {
		name: 'firejet',
		activate: function(actor, args) {
			actor.requestedAction = null;
			actor.ticksBeforeAction = 10;

			new Firejet(
				actor.position.x,
				actor.position.y,
				actor,
				this.grid,
				this.actors,
				args
			);
		}
	},
	cake: {
		name: 'cake',
		activate: function(actor, args) {
			actor.requestedAction = null;
			actor.ticksBeforeAction = 3;
			delete actor.items[args.itemNo];

			var items = [];
			actor.items.forEach(function(item, i) {
				items[i] = item.name;
			});
			actor.health += 10;

			if (actor.socket) {
				actor.socket.emit('update', {
					items: items,
					health: actor.health
				});
			}
		}
	}
};
