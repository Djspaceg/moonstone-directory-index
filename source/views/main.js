enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity", style: "z-index: 1000;",
			components: [
				{name: "rootDirectory", kind: "B.DirectoryIndex", path: "/node/", classes: "moon-7h"},
				{title: "Second Panel", defaultSpotlightControl: "defaultControl", classes: "moon-7h", components: [
					{kind: "moon.Item", content: "Item One", ontap: "next"},
					{kind: "moon.Item", content: "Item Two", ontap: "next"},
					{name: "defaultControl", kind: "moon.Item", content: "Item Three (default focus for panel)", ontap: "next"},
					{kind: "moon.Item", content: "Item Four", ontap: "next"},
					{kind: "moon.Item", content: "Item Five", ontap: "next"}
				]},
				{title: "Third Panel", classes: "moon-7h", components: [
					{kind: "moon.Item", content: "Item One", ontap: "next"},
					{kind: "moon.Item", content: "Item Two", ontap: "next"},
					{kind: "moon.Item", content: "Item Three", ontap: "next"},
					{kind: "moon.Item", content: "Item Four", ontap: "next"},
					{kind: "moon.Item", content: "Item Five", ontap: "next"}
				]},
			],
			// bindings: [
			// 	{from: ".model.path", to: ".$.directory.titleBelow"}
			// ],
		}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	create: function() {
		this.inherited(arguments);

		this.app.parseUrl();
		this.app.loc.pathArray = this.app.getPathArray( this.app.loc.path );

		this.app.setPageTitle( this.app.getPrettyPath( this.app.loc.path ) );

		var arrBread = this.getBreadCrumbs();
		// this.$.directoryTree.createComponents( arrBread );
		console.log("Panel Create:", this, arrBread);
	},
	getTitle: function() {
		var strDir = this.app.get("loc").dir;
		return strDir === "/" ? "/Home" : strDir.toWordCase();
	},
	rendered: function () {
		this.inherited(arguments);
		// this.$.directory.set("title", this.getTitle() );
		console.log("We have rendered:",this);
	},
	update: function () {
		// var weekId = this.get('weekId');
		var c = this.app.directories[this.app.loc.path];
		if (c) {
			this.$.directory.set("model", c.at(0) );
			return;
		}
		c = this.createComponent({name: this.app.loc.path, path: this.app.loc.path, kind: mdlFileSystem});
		this.app.directories[this.app.loc.path] = c;
		// c.fetch({strategy: "merge"});
		
		// this.$.directory.set("model", c.at(0) );

		/// tell the scoreboard to use the new collection
		// this.$.panels.set("collection", c);
		// this.$.directoryList.set("collection", c);
		// this.$.directoryList.set("collection", c);
		c.fetch({success: enyo.bind(this, function(inObj,inOptions,inData) {
			// this.$.directoryList.set("collection", c);
			this.$.directory.set("model", c.at(0) );
			// console.log("fetch:success:",arguments,this.$,this.$.directoryList);
		}), strategy: "merge"});
		console.log('c',c);
		// this.view.$.gameDay.set('collection', c);
		// this.view.$.gameDay.reset();
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
