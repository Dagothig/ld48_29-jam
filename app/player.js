var Character = require('./character');

module.exports = Object.define(
	Character,
	function Player(socket) {
		Character.call(this);

		this.socket = socket;
		var self = this;
		this.socket.on('action-request', function(data) {
			self.requestedAction = {
				action: data.action,
				args: data.args
			};
		});
		
	}, {
	}
);