enyo.kind({
	name: "B.Application",
	kind: "enyo.Application",
	view: "B.MainView",
	components: [
		{name: "router", kind: "B.Router"}
	],
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
	handlers: [
		{onPathChange: "handlePathChange"}
	],
	// Load in our settings
	mixins: [
		"enyo.Settings.Main"
	],
	handlePathChange: function(inSender, inEvent) {
		this.set("locPath", inEvent.path );
	},
	setPageTitle: function(strTitle) {
		document.title = (strTitle ? (strTitle + this.get("titleDelimiter")) : "") + this.get("titleBase");
	},
	locPathChanged: function() {
		var locpath = this.get("locPath");
		this.set("locDir", locpath.replace(/^.*\/(.+?)\/?$/, "$1") );
		this.setPageTitle( this.getPrettyPath( locpath ) );
		this.$.router.trigger({location: "#" + locpath, change: true});
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
		var arrPath = this.getPathArray(strPath),
			arrOutPath = [];
		for(var i = 0; i < arrPath.length; i++) {
			if (arrPath[i]) {
				arrOutPath.push(arrPath[i].toWordCase());
			}
		}
		return arrOutPath.reverse().join( strJoinWith || this.get("titleDelimiter") || "");
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
});
