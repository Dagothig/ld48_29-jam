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

				this.renderedTiles = new Array(this.tWidth);
				for (var x = 0; x < this.grid.length; x++) {
					this.renderedTiles[x] = new Array(this.tHeight);
				}

				var texture = new TiledTexture(pixi.getTexture('img-tileset'), this.tileSize, this.tileSize);
				this._tiledSprite = new TiledSprite(texture);
				this._gridTexture = new pixi.RenderTexture(
					this.tWidth * this.tileSize, 
					this.tHeight * this.tileSize
				);
				pixi.Sprite.call(this, this._gridTexture);

			}, {
				renderAround: function(x, y, range) {
					var range2 = range * range;
					for (var rX = -range; rX <= range; rX++) {
						for (var rY = -range; rY <= range; rY++) {
							var pX = (x + rX) % this.tWidth;
							var pY = (y + rY) % this.tHeight;

							while (pX < 0)
								pX += this.tWidth;
							while (pY < 0)
								pY += this.tHeight;

							var dist = rX * rX + rY * rY;
							if (dist + Object.SUCH_CONSTANT <= range2) {
								if (!this.renderedTiles[pX][pY]) {
									this._tiledSprite.tileY = this.grid[pX][pY];
									this._gridTexture.render(
										this._tiledSprite,
										{
											x: pX * this.tileSize,
											y: pY * this.tileSize
										}
									);
									this.renderedTiles[pX][pY] = true;
								}
							}
						}
					}
				}

			}
		);
	}
);
