var
	kind = require('enyo/kind');

var
	mdlMovie = require('./mdlMovie'),
	NocheCollection = require('./NocheCollection');

module.exports = kind({
	name: 'mdlMovieInfo',
	kind: NocheCollection,
	model: mdlMovie,
	options: {
		parse: true
	},
	parse: function (data) {
		if (data.movie) {
			data.movie.path = this.get('path');
			data.movie.host = this.app.get('fileServerHost');
		}
		return data.movie;
	}
});
