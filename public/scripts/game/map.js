'use strict';

define(['pixi', 'game/player', 'game/actor'],
	function(pixi, Player, Actor) {
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

				updateRenderActors: function(data, player) {
					var range2 = player.lineOfSight * player.lineOfSight;
					for (var key in data) {
						var current = this.renderedActors[key];
						var toDisplay = data[key];
						if (!current) {
							console.log(toDisplay);
							var tileW = toDisplay.tileW || 24;
							var tileH = toDisplay.tileH || 24;
							if (toDisplay.animated) {
									current = Actor.fromAnimated(toDisplay.sprite, toDisplay.animated, this, tileW, tileH);
							} else {
								current = new Player(this, toDisplay.sprite, tileW, tileH);
							}
							this.renderedActors[key] = current;
							if (toDisplay.zOrder) {
								current.zOrder = toDisplay.zOrder;
							}
							this.addActor(current);
						}
						current.position.x = toDisplay.position.x;
						current.position.y = toDisplay.position.y;

						if ('tileX' in toDisplay)
							current.sprite.tileX = toDisplay.tileX;
						if ('tileY' in toDisplay)
							current.sprite.tileY = toDisplay.tileY;

						if ('rotation' in toDisplay)
							current.sprite.rotation = toDisplay.rotation;

						if (toDisplay.decal)
							current.sprite.decal = toDisplay.decal;
						if (toDisplay.rotationCentered) {
							current.sprite.anchor.x = 0.5;
							current.sprite.anchor.y = 0.5;
							current.position.x += 0.5;
							current.position.y += 0.5;
						}

						// Use diff to calculate alpha
						var diffX = toDisplay.position.x - player.position.x;
						var diffY = toDisplay.position.y - player.position.y;
						var dist = diffX * diffX + diffY * diffY;
						current.sprite.alpha =
							Math.pow((range2 - (dist + Object.SUCH_CONSTANT)) / range2, 2);

						current.updated = true;
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
					this.container.position.x = Math.round(-val);
				},

				get cameraY() {
					return -this.container.position.y;
				},
				set cameraY(val) {
					this.container.position.y = Math.round(-val);
				},

				get backgroundColor() {
					return this.stage.backgroundColor;
				},
				set backgroundColor(val) {
					this.stage.backgroundColor = val;
				}
			}
		);
	}
);
