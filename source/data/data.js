/// Noche Server Model ////////////////////////////////////
enyo.kind({
	name: "noche.Source",
	kind: enyo.JsonpSource,
	defaultSource: "jsonp",
	// url: "http://%./json/%.",
	urlRoot: "http://%./json%.",
	buildUrl: function(rec, opts) {
		// console.log("noche.Source:buildUrl:", this, rec, opts);
		console.log("noche.Source:buildUrl:", rec.app.get("fileServerHost"));
		// this.inherited(arguments);
		var urlHost = rec.app.get("fileServerHost") || "localhost",
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

/** 
 * I forgot why i wrote this, but it seemed really important at the time.
 * I think it related to the ability to pre-defined all the tedious parts of
 * the server name, then be able to switch in and out different hosts
 * when generating new kinds from this base server type...
 */

enyo.kind({
	name: "B.Server",
	kind: enyo.Model,
	attributes: {
		title: "",
		protocol: "http",
		hostname: "",
		port: "",
		basePath: "/json",
		host: function() {
			// console.log("server.host:", this);
			var port = this.get("port") ? ":" + this.get("port") : "";
			return this.get("hostname") + port;
		},
		url: function() {
			// console.log("server.url:", this);
			return this.get("protocol") + "://" + this.get("host") + this.get("basePath");
		}
	},
	computed: {
		host: [{cached: true}, ["hostname", "port"]],
		url: [{cached: true}, ["protocol", "host", "basePath"]]
	}
});

enyo.store.addSources({noche: "noche.Source"});

