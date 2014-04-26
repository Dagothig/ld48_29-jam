'use strict';

define(['pixi', 'input-manager', 'states/game-state'],
	function(pixi, InputManager, GameState) {
		return Object.define(
			function Game(container) {
				this.container = container;
				this.container.tabIndex = 1;

				this.initRenderer();

				this.initFocusManagement();

				this.initInput();

				this.initGameLoop();

				this.currentState = new GameState(this);
			}, {
				initRenderer: function() {
					pixi.scaleModes.DEFAULT = pixi.scaleModes.NEAREST;
					this.renderer = pixi.autoDetectRenderer();
					this.container.appendChild(this.renderer.view);

					var self = this;
					this.resize = function() {
						self.renderer.resize(self.renderer.view.offsetWidth, self.renderer.view.offsetHeight);
						if (self.onresize)
							self.onresize();
					}
					window.addEventListener('resize', this.resize);
					this.resize();
				},
				initFocusManagement: function() {
					var self = this;

					this.hasFocus = document.activeElement === this.container;
					this.onblur = function() {
						self.hasFocus = false;
						self.focusOverlay.style.display = 'block';
					};
					this.onfocus = function() {
						self.hasFocus = true;
						self.focusOverlay.style.display = 'none';
					};
					this.container.addEventListener('blur', this.onblur);
					this.container.addEventListener('focus', this.onfocus);
					document.addEventListener('blur', this.onblur);
					document.addEventListener('focus', this.onfocus);
					this.focusOverlay = document.createElement('div');
					this.focusOverlay.className = 'overlay focus';
					this.container.appendChild(this.focusOverlay);
				},
				initInput: function() {
					this.inputManager = new InputManager();
					this.inputManager.attachTo(this.container);
				},
				initGameLoop: function() {
					var self = this;
					var then = null;
					this.frame = function(timestamp) {
						var now = timestamp;
						if (then === null) {
							then = now;
							return requestAnimFrame(self.frame);
						}

						var delta = now - then;

						if (self.hasFocus){
							self.inputManager.update(delta);
							if (self.currentState)
								self.currentState.update(delta);
						}
						if (self.currentState)
							self.currentState.render(self.renderer);

						then = now;
						requestAnimFrame(self.frame);
					}
					requestAnimFrame(this.frame);
				},

				dispose: function() {
					throw "Not implemented sorry nope nada";
				}
			}
		);
	}
);
