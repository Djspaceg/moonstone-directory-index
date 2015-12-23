var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Store = require('enyo/Store'),
	Collection = require('enyo/Collection'),
	DataRepeater = require('enyo/DataRepeater');

var
	Divider = require('moonstone/Divider'),
	IconButton = require('moonstone/IconButton'),
	ListActions = require('moonstone/ListActions'),
	Scroller = require('moonstone/Scroller'),
	ToggleItem = require('moonstone/ToggleItem'),
	TooltipDecorator = require('moonstone/TooltipDecorator'),
	Tooltip = require('moonstone/Tooltip'),
	Slider = require('moonstone/Slider'),
	SimplePicker = require('moonstone/SimplePicker'),
	Panel = require('moonstone-extra/Panel');

var
	mdlDirectory = require('./data/mdlDirectory'),
	mdlFileSystem = require('./data/mdlFileSystem'),
	mdlMovieInfo = require('./data/mdlMovieInfo'),
	mdlMovie = require('./data/mdlMovie'),
	MovieInfoParasite = require('./MovieInfo');
var
	// DirectoryGrid = require('./DirectoryGrid'),
	DirectoryList = require('./DirectoryList');

module.exports = kind({
	name: 'B.DirectoryPanel',
	kind: Panel,
	headerType: 'medium',
	title: 'Loading...',
	path: null,
	directoryLoaded: false,
	published: {
		modelKey: '',
		backgroundSrc: null,
		viewType: 'list',
		gridSize: 180
	},
	headerComponents: [
		{kind: SimplePicker, onChange: 'handleViewTypeChange', components: [
			{content: 'List', active: true},
			{content: 'Grid'}
		]},
		// {name: 'gridSizer', kind: Slider, classes: 'small', showPercentage: false, value: 6, min: 4, max: 12, onChanging: 'gridSizeSliderChanging', onChange: 'gridSizeSliderChanged'},
		{name: 'gridSizer', kind: Slider, classes: 'small', showPercentage: false, value: 180, min: 100, max: 360, onChanging: 'gridSizeSliderChanging', onChange: 'gridSizeSliderChanged'},
		{classes: 'toolbar', components: [
			{kind: IconButton, name: 'refreshButton', icon: '&#10227;', classes: 'icon-refresh', ontap: 'reload'}
		]},
		{kind: TooltipDecorator, components: [
			{kind: Tooltip, position: 'above', content: 'Test Dynamic Lists'},

			//* List actions with default width
			{kind: ListActions, name: 'listActions', icon: 'drawer', listActions: [
				{action: 'typeFilter', components: [
					{kind: Divider, content: 'Filter Types'},
					{kind: DataRepeater, containerOptions: {kind: Scroller, classes: 'enyo-fill'}, name: 'repeater', fit: true, components: [
						{kind: ToggleItem, bindings: [{from:'model.name', to:'content'}]}
					]}
				]}
			]}
		]}
	],
	// listComponent: {
	// 	name: 'directory',
	// 	kind: DirectoryList
	// },
	// gridComponent: {
	// 	name: 'directory',
	// 	kind: DirectoryGrid,
	// 	fit: true,
	// 	spacing: 20,
	// 	minWidth: 180,
	// 	minHeight: 270,
	// 	scrollerOptions: {
	// 		kind: Scroller,
	// 		vertical: 'scroll',
	// 		horizontal: 'hidden',
	// 		spotlightPagingControls: true
	// 	}//, components: [
	// 	// 	{ kind: GridSampleItem }
	// 	// ]
	// },
	components: [
		{name: 'directory', kind: DirectoryList, itemType: 'list'}
	],
	// components: [
	// 	{name: 'directory', kind: DirectoryList, path: ''}
	// ],
	bindings: [
		{from: '$.movieInfo.title', to: 'title'},
		{from: '$.movieInfo.subtitle', to: 'titleBelow'},
		{from: '$.movieInfo.tagline', to: 'subTitleBelow'},
		{from: 'directoryModel', to: 'directory.model'},
		{from: 'directoryModel.path', to: 'directory.path'},
		{from: 'directoryModel.title', to: 'title'},
		{from: 'directoryModel.path', to: 'titleBelow'}
	],
	events: {
		onReady: '',
		onDirectoryLoad: '',
		onDirectoryLoaded: ''
	},
	handlers: {
		onReady: 'assignPanelContents',
		onDirectoryLoad: 'assignPanelContents',
		onDirectoryLoaded: 'handleDirectoryLoaded'
	},
	create: function() {
		this.inherited(arguments);
		this.$.repeater.set('collection', new Collection([
			{name: 'Comedy'},
			{name: 'Action'},
			{name: 'Drama'},
			{name: 'Family'},
			{name: 'Fantasy'},
			{name: 'Science Fiction'}
		]));
		// this.set('modelKey', this.generateModelKey());
	},
	// generateModelKey: function(inPath) {
	// 	// console.log('fileServerHost:', this.app.get('fileServerHost'));
	// 	return this.app.get('fileServerHost') + (inPath || this.get('path'));
	// },
	eventVars: function (sender, ev) {
		console.log(ev.type, '-> sender:', sender, 'ev:',ev);
	},
	reload: function(sender, ev) {
		var modelKey = this.get('modelKey'),
			m = Store.find(mdlDirectory, function (el, index, arr) {
				return el.get(el.primaryKey) == modelKey;
			});
		if (m && m.length > 0) {
			for (var i = 0; i < m.length; i++) {
				m[i].destroy();
			}
			if (this.$[modelKey]) {
				this.$[modelKey].destroy();
			}
		}
		this.set('directoryLoaded', false);
	},
	handleViewTypeChange: function (sender, ev) {
		var type = ev.content && ev.content.toLowerCase && ev.content.toLowerCase() || this.viewType;
		// console.log('handleViewTypeChange.ev', type, ev);
		this.set('viewType', type);
	},
	viewTypeChanged: function () {
		// this.setupDirectoryDisplay();
		// console.log('viewTypeChanged', this.viewType);
		this.$.directory.set('itemType', this.viewType);
		this.$.gridSizer.set('showing', (this.viewType == 'grid'));
	},
	directoryLoadedChanged: function () {
		if (!this.get('directoryLoaded')) {
			this.doDirectoryLoad();
		}
	},
	handleDirectoryLoaded: function (sender, ev) {
		// console.log('Directory Loaded Event Fired:', ev);
		this.set('directoryLoaded', true);
	},
	backgroundSrcChanged: function () {
		var bgSrc = this.get('backgroundSrc');
		this.applyStyle('background-image', (bgSrc) ? 'url("' + bgSrc + '")': null);
	},
	// gridSizeSliderChanging: function (sender, ev) {
	// 	this.gridSizeSliderChanged.apply(this, arguments);
	// },
	gridSizeSliderChanged: function (sender, ev) {
		if (ev.value) {
			this.set('gridSize', ev.value);
		}
	},
	gridSizeChanged: function () {
		this.$.directory.set('minItemHeight', this.gridSize + 90);
		this.$.directory.set('minItemWidth', this.gridSize);
		this.$.directory.render();
	},
	storeFetch: function (opts) {
		if (!opts.path ||
			!opts.storeModel ||
			!opts.componentModel ||
			!opts.success
			) {
			return false;
		}
		// if (!opts.source) {
		// 	opts.source = 'NocheSource';
		// }
		if (!opts.error) {
			opts.error = function() {};
		}
		// console.log('storeFetch:opts.path:', opts.path);
		// This is needed because sometimes the model we're searching for is not the panel's model.
		var modelKey = opts.path ? this.app.getModelKey(opts.path) : this.get('modelKey'),
			m = Store.find(opts.storeModel, function (elem) { console.log('find fun', arguments); return elem.get(elem.get('primaryKey')) == modelKey; });
			// m = enyo.store.find(opts.storeModel, { key: modelKey });

		// console.log('storeFetch:modelKey:', modelKey);
		if (m && (m.euid || m.length)) {
			// console.log('Path found in store:', opts.path, m);
			opts.success.call(this, m);
			return true;
		}

		// console.log('Path NOT found in store:', opts.path);
		if (this.owner.$[modelKey]) {
			m = this.owner.$[modelKey];
			// we need to set the model here to something new... otherwise when we go to fetch it will be wrong, i think...
		}
		else {
			m = this.createComponent({name: modelKey, url: opts.path, kind: opts.componentModel, app: this.app}, {owner: this.owner});
			// console.log('storeFetch:modelId:', m.id, 'V.S. modelKey:', modelKey);
		}
		console.log('Model doesn\'t exist yet. Creating for "%s" ...', opts.path);
		m.fetch({
			url: opts.url,
			// source: opts.source,
			success: util.bind(this, function (inObj, inBindOptions, inData) {
				console.log('Model fetched successfully. Args:', inData, m.at(0));
				opts.success.call(this, m.at(0) || inData);
			}),
			error: util.bind(this, function (inObj, inBindOptions, inData) {
				console.log('Model fetch FAILED. Args:', arguments);
				opts.error.apply(this, arguments);
				// mi.destroy();
			})
		});
		return true;
	},
	// setupDirectoryDisplay: function () {
	// 	// var path = this.get('path');
	// 	// this.destroyClientControls();
	// 	var type = this.viewType && this.viewType.toLowerCase() || 'list',
	// 		di;

	// 	// if ((type == 'grid' && this.$.directory instanceof DirectoryGrid) || type == 'list' && this.$.directory instanceof DirectoryList) {
	// 	// 	// Our type matches our kind
	// 	// 	// do nothing
	// 	// } else {
	// 	// 	// no match, destroy and recreate as correct kind.
	// 	// 	this.destroyClientControls();
	// 	// 	di = this.createComponent(type == 'grid' ? this.gridComponent : this.listComponent);
	// 	// 	this.$.gridSizer.set('showing', (type == 'grid'));
	// 	// }

	// 	// this.$.directory.set('model', this.directoryModel );
	// 	// this.gridSizeChanged();
	// 	// this.$.directory.render();

	// 	// this.$.directory.set('itemType', type);
	// },

	assignPanelContents: function() {
		var path = this.get('path');
		if (this.get('directoryLoaded')) {
			console.log('Not necessary to fetch, already loaded...');
			return true;
		}
		else {
			console.log('Must fetch new directory index for %s.', path);
		}
		this.storeFetch({
			path: path,
			url: path,
			storeModel: mdlDirectory,
			componentModel: mdlFileSystem,
			success: function(inDirectoryModel) {
				this.set('model', inDirectoryModel);
				var di,
					bitMediaFolder = inDirectoryModel.get('hasMedia');

				if (bitMediaFolder) {
					console.log('Working withh a media folder, fetching NFO.');
					this.storeFetch({
						path: path + (inDirectoryModel.get('nfo') || 'error.noNfoFileExists'),
						storeModel: mdlMovie,
						componentModel: mdlMovieInfo,
						success: function(inMovieModel) {
							// console.log('Fetch of %s Successful.', arguments[0], arguments);
							console.log('Fetch of %s Successful.', path, inDirectoryModel, 'inMovieModel', inMovieModel);
							// debugger;
							this.$.refreshButton.set('showing', false);
							this.destroyClientControls();
							inMovieModel.set('app', this.app);
							// MovieInfoParasite is ingested by the parent (DirectoryPanel) and is taken over from within
							di = this.createComponent({
								name: 'movieInfo',
								kind: MovieInfoParasite,
								path: path,
								model: inDirectoryModel,
								modelMovieInfo: inMovieModel
							});
							this.app.setMultiple(this, di.get('parentOptions'));
							this.app.setMultiple(this.$.header, di.get('headerOptions'));
							// if (di.headerComponents) {
							// 	this.headerComponents = di.get('headerComponents');
							// }
							// Directly set the fanart
							this.set('backgroundSrc', di.get('fanartSrc'));
							di.render();
						},
						error: function(inObj,errNum,inBindOptions,inData) {
							var strMovieName = inDirectoryModel.get('basename'),
								title = strMovieName.replace(/\s*\(\d+\)\s*$/, ''),
								year = strMovieName.match(/\((\d+)\)\s*$/) ? strMovieName.replace(/^.*\((\d+)\)\s*$/, '$1') : '',
								m = this.createComponent({kind: mdlMovie, title: title, year: year});

							// console.log('Fetch of %s FAILED.', strMovieName, m);

							// m.set('title', title);
							// m.set('year', year);

							// We're just going to run the success, as if it worked, but pass in custom data...
							inBindOptions.success.call(this, this, inBindOptions, m);
						}
					});
				}
				else {
					this.set('directoryModel', inDirectoryModel);
					// this.set('title', inDirectoryModel.get('title'));
					// this.set('titleBelow', inDirectoryModel.get('path'));
					// this.setupDirectoryDisplay();
					this.viewTypeChanged();
					// this.destroyClientControls();
					// console.log('assignPanelContents.success.model:', inDirectoryModel);

					// di = this.createComponent({
					// 	kind: this.viewType == 'grid' ? DirectoryGrid : DirectoryList,
					// 	path: path
					// });

					// di.set('model', inDirectoryModel );
					this.$.directory.set('path', path );
					this.$.directory.set('model', inDirectoryModel );
					// di.render();
				}
				this.doDirectoryLoaded();
			},
			error: function () {
				console.log('Error - mdlDirectory:', arguments);
			}
		});
		return true;
	}
});
