(function (enyo, scope) {

	enyo.kind({
		name: 'B.MovieInfo',
		imageAlignRight: false,
		parentOptions: {
			classes: 'movie-info'
		},
		headerOptions: {
			smallHeader: false,
			classes: 'movie-info-header'
		},
		components: [
			{name: 'poster', kind: 'moon.Image', src: '', alt: '', classes: 'movie-info-poster moon-gridlist-imageitem', showBadgesOnSpotlight: true, spotlight: true, ontap: 'playPressed', components: [
				{kind: 'moon.Icon', icon: 'play', spotlight: false, small: false}
			]},
			{name: 'year', classes: 'movie-info-year', content: 'yearHere'},
			{name: 'plotFrame', classes: 'movie-info-plot-frame', kind: 'moon.Scroller', fit:true, components: [
				{name: 'plot', content: '', classes: 'movie-info-plot'}
			]}
		],
		path: '',
		movieName: '',
		nfoName: '',
		title: null,
		plot: '',
		year: '',
		mpaaOriginal: '',
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
			console.log('%c fanartSrc:', 'color: blue;', this.get('path'), this.get('fanartName'));
			// debugger;
			return 'http://' + this.app.get('fileServerHost') + this.get('path') + this.get('fanartName');
		},
		yearFormatted: function () {
			var year = this.get('year');
			return year ? '(' + year + ')' : '';
		},
		mpaa: function() {
			var value = this.get('mpaaOriginal') || '';
			return value.replace(/^Rated\s*/, '');
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
			{from: 'modelMovieInfo.tagline', to: 'tagline'},
			{from: 'modelMovieInfo.year', to: 'year'},
			{from: 'modelMovieInfo.mpaa', to: 'mpaaOriginal'},
			{from: 'modelMovieInfo.plot', to: 'plot'},
			{from: 'imageAlignRight', to: '$.image.imageAlignRight'},
			{from: 'plot', to: '$.plot.content'},
			{from: 'posterSrc', to: '$.poster.src'},
			{from: 'yearFormatted', to: '$.year.content'}
		],
		computed: {
			videoSrc: [{cached: true}, ['model', 'path', 'movieName']],
			posterSrc: [{cached: true}, ['model', 'path', 'posterName']],
			fanartSrc: [{cached: true}, ['model', 'path', 'fanartName']],
			yearFormatted: [{cached: true}, 'year'],
			mpaa: [{cached: true}, 'mpaaOriginal']
		},
		playPressed: function(inSender, inEvent) {
			console.log('playPressed', this.get('videoSrc'));
			this.doPlay( {videoSrc: this.get('videoSrc') } );
		}
	});

})(enyo, this);