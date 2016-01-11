var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	// ImageView = require('enyo/Image');
	ImageView = require('layout/ImageView');

var
	Button = require('moonstone/Button'),
	Clock = require('moonstone/Clock'),
	ContextualPopupDecorator = require('moonstone/ContextualPopupDecorator'),
	ContextualPopupButton = require('moonstone/ContextualPopupButton'),
	ContextualPopup = require('moonstone/ContextualPopup'),
	DataList = require('moonstone/DataList'),
	Drawers = require('moonstone/Drawers'),
	IconButton = require('moonstone/IconButton'),
	Item = require('moonstone/Item'),
	Panel = require('moonstone-extra/Panel'),
	MoonPanels = require('moonstone-extra/Panels'),
	VideoPlayer = require('moonstone-extra/VideoPlayer'),
	VideoInfoBackground = require('moonstone-extra/VideoInfoBackground'),
	VideoInfoHeader = require('moonstone-extra/VideoInfoHeader');

var
	MediaInfo = require('../MediaInfo'),
	MovieInfo = require('../MovieInfo'),
	// ChannelInfo = require('moonstone-extra/ChannelInfo'),
	DirectoryPanel = require('../DirectoryPanel');

var Panels = kind({
	kind: MoonPanels,
	events: {
		onPanelsShowing: ''
	},
	showingChanged: function (sender, ev) {
		this.inherited(arguments);
		this.doPanelsShowing({showing: this.showing});
	}
});

module.exports = kind({
	name: 'MainView',
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{
			name: 'player',
			kind: VideoPlayer,
			src: '',
			poster: '',
			showInfoBackground: true,
			shakeAndWake: true,
			autoplay: true,
			infoComponents: [
				{kind: VideoInfoBackground, orient: 'left', background: true, fit: true, components: [
					{
						name: 'playerMediaInfo',
						kind: MediaInfo,
						channelNo: '789-123',
						channelName: 'AMC',
						channelDesc: 'KRON-HD',
						channelMoreDesc: '4:30 - 5:30PM',
						components: [
							// {name: 'playerPoster', kind: 'moon.Image', src: '', classes: 'player-poster'},
							{content: '3D'},
							{content: 'Live'},
							{content: 'REC 08:22', classes: 'moon-video-player-info-redicon '}
						]
					},
					{
						name: 'playerHeader',
						kind: VideoInfoHeader,
						title: 'Downton Abbey - Extra Title',
						// subTitle: 'Mon June 21, 7:00 - 8:00pm',
						// subSubTitle: 'R - TV 14, V, L, SC',
						description: 'The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and'
					}
				]},
				{kind: VideoInfoBackground, orient: 'right', background: true, components: [
					{kind: Clock}
				]}
			],
			components: [
				// {kind: 'moon.IconButton', src: '$lib/moonstone/images/video-player/icon-placeholder.png'}
			]
		},

		{name: 'pictureViewer', kind: ImageView, classes: 'picture-viewer enyo-fit', src:''},
		{
			name: 'drawers',
			kind: Drawers,
			drawers:[
				{
					name: 'serversDrawer',
					open: false,
					controlsOpen: false,
					onActivate: 'drawerChangedServers',
					onDeactivate: 'drawerChangedServers',
					handle: {name: 'handleButton', content: 'Servers'},
					components: [
						{kind: Panel, classes:'enyo-fit', title: 'Add Server', headerComponents: [
							{kind: Button, content: 'Create Server', ontap: 'handleAddServer'},
							{kind: Button, name: 'removeServerButton', content: 'Delete Server', ontap: 'handleRemoveServer'}
						], components: [
							{name: 'serverDataList', kind: DataList, selection: true, multipleSelection: false, components: [
								{classes: 'enyo-border-box', components: [
									{name: 'serverItem', kind: Item, content: 'serverName'}
								], bindings: [
									{from: 'model.title', to: '$.serverItem.content'}
								]}
							]}
						]}
					],
					controlDrawerComponents: [
						{classes:'moon-hspacing', components: [
							{kind: ContextualPopupDecorator, components: [
								{kind: ContextualPopupButton, name: 'serverPopupButton', content: 'Server:'},
								{kind: ContextualPopup, name: 'serverPopup', classes:'moon-6h moon-8v', components: [
									{kind: DataList, name:'serverPicker', components: [
										{kind: Item, fit: true, ontap: 'handleChooseServer', bindings: [
											{from:'model.title', to:'content'}
										]}
									]}
								]}
							]},
							{kind: Button, name: 'addServersButton', content: 'Add Servers', ontap: 'openDrawerServers'},
							{kind: IconButton, icon: 'closex', classes: 'moon-button', ontap: 'closeDrawerServers', small: false}
						]}
					]
				}
			],
			components: [
				{name: 'panels', kind: Panels, pattern: 'activity', classes: 'enyo-fit', wrap: true, useHandle: true, popOnBack: true}
			]
		}
	],
	panelTemplate: {
		kind: DirectoryPanel
	},
	events: {
		onOpenDirectory: ''
	},
	handlers: {
		onPanelsShowing: 'handlePanelsShowing',
		onOpenDirectory: 'handleOpenDirectory',
		onPanelReady: 'handlePanelReady',
		// onTransitionStart: 'handleTransitionStart',
		onTransitionFinish:	'handleTransitionFinish',
		onPlay:	'handlePlay',
		onOpen: 'handleOpen'
	},
	bindings: [
		{from: 'app.servers',			to: '$.serverDataList.collection'},
		{from: 'app.servers',			to: '$.serverPicker.collection'},
		{from: 'movieInfo.videoSrc',	to: '$.player.src'},
		{from: 'movieInfo.posterSrc',	to: '$.player.poster'},
		{from: 'movieInfo.posterSrc',	to: '$.playerMediaInfo.posterSrc'},
		{from: 'modelMovieInfo.suptitle',	to: '$.playerHeader.title'},
		// {from: 'modelMovieInfo.subtitle',	to: '$.playerHeader.subTitle'},
		{from: 'modelMovieInfo.plot',		to: '$.playerHeader.description'},
		{from: 'modelMovieInfo.year',		to: '$.playerMediaInfo.channelNo'},
		{from: 'modelMovieInfo.subtitle',	to: '$.playerMediaInfo.channelName'},
		{from: 'modelMovieInfo.genre',	to: '$.playerMediaInfo.channelDesc'}
	],
	// create: function() {
		// Control.prototype.create.apply(this, arguments);
		// console.log('server:', this.app.get('server'));
		// this.app.prepareServersCollection();
	// },
	rendered: function () {
		// Do before render
		Control.prototype.rendered.apply(this, arguments);
		// Do after render
		this.chooseServer( this.app.get('server') );
	},
	generatePanelsFromPath: function () {
		// Take our path array and generate some panels using it
		var locPath = this.app.$.router.location(),
			ps = this.createDirectoryPanels(locPath),
			activePanel = this.$.panels.getActive(),
			shouldTransition = (activePanel && activePanel.get('path').length < locPath.length) || false;

		console.log('generatePanelsFromPath:', locPath);

		if (ps.length) {
			this.$.panels.pushPanels(ps, null, {targetIndex: -1, transition: shouldTransition});
			// console.log('Panel Created for :', locPath);
		}
		// Manually fire the assign function, since we won't have a transition to rely on with only one panel.
		if (this.$.panels.getPanels().length <= 1) {
			this.$.panels.getActive().doReady();
		}
	},
	eventVars: function(sender, ev) {
		console.log(ev.type, '-> sender:', sender, 'ev:',ev);
	},
	handlePanelsShowing: function (sender, ev) {
		this.$.drawers.$.activator.set('showing', ev.showing);
		// console.log('handlePanelsShowing:', this.$.drawers.$.activator);
	},
	openDrawer: function(inName) {
		this.$[inName].setOpen(true);
	},
	closeDrawer: function(inName) {
		if (this.$[inName].getOpen()) {
			this.$[inName].setOpen(false);
		} else {
			this.$[inName].setControlsOpen(false);
		}
	},
	drawerChanged: function(inName, inActivationButton) {
		this.$[inActivationButton].setShowing(!this.$[inName].getOpen());
	},
	openDrawerServers: function() {
		this.openDrawer('serversDrawer');
	},
	closeDrawerServers: function() {
		this.closeDrawer('serversDrawer');
	},
	drawerChangedServers: function() {
		this.drawerChanged('serversDrawer', 'addServersButton');
	},
	closeDrawerFilter: function() {
		this.closeDrawer('filterDrawer');
	},

	handleAddServer: function(sender, ev) {
		if (!this.$.addInput.getValue()) {
			// this.$.result.setContent('Please insert content value.');
			return;
		}
		var picker = this.$.serverPicker;
		picker.createComponent({content:this.$.addInput.getValue()}).render();
		// this.$.result.setContent(''' + this.$.addInput.getValue() + '' is added to ' + picker.name);
	},
	handleSelectedServer: function(sender, ev) {
		if (ev.originator.get('active')) {
			this.$.removeServerButton.set('disabled', false);
		}
		else {
			this.$.removeServerButton.set('disabled', true);
		}
	},
	handleChooseServer: function(sender, ev) {
		if (ev.originator.model) {
			this.chooseServer(ev.originator.model);
		}
		this.$.serverPopup.closePopup();
	},
	chooseServer: function(inServerModel) {
		this.$.serverPopupButton.set('content', 'Server: ' + inServerModel.get('title'));
		this.app.set('server', inServerModel);
		this.$.panels.destroyClientControls();
	},
	handleRemoveServer: function(sender, ev) {
		var list = this.$.serverDataList,
			sel = list.get('selected');
		if (sel) {
			if (!util.isArray(sel)) {
				sel = [sel];
			}
			for (var i = 0; i < sel.length; i++) {
				sel[i].destroy();
			}
		}
	},

	//* Panels Handlers
	handlePanelReady: function(sender, ev) {
		// ev.originator.assignPanelContents();
		ev.originator.doReady();
	},
	handleOpenDirectory: function(sender, ev) {
		// create a new panel and initialize it
		this.app.set('locPath', ev.file.get('path') );
		// var p = this.createDirectoryPanel({path: ev.file.get('path')});
		// this.$.panels.pushPanel(p);
		return true;
	},
	handleTransitionStart: function(sender, ev) {
		console.log('customTransitionStart', sender, ev, sender.getIndex(), sender.getPanels() );
	},
	handleTransitionFinish: function(sender, ev) {
		var panels = ev.originator,
			p = panels.getActive();

		// if (ev.toIndex < ev.fromIndex) {
		// 	// console.log('We removed a panel and went back to index: %s; from: %s;', ev.toIndex, ev.fromIndex);
		// 	panels.popPanels(ev.toIndex + 1);
		// }
		// else if (ev.toIndex > ev.fromIndex) {
			// console.log('We loaded a new panel at index: %s;', ev.toIndex, ev);
		// }
		// else {
			// console.log('We reloaded the same panel at index: %s;', ev.toIndex);
		// }
		this.app.set('locPath', p.get('path'));

		p.doReady();
	},

	//* Media and File Handlers
	handlePlay: function(sender, ev) {
		var objMovieInfo = ev.originator;
		if (objMovieInfo.kind === MovieInfo) {
			console.log('playMovie:this:', this, 'movieInfo:', objMovieInfo, objMovieInfo.get('videoSrc'));
			this.set('movieInfo', objMovieInfo);
			this.set('modelMovieInfo', ev.modelMovieInfo);

			this.$.playerMediaInfo.clearBadges();
			if (objMovieInfo.get('mpaa')) {
				this.$.playerMediaInfo.addBadge({content: objMovieInfo.get('mpaa')});
			}

			this.showVideo();
			this.$.player.play();
		}
	},
	handleOpen: function(sender, ev) {
		// this.doOpen({file: this})
		var file = ev.file;
		// console.log('file:', file);
		if (file.get('isDir') && !file.get('hasIndex')) {
			// this.openDirectory(sender, ev);
			this.doOpenDirectory({file: file});
			return true;
		}
		switch (file.get('ext')) {
			case 'jpg':
			case 'png':
			case 'tbn':
			case 'gif':
			case 'tga':
			case 'tiff':
				this.$.pictureViewer.set('src', 'http://' + this.app.get('fileServerHost') + file.get('path'));
				this.showPicture();
				break;
			default:
				window.open('http://' + this.app.get('fileServerHost') + file.get('path'), file.get('title'));
		}
		// console.log('goToHref',this, this.get('path'), this.get('title'), this.$.title.content, 'test');
		return true;
	},
	next: function(sender, ev) {
		this.$.panels.next();
		return true;
	},
	back: function(sender, ev) {
		this.$.panels.popPanel();
		return true;
	},
	showPicture: function() {
		this.$.pictureViewer.set('showing', true);
		this.$.panels.set('showing', false);
	},
	showVideo: function() {
		this.$.pictureViewer.set('showing', false);
		this.$.panels.set('showing', false);
	},
	getPanelByKey: function (key) {
		var i, panel,
			panelsList = this.$.panels.getPanels();
		for (i = 0; (panel = panelsList[i]); i++) {
			if (panel.get('modelKey') == key) {
				// panel already exists
				return panel;
			}
		}
		return;
	},
	createDirectoryPanel: function(inOptions) {
		if (!inOptions) { inOptions = {}; }
		if (!inOptions.path) { inOptions.path = '/'; }
		if (!inOptions.title) { inOptions.title = '/Home'; }

		// var i,
		// 	modelKey = this.getPanelKey(inOptions.path),
		// 	panelsList = this.$.panels.getPanels();


		var p = util.clone(this.panelTemplate);
		util.mixin(p, inOptions);
		// p.title = inOptions.title || '/Home';
		// p.path = inOptions.path;
		// p.modelKey = modelKey;

		return p;
	},
	createDirectoryPanels: function(path) {
		var pathArray = this.app.getPathArray(path);
		if (!pathArray || !util.isArray(pathArray)) {
			pathArray = [''];
		}
		// Take our path array and generate some panels using it
		var p, dirName, key,
			ps = [],
			dirPath = '';
		// Paths are fully wrapped in slashes: /dir1/dir2/
		for (var i = 0; i < pathArray.length; i++) {
			dirName = pathArray[i];
			dirPath+= dirName + '/';
			key = this.app.getModelKey(dirPath);
			if (!this.getPanelByKey(key)) {
				p = this.createDirectoryPanel({path: dirPath, title: dirName, modelKey: key});
				ps.push(p);
			}
		}
		return ps;
	}
	// getBreadCrumbs: function(arrPath) {
		// if (arrPath === undefined) {
			// arrPath = this.app.loc.pathArray;
		// }
		// if (arrPath instanceof String) {
			// arrPath = this.app.getPathArray( arrPath );
		// }
		// arrPath.unshift('Home');
		// var r = [];
		// for (var i = 0; i < arrPath.length; i++) {
			// var strPath = arrPath[i],
				// strHref = '',
				// objButton = {kind: 'B.LinkButton', content: strPath};
			// if (i < arrPath.length) {
				// for (var j = i+1; j < arrPath.length; j++) {
					// strHref+= '../';
				// }
			// }
			// if (strHref) {
				// objButton.href = strHref;
			// }
			// if (i == arrPath.length - 1) {
				// objButton.active = true;
			// }
			// r.push(objButton);
		// }
		// return r;
	// }
});
