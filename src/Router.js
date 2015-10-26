var
	kind = require('enyo/kind'),
	Router = require('enyo/Router');

module.exports = kind({
	name: 'B.Router',
	kind: Router,
	history: true,
	routes: [
		{path: ':', handler: 'handlePath', 'default': true}
	],
	events: {
		onPathChange: ''
	},
	handlePath: function (path) {
		// console.log('loadPath:inPath: "%s";', arguments, this.location());
		this.doPathChange({path: path});
	}
});
