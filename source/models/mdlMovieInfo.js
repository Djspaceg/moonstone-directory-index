// (function (enyo) {
// 	//*@public
// 	/**
// 		A generic source for use with an Ajax-ready backend. It uses the "GET"
// 		method for _fetch()_, "POST" or "PUT" for _commit()_ (depending on whether
// 		the record is _new_ (created locally), and "DELETE" for _destroy()_.
// 	*/
// 	enyo.kind({
// 		name: "B.XmlSource",
// 		kind: enyo.AjaxSource,
// 		//* Uses the _enyo.Ajax_ kind for requests
// 		requestKind: enyo.Ajax,
// 		handleAs: "xml",
// 		//* Uses "GET" method.
// 		fetch: function (rec, opts) {
// 			opts.method = "GET";
// 			opts.url = this.buildUrl(rec, opts);
// 			this.go(opts);
// 		}
// 	});
// 	enyo.store.addSources({xml: "B.XmlSource"});
// })(enyo);

enyo.kind({
	name: "mdlMovie",
	kind: enyo.Model,
	// mergeKeys: ["day"],
	// this is a read-only example, and this flag means if _destroy_ is called on this
	// model it will only do the local routines
	readOnly: true,
	attributes: {
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
		}
	},
	computed: {
		suptitle: [{cached: true}, "title"],
		subtitle: [{cached: true}, "title"]
	},
	primaryKey: "path"
});

enyo.kind({
	name: "mdlMovieInfo",
	kind: enyo.Collection,
	model: "mdlMovie",
	defaultSource: "jsonp",
	url: "http://%./json%.",
	path: "",
	getUrl: function () {
		// Inject the path into the right place in the URL we are going to fetch.
		return enyo.format(this.url, this.app.get("fileServerHost"), this.path);
	},
	parse: function (data) {
		if (data.movie) {
			data.movie.path = this.get("path");
		}
		return data.movie;
	}
});
