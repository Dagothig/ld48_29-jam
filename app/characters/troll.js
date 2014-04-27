module.exports = function(Mob) {
	return Object.define(
		Mob,
		function Troll(x, y) {
			Mob.call(this, x, y);

			this.sprite = 'img-troll';
		}, {

		}
	);
}
