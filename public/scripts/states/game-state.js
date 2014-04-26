'use strict';

define(['game/map'],
	function(Map) {
		return Object.define(
			function GameState() {
				this.map = new Map(0x201015);
			}, {
				update: function(delta) {
					this.map.update(delta);
				},
				render: function(renderer) {
					renderer.render(this.map.stage);
				}
			}
		);
	}
);