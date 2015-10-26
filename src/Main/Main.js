(function (enyo, scope) {

	enyo.kind({
		name: 'B.MainView',
		classes: 'moon enyo-fit enyo-unselectable',
		components: [
			{
				name: 'player',
				kind: 'moon.VideoPlayer',
				src: '',
				poster: '',
				showInfoBackground: true,
				shakeAndWake: true,
				autoplay: true,
				infoComponents: [
					{kind: 'moon.VideoInfoBackground', orient: 'left', background: true, fit: true, components: [
						{
							name: 'playerMediaInfo',
							kind: 'B.MediaInfo',
							// classes: 'moon-2h',
							// channelNo: '13',
							// channelName: 'AMC',
							components: [
								// {name: 'playerPoster', kind: 'moon.Image', src: '', classes: 'player-poster'},
								// {content: '3D'},
								// {content: 'Live'},
								// {content: 'REC 08:22', classes: 'moon-video-player-info-redicon '}
							]
						},
						{
							name: 'playerHeader',
							kind: 'moon.VideoInfoHeader'
							// title: 'Downton Abbey - Extra Title',
							// subTitle: 'Mon June 21, 7:00 - 8:00pm',
							// subSubTitle: 'R - TV 14, V, L, SC',
							// description: 'The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and'
						}
					]},
					{kind: 'moon.VideoInfoBackground', orient: 'right', background: true, components: [
						{kind:'moon.Clock'}
					]}
				],
				components: [
					// {kind: 'moon.IconButton', src: '$lib/moonstone/images/video-player/icon-placeholder.png'}
				]
			},
			{name: 'pictureViewer', kind: 'enyo.ImageView', classes: 'picture-viewer enyo-fit', src:''},
			{
				name: 'drawers',
				kind: 'moon.Drawers',
				drawers:[
					{
						name: 'serversDrawer',
						open: false,
						controlsOpen: false,
						onActivate: 'drawerChangedServers',
						onDeactivate: 'drawerChangedServers',
						handle: {name: 'handleButton', content: 'Servers'},
						components: [
							{kind: 'moon.Panel', classes:'enyo-fit', title: 'Add Server', headerComponents: [
								{kind: 'moon.Button', content: 'Create Server', ontap: 'handleAddServer'},
								{kind: 'moon.Button', name: 'removeServerButton', content: 'Delete Server', ontap: 'handleRemoveServer'}
							], components: [
								{name: 'serverDataList', kind: 'moon.DataList', selection: true, multipleSelection: false, components: [
									{classes: 'enyo-border-box', components: [
										{name: 'serverItem', kind: 'moon.Item', content: 'serverName'}
									], bindings: [
										{from: '.model.title', to: '.$.serverItem.content'}
									]}
								]}
							]}
						],
						controlDrawerComponents: [
							{classes:'moon-hspacing', components: [
								{kind: 'moon.ContextualPopupDecorator', components: [
									{kind: 'moon.ContextualPopupButton', name: 'serverPopupButton', content: 'Server:'},
									{kind: 'moon.ContextualPopup', name: 'serverPopup', classes:'moon-6h moon-8v', components: [
										{kind:'moon.DataList', name:'serverPicker', components: [
											{kind:'moon.Item', fit: true, ontap: 'handleChooseServer', bindings: [
												{from:'.model.title', to:'.content'}
											]}
										]}
									]}
								]},
								{kind: 'moon.Button', name: 'addServersButton', content: 'Add Servers', ontap: 'openDrawerServers'},
								{kind: 'moon.IconButton', icon: 'closex', classes: 'moon-button', ontap: 'closeDrawerServers', small: false}
							]}
						]
					}
				],
				components: [
					{name: 'panels', kind: 'moon.Panels', pattern: 'activity', classes: 'enyo-fit', wrap: true, useHandle: true}
				]
			}
		],
		panelTemplate: {
			kind: 'B.DirectoryPanel'
		},
		events: {
			onOpenDirectory: ''
		},
		handlers: {
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
			{from: 'movieInfo.title',		to: '$.playerHeader.title'},
			{from: 'movieInfo.subtitle',	to: '$.playerHeader.subTitle'},
			{from: 'movieInfo.plot',		to: '$.playerHeader.description'}
		],
		create: function() {
			this.inherited(arguments);
			this.app.prepareServersCollection();
		},
		rendered: function () {
			// Do before render

			this.inherited(arguments);
			// Do after render
			// this.generatePanelsFromPath();
			this.chooseServer( this.app.get('server') );
		},

		/**
		 *
		 * Try and make it so when you hit the back browser button,
		 * or put in a different #, it just goes directly to that set of panes.
		 *
		 */

		generatePanelsFromPath: function() {
			// this.inherited(arguments);

			// Take our path array and generate some panels using it
			var locPath = this.app.$.router.location();
			var ps = this.createDirectoryPanels(this.app.getPathArray(locPath));
			// var ps = this.createDirectoryPanels(this.app.get('locPathArray'));
			this.$.panels.pushPanels(ps, null, {targetIndex: -1, transition: false});

			// Manually fire the assign function, since we won't have a transition to rely on with only one panel.
			if (this.$.panels.getPanels().length <= 1) {
				// this.assignPanelContents(this.$.panels.getActive());
				this.$.panels.getActive().doReady();
			}
			console.log('Panel Create:', this);
		},
		eventVars: function(inSender, inEvent) {
			console.log(inEvent.type, '-> inSender:', inSender, 'inEvent:',inEvent);
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
			// debugger;
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

		handleAddServer: function(inSender, inEvent) {
			if (!this.$.addInput.getValue()) {
				// this.$.result.setContent('Please insert content value.');
				return;
			}
			var picker = this.$.serverPicker;
			picker.createComponent({content:this.$.addInput.getValue()}).render();
			// this.$.result.setContent(''' + this.$.addInput.getValue() + '' is added to ' + picker.name);
		},
		handleSelectedServer: function(inSender, inEvent) {
			if (inEvent.originator.get('active')) {
				this.$.removeServerButton.set('disabled', false);
			}
			else {
				this.$.removeServerButton.set('disabled', true);
			}
		},
		handleChooseServer: function(inSender, inEvent) {
			if (inEvent.originator.model) {
				this.chooseServer(inEvent.originator.model);
			}
			this.$.serverPopup.closePopup();
		},
		chooseServer: function(inServerModel) {
			this.$.serverPopupButton.set('content', 'Server: ' + inServerModel.get('title'));
			this.app.set('server', inServerModel);
			this.$.panels.destroyClientControls();
			this.generatePanelsFromPath();
		},
		handleRemoveServer: function(inSender, inEvent) {
			var list = this.$.serverDataList,
				sel = list.get('selected');
			if (sel) {
				if (!enyo.isArray(sel)) {
					sel = [sel];
				}
				for (var i = 0; i < sel.length; i++) {
					sel[i].destroy();
				}
			}
		},

		//* Panels Handlers
		handlePanelReady: function(inSender, inEvent) {
			// inEvent.originator.assignPanelContents();
			inEvent.originator.doReady();
		},
		handleOpenDirectory: function(inSender, inEvent) {
			// create a new panel and initialize it
			var p = this.createDirectoryPanel({path: inEvent.file.get('path')});
			this.$.panels.pushPanel(p);
			return true;
		},
		handleTransitionStart: function(inSender, inEvent) {
			console.log('customTransitionStart', inSender, inEvent, inSender.getIndex(), inSender.getPanels() );
		},
		handleTransitionFinish: function(inSender, inEvent) {
			var panels = inEvent.originator,
				p = panels.getActive();

			if (inEvent.toIndex < inEvent.fromIndex) {
				// console.log('We removed a panel and went back to index: %s; from: %s;', inEvent.toIndex, inEvent.fromIndex);
				// debugger;
				panels.popPanels(inEvent.toIndex + 1);
			}
			// else if (inEvent.toIndex > inEvent.fromIndex) {
				// console.log('We loaded a new panel at index: %s;', inEvent.toIndex, inEvent);
			// }
			// else {
				// console.log('We reloaded the same panel at index: %s;', inEvent.toIndex);
			// }
			this.app.set('locPath', p.path);

			p.doReady();
		},

		//* Media and File Handlers
		handlePlay: function(inSender, inEvent) {
			var objMovieInfo = inEvent.originator;
			if (objMovieInfo.kind === 'B.MovieInfo') {
				// console.log('playMovie:this:', this, 'movieInfo:', objMovieInfo, objMovieInfo.get('videoSrc'));
				this.set('movieInfo', objMovieInfo);

				this.$.playerMediaInfo.clearBadges();
				if (objMovieInfo.get('mpaa')) {
					this.$.playerMediaInfo.addBadge({content: objMovieInfo.get('mpaa')});
				}

				this.showVideo();
				this.$.player.play();
			}
		},
		handleOpen: function(inSender, inEvent) {
			// this.doOpen({file: this})
			var file = inEvent.file;
			// console.log('file:', file);
			if (file.get('isDir') && !file.get('hasIndex')) {
				// this.openDirectory(inSender, inEvent);
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
		next: function(inSender, inEvent) {
			this.$.panels.next();
			return true;
		},
		back: function(inSender, inEvent) {
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
		createDirectoryPanel: function(inOptions) {
			if (!inOptions) {
				inOptions = { path: '/' };
			}
			var p = enyo.clone(this.panelTemplate);
			if (inOptions.initialTitle) {
				p.title = inOptions.initialTitle;
			}
			p.path = inOptions.path;
			return p;
		},
		createDirectoryPanels: function(inPathArray) {
			if (!inPathArray || !enyo.isArray(inPathArray)) {
				inPathArray = [''];
			}
			// Take our path array and generate some panels using it
			var ps = [],
				path = '';
			// Paths are fully wrapped in slashes: /dir1/dir2/
			for (var i = 0; i < inPathArray.length; i++) {
				var dirName = inPathArray[i];
				path+= dirName + '/';
				ps.push(this.createDirectoryPanel({path: path, initialTitle: dirName || '/Home'}));
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

})(enyo, this);