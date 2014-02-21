enyo.kind({
	name: "B.Router",
	kind: enyo.Router,
	history: true,
	routes: [
		{path: ":", handler: "loadPath"}
	],
	events: {
		onPathChange: ""
	},
	loadPath: function (inPath) {
		// console.log("loadPath:inPath: '%s';",arguments, this.location());
		this.doPathChange({path: this.location()});
	}
});