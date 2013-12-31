enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	attributes: {
		panelList: {},
	},
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity", //style: "z-index: 1000;",
			handlers: {
			// 	ontap: "onLocalTap",
				// onPreTransitionComplete:	"transitionDone",
				onPostTransitionComplete:	"transitionDone"

			},
			onLocalTap: function(inSender, inEvent) {
				this.onTap(inSender, inEvent);
				console.log("Catching Panels OnTap",this.getPanelIndex( this.getActive() ),this.getPanelIndex(inEvent.originator));
				if (inEvent.breadcrumbTap) {
					console.log("Catching breadcrumbTap from",this.getPanelIndex(inEvent.originator));
					// this.popPanels(this.getPanelIndex( this.getActive() ));
					this.actuallyPopPanels(this.getPanelIndex( this.getActive() ));
				}
			},
			pushExistingPanels: function(inPanel) { // added
				console.log("pushExistingPanels", this,inPanel);
				var lastIndex = this.getPanels().length - 1,
					// oPanels = this.addComponent(inPanel),
					oPanels = this.addChild(inPanel),
					// oPanels = this.addControl(inPanel),
					nPanel;

				for (nPanel in oPanels) {
					oPanels[nPanel].render();
				}

				this.resized();
				this.setIndex(lastIndex+1);
				this.render();
				return oPanels;
			},
			actuallyPopPanels: function(inIndex) {
				var panels = this.getPanels();
				inIndex = inIndex || panels.length - 1;
				var intMaxLoops = 10;
				var i = 0;
				console.log("actuallyPopPanels(%d)",inIndex);
				while (panels.length - 1 > inIndex && inIndex > 0 && i <= intMaxLoops ) {
					panels[panels.length - 1].destroy();
					console.log("Dropping panel index %d from collection.",panels.length - 1, panels);
					// this.removeComponent( panels[panels.length - 1] );
					// this.removeControl( panels[panels.length - 1] );
					// this.removeChild( panels[panels.length - 1] );
					// panels = this.getPanels();
					i++;
				}
				console.log("%d Remaining Panel(s): ", panels.length, panels);
				// console.log("With %d Panel(s) still in the hash-stockpile: ", Object.keys(this.owner.attributes.panelList).length, this.owner.attributes.panelList);
			},
			transitionDone: function(sendEvents) {
				// First, determine the direction, add vs subtract
				var activePanelIndex = this.getPanelIndex( this.getActive() );
					// direction = (typeof this.lastIndex !== "undefined") ? "subtract" : "add";
					// direction = (typeof this.lastIndex !== "undefined") ? "subtract" : "add";
				// Do what we were supposed to do
				// console.log("activePanelIndex: %s; lastIndex: %s;", activePanelIndex, this.lastIndex);
				// this.inherited(arguments);0
				// Run my version after
				if (activePanelIndex < this.lastIndex) {
					console.log("We removed a panel and went back to index: %s; from: %s;", activePanelIndex, this.lastIndex);
					this.actuallyPopPanels(activePanelIndex);
				}
				else if (activePanelIndex > this.lastIndex) {
					console.log("We loaded a new panel at index: %s;", activePanelIndex);
				}
				else {
					console.log("We reloaded the same panel at index: %s;", activePanelIndex);
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
		this.createDirectoryPanel();
		// console.log("Panel Create:", this, arrBread);
	},
	onLocalTap: function(inSender, inEvent) {
		console.log("Catching Panels OnTap");
	},
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	back: function() {
		// console.log("Pop that old crap off there!");
		this.$.panels.popPanel();
	},
	createDirectoryPanel: function(inOptions) {
		if (!inOptions) {
			inOptions = { path: "/" };
		}
		// var p = this.attributes.panelList[inOptions.path];
		// console.log("createDirectoryPanel.inOptions.path",inOptions.path);
		// if (p) {
			// console.log("Adding back the pre-existing panel:",inOptions.path, this.attributes.panelList[inOptions.path] );
			// if (!this.$.panels.isPanel(p)) {
			// 	console.log("Ooo this panel isn't mine yet. GREEDY PANELS WANT ALL THE PANELS!");
			// 	this.$.panels.pushExistingPanels( p );
			// }
			// else {
			// 	console.log("Sorry brah! Panel is already my child.", p);
			// }
			// var d = this.$.panels.addComponent( this.attributes.panelList[inOptions.path] );
			// this.$.panels.resized();
			// this.$.panels.setIndex(lastIndex+1);
			// var d = this.$.panels.pushPanel( this.attributes.panelList[inOptions.path] );
			// return;
		// }
		var m = enyo.store.findLocal({ path: inOptions.path })[0];
		console.log("createDirectoryPanel with model:", m);
		if (m) {
			// this.set("model", m );
			// this.set("model", c.at(0) );
			// this.createDirectoryPanel({model: m, path: inOptions.path});
			// this.next(inSender, inEvent);
			var p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
			p.set("model", m );
			return true;
		}
		// console.log("Updating Panel Path: %s", this.path);
		m = this.createComponent({name: inOptions.path, path: inOptions.path, kind: mdlFileSystem});
		console.log("Model doesn't exist yet. createDirectoryPanel with new model:", m);
		// m.fetch({strategy: "merge"});
		var p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
		m.fetch({success: enyo.bind(this, function(inObj,inOptions,inData) {
			// this.next(inSender, inEvent);
			p.set("model", m.at(0) );
		}), strategy: "merge"});
		// p.set("model", m );
		// this.app.directories[this.app.loc.path] = c;
		// m.fetch({success: enyo.bind(this, function(inObj,inOptions,inData) {
			// this.set("model", c.at(0) );
			// this.createDirectoryPanel({model: m, path: inOptions.path});
			// switch to it
			// this.next(inSender, inEvent);
			// console.log("inOptions after model fetch are:",inOptions);
			// var p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
			// p.set("model", inOptions.model );
		// }), strategy: "merge"});


		// var d = this.createComponent( {kind: "B.DirectoryIndex", path: inOptions.path} );
		// this.attributes.panelList[inOptions.path] = p;
	},
	openDirectory: function(inSender, inEvent, inFile) {
		// create a new panel and ititialize it
		
		var m = enyo.store.findLocal({ path: this.path })[0];
		console.log("Updating Panel Path: %s", m);
		if (m) {
			// this.set("model", m );
			// this.set("model", c.at(0) );
			this.createDirectoryPanel({model: m, path: inFile.get("path")});
			this.next(inSender, inEvent);
			return true;
		}
		// console.log("Updating Panel Path: %s", this.path);
		m = this.createComponent({name: this.app.loc.path, path: this.path, kind: mdlFileSystem});
		// this.app.directories[this.app.loc.path] = c;
		m.fetch({success: enyo.bind(this, function(inObj,inOptions,inData) {
			// this.set("model", c.at(0) );
			this.createDirectoryPanel({model: m, path: inFile.get("path")});
			// switch to it
			this.next(inSender, inEvent);
		}), strategy: "merge"});

		// console.log("mainView.openDirectory.arguments",inSender.kind, inFile.get("path"));
		return true;
	},
	// rendered: function () {
	// 	this.inherited(arguments);
	// 	// this.$.directory.set("title", this.getTitle() );
	// 	console.log("We have rendered:",this);
	// },
	// update: function () {
	// 	// var weekId = this.get('weekId');
	// 	var c = this.app.directories[this.app.loc.path];
	// 	if (c) {
	// 		this.$.directory.set("model", c.at(0) );
	// 		return;
	// 	}
	// 	c = this.createComponent({name: this.app.loc.path, path: this.app.loc.path, kind: mdlFileSystem});
	// 	this.app.directories[this.app.loc.path] = c;
	// 	// c.fetch({strategy: "merge"});
		
	// 	// this.$.directory.set("model", c.at(0) );

	// 	/// tell the scoreboard to use the new collection
	// 	// this.$.panels.set("collection", c);
	// 	// this.$.directoryList.set("collection", c);
	// 	// this.$.directoryList.set("collection", c);
	// 	c.fetch({success: enyo.bind(this, function(inObj,inOptions,inData) {
	// 		// this.$.directoryList.set("collection", c);
	// 		this.$.directory.set("model", c.at(0) );
	// 		// console.log("fetch:success:",arguments,this.$,this.$.directoryList);
	// 	}), strategy: "merge"});
	// 	console.log('c',c);
	// 	// this.view.$.gameDay.set('collection', c);
	// 	// this.view.$.gameDay.reset();
	// },
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
