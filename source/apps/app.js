enyo.kind({
	name: "B.Application",
	kind: "enyo.Application",
	// components: [{
		// name: "messageController",
		// kind: "enyo.Controller",
		// message: $L("Directory Index")
	// }],
	view: "B.MainView",
	published: {
		loc: {
			dir: "",
			path: "",
			pathArray: []
		},
		page: {
			baseTitle: "Blake's Dev Server"
		},
		fileServerHostname: "dev",
		fileServerPort: "8888",
		// fileServerHostname: "zion.resourcefork.com",
		// fileServerPort: "4043",
		fileServerHost: function() {
			var port = this.get("fileServerPort") ? ":" + this.get("fileServerPort") : "";
			return this.get("fileServerHostname") + port;
		}
	},
	computed: {
		fileServerHost: [{cached: true}, ["fileServerHostname","fileServerPort"]]
	},
	directories: {},
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
		if (strPath === undefined) { 
			return [];
		}
		strPath = strPath.replace(/^\/|\/$/g, "");
		if (strPath === "") {
			return [];
		}
		return strPath.split("/");
	},
	getPrettyPath: function(strPath, strJoinWith) {
		var arrPath = this.getPathArray(strPath);
		for(var i = 0; i < arrPath.length; i++) {
			arrPath[i] = arrPath[i].toWordCase();
		}
		// console.log("arrPath",arrPath);
		return arrPath.reverse().join( strJoinWith || " - ");
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
	},
	setMultiple: function(inTarget, inOptions) {
		for (var prop in inOptions) {
			switch (prop) {
				case "classes":
					inTarget.addRemoveClass( inOptions[prop], true);
					break;
				default:
					inTarget.set(prop, inOptions[prop]);
			}
		}
	}
	// we overloaded the default `start` method to also call our `update` method
	// once the view is rendered
	// start: enyo.inherit(function (sup) {
		// return function () {
			// sup.apply(this, arguments);
			// console.log("Application.start",this);
			// this.$.mainView.update();
		// };
	// })
});
