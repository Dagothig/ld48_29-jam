'use strict';

define(['pixi'],
	function(pixi) {
		return Object.define(
			function Map(backgroundColor) {
				this.stage = new pixi.Stage(backgroundColor);
				this.container = new pixi.SpriteBatch();
				this.stage.addChild(this.container);
				this.actors = [];
			}, {
				addActor: function(actor) {
					var i = this.actors.length;
					var added = false;
					if (i !== 0) {
						while (i--) {
							if (this.actors[i].zOrder < actor.zOrder) {
								this.actors.splice(i, 0, actor);
								this.container.children.splice(i, 0, actor.sprite);
								added = true;
								break;
							}
						}
					}
					if (!added) {
						this.actors.splice(0, 0, actor);
						this.container.children.splice(0, 0, actor.sprite);
					}
					console.log(this.container.children);
				},
				update: function(delta) {
					var i = this.actors.length;
					while (i--) {
						var actor = this.actors[i];
						if (actor.needsZUpdate) {
							this.updateActorOrder(actor, i);
						}
						actor.update(delta);

						if (actor.shouldBeRemoved)
							this.actors.splice(i, 1);
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

				get cameraX() {
					return -this.container.position.x;
				},
				set cameraX(val) {
					this.container.position.x = -val;
				},

				get cameraY() {
					return -this.container.position.y;
				},
				set cameraY(val) {
					this.container.position.y = -val;
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
