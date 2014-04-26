var Actor = require('./actor');

module.exports = Object.define(
	Actor,
	function Character() {
		Actor.call(this);
	
		this.lineOfSight = 4;
		this.moveSpeed = 1;
		this.items = {};
		this.selectedItemNo = null;
	}, {
		get item() {
			return this.items[this.selectedItemNo];
		}
	}
);