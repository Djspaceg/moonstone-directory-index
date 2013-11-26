enyo.kind({
	name: "mdlDirectory",
	kind: enyo.Model,
	// model: mdlFile,
	readOnly: true,
	attributes: {
		path: "path",
		name: function () { 
			return this.get("name");
		},
		title: function () { 
			var strDir = this.get("name");
			return strDir === "/" ? "/Home" : strDir.toWordCase();
		},
		// contents: []
	},
	computed: {
		title: [{cached: true}],
	},
	// defaultSource: "jsonp",
	// this is the url we want to use to request the data for the games but notice the `%.` that
	// we will use with _enyo.format_ to replace that with the current week
	// url: "http://data.ncaa.com/jsonp/scoreboard/football/fbs/2013/%./scoreboard.html",
	// url: "http://dev:8888/?f=json&callback=my_func",
	// url: "http://dev:8888/%.?f=json",
	// path: "",
	// url: "assets/OfflineScoreboard.html",
	// getUrl: function () {
	// 	// Inject the path into the right place in the URL we are going to fetch.
	// 	return enyo.format(this.url, this.path);
	// },
	primaryKey: 'path',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		// array of days with games that week
		// console.log("mdlDirectory:Data", data, this);
		data.contents = new enyo.Collection(data.contents, {model: mdlFile, didFetch: true}); // owner: this <- causes .getId error
		// this.$.directoryContents.set("collection", data.directory);
		// console.log("mdlDirectory:Data", data);

		return data;
	},
});
