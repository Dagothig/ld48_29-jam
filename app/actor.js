module.exports = Object.define(
	function Actor() {
		this.position = {
			x: null,
			y: null
		};

		this.requestedAction = null;
		this.ticksBeforeAction = 0;
	}, {

	}
);