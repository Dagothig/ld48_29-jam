module.exports = function(Actor, Items) {
	return Object.define(
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
					else if (specialNumberOfTheWeek < 0.5) // 30% chance sword
						this.items.push(Items.broadsword);
					else // 50% chance bomb
						this.items.push(Items.bomb);
				}
			} else {
				this.items = items;
			}
		}, {

		}
	);
}
