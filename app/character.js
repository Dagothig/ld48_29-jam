var Actor = require('./actor');

module.exports = Object.define(
	Actor,
	function Character() {
		Actor.call(this);
	
		this.lineOfSight = 8;
		this.moveSpeed = 1;
		this.items = [];
		this.itemsMax = 4;
		this._health = 6;
	}, {
		get health() {
			return this._health;
		},
		set health(val) {
			this._health = val;
			if (this.socket) {
				this.socket.emit('update', {
					health: val
				});
			}
			if (this._health <= 0) {
				this.requestAction = {
					action: 'die',
					args: { items: this.items }
				};
				this.ticksBeforeAction = 0;
				if (this.socket)
					this.socket.emit('death');
			}
		}
	}
);