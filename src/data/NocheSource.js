/// Noche Source //////////////////////////////////////////////////////////////
var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	JsonpSource = require('enyo/JsonpSource');

module.exports = kind({
	name: 'B.NocheSource',
	kind: JsonpSource,
	urlRoot: 'http://%./json%.',
	buildUrl: function (rec, opts) {
		// console.log('noche.Source:buildUrl:', rec.app.get('fileServerHost'));
		var urlHost = rec.app.get('fileServerHost') || 'localhost',
			urlPath = opts.url || (util.isFunction(rec.getUrl) && rec.getUrl()) || rec.url;
		// console.log('noche.Source:buildUrl: '%s' = '%s' + '%s';', util.format(this.urlRoot, urlHost, urlPath), urlHost, urlPath);
		return util.format(this.urlRoot, urlHost, urlPath);
	}
});
