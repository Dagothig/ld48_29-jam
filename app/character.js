var Actor = require('./actor');

module.exports = Object.define(
	Actor,
	function Character() {
		Actor.call(this);
	
		this.lineOfSight = 8;
		this.moveSpeed = 1;
		this.items = [];
		this.itemsMax = 8;
		this.selectedItemNo = null;
		this.health = 6;
	}, {
		get item() {
			return this.items[this.selectedItemNo];
		}
	}
);