enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	attributes: {
		panelList: {},
	},
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity",
			handlers: {
				// onTransitionStart:	"customTransitionStart",
				onTransitionFinish:	"customTransitionFinish"
			},
			customTransitionStart: function(inSender, inEvent) {
				// console.log("customTransitionStart");
				var p = this.getActive();
				this.parent.assignPanelContents(p);
				// self.assignPanelContents(this);
			},
			customTransitionFinish: function(inSender, inEvent) {
				// console.log("customTransitionFinish", inEvent);
				if (inEvent.toIndex < inEvent.fromIndex) {
					// console.log("We removed a panel and went back to index: %s; from: %s;", inEvent.toIndex, inEvent.fromIndex);
					this.popPanels(inEvent.toIndex + 1);
				}
				else if (inEvent.toIndex > inEvent.fromIndex) {
					// console.log("We loaded a new panel at index: %s;", inEvent.toIndex);
					var p = this.getActive();
					this.parent.assignPanelContents(p);
				}
				else {
					// console.log("We reloaded the same panel at index: %s;", inEvent.toIndex);
				}
			},
			components: [],
		}
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
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	back: function() {
		this.$.panels.popPanel();
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
		// console.log("assignPanelContents", inPanel.id);
		this.storeFetch({
			path: inPanel.path,
			storeModel: "mdlDirectory",
			componentModel: "mdlFileSystem",
			success: function(inModel) {
				var di,
					bitMediaFolder = inModel.get("hasMedia");

				console.log("bitMediaFolder:",bitMediaFolder);
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
								kind: "B.MovieInfo",
								path: inPanel.path,
								movieName: strMovieName,
								posterName: strThumbName
							});
							di.set("model", inModel );
							di.set("modelMovieInfo", inMovieModel );

							this.app.setMultiple(inPanel, di.get("parentOptions"));
							this.app.setMultiple(inPanel.$.header, di.get("headerOptions"));

							inPanel.set("title", di.get("title"));
							inPanel.set("titleBelow", di.get("subtitle"));
							inPanel.set("subTitleBelow", di.get("tagline"));
							inPanel.set("backgroundSrc", di.get("fanartSrc"));
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
						path: inPanel.path,
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
			// inOptions = { path: "/movie-info-page/" };
		}
		var self = this,
			p = this.$.panels.pushPanel({
				kind: "moon.Panel",
				classes: "moon-7h",
				smallHeader: true,
				title: "Loading...",
				path: inOptions.path,
				published: {
					backgroundSrc: null,
				},
				// headerComponents: [
				// 	{name: "toolbar", components: [
				// 		{kind: "moon.IconButton", icon: "drawer", classes: "icon-refresh", ontap: "update"}
				// 	]}
				// ],
				components: [
					{kind: "moon.IconButton", classes: "moon-spinner", small: false}
				],
				// render: function() {
				// 	this.inherited(arguments);
				// 	this.backgroundSrcChanged();
				// },
				backgroundSrcChanged: function() {
					// console.log("backgroundSrcChanged");
					this.applyStyle("background-image", (this.get("backgroundSrc")) ? "url('" + this.get("backgroundSrc") + "')": "inherit");
				}
			});
		// p.$.header.$.texts.addRemoveClass("moon-header-texts",true);
		return p;

	},
	openDirectory: function(inSender, inEvent, inFile) {
		// create a new panel and initialize it
		var p = this.createDirectoryPanel({path: inFile.get("path")});
		return true;
	},
	getBreadCrumbs: function(arrPath) {
		if (arrPath === undefined) arrPath = this.app.loc.pathArray;
		if (arrPath instanceof String) arrPath = this.app.getPathArray( arrPath );
		arrPath.unshift("Home");
		var r = [];
		for (var i = 0; i < arrPath.length; i++) {
			var strPath = arrPath[i],
				strHref = "",
				objButton = {kind: "B.LinkButton", content: strPath};
			if (i < arrPath.length) {
				for (var j = i+1; j < arrPath.length; j++) {
					strHref+= "../";
				};
			}
			if (strHref) objButton.href = strHref;
			if (i == arrPath.length - 1) objButton.active = true;
			r.push(objButton);
		};
		return r;
	}
});
