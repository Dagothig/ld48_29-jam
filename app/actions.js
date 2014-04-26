var TILE_TYPES = require('./tile-types');
var Treasure = require('./treasure');
var itemTypes = require('./items');

var actions = {
	/* { x, y } */
	move: function(actor, args) {
		if (args.x > 0)
			args.x = Math.min(args.x, actor.moveSpeed);
		else if (args.x < 0)
			args.x = Math.max(args.x, -actor.moveSpeed);

		if (args.y > 0)
			args.y = Math.min(args.y, actor.moveSpeed);
		else if (args.y < 0)
			args.y = Math.max(args.y, -actor.moveSpeed);

		if (args.x > 0) {
			actor.tileY = 2;
		} else if (args.x < 0) {
			actor.tileY = 1;
		} else if (args.y > 0) {
			actor.tileY = 0;
		} else if (args.y < 0) {
			actor.tileY = 3;
		}

		var posX = this.grid.validX(actor.position.x + args.x);
		var posY = this.grid.validY(actor.position.y + args.y);

		var pos = this.grid.getTileFor(posX, posY);
		actor.ticksBeforeAction = 1;

		var data;
		if (TILE_TYPES.fromId(pos.tile).walkable) {
			this.grid.removeActor(actor);
			actor.position.x = posX;
			actor.position.y = posY;
			this.grid.putActor(actor);
			actor.ticksBeforeAction = 5;

			data = {
				position: {
					x: posX,
					y: posY
				},
				tileY: actor.tileY
			};
		} else {
			data = {
				tileY: actor.tileY
			};

			pos = this.grid.getTileFor(actor.position.x, actor.position.y);
		}

		var items = [];
		pos.actors.forEach(function(act) {
			if (act instanceof Treasure)
				act.items.forEach(function(item) {
					items.push(item.name);
				});
		});
		if (items && items.length)
			data.treasure = items;

		if (actor.socket)
			actor.socket.emit('update', data);
	},
	stopMove: function(actor, args) {
		actor.requestedAction = null;
		actor.ticksBeforeAction = 1;
	},
	/* { itemNo, orientation } */
	useItem: function(actor, args) {
		var item = actor.items[args.itemNo];
		if (!item){
			actor.requestedAction = null
			actor.ticksBeforeAction = 1;
			return;
		}

		item.activate.call(this, actor, args);
	},
	/* { itemNo } */
	dropItem: function(actor, args) {
		actor.requestedAction = null
		actor.ticksBeforeAction = 1;

		var actors = this.grid.getTileFor(actor.position.x, actor.position.y).actors;
		var item = actor.items[args.itemNo];
		if (!item) {
			return;
		}
		delete actor.items[args.itemNo];

		var treasure;
		for (var i = 0; i < actors.length; i++){
			var act = actors[i];
			if (act instanceof Treasure){
				act.items.push(item);
				treasure = act;
				break;
			}
		}
		if (!treasure) {
			treasure = new Treasure(actor.position.x, actor.position.y, [item]);
			this.grid.putActor(treasure);
		}

		var items = [];
		treasure.items.forEach(function(item) {
			items.push(item.name);
		});

		for (var i = 0; i < actors.length; i++) {
			var act = actors[i];
			if (act.socket) {
				if (act === actor) {
					act.socket.emit('update', {
						treasure: items,
						items: act.items
					})
				} else {
					act.socket.emit('update', {
						treasure: items
					});
				}
			}
		}
	},
	/* { itemNo, treasureItemNo } */
	swapItem: function(actor, args) {
		actor.requestedAction = null;
		actor.ticksBeforeAction = 1;
		
		var actors = this.grid.getTileFor(actor.position.x, actor.position.y).actors;
		var treasure;
		for (var i = 0; i < actors.length; i++){	
			var act = actors[i];
			if (act instanceof Treasure){
				treasure = act;
				break;
			}
		}
		if (!treasure)
			return;

		var item = actor.items[args.itemNo];
		var treasureItem = treasure.items[args.treasureItemNo];

		actor.items[args.itemNo] = treasureItem;
		if (item)
			treasure.items[args.treasureItemNo] = itemTypes[item.name];
		else
			treasure.items.splice(args.treasureItemNo, 1);

		var data = {};

		if (!treasure.items.length) {
			this.grid.removeActor(treasure);
		} else {
			var items = [];
			treasure.items.forEach(function(item) {
				items.push(item.name);
			});
			data.treasure = items;
		}

		for (var i = 0; i < actors.length; i++) {
			var act = actors[i];
			if (act.socket) {
				if (act === actor) {
					var items = [];
					actor.items.forEach(function(item) {
						items.push(item.name);
					})
					data.items = items;
				}
				act.socket.emit('update', data);
			}
		}
	},
	/* { items } */
	die: function(actor, args) {
		this.grid.removeActor(actor);
		delete this.actors[actor.id];
		if (args.items && args.items.length) {
			var actors = this.grid.getTileFor(actor.position.x, actor.position.y).actors;
			var treasure;
			for (var i = 0; i < actors.length; i++) {
				var act = actors[i];
				if (act instanceof Treasure)
					treasure = act;
			} 
			if (!treasure) {
				treasure = new Treasure(actor.position.x, actor.position.y, args.items);
				this.grid.putActor(treasure);
			} else {
				args.items.forEach(function(item) {
					treasure.items.push(item);
				});
			}

			var items = [];
			treasure.items.forEach(function(item) {
				items.push(item.name);
			});

			for (var i = 0; i < actors.length; i++) {
				var act = actors[i];
				if (act.socket) {
					act.socket.emit('update', {
						treasure: items
					});
				}
			}
		}
	}
};

module.exports = actions;
