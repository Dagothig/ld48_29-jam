var Actor = require('./actor');
var Firejet = require('./firejet');

var items = {
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

			this.grid.getTileFor(sword.position.x, sword.position.y).actors.forEach(function(act) {
				act.health--;
			});

			sword.sprite = 'img-sword';
			sword.ticksBeforeAction = 5;
			sword.requestedAction = {
				action: 'die',
				args: {}
			}
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
	}
};

module.exports = items;