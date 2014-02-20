enyo.kind({
	name: "B.MovieInfo",
	parentOptions: {
		classes: "movie-info"
	},
	headerOptions: {
		smallHeader: false,
		classes: "movie-info-header"
	},
	components: [
		{name: "poster", kind: "moon.Image", src: "", alt: "", classes: "movie-info-poster moon-gridlist-imageitem", showBadgesOnSpotlight: true, spotlight: true, ontap: "playPressed", components: [
			{kind: "moon.Icon", icon: "play", spotlight: false, small: false}
		]},
		{name: "year", classes: "movie-info-year", content: "yearHere"},
		{name: "plotFrame", classes: "movie-info-plot-frame", kind: "moon.Scroller", fit:true, components: [
			{name: "plot", content: "", classes: "movie-info-plot"}
		]}
	],
	published: {
		path: "",
		movieName: "",
		nfoName: "",
		// posterName: "",
		// fanartName: "",
		// These two methods MUST be loaded in this way, because standard bindings fire too late.
		// When the main.js fires, looking for the background art, the standard fanart is still blank,
		// even though the binding is set to be dependent on the model. It's having trouble trickling up.
		// Maybe I need an event here to fire it manually instead of this hack?
		posterName: function() { return this.model.get("poster"); },
		fanartName: function() { return this.model.get("fanart"); },
		// posterSuffix: ".tbn",
		title: null,
		plot: "",
		year: "",
		mpaaOriginal: "",
		//* URL src of a poster/thumbnail image
		videoSrc: function() {
			return "http://" + this.app.get("fileServerHost") + encodeURI( this.get("path") + this.get("movieName") + ".mp4");
		},
		//* URL src of a poster/thumbnail image
		posterSrc: function() {
			// return "http://" + this.app.get("fileServerHost") + this.get("path") + this.get("movieName") + this.get("posterSuffix");
			return "http://" + this.app.get("fileServerHost") + encodeURI( this.get("path") + this.get("posterName") );
		},
		//* URL src of a background image
		fanartSrc: function() {
			return "http://" + this.app.get("fileServerHost") + encodeURI( this.get("path") + this.get("fanartName") );
		},
		yearFormatted: function() {
			var year = this.get("year");
			return year ? "(" + year + ")" : "";
		},
		mpaa: function() {
			var value = this.get("mpaaOriginal") || "";
			return value.replace(/^Rated\s*/, "");
		},
		//* Set to true to align image to right of text
		imageAlignRight: false
	},
	events: {
		//* Fires when the poster's play button is activated.
		onPlay: ""
	},
	bindings: [
		{from: ".model.basename", to: ".movieName"},
		{from: ".model.poster", to: ".posterName"},
		{from: ".model.fanart", to: ".fanartName"},
		{from: ".model.nfo", to: ".nfoName"},
		{from: ".model.title", to: ".$.poster.alt"},
		{from: ".modelMovieInfo.suptitle", to: ".title"},
		{from: ".modelMovieInfo.subtitle", to: ".subtitle"},
		{from: ".modelMovieInfo.tagline", to: ".tagline"},
		{from: ".modelMovieInfo.year", to: ".year"},
		{from: ".modelMovieInfo.mpaa", to: ".mpaaOriginal"},
		{from: ".modelMovieInfo.plot", to: ".plot"},
		{from: ".imageAlignRight", to: ".$.image.imageAlignRight"},
		{from: ".plot", to: ".$.plot.content"},
		{from: ".posterSrc", to: ".$.poster.src"},
		{from: ".yearFormatted", to: ".$.year.content"}
	],
	computed: {
		// Set a computed dependency, so when it changes, we recalculate the week.
		posterName: [{cached: true}, ["model"]],
		fanartName: [{cached: true}, ["model"]],
		videoSrc: [{cached: true}, ["model", "path", "movieName"]],
		posterSrc: [{cached: true}, ["model", "path", "posterName"]],
		fanartSrc: [{cached: true}, ["model", "path", "fanartName"]],
		yearFormatted: [{cached: true}, "year"],
		mpaa: [{cached: true}, "mpaaOriginal"]
	},
	playPressed: function(inSender, inEvent) {
		console.log("playPressed", this.get("videoSrc"));
		this.doPlay( {videoSrc: this.get("videoSrc") } );
	}
});
