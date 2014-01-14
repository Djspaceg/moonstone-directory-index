enyo.kind({
	name: "B.MovieInfo",
	classes: "moon enyo-unselectable enyo-fit movie-info",
	kind: "moon.Panel",
	smallHeader: true,
	headerOptions: {
		classes: "movie-info-header",
	},
	components: [
		{name: "image", kind: "moon.Image", src: "", alt: "", classes: "movie-info-poster moon-gridlist-imageitem", showBadgesOnSpotlight: true, spotlight: true, ontap: "doPlay", components: [
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
		// subTitle: "",
		// year: "",
		// plot: "",
		//* URL src of a poster/thumbnail image
		posterSrc: null,
		//* URL src of a background image
		backgroundSrc: null,
		//* Set to true to align image to right of text
		imageAlignRight: false
	},
	events: {
		//* Fires when the poster's play button is activated.
		onPlay: ""
	},
	bindings: [
	    // {from: ".modelMovieInfo.suptitle", to: ".model.suptitle"},
	    // {from: ".modelMovieInfo.subtitle", to: ".model.subtitle"},
	    // {from: ".modelMovieInfo.year", to: ".model.year"},
	    // {from: ".modelMovieInfo.plot", to: ".model.plot"},
	    // {from: ".modelMovieInfo.tagline", to: ".model.tagline"},

	    {from: ".posterSrc", to: ".$.image.src"},
	    {from: ".model.title", to: ".$.image.alt"},
	    {from: ".modelMovieInfo.suptitle", to: ".$.header.title"},
	    {from: ".modelMovieInfo.subtitle", to: ".$.header.titleBelow"},
	    {from: ".modelMovieInfo.tagline", to: ".$.header.subTitleBelow"},
	    {from: ".yearFormatted", to: ".$.year.content"},
	    {from: ".modelMovieInfo.plot", to: ".$.plot.content"},
	    {from: ".imageAlignRight", to: ".$.image.imageAlignRight"}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.movieNameChanged();
	},
	movieNameChanged: function() {
		// console.log("New movie name is:", this.get("movieName"), "at path:", this.get("path"));
		if (this.get("title") == null) {
			this.set("title", this.movieName);
		}
		this.posterSuffixChanged();
		this.fanartSuffixChanged();
		this.yearChanged();
		// console.log("posterSrc:", this.posterSrc, this.get("path"), this);
	},
	posterSuffixChanged: function() {
		this.set("posterSrc", this.get("path") + this.get("movieName") + this.get("posterSuffix"));
	},
	fanartSuffixChanged: function() {
		this.set("backgroundSrc", this.get("path") + this.get("movieName") + this.get("fanartSuffix"));
	},
	yearChanged: function() {
		// console.log("year CHANGED!");
		var year = "";
		if (!year) {
			year = this.get("title").replace(/^.*\((\d+)\)$/, "$1");
		}
		// console.log("yearFormatted",year);
		this.set("yearFormatted", ( year ) ? "(" + year + ")" : "");
	},
	modelMovieInfoChanged: function() {
		// console.log("modelMovieInfo CHANGED!");
		var mi = this.get("modelMovieInfo"),
			year = mi ? mi.get("yearUH") : "";
		// console.log("yearChanged",this.get("year"));
		this.set("yearFormatted", ( year ) ? "(" + year + ")" : this.get("yearFormatted"));
	},
	backgroundSrcChanged: function() {
		this.applyStyle("background-image", (this.backgroundSrc) ? "url('" + this.backgroundSrc + "')": "linear-gradient(to bottom, rgba(130,140,149,1) 0%,rgba(40,52,59,1) 100%)");
	}
});
