'use strict';

define(['game/map', 'io', 'pixi', 'game/tile-grid', 'game/actor', 'game/player'],
	function(Map, io, pixi, TileGrid, Actor, Player) {
		return Object.define(
			function GameState(game) {
				var self = this;
				this.game = game;
				this.game.onresize = function() {
					self.updateCamera();
					if (self.grid) {
						self.grid.renderAround(
							self.player.position.x,
							self.player.position.y,
							self.player.lineOfSight
						);
					}
				}
				this.tileSize = 24;
				this.map = new Map(0x201015, this.tileSize);
				this.player = new Player(this.map);
				this.map.addActor(this.player);
				this.objects = [];

				this.socket = io.connect('/');
				this.socket.on('map', function(data) {
					self.grid = new TileGrid('img-tileset', self.map, data);
					self.grid.renderAround(
						self.player.position.x,
						self.player.position.y,
						self.player.lineOfSight
					);
					self.map.stage.addChildAt(self.grid, 0);
					self.map.grid = self.grid;
				});

				this.socket.on('display', function(data) {
					self.updateDisplay.call(self, data);
				});

				this.socket.on('update', function(data) {
					self.receiveUpdate.call(self, data);
				});

				// Movement (TODO extract this)
				function emitMovement(x, y) {
					self.socket.emit('action-request', {
						action: 'move',
						args: {x: x, y: y}
					});
				}
				var IM = this.game.inputManager;
				var movementKeys = [{
						key: IM.KEYS.LEFT,
						pressed: function() {
							emitMovement(-1, 0);
						}
					},{
						key: IM.KEYS.RIGHT,
						pressed: function() {
							emitMovement(1, 0);
						}
					},{
						key: IM.KEYS.UP,
						pressed: function() {
							emitMovement(0, -1);
						}
					},{
						key: IM.KEYS.DOWN,
						pressed: function() {
							emitMovement(0, 1);
						}
					}];
				movementKeys.forEach(function(movKey) {
					IM.bind(movKey.key, IM.ACTIONS.PRESSED, movKey.pressed);
				});
				movementKeys.forEach(function(movKey) {
					IM.bind(movKey.key, IM.ACTIONS.RELEASED, function(){
						self.socket.emit('action-request', {
							action: 'stopMove',
							args: {}
						});
					});
				});

				// Orientation
				IM.bind(IM.KEYS.A, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "qwerty") {
					}
				});
				IM.bind(IM.KEYS.Q, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "azerty") {
					}
				});
				IM.bind(IM.KEYS.W, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "qwerty") {
					}
				});
				IM.bind(IM.KEYS.Z, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "azerty") {

					}
				});
				IM.bind(IM.KEYS.S, IM.ACTIONS.PRESSED, function() {

				});
				IM.bind(IM.KEYS.D, IM.ACTIONS.PRESSED, function() {

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

						this.updateCamera();
						
						if (this.grid) {
							this.grid.renderAround(
								this.player.position.x,
								this.player.position.y,
								this.player.lineOfSight
							);
						}
					}
					if (typeof data.tileY !== 'undefined') {
						this.player.sprite.tileY = data.tileY;
					}
				},
				updateDisplay: function(data) {
					this.map.updateRenderActors(data, this.player);
				}
			}
		);
	}
);
