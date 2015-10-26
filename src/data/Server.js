/// Noche Source //////////////////////////////////////////////////////////////
var
	kind = require('enyo/kind'),
	Model = require('enyo/Model');

/**
* I forgot why i wrote this, but it seemed really important at the time.
* I think it related to the ability to pre-defined all the tedious parts of
* the server name, then be able to switch in and out different hosts
* when generating new kinds from this base server type...
*/
module.exports = kind({
	name: 'B.Server',
	kind: Model,
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
