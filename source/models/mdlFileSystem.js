enyo.kind({
	name: "mdlFileSystem",
	kind: enyo.Collection,
	model: mdlDirectory,
	defaultSource: "jsonp",
	// this is the url we want to use to request the data for the games but notice the `%.` that
	// we will use with _enyo.format_ to replace that with the current week
	// url: "http://data.ncaa.com/jsonp/scoreboard/football/fbs/2013/%./scoreboard.html",
	// url: "http://dev:8888/?f=json&callback=my_func",
	url: "http://dev:8888/%.?f=json",
	path: "",
	// url: "assets/OfflineScoreboard.html",
	getUrl: function () {
		// Inject the path into the right place in the URL we are going to fetch.
		return enyo.format(this.url, this.path);
	},
	// primaryKey: 'name',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		// array of days with games that week
		// data.contents = new enyo.Collection(data, {model: mdlDirectory, owner: this, didFetch: true});
		console.log("mdlFileSystem:Data.filesystem", data.filesystem);

		return data.filesystem;
	},
});
