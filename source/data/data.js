(function (enyo, scope) {

	/// Noche Source //////////////////////////////////////////////////////////////
	enyo.kind({
		name: 'B.NocheSource',
		kind: enyo.JsonpSource,
		urlRoot: 'http://%./json%.',
		buildUrl: function (rec, opts) {
			// console.log('noche.Source:buildUrl:', rec.app.get('fileServerHost'));
			var urlHost = rec.app.get('fileServerHost') || 'localhost',
				urlPath = opts.url || (enyo.isFunction(rec.getUrl) && rec.getUrl()) || rec.url;
			// console.log('noche.Source:buildUrl: '%s' = '%s' + '%s';', enyo.format(this.urlRoot, urlHost, urlPath), urlHost, urlPath);
			return enyo.format(this.urlRoot, urlHost, urlPath);
		}
	});

	/**
	* I forgot why i wrote this, but it seemed really important at the time.
	* I think it related to the ability to pre-defined all the tedious parts of
	* the server name, then be able to switch in and out different hosts
	* when generating new kinds from this base server type...
	*/
	enyo.kind({
		name: 'B.Server',
		kind: enyo.Model,
		title: '',
		protocol: 'http',
		hostname: '',
		port: '',
		basePath: '/json',
		host: function () {
			var port = this.get('port') ? ':' + this.get('port') : '';
			return this.get('hostname') + port;
		},
		url: function () {
			return this.get('protocol') + '://' + this.get('host') + this.get('basePath');
		},
		computed: {
			host: ['hostname', 'port'],
			url: ['protocol', 'host', 'basePath']
		}
	});

})(enyo, this);