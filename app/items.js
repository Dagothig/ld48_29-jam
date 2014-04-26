var Actor = require('./actor');

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
					break;
				case 'right': 
					sword.position.x++;
					sword.tileY = 2;
					break;
				case 'top':
					sword.position.y--;
					sword.tileY = 3;
					break; 
				case 'down': 
					sword.position.y++;
					sword.tileY = 0;
					break;
			}

			this.grid.getTileFor(sword.position.x, sword.position.y).actors.foreach(function(act) {
				act.health--;
			});

			sword.sprite = 'img-sword';
			sword.ticksBeforeAction = 5;
			sword.requestedAction = {
				action: 'die',
				args: {}
			}
		}
	}
};

module.exports = items;