enyo.kind({
	name: "mdlFile",
	kind: enyo.Model,
	// mergeKeys: ["day"],
	// this is a read-only example, and this flag means if _destroy_ is called on this
	// model it will only do the local routines
	readOnly: true,
	attributes: {
		title: "",
		size: "",
		ext: "",
		href: "",
		icon: function () { 
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
	},
	computed: {
		icon: [{cached: true}, "ext"],
		lastModified: [{cached: true}],
		prettySize: [{cached: true}, "size"],
		prettyLastModified: [{cached: true}, "lastModified"]
	},
	primaryKey: 'name',
	icons: {
		// GENERAL ICONS (BLANK, DIRECTORY, PARENT DIRECTORY)
		"folder":	"/moonstone-directory-index/assets/icons/128/folder.png",
		"parent":	"/moonstone-directory-index/assets/icons/128/parent.png",
		"generic":	"/moonstone-directory-index/assets/icons/64/stl.png",

		// EXTENSION SPECIFIC ICONS
		"txt":		"/moonstone-directory-index/assets/icons/64/dw.png",
		"md":		"/moonstone-directory-index/assets/icons/64/dw.png",
		"gif":		"/moonstone-directory-index/assets/icons/64/gif.png",
		"png":		"/moonstone-directory-index/assets/icons/64/png.png",
		"jpg":		"/moonstone-directory-index/assets/icons/64/jpeg.png",
		"jpeg":		"/moonstone-directory-index/assets/icons/64/jpeg.png",
		"css":		"/moonstone-directory-index/assets/icons/64/css.png",
		"less":		"/moonstone-directory-index/assets/icons/64/css.png",
		"js":		"/moonstone-directory-index/assets/icons/64/js.png",
		"design":	"/moonstone-directory-index/assets/icons/64/site.png",
		"json":		"/moonstone-directory-index/assets/icons/64/site.png",
		"html":		"/moonstone-directory-index/assets/icons/64/xml.png",
		"htm":		"/moonstone-directory-index/assets/icons/64/xml.png",
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
