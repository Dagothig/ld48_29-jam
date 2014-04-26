'use strict';

define(['game/tiled-sprite'],
	function(TiledSprite) {
		return Object.define(TiledSprite,
			function AnimatedSprite(tiledTexture, fps, loop) {
				this.fps = fps;
				this.loop = loop;
				this.currentFrame = this.frameDuration;
				TiledSprite.call(this, tiledTexture);
			}, {
				get fps() {
					return this._fps;
				},
				set fps(val) {
					this._fps = val;
					this.frameDuration = 1000 / val;
				},
				update: function(delta) {
					this.currentFrame -= delta;
					while (this.currentFrame < 0) {
						this.currentFrame += this.frameDuration;
						if (!this.loop) {
							var tmp = this.tileX + 1;
							if (tmp < this.tilesX) {
								this.tileX++;
							}
						} else {
							this.tileX++;
						}
					}
				}
			}
		);
	}
);