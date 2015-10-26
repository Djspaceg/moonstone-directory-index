/// DataList, B.DirectoryIndex ///
var
	kind = require('enyo/kind');

var
	File = require('./File');

module.exports = kind({
	name: 'B.DirectoryIndex',
	kind: 'moon.DataList',
	headerType: 'medium',
	published: {
		title: 'Directory Index',
		titleBelow: 'Sub-title',
		path: '/'
	},
	components: [
		{kind: File,
			bindings: [
				{from: 'model.path', to: 'path'},
				{from: 'model.isDir', to: 'isDir'},
				{from: 'model.icon', to: 'icon'},
				{from: 'model.name', to: 'title'},
				{from: 'model.hasIndex', to: 'hasIndex'},
				{from: 'model.hasMedia', to: 'hasMedia'},
				{from: 'model.prettySize', to: 'size'},
				{from: 'model.ext', to: 'ext'},
				{from: 'model.prettyLastModified', to: 'lastModified'}
			]
		}
	],
	bindings: [
		{from: 'model.contents', to: 'collection'}
	]
});
