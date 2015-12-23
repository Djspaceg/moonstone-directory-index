/// DataList, B.DirectoryIndex ///
var
	kind = require('enyo/kind'),
	FittableColumns = require('layout/FittableColumns');

var
	// DataList = require('moonstone/DataList'),
	NewDataList = require('moonstone/NewDataList'),
	GridListImageItem = require('moonstone/GridListImageItem'),
	Item = require('moonstone/Item'),
	Icon = require('moonstone/Icon'),
	// Img = require('moonstone/Image'),
	Marquee = require('moonstone/Marquee'),
	// MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text;

var
	FileSupport = require('../FileSupport');

// var FileItem2 = kind({
// 	// name: 'B.File',
// 	kind: Item,
// 	mixins: [FileSupport],
// 	classes: 'directory-grid-item enyo-fit',
// 	style: 'bottom: initial;',
// 	components: [
// 		// {kind: FittableColumns, components: [
// 			{name: 'icon', kind: Img, sizing: 'contain', style: 'width: inherit; height: 200px;', classes: 'icon', small: true},
// 			{name: 'title', kind: MarqueeText, classes: 'title', fit: true},
// 			// {name: 'size', kind: MarqueeText, classes: 'row-size text moon-3h'},
// 			// {name: 'lastModified', kind: MarqueeText, classes: 'row-date-mod text moon-5h'}
// 		// ]}
// 	],
// 	bindings: [
// 		{from: 'model.icon', to: '$.icon.src'}, // , transform: function(val) { return '\'' + val + '\''; }
// 		{from: 'model.name', to: '$.title.content'},
// 		// {from: 'model.prettySize', to: '$.size.content'},
// 		// {from: 'model.prettyLastModified', to: '$.lastModified.content'}
// 	]
// });

var itemTypes = {
	list: {
		itemHeight: 62,
		minItemHeight: 60,
		minItemWidth: null,
		spacing: 0,
		columns: 1,
		components: [
			{kind: Item, classes: 'directory-index-row enyo-fit',// style: 'bottom: initial;',
				mixins: [FileSupport],
				components: [
					{kind: FittableColumns, components: [
						{name: 'icon', kind: Icon, classes: 'row-icon moon-1h', small: true},
						{name: 'title', kind: MarqueeText, classes: 'row-title', fit: true},
						{name: 'size', kind: MarqueeText, classes: 'row-size text moon-3h'},
						{name: 'lastModified', kind: MarqueeText, classes: 'row-date-mod text moon-5h'}
					]}
				],
				bindings: [
					{from: 'model.icon', to: '$.icon.src', transform: function(val) { return '\'' + val + '\''; }},
					{from: 'model.name', to: '$.title.content'},
					{from: 'model.prettySize', to: '$.size.content'},
					{from: 'model.prettyLastModified', to: '$.lastModified.content'}
				]
			}
		]
	},
	grid: {
		itemHeight: null,
		minItemHeight: 240,
		minItemWidth: 200,
		spacing: 20,
		columns: 6,
		rows: 2,
		components: [
			{kind: GridListImageItem, imageSizing: 'contain', placeholder: null, style: 'position: absolute; top: 0',
				mixins: [FileSupport],
				bindings: [
					{from: 'model.icon', to: 'source'},
					{from: 'model.name', to: 'caption'},
					{from: 'model.prettySize', to: 'subCaption', transform: function(val) { return this.model.get('isDir') ? '' : val; }}
				]
			}
		]
	}
};

// function getItemTypeComponents (type) {
// 	console.log('getItemTypeComponents:', [itemTypes[type]]);
// 	return type && itemTypes[type] && [itemTypes[type]];
// }

module.exports = kind({
	name: 'B.DirectoryList',
	kind: NewDataList,
	itemType: 'list',
	bindings: [
		{from: 'model.contents', to: 'collection'}
		// {from: 'itemType', to: 'components', transform: getItemTypeComponents}
	],
	create: function () {
		NewDataList.prototype.create.apply(this, arguments);
		this.itemTypeChanged();
	},
	itemTypeChanged: function () {
		var type = this.itemType;
		// if (this.collection && this.collection.destroy) {
		// 	this.collection.destroy();
		// }
		if (type && itemTypes[type]) {
			for (var key in itemTypes[type]) {
				this.set(key, itemTypes[type][key]);
			}
		}
	}
});
