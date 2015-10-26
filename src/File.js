enyo.kind({
	name: "B.File",
	kind: "moon.Item",
	// kind: "FittableColumns",
	// mixins: ["FittableColumns"],
	classes: "directory-index-row",
	published: {
		path: "",
		isDir: false,
		icon: "",
		title: "",
		size: "",
		ext: "",
		hasIndex: false,
		hasMedia: false,
		lastModified: new Date()
	},
	events: {
		onOpen: ""
	},
	handlers: {
		ontap: "open"
		// ontap: "fetch"
	},
	// layoutKind: "FittableColumnsLayout",
	components: [
		{kind: "FittableColumns", components: [
			{kind: "moon.Icon", name: "icon", classes: "row-icon moon-1h", small: true},
			{kind: "moon.MarqueeText", name: "title", classes: "row-title", fit: true},
			{kind: "moon.MarqueeText", name: "size", classes: "row-size text moon-3h"},
			{kind: "moon.MarqueeText", name: "lastModified", classes: "row-date-mod text moon-5h"}
		]}
	],
	iconChanged: function() {
		this.$.icon.set("src", "'" + this.icon + "'");
	},
	titleChanged: function() {
		// console.log("Manually setting title, from changeEvent.");
		this.$.title.setContent(this.title);
	},
	sizeChanged: function() {
		this.$.size.setContent(this.size);
	},
	lastModifiedChanged: function() {
		this.$.lastModified.setContent(this.lastModified);
	},
	open: function(inSender, inEvent) {
		this.doOpen({file: this});
	}
});
