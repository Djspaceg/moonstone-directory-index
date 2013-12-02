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
	// 	pageSource: "",
	// 	baseTableData: []
	},
	components: [
		{name: "directoryList", kind: moon.DataList,
			components: [
				{kind: "B.File", //ontap: "next",
					bindings: [
						{from: ".model.href", to: ".$.href"},
						{from: ".model.icon", to: ".$.icon.src"},
						{from: ".model.name", to: ".$.title.content"},
						{from: ".model.prettySize", to: ".$.size.content"},
						{from: ".model.prettyLastModified", to: ".$.lastModified.content"},
						// {from: ".model.name", to: ".$.directory.titleBelow"}
					]
				}
			],
		}
	],
	bindings: [
		{from: ".model.name", to: ".title"},
		{from: ".model.path", to: ".titleBelow"},
		{from: ".model.contents", to: ".$.directoryList.collection"}
	],
	create: function() {
		this.inherited(arguments);
	// 	this.loadTable( document.getElementsByTagName("table")[0] );
	// 	this.buildTable();
		this.update();
	},
	// rendered: function () {
	// 	this.inherited(arguments);
	// },
	update: function () {
		// var weekId = this.get('weekId');
		var c = this.app.directories[this.app.loc.path];
		if (c) {
			this.set("model", c.at(0) );
			return;
		}
		c = this.createComponent({name: this.app.loc.path, path: this.path, kind: mdlFileSystem});
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
			// console.log("fetch:success:",arguments,this.$,this.$.directoryList);
		}), strategy: "merge"});
		console.log('c',c);
		// this.view.$.gameDay.set('collection', c);
		// this.view.$.gameDay.reset();
	}
});
