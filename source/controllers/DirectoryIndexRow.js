enyo.kind({
	name: "B.DirectoryIndexRow",
	kind: "moon.Item",
	// kind: "FittableColumns",
	// mixins: ["FittableColumns"],
	classes: "directory-index-row",
	published: {
		href: "",
		icon: "",
		title: "",
		size: "",
		date: ""
	},
	handlers: {
		ontap: "goToHref"
		// ontap: "fetch"
	},
	// layoutKind: "FittableColumnsLayout",
	components: [
		{kind: "FittableColumns", components: [
			{kind: "moon.Icon", name: "icon", classes: "row-icon"},
			{name: "title", classes: "row-title", fit: true,  mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"]},
			{name: "size", classes: "row-size text", mixins: ["moon.MarqueeItem"]},
			{name: "date", classes: "row-date text", mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"]}
		]},
	],
    create: function() {
        this.inherited(arguments);
        // this.hrefChanged();
        this.iconChanged();
        this.titleChanged();
        this.sizeChanged();
        this.dateChanged();
    },
	// hrefChanged: function() {
	// 	this.$.icon.set("src", this.icon);
	// },
	iconChanged: function() {
		this.$.icon.set("src", this.icon);
	},
	titleChanged: function() {
		this.$.title.setContent(this.title);
	},
	sizeChanged: function() {
		this.$.size.setContent(this.size);
	},
	dateChanged: function() {
		this.$.date.setContent(this.date);
	},
	goToHref: function() {
		this.app.goToHref(this.href);
	},
	fetch: function() {
		/// Yes, this is stupid, but how else can I call the parent FROM the parent?
		// console.log("Running ignorant local fetch.", this.container);
		console.dir(this.container);
		// this.container.$.fetch();
	}
});
