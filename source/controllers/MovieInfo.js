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
		posterName: "",
		// posterSuffix: ".tbn",
		fanartSuffix: "-fanart.jpg",
		title: null,
		plot: "",
		year: "",
		mpaaOriginal: "",
		//* URL src of a poster/thumbnail image
		videoSrc: function() {
			return "http://" + this.app.get("fileServerHost") + this.get("path") + this.get("movieName") + ".mp4";
		},
		//* URL src of a poster/thumbnail image
		posterSrc: function() {
			// console.log("posterSrc:", this.get("model") , this.get("movieName") + this.get("posterSuffix"));
			// return "http://" + this.app.get("fileServerHost") + this.get("path") + this.get("movieName") + this.get("posterSuffix");
			return "http://" + this.app.get("fileServerHost") + this.get("path") + this.get("posterName");
		},
		//* URL src of a background image
		fanartSrc: function() {
			return "http://" + this.app.get("fileServerHost") + this.get("path") + this.get("movieName") + this.get("fanartSuffix");
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
		{from: ".posterSrc", to: ".$.poster.src"},
		{from: ".model.title", to: ".$.poster.alt"},
		{from: ".modelMovieInfo.suptitle", to: ".title"},
		{from: ".modelMovieInfo.subtitle", to: ".subtitle"},
		{from: ".modelMovieInfo.tagline", to: ".tagline"},
		// {from: ".modelMovieInfo.suptitle", to: ".$.header.title"},
		// {from: ".modelMovieInfo.subtitle", to: ".$.header.titleBelow"},
		// {from: ".modelMovieInfo.tagline", to: ".$.header.subTitleBelow"},
		{from: ".modelMovieInfo.year", to: ".year"},
		{from: ".modelMovieInfo.mpaa", to: ".mpaaOriginal"},
		{from: ".yearFormatted", to: ".$.year.content"},
		{from: ".modelMovieInfo.plot", to: ".plot"},
		{from: ".plot", to: ".$.plot.content"},
		{from: ".imageAlignRight", to: ".$.image.imageAlignRight"}
	],
	computed: {
		// Set a computed dependency, so when it changes, we recalculate the week.
		videoSrc: [{cached: true}, ["path", "movieName"]],
		posterSrc: [{cached: true}, ["path", "posterName"]],
		fanartSrc: [{cached: true}, ["path", "movieName", "fanartSuffix"]],
		yearFormatted: [{cached: true}, "year"],
		mpaa: [{cached: true}, "mpaaOriginal"]
	},
	playPressed: function(inSender, inEvent) {
		console.log("playPressed", this.get("videoSrc"));
		this.doPlay( {videoSrc: this.get("videoSrc") } );
	}
});
