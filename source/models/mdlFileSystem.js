/// File Model ////////////////////////////////////////////
enyo.kind({
	name: "mdlFile",
	kind: enyo.Model,
	// mergeKeys: ["day"],
	// this is a read-only example, and this flag means if _destroy_ is called on this
	// model it will only do the local routines
	readOnly: true,
	attributes: {
		// title: "",
		// size: "",
		// ext: "",
		// path: "",
		icon: function () {
			var media = this.get("hasMedia");
				// console.log("fileServerHost", this );
			if (media) {
				return "http://" + this.get("fileServerHost") + this.get("path") + media;
			}
			return this.getIconSrc(this.get("ext"));
		},
		lastModified: function () { 
			return new Date(this.get("mtime"));
		},
		prettySize: function() {
			return this.formatSize(this.get("size"));
		},
		prettyLastModified: function () {
			var d = this.get("lastModified");
			return this.formatDate(d);
		},
		fileServerHostname: "zion.resourcefork.com",
		fileServerPort: "4043",
		fileServerHost: function() {
			var port = this.get("fileServerPort") ? ":" + this.get("fileServerPort") : "";
			return this.get("fileServerHostname") + port;
		}
	},
	computed: {
		icon: [{cached: true}, "ext"],
		lastModified: [{cached: true}],
		prettySize: [{cached: true}, "size"],
		prettyLastModified: [{cached: true}, "lastModified"],
		fileServerHost: [{cached: true}, ["fileServerHostname","fileServerPort"]]
	},
	primaryKey: 'path',
	icons: {
		// GENERAL ICONS (BLANK, DIRECTORY, PARENT DIRECTORY)
		"folder":	"/moonstone-directory-index/assets/icons/128/folder-128.png",
		"parent":	"/moonstone-directory-index/assets/icons/128/fill-folder-128.png",
		"generic":	"/moonstone-directory-index/assets/icons/128/blank-file-128.png",

		// EXTENSION SPECIFIC ICONS
		"txt":		"/moonstone-directory-index/assets/icons/128/text-file-128.png",
		"md":		"/moonstone-directory-index/assets/icons/128/text-file-128.png",
		"gif":		"/moonstone-directory-index/assets/icons/128/gif-128.png",
		"png":		"/moonstone-directory-index/assets/icons/128/png-128.png",
		"jpg":		"/moonstone-directory-index/assets/icons/128/jpg-128.png",
		"jpeg":		"/moonstone-directory-index/assets/icons/128/jpg-128.png",
		"css":		"/moonstone-directory-index/assets/icons/128/css-128.png",
		"less":		"/moonstone-directory-index/assets/icons/128/css-128.png",
		"js":		"/moonstone-directory-index/assets/icons/128/js-128.png",
		"design":	"/moonstone-directory-index/assets/icons/128/text-file-128.png",
		"json":		"/moonstone-directory-index/assets/icons/128/text-file-128.png",
		"html":		"/moonstone-directory-index/assets/icons/128/html-128.png",
		"htm":		"/moonstone-directory-index/assets/icons/128/html-128.png",
		"php":		"/moonstone-directory-index/assets/icons/128/logo-php-128.png",
		"dmg":		"/moonstone-directory-index/assets/icons/128/dmg-128.png",
		"exe":		"/moonstone-directory-index/assets/icons/128/exe-128.png",
		"mov":		"/moonstone-directory-index/assets/icons/128/mov-128.png",
		"ogg":		"/moonstone-directory-index/assets/icons/128/ogg-128.png",
		"avi":		"/moonstone-directory-index/assets/icons/128/avi-128.png",
		"mpg":		"/moonstone-directory-index/assets/icons/128/mpg-128.png",
		"pdf":		"/moonstone-directory-index/assets/icons/128/pdf-128.png",
		"rar":		"/moonstone-directory-index/assets/icons/128/rar-128.png",
		"wma":		"/moonstone-directory-index/assets/icons/128/wma-128.png",
		"zip":		"/moonstone-directory-index/assets/icons/128/zip-128.png",
		"mp3":		"/moonstone-directory-index/assets/icons/128/mp3-128.png",
		"flv":		"/moonstone-directory-index/assets/icons/128/flv-128.png",
	},
	formatSize: function(size) {
		var arrSizes = ['bytes','KB','MB','GB','TB'];
		for (var i = 0; i < arrSizes.length; i++) {
			if ((size >> (10 * i)) == 0) {
				return (size >> (10 * (i-1))) + " " + arrSizes[i-1];
			}
		};
		return "0 " + arrSizes[0];
	},
	formatDate: function(date) {
		var arrMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return arrMonths[date.getMonth()] + " " + date.getDate() + " " + (1900 + date.getYear()) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	},
	getIconSrc: function(ext) {
		return this.icons[ext] || this.icons["generic"];
	}
	// parse: function (data) {
	// 	console.log("mdlFile:Data", data);
	// 	return data;
	// }
});

/// Directory Model ///////////////////////////////////////
enyo.kind({
	name: "mdlDirectory",
	kind: enyo.Model,
	readOnly: true,
	attributes: {
		// app: function() {
		// 	return this.get("appRef");
		// },
		path: "path",
		name: function () { 
			return this.get("name");
		},
		title: function () { 
			var strDir = this.get("name");
			// console.log("mdlDirectory", this.appRef, this.get("app"), this );
			return strDir === "/" ? "/Home" : strDir.toWordCase();
		},
		// contents: []
	},
	computed: {
		title: [{cached: true}, "name"]
		// app: [{cached: true}, "appRef"]
	},
	primaryKey: 'path',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		// array of days with games that week
		data.contents = new enyo.Collection(data.contents, {model: mdlFile, didFetch: true}); // owner: this <- causes .getId error
		// console.log("mdlDirectory:Data", data);
		// data.appRef = this.get("app");
		return data;
	},
});

/// FileSystem Model //////////////////////////////////////
enyo.kind({
	name: "mdlFileSystem",
	kind: enyo.Collection,
	model: mdlDirectory,
	defaultSource: "jsonp",
	// this is the url we want to use to request the data for the games but notice the `%.` that
	// we will use with _enyo.format_ to replace that with the current week
	// url: "http://data.ncaa.com/jsonp/scoreboard/football/fbs/2013/%./scoreboard.html",
	// url: "http://dev:8888/?f=json&callback=my_func",
	url: "http://%./%.?f=json",
	path: "",
	getUrl: function () {
		// Inject the path into the right place in the URL we are going to fetch.
		// return enyo.format(this.url, window.location.hostname, ":8888", this.path);
		return enyo.format(this.url, this.app.get("fileServerHost"), this.path);
	},
	// primaryKey: 'name',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		// array of days with games that week
		// console.log("mdlFileSystem:Data.filesystem", data.filesystem);
		data.filesystem[0].app = this.app;

		return data.filesystem;
	},
});
