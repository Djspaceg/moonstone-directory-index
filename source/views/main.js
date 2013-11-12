enyo.kind({
	name: "B.MainView",
	kind: "moon.Panel",
	classes: "moon main-view",
	controller: ".app.$.messageController",
	bindings: [{
		from: ".controller.message",
		to: ".title"
	}],
	smallHeader: true,
	headerComponents: [
		// {kind: "moon.IconButton", src: "assets/icon-like.png"}
		{kind: "enyo.Group", name: "directoryTree", classes:"moon-header-left"}
	],
	components: [
		{kind: "B.DirectoryIndex"}
	],
	create: function() {
		this.inherited(arguments);

		this.app.parseUrl();
		this.app.loc.pathArray = this.app.getPathArray( this.app.loc.path );

		this.app.setPageTitle( this.app.getPrettyPath( this.app.loc.path ) );

		var arrBread = this.getBreadCrumbs();
		this.$.directoryTree.createComponents( arrBread );
		console.log("Panel Create:", this, arrBread);
	},
	rendered: function () {
		this.inherited(arguments);
		// console.log("Panel Render:", this, this.app.get("loc"));
		// this.$.header.set("title", "testing" );
		// this.$.header.small = true;
		// this.$.header.set("small", true);
		var strDir = this.app.get("loc").dir;
		this.$.header.set("title", strDir === "/" ? "/Home" : strDir.toWordCase() );
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
