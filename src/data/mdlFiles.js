/// Files Collection //////////////////////////////////////
var
	kind = require('enyo/kind');

var
	NocheCollection = require('./NocheCollection'),
	mdlFile = require('./mdlFile');

module.exports = kind({
	name: 'mdlFiles',
	kind: NocheCollection,
	model: mdlFile,
	options: {
		parse: true
	},
	// primaryKey: 'name',
	parse: function (data) {
		// Give our precious app reference to all of our file models
		for (var i = data.length - 1; i >= 0; i--) {
			data[i].app = this.app;
		}

		return data;
	}
});
