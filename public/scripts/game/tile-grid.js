'use strict';

define(['pixi', 'game/tiled-sprite', 'game/tiled-texture'],
	function(pixi, TiledSprite, TiledTexture) {
		return Object.define(pixi.Sprite,
			function TileGrid(image, tileSize, grid) {
				if (!grid.length)
					throw 'The tile grid may not be given an empty grid';

				var self = this

				this.grid = grid;
				this.tileSize = tileSize;
				this.renderedTiles = new Array(this.grid.length);
				for (var x = 0; x < this.grid.length; x++) {
					this.renderedTiles[x] = new Array(this.grid[x].length);
				}

				var baseTexture = pixi.Texture.fromImage(image);
				baseTexture.addEventListener('update', function() {
					var tiledTexture = new TiledTexture(baseTexture, self.tileSize, self.tileSize);
					self._tiledSprite = new TiledSprite(tiledTexture);
					self._gridTexture = new pixi.RenderTexture(
						grid.length * self.tileSize, 
						grid[0].length * self.tileSize
					);

					pixi.Sprite.call(self, self._gridTexture);

					if (self.onloaded)
						self.onloaded();
				});
			}, {
				renderAround: function(x, y, range) {
					var range2 = range * range;
					for (var rX = -range; rX <= range; rX++) {
						var pX = x + rX;
						this._tiledSprite.position.x = pX * this.tileSize;
						for (var rY = -range; rY <= range; rY++) {
							var pY = y + rY; 
							this._tiledSprite.position.y = pY * this.tileSize;
							
							var dist = rX * rX + rY * rY;
							if (dist <= range2) {
								if (!this.renderedTiles[pX][pY]) {
									this._tiledSprite.tileY = this.grid[pX][pY];
									this._gridTexture.render(this._tiledSprite);
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