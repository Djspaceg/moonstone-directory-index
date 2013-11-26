enyo.kind({
	name: "B.MainView",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity", style: "z-index: 1000;",
				components: [
					{name: "directory", title: "Directory Panel", classes: "moon-7h", smallHeader: true, titleBelow:"Sub-title", //subTitleBelow:"Sub-sub title", 
					// controller: ".app.$.messageController",
					// bindings: [
					// 	{from: ".controller.message", to: ".title"}
					// ],
					// headerComponents: [
					// 	{kind: "enyo.Group", name: "directoryTree", classes:"moon-header-left"}
					// ],
					components: [
						// {name: "dummyfile", kind: "B.File", ontap: "next",title: "some file", size: 123, mtime: "1982-08-13: 13:37:00"},
						{name: "directoryList", kind: moon.DataList,
							components: [
								{kind: "B.File", ontap: "next",
									bindings: [
										{from: ".model.href", to: ".$.href"},
										// {from: ".model.icon", to: ".icon"},
										{from: ".model.name", to: ".$.title.content"},
										{from: ".model.prettySize", to: ".$.size.content"},
										{from: ".model.prettyLastModified", to: ".$.lastModified.content"},
										// {from: ".model.name", to: ".$.directory.titleBelow"}
									]
								}
							],
							// bindings: [
							// 	{from: ".collection.path", to: ".owner.$.directory.title"},
							// 	{from: ".collection.name", to: ".owner.$.directory.titleBelow"}
							// ]
						}
					],
					bindings: [
						{from: ".model.name", to: ".title"},
						{from: ".model.path", to: ".titleBelow"},
						{from: ".model.contents", to: ".owner.$.directoryList.collection"}
						// {from: ".$.directoryList.collection.path", to: ".$.title"}
					]
				},
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
			bindings: [
				{from: ".model.path", to: ".$.directory.titleBelow"}
			],
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
		var c = this.createComponent({name: this.app.loc.path, path: this.app.loc.path, kind: mdlFileSystem});
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
