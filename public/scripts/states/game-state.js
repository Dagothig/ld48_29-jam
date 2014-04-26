'use strict';

define(['game/map', 'io', 'pixi', 'game/tile-grid', 'game/actor', 'game/player'],
	function(Map, io, pixi, TileGrid, Actor, Player) {
		return Object.define(
			function GameState(game) {
				var self = this;
				this.game = game;
				this.game.onresize = function() {
					self.updateCamera();
				}
				this.tileSize = 24;
				this.map = new Map(0x201015, this.tileSize);
				this.player = new Player(this.map);
				this.objects = [];

				this.socket = io.connect('/');
				this.socket.on('map', function(data) {
					self.grid = new TileGrid('/res/tileset.png', self.tileSize, data);
					self.grid.onloaded = function() {
						self.grid.renderAround(
							self.player.position.x,
							self.player.position.y,
							self.player.lineOfSight
						);
						self.gridActor = new Actor(self.grid);
						self.gridActor.zOrder = -1;
						self.map.addActor(self.gridActor);
						self.map.activateWrapping(self.grid.tWidth, self.grid.tHeight);
					}
				});

				this.socket.on('display', function(data) {
					self.updateDisplay.call(self, data);
				});

				this.socket.on('update', function(data) {
					self.receiveUpdate.call(self, data);
				});

				var IM = this.game.inputManager;
				var MOVEMENT_KEYS = [IM.KEYS.LEFT, IM.KEYS.RIGHT, IM.KEYS.UP, IM.KEYS.DOWN];
				for (var i = MOVEMENT_KEYS.length - 1; i >= 0; i--) {
					IM.bind(MOVEMENT_KEYS[i], IM.ACTIONS.PRESSED, function() {
						var args = { x: 0, y: 0 };
						switch(MOVEMENT_KEYS[i]) {
							case IM.KEYS.LEFT:
								args.x = -1;
							case IM.KEYS.RIGHT:
								args.x = 1;
							case IM.KEYS.UP:
								args.y = 1;
							case IM.KEYS.DOWN:
								args.y = -1;
						}
						self.socket.emit('action-request', {
							action: 'move',
							args: args
						});
					});
				};
			}, {
				update: function(delta) {
					this.map.update(delta);
					this.player.update(delta);
				},
				render: function(renderer) {
					renderer.render(this.map.stage);
				},

				updateCamera: function() {
					this.map.cameraX =
						(this.player.position.x * this.tileSize) -
						(this.game.container.offsetWidth / 2) +
						this.player.sprite.width / 2;

					this.map.cameraY =
						(this.player.position.y * this.tileSize) -
						(this.game.container.offsetHeight / 2) +
						this.player.sprite.height / 2;
				},

				receiveUpdate: function(data) {
					if (data.position) {
						this.player.position.x = data.position.x;
						this.player.position.y = data.position.y;

						if (this.grid) {
							this.grid.renderAround(
								this.player.position.x,
								this.player.position.y,
								this.player.lineOfSight
							);
						}

						this.updateCamera();
					}
				},
				updateDisplay: function(data) {

				}
			}
		);
	}
);
