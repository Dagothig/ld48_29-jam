'use strict';

define(['pixi', 'game/tiled-sprite', 'game/tiled-texture'],
	function(pixi, TiledSprite, TiledTexture) {
		return Object.define(pixi.SpriteBatch,
			function TileGrid(image, map, grid) {
				if (!grid.length)
					throw 'The tile grid may not be given an empty grid';

				this.grid = grid;
				this.map = map;
				this.tileSize = map.tileSize;
				this.tWidth = this.grid.length;
				this.tHeight = this.grid[0].length;

				this._texture = new TiledTexture(pixi.getTexture(image), this.tileSize, this.tileSize);
				console.log(this._texture);
				pixi.SpriteBatch.call(this);

				this._buffer = [];

			}, {
				resetSpriteBuffer: function() {
					this.buffer = this._buffer.slice();
				},
				getSprite: function(tileY, posX, posY, alpha) {
					var sprite = this.buffer.pop();
					if (!sprite) {
						sprite = new TiledSprite(this._texture);
						this._buffer.push(sprite);
					}
					sprite.position.x = posX;
					sprite.position.y = posY;
					sprite.tileY = tileY;
					sprite.alpha = alpha;

					return sprite;
				},

				renderAround: function(x, y, range) {
					this.resetSpriteBuffer();
					this.children.length = 0;

					this.position.x = (-(range - x) * this.tileSize) - this.map.cameraX;
					this.position.y = (-(range - y) * this.tileSize) - this.map.cameraY;
					var range2 = range * range;
					for (var rX = -range; rX <= range; rX++) {
						for (var rY = -range; rY <= range; rY++) {
							var pX = (x + rX);
							while (pX >= this.tWidth) {
								pX -= this.tWidth;
							}
							while (pX < 0) {
								pX += this.tWidth;
							}

							var pY = (y + rY);
							while (pY >= this.tHeight) {
								pY -= this.tHeight;
							}
							while (pY < 0) {
								pY += this.tHeight;
							}

							var dist = rX * rX + rY * rY;
							if (dist + Object.SUCH_CONSTANT <= range2) {
								this.children.push(
									this.getSprite(
										this.grid[pX][pY], 
										(range + rX) * this.tileSize, 
										(range + rY) * this.tileSize,
										Math.pow((range2 - (dist + Object.SUCH_CONSTANT)) / range2, 2)
									)
								);
							}
						}
					}
				}

			}
		);
	}
);
