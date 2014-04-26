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
					if (self.grid)
						window.location.reload();
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

				this.socket.on('death', function() {
					console.log("AW FAK");
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
				function useItem(direction) {
					self.socket.emit('action-request', {
						action: 'useItem',
						args: {
							itemNo: self.player.selectedItemNo,
							orientation: 'left'
						}
					});
				}

				IM.bind(IM.KEYS.A, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "qwerty") {
						useItem('left');
					}
				});
				IM.bind(IM.KEYS.Q, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "azerty") {
						useItem('left');
					}
				});
				IM.bind(IM.KEYS.W, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "qwerty") {
						useItem('up');
					}
				});
				IM.bind(IM.KEYS.Z, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE == "azerty") {
						useItem('up');
					}
				});
				IM.bind(IM.KEYS.S, IM.ACTIONS.PRESSED, function() {
						useItem('down');
				});
				IM.bind(IM.KEYS.D, IM.ACTIONS.PRESSED, function() {
						useItem('right');
				});

				var itemSlots = [];
				for (var i = 0; i < 4; i++) {
					itemSlots[i] = document.getElementById('item-slot-' + i);
					(function(key) {
						IM.bind(IM.KEYS[key + 1], IM.ACTIONS.PRESSED, function() {
							self.player.selectedItemNo = key;
							for (var i = 0; i < 4; i++)
								itemSlots[i].className = '';
							itemSlots[key].className = 'active';
						});
					}(i));
				}
				this.player.selectedItemNo = 0;
				itemSlots[0].className = 'active';

				this.itemsToolbar = document.getElementById('items-toolbar');
				this.treasureToolbar = document.getElementById('treasure-toolbar');
				this.openTreasureInterface = function(items) {
					this.closeTreasureInterface();
					this.itemsToolbar.className = 'comparison';
					this.treasureToolbar.className = 'comparison';
					items.forEach(function(item) {
						var itemElement = document.createElement('li');
						itemElement.className = 'toolbar-icon icon-' + item;
						self.treasureToolbar.appendChild(itemElement);
					});
				}
				this.closeTreasureInterface = function() {
					this.itemsToolbar.className = '';
					this.treasureToolbar.className = '';
					while (this.treasureToolbar.children.length)
						this.treasureToolbar.children[0].remove();
				}
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
					if ('tileY' in data) {
						this.player.sprite.tileY = data.tileY;
					}

					if ('health' in data) {
						if (!this.healthAmount)
							this.healthAmount = document.getElementById('health-amount');
						this.healthAmount.innerHTML = data.health;
						this.player.health = data.health;
					}

					if ('lineOfSight' in data) {
						this.player.lineOfSight = data.lineOfSight;
					}

					if ('treasure' in data) {
						this.openTreasureInterface(data.treasure);
					} else {
						this.closeTreasureInterface();
					}
				},
				updateDisplay: function(data) {
					this.map.updateRenderActors(data, this.player);
				}
			}
		);
	}
);
