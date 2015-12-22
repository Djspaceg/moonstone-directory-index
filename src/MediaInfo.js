var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	// Control = require('enyo/Control'),
	Img = require('enyo/Image');

var
	ChannelInfo = require('moonstone-extra/ChannelInfo');
	// Marquee = require('moonstone/Marquee'),
	// MarqueeSupport = Marquee.Support,
	// MarqueeItem = Marquee.Item;

//* @public

/**
    _moon.ChannelInfoBadge_ is a simple kind used to display a badge
    containing channel info. It is the default kind for components added to
    [moon.ChannelInfo](#moon.ChannelInfo).
*/
// var MediaInfoBadge = kind({
// 	name: 'B.MediaInfoBadge',
// 	kind: Control,
// 	//* @protected
// 	classes: 'moon-video-badge-text moon-video-player-info-icon'
// });

/**
	_moon.ChannelInfo_ is a control that displays channel information.  It is
	designed to be used within the _infoComponents_ block of a
	[moon.VideoPlayer](#moon.VideoPlayer).

	Example:

		{
			kind: 'moon.ChannelInfo',
			no: 36,
			name: 'AMC',
			components: [
				{content: '3D'},
				{content: 'Live'},
				{content: 'REC 08:22', classes: 'moon-video-player-info-redicon'}
			]
		}
*/
module.exports = kind({
	name: 'B.MediaInfo',
	kind: ChannelInfo,
	//* @protected
	classes: 'media-info',
	// mixins: [MarqueeSupport],
	// marqueeOnSpotlight: false,
	// marqueeOnHover: true,
	//* @public
	published: {
		//* The channel number
		posterSrc: ''
		//* The name of the channel
		// channelName: ''
	},
	//* @protected
	// defaultKind: MediaInfoBadge,
	mediaTools: [
		{name: 'playerPoster', kind: Img, src: '', classes: 'media-info-player-poster'}
		// {name: 'client', classes: 'moon-video-player-channel-info-badges'}
	],
	bindings: [
		{from: 'posterSrc',		to: '$.playerPoster.src'}
	],
	initComponents: function () {
		this.createComponents(this.mediaTools, {isChrome: true});
		ChannelInfo.prototype.initComponents.apply(this, arguments);
	},
	addBadge: function(inControl) {
		if (!util.isArray(inControl)) {
			inControl = [ inControl ];
		}
		this.createComponents( inControl );
		this.render();
		// this.$.client.createComponents( inControl );
		// this.$.client.render();
	},
	clearBadges: function() {
		this.destroyClientControls();
		this.render();
		// this.$.client.destroyComponents();
		// this.$.client.render();
	}
});
