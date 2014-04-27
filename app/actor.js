'use strict';

var id = 0;

module.exports = Object.define(
	function Actor() {
		this.id = id++;
		this.position = {
			x: null,
			y: null
		};

		this.requestedAction = null;
		this.ticksBeforeAction = 0;
	}, {

	}
);
