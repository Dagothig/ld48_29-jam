'use strict';

define(['game/map', 'io', 'pixi', 'game/tile-grid', 'game/actor'],
	function(Map, io, pixi, TileGrid, Actor) {
		return Object.define(
			function GameState() {
				var self = this;
				this.tileSize = 24;
				this.map = new Map(0x201015);
				this.player = {
					position: {},
					lineOfSight: 4
				};

				this.socket = io.connect('/');
				this.socket.on('map', function(data) {
					self.grid = new TileGrid('res/tileset.png', 24, data);
					self.grid.onloaded = function() {
						self.grid.renderAround(
							self.player.position.x,
							self.player.position.y,
							self.player.lineOfSight
						);
						self.gridActor = new Actor(self.grid);
						self.gridActor.zOrder = -1;
						self.map.addActor(self.gridActor);
					}
				});

				this.socket.on('display', function(data) {
					self.updateDisplay.call(self, data);
				});

				this.socket.on('update', function(data) {
					self.receiveUpdate.call(self, data);
				});
			}, {
				update: function(delta) {
					this.map.update(delta);
				},
				render: function(renderer) {
					renderer.render(this.map.stage);
				},

				receiveUpdate: function(data) {
					if (data.position) {
						this.player.position.x = data.position.x;
						this.player.position.y = data.position.y;
						this.map.cameraX = this.player.position.x * this.tileSize;
						this.map.cameraY = this.player.position.y * this.tileSize;
						if (this.grid) {
							this.grid.renderAround(
								this.player.position.x, 
								this.player.position.y, 
								this.player.lineOfSight
							);
						}
					}
				},
				updateDisplay: function(data) {

				}
			}
		);
	}
);
