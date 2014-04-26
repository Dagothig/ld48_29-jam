'use strict';

define(['pixi'],
	function(pixi) {
		return Object.define(
			function StateManager(container) {

				this.container = container;
				
				this.renderer = pixi.autoDetectRenderer();
				this.container.appendChild(this.renderer.view);

				this.overlay = document.createElement('div');
				this.overlay.className = 'overlay';
				this.container.appendChild(this.overlay);
				this._fadeStack = [];
			}, {
				fadeTo: function(color, opacity, duration, callback) {
					if (this._fadeStack.length > 0)
						this._fadeStack.push([color, opacity, duration, callback]);
					else {
						this.overlay.style.transition = 'background-color ' + duration + 'ms, opacity ' + duration + 'ms';
						this.overlay.style.backgroundColor = color;
						this.overlay.style.opacity = opacity;
						this._currentFadeCallback = callback;
						this._currentTimeout = window.setTimeout(callback, duration);		
					
						if (this._fadeStack.length > 0)
							this.fadeTo.apply(this, this._fadeStack.shift());
					}
				},

				update: function(delta),
				render: function(renderer) {

				}
			}
		)
	}
);