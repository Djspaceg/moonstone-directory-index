/// DataList, B.DirectoryIndex ///
enyo.kind({
	name: "B.DirectoryIndex",
	kind: "moon.Panel",
	classes: "moon-7h",
	smallHeader: true,
	title:"Directory Index",
	titleBelow:"Sub-title",
	headerComponents: [
		{name: "toolbar", components: [
			{kind: "moon.IconButton", icon: "drawer", classes: "icon-refresh", ontap: "update"}
		]}
	],
	published: {
		path: "",
		ontaprow: "someEvent",
	// 	baseTableData: []
	},
	components: [
		{name: "directoryList", kind: moon.DataList,
			components: [
				{kind: "B.File", //ontap: ".ontoprow",
					bindings: [
						{from: ".model.path", to: ".path"},
						{from: ".model.isDir", to: ".isDir"},
						{from: ".model.icon", to: ".icon"},
						{from: ".model.name", to: ".title"},
						{from: ".model.prettySize", to: ".size"},
						{from: ".model.prettyLastModified", to: ".lastModified"},
						// {from: ".model.name", to: ".$.directory.titleBelow"}
					]
				}
			],
		}
	],
	bindings: [
		{from: ".model.title", to: ".title"},
		{from: ".model.path", to: ".titleBelow"},
		{from: ".model.contents", to: ".$.directoryList.collection"}
	],
	create: function() {
		this.inherited(arguments);
		// this.$.breadcrumbBackground.handlers.ontap = "breadcrumbActivate";
		// console.log("B.DirectoryIndex.create:", this.$);
		// for (var i = 0; i < this.$.directoryList.controls.length; i++) {
		// 	console.log("Control #%d ontap: %s -> %s",i,this.$.directoryList.controls[i].handlers.ontap,this.get("ontaprow"));
		// 	this.$.directoryList.controls[i].handlers.ontap = this.get("ontaprow");
		// }
	// 	this.loadTable( document.getElementsByTagName("table")[0] );
	// 	this.buildTable();
		// this.update();
	},
	breadcrumbActivate: function() {
		// remove myself from the collection.
		console.log("breadcrumbActivate");
		this.app.$.mainView.back();
	},
	// dxRowTapDefault: function () {
	// 	console.log("Yeah man! I never changed. WHAT WHAT?!?");
	// },
	// rendered: function () {
	// 	this.inherited(arguments);
	// },
	update: function () {
		console.log("1 Updating Panel Path: %s", this.path);
		// var weekId = this.get('weekId');
		//var c = this.app.directories[this.path];
		var m = enyo.store.findLocal({ path: this.path })[0];
		console.log("2 Updating Panel Path: %s", m);
		if (m) {
			this.set("model", m );
			// this.set("model", c.at(0) );
			return;
		}
		console.log("Updating Panel Path: %s", this.path);
		var c = this.createComponent({name: this.app.loc.path, path: this.path, kind: mdlFileSystem});
		this.app.directories[this.app.loc.path] = c;
		// c.fetch({strategy: "merge"});
		
		// this.$.directory.set("model", c.at(0) );

		/// tell the scoreboard to use the new collection
		// this.$.panels.set("collection", c);
		// this.$.directoryList.set("collection", c);
		// this.$.directoryList.set("collection", c);
		c.fetch({success: enyo.bind(this, function(inObj,inOptions,inData) {
			// this.$.directoryList.set("collection", c);
			this.set("model", c.at(0) );
			// console.log("fetch:success:",this);
			// this.handlers.ontap = this.get("ontaprow");
			// , handlers: { ontap: function() { console.log("Hey friend!"); } } 
		}), strategy: "merge"});
		// console.log('c',c);
		// this.view.$.gameDay.set('collection', c);
		// this.view.$.gameDay.reset();
	}
});
