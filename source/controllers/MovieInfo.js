enyo.kind({
	name: "B.MovieInfo",
	parentOptions: {
		classes: "movie-info",
	},
	headerOptions: {
		smallHeader: false,
		classes: "movie-info-header",
	},
	components: [
		{name: "poster", kind: "moon.Image", src: "", alt: "", classes: "movie-info-poster moon-gridlist-imageitem", showBadgesOnSpotlight: true, spotlight: true, ontap: "doPlay", components: [
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
		posterSuffix: ".tbn",
		fanartSuffix: "-fanart.jpg",
		title: null,
		year: "",
		// plot: "",
		//* URL src of a poster/thumbnail image
		posterSrc: function() {
			return this.get("path") + this.get("movieName") + this.get("posterSuffix");
		},
		//* URL src of a background image
		fanartSrc: function() {
			return this.get("path") + this.get("movieName") + this.get("fanartSuffix");
		},
		yearFormatted: function() {
			var year = this.get("year");
			return year ? "(" + year + ")" : "";
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
	    {from: ".yearFormatted", to: ".$.year.content"},
	    {from: ".modelMovieInfo.plot", to: ".$.plot.content"},
	    {from: ".imageAlignRight", to: ".$.image.imageAlignRight"}
	],
	computed: {
		// Set a computed dependency, so when it changes, we recalculate the week.
		posterSrc: [{cached: true}, ["path", "movieName", "posterSuffix"]],
		fanartSrc: [{cached: true}, ["path", "movieName", "fanartSuffix"]],
		yearFormatted: [{cached: true}, "year"]
	}
});
