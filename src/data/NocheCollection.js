var
	kind = require('enyo/kind'),
	Collection = require('enyo/Collection');

module.exports = kind({
	name: 'B.NocheCollection',
	kind: Collection,
	source: 'NocheSource'
});
