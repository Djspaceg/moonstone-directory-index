enyo.kind({
	name: "B.Application",
	kind: "enyo.Application",
	components: [{
		name: "messageController",
		kind: "enyo.Controller",
		message: $L("Directory Index")
	}],
	view: "B.MainView",
	published: {
		loc: {
			dir: "",
			path: "",
			pathArray: []
		},
		page: {
			baseTitle: "Blake's Dev Server"
		}
	},
	// create: function() {
		// this.inherited(arguments);
		// this.parseUrl();
		// this.loc.pathArray = this.getPathArray( this.loc.path );
		// console.log("Application Create:", this.loc, this.get("loc"));
	// },
	// rendered: function () {
		// this.inherited(arguments);
	// },
	parseUrl: function() {
		this.loc.path = window.location.pathname;
		this.loc.dir = this.loc.path.replace(/^.*\/(.+?)\/?$/, "$1");
	},
	setPageTitle: function(strTitle) {
		document.title = (strTitle ? (strTitle + " - ") : "") + this.page.baseTitle;
	},
	getPathArray: function(strPath) {
		if (strPath === undefined) return [];
		strPath = strPath.replace(/^\/|\/$/g, "");
		if (strPath === "") return [];
		return strPath.split("/");
	},
	getPrettyPath: function(strPath, strJoinWith) {
		var arrPath = this.getPathArray(strPath);
		for(var i = 0; i < arrPath.length; i++) {
			arrPath[i] = arrPath[i].toWordCase();
		}
		console.log("arrPath",arrPath);
		return arrPath.reverse().join( strJoinWith || " - ")
	},
	goToHref: function(strHref) {
		if (strHref.match(/\/$/)) {
			/// Got a directory
			window.location.href = strHref;
		}
		else {
			var strFileName = strHref.replace(/^.*\//);
			/// Open a new window using the name of the file as the identifier.
			window.open(strHref, strFileName);
		}
	}
});
