(function (enyo, scope) {

	enyo.kind({
		name: 'mdlMovie',
		kind: 'enyo.Model',
		readOnly: true,
		options: {
			parse: true
		},
		primaryKey: 'path',
		parse: function (data) {
			this.prepareTitles(data);
			return data;
		},
		prepareTitles: function (data) {
			var title = (data.title || ''),
				suptitle = '',
				subtitle = '';

			if (title.match(/:/)) {
				suptitle = title.replace(/^(.*)\s*:.*$/, '$1');
				subtitle = title.replace(/^.*:\s*(.*)$/, '$1');
			}
			data.suptitle = suptitle;
			data.subtitle = subtitle;
		}
	});

	enyo.kind({
		name: 'mdlMovieInfo',
		kind: 'B.NocheCollection',
		model: 'mdlMovie',
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

})(enyo, this);