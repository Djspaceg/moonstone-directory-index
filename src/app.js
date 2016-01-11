// Add some base
String.prototype.toUCFirst = function() {
	return this.charAt(0).toUpperCase() + this.substr(1);
};
String.prototype.toWordCase = function() {
	return this.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};



var
	// i18n = require('enyo/i18n'),
	kind = require('enyo/kind'),
	// Control = require('enyo/Control'),
	Application = require('enyo/Application'),
	Collection = require('enyo/Collection'),
	util = require('enyo/utils'),
	enyoRouter = require('enyo/Router');

// var
// 	ilib = require('enyo-ilib');

var
	MainView = require('./Main'),
	Settings = require('../conf/settings'),
	Server = require('./data/Server');

var Router = kind({
	name: 'B.Router',
	kind: enyoRouter,
	useHistory: true,
	routes: [
		{path: ':', handler: 'handlePath', 'default': true}
	],
	events: {
		onPathChange: ''
	},
	handlePath: function (path) {
		// console.log('loadPath:inPath: "%s";', arguments, this.location());
		// this.doPathChange({path: path});
		this.app.view.generatePanelsFromPath();
	}
});

module.exports = kind({
	name: 'B.Application',
	kind: Application,
	view: MainView,
	components: [
		{name: 'router', kind: Router, triggerOnStart: true}
	],
	servers: null,
	sources: [],
	published: {
		server: null,
		sourceCount: 0,
		locDir: '',
		locPath: '',
		// locPathArray: function() {
		// 	// var arr = this.getPathArray( this.get("locPath") );
		// 	// console.log("locPathArray:", arr, this.get("locPath"));
		// 	// return arr;
		// 	return this.getPathArray( this.get('locPath') );
		// },
		titleBase: 'Moonstone Directory Index',
		titleDelimiter: ' - ',
		fileServerHostname: '',
		fileServerPort: '',
		fileServerHost: function() {
			var server = this.get('server');
			// console.log("fileServerHost:", this, server,server.host);
			return server.get('host');
				// port = this.get("fileServerPort") ? ":" + this.get("fileServerPort") : "";
			// return this.get("fileServerHostname") + port;
		}
	},
	computed: {
		// locPathArray: ['locPath'],
		fileServerHost: ['fileServerHostname', 'fileServerPort']
	},
	// handlers: [
	// 	{onPathChange: 'handlePathChange'}
	// ],
	// Load in our settings
	mixins: [
		Settings.Main
	],
	initComponents: function (sender, ev) {
		Application.prototype.initComponents.apply(this, arguments);
		this.prepareServersCollection();

	},
	// create: function (sender, ev) {
	// 	// this.checkLocale();
	// 	i18n.updateLocale('en-US');
	// 	Application.prototype.create.apply(this, arguments);
	// },
	// checkLocale: function () {
	// 	// Reset locale in the event one of the samples changes it
	// 	if (ilib && ilib.getLocale() != this.locale) {
	// 		this.localeChanged(ilib.getLocale(), this.locale);
	// 	}
	// },
	// handlePathChange: function (sender, ev) {
	// 	console.log('handlePathChange:', ev);
	// 	this.set('locPath', ev.path );
	// 	// debugger;
	// 	return true;
	// },
	setPageTitle: function (strTitle) {
		document.title = (strTitle ? (strTitle + this.get('titleDelimiter')) : '') + this.get('titleBase');
	},
	locPathChanged: function (old, locpath) {
		// var locpath = this.get('locPath');
		this.set('locDir', locpath.replace(/^.*\/(.+?)\/?$/, '$1') );
		this.setPageTitle( this.getPrettyPath( locpath ) );
		this.$.router.trigger({location: locpath, change: true});
	},
	getModelKey: function(path) {
		// console.log('fileServerHost:', this.app.get('fileServerHost'));
		return this.get('fileServerHost') + path;
	},
	getPathArray: function (path) {
		if (typeof path == 'undefined') {
			return [''];
		}
		path = path.replace(/\/$/g, '');
		if (path === '') {
			return [''];
		}
		return path.split('/');
	},
	getPrettyPath: function (path, joinWith) {
		var i,
			arrPath = this.getPathArray( decodeURI(path) ),
			arrOutPath = [];
		for (i = 0; i < arrPath.length; i++) {
			if (arrPath[i]) {
				arrOutPath.push(arrPath[i].toWordCase());
			}
		}
		return arrOutPath.reverse().join( joinWith || this.get('titleDelimiter') || '');
	},
	setMultiple: function (target, opts) {
		for (var prop in opts) {
			switch (prop) {
				case 'classes':
					target.addClass(opts[prop]);
					break;
				default:
					target.set(prop, opts[prop]);
			}
		}
	},
	prepareServersCollection: function () {
		this.servers = new Collection(this.fileServers, {model: Server});//
		this.set('server', this.servers.at(0));
	},
	addSource: function () {
		var //sourceIndex = this.sources.length,
			sourceId = "noche",// + sourceIndex,
			sourceName = sourceId + ".Source";

		this.set("sourceEndIndex");
		kind({
			name: sourceName,
			kind: "noche.Source",
			defaultSource: "noche",
			// url: "http://%./json/%.",
			urlRoot: "http://%./json%.",
			buildUrl: function(rec, opts) {
				// console.log("noche.Source:buildUrl:", this, rec, opts);
				// this.inherited(arguments);
				var urlHost = rec.get("host") || "localhost",
					urlPath = opts.url || (util.isFunction(rec.getUrl) && rec.getUrl()) || rec.url;
				// console.log("noche.Source:buildUrl: '%s' = '%s' + '%s';", util.format(this.urlRoot, urlHost, urlPath), urlHost, urlPath);
				return util.format(this.urlRoot, urlHost, urlPath);
			}
			// fetch: function(rec, opts) {
				// console.log("noche.Source:fetch:", this, rec, opts);
				// // opts.params = {};
				// this.inherited(arguments);
				// // debugger;
			// }
		});
		var newSource = {};
		newSource[sourceId] = sourceName;
		util.store.addSources(newSource);
		this.sources.push(sourceId);
	}
	// we overloaded the default `start` method to also call our `update` method
	// once the view is rendered
// 	start: kind.inherit(function (sup) {
// 		return function () {
// //				// new B.NocheSource();
// 			// this.set('locPath', this.$.router.location);

// 			sup.apply(this, arguments);
// 			console.log('Application.start', this);

// 			// this.prepareServersCollection();
// 			// this.servers = new util.Collection(this.fileServers, {model: "B.Server"});
// 			console.log('Application.servers', this.servers);

// 			// this.addSource();
// 			// this.$.mainView.update();
// 		};
// 	})
});
