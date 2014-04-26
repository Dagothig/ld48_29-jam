var Mob = require('./mob');

module.exports = Object.define(
	Mob,
	function Troll(x, y) {
		Mob.call(this, x, y);

		this.sprite = 'img-troll';
	}, {

	}
);
