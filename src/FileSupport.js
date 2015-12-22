// File mixin utilities
module.exports = {
	events: {
		onOpen: ''
	},
	handlers: {
		ontap: 'open'
	},
	// iconChanged: function() {
	// 	this.$.icon.set('src', '\'' + this.icon + '\'');
	// },
	// titleChanged: function() {
	// 	// console.log('Manually setting title, from changeEvent.');
	// 	this.$.title.setContent(this.title);
	// },
	// sizeChanged: function() {
	// 	this.$.size.setContent(this.size);
	// },
	// lastModifiedChanged: function() {
	// 	this.$.lastModified.setContent(this.lastModified);
	// },
	open: function(sender, ev) {
		this.doOpen({file: this.model});
	}
};
