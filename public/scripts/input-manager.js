'use strict';

var InputAction, InputKey;
define(['utils'],
	function(utils) {
		InputAction = {
			PRESSED: 0,
			DOWN: 1,
			RELEASED: 2
		};
		InputKey = {
			LEFT_MOUSE: -1,
			MIDDLE_MOUSE: -2,
			RIGHT_MOUSE: -3,
			ESCAPE: 27,
			SHIFT: 16,
			CONTROL: 17,
			SPACE: 32,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40
		};
		for (var letter = 'A'.charCodeAt(0), len = 'Z'.charCodeAt(0); letter <= len; letter++) {
			InputKey[String.fromCharCode(letter)] = letter;
		}
		for (var letter = '0'.charCodeAt(0), len = '9'.charCodeAt(0); letter <= len; letter++) {
			InputKey[String.fromCharCode(letter)] = letter;
		}			

		var InputManager = Object.define(
			function InputManager() {
				var self = this;
				this._keydown = function(evt) {
					if (!self.keys[evt.keyCode])
						self.triggerEvent.call(self, InputAction.PRESSED, evt.keyCode);
						
					self.keys[evt.keyCode] = {};
				};
				this._keyup = function(evt) {
					delete self.keys[evt.keyCode];
					self.triggerEvent.call(self, InputAction.RELEASED, evt.keyCode);
				};

				this._mousedown = function(evt) {
					utils.polyfills.mouseOffset(evt);

					if (!self.keys[-(evt.button + 1)]) {
						self.triggerEvent.call(self, 
							InputAction.PRESSED, 
							-(evt.button + 1), 
							{x: evt.offsetX, y: evt.offsetY}
						);
					}

					self._lastKnownX = evt.offsetX;
					self._lastKnownY = evt.offsetY;

					self.keys[-(evt.button + 1)] = {
						get x() {
							return self._lastKnownX;
						},
						get y() {
							return self._lastKnownY;
						}
					};
				};
				this._mousemove = function(evt) {
					utils.polyfills.mouseOffset(evt);

					self._lastKnownX = evt.offsetX;
					self._lastKnownY = evt.offsetY;
				};
				this._mouseup = function(evt) {
					utils.polyfills.mouseOffset(evt);

					delete self.keys[-(evt.button + 1)];
					self.triggerEvent.call(self, 
						InputAction.RELEASED, 
						-(evt.button + 1), 
						{x: evt.offsetX, y: evt.offsetY}
					);
				};

				this.keys = {};
				this.listeners = [];
				for (var key in InputAction)
					this.listeners[InputAction[key]] = [];
			}, {
				update: function(delta) {
					for (var key in this.keys) {
						var val = this.keys[key];
						val.delta = delta;
						this.triggerEvent(
							InputAction.DOWN, 
							key, 
							val
						);
					}
				},
				triggerEvent: function(action, key, args) {
					if (this.listeners[action] && this.listeners[action][key]) {
						this.listeners[action][key].forEach(function(handler) {
							handler.call(this, args);
						});
					}
				},

				attachTo: function(element) {
					if (this._element)
						this.detach();

					this._element = element;
					element.addEventListener('keydown', this._keydown);
					element.addEventListener('keyup', this._keyup);
					element.addEventListener('mousedown', this._mousedown);
					element.addEventListener('mouseup', this._mouseup);
					element.addEventListener('mousemove', this._mousemove);
				},
				detach: function() {
					this._element.removeEventListener('keydown', this._keydown);
					this._element.removeEventListener('keyup', this._keyup);
					this._element.removeEventListener('mousedown', this._mousedown);
					this._element.removeEventListener('mouseup', this._mouseup);
					this._element.removeEventListener('mousemove', this._mousemove);
				},

				bind: function(key, action, func) {
					if (this.listeners[action][key]) {
						this.listeners[action][key].push(func);
					} else {
						this.listeners[action][key] = [func];
					}
				},
				unbind: function(key, action, func) {
					var array = this.listeners[action][key];
					if (!array)
						return;

					for (var i = array.length; i--;) {
						if (array[i] === action) {
							array.splice(i, 1);
						}
					}

					if (array.length === 0)
						delete this.listeners[action][key];
				}
			}
		);

		InputManager.KEYS = InputKey;
		InputManager.ACTIONS = InputAction;

		return InputManager;
	}
);