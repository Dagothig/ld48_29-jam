'use strict';

var Actor = require('./../actor');
var Items = require('./../items/items');

var Treasure = Object.define(
	Actor,
	function Treasure(x, y, items) {
		Actor.call(this);

		this.position.x = x;
		this.position.y = y;
		this.sprite = 'img-treasure';

		// If no items where given let's add some randomly
		if (items === undefined) {
			this.items = [];
			var amountOfItemsInLoot = Math.random() < 0.1 ? 2 : 1;
			for (var i = 0; i < amountOfItemsInLoot; i++) { // Small chances for 2 items in loot
				var specialNumberOfTheWeek = Math.random();
				if (specialNumberOfTheWeek < 0.2) // 20% chances firejet
					this.items.push(Items.firejet);
				else if (specialNumberOfTheWeek < 0.4) // 20% chance sword
					this.items.push(Items.broadsword);
				else if (specialNumberOfTheWeek < 0.6) // 20% cake
					this.items.push(Items.cake);
				else // 50% chance bomb
					this.items.push(Items.bomb);
			}
		} else {
			this.items = items;
		}
	}, {

	}
);
Treasure.addForTile = function(grid, x, y, items) {
	var t = grid.getTileFor(x, y);
	var treasure;
	for (var i = 0; i < t.actors.length; i++) {
		if (t.actors[i] instanceof Treasure) {
			treasure = t.actors[i];
			break;
		}
	}
	if (!treasure) {
		treasure = new Treasure(x, y, items);
		grid.putActor(treasure);
	} else {
		items.forEach(function(item) {
			treasure.items.push(item);
		})
	}

	var titems = [];
	treasure.items.forEach(function (item, i) {
		titems[i] = item.name;
	});

	t.actors.forEach(function(actor) {
		if (actor.socket) {
			actor.socket.emit('update', {
				'treasure': titems
			})
		}
	});
}

module.exports = Treasure;