'use strict';

var Character = require('./../characters/character');

module.exports = Object.define(
	Character,
	function Mob(x, y) {
		Character.call(this);

		this.position.x = x;
		this.position.y = y;
	}, {

	}
);
