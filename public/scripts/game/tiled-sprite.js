'use strict';

define(['pixi'],
	function(pixi) {
		return Object.define(pixi.Sprite,
			function TiledSprite(tiledTexture) {
				this._tiledTexture = tiledTexture;
				this._tileX = 0;
				this._tileY = 0;

				pixi.Sprite.call(this, tiledTexture.getTile(0, 0));

				var self = this;
				this._decal = {
					get x() {
						return self.anchor.x * self.width;
					},
					set x(val) {
						self.anchor.x = val / self.width;
					},
					get y() {
						return self.anchor.y * self.height;
					},
					set y(val) {
						self.anchor.y = val / self.height;
					}
				};
			}, {
				get tileX() {
					return this._tileX;
				},
				set tileX(val) {
					this._tileX = val % this.tilesX;
					if (this._tileX < 0)
						this._tileX += this.tilesX;
					this.setTexture(this._tiledTexture.getTile(this.tileX, this.tileY));
				},

				get tileY() {
					return this._tileY;
				},
				set tileY(val) {
					this._tileY = val % this.tilesY;
					if (this._tileY < 0)
						this._tileY += this.tilesY;
					this.setTexture(this._tiledTexture.getTile(this.tileX, this.tileY));
				},

				get tilesX() {
					return this._tiledTexture.tilesX;
				},
				get tilesY() {
					return this._tiledTexture.tilesY;
				},

				get decal() {
					return this._decal;
				},
				set decal(val) {
					this._decal.x = val.x;
					this._decal.y = val.y;
				}
			}
		);
	}
);
