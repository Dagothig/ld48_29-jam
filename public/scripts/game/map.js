'use strict';

define(['pixi', 'game/player'],
	function(pixi, Player) {
		return Object.define(
			function Map(backgroundColor, tileSize) {
				this.stage = new pixi.Stage(backgroundColor);
				this.container = new pixi.SpriteBatch();
				this.stage.addChild(this.container);
				this.actors = [];
				this.tileSize = tileSize;
				this.renderedActors = {};
			}, {
				addActor: function(actor) {
					var i = this.actors.length;
					var added = false;
					if (i !== 0) {
						while (i--) {
							if (this.actors[i].zOrder < actor.zOrder) {
								this.actors.splice(i + 1, 0, actor);
								this.container.children.splice(i + 1, 0, actor.sprite);
								added = true;
								break;
							}
						}
					}
					if (!added) {
						this.actors.splice(0, 0, actor);
						this.container.children.splice(0, 0, actor.sprite);
					}
				},
				update: function(delta) {
					var i = this.actors.length;
					while (i--) {
						var actor = this.actors[i];
						if (actor.needsZUpdate) {
							this.updateActorOrder(actor, i);
						}
						actor.update(delta);

						if (actor.shouldBeRemoved) {
							this.actors.splice(i, 1);
							this.container.children.splice(i, 1);
						}
					}
				},
				updateActorOrder: function(actor, currentIndex) {
					return;
					actor.needsZUpdate = false;

					// Check down the list
					for (var i = currentIndex; i--;) {
						var current = this.actors[i];
						if (current.zOrder < actor.zOrder) {
							if (i < currentIndex - 1) {
								return;
							} else {
								break;
							}
						} else {
							this.actors[i] = actor;
							this.actors[i + 1] = current;
						}
					}

					// Check up the list
					for (var i = currentIndex, len = this.actors.length; ++i < len;) {
						var current = this.actors[i];
						if (current.zOrder > actor.zOrder) {
							if (i > currentIndex + 1) {
								return;
							} else {
								break;
							}
						} else {
							this.actors[i] = actor;
							this.actors[i - 1] = current;
						}
					}
				},

				updateRenderActors: function(data) {
					for (var key in data) {
						var current = this.renderedActors[key];
						var toDisplay = data[key];
						if (current) {
							if (current.sprite) {
								current.position.x = toDisplay.position.x;
								current.position.y = toDisplay.position.y;
								current.updated = true;
							}
						} else {
							var actor = new Player(this);
							actor.position.x = toDisplay.position.x;
							actor.position.y = toDisplay.position.y;
							actor.updated = true;
							this.renderedActors[key] = actor;
							this.addActor(actor);
						}
					}
					for (var key in this.renderedActors) {
						var current = this.renderedActors[key];
						if (!current.updated) {
							delete this.renderedActors[key];
							var i = this.actors.indexOf(current);
							this.actors.splice(i, 1);
							this.container.children.splice(i, 1);
						}
						current.updated = false;
					}
				},

				get cameraX() {
					return -this.container.position.x;
				},
				set cameraX(val) {
					this.container.position.x = -val;
					if (this.wrapping)
						this.updateWrapping();
				},

				get cameraY() {
					return -this.container.position.y;
				},
				set cameraY(val) {
					this.container.position.y = -val;
					if (this.wrapping)
						this.updateWrapping();
				},

				get backgroundColor() {
					return this.stage.backgroundColor;
				},
				set backgroundColor(val) {
					this.stage.backgroundColor = val;
				},

				activateWrapping: function(width, height) {
					this.wrapping = true;
					this.width = width;
					this.height = height;
					this.extraContainers = [
						new pixi.SpriteBatch(),
						new pixi.SpriteBatch(),
						new pixi.SpriteBatch()
					];
					
					var self = this;
					this.extraContainers.forEach(function(container) {
						container.children = self.container.children;
						self.stage.addChild(container);
					});

					this.updateWrapping()
				},
				updateWrapping: function() {
					var self = this;
					this.extraContainers.forEach(function(container) {
						container.position.x = self.container.position.x;
						container.position.y = self.container.position.y;
					});

					if (self.container.position.x > 0) {
						this.extraContainers[0].position.x -= this.width * this.tileSize;
						this.extraContainers[1].position.x -= this.width * this.tileSize;
					} else {
						this.extraContainers[0].position.x += this.width * this.tileSize;
						this.extraContainers[1].position.x += this.width * this.tileSize;
					}

					if (self.container.position.y > 0) {
						this.extraContainers[1].position.y -= this.height * this.tileSize;
						this.extraContainers[2].position.y -= this.height * this.tileSize;
					} else {
						this.extraContainers[1].position.y += this.height * this.tileSize;
						this.extraContainers[2].position.y += this.height * this.tileSize;
					}
				}
			}
		);
	}
);
