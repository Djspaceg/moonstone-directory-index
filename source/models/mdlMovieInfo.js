enyo.kind({
	name: "mdlMovie",
	kind: "enyo.Model",
	readOnly: true,
	// attributes: {
		suptitle: function() {
			// Just the part of the title BEFORE the possible :
			var title = (this.get("title") || "");
			if (title.match(/:/)) {
				title = title.replace(/^(.*)\s*:.*$/, "$1");
			}
			// console.log("set suptitle from: %s; to %s;", this.get("title"), title);
			return title;
		},
		subtitle: function() {
			// Just the part of the title AFTER the possible :
			var title = (this.get("title") || "");
			if (title.match(/:/)) {
				title = title.replace(/^.*:\s*(.*)$/, "$1");
			}
			else {
				return "";
			}
			// console.log("set subtitle from: %s; to %s;", this.get("title"), title);
			return title;
		// }
	},
	computed: {
		suptitle: [{cached: true}, "title"],
		subtitle: [{cached: true}, "title"]
	},
	primaryKey: "path"
});

enyo.kind({
	name: "mdlMovieInfo",
	kind: "enyo.Collection",
	model: "mdlMovie",
	defaultSource: "NocheSource",
	options: {
		palse: true
	},
	published: {
		host: function() { return this.app.get("fileServerHost"); }
	},
	computed: {
		host: [{cached: true}]
	},
	parse: function (data) {
		if (data.movie) {
			data.movie.path = this.get("path");
		}
		return data.movie;
	}
});
