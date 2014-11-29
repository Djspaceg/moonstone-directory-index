(function (enyo, scope) {

	enyo.kind({
		name: 'B.DirectoryPanel',
		kind: 'moon.Panel',
		classes: 'moon-7h',
		smallHeader: true,
		title: 'Loading...',
		path: null,
		directoryLoaded: false,
		published: {
			modelKey: '',
			backgroundSrc: null
		},
		headerComponents: [
			{classes: 'toolbar', components: [
				{kind: 'moon.IconButton', name: 'refreshButton', icon: '&#10227;', classes: 'icon-refresh', ontap: 'reload'}
			]},
			{kind: 'moon.TooltipDecorator', components: [
				{kind: 'moon.Tooltip', position: 'above', content: 'Test Dynamic Lists'},

				//* List actions with default width
				{kind: 'moon.ListActions', name: 'listActions', icon: 'drawer', listActions: [
					{action: 'typeFilter', components: [
						{kind: 'moon.Divider', content: 'Filter Types'},
						{kind: 'enyo.DataRepeater', containerOptions: {kind: 'moon.Scroller', classes: 'enyo-fill'}, name: 'repeater', fit: true, components: [
							{kind:'moon.ToggleItem', bindings: [{from:'.model.name', to:'.content'}]}
						]}
					]}
				]}
			]}
		],
		bindings: [
			{from: '$.movieInfo.title', to: 'title'},
			{from: '$.movieInfo.subtitle', to: 'titleBelow'},
			{from: '$.movieInfo.tagline', to: 'subTitleBelow'}
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
			this.$.repeater.set('collection', new enyo.Collection([
				{name: 'Comedy'},
				{name: 'Action'},
				{name: 'Drama'},
				{name: 'Family'},
				{name: 'Fantasy'},
				{name: 'Science Fiction'}
			]));
			this.set('modelKey', this.generateModelKey());
		},
		generateModelKey: function(inPath) {
			return this.app.get('fileServerHost') + (inPath || this.get('path'));
		},
		eventVars: function (sender, ev) {
			console.log(ev.type, '-> sender:', sender, 'ev:',ev);
		},
		reload: function(sender, ev) {
			var modelKey = this.get('modelKey'),
				m = enyo.store.find(mdlDirectory, function (el, index, arr) {
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
		storeFetch: function(inOptions) {
			if (!inOptions.path ||
				!inOptions.storeModel ||
				!inOptions.componentModel ||
				!inOptions.success
				) {
				return false;
			}
			if (!inOptions.fail) {
				inOptions.fail = function() {};
			}
			// console.log('storeFetch:inOptions.path:', inOptions.path);
			var modelKey = inOptions.path ? this.generateModelKey(inOptions.path) : this.get('modelKey'),
				m = enyo.store.find(inOptions.storeModel, function (elem) { console.log('find fun', arguments); return elem.get(elem.get('primaryKey')) == modelKey });
				// m = enyo.store.find(inOptions.storeModel, { key: modelKey });

			console.log('storeFetch:modelKey:', modelKey);
			if (m && (m.euid || m.length)) {
				// console.log('Path found in store:', inOptions.path, m);
				inOptions.success.call(this, m);
				return true;
			}

			// console.log('Path NOT found in store:', inOptions.path);
			if (this.owner.$[modelKey]) {
				m = this.owner.$[modelKey];
				// we need to set the model here to something new... otherwise when we go to fetch it will be wrong, i think...
			}
			else {
				m = this.createComponent({name: modelKey, url: inOptions.path, kind: inOptions.componentModel}, {owner: this.owner});
				console.log('storeFetch:modelId:', m.id, 'V.S. modelKey:', modelKey);
			}
			console.log('Model doesn\'t exist yet. Creating for "%s" ...', inOptions.path);
			m.fetch({
				success: enyo.bind(this, function(inObj,inBindOptions,inData) {
					console.log('Model fetched successfully. Args:', inData, m.at(0));
					inOptions.success.call(this, m.at(0) || inData);
				}),
				fail: enyo.bind(this, function(inObj,inBindOptions,inData) {
					// console.log('Model fetch FAILED. Args:', inObj,inBindOptions,inData);
					inOptions.fail.apply(this, arguments);
					// mi.destroy();
				})
			});
			return true;
		},

		assignPanelContents: function() {
			var path = this.get('path');
			if (this.get('directoryLoaded')) {
				// console.log('Not necessary to fetch, already loaded...');
				return true;
			}
			// else {
				// console.log('Must fetch new directory index for %s.', path);
			// }
			this.storeFetch({
				path: path,
				storeModel: mdlDirectory,
				componentModel: mdlFileSystem,
				success: function(inModel) {
					var di,
						bitMediaFolder = inModel.get('hasMedia');

					if (bitMediaFolder) {
						this.storeFetch({
							path: path + (inModel.get('nfo') || 'fail.noNfoFileExists'),
							storeModel: mdlMovie,
							componentModel: mdlMovieInfo,
							success: function(inMovieModel) {
								console.log('Fetch of %s Successful.', path, inModel, 'inMovieModel', inMovieModel);
								this.$.refreshButton.set('showing', false);
								this.destroyClientControls();
								di = this.createComponent({
									name: 'movieInfo',
									kind: 'B.MovieInfo',
									path: path,
									model: inModel,
									modelMovieInfo: inMovieModel
								});
								this.app.setMultiple(this, di.get('parentOptions'));
								this.app.setMultiple(this.$.header, di.get('headerOptions'));
								// Directly set the fanart
								this.set('backgroundSrc', di.get('fanartSrc'));
								di.render();
							},
							fail: function(inObj,inBindOptions,inData) {
								var strMovieName = inModel.get('basename'),
									title = strMovieName.replace(/\s*\(\d+\)\s*$/, ''),
									year = strMovieName.match(/\((\d+)\)\s*$/) ? strMovieName.replace(/^.*\((\d+)\)\s*$/, '$1') : '',
									m = this.createComponent({kind: 'mdlMovie'});

								// console.log('Fetch of %s FAILED.', strMovieName, arguments);

								m.set('title', title);
								m.set('year', year);

								// We're just going to run the success, as if it worked, but pass in custom data...
								inBindOptions.success.call(this, inObj, inBindOptions, m);
							}
						});
					}
					else {
						this.set('title', inModel.get('title'));
						this.set('titleBelow', inModel.get('path'));
						this.destroyClientControls();

						di = this.createComponent({
							kind: 'B.DirectoryIndex',
							path: path
						});

						di.set('model', inModel );
						di.render();
					}
					this.doDirectoryLoaded();
				}
			});
			return true;
		}
	});

})(enyo, this);