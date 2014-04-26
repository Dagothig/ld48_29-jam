var Character = require('./character');

module.exports = Object.define(
	Character,
	function Player(socket) {
		Character.call(this);

		var self = this;

		this.socket = socket;
		this.socket.playerId = this.id;
		this.socket.on('action-request', function(data) {
			self.requestedAction = {
				action: data.action,
				args: data.args
			};
		});
	}, {
		
	}
);