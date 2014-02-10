enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	attributes: {
		panelList: {}
	},
	// http://media.w3.org/2010/05/bunny/movie.mp4
	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			src: "",
			poster: "",
			shakeAndWake: true,
			autoplay: true,
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
					{
						name: "playerMediaInfo",
						kind: "B.MediaInfo",
						classes: "moon-2h",
						// channelNo: "13",
						// channelName: "AMC",
						components: [
							// {name: "playerPoster", kind: "moon.Image", src: "", classes: "player-poster"},
							// {content: "3D"},
							// {content: "Live"},
							// {content: "REC 08:22", classes: "moon-video-player-info-redicon "}
						]
					},
					{
						name: "playerHeader",
						kind: "moon.VideoInfoHeader"
						// title: "Downton Abbey - Extra Title",
						// subTitle: "Mon June 21, 7:00 - 8:00pm",
						// subSubTitle: "R - TV 14, V, L, SC",
						// description: "The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and"
					}
				]},
				{kind: "moon.VideoInfoBackground", orient: "right", background: true, components: [
					{kind:"moon.Clock"}
				]}
			],
			components: [
				// {kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"}
			]
		},
		{name: "pictureViewer", kind: "enyo.ImageView", classes: "picture-viewer enyo-fit", src:""},
		{name: "panels", kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", useHandle: true}
	],
	panelTemplate: {
		kind: "moon.Panel",
		classes: "moon-7h",
		smallHeader: true,
		title: "Loading...",
		path: null,
		published: {
			backgroundSrc: null
		},
		// headerComponents: [
			// {name: "toolbar", components: [
				// {kind: "moon.IconButton", icon: "drawer", classes: "icon-refresh", ontap: "update"}
			// ]}
		// ],
		components: [
			{name: "loadingSpinner", kind: "moon.IconButton", classes: "moon-spinner", small: false}
		],
		bindings: [
			{from: ".$.movieInfo.title", to: ".title"},
			{from: ".$.movieInfo.subtitle", to: ".titleBelow"},
			{from: ".$.movieInfo.tagline", to: ".subTitleBelow"},
			{from: ".$.movieInfo.fanartSrc", to: ".backgroundSrc"}
		],
		backgroundSrcChanged: function() {
			var bgSrc = this.get("backgroundSrc");
			// console.log("this.$:", this.$);
			// this.$.loadingSpinner.set("showing", bgSrc ? true : false);
			this.applyStyle("background-image", (bgSrc) ? "url('" + bgSrc + "')": "inherit");
		}
	},
	handlers: {
		onTransitionFinish:	"customTransitionFinish",
		onPlay:	"playMovie",
		onOpen: "openFile"
	},
	bindings: [
		{from: ".movieInfo.videoSrc",	to: ".$.player.src"},
		{from: ".movieInfo.posterSrc",	to: ".$.player.poster"},
		{from: ".movieInfo.posterSrc",	to: ".$.playerMediaInfo.posterSrc"},
		{from: ".movieInfo.title",		to: ".$.playerHeader.title"},
		{from: ".movieInfo.subtitle",	to: ".$.playerHeader.subTitle"},
		{from: ".movieInfo.plot",		to: ".$.playerHeader.description"}
	],
	create: function() {
		this.inherited(arguments);

		this.app.parseUrl();
		this.app.loc.pathArray = this.app.getPathArray( this.app.loc.path );

		this.app.setPageTitle( this.app.getPrettyPath( this.app.loc.path ) );

		// var arrBread = this.getBreadCrumbs();
		// this.$.directoryTree.createComponents( arrBread );
		// this.$.panels.createComponent( {name: "rootDirectory", kind: "B.DirectoryIndex", path: "/", classes: "moon-7h", ontaprow: "next"} );
		var p = this.createDirectoryPanel();
		this.assignPanelContents(p);
		// console.log("Panel Create:", this, arrBread);
	},
	customTransitionFinish: function(inSender, inEvent) {
		// console.log("customTransitionFinish", inEvent);
		if (inEvent.toIndex < inEvent.fromIndex) {
			// console.log("We removed a panel and went back to index: %s; from: %s;", inEvent.toIndex, inEvent.fromIndex);
			this.$.panels.popPanels(inEvent.toIndex + 1);
		}
		else if (inEvent.toIndex > inEvent.fromIndex) {
			// console.log("We loaded a new panel at index: %s;", inEvent.toIndex, inEvent);
			var p = this.$.panels.getActive();
			this.assignPanelContents(p);
		}
		else {
			// console.log("We reloaded the same panel at index: %s;", inEvent.toIndex);
		}
	},
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	back: function() {
		this.$.panels.popPanel();
	},
	showPicture: function() {
		// this.$.pictureFrame.set("showing", true);
		this.$.pictureViewer.set("showing", true);
		this.$.panels.set("showing", false);
	},
	showVideo: function() {
		this.$.pictureViewer.set("showing", false);
		this.$.panels.set("showing", false);
	},
	playMovie: function(inSender, inEvent) {
		var objMovieInfo = inEvent.originator;
		if (objMovieInfo.kind === "B.MovieInfo") {
			// console.log("playMovie:this:", this, "movieInfo:", objMovieInfo, objMovieInfo.get("videoSrc"));
			this.set("movieInfo", objMovieInfo);

			this.$.playerMediaInfo.clearBadges();
			if (objMovieInfo.get("mpaa")) {
				this.$.playerMediaInfo.addBadge({content: objMovieInfo.get("mpaa")});
			}

			this.showVideo();
			this.$.player.play();
		}
	},
	openFile: function(inSender, inEvent) {
		// this.doOpen({file: this})
		var file = inEvent.file;
		// console.log("file:", file);
		if (file.get("isDir") && !file.get("hasIndex")) {
			this.openDirectory(inSender, inEvent, file);
			return true;
		}
		switch (file.get("ext")) {
			case "jpg":
			case "png":
			case "tbn":
			case "gif":
			case "tga":
			case "tiff":
				this.$.pictureViewer.set("src", "http://" + this.app.get("fileServerHost") + file.get("path"));
				this.showPicture();
				break;
			default:
				window.open("http://" + this.app.get("fileServerHost") + file.get("path"), file.get("title"));
		}
		// console.log("goToHref",this, this.get("path"), this.get("title"), this.$.title.content, "test");
		return true;
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
		// console.log("storeFetch:inOptions.path:", inOptions.path, inOptions);
		var m = enyo.store.findLocal(inOptions.storeModel, { path: inOptions.path });
		if (m) {
			// console.log("Found existing model in the store:", m);
			inOptions.success.call(this, m);
			return true;
		}
		if (this.$[inOptions.path]) {
			m = this.$[inOptions.path];
		}
		else {
			m = this.createComponent({name: inOptions.path, path: inOptions.path, kind: inOptions.componentModel});
		}
		// console.log("Model doesn't exist yet. Creating for %s...", inOptions.path);
		m.fetch({
			success: enyo.bind(this, function(inObj,inBindOptions,inData) {
				// console.log("Model fetched successfully. Args:", inData, m.at(0));
				inOptions.success.call(this, m.at(0) || inData);
			}),
			fail: enyo.bind(this, function(inObj,inBindOptions,inData) {
				// console.log("Model fetch FAILED. Args:", inObj,inBindOptions,inData);
				inOptions.fail.apply(this, arguments);
				// mi.destroy();
			}),
			strategy: "merge"
		});
		return true;
	},
	assignPanelContents: function(inPanel) {
		this.storeFetch({
			path: inPanel.path,
			storeModel: "mdlDirectory",
			componentModel: "mdlFileSystem",
			success: function(inModel) {
				var di,
					bitMediaFolder = inModel.get("hasMedia");

				if (bitMediaFolder) {
					var strMovieName = bitMediaFolder || "",
						strThumbName = strMovieName;
					strMovieName = strMovieName.replace(/(\-poster)?\..*?$/, "");

					this.storeFetch({
						path: inPanel.path + strMovieName + ".nfo",
						storeModel: "mdlMovie",
						componentModel: "mdlMovieInfo",
						success: function(inMovieModel) {
							// console.log("Fetch of %s Successful.", strMovieName, inMovieModel);
							inPanel.destroyClientControls();
							di = inPanel.createComponent({
								name: "movieInfo",
								kind: "B.MovieInfo",
								path: inPanel.path,
								movieName: strMovieName,
								posterName: strThumbName
							});
							di.set("model", inModel );
							di.set("modelMovieInfo", inMovieModel );

							this.app.setMultiple(inPanel, di.get("parentOptions"));
							this.app.setMultiple(inPanel.$.header, di.get("headerOptions"));

							di.render();
						},
						fail: function(inObj,inBindOptions,inData) {
							// console.log("Fetch of %s FAILED.", strMovieName, arguments);
							var m = this.createComponent({kind: "mdlMovie"}),
								title = strMovieName.replace(/\s*\(\d+\)\s*$/, ""),
								year = strMovieName.match(/\((\d+)\)\s*$/) ? strMovieName.replace(/^.*\((\d+)\)\s*$/, "$1") : "";

							m.set("title", title);
							m.set("year", year);

							// We're just going to run the success, as if it worked, but pass in custom data...
							inBindOptions.success.call(this, inObj, inBindOptions, m);
						}
					});
				}
				else {
					inPanel.set("title", inModel.get("title"));
					inPanel.set("titleBelow", inModel.get("path"));
					inPanel.destroyClientControls();

					di = inPanel.createComponent({
						kind: "B.DirectoryIndex",
						path: inPanel.path
					});

					di.set("model", inModel );
					di.render();
				}
			}
		});
	},
	createDirectoryPanel: function(inOptions) {
		if (!inOptions) {
			inOptions = { path: "/" };
		}
		var p = this.$.panels.pushPanel(this.panelTemplate);
		p.set("path", inOptions.path);
		return p;
	},
	openDirectory: function(inSender, inEvent, inFile) {
		// create a new panel and initialize it
		this.createDirectoryPanel({path: inFile.get("path")});
		return true;
	},
	getBreadCrumbs: function(arrPath) {
		if (arrPath === undefined) {
			arrPath = this.app.loc.pathArray;
		}
		if (arrPath instanceof String) {
			arrPath = this.app.getPathArray( arrPath );
		}
		arrPath.unshift("Home");
		var r = [];
		for (var i = 0; i < arrPath.length; i++) {
			var strPath = arrPath[i],
				strHref = "",
				objButton = {kind: "B.LinkButton", content: strPath};
			if (i < arrPath.length) {
				for (var j = i+1; j < arrPath.length; j++) {
					strHref+= "../";
				}
			}
			if (strHref) {
				objButton.href = strHref;
			}
			if (i == arrPath.length - 1) {
				objButton.active = true;
			}
			r.push(objButton);
		}
		return r;
	}
});
