enyo.kind({
	name: 'B.Router',
	kind: enyo.Router,
	history: true,
	routes: [
		{path: ':', handler: 'handlePath', default: true}
	],
	events: {
		onPathChange: ''
	},
	handlePath: function (path) {
		console.log('loadPath:inPath: "%s";', arguments, this.location());
		this.doPathChange({path: path});
	}
});

