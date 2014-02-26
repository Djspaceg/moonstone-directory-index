/// File Model ////////////////////////////////////////////
enyo.kind({
	name: "mdlFile",
	kind: enyo.Model,
	// mergeKeys: ["day"],
	readOnly: true,
	attributes: {
		icon: function () {
			var media = this.get("hasMedia");
			if (media) {
				return "http://" + enyo.$.directoryIndex_mainView.app.get("fileServerHost") + this.get("path") + media;
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
		}
	},
	computed: {
		icon: [{cached: true}, "ext"],
		lastModified: [{cached: true}],
		prettySize: [{cached: true}, "size"],
		prettyLastModified: [{cached: true}, "lastModified"]
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
		"flv":		"/moonstone-directory-index/assets/icons/128/flv-128.png"
	},
	formatSize: function(size) {
		var arrSizes = ['bytes','KB','MB','GB','TB'];
		if (size > 0) {
			for (var i = 0; i < arrSizes.length; i++) {
				if ((size >> (10 * i)) === 0) {
					return (size >> (10 * (i-1))) + " " + arrSizes[i-1];
				}
			}
		}
		return "0 " + arrSizes[0];
	},
	zeroPad: function(inNum) {
		return (inNum < 10 && inNum > -10) ? "0" + inNum : inNum;
	},
	formatDate: function(date) {
		var arrMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return arrMonths[date.getMonth()] + " " + date.getDate() + " " + (1900 + date.getYear()) + " " + date.getHours() + ":" + this.zeroPad(date.getMinutes()) + ":" + this.zeroPad(date.getSeconds());
	},
	getIconSrc: function(ext) {
		return this.icons[ext] || this.icons["generic"];
	}
});

/// Directory Model ///////////////////////////////////////
enyo.kind({
	name: "mdlDirectory",
	kind: enyo.Model,
	readOnly: true,
	attributes: {
		basename: "",
		nfo: "",
		poster: "",
		fanart: "",
		videos: [],
		path: "path",
		name: function () { 
			return this.get("name");
		},
		title: function () { 
			var strDir = this.get("name");
			return strDir === "/" ? "/Home" : strDir.toWordCase();
		}
	},
	computed: {
		title: [{cached: true}, "name"]
	},
	primaryKey: "path",
	parse: function (data) {
		data.contents = new enyo.Collection(data.contents, {model: "mdlFile", didFetch: true}); // owner: this <- causes .getId error
		if (data.hasMedia) {
			var objMedia = this.mediaFolderRecon(data);
			enyo.mixin(data, objMedia);
		}
		return data;
	},
	/**
	 * for files that match the filetypes patterns, set the keyed (filetype-key) property.
	 * Also set the basename, using any of the file patterns bases.
	 */
	mediaFolderRecon: function(inModel) {
		var filetypes = {
				nfo: /\.nfo$/i,
				poster: /(\.tbn|-poster\.(jpg|png))$/i,
				fanart: /-fanart\.(jpg|png)$/i,
				videos: /\.(mp4|m4v|avi|mov)$/i
			},
			outData = {
				basename: "",
				nfo: "",
				poster: "",
				fanart: "",
				videos: []
			};

		if (inModel.contents && inModel.contents.map) {
			inModel.contents.map( function(file, index) {
				var name = file.get("name");
				for (var filepattern in filetypes) {
					if (name.match(filetypes[filepattern])) {
						if (enyo.isArray(outData[filepattern])) {
							outData[filepattern].push( name );
						}
						else {
							outData[filepattern] = name;
						}
						outData.basename = name.replace(filetypes[filepattern], "");
					}
				}
			});
		}
		return outData;
	}
});

/// FileSystem Model //////////////////////////////////////
enyo.kind({
	name: "mdlFileSystem",
	kind: enyo.Collection,
	model: "mdlDirectory",
	defaultSource: "jsonp",
	url: "http://%./json/%.",
	path: "",
	getUrl: function () {
		// Inject the path into the right place in the URL we are going to fetch.
		return enyo.format(this.url, this.app.get("fileServerHost"), this.path);
	},
	// primaryKey: 'name',
	parse: function (data) {
		// the data comes back as an object with a property that is the
		data.filesystem[0].app = this.app;

		return data.filesystem;
	}
});