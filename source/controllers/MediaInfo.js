/**
	_moon.ChannelInfo_ is a control that displays channel information.  It is
	designed to be used within the _infoComponents_ block of a
	[moon.VideoPlayer](#moon.VideoPlayer).

	Example:

		{
			kind: "moon.ChannelInfo",
			no: 36,
			name: "AMC",
			components: [
				{content: "3D"},
				{content: "Live"},					
				{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
			]
		}
*/
enyo.kind({
	name: "B.MediaInfo",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-channelinfo media-info",
	mixins: ["moon.MarqueeSupport"],
	marqueeOnSpotlight: false,
	marqueeOnHover: true,
	//* @public
	published: {
		//* The channel number
		posterSrc: "",
		//* The name of the channel
		channelName: ""
	},
	//* @protected
	defaultKind: "B.MediaInfoBadge",
	components: [
		{name: "playerPoster", kind: "moon.Image", src: "", classes: "media-info-player-poster"},
		{kind: "enyo.Control", name: "client", classes: "moon-video-player-channel-info-badges"}
	],
	bindings: [
		{from: ".posterSrc",		to: ".$.playerPoster.src"}
	],
	addBadge: function(inControl) {
		if (! enyo.isArray(inControl)) {
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

//* @public

/**
    _moon.ChannelInfoBadge_ is a simple kind used to display a badge
    containing channel info. It is the default kind for components added to
    [moon.ChannelInfo](#moon.ChannelInfo).
*/
enyo.kind({
	name: "B.MediaInfoBadge",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-video-badge-text moon-video-player-info-icon"
});
