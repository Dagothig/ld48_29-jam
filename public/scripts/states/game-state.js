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
				this.map.addActor(this.player);
				this.objects = [];

				this.socket = io.connect('/');
				this.socket.on('map', function(data) {
					self.grid = new TileGrid('img-tileset', self.tileSize, data);
					self.grid.renderAround(
						self.player.position.x,
						self.player.position.y,
						self.player.lineOfSight
					);
					self.gridActor = new Actor(self.grid);
					self.gridActor.zOrder = -1;
					self.map.addActor(self.gridActor);
				});

				this.socket.on('display', function(data) {
					self.updateDisplay.call(self, data);
				});

				this.socket.on('update', function(data) {
					self.receiveUpdate.call(self, data);
				});

				function emitMovement(x, y) {
					self.socket.emit('action-request', {
						action: 'move',
						args: {x: x, y: y}
					});
				}
				var IM = this.game.inputManager;
				var movementKeys = [
					{
						key: IM.KEYS.LEFT,
						pressed: function() {
							emitMovement(-1, 0);
						}
					},
					{
						key: IM.KEYS.RIGHT,
						pressed: function() {
							emitMovement(1, 0);
						}
					},
					{
						key: IM.KEYS.UP,
						pressed: function() {
							emitMovement(0, -1);
						}
					},
					{
						key: IM.KEYS.DOWN,
						pressed: function() {
							emitMovement(0, 1);
						}
					}
				];
				movementKeys.forEach(function(movKey) {
					IM.bind(movKey.key, IM.ACTIONS.PRESSED, movKey.pressed);
				});

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
					this.map.updateRenderActors(data);
				}
			}
		);
	}
);
