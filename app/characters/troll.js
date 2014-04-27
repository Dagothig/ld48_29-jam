'use strict';

var Mob = require('./../characters/mob');

module.exports = Object.define(
	Mob,
	function Troll(x, y) {
		Mob.call(this, x, y);

		this.sprite = 'img-troll';
	}, {

	}
);
