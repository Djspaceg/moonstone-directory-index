/// FileSystem Model //////////////////////////////////////
var
	kind = require('enyo/kind');

var
	mdlDirectory = require('./mdlDirectory'),
	NocheCollection = require('./NocheCollection');

var
	NocheSource = require('./NocheSource');

new NocheSource({name: 'NocheSource'});

module.exports = kind({
	name: 'mdlFileSystem',
	kind: NocheCollection,
	model: mdlDirectory,
	options: {
		parse: true
	},
	// source: 'noche',
	// defaultSource: 'noche',
	// published: {
		// host: function() { return this.app.get('fileServerHost'); }
	// },
	// computed: {
		// host: [{cached: true}]
	// },
	// primaryKey: 'name',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		data.filesystem[0].app = this.app;
		// console.log('mdlFileSystem: B.NocheCollection:', this);
		return data.filesystem;
	}
});
