'use strict';

define(
	function() {
		var utils = {
			polyfills: {
				mouseOffset: function(evt) {
					if (!('offsetX' in evt)) {
						var target = evt.target || evt.srcElement;
						var rect = target.getBoundingClientRect();
						evt.offsetX = evt.clientX - rect.left;
						evt.offsetY = evt.clientY - rect.top;
					}

				}
			}
		};

		return utils;
	}
);