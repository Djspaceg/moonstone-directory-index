/// Noche Server Model ////////////////////////////////////
enyo.kind({
	name: "noche.Source",
	kind: "enyo.JsonpSource",
	defaultSource: "jsonp",
	// url: "http://%./json/%.",
	urlRoot: "http://%./json%.",
	buildUrl: function(rec, opts) {
		// console.log("noche.Source:buildUrl:", this, rec, opts);
		// this.inherited(arguments);
		var urlHost = rec.get("host") || "localhost",
			urlPath = opts.url || (enyo.isFunction(rec.getUrl) && rec.getUrl()) || rec.url;
		// console.log("noche.Source:buildUrl: '%s' = '%s' + '%s';", enyo.format(this.urlRoot, urlHost, urlPath), urlHost, urlPath);
		return enyo.format(this.urlRoot, urlHost, urlPath);
	}
	// fetch: function(rec, opts) {
		// console.log("noche.Source:fetch:", this, rec, opts);
		// // opts.params = {};
		// this.inherited(arguments);
		// // debugger;
	// }
});

enyo.store.addSources({noche: "noche.Source"});

