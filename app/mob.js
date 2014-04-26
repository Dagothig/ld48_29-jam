var Actor = require('./actor');

module.exports = Object.define(
	Actor,
	function Mob(x, y) {
		Actor.call(this);

		this.position.x = x;
		this.position.y = y;
		this.health = 6;
	}, {

	}
);
