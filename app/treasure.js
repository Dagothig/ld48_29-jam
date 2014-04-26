var Actor = require('./actor');

module.exports = Object.define(
	Actor,
	function Treasure(x, y, items) {
		Actor.call(this);

		this.position.x = x;
		this.position.y = y;
		this.items = items;
		this.sprite = 'img-treasure';
	}, {

	}
);