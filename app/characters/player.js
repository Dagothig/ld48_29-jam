'use strict';

var Character = require('./../characters/character');

module.exports = Object.define(
	Character,
	function Player(socket) {
		Character.call(this);

		var self = this;

		this.sprite = 'img-player';
		this.ticksBeforeAction = 1;
		this.socket = socket;
		this.socket.playerId = this.id;
		this.socket.on('action-request', function(data) {
			if (self.health > 0) {
				self.requestedAction = {
					action: data.action,
					args: data.args
				};
			}
		});
	}, {

	}
);
