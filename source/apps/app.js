enyo.kind({
	name: "B.Application",
	kind: "enyo.Application",
	view: "B.MainView",
	published: {
		locDir: "",
		locPath: "",
		locPathArray: function() {
			// var arr = this.getPathArray( this.get("locPath") );
			// console.log("locPathArray:", arr, this.get("locPath"));
			// return arr;
			return this.getPathArray( this.get("locPath") );
		},
		titleBase: "Moonstone Directory Index",
		titleDelimiter: " - ",
		fileServerHostname: "",
		fileServerPort: "",
		fileServerHost: function() {
			var port = this.get("fileServerPort") ? ":" + this.get("fileServerPort") : "";
			return this.get("fileServerHostname") + port;
		}
	},
	computed: {
		locPathArray: [{cached: true}, ["locPath"]],
		fileServerHost: [{cached: true}, ["fileServerHostname","fileServerPort"]]
	},
	// Load in our settings
	mixins: [
		"enyo.Settings.Main"
	],
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
	getHashPath: function() {
		var strPath = window.location.hash.substr(1);
		if (strPath.indexOf("/") !== 0) {
			return "/" + strPath;
		}
		return strPath || "/";
	},
	parseUrl: function() {
		this.set("locPath", this.getHashPath() );
		this.set("locDir", this.get("locPath").replace(/^.*\/(.+?)\/?$/, "$1") );
	},
	setPageTitle: function(strTitle) {
		document.title = (strTitle ? (strTitle + this.get("titleDelimiter")) : "") + this.get("titleBase");
	},
	locPathChanged: function() {
		this.setPageTitle( this.getPrettyPath( this.get("locPath") ) );
	},
	getPathArray: function(strPath) {
		if (strPath === undefined) { 
			return [""];
		}
		strPath = strPath.replace(/\/$/g, "");
		if (strPath === "") {
			return [""];
		}
		return strPath.split("/");
	},
	getPrettyPath: function(strPath, strJoinWith) {
		var arrPath = this.getPathArray(strPath);
		for(var i = 0; i < arrPath.length; i++) {
			if (arrPath[i]) {
				arrPath[i] = arrPath[i].toWordCase();
			}
		}
		return arrPath.reverse().join( strJoinWith || this.get("titleDelimiter") || "");
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
