var
	kind = require('enyo/kind'),
	Model = require('enyo/Model');

module.exports = kind({
	name: 'mdlMovie',
	kind: Model,
	readOnly: true,
	options: {
		parse: true
	},
	primaryKey: 'path',
	parse: function (data) {
		data = this.prepareTitles(data);
		return data;
	},
	prepareTitles: function (data) {
		var title = (data.title || ''),
			suptitle = title,
			subtitle = '';

		if (title.match(/:/)) {
			suptitle = title.replace(/^(.*)\s*:.*$/, '$1');
			subtitle = title.replace(/^.*:\s*(.*)$/, '$1');
		}
		data.suptitle = suptitle;
		data.subtitle = subtitle;
		return data;
	}
});
