'use strict';

var Actor = require('./actor');

module.exports = Object.define(
	Actor,
	function BloodSpurt(posX, posY, grid, actors) {
		Actor.call(this);
		this.position.x = posX;
		this.position.y = posY;
		this.zOrder = 1;
		this.sprite = 'img-blood-spurt';
		this.animated = {
			loop: false,
			fps: 16
		}

		grid.putActor(this);
		actors[this.id] = this;
		
		this.requestedAction = {
			action: 'die',
			args: {}
		};
		this.ticksBeforeAction = 5;
	}
);