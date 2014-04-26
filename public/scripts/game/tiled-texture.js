'use strict';

define(['pixi'],
	function(pixi) {
		var TiledTexture = Object.define(
			function TiledTexture(texture, tw, th) {
				this.tilesX = texture.width / tw;
				this.tilesY = texture.height / th;
				if (!!((this.tilesX % 1) || (this.tilesY % 1)))
					throw ("The texture size is not a multiple of the tile size:", this.tilesX, this.tilesY);

				this.tiles = new Array(this.tilesX);
				for (var x = 0; x < this.tilesX; x++) {
					this.tiles[x] = new Array(this.tilesY);
					for (var y = 0; y < this.tilesY; y++) {
						var rect = new pixi.Rectangle(x * tw, y * th, tw, th);
						this.tiles[x][y] = new pixi.Texture(texture, rect);
					}
				}
			}, {
				getTile: function(x, y) {
					return this.tiles[x][y];
				}
			}
		);
		TiledTexture.fromFile = function(filename, tw, th, callback) {
			var texture = pixi.Texture.fromImage(filename);
			texture.addEventListener('update', function() {
				var tiledTexture = new TiledTexture(texture, tw, th);
				callback(tiledTexture);
			});
		}

		return TiledTexture;
	}
);
