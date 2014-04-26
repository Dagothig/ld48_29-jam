'use strict';

Object.SUCH_CONSTANT = -2;

Object.shortProps = function shortProps(obj, props) {
	for (var key in props)
		Object.defineProperty(obj, key, Object.getOwnPropertyDescriptor(props, key));
}
/**
 * Defines the given object, supporting multiple prototypal inheritance and
 * efficient prototypal definitions of properties
 *
 * takes at least 1 argument, it being the constructor function
 * 
 * the constructor can then be followed by a props argument, that is a regular
 * javascript object whose every property will be defined on the given object
 * this allows shorthands such as get [name] to be used and avoids the general
 * Object.defineProperty(obj.prototype, [name], definition) mcguffin otherwise
 * needed with accessor definitions
 *
 * the constuctor can be PRECEDED by any number of ancestor parents that will each have their
 * prototype successively applied to the object. the order of application is from first to last
 * the last being the only one that the object will truly be an instance of:
 * given a, b ancestors for c function, c will only be an ancestor of b, despite having
 * the fields of a. this is because there is no way for a prototype to respond to multiple
 * parent prototypes and the next best thing is to simply redefine every property that we
 * want to inherit from the parent
 * note: this means that any update to the secondary parents' prototype will not
 * be update on the child, only the main parent updates will affect it
 *
 * example call: 
 * define(secondaryParentA, secondaryParentB, mainParent, 
 * 		function constructor() {
 *    }, {
 *			propertyA:function(){}, 
 *			get propertyB() {}
 *    }
 * );
 *
**/
Object.define = function define() {
	var shift = 1, props = arguments[arguments.length - shift];
	if (!(props instanceof Function))
		shift++;

	var constructor = arguments[arguments.length - shift++];

	for (var i = arguments.length - shift; i >= 0; i--) {
		if (i === arguments.length - shift) { // Main ancestor
			constructor.prototype = Object.create(arguments[i].prototype);
		} else { // All the others 
			Object.shortProps(constructor.prototype, arguments[i].prototype);
		}
	}
	Object.shortProps(constructor.prototype, props);

	return constructor.prototype.constructor = constructor;
}