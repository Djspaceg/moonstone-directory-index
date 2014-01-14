enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	attributes: {
		panelList: {},
	},
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity", //style: "z-index: 1000;",
			handlers: {
				// ontap: "onLocalTap",
				// onPreTransitionComplete:	"transitionDone",
				onPostTransitionComplete:	"transitionDone"

			},
			// onLocalTap: function(inSender, inEvent) {
			// 	this.onTap(inSender, inEvent);
			// 	console.log("Catching Panels OnTap",this.getPanelIndex( this.getActive() ),this.getPanelIndex(inEvent.originator));
			// 	if (inEvent.breadcrumbTap) {
			// 		console.log("Catching breadcrumbTap from",this.getPanelIndex(inEvent.originator));
			// 		// this.popPanels(this.getPanelIndex( this.getActive() ));
			// 		// this.actuallyPopPanels(this.getPanelIndex( this.getActive() ));
			// 	}
			// },
			transitionDone: function(sendEvents) {
				// First, determine the direction, add vs subtract
				var activePanelIndex = this.getPanelIndex( this.getActive() );
				// Do what we were supposed to do
				// this.inherited(arguments);0
				// Run my version after
				if (activePanelIndex < this.lastIndex) {
					// console.log("We removed a panel and went back to index: %s; from: %s;", activePanelIndex, this.lastIndex);
					this.popPanels(this.lastIndex);
				}
				else if (activePanelIndex > this.lastIndex) {
					console.log("We loaded a new panel at index: %s;", activePanelIndex);
				}
				else {
					console.log("We reloaded the same panel at index: %s;", activePanelIndex);
				}
				this.finishTransition();
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
		this.createDirectoryPanel();
		// console.log("Panel Create:", this, arrBread);
	},
	// onLocalTap: function(inSender, inEvent) {
	// 	console.log("Catching Panels OnTap");
	// },
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
		// console.log("storeFetch:inOptions.path:", inOptions.path);
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
				// console.log("Model fetched successfully. Args:", inObj,inBindOptions,inData);
				inOptions.success.call(this, m.at(0));
			}),
			fail: enyo.bind(this, function(inObj,inBindOptions,inData) {
				// console.log("Model fetch FAILED. Args:", inObj,inBindOptions,inData);
				inOptions.fail.call(this, m.at(0));
				// mi.destroy();
			}),
			strategy: "merge"
		});
		return true;
	},
	createDirectoryPanel: function(inOptions) {
		if (!inOptions) {
			inOptions = { path: "/" };
		}
		this.storeFetch({
			path: inOptions.path,
			storeModel: "mdlDirectory",
			componentModel: "mdlFileSystem",
			success: function(inModel) {
				var p,
					bitMediaFolder = inModel.get("hasMedia");
					// console.log("mdlDirectory: inModel",inModel);
				if (bitMediaFolder) {
					var strMovieName = bitMediaFolder || "";
					strMovieName = strMovieName.replace(/\..*?$/, "");

					p = this.$.panels.pushPanel( {kind: "B.MovieInfo", path: inOptions.path, movieName: strMovieName} );
					this.storeFetch({
						path: inOptions.path + strMovieName + ".nfo",
						storeModel: "mdlMovie",
						componentModel: "mdlMovieInfo",
						success: function(inModel) {
							p.set("modelMovieInfo", inModel );
						}
					});
				}
				else {
					p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
				}
				p.set("model", inModel );
			}
		});
	},
	openDirectory: function(inSender, inEvent, inFile) {
		// create a new panel and ititialize it
		this.createDirectoryPanel({path: inFile.get("path")});
		this.next(inSender, inEvent);
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
