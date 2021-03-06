// Add some base
String.prototype.toUCFirst = function() {
	return this.charAt(0).toUpperCase() + this.substr(1);
};
String.prototype.toWordCase = function() {
	return this.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

(function (enyo, scope) {

	enyo.kind({
		name: 'B.Application',
		kind: 'enyo.Application',
		view: 'B.MainView',
		components: [
			{name: 'router', kind: 'B.Router'}
		],
		servers: null,
		sources: [],
		published: {
			server: null,
			sourceCount: 0,
			locDir: '',
			locPath: '',
			locPathArray: function() {
				// var arr = this.getPathArray( this.get("locPath") );
				// console.log("locPathArray:", arr, this.get("locPath"));
				// return arr;
				return this.getPathArray( this.get('locPath') );
			},
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
			locPathArray: ['locPath'],
			fileServerHost: ['fileServerHostname', 'fileServerPort']
		},
		handlers: [
			{onPathChange: 'handlePathChange'}
		],
		// Load in our settings
		mixins: [
			'enyo.Settings.Main'
		],
		handlePathChange: function (sender, ev) {
			console.log('handlePathChange:', ev);
			this.set('locPath', ev.path );
		},
		setPageTitle: function (strTitle) {
			document.title = (strTitle ? (strTitle + this.get('titleDelimiter')) : '') + this.get('titleBase');
		},
		locPathChanged: function (old, locpath) {
			// var locpath = this.get('locPath');
			this.set('locDir', locpath.replace(/^.*\/(.+?)\/?$/, '$1') );
			this.setPageTitle( this.getPrettyPath( locpath ) );
			this.$.router.trigger({location: locpath, change: true});
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
			this.servers = new enyo.Collection(this.fileServers, {model: 'B.Server'});
			this.set('server', this.servers.at(0));
		},
		addSource: function () {
			var sourceIndex = this.sources.length,
				sourceId = "noche",// + sourceIndex,
				sourceName = sourceId + ".Source";

			this.set("sourceEndIndex");
			enyo.kind({
				name: sourceName,
				kind: "noche.Source",
				defaultSource: "noche",
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
			var newSource = {};
			newSource[sourceId] = sourceName;
			enyo.store.addSources(newSource);
			this.sources.push(sourceId);
		},
		// we overloaded the default `start` method to also call our `update` method
		// once the view is rendered
		start: enyo.inherit(function (sup) {
			return function () {
				new B.NocheSource();
				// this.set('locPath', this.$.router.location);

				sup.apply(this, arguments);
				console.log('Application.start', this);

				// this.prepareServersCollection();
				// this.servers = new enyo.Collection(this.fileServers, {model: "B.Server"});
				console.log('Application.servers', this.servers);

				// this.addSource();
				// this.$.mainView.update();
			};
		})
	});

	enyo.ready(function () {
		new B.Application({name: 'directoryIndex'});
	});

})(enyo, this);