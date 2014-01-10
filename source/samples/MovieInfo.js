enyo.kind({
	name: "B.samples.models.MovieInfo",
	classes: "moon enyo-fit enyo-unselectable",
	attributes: {
		panelList: {},
	},
	components: [
		{name: "panels", kind: "moon.Panels", classes: "enyo-fit", pattern: "activity", //style: "z-index: 1000;",
			components: [],
		}
	],
	create: function() {
		this.inherited(arguments);
		this.createDirectoryPanel({path: "/movie-info-page/Hobbit%20An%20Unexpected%20Journey,%20The%20(2012)/"});
		// console.log("Panel Create:", this, arrBread);
			// bitMediaFolder = "The Hobbit An Unexpected Journey (2012)";
	},
	createDirectoryPanel: function(inOptions) {
		if (!inOptions) {
			inOptions = { path: "/" };
		}
		var m = enyo.store.findLocal({ path: inOptions.path })[0];
		console.log("createDirectoryPanel with model:", m);
		if (m) {
			var p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
			p.set("model", m );
			return true;
		}
		m = this.createComponent({name: inOptions.path, path: inOptions.path, kind: mdlFileSystem});
		console.log("Model doesn't exist yet. createDirectoryPanel with new model:", m);
		m.fetch({success: enyo.bind(this, function(inObj,inBindOptions,inData) {
			var p,
				bitMediaFolder = m.at(0).get("hasMedia");
			if (bitMediaFolder) {
				var strMovieName = bitMediaFolder || "";
				strMovieName = strMovieName.replace(/\..*?$/, "");
				// console.log("Creating a media panel", inOptions, strMovieName);
				p = this.$.panels.pushPanel( {kind: "B.MovieInfo", path: inOptions.path, movieName: strMovieName} );
				var mi = this.createComponent({name: inOptions.path, path: inOptions.path + "/" + strMovieName + ".nfo", kind: mdlMovieInfo});
				mi.fetch({success: enyo.bind(this, function(inObj,inBindOptions,inData) {
					// console.log("-- Successfully loaded MovieInfo! --", mi.at(0) );
					p.set("modelMovieInfo", mi.at(0) );
				}), strategy: "merge"});
				// p.set("model", m.at(0) );
			}
			else {
				p = this.$.panels.pushPanel( {kind: "B.DirectoryIndex", path: inOptions.path} );
			}
			p.set("model", m.at(0) );
			// console.log( "m.at(0)", m.at(0), "hasMedia:", m.at(0).get("hasMedia") );
		}), strategy: "merge"});
	},
});
