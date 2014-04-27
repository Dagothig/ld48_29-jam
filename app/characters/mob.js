module.exports = function(Character) {
	return Object.define(
		Character,
		function Mob(x, y) {
			Character.call(this);

			this.position.x = x;
			this.position.y = y;
		}, {

		}
	);
}
