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
					self.player.remove();
				});

				// Movement (TODO extract this)
				var lastCall = Date.now();
				function emitMovement(x, y) {
					if (Date.now() - lastCall > 100) {
						lastCall = Date.now();
						self.socket.emit('action-request', {
							action: 'move',
							args: {x: x, y: y}
						});
					}
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
				var keyCount = 0;
				movementKeys.forEach(function(movKey) {
					IM.bind(movKey.key, IM.ACTIONS.PRESSED, movKey.pressed);
				});
				movementKeys.forEach(function(movKey) {
					IM.bind(movKey.key, IM.ACTIONS.RELEASED, function(){
						if (IM.keys[IM.KEYS.UP]) {
							emitMovement(0, -1);
						} else if (IM.keys[IM.KEYS.LEFT]) {
							emitMovement(-1, 0);
						} else if (IM.keys[IM.KEYS.RIGHT]) {
							emitMovement(1, 0);
						} else if (IM.keys[IM.KEYS.DOWN]) {
							emitMovement(0, 1);
						} else {
							self.socket.emit('action-request', {
								action: 'stopMove',
								args: {}
							});
						}
					});
				});

				// Orientation
				function useItem(direction) {
					self.socket.emit('action-request', {
						action: 'useItem',
						args: {
							itemNo: self.player.selectedItemNo,
							orientation: direction
						}
					});
				}

				function dropOrSwapItem() {
					if (self.selectedTreasureElement) {
						self.socket.emit('action-request', {
							action: 'swapItem',
							args: {
								itemNo: self.player.selectedItemNo,
								treasureItemNo: self.selectedTreasureNo
							}
						});
					} else {
						self.socket.emit('action-request', {
							action: 'dropItem',
							args: {
								itemNo: self.player.selectedItemNo
							}
						})
					}
				}
				IM.bind(IM.KEYS.A, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE === "qwerty") {
						useItem('left');
					} else {
						dropOrSwapItem();
					}
				});
				IM.bind(IM.KEYS.Q, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE === "azerty") {
						useItem('left');
					} else {
						dropOrSwapItem();
					}
				});
				IM.bind(IM.KEYS.W, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE === "qwerty") {
						useItem('up');
					}
				});
				IM.bind(IM.KEYS.Z, IM.ACTIONS.PRESSED, function() {
					if (window.KB_MODE === "azerty") {
						useItem('up');
					}
				});
				IM.bind(IM.KEYS.S, IM.ACTIONS.PRESSED, function() {
						useItem('down');
				});
				IM.bind(IM.KEYS.D, IM.ACTIONS.PRESSED, function() {
						useItem('right');
				});

				this.itemSlots = [];
				for (var i = 0; i < 4; i++) {
					this.itemSlots[i] = document.getElementById('item-slot-' + i);
					(function(key) {
						IM.bind(IM.KEYS[key + 1], IM.ACTIONS.PRESSED, function() {
							self.player.selectedItemNo = key;
							for (var i = 0; i < 4; i++)
								self.itemSlots[i].className = self.itemSlots[i].className.replace(' active', '');
							self.itemSlots[key].className += ' active';
						});
					}(i));
				}
				this.player.selectedItemNo = 0;
				this.itemSlots[0].className = ' active';

				IM.bind(IM.KEYS.E, IM.ACTIONS.PRESSED, function() {
					if (self.treasureToolbar.children.length > 0) {
						self.selectedTreasureElement.className = self.selectedTreasureElement.className.replace(' active', '');
						self.selectedTreasureNo = (self.selectedTreasureNo + 1) % self.treasureToolbar.children.length;
						self.selectedTreasureElement = self.treasureToolbar.children[self.selectedTreasureNo];
						self.selectedTreasureElement.className += ' active';
					}
				});

				this.itemsToolbar = document.getElementById('items-toolbar');
				this.treasureToolbar = document.getElementById('treasure-toolbar');
				this.selectedTreasureNo = null;
				this.selectedTreasureElement = null;

				this.openTreasureInterface = function(items) {
					self.closeTreasureInterface();
					self.itemsToolbar.className = 'comparison';
					self.treasureToolbar.className = 'comparison';
					items.forEach(function(item) {
						var itemElement = document.createElement('li');
						itemElement.className = 'toolbar-icon icon-' + item;
						self.treasureToolbar.appendChild(itemElement);
					});
					if (items.length) {
						self.selectedTreasureNo = 0;
						self.selectedTreasureElement = self.treasureToolbar.children[self.selectedTreasureNo];
						self.selectedTreasureElement.className += ' active';
					}
				}
				this.closeTreasureInterface = function() {
					self.itemsToolbar.className = '';
					self.treasureToolbar.className = '';
					self.selectedTreasureNo = null;
					self.selectedTreasureElement = null;
					while (self.treasureToolbar.children.length)
						self.treasureToolbar.children[0].remove();
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

					if ('items' in data) {
						this.player.items = data.items;
						for (var i = 0; i < 4; i++) {
							var isActive = false;
							if (this.itemSlots[i].className.indexOf('active') !== -1) {
								isActive = true;
							}
							this.itemSlots[i].className = ' icon-' + this.player.items[i] + (isActive ? ' active' : '');
						}
					}
				},
				updateDisplay: function(data) {
					this.map.updateRenderActors(data, this.player);
				}
			}
		);
	}
);
