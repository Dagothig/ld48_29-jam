'use strict';

define(['pixi', 'game/tiled-sprite', 'game/tiled-texture'],
	function(pixi, TiledSprite, TiledTexture) {
		return Object.define(pixi.Sprite,
			function TileGrid(image, tileSize, grid) {
				if (!grid.length)
					throw 'The tile grid may not be given an empty grid';

				this.grid = grid;
				this.tileSize = tileSize;
				this.tWidth = this.grid.length;
				this.tHeight = this.grid[0].length;

				var texture = new TiledTexture(pixi.getTexture(image), this.tileSize, this.tileSize);
				this._tiledSprite = new TiledSprite(texture);
				this._gridTexture = new pixi.RenderTexture(
					this.tWidth * this.tileSize, 
					this.tHeight * this.tileSize
				);
				pixi.Sprite.call(this, this._gridTexture);

			}, {
				renderAround: function(x, y, range) {
					if (this._gridTexture.width !== (range * 2 + 1) * this.tileSize ||
							this._gridTexture.height !== (range * 2 + 1) * this.tileSize
						) {
						this._gridTexture = new pixi.RenderTexture(
							(range * 2 + 1) * this.tileSize,
							(range * 2 + 1) * this.tileSize
						);
						this.setTexture(this._gridTexture);
					}
					this.position.x = (x - range) * this.tileSize;
					this.position.y = (y - range) * this.tileSize;
					var range2 = range * range, isFirst = true;
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
								this._tiledSprite.tileY = this.grid[pX][pY];
								this._gridTexture.render(
									this._tiledSprite,
									{
										x: (range + rX) * this.tileSize,
										y: (range + rY) * this.tileSize
									}, isFirst
								);
								isFirst = false;
							}
						}
					}
				}

			}
		);
	}
);
