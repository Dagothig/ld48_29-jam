'use strict';

module.exports = function(callback, tickLength) {
	var last = Date.now();
	function checkTick() {
		var delta = Date.now() - last;
		while (delta > tickLength) {
			last += tickLength;
			delta -= tickLength;
			callback();
		}
		setImmediate(checkTick);
	}
	setImmediate(checkTick);
};
