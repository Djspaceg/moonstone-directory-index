enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	attributes: {
		panelList: {},
	},
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity", //style: "z-index: 1000;",
			handlers: {
				ontap: "onLocalTap",
			},
			onLocalTap: function(inSender, inEvent) {
				this.onTap(inSender, inEvent);
				console.log("Catching Panels OnTap",this.getPanelIndex( this.getActive() ),this.getPanelIndex(inEvent.originator));
				if (inEvent.breadcrumbTap) {
					console.log("Catching breadcrumbTap from",this.getPanelIndex(inEvent.originator));
					this.actuallyPopPanels(this.getPanelIndex( this.getActive() ));
					// this.popPanels(this.getPanelIndex( this.getActive() ));
				}
			},
			pushExistingPanels: function(inPanel) { // added
				console.log("pushExistingPanels", this,inPanel);
				var lastIndex = this.getPanels().length - 1,
					oPanels = this.addComponent(inPanel),
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
				while (panels.length > inIndex && inIndex > 0 && i <= intMaxLoops ) {
					// panels[panels.length - 1].destroy();
					console.log("Dropping panel index %d from collection.",panels.length - 1, panels);
					this.removeComponent( panels[panels.length - 1] );
					panels = this.getPanels();
					i++;
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

		var arrBread = this.getBreadCrumbs();
		// this.$.directoryTree.createComponents( arrBread );
		// this.$.panels.createComponent( {name: "rootDirectory", kind: "B.DirectoryIndex", path: "/", classes: "moon-7h", ontaprow: "next"} );
		this.createDirectoryPanel();
		console.log("Panel Create:", this, arrBread);
	},
	onLocalTap: function(inSender, inEvent) {
		console.log("Catching Panels OnTap");
	},
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	back: function() {
		console.log("Pop that old crap off there!");
		this.$.panels.popPanel();
	},
	createDirectoryPanel: function(inOptions) {
		if (!inOptions) {
			inOptions = { path: "/" };
		}
		var p = this.attributes.panelList[inOptions.path];
		console.log("createDirectoryPanel.inOptions.path",inOptions.path);
		if (p) {
			// console.log("Adding back the pre-existing panel:",inOptions.path, this.attributes.panelList[inOptions.path] );
			if (!this.$.panels.isPanel(p)) {
				console.log("Ooo this panel isn't mine yet. GREEDY PANELS WANT ALL THE PANELS!");
				this.$.panels.pushExistingPanels( p );
			}
			else {
				console.log("Sorry brah! Panel is already my child.", p);
			}
			// var d = this.$.panels.addComponent( this.attributes.panelList[inOptions.path] );
			// this.$.panels.resized();
			// this.$.panels.setIndex(lastIndex+1);
			// var d = this.$.panels.pushPanel( this.attributes.panelList[inOptions.path] );
			return;
		}
		// var d = this.createComponent( {kind: "B.DirectoryIndex", path: inOptions.path} );
		p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
		this.attributes.panelList[inOptions.path] = p;
	},
	openDirectory: function(inSender, inEvent, inFile) {
		// create a new panel and ititialize it
		this.createDirectoryPanel({path: inFile.get("path")});
		// switch to it
		this.next(inSender, inEvent);
		console.log("mainView.openDirectory.arguments",inSender.kind, inFile.get("path"));
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
