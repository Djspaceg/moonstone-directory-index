var
	kind = require('enyo/kind'),
	StringBinding = require('enyo/StringBinding');

var
	Scroller = require('moonstone/Scroller'),
	Img = require('moonstone/Image'),
	Icon = require('moonstone/Icon');

// Borrow the CSS from here
require('moonstone/GridListImageItem');

// This control is a parasite. It attaches to a host DirectoryPanel and assumes partial control
module.exports = kind({
	name: 'MovieInfo',
	imageAlignRight: false,
	parentOptions: {
		classes: 'movie-info'
	},
	headerOptions: {
		smallHeader: false,
		classes: 'movie-info-header'
	},
	components: [
		{name: 'poster', kind: Img, src: '', alt: '', classes: 'movie-info-poster moon-gridlist-imageitem sized-image', showBadgesOnSpotlight: true, spotlight: true, ontap: 'playPressed', components: [
			{kind: Icon, icon: 'play', spotlight: false, small: false}
		]},
		{name: 'year', classes: 'movie-info-year', content: 'yearHere'},
		{name: 'plotFrame', classes: 'movie-info-plot-frame', kind: Scroller, fit:true, components: [
			{name: 'plot', content: '', classes: 'movie-info-plot'}
		]}
	],
	path: '',
	movieName: '',
	nfoName: '',
	title: null,
	plot: '',
	//* URL src of the video file
	videoSrc: function () {
		return 'http://' + this.app.get('fileServerHost') + this.get('path') + this.get('movieName') + '.mp4';
	},
	//* URL src of a poster/thumbnail image
	posterSrc: function () {
		// return 'http://' + this.app.get('fileServerHost') + this.get('path') + this.get('movieName') + this.get('posterSuffix');
		return 'http://' + this.app.get('fileServerHost') + this.get('path') + this.get('posterName');
	},
	//* URL src of a background image
	fanartSrc: function () {
		console.log('%cfanartSrc:', 'color: blue;', this.get('path'), this.get('fanartName'));
		return 'http://' + this.app.get('fileServerHost') + this.get('path') + this.get('fanartName');
	},
	yearFormatted: function () {
		var year = this.get('year');
		return year ? '(' + year + ')' : '';
	},
	//* Set to true to align image to right of text
	events: {
		//* Fires when the poster's play button is activated.
		onPlay: ''
	},
	bindings: [
		{from: 'model.basename', to: 'movieName', transform: encodeURI},
		{from: 'model.poster', to: 'posterName', transform: encodeURI},
		{from: 'model.fanart', to: 'fanartName', transform: encodeURI},
		{from: 'model.nfo', to: 'nfoName', transform: encodeURI},
		{from: 'model.title', to: '$.poster.alt'},
		{from: 'modelMovieInfo.suptitle', to: 'title'},
		{from: 'modelMovieInfo.subtitle', to: 'subtitle'},
		{from: 'modelMovieInfo.year', to: '$.year.content', transform: function (val) { return val ? '(' + val + ')' : ''; }},
		{from: 'modelMovieInfo.mpaa', to: 'mpaa', transform: function (val) { return val ? val.replace(/^Rated\s*/, '') : ''; }},
		{from: 'imageAlignRight', to: '$.image.imageAlignRight'},
		{from: 'modelMovieInfo.plot', to: '$.plot.content', kind: StringBinding},
		{from: 'posterSrc', to: '$.poster.src'}
	],
	computed: {
		videoSrc: [{cached: true}, ['model', 'path', 'movieName']],
		posterSrc: [{cached: true}, ['model', 'path', 'posterName']],
		fanartSrc: [{cached: true}, ['model', 'path', 'fanartName']]
	},
	playPressed: function (inSender, inEvent) {
		console.log('playPressed', this.get('videoSrc'));
		this.doPlay( {videoSrc: this.get('videoSrc'), model: this.model, modelMovieInfo: this.modelMovieInfo } );
	}
});
